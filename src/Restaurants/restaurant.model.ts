import * as mongoose from 'mongoose';

export const RestaurantSchema = new mongoose.Schema({
  _id: { type: Number, required: true },
  city: { type: String, required: true },
  region: { type: String, required: true },
  status: { type: String, required: true }, // statusType;
});

export interface Restaurant extends mongoose.Document {
  _id: number;
  city: string;
  region: string;
  status: string;// statusType;
}