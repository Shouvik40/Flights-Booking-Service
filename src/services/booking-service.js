const axios = require("axios");
const { BookingRepository } = require("../repositories");
const db = require("../models");
const { ServerConfig } = require("../config");
const AppError = require("../utils/errors/app-error");
const { StatusCodes } = require("http-status-codes");

async function createBooking(data) {
  try {
    const result = await db.sequelize.transaction(async function bookingImp(t) {
      const flight = await axios.get(
        `${ServerConfig.FLIGHT_SERVICE}/api/v1/flights/${data.flightId}`
      );
      const flightData = flight.data.data;
      if (data.noOfSeats > flightData.totalSeats) {
        throw new AppError(
          "Number of seats exceeds available seats",
          StatusCodes.BAD_REQUEST
        );
      }
      return true;
    });
    return true;
  } catch (error) {
    console.log("Service Catch");
    throw error;
  }
}

module.exports = {
  createBooking,
};
