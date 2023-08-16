const express = require("express");

const { InfoController } = require("../../controllers");
const BookingRoutes = require("./booking");

const router = express.Router();

router.get("/info", InfoController.info);

//  /api/v1/booking
router.use("/bookings", BookingRoutes);

module.exports = router;
