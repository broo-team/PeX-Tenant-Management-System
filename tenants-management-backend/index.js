// index.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
// const stallRoutes = require("./route/stallRoutes.js")
// const tenantRoutes = require('./route/tenantRoutes/tenantRoutes.js');
const stallRoutes = require("./route/StallRoute/StallRoute.js")
const tenantRoutes = require("./route/tenantRoutes/tenantRoutes.js")
const roomRoute = require("./route/RoomRoute/RoomRoute.js")
const buildeRoute = require("./route/buildingRoutes/buildingRoutes.js")
const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

// Use routes
app.use('/api', stallRoutes);
app.use('/api', tenantRoutes);
app.use('/api', roomRoute);
app.use('/api',buildeRoute)


app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
