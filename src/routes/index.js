const { Router } = require("express");
const {
  login,
  register,
  requestPasswordReset,
  setNewPassword,
  requiresAuth,
} = require("../controllers/authController");
const {
  createSalon,
  updateSalon,
  fetchOneSalon,
  fetchAllSalons,
} = require("../controllers/salonController");
const {
  createReview,
  updateReview,
  deleteReview,
  fetchOneReview,
  fetchAllReviews,
  fetchAllReviewsByUser,
  fetchAllReviewsBySalon,
} = require("../controllers/reviewController");

const router = Router();

// auth
router.post("/authenticate", login);
router.post("/register", register);
router.post("/request-reset", requestPasswordReset);
router.post("/reset-password", setNewPassword);

// salon
router.post("/salon", requiresAuth, createSalon);
router.patch("/salon/:salonId", requiresAuth, updateSalon);
router.get("/salon/:salonId", fetchOneSalon);
router.get("/salons", fetchAllSalons);

// review
router.post("/review", requiresAuth, createReview);
router.patch("/review/:reviewId", requiresAuth, updateReview);
router.delete("/review/:reviewId", requiresAuth, deleteReview);
router.get("/review/:reviewId", fetchOneReview);
router.get("/reviews", requiresAuth, fetchAllReviews);
router.get("/reviews/user/:userId", requiresAuth, fetchAllReviewsByUser);
router.get("/reviews/salon/:salonId", fetchAllReviewsBySalon);

module.exports = router;
