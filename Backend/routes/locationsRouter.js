// routes/locationsRouter.js
const express = require("express");
const router = express.Router();
const locationsController = require("../controllers/locationsController");

// Get all locations
router.get("/", locationsController.getAllLocations);

// Get a specific location by ID
router.get("/:myId([0-9]+)", locationsController.getLocationById);

// Delete a word by ID
router.delete("/:myId([0-9]+)", locationsController.deleteLocationById);

// Add a new word
router.post("/", locationsController.addNewLocation);

// Get a random word for guessing
router.get("/random-word", locationsController.getRandomWord);

// Get word by id
router.get("/word/:id", locationsController.getWordById);

// Validate that the translation is correct
router.post("/validate-translation", locationsController.validateTranslation);

module.exports = router;
