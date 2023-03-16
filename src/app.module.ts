import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RestaurantModule } from './Restaurants/restaurants.module'
import { OrdersModule } from './orders/orders.module'

@Module({
  imports: [
    OrdersModule,
    RestaurantModule,
    MongooseModule.forRoot(
      "mongodb+srv://username1:username1_pass@pizza-simulator.kpeolsc.mongodb.net/pizza-orders-DB?retryWrites=true&w=majority")
    ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
