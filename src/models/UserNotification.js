const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const userNotificationSchema = new mongoose.Schema(
  {
    from_user: {
      type: ObjectId,
      ref: "users",
    },
    to_user: {
      type: ObjectId,
      ref: "users",
    },
    title: {
      type: String,
    },
    description: {
      type: String,
    },
    url: {
      type: String,
    },
    seen: {
      type: Boolean,
      default: false
    },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);

userNotificationSchema.methods.toJSON = function () {
  var obj = this.toObject();
  delete obj.__v;
  if (obj.from_user) {
    delete obj.from_user.password;
    delete obj.from_user.auth_id;
    delete obj.from_user.password_reset_token;
    delete obj.from_user.created_at;
    delete obj.from_user.updated_at;
    delete obj.from_user.__v;
  }
  if (obj.to_user) {
    delete obj.to_user.password;
    delete obj.to_user.auth_id;
    delete obj.to_user.password_reset_token;
    delete obj.to_user.created_at;
    delete obj.to_user.updated_at;
    delete obj.to_user.__v;
  }
  return obj;
};

const UserNotification = mongoose.model("user_notifications", userNotificationSchema);

module.exports = UserNotification;
