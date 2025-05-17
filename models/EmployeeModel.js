const db = require("../config/db");

class Employee {
  constructor(
    id = null,
    first_name,
    last_name,
    email,
    phone_number,
    address,
    personal_picture,
    department_name,
    position_name,
    shift_id,
    hire_date,
    salary_base,
    status
  ) {
    this.id = id;
    this.first_name = first_name;
    this.last_name = last_name;
    this.email = email;
    this.phone_number = phone_number;
    this.address = address;
    this.personal_picture = personal_picture;
    this.department_name = department_name;
    this.position_name = position_name;
    this.shift_id = shift_id;
    this.hire_date = hire_date;
    this.salary_base = salary_base;
    this.status = status;
  }

  async getall() {
    const sql = ` SELECT * FROM employees`;
    const [rows] = await db.execute(sql);
    return rows;
  }
  async getById() {
    const sql = `
      SELECT * FROM employees
      WHERE id = ?
    `;
    const [rows] = await db.execute(sql, [this.id]);
    return rows[0];
  }

  async checkEmail() {
    const [existingEmployee] = await db.execute(
      "SELECT * FROM employees WHERE email = ?",
      [this.email]
    );
    return existingEmployee.length;
  }

  async create() {
    const sql = `
      INSERT INTO employees 
      (first_name, last_name, email, phone_number, address, personal_picture, department_name, position_name, shift_id, hire_date, salary_base, status) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [
      this.first_name,
      this.last_name,
      this.email,
      this.phone_number,
      this.address,
      this.personal_picture,
      this.department_name,
      this.position_name,
      this.shift_id,
      this.hire_date,
      this.salary_base,
      this.status === undefined ? (this.status = "active") : this.status,
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
      first_name: this.first_name,
      last_name: this.last_name,
      email: this.email,
      phone_number: this.phone_number,
      address: this.address,
      personal_picture: this.personal_picture,
      department_name: this.department_name,
      position_name: this.position_name,
      shift_id: this.shift_id,
      hire_date: this.hire_date,
      salary_base: this.salary_base,
      status: this.status,
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
      UPDATE employees
      SET ${keys.join(", ")}
      WHERE id = ?
    `;
    values.push(this.id);

    const [result] = await db.execute(sql, values);
    return result;
  }
  async delete() {
    const sql = `
      DELETE FROM employees
      WHERE id = ?
    `;
    const [result] = await db.execute(sql, [this.id]);
    return result;
  }
}

module.exports = Employee;
