import * as mongoose from 'mongoose';


export const OrderSchema = new mongoose.Schema({
    restruantID: { type: Number, required: true },
    orderID: { type: Number, required: true },
    toppings: { type: [String], required: true },
    date: { type: Date, required: true },
    status: { type: String, required: true },
})

export interface Order extends mongoose.Document {
    restruantID: number,
    orderID: number,
    toppings: string []
    date: Date,
    status: string,
}