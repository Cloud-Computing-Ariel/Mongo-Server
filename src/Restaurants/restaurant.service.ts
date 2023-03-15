import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Restaurant } from './restaurant.model';

@Injectable()
export class RestaurantService {
  constructor(
    @InjectModel('Restaurant') 
    private readonly restaurantModel: Model<Restaurant>) {};

  async insertRestaurant(_id: number, city: string, region: string, status: string){
    try{
      // the id is unique - not possible to create two restaurant with the same id
      await this.findRestaurant(_id);
      return { message: "The restaurant already exist" };
    }
    catch (error){
      const newRest = new this.restaurantModel({ 
        _id, city, region, status
      });
      const result = await newRest.save();
      console.log(result);
      return newRest;
    }
  }

  async getRestaurant(){
    const result = await this.restaurantModel.find().exec();
    console.log(result);
    return result;
  }

  async getSingleRestaurant(id: number){
    const result = await this.findRestaurant(id);
    console.log(result);
    return [result];
  }

  async updateRestaurant(_id: number, status: string){
    // it do not possible to update city or region
    // the id is unique
    const currRest = await this.findRestaurant(_id);
    if (status){
      currRest.status = status;
    }
    const result = await currRest.save();
    console.log(result);
    return currRest;
  }

  private async findRestaurant(id: number): Promise<Restaurant>{
    let restaurant;
    try{
      restaurant = await this.restaurantModel.findById(id);
    } catch (error) {
      throw new NotFoundException("Could not find restaurant");
    }
    console.log(restaurant);
    if(!restaurant){
      throw new NotFoundException("Could not find restaurant");
    }
    return restaurant;
  }
}
