import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConsumerService } from './kafka/consumer.service';
import { OrdersService } from './Orders/orders.service';
import { Order } from './Orders/order.model';


import * as mongoose from 'mongoose';
import { AppService } from './app.service';
import { Console } from 'console';
const OrderModel = mongoose.model<Order>('newOrders', new mongoose.Schema<Order>({}));

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
            const temp = message.value.toString();
            const myObject = JSON.parse(temp);
            const myArray = Object.values(myObject);

            const restID = Number.parseInt(myArray[0].toString());
            const orderID = Number.parseInt(myArray[1].toString());
            const status = myArray[2].toString();
            console.log(restID)
            console.log(orderID)
            console.log(status)

            this.orderService.updateOrderStatus(restID, orderID, status);
          } else if (topic == 'new-order') {
            

            const temp = message.value.toString();
            const myObject = JSON.parse(temp);
            const myArray = Object.values(myObject);
            const extractOrder = Object.values(myArray[3]);
            //console.log(extractOrder)
          



             this.newOrder=
            {
              restruantID: Number.parseInt(myArray[0].toString()),
                orderID: Number.parseInt(extractOrder[0].toString()),
                status: extractOrder[1].toString(),
                date: new Date(),
                toppings: extractOrder[3].toString(),
              }; 


           
              
            this.orderService.insertOrder(this.newOrder.restruantID,this.newOrder.orderID,this.newOrder.toppings,this.newOrder.date,this.newOrder.status);
          }
        },
      },
    );
  }
}
