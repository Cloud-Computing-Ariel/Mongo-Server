import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AppController } from './app.controller';
import { AppService } from './app.service';
//import { KafkaModule } from './kafka/kafka.module';
// import { MongoConsumer } from './mongo.consumer';
import { OrderSchema } from './orders/order.model';
// import { KafkaModule } from './kafka/kafka.module';
// import { MongoConsumer } from './kafka/mongo.consumer';

@Module({
  imports: [
    //KafkaModule,
    MongooseModule.forFeature([{ name: 'tests', schema: OrderSchema }]),
    MongooseModule.forRoot(
      "mongodb+srv://username1:username1_pass@pizza-simulator.kpeolsc.mongodb.net/pizza-orders-DB?retryWrites=true&w=majority")
    ],
  controllers: [AppController],
  providers: [
    AppService, 
    // MongoConsumer
  ],
})
export class AppModule {}
