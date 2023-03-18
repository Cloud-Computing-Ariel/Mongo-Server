import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConsumerService } from './kafka/consumer.service';
import { Order } from './Orders/order.model';
import { AppService } from './app.service';

// import { OrdersService } from './Orders/orders.service';
// import * as mongoose from 'mongoose';

// const OrderModel = mongoose.model<Order>('newOrders', new mongoose.Schema<Order>({}));

@Injectable()
export class MongoConsumer implements OnModuleInit {
  constructor(
    private readonly consumerService: ConsumerService,
    private orderService: AppService,
  ) {}

  newOrder:Partial<Order>={};

  async onModuleInit() {
    await this.consumerService.consume(
      [
        { topic: 'new-order' },
        // { topic: 'restaurant-status-change' },
        { topic: 'order-status-change' },
      ],
      {
        eachMessage: async ({ topic, message }) => {
          if (topic == 'order-status-change') {
            console.log('order status change');
            const temp = message.value.toString();
            const myObject = JSON.parse(temp);
            const allObj = Object.values(myObject);

            const restID = Number.parseInt(allObj[0].toString());
            const orderID = Number.parseInt(allObj[1].toString());
            const status = allObj[2].toString();
            this.orderService.updateOrderStatus(restID, orderID, status);
          } 
          else if (topic == 'new-order') {
            console.log('new order arrived');

            const temp = message.value.toString();
            const myObject = JSON.parse(temp);
            const allObj = Object.values(myObject);
            const orderObj = Object.values(allObj[3]);

            this.newOrder=
            {
              restruantID: Number.parseInt(allObj[0].toString()),
                orderID: Number.parseInt(orderObj[0].toString()),
                status: orderObj[1].toString(),
                date: new Date(),
                toppings: orderObj[3].toString(),
              }; 

            this.orderService.insertOrder(
              this.newOrder.restruantID,
              this.newOrder.orderID,
              this.newOrder.toppings,
              this.newOrder.date,
              this.newOrder.status);
          }
        },
      },
    );
  }
}
