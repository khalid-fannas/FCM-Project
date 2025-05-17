const db = require("../config/db");

class Salary {
  constructor(
    id = null,
    employee_id,
    base_salary,
    total_bonuses,
    total_deductions,
    payment_date
  ) {
    this.id = id;
    this.employee_id = employee_id;
    this.base_salary = base_salary;
    this.total_bonuses = total_bonuses;
    this.total_deductions = total_deductions;
    this.payment_date = payment_date;
  }

  async getAll() {
    const sql = `SELECT * FROM salaries`;
    const [rows] = await db.execute(sql);
    return rows;
  }

  async getById() {
    const sql = `
      SELECT * FROM salaries
      WHERE id = ?
    `;
    const [rows] = await db.execute(sql, [this.id]);
    return rows[0];
  }

  async create() {
    const sql = `
      INSERT INTO salaries 
      (employee_id, base_salary, total_bonuses, total_deductions, payment_date)
      VALUES (?, ?, ?, ?, ?)
    `;
    const values = [
      this.employee_id,
      this.base_salary,
      this.total_bonuses,
      this.total_deductions,
      this.payment_date,
    ];

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
      base_salary: this.base_salary,
      total_bonuses: this.total_bonuses,
      total_deductions: this.total_deductions,
      payment_date: this.payment_date,
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
      UPDATE salaries
      SET ${keys.join(", ")}
      WHERE id = ?
    `;
    values.push(this.id);

    const [result] = await db.execute(sql, values);
    return result;
  }

  async delete() {
    const sql = `
      DELETE FROM salaries
      WHERE id = ?
    `;
    const [result] = await db.execute(sql, [this.id]);
    return result;
  }
}

module.exports = Salary;
