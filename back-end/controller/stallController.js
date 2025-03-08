// controllers/stallController.js
const db = require('../db/connection');

exports.createStall = async (req, res) => {
  const { stallCode, building_id, rooms = [] } = req.body;

  if (!stallCode || !building_id) {
    return res.status(400).json({ error: 'Both stallCode and building_id are required' });
  }

  // Query to create new stall if it doesn't already exist.
  const queryInsert = "INSERT INTO stalls (stallCode, building_id, rooms) VALUES (?, ?, ?)";
  
  try {
    // Check if a stall with the given stallCode already exists.
    const [existingStallRows] = await db.query("SELECT * FROM stalls WHERE stallCode = ?", [stallCode]);
    
    if (existingStallRows.length > 0) {
      // Stall exists—add the new room(s) as separate entries in the JSON stored in the 'rooms' column.
      let existingStall = existingStallRows[0];
      let existingRooms = [];

      // If there's already a value in the rooms column, parse it as JSON.
      if (existingStall.rooms) {
        try {
          existingRooms = JSON.parse(existingStall.rooms);
          if (!Array.isArray(existingRooms)) {
            existingRooms = [];
          }
        } catch (parseErr) {
          console.error("Error parsing rooms JSON:", parseErr);
          // In case of parse errors, reset to empty array.
          existingRooms = [];
        }
      }

      // Append the new room objects (which may contain their own size, monthlyRent, eeuReader, etc.)
      const updatedRooms = [...existingRooms, ...rooms];

      // Update the stall record by storing the extra room objects as JSON.
      const queryUpdate = "UPDATE stalls SET rooms = ? WHERE stallCode = ?";
      await db.query(queryUpdate, [JSON.stringify(updatedRooms), stallCode]);
      
      return res.status(200).json({ message: 'New room(s) added to existing stall successfully' });
    } else {
      // Stall doesn't exist, so create a new stall.
      // In a new stall, if room details are provided, they will be stored in the rooms column.
      const [result] = await db.query(queryInsert, [stallCode, building_id, JSON.stringify(rooms)]);
      return res.status(201).json({ message: 'Stall created successfully', id: result.insertId });
    }
  } catch (err) {
    console.error('Error creating or updating stall:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getStalls = async (req, res) => {
  const query = "SELECT * FROM stalls";
  try {
    const [results] = await db.query(query);
    res.status(200).json(results);
  } catch (err) {
    console.error('Error fetching stalls:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.updateStallDetails = async (req, res) => {
  const stallCode = req.params.stallCode;
  const { size, monthlyRent, eeuReader, rooms } = req.body;
  const roomsValue = Array.isArray(rooms) ? rooms.join(', ') : rooms;

  const query = `
    UPDATE stalls 
    SET size = ?, monthlyRent = ?, eeuReader = ?, rooms = ?
    WHERE stallCode = ?
  `;
  const values = [size, monthlyRent, eeuReader, roomsValue, stallCode];

  try {
    const [result] = await db.query(query, values);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Stall not found' });
    }
    res.status(200).json({ message: 'Stall details updated successfully' });
  } catch (err) {
    console.error('Error updating stall details:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.deleteStall = async (req, res) => {
  const stallCode = req.params.stallCode;
  const query = "DELETE FROM stalls WHERE stallCode = ?";
  try {
    const [result] = await db.query(query, [stallCode]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Stall not found' });
    }
    res.status(200).json({ message: 'Stall deleted successfully' });
  } catch (err) {
    console.error('Error deleting stall:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
