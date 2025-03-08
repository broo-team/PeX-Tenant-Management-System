const db = require("../../db/connection");

exports.createRoom = async (req, res) => {
    const { stall_id, roomCode } = req.body;
    try {
        await db.query("INSERT INTO rooms (stall_id, roomCode) VALUES (?, ?)", [stall_id, roomCode]);
        res.status(201).json({ message: "Room created successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getRoomsByStall = async (req, res) => {
    const { stall_id } = req.params;
    try {
        const [rooms] = await db.query("SELECT * FROM rooms WHERE stall_id=?", [stall_id]);
        res.status(200).json(rooms);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
