const db = require("../config/db");

class Violation {
  constructor(id = null, title, description, type, created_by, updated_by) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.type = type;
    this.created_by = created_by;
    this.updated_by = updated_by;
  }

  async create() {
    const sql = `
      INSERT INTO violations (title, description, type, created_by , updated_by)
      VALUES (?, ?, ?, ? , ?)
    `;
    const values = [
      this.title,
      this.description,
      this.type,
      this.created_by,
      this.updated_by || null,
    ];

    const [result] = await db.execute(sql, values);
    return result;
  }

  async getAll() {
    const sql = `SELECT * FROM violations ORDER BY created_at DESC`;
    const [rows] = await db.execute(sql);
    return rows;
  }

  async getById() {
    const sql = `SELECT * FROM violations WHERE id = ?`;
    const [rows] = await db.execute(sql, [this.id]);
    return rows[0];
  }

  async update() {
    const fields = {
      title: this.title,
      description: this.description,
      type: this.type,
      updated_by: this.updated_by,
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

    const sql = `UPDATE violations SET ${keys.join(", ")} WHERE id = ?`;
    const [result] = await db.execute(sql, values);
    return result;
  }

  async delete() {
    const sql = `DELETE FROM violations WHERE id = ?`;
    const [result] = await db.execute(sql, [this.id]);
    return result;
  }

  static async findByTitle(title) {
    const [rows] = await db.query(
      "SELECT * FROM violations WHERE LOWER(title) = ?",
      [title]
    );
    return rows[0];
  }
}

module.exports = Violation;
