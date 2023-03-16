import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConsumerService } from './kafka/consumer.service';
import { OrdersService } from './Orders/orders.service';
import { Order } from './Orders/order.model';

import * as mongoose from 'mongoose';
const OrderModel = mongoose.model<Order>('newOrder', new mongoose.Schema<Order>({}));

@Injectable()
export class MongoConsumer implements OnModuleInit {
  constructor(
    private readonly consumerService: ConsumerService,
    private orderService: OrdersService,
  ) {}

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
            //const myBoolean:boolean =!!myArray[3]
              
              const newOrder = new OrderModel({
                restaurantID: 123, // myArray[0].toString(),
                orderID: 456, // myArray[1].toString(),
                toppings: ['cheese', 'pepperoni'],
                date: new Date('03/03/2030'),
                status: 'in progress', // myArray[2].toString(),
              });

            this.orderService.insertOneOrder(newOrder);
          } else if (topic == 'new-order') { // TODO
            // const temp = message.value.toString();
            // const myObject = JSON.parse(temp);
            // const myArray = Object.values(myObject);
            // this.kafka_msg_Neworder = {
            //   pizzeria_id: myArray[0].toString(),
            //   name: myArray[1].toString(),
            //   region: myArray[2].toString(),
            //   order: myArray[3],
            // };
            // // OrdersService.insertOrder(new Order());
            // this.InsertData(this.kafka_msg_Neworder);
          }
        },
      },
    );
  }
}
