const db = require("../config/db");

class User {
  constructor({ id = null, employee_id, work_email, password, role }) {
    this.id = id;
    this.employee_id = employee_id;
    this.work_email = work_email;
    this.password = password;
    this.role = role;
  }

  async getAll() {
    const sql = `SELECT * FROM users`;
    const [rows] = await db.execute(sql);
    return rows;
  }

  async getById() {
    const sql = `SELECT * FROM users WHERE id = ?`;
    const [rows] = await db.execute(sql, [this.id]);
    return rows[0];
  }

  async checkEmail() {
    const [existingEmployee] = await db.execute(
      "SELECT * FROM users WHERE work_email = ?",
      [this.work_email]
    );
    return existingEmployee.length;
  }

  async create() {
    if (!this.employee_id || !this.work_email || !this.password) {
      throw new Error("Required fields: employee_id, work_email, and password");
    }

    const sql = `
      INSERT INTO users (employee_id, work_email, password, role)
      VALUES (?, ?, ?, ?)
    `;
    const values = [
      this.employee_id,
      this.work_email,
      this.password,
      this.role || "employee",
    ];

    const [result] = await db.execute(sql, values);
    return result;
  }

  async update() {
    const fields = {
      employee_id: this.employee_id,
      work_email: this.work_email,
      password: this.password,
      role: this.role,
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

    const sql = `UPDATE users SET ${keys.join(", ")} WHERE id = ?`;
    const [result] = await db.execute(sql, values);
    return result;
  }

  async getByEmail() {
    const sql = `SELECT * FROM users WHERE work_email = ?`;
    const [rows] = await db.execute(sql, [this.work_email]);
    return rows[0];
  }

  async updatePasswordAndFlag() {
    const sql = `UPDATE users SET password = ?, first_login = false WHERE id = ?`;
    const [result] = await db.execute(sql, [this.password, this.id]);
    return result;
  }

  async delete() {
    const sql = `DELETE FROM users WHERE id = ?`;
    const [result] = await db.execute(sql, [this.id]);
    return result;
  }

  static async getUserFullName(userId) {
    const sql = `
        SELECT CONCAT(e.first_name, ' ', e.last_name) AS full_name
        FROM users u
        JOIN employees e ON u.employee_id = e.id
        WHERE u.id = ?
      `;
    const [rows] = await db.execute(sql, [userId]);
    return rows[0] ? rows[0].full_name : null;
  }
}

module.exports = User;
