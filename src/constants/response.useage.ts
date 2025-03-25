// import { Controller, Get, Post, Body, Res, HttpStatus } from '@nestjs/common';

// @Controller('example')
// export class ExampleController {
//   constructor(private readonly responseService: ResponseService) {}

//   @Get('success')
//   getSuccess() {
//     const data = { id: 1, name: 'John Doe' };
//     return this.responseService.successResponse(data, 'User retrieved successfully');
//   }

//   @Post('create')
//   createUser(@Body() userData) {
//     if (!userData.email) {
//       return this.responseService.errorResponse('Email is required', HttpStatus.BAD_REQUEST);
//     }

//     const createdUser = { id: 2, ...userData };
//     return this.responseService.successResponse(createdUser, 'User created successfully');
//   }
// }
