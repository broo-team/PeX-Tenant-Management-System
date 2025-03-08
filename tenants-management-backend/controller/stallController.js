const db = require("../db/connection");

exports.createStall = async (req, res) => {
    const { stallCode } = req.body;
    try {
        await db.query("INSERT INTO stalls (stallCode) VALUES (?)", [stallCode]);
        res.status(201).json({ message: "Stall created successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateStall = async (req, res) => {
    const { id } = req.params;
    const { size, monthlyRent, eeuReader } = req.body;
    try {
        await db.query(
            "UPDATE stalls SET size=?, monthlyRent=?, eeuReader=? WHERE id=?",
            [size, monthlyRent, eeuReader, id]
        );
        res.status(200).json({ message: "Stall updated successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
