const db = require("../config/db");

class Shift {
  constructor(id = null, name, start_time, end_time) {
    this.id = id;
    this.name = name;
    this.start_time = start_time;
    this.end_time = end_time;
  }

  async getAll() {
    const sql = `SELECT * FROM shifts`;
    const [rows] = await db.execute(sql);
    return rows;
  }

  async getById() {
    const sql = `SELECT * FROM shifts WHERE id = ?`;
    const [rows] = await db.execute(sql, [this.id]);
    return rows[0];
  }

  async checkId() {
    const [rows] = await db.execute("SELECT * FROM shifts WHERE id = ?", [
      this.id,
    ]);
    if (rows.length === 0) {
      throw new Error(`Shift with ID ${this.id} does not exist`);
    }
    return true;
  }

  async create() {
    const sql = `
      INSERT INTO shifts (name, start_time, end_time)
      VALUES (?, ?, ?)
    `;
    const values = [this.name, this.start_time, this.end_time];
    for (const value of values) {
      if (value === undefined) {
        throw new Error("All fields are required");
      }
    }
    const [result] = await db.execute(sql, values);
    return result;
  }

  async update() {
    const updatableFields = {
      name: this.name,
      start_time: this.start_time,
      end_time: this.end_time,
    };
    const keys = [];
    const values = [];
    for (const [key, value] of Object.entries(updatableFields)) {
      if (value !== undefined) {
        keys.push(`${key} = ?`);
        values.push(value);
      }
    }

    if (keys.length === 0) {
      throw new Error("At least one field must be provided for update");
    }
    const sql = `UPDATE shifts SET ${keys.join(", ")} WHERE id = ?`;
    values.push(this.id);

    const [result] = await db.execute(sql, values);
    return result;
  }

  async delete() {
    const sql = `DELETE FROM shifts WHERE id = ?`;
    const [result] = await db.execute(sql, [this.id]);
    return result;
  }
}

module.exports = Shift;
