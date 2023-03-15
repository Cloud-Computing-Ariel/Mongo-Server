// import { Injectable } from '@nestjs/common';
// import { InjectModel } from '@nestjs/mongoose';
// import { Model } from 'mongoose';
// import { Order } from './order.model';

// @Injectable()
// export class OrdersService {
//   private orders: Order[] = [];

//   constructor(
//     @InjectModel('Order') 
//     private readonly orderModel: Model<Order >) {};


//   insertOrder(order: Order){
//     const newOrder = new this.orderModel({ order: order })
//   }

//   getHello(): string {
//     return 'Hello World!';
//   }
// }
