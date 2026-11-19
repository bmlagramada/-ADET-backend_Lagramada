import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { RoomService } from './room.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('room')
export class RoomController {
  constructor(private roomService: RoomService) {}

  // Get all rooms (protected)
  @UseGuards(JwtAuthGuard)
  @Get()
  async getAll() {
    return this.roomService.getAll();
  }

  // Get single room by id (protected)
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getOne(@Param('id') id: string) {
    return this.roomService.findById(+id);
  }

  // Create room (open - for demo)
  @Post()
  async create(@Body() body: { room_code: string, room_status: string, id: number }) {
    return this.roomService.createRoom(body.room_code, body.room_status, body.id);
  }

  // Update room (protected)
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(@Param('id') id: string, @Body() body: any) {
    return this.roomService.updateRoom(+id, body);
  }

  // Delete room (protected)
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.roomService.deleteRoom(+id);
  }
}
