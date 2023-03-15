import { Controller, Get, Post, Body, Param, Patch} from '@nestjs/common';
import { RestaurantService} from './restaurant.service';

@Controller('restaurant')
export class RestaurantController {
  constructor(private readonly restaurantService: RestaurantService) {};

  @Post()
  async addRestaurant(
    @Body('id') id: number,
    @Body('city') city: string,
    @Body('region') region: string,
    @Body('status') status: string
  ) {
    const newRestId = await this.restaurantService.insertRestaurant(
        id, 
        city, 
        region,
        status
    );
    return { restaurant : newRestId } 
  }

  @Get()
  async getAllRestaurant() {
    return await this.restaurantService.getRestaurant();
  }

  @Get(':id')
  async getRestaurant(@Param('id') id: number) {
    return await this.restaurantService.getSingleRestaurant(id);
  }

  @Patch(':id')
  async updateRestaurant(
    @Param('id') id: number,
    @Body('status') status: string
  ) {
    const newRestId = await this.restaurantService.updateRestaurant(
        id, 
        status
    );
    return { restaurant : newRestId } 
  }
}
