module.exports = function getLocationWrapper(optimal) {
  return function getLocation() {
    return optimal.location;
  };
};
