const db = require("../config/db");

class LateEntry {
  constructor(
    id = null,
    employee_id,
    date,
    minutes_late,
    reason,
    excuse,
    created_by,
    updated_by
  ) {
    this.id = id;
    this.employee_id = employee_id;
    this.date = date;
    this.minutes_late = minutes_late;
    this.reason = reason;
    this.excuse = excuse;
    this.created_by = created_by;
    this.updated_by = updated_by;
  }

  async getAll() {
    const sql = `SELECT * FROM late_entries`;
    const [rows] = await db.execute(sql);
    return rows;
  }

  async getById() {
    const sql = `SELECT * FROM late_entries WHERE id = ?`;
    const [rows] = await db.execute(sql, [this.id]);
    return rows[0];
  }

  async create() {
    for (const value of [
      this.employee_id,
      this.date,
      this.minutes_late,
      this.created_by,
    ]) {
      if (value === undefined) {
        throw new Error("All required fields must be provided");
      }
    }

    const sql = `
      INSERT INTO late_entries (
        employee_id, date, minutes_late, reason, excuse, created_by
      )
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    const values = [
      this.employee_id,
      this.date,
      this.minutes_late,
      this.reason || null,
      this.excuse || "rejected",
      this.created_by,
    ];

    const [result] = await db.execute(sql, values);
    return result;
  }

  async update() {
    const fields = {
      employee_id: this.employee_id,
      date: this.date,
      minutes_late: this.minutes_late,
      reason: this.reason,
      excuse: this.excuse,
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

    const sql = `UPDATE late_entries SET ${keys.join(", ")} WHERE id = ?`;
    const [result] = await db.execute(sql, values);
    return result;
  }

  async delete() {
    const sql = `DELETE FROM late_entries WHERE id = ?`;
    const [result] = await db.execute(sql, [this.id]);
    return result;
  }

  static async getUnlinkedLateEntries(employeeId) {
    const [rows] = await db.execute(
      `SELECT id FROM late_entries
     WHERE employee_id = ?
       AND excuse = 'rejected'
       AND violation_linked = FALSE
       AND date >= CURDATE() - INTERVAL 30 DAY
     ORDER BY date ASC
     LIMIT 2`,
      [employeeId]
    );
    return rows;
  }

  static async markAsLinked(lateEntryIds) {
    if (lateEntryIds.length === 0) return;
    const placeholders = lateEntryIds.map(() => "?").join(",");
    await db.execute(
      `UPDATE late_entries SET violation_linked = TRUE WHERE id IN (${placeholders})`,
      lateEntryIds
    );
  }
}

module.exports = LateEntry;
