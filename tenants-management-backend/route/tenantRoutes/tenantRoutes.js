
const express = require("express")

const router = express.Router()

// const tenantController = require("../../controller/tenantController/tenantController.js")
const { registerTenantAndAssignRoom } = require("../../controller/tenantController/tenantController.js")

// router.post("/tenants", tenantController.registerTenant);
// router.post("/assign-tenant", tenantController.assignTenantToRoom);
router.post("/register", registerTenantAndAssignRoom);


module.exports = router
// // routes/tenantRoutes.js
// const express = require('express');
// const router = express.Router();
// const tenantController = require('../../controller/tenantController/tenantController.js');

// // Add a new tenant
// router.post('/tenants', tenantController.addTenant);

// // Get all tenants
// router.get('/tenants', tenantController.getAllTenants);

// // Get a single tenant by ID
// router.get('/tenants/:id', tenantController.getTenantById);

// // Update a tenant
// router.put('/tenants/:id', tenantController.updateTenant);

// // Delete a tenant
// router.delete('/tenants/:id', tenantController.deleteTenant);

// module.exports = router;

