const db = require("../config/db");

class Deduction {
  constructor(id = null, employee_id, amount, reason, deduction_date) {
    this.id = id;
    this.employee_id = employee_id;
    this.amount = amount;
    this.reason = reason;
    this.deduction_date = deduction_date;
  }

  async getAll() {
    const [rows] = await db.execute(`SELECT * FROM deductions`);
    return rows;
  }

  async getById() {
    const [rows] = await db.execute(`SELECT * FROM deductions WHERE id = ?`, [
      this.id,
    ]);
    return rows[0];
  }

  async create() {
    const sql = `
      INSERT INTO deductions (employee_id, amount, reason, deduction_date)
      VALUES (?, ?, ?, ?)
    `;
    const values = [
      this.employee_id,
      this.amount,
      this.reason || null,
      this.deduction_date,
    ];

    for (const value of values) {
      if (value === undefined) {
        throw new Error("All required fields must be provided");
      }
    }
    const [result] = await db.execute(sql, values);
    return result;
  }

  async update() {
    const fields = {
      employee_id: this.employee_id,
      amount: this.amount,
      reason: this.reason,
      deduction_date: this.deduction_date,
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

    const [result] = await db.execute(
      `UPDATE deductions SET ${keys.join(", ")} WHERE id = ?`,
      values
    );
    return result;
  }

  async delete() {
    const [result] = await db.execute(`DELETE FROM deductions WHERE id = ?`, [
      this.id,
    ]);
    return result;
  }
}

module.exports = Deduction;
