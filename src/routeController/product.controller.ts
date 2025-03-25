// import { Controller } from '@nestjs/common';
// import { MessagePattern, Payload } from '@nestjs/microservices';

// @Controller()
// export class ProductController {
// //   constructor(private readonly authenticationService: AuthenticationService) {}

// //   @MessagePattern('createAuthentication')
// //   create(@Payload() createAuthenticationDto: CreateAuthenticationDto) {
// //     return this.authenticationService.create(createAuthenticationDto);
// //   }

// //   @MessagePattern('findAllAuthentication')
// //   findAll() {
// //     return this.authenticationService.findAll();
// //   }

// //   @MessagePattern('findOneAuthentication')
// //   findOne(@Payload() id: number) {
// //     return this.authenticationService.findOne(id);
// //   }

// //   @MessagePattern('updateAuthentication')
// //   update(@Payload() updateAuthenticationDto: UpdateAuthenticationDto) {
// //     return this.authenticationService.update(updateAuthenticationDto.id, updateAuthenticationDto);
// //   }

// //   @MessagePattern('removeAuthentication')
// //   remove(@Payload() id: number) {
// //     return this.authenticationService.remove(id);
// //   }
// }
import { Controller, Get, Param, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Controller('products')
export class ProductsController {
  constructor(@Inject('PRODUCT_SERVICE') private readonly productClient: ClientProxy) {}

  @Get(':id')
  async getProduct(@Param('id') id: string) {
    return "firstValueFrom(this.productClient.send('get_product', id))";
  }
}
