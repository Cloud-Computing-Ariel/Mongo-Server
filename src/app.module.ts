import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RestaurantModule } from './Restaurants/restaurants.module'
import { OrdersModule } from './orders/orders.module'
import { OrderSchema } from './orders/order.model';
import { KafkaModule } from './kafka/kafka.module';
import { MongoConsumer } from './mongo.consumer';

@Module({
  imports: [
    KafkaModule,
    OrdersModule,
    RestaurantModule,
    MongooseModule.forFeature([{ name: 'newOrders', schema: OrderSchema }]),
    MongooseModule.forRoot(
      "mongodb+srv://username1:username1_pass@pizza-simulator.kpeolsc.mongodb.net/pizza-orders-DB?retryWrites=true&w=majority")
    ],
  controllers: [AppController],
  providers: [AppService,MongoConsumer],
})
export class AppModule {}
