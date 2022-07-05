const User = require("../models/User");
const Salon = require("../models/Salon");
const { handleErrors } = require("../middlewares/errorHandler");

const createSalon = async (req, res) => {
  const {
    name,
    category,
    details,
    members,
    country,
    state,
    city,
    street,
    postcode,
    location,
    photo_urls,
  } = req.body;
  try {
    let user = await User.currentUser(res.locals.user);

    const salon = await Salon.create({
      user,
      name,
      category,
      details,
      members,
      country,
      state,
      city,
      street,
      postcode,
      location,
      photo_urls,
    });

    res.status(201).json(salon);
  } catch (err) {
    const error = handleErrors(err);
    res.status(400).json({ error });
  }
};

const updateSalon = async (req, res) => {
  const {
    name,
    category,
    details,
    members,
    country,
    state,
    city,
    street,
    postcode,
    location,
    photo_urls,
  } = req.body;
  try {
    const salon = await Salon.findOneAndUpdate(
      { _id: req.params.salonId },
      {
        $set: {
          name,
          category,
          details,
          members,
          country,
          state,
          city,
          street,
          postcode,
          location,
          photo_urls,
        },
      },
      { new: true }
    );
    if (salon) {
      return res.status(200).json(salon);
    }
    res.status(400).json({ error: "Salon not found" });
  } catch (err) {
    const error = handleErrors(err);
    res.status(400).json({ error });
  }
};

const fetchOneSalon = async (req, res) => {
  try {
    const salon = await Salon.findOne({ _id: req.params.salonId });
    res.status(200).json(salon);
  } catch (err) {
    const error = handleErrors(err);
    res.status(400).json({ error });
  }
};

const fetchAllSalons = async (req, res) => {
  try {
    const salons = await Salon.find({});
    res.status(200).json(salons);
  } catch (err) {
    const error = handleErrors(err);
    res.status(400).json({ error });
  }
};

module.exports = {
  createSalon,
  updateSalon,
  fetchOneSalon,
  fetchAllSalons,
};