const db = require("../config/db");

class Vehicle {
  constructor(
    id = null,
    vehicle_type,
    model,
    manufacture_date,
    vin_number,
    exterior_color,
    interior_color,
    mileage,
    purchase_price,
    market_price,
    purchased_from,
    purchase_date,
    purchase_team,
    approved_by,
    buyer_id,
    created_by
  ) {
    this.id = id;
    this.vehicle_type = vehicle_type;
    this.model = model;
    this.manufacture_date = manufacture_date;
    this.vin_number = vin_number;
    this.exterior_color = exterior_color;
    this.interior_color = interior_color;
    this.mileage = mileage;
    this.purchase_price = purchase_price;
    this.market_price = market_price;
    this.purchased_from = purchased_from;
    this.purchase_date = purchase_date;
    this.purchase_team = purchase_team;
    this.approved_by = approved_by;
    this.buyer_id = buyer_id;
    this.created_by = created_by;
  }

  async getAll() {
    const sql = `SELECT * FROM vehicles`;
    const [rows] = await db.execute(sql);
    return rows;
  }

  async getById() {
    const sql = `SELECT * FROM vehicles WHERE id = ?`;
    const [rows] = await db.execute(sql, [this.id]);
    return rows[0];
  }

  async create() {
    const sql = `
      INSERT INTO vehicles (
        vehicle_type, model, manufacture_date, vin_number, exterior_color,
        interior_color, mileage, purchase_price, market_price, purchased_from,
        purchase_date, purchase_team, approved_by, buyer_id, created_by
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      this.vehicle_type,
      this.model,
      this.manufacture_date,
      this.vin_number,
      this.exterior_color,
      this.interior_color,
      this.mileage,
      this.purchase_price,
      this.market_price,
      this.purchased_from,
      this.purchase_date,
      this.purchase_team,
      this.approved_by,
      this.buyer_id,
      this.created_by,
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
    const updatableFields = {
      vehicle_type: this.vehicle_type,
      model: this.model,
      manufacture_date: this.manufacture_date,
      vin_number: this.vin_number,
      exterior_color: this.exterior_color,
      interior_color: this.interior_color,
      mileage: this.mileage,
      purchase_price: this.purchase_price,
      market_price: this.market_price,
      purchased_from: this.purchased_from,
      purchase_date: this.purchase_date,
      purchase_team: this.purchase_team,
      approved_by: this.approved_by,
      buyer_id: this.buyer_id,
      created_by: this.created_by,
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

    const sql = `UPDATE vehicles SET ${keys.join(", ")} WHERE id = ?`;
    values.push(this.id);

    const [result] = await db.execute(sql, values);
    return result;
  }

  async checkVinNumber() {
    const [existingVinNumber] = await db.execute(
      "SELECT * FROM vehicles WHERE vin_number = ?",
      [this.vin_number]
    );
    return existingVinNumber.length;
  }

  async delete() {
    const sql = `DELETE FROM vehicles WHERE id = ?`;
    const [result] = await db.execute(sql, [this.id]);
    return result;
  }

  async getVehicleWithBuyer() {
    const sql = `
       select v.*, 
      e.first_name AS buyer_first_name, 
      e.last_name AS buyer_last_name
      FROM vehicles v
      LEFT JOIN employees e ON v.buyer_id = e.id
      WHERE v.id = ?
    `;
    const [rows] = await db.execute(sql, [this.id]);
    return rows[0];
  }
}

module.exports = Vehicle;
