import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Order } from './Orders/order.model';
import { Model } from 'mongoose';

@Injectable()
export class AppService {
  constructor(
    @InjectModel('newOrders') 
    private readonly orderModel: Model<Order>) {};

  async insertOrder(
    restruantID: number,
    orderID: number,
    toppings: string[],
    date: Date,
    status: string
    ) { try {
        // the combination of restruantID & orderID is unique
        await this.findOrder(restruantID, orderID);
        return { message: `The order with: restruantID=${restruantID}, orderID=${orderID} already exist` };
    }
    catch (error){
        const newRest = new this.orderModel({ 
            restruantID, 
            orderID,
            toppings,
            date,
            status
        });
        const result = await newRest.save();
        console.log(result);
        return newRest;
    }
  }

  async insertNewOrder(order: Order){
    return await this.insertOrder(
      order.restruantID,
      order.orderID,
      order.toppings,
      order.date,
      order.status
    );
  }

  async updateOrderStatus(
    restruantID: number, orderID: number, status: string) {
      try {
        if (status == 'closed') {
          const updatedOrder = await this.findOrder(restruantID, orderID);
          updatedOrder.status = status;
          updatedOrder.save();
          return updatedOrder;
        }
        else {
          return { message: "Can only close order" };
        }
    }
    catch (error){
      return { message: `Can't find rest restruantID: ${restruantID}, orderID: ${orderID}`};
    }
  }

  async getOrderBetween(start: Date, end: Date){
    const result = await this.orderModel.find({
        date: {
            $gte: start, 
            $lte: end,
        }
    })
    let year = start.getFullYear();
    let month = start.getMonth() + 1; // 3 (months are zero-indexed, so add 1)
    let day = start.getDate();
    const startString = `${year}/${month}/${day}`;

    year = end.getFullYear();
    month = end.getMonth() + 1; // 3 (months are zero-indexed, so add 1)
    day = end.getDate();
    const endString = `${year}/${month}/${day}`;

    console.log('Get orders between:', startString, ' to ', endString );
    console.log(result);
    return result; // { start: start, end: end };
  }

  private async findOrder(restruantID: number, orderID: number): Promise<Order>{
    let order;
    try{
        order = await this.orderModel.find({
        restruantID: restruantID, 
        orderID: orderID,
    })
    } catch (error) {
      throw new NotFoundException("Error during find order");
    }
    if(order.length === 0){
      throw new NotFoundException(`Could not find order: restruantID = ${restruantID} & orderID = ${orderID}`);
    }
    return order[0];
  }
}
