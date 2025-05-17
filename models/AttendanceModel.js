const db = require("../config/db");

class Attendance {
  constructor(id = null, employee_id, shifts_id, date, check_in, check_out) {
    this.id = id;
    this.employee_id = employee_id;
    this.shifts_id = shifts_id;
    this.date = date;
    this.check_in = check_in;
    this.check_out = check_out;
  }

  async getAll() {
    const sql = `SELECT * FROM attendances`;
    const [rows] = await db.execute(sql);
    return rows;
  }

  async getById() {
    const sql = `SELECT * FROM attendances WHERE id = ?`;
    const [rows] = await db.execute(sql, [this.id]);
    return rows[0];
  }

  async create() {
    const sql = `
      INSERT INTO attendances (employee_id, shifts_id, date, check_in, check_out)
      VALUES (?, ?, ?, ?, ?)
    `;

    for (const value of [this.employee_id, this.date]) {
      if (value === undefined) {
        throw new Error("All required fields must be provided");
      }
    }

    const values = [
      this.employee_id,
      this.shifts_id,
      this.date,
      this.check_in || null,
      this.check_out || null,
    ];

    const [result] = await db.execute(sql, values);
    return result;
  }

  async update() {
    const fields = {
      employee_id: this.employee_id,
      shifts_id: this.shifts_id,
      date: this.date,
      check_in: this.check_in === "" ? undefined : this.check_in,
      check_out: this.check_out === "" ? undefined : this.check_out,
    };

    const keys = [];
    const values = [];

    for (const [key, value] of Object.entries(fields)) {
      if (value !== undefined) {
        keys.push(`${key} = ?`);
        values.push(value);
      }
    }

    if (keys.length === 0) {
      throw new Error("At least one field must be provided for update");
    }

    values.push(this.id);

    const sql = `UPDATE attendances SET ${keys.join(", ")} WHERE id = ?`;
    const [result] = await db.execute(sql, values);
    return result;
  }

  async delete() {
    const sql = `DELETE FROM attendances WHERE id = ?`;
    const [result] = await db.execute(sql, [this.id]);
    return result;
  }
}

module.exports = Attendance;
