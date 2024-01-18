// routes/locationsRouter.js
const express = require("express");
const router = express.Router();
const locationsController = require("../controllers/locationsController");

// Get all locations
router.get("/", locationsController.getAllLocations);

// Get a specific location by ID
router.get("/:myId([0-9]+)", locationsController.getLocationById);

// Delete a location by ID
router.delete("/:myId([0-9]+)", locationsController.deleteLocationById);

// Add a new location
router.post("/", locationsController.addNewLocation);

module.exports = router;
