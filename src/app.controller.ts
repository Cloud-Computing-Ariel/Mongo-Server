import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly orderService: AppService) {};
  
  getHello(): any {
    throw new Error('Method not implemented.');
  }

  @Post()
  async addOrder(
    @Body('restruantID') restruantID: number,
    @Body('orderID') orderID: number,
    @Body('toppings') toppings: string[],
    @Body('date') date: string,
    @Body('status') status: string,
  ) {
    const newOrderId = await this.orderService.insertOrder(
      restruantID, 
      orderID, 
      toppings,
      new Date(date),
      status
    );
    return newOrderId;
  }

  @Get()
  async getOrders(
    @Query('start') start: string,
    @Query('end') end: string)
    {
      const orders = await this.orderService.getOrderBetween(
        new Date(start),
        new Date(end));
      return { orders }
    }
    // example for query: http://localhost:3000/order?start=2020-03-30&end=2020-03-30
    
  @Get('exportOrders')
  async exportOrders(
    @Query('start') start: string,
    @Query('end') end: string
    ) {
    const orders = await this.orderService.getOrderBetween(
        new Date(start),
        new Date(end));
        // add export logic
        // return a message that said export successfully
    return { orders }
  }
}
  // example for query: http://localhost:3000/exportOrders?start=2020-03-30&end=2020-03-30
      