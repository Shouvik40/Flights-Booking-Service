// var cron = require("node-cron");

function scheduleCrons() {
  //   cron.schedule("*/5 * * * *", () => {
  //     /*
  //     Second (0-59)
  //     Minute (0-59)
  //     Hour (0-23)
  //     Day of the month (1-31)
  //     Month (1-12)
  //     Day of the week (0-6, where Sunday is 0 and Saturday is 6)
  //     */
  //     console.log("running a task 5 seconds");
  //   });
}
// module.exports = scheduleCrons;

const cron = require("node-cron");

const { BookingService } = require("../../services");

function scheduleCrons() {
  cron.schedule("*/30 * * * *", async () => {
    // console.log(BookingService);
    await BookingService.cancelOldBookings();
  });
}

module.exports = scheduleCrons;
