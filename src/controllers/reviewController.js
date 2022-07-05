const User = require("../models/User");
const Review = require("../models/Review");
const Salon = require("../models/Salon");
const { handleErrors } = require("../middlewares/errorHandler");

const createReview = async (req, res) => {
  const { salon_id, ratings, details } = req.body;
  try {
    let user = await User.currentUser(res.locals.user);
    let salon = await Salon.findOne({ _id: salon_id });

    const review = await Review.create({ user, salon, ratings, details });

    res.status(201).json( review );
  } catch (err) {
    const error = handleErrors(err);
    res.status(400).json({ error });
  }
};

const updateReview = async (req, res) => {
  const { ratings, details } = req.body;
  try {
    const review = await Review.findOneAndUpdate(
      { _id: req.params.reviewId },
      { $set: { ratings, details } },
      { new: true }
    );
    if (review) {
      return res.status(200).json( review );
    }
    res.status(400).json({ error: "Review not found" });
  } catch (err) {
    const error = handleErrors(err);
    res.status(400).json({ error });
  }
};

const deleteReview = async (req, res) => {
  try {
    const review = await Review.deleteOne({ _id: req.params.reviewId })
    if (review) {
      res.status(200).json({ status: "success" });
    }
  } catch (err) {
    const error = handleErrors(err);
    res.status(400).json({ error: "An error occured" });
  }
};

const fetchOneReview = async (req, res) => {
  try {
    const review = await Review.findOne({ _id: req.params.reviewId }); 
    res.status(200).json( review );
  } catch (err) {
    const error = handleErrors(err);
    res.status(400).json({ error: "Review not found" });
  }
};

const fetchAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find({});
    res.status(200).json( reviews );
  } catch (err) {
    const error = handleErrors(err);
    res.status(400).json({ error: "Reviews not found" });
  }
};

const fetchAllReviewsByUser = async (req, res) => {
  try {
    const reviews = await Review.find({ user: req.params.userId }); 
    res.status(200).json( reviews );
  } catch (err) {
    const error = handleErrors(err);
    res.status(400).json({ error: "Reviews not found" });
  }
};

const fetchAllReviewsBySalon = async (req, res) => {
  try {
    const reviews = await Review.find({ salon: req.params.salonId });
    res.status(200).json( reviews );
  } catch (err) {
    const error = handleErrors(err);
    res.status(400).json({ error: "Reviews not found" });
  }
};

module.exports = {
  createReview,
  updateReview,
  deleteReview,
  fetchOneReview,
  fetchAllReviews,
  fetchAllReviewsByUser,
  fetchAllReviewsBySalon,
};
