import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { IncomingHttpHeaders } from 'http';
import { Reflector } from '@nestjs/core';
import {Response,Request} from "express"


@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private jwtService: JwtService,private reflector: Reflector) {}


    async canActivate(context: ExecutionContext): Promise<boolean> {
        const isPublic = this.reflector.get<boolean>('isPublic', context.getHandler());
    if (isPublic) {
      return true; // Allow access to public routes
    }
        const request = context.switchToHttp().getRequest();
    
        


        const token = this.extractTokenFromHeader(request.headers);
        if (!token) {
            throw new UnauthorizedException();
        }

        try {
            const payload = await this.jwtService.verifyAsync(token, {
                secret: process.env.JWT_SECRET
            });
            request['user'] = payload;
        } catch {
            throw new UnauthorizedException('Token expired or invalid');
        }
        return true;
    }

    private extractTokenFromHeader(headers: IncomingHttpHeaders): string | undefined {

        const authorization = headers['authorization'];
        if (typeof authorization === 'string') {
            const [type, token] = authorization.split(' ');
            return type === 'Bearer' ? token : undefined;
        }
        return undefined;
    }

    private extractTokenFromCookie(cookies: Record<string,string>): string | undefined{
        return cookies['access_token'];
    }
}