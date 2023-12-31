const axios = require("axios");
const { StatusCodes } = require("http-status-codes");

const { BookingRepository } = require("../repositories");
const { ServerConfig, Queue } = require("../config");
const db = require("../models");
const AppError = require("../utils/errors/app-error");
const { Enums } = require("../utils/common");
const { BOOKED, CANCELLED } = Enums.BOOKING_STATUS;

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
  // const totalBillingAmount = data.noOfSeats * flightData.price;
  // console.log(totalBillingAmount);
  // const bookingPayload = {
  //   ...data,
  //   totalCost: totalBillingAmount,
  // };

  // const booking = await bookingRepository.createBooking(
  //   bookingPayload,
  // );

  // const apiUrl = `${ServerConfig.FLIGHT_SERVICE}/api/v1/flights/${data.flightId}/seats`;
  // await axios.patch(apiUrl, { seats: data.noOfSeats });

  // return booking;
  //
  // OR
  //
  // 'id',
  // 'flightNumber','airplaneId','price','boardingGate','totalSeats',
  // remaining - userId,noOfSeats
  const transaction = await db.sequelize.transaction();
  try {
    const flight = await axios.get(`${ServerConfig.FLIGHT_SERVICE}/api/v1/flights/${data.flightId}`);
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

    const booking = await bookingRepository.createBooking(bookingPayload, transaction);

    const apiUrl = `${ServerConfig.FLIGHT_SERVICE}/api/v1/flights/${data.flightId}/seats`;
    await axios.patch(apiUrl, { seats: data.noOfSeats });

    await transaction.commit();
    return booking;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}

async function makePayment(data) {
  console.log("Inside service");
  const transaction = await db.sequelize.transaction();
  try {
    const bookingDetails = await bookingRepository.get(data.bookingId, transaction);
    if (bookingDetails.status == CANCELLED) {
      throw new AppError("The booking has expired", StatusCodes.BAD_REQUEST);
    }
    console.log(bookingDetails);
    const bookingTime = new Date(bookingDetails.createdAt);
    const currentTime = new Date();
    if (currentTime - bookingTime > 300000) {
      await cancelBooking(data.bookingId);
      throw new AppError("The booking has expired", StatusCodes.BAD_REQUEST);
    }
    if (bookingDetails.totalCost != data.totalCost) {
      throw new AppError("The amount of the payment doesnt match", StatusCodes.BAD_REQUEST);
    }
    if (bookingDetails.userId != data.userId) {
      throw new AppError("The user corresponding to the booking doesnt match", StatusCodes.BAD_REQUEST);
    }
    // we assume here that payment is successful
    await bookingRepository.update(data.bookingId, { status: BOOKED }, transaction);
    Queue.sendData({
      recepientEmail: "cetel40762@armablog.com",
      subject: "Flight booked",
      text: `Booking successfully done for the booking ${data.bookingId}`,
    });
    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}
async function cancelBooking(bookingId) {
  const transaction = await db.sequelize.transaction();
  try {
    const bookingDetails = await bookingRepository.get(bookingId, transaction);
    console.log(bookingDetails);
    if (bookingDetails.status == CANCELLED) {
      await transaction.commit();
      return true;
    }
    await axios.patch(`${ServerConfig.FLIGHT_SERVICE}/api/v1/flights/${bookingDetails.flightId}/seats`, {
      seats: bookingDetails.noofSeats,
      dec: 0,
    });
    await bookingRepository.update(bookingId, { status: CANCELLED }, transaction);
    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}
async function cancelOldBookings() {
  try {
    console.log("Inside service");
    const time = new Date(Date.now() - 1000 * 600); // time 10 mins ago
    const response = await bookingRepository.cancelOldBookings(time);

    return response;
  } catch (error) {
    console.log(error);
  }
}
module.exports = {
  createBooking,
  makePayment,
  cancelOldBookings,
};
