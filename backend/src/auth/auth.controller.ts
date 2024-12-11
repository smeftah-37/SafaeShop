import { Controller, Get, Req, UseGuards, Post, Res, Body, SetMetadata } from '@nestjs/common';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { Request as ExpressRequest, Response as ExpressResponse } from 'express';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';


export const Publicdecorator = () => SetMetadata("isPublic",true);

@ApiTags('Authentication') // Group for Swagger
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  
  @Publicdecorator()
  @Post('login')
  @ApiOperation({ summary: 'Handle Login Section' })
  async login(@Body() signInDto: Record<string, string>, @Res() res: ExpressResponse) {
    const result = await this.authService.signIn(signInDto.email, signInDto.password);

  res.cookie('refreshToken', result.refreshToken, {
    httpOnly: true,
    sameSite: 'none',
    secure: true,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  // Manually send response
  return res.json({ user: result.user, accessToken: result.accessToken });
}
  @UseGuards(AuthGuard)
  @Get('user')
  getUser(@Req() req: ExpressRequest)
  {
      return req.user;
  }
  @Post('refresh-token')
  @ApiOperation({ summary: 'Refresh access token using a valid refresh token' })
  @ApiResponse({ status: 200, description: 'Returns a new access token' })
  @ApiResponse({ status: 401, description: 'Invalid or expired refresh token' })
  async refreshToken(@Req() req: ExpressRequest, @Res() res: ExpressResponse) {
    // Extract refresh token from cookies
    const refreshToken = req.cookies['refreshToken'];
    if (!refreshToken) {
      return res.status(401).json({ message: 'Refresh token not found in cookies' });
    }

    try {
      // Call the auth service to refresh tokens
      const tokens = await this.authService.refreshTokens(req.body.userId, refreshToken);

      // Update the cookie with the new refresh token
      res.cookie('refreshToken', tokens.refreshToken, {
        httpOnly: true, // Makes the cookie inaccessible to JavaScript
        sameSite: 'none', // Use 'lax' or 'strict' if not using cross-site cookies
        secure: true, 
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      return res.status(200).json({ accessToken: tokens.accessToken });
    } catch (error) {
      return res.status(401).json({ message: 'Invalid or expired refresh token' });
    }
  }
}
