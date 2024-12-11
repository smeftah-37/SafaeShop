import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcryptjs';
import { Response } from 'express';

@Injectable()
export class AuthService {

    constructor(
        private jwtService: JwtService, 
        private userService: UserService
    ) {}

    async signIn(email: string, pass: string) {
        console.log('im heeree and thtis is the email and the pass',email,pass)
        const user = await this.userService.findOneByEmail(email);
        if (!user) {
          throw new UnauthorizedException('User not found');
        }
      
        const isPasswordValid = await bcrypt.compare(pass, user.password);
        if (!isPasswordValid) {
          throw new UnauthorizedException('Invalid credentials');
        }
      
        const tokens = await this.getTokens(user.id, user.email);
        const hashedRefreshToken = await this.hashToken(tokens.refreshToken);
        await this.userService.updateRefreshToken(user.id, hashedRefreshToken);
      
        // Just return the data
        return { user, accessToken: tokens.accessToken,refreshToken : tokens.refreshToken};
      }
      
      

    async refreshTokens(userId: number, refreshToken: string) {
        const user = await this.userService.findOneById(userId);
        if (!user || !(await this.verifyRefreshToken(refreshToken, user.refreshToken))) {
            throw new UnauthorizedException('Invalid refresh token');
        }
        const tokens = await this.getTokens(user.id, user.email);

        // Update the stored refresh token
        const hashedRefreshToken = await this.hashToken(tokens.refreshToken);
        await this.userService.updateRefreshToken(user.id, hashedRefreshToken);

        return tokens;
    }

    async getTokens(userId: number, email: string) {
        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync(
                { sub: userId, email },
                { secret: process.env.ACCESS_TOKEN_SECRET, expiresIn: '15m' },
            ),
            this.jwtService.signAsync(
                { sub: userId, email },
                { secret: process.env.REFRESH_TOKEN_SECRET, expiresIn: '7d' },
            ),
        ]);
        return { accessToken, refreshToken };
    }

    private async hashToken(token: string): Promise<string> {
        return bcrypt.hash(token, 10);
    }

    private async verifyRefreshToken(token: string, hashedToken: string): Promise<boolean> {
        return bcrypt.compare(token, hashedToken);
    }
}
