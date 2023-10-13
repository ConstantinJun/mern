const axios = require("axios");

const HttpError = require("../models/http-error");

const API_KEY = process.env.GOOGLE_API_KEY;

const getCoordsForAdress = async (address) => {
  const resposnse = await axios.get(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${API_KEY}`
  );

  const data = resposnse.data;

  if (!data || data.status === "ZERO_RESULTS") {
    const error = new HttpError(
      "Could not find location for the specifie address.",
      422
    );

    throw error;
  }

  const coordinates = data.results[0].geometry.location;

  return coordinates;
};

module.exports = getCoordsForAdress;
