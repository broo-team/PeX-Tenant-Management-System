// route/tenantRoutes.js
const db = require("../../db/connection");

exports.registerTenantAndAssignRoom = async (req, res) => {

    const {
        fullName, sex, phoneNumber, city, subCity, woreda, houseNo,
        agentNo, agentFullName, agentSex, agentPhoneNumber, agentCity,
        agentSubCity, agentWoreda, agentHouseNo, paymentTerm, deposit,
        leaseStartDate, leaseEndDate, hasEEU, hasGenerator, hasWater,
        room_id // Room ID to assign the tenant after registration
    } = req.body;

    try {
        // Step 1: Check if the room exists in the rooms table
        const [room] = await db.query("SELECT * FROM rooms WHERE id = ?", [room_id]);

        if (!room || room.length === 0) {
            return res.status(400).json({ message: "Room not found" });
        }

        // Step 2: Check if the room already has a tenant
        const [existingTenant] = await db.query("SELECT * FROM room_tenants WHERE room_id = ?", [room_id]);

        if (existingTenant.length > 0) {
            return res.status(400).json({ message: "This room already has a tenant" });
        }

        // Step 3: Register the tenant
        const [tenantResult] = await db.query(
            `INSERT INTO tenants
            (fullName, sex, phoneNumber, city, subCity, woreda, houseNo, agentNo, 
            agentFullName, agentSex, agentPhoneNumber, agentCity, agentSubCity, 
            agentWoreda, agentHouseNo, paymentTerm, deposit, leaseStartDate, 
            leaseEndDate, hasEEU, hasGenerator, hasWater) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                fullName, sex, phoneNumber, city, subCity, woreda, houseNo, agentNo,
                agentFullName, agentSex, agentPhoneNumber, agentCity, agentSubCity,
                agentWoreda, agentHouseNo, paymentTerm, deposit, leaseStartDate,
                leaseEndDate, hasEEU, hasGenerator, hasWater
            ]
        );

        const tenant_id = tenantResult.insertId; // Get the ID of the newly registered tenant

        // Step 4: Assign the tenant to the room
        await db.query(
            "INSERT INTO room_tenants (room_id, tenant_id) VALUES (?, ?)",
            [room_id, tenant_id]
        );

        res.status(201).json({ message: "Tenant registered and assigned to room successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

