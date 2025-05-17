const db = require("../config/db");

class Bonus {
  constructor(id = null, employee_id, amount, bonus_date) {
    this.id = id;
    this.employee_id = employee_id;
    this.amount = amount;
    this.bonus_date = bonus_date;
  }

  async getAll() {
    const sql = `SELECT * FROM bonuses`;
    const [rows] = await db.execute(sql);
    return rows;
  }

  async getById() {
    const sql = `SELECT * FROM bonuses WHERE id = ?`;
    const [rows] = await db.execute(sql, [this.id]);
    return rows[0];
  }

  async create() {
    const sql = `
      INSERT INTO bonuses (employee_id, amount, bonus_date)
      VALUES (?, ?, ?)
    `;
    const values = [this.employee_id, this.amount, this.bonus_date];

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
      employee_id: this.employee_id,
      amount: this.amount,
      bonus_date: this.bonus_date,
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

    const sql = `
      UPDATE bonuses
      SET ${keys.join(", ")}
      WHERE id = ?
    `;
    values.push(this.id);

    const [result] = await db.execute(sql, values);
    return result;
  }

  async delete() {
    const sql = `DELETE FROM bonuses WHERE id = ?`;
    const [result] = await db.execute(sql, [this.id]);
    return result;
  }
}

module.exports = Bonus;
