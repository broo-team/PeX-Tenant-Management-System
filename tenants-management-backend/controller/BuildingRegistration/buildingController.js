const db = require("../../db/connection");

exports.registerBuilding = async (req, res) => {
    const { buildingName, buildingImage, buildingAddress, location, propertyType } = req.body;

    try {
        // Step 1: Insert building details into the 'buildings' table
        await db.query(
            `INSERT INTO buildings 
            (buildingName, buildingImage, buildingAddress, location, propertyType) 
            VALUES (?, ?, ?, ?, ?)`,
            [buildingName, buildingImage, buildingAddress, location, propertyType]
        );

        res.status(201).json({ message: "Building registered successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};
