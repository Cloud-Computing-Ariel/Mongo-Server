import { Controller, Get, Query, Post, Body, Param, Patch} from '@nestjs/common';
import { OrdersService } from './orders.service';

@Controller('order')
export class OrderController {

  constructor(private readonly orderService: OrdersService) {};

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
      return await this.orderService.getOrderBetween(
        new Date(start),
        new Date(end));
    }
    // example for query: http://localhost:3000/order?start=2020-03-30&end=2020-03-30
}
