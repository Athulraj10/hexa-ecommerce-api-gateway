import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule], // Allows using environment variables
      inject: [ConfigService], // Injects ConfigService to access env variables
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET') || 'jwtaccesscrytoncode',
        signOptions: { expiresIn: configService.get<string>('ACCESS_TOKEN_EXPIRES_IN') || '7d' },
      }),
    }),
  ],
  exports: [JwtModule], // Exports JwtModule to be used in other modules
})
export class JwtConfigModule {
  constructor(){
    console.log('JwtConfigModule loaded');
    console.log(process.env.JWT_SECRET); // Debugging log to verify the secret
  }
}
