const axios = require("axios");
const { BookingRepository } = require("../repositories");
const db = require("../models");
const { ServerConfig } = require("../config");
const AppError = require("../utils/errors/app-error");
const { StatusCodes } = require("http-status-codes");

const bookingRepository = new BookingRepository();
async function createBooking(data) {
  // try {
  //   const result = await db.sequelize.transaction(async function bookingImp(t) {
  //     const flight = await axios.get(
  //       `${ServerConfig.FLIGHT_SERVICE}/api/v1/flights/${data.flightId}`
  //     );
  //     const flightData = flight.data.data;
  //     if (data.noOfSeats > flightData.totalSeats) {
  //       throw new AppError(
  //         "Number of seats exceeds available seats",
  //         StatusCodes.BAD_REQUEST
  //       );
  //     }
  //     return true;
  //   });
  //   return true;
  // } catch (error) {
  //   console.log("Service Catch");
  //   throw error;
  // }
  //
  // OR
  //
  // 'id',
  // 'flightNumber','airplaneId','price','boardingGate','totalSeats',
  // remaining - userId,noOfSeats
  const transaction = await db.sequelize.transaction();
  try {
    const flight = await axios.get(
      `${ServerConfig.FLIGHT_SERVICE}/api/v1/flights/${data.flightId}`
    );
    const flightData = flight.data.data;
    if (data.noOfSeats > flightData.totalSeats) {
      throw new AppError("Not enough seats available", StatusCodes.BAD_REQUEST);
    }
    const totalBillingAmount = data.noOfSeats * flightData.price;
    console.log(totalBillingAmount);
    const bookingPayload = {
      ...data,
      totalCost: totalBillingAmount,
    };

    const booking = await bookingRepository.createBooking(
      bookingPayload,
      transaction
    );

    const apiUrl = `${ServerConfig.FLIGHT_SERVICE}/api/v1/flights/${data.flightId}/seats`;
    await axios.patch(apiUrl, { seats: data.noOfSeats });

    await transaction.commit();
    return booking;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}

module.exports = {
  createBooking,
};
