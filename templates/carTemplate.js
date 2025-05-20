function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

module.exports = function (car) {
  return `
    <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            padding: 30px;
            font-size: 20px;
            color: #333;
          }
          h1 {
            text-align: center;
            margin-bottom: 30px;
          }
          .item {
            margin-bottom: 8px;
          }
          .gap-2 {
            margin-top: 40px;
          }
          .gap-3 {
            margin-top: 50px;
          }
          .label {
            font-weight: bold;
            display: inline-block;
            min-width: 160px;
          }
        </style>
      </head>
      <body>
        <div class="section">
          <h1>Purchase Order</h1>

          <!-- Block 1 -->
          <div class="item"><span class="label">MMR:</span> ${parseInt(
            car.market_price
          )} $</div>
          <div class="item"><span class="label">Approved By:</span> ${
            car.approved_by
          }</div>

          <!-- Block 2 -->
          <div class="item gap-2">
            <span class="label">VIN Number:</span>
            ${car.vin_number.slice(0, -8)}<strong>${car.vin_number.slice(
    -8
  )}</strong>
          </div>
          <div class="item"><span class="label">Make-Model:</span> ${
            car.model
          }</div>
          <div class="item"><span class="label">Year:</span> ${
            car.manufacture_date
          }</div>
          <div class="item"><span class="label">Mileage:</span> ${
            car.mileage
          } km</div>
          <div class="item"><span class="label">EXT Color:</span> ${
            car.exterior_color
          }</div>
          <div class="item"><span class="label">INT Color:</span> ${
            car.interior_color
          }</div>

          <!-- Block 3 - Spanning 2 lines -->
          <div class="item gap-2"><span class="label">Purchased From:</span> ${
            car.purchased_from
          }</div>
          <div class="item"><span class="label">Purchased By:</span> ${
            car.buyer_first_name
          } ${car.buyer_last_name}</div>
          <div class="item"><span class="label">Purchase Team:</span> ${
            car.purchase_team
          }</div>
          <div class="item"><span class="label">Purchase Date:</span> ${formatDate(
            car.purchase_date
          )}</div>

          <!-- Block 4 - Spanning 3 lines -->
          <div class="item gap-3"><span class="label">Purchase Price:</span> ${parseInt(
            car.purchase_price
          )} $</div>
        </div>
      </body>
    </html>
  `;
};
