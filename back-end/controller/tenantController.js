// controllers/tenantController.js
const db = require('../db/connection');

exports.createTenant = async (req, res) => {
  const {
    tenantID,
    fullName,
    sex,
    phone,
    city,           // expect "city" (not "City")
    subcity,
    woreda,
    house_no,       // expect "house_no"
    room,
    price,
    paymentTerm,
    deposit,
    leasePeriod,    // Expected as an array: [leaseStart, leaseEnd]
    eeuPayment,
    generatorPayment,
    waterPayment,
    registeredByAgent,
    // Agent information (use distinct keys)
    authenticationNo,
    agentFirstName,
    agentSex,
    agentPhone,
    agentCity,
    agentSubcity,
    agentWoreda,
    agentHouseNo,
    building_id     // REQUIRED: associates tenant with a building
  } = req.body;

  if (!tenantID || !fullName || !sex || !phone || !room || !leasePeriod || !building_id) {
    return res.status(400).json({
      error:
        'Missing required fields. Ensure tenantID, fullName, sex, phone, room, leasePeriod, and building_id are provided.'
    });
  }

  // Validate leasePeriod is an array with two elements: [leaseStart, leaseEnd]
  const leaseStart = Array.isArray(leasePeriod) && leasePeriod.length === 2 ? leasePeriod[0] : null;
  const leaseEnd = Array.isArray(leasePeriod) && leasePeriod.length === 2 ? leasePeriod[1] : null;
  if (!leaseStart || !leaseEnd) {
    return res.status(400).json({ error: 'leasePeriod must contain [leaseStart, leaseEnd]' });
  }

  // Check if the room is already taken by another active tenant in the same building.
  // Enclose terminated in backticks (`terminated`) to avoid SQL reserved keyword conflicts.
  const roomQuery = "SELECT id FROM tenants WHERE room = ? AND building_id = ? AND `terminated` = false";
  try {
    const [existing] = await db.query(roomQuery, [room, building_id]);
    if (existing.length > 0) {
      return res.status(400).json({ error: "Room has already been taken by another tenant." });
    }
  } catch (err) {
    console.error("Error checking room availability:", err);
    return res.status(500).json({ error: "Internal server error while checking room availability." });
  }

  const query = `
    INSERT INTO tenants 
      (tenant_id, full_name, sex, phone, city, subcity, woreda, house_no, room, price, payment_term, deposit, lease_start, lease_end, registered_by_agent, authentication_no, agent_first_name, agent_sex, agent_phone, agent_city, agent_subcity, agent_woreda, agent_house_no, eeu_payment, generator_payment, water_payment, building_id)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  const values = [
    tenantID,
    fullName,
    sex,
    phone,
    city || null,
    subcity || null,
    woreda || null,
    house_no || null,
    room,
    price || null,
    paymentTerm || null,
    deposit || null,
    leaseStart,
    leaseEnd,
    registeredByAgent || false,
    authenticationNo || null,
    agentFirstName || null,
    agentSex || null,
    agentPhone || null,
    agentCity || null,
    agentSubcity || null,
    agentWoreda || null,
    agentHouseNo || null,
    eeuPayment || false,
    generatorPayment || false,
    waterPayment || false,
    building_id
  ];

  try {
    const [result] = await db.query(query, values);
    res.status(201).json({ message: 'Tenant created successfully', id: result.insertId });
  } catch (err) {
    console.error('Error creating tenant:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getTenants = async (req, res) => {
  // Use backticks around terminated.
  const query = "SELECT * FROM tenants WHERE `terminated` = false";
  try {
    const [results] = await db.query(query);
    res.status(200).json(results);
  } catch (err) {
    console.error('Error fetching tenants:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getTenantById = async (req, res) => {
  const tenantId = req.params.id; // uses the URL parameter
  const query = "SELECT * FROM tenants WHERE id = ?";
  try {
    const [results] = await db.query(query, [tenantId]);
    if (!results || results.length === 0) {
      return res.status(404).json({ error: 'Tenant not found' });
    }
    res.status(200).json(results[0]);
  } catch (err) {
    console.error('Error fetching tenant by id:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};


exports.updateTenant = async (req, res) => {
  const tenantId = req.params.id;
  const {
    tenantID,
    fullName,
    sex,
    phone,
    city,
    subcity,
    woreda,
    house_no,
    room,
    price,
    paymentTerm,
    deposit,
    leasePeriod,
    eeuPayment,
    generatorPayment,
    waterPayment,
    registeredByAgent,
    authenticationNo,
    agentFirstName,
    agentSex,
    agentPhone,
    agentCity,
    agentSubcity,
    agentWoreda,
    agentHouseNo,
    building_id
  } = req.body;

  const leaseStart = Array.isArray(leasePeriod) && leasePeriod.length === 2 ? leasePeriod[0] : null;
  const leaseEnd = Array.isArray(leasePeriod) && leasePeriod.length === 2 ? leasePeriod[1] : null;

  const query = `
    UPDATE tenants 
      SET tenant_id = ?, full_name = ?, sex = ?, phone = ?, city = ?, subcity = ?, woreda = ?, house_no = ?, room = ?, price = ?, payment_term = ?, deposit = ?, lease_start = ?, lease_end = ?, registered_by_agent = ?, authentication_no = ?, agent_first_name = ?, agent_sex = ?, agent_phone = ?, agent_city = ?, agent_subcity = ?, agent_woreda = ?, agent_house_no = ?, eeu_payment = ?, generator_payment = ?, water_payment = ?, building_id = ?
    WHERE id = ?
  `;
  const values = [
    tenantID,
    fullName,
    sex,
    phone,
    city,
    subcity,
    woreda,
    house_no,
    room,
    price,
    paymentTerm,
    deposit,
    leaseStart,
    leaseEnd,
    registeredByAgent,
    authenticationNo,
    agentFirstName,
    agentSex,
    agentPhone,
    agentCity,
    agentSubcity,
    agentWoreda,
    agentHouseNo,
    eeuPayment,
    generatorPayment,
    waterPayment,
    building_id,
    tenantId
  ];

  try {
    const [result] = await db.query(query, values);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Tenant not found' });
    }
    res.status(200).json({ message: 'Tenant updated successfully' });
  } catch (err) {
    console.error('Error updating tenant:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.terminateTenant = async (req, res) => {
  const tenantId = req.params.id;
  const query = `UPDATE tenants SET \`terminated\` = true WHERE id = ?`;
  try {
    const [result] = await db.query(query, [tenantId]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Tenant not found' });
    }
    res.status(200).json({ message: 'Tenant terminated successfully' });
  } catch (err) {
    console.error('Error terminating tenant:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getTerminatedTenants = async (req, res) => {
  const query = "SELECT * FROM tenants WHERE `terminated` = true";
  try {
    const [results] = await db.query(query);
    res.status(200).json(results);
  } catch (err) {
    console.error('Error fetching terminated tenants:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};



exports.getTenants = async (req, res) => {
  try {
    const query = `
      SELECT t.*, 
        IFNULL(euu.last_reading, 0) AS last_eeu_reading,
        IFNULL(water.last_reading, 0) AS last_water_reading,
        IFNULL(gen.last_reading, 0) AS last_generator_reading
      FROM tenants t
      LEFT JOIN (
          SELECT tenant_id, MAX(current_reading) AS last_reading
          FROM tenant_utility_usage
          WHERE utility_type = 'electricity'
          GROUP BY tenant_id
      ) euu ON t.id = euu.tenant_id
      LEFT JOIN (
          SELECT tenant_id, MAX(current_reading) AS last_reading
          FROM tenant_utility_usage
          WHERE utility_type = 'water'
          GROUP BY tenant_id
      ) water ON t.id = water.tenant_id
      LEFT JOIN (
          SELECT tenant_id, MAX(current_reading) AS last_reading
          FROM tenant_utility_usage
          WHERE utility_type = 'generator'
          GROUP BY tenant_id
      ) gen ON t.id = gen.tenant_id
    `;
    const [results] = await db.query(query);
    res.status(200).json(results);
  } catch (error) {
    console.error("Error fetching tenants:", error);
    res.status(500).json({ error: "Internal server error" });
  }}