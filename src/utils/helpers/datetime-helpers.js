function compareTime(dateString1, dateString2) {
  const date1 = new Date(dateString1);
  const date2 = new Date(dateString2);
  return date1 < date2;
}
module.exports = {
  compareTime,
};
