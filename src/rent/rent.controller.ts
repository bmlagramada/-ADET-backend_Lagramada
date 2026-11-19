import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { RentService } from './rent.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('rent')
export class RentController {
  constructor(private rentalService: RentService) {}

  // Get all rentals (protected)
  @UseGuards(JwtAuthGuard)
  @Get()
  async getAll() {
    return this.rentalService.getAll();
  }

  // Get single rental by id (protected)
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getOne(@Param('id') id: string) {
    return this.rentalService.findById(+id);
  }

  // Create rental (open - for demo)
  @Post()
  async create(@Body() body: { room_id: string, rate: number, id: number }) {
    return this.rentalService.createRental(body.room_id, body.rate, body.id);
  }

  // Update rental (protected)
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(@Param('id') id: string, @Body() body: any) {
    return this.rentalService.updateRental(+id, body);
  }

  // Delete rental (protected)
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.rentalService.deleteRental(+id);
  }
}
