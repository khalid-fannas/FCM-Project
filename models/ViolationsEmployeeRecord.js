const db = require("../config/db");

class ViolationsEmployeeRecord {
  constructor(
    id = null,
    reported_by,
    offender_id,
    violation_id,
    reason,
    reason_type
  ) {
    this.id = id;
    this.reported_by = reported_by;
    this.offender_id = offender_id;
    this.violation_id = violation_id;
    this.reason = reason;
    this.reason_type = reason_type || "manual";
  }

  async getAll() {
    const sql = `
    SELECT 
      ver.id,
      CONCAT(offender.first_name, ' ', offender.last_name) AS employee_name,
      offender.email,
      offender.phone_number AS phone,
      offender.department_name AS department,
      v.title AS violation_title,
      v.type AS violation_type,
      v.weight AS violation_weight,
      ver.reason,
      ver.reason_type,
      CONCAT(reporter.first_name, ' ', reporter.last_name) AS reported_by
    FROM violations_employees_record ver
    JOIN employees offender ON ver.offender_id = offender.id
    JOIN violations v ON ver.violation_id = v.id
    JOIN employees reporter ON ver.reported_by = reporter.id
    ORDER BY ver.created_at DESC;
  `;
    const [rows] = await db.execute(sql);
    return rows;
  }

  async getById() {
    const sql = `SELECT * FROM violations_employees_record WHERE id = ?`;
    const [rows] = await db.execute(sql, [this.id]);
    return rows[0];
  }

  async create() {
    const sql = `
      INSERT INTO violations_employees_record (reported_by, offender_id, violation_id, reason , reason_type)
      VALUES (?, ?, ?, ? , ?)
    `;

    for (const value of [
      this.reported_by,
      this.offender_id,
      this.violation_id,
    ]) {
      if (value === undefined) {
        throw new Error("All required fields must be provided");
      }
    }

    const values = [
      this.reported_by,
      this.offender_id,
      this.violation_id,
      this.reason || null,
      this.reason_type || "manual",
    ];

    const [result] = await db.execute(sql, values);
    return result;
  }

  async update() {
    const fields = {
      reported_by: this.reported_by,
      offender_id: this.offender_id,
      violation_id: this.violation_id,
      reason: this.reason === "" ? undefined : this.reason,
      reason_type: this.reason_type,
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

    const sql = `UPDATE violations_employees_record SET ${keys.join(
      ", "
    )} WHERE id = ?`;
    const [result] = await db.execute(sql, values);
    return result;
  }

  async delete() {
    const sql = `DELETE FROM violations_employees_record WHERE id = ?`;
    const [result] = await db.execute(sql, [this.id]);
    return result;
  }

  static async getEmployeeTotalViolationWeight(employeeId) {
    const sql = `
    SELECT COALESCE(SUM(v.weight), 0) AS total_weight
    FROM violations_employees_record ver
    JOIN violations v ON v.id = ver.violation_id
    WHERE ver.offender_id = ?
  `;

    const [rows] = await db.execute(sql, [employeeId]);
    return rows[0]?.total_weight || 0;
  }
}

module.exports = ViolationsEmployeeRecord;
