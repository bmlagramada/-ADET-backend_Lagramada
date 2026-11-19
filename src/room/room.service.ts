import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { RowDataPacket, OkPacket } from 'mysql2';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class RoomService {
  constructor(private db: DatabaseService) {}

  private pool = () => this.db.getPool();

  async createRoom (room_code: string, room_status: string, id: number){
    const [result] = await this.pool().execute<OkPacket>(
      'INSERT INTO room (room_code, room_status, id) VALUES (?, ?, ?)',
      [room_code, room_status, id],
    );
    return { id: result.insertId, room_code, room_status };
  }

  async findByroom(room_code: string) {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      'SELECT id, room_code, room_status FROM room WHERE room_code = ?',
      [room_code],
    );
    return rows[0];
  }

  async findById(id: number) {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      'SELECT id, room_code, room_status FROM room WHERE id = ?',
      [id],
    );
    return rows[0];
  }

  async getAll() {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      'SELECT id, room_code, room_status FROM room',
    );
    return rows;
  }

  async updateRoom(id: number, partial: { room_code?: string; room_status?: string }) {
    const fields: string[] = [];
    const values: any[] = [];
    if (partial.room_code) {
      fields.push('room_code = ?');
      values.push(partial.room_code);
    }
    if (partial.room_status) {
      fields.push('room_status = ?');
      values.push(partial.room_status);
    }
    if (fields.length === 0) return await this.findById(id);
    values.push(id);
    const sql = `UPDATE room SET ${fields.join(', ')} WHERE id = ?`;
    await this.pool().execute(sql, values);
    return await this.findById(id);
  }

  async deleteRoom(id: number) {
    const [res] = await this.pool().execute<OkPacket>('DELETE FROM room WHERE id = ?', [id]);
    return res.affectedRows > 0;
  }

  async setRefreshToken(id: number, refreshToken: string | null) {
    await this.pool().execute('UPDATE room SET refresh_token = ? WHERE id = ?', [refreshToken, id]);
  }

  async findByRefreshToken(refreshToken: string) {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      'SELECT id, room_code, room_status FROM room WHERE refresh_token = ?',
      [refreshToken],
    );
    return rows[0];
  }
}

