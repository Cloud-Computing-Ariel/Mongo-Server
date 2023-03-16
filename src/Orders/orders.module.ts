import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OrderSchema } from './order.model';
import {  OrdersService } from './orders.service';
import {  OrderController } from './orders.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'newOrders', schema: OrderSchema }])
  ],
  controllers: [OrderController],
  providers: [OrdersService],
})
export class OrdersModule {}
