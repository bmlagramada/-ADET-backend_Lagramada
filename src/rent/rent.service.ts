import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { RowDataPacket, OkPacket } from 'mysql2';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class RentService {
  constructor(private db: DatabaseService) {}

  private pool = () => this.db.getPool();

  async createRental(room_id: string, rate: number, id: number) {
    const [result] = await this.pool().execute<OkPacket>(
      'INSERT INTO rental (room_id, rate, id) VALUES (?, ?, ?)',
      [room_id, rate, id],
    );
    return { id: result.insertId, room_id, rate };
  }

  async findByRoomId(room_id: string) {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      'SELECT id, room_id, rate FROM rental WHERE room_id = ?',
      [room_id],
    );
    return rows[0];
  }

  async findById(id: number) {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      'SELECT id, room_id, rate FROM rental WHERE id = ?',
      [id],
    );
    return rows[0];
  }

  async getAll() {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      'SELECT id, room_id, rate FROM rental',
    );
    return rows;
  }

  async updateRental(id: number, partial: { room_id?: string; rate?: number }) {
    const fields: string[] = [];
    const values: any[] = [];
    if (partial.room_id) {
      fields.push('room_id = ?');
      values.push(partial.room_id);
    }
    if (partial.rate !== undefined) {
      fields.push('rate = ?');
      values.push(partial.rate);
    }
    if (fields.length === 0) return await this.findById(id);
    values.push(id);
    const sql = `UPDATE rental SET ${fields.join(', ')} WHERE id = ?`;
    await this.pool().execute(sql, values);
    return await this.findById(id);
  }

  async deleteRental(id: number) {
    const [res] = await this.pool().execute<OkPacket>('DELETE FROM rental WHERE id = ?', [id]);
    return res.affectedRows > 0;
  }

  async setRefreshToken(id: number, refreshToken: string | null) {
    await this.pool().execute('UPDATE rental SET refresh_token = ? WHERE id = ?', [refreshToken, id]);
  }

  async findByRefreshToken(refreshToken: string) {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      'SELECT id, room_id, rate FROM rental WHERE refresh_token = ?',
      [refreshToken],
    );
    return rows[0];
  }
}
