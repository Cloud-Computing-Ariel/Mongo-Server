import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order } from './order.model';

@Injectable()
export class OrdersService {
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
        const oldOrder = await this.findOrder(restruantID, orderID);
        if (oldOrder.status == 'open' && status == 'close') {
            oldOrder.status = status;
            oldOrder.save();
            return oldOrder;
        }
        if (oldOrder.status == 'close' && status == 'open') {
            console.log('Reopen restaurantID: ', restruantID, 'orderID: ', orderID)
            oldOrder.date = date;
            oldOrder.status = status;
            oldOrder.save();
            return oldOrder;
        }
        else {
            return { message: "The order is already closed" };
        }
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

  // TOCHECK
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
