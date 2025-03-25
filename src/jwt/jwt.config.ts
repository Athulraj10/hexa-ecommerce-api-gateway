export const jwtConfig = {
    jwtSecret: process.env.JWT_SECRET || 'default_secret',
    refreshSecret: process.env.REFRESH_SECRET || 'default_refresh_secret',
    accessTokenExpiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN || '15d',
    refreshTokenExpiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || "30d",
  };
  

//   import { ConfigService } from '@nestjs/config';

// export const jwtConfig = (configService: ConfigService) => ({
//   jwtSecret: configService.get<string>('JWT_SECRET') || 'default_secret',
//   refreshSecret: configService.get<string>('REFRESH_SECRET') || 'default_refresh_secret',
//   accessTokenExpiresIn: configService.get<string>('ACCESS_TOKEN_EXPIRES_IN') || '15d',
//   refreshTokenExpiresIn: configService.get<string>('REFRESH_TOKEN_EXPIRES_IN') || '30d',
// });