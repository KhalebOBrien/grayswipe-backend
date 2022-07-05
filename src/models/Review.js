const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: ObjectId,
      ref: "users",
    },
    salon: {
      type: ObjectId,
      ref: "salon",
    },
    ratings: {
      type: String,
    },
    details: {
      type: String,
      required: [true, "Details is required."],
      minlength: [3, "Details cannot be less than 3 characters."],
    },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);

reviewSchema.methods.toJSON = function () {
  var obj = this.toObject();
  delete obj.__v;
  if (obj.user) {
    delete obj.user.password;
    delete obj.user.auth_token;
    delete obj.user.password_reset_token;
    delete obj.user.created_at;
    delete obj.user.updated_at;
    delete obj.user.__v;
  }
  if (obj.salon) {
    delete obj.salon.__v;
  }
  return obj;
};

const Review = mongoose.model("reviews", reviewSchema);

module.exports = Review;
