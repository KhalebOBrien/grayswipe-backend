const User = require("../models/User");
const { createToken } = require("../middlewares/jwt");
const { handleErrors } = require("../middlewares/errorHandler");
const { mail } = require("../middlewares/emailHandler");
const randomId = require("random-id");
const { split } = require("lodash");
const jwt = require("jsonwebtoken");

const login = async (req, res) => {
  const { emailOrPhoneNumber, password, remember_me } = req.body;

  try {
    const user = await User.login(emailOrPhoneNumber, password);

    const token = createToken({ id: user._id, remember_me });

    res.status(200).json({ user, token });
  } catch (err) {
    const error = handleErrors(err);
    res.status(400).json({ error });
  }
};

const register = async (req, res) => {
  const { first_name, last_name, email, phone_no, password, profile_photo, auth_id } = req.body;

  try {
    const user = await User.create({ first_name, last_name, email, phone_no, password, profile_photo, auth_id });

    const token = createToken({ id: user._id });

    res.status(201).json({ user, token });
  } catch (err) {
    const error = handleErrors(err);
    res.status(400).json({ error });
  }
};

const requestPasswordReset = async (req, res) => {
  const { email } = req.body;

  try {
    const resetToken = randomId(6, "0");
    const updatedUser = await User.findOneAndUpdate(
      { email: email },
      { $set: { password_reset_token: resetToken } },
      { new: true }
    );

    if (!updatedUser) {
      throw Error("user not found");
    }

    const mailOptions = {
      to: updatedUser.email,
      subject: "Reset Password",
      html: `<h3>Your password reset pin is: ${updatedUser.password_reset_token}</h3>`,
    };

    const mailsender = mail(mailOptions);

    res.status(201).json(mailsender);
  } catch (err) {
    const error = handleErrors(err);
    res.status(400).json({ error });
  }
};

const setNewPassword = async (req, res) => {
  const { pin, new_password } = req.body;
  try {
    const user = await User.updatePassword(pin, new_password);

    res.status(200).json({ status: "success" });
  } catch (err) {
    const error = handleErrors(err);
    res.status(400).json({ error });
  }
};

const regenerateToken = async (req, res) => {
  try {
  const token = createToken({ id: res.locals.user, remember_me: res.locals.remember_me });

  res.status(200).json({ token });
  } catch (err) {
    const error = handleErrors(err);
    res.status(400).json({ error });
  }
};

const requiresAuth = (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(401).json({ error: "Unauthorized" });
  } else {
    const [tokenType, token] = split(req.headers.authorization, " ");
    if (token && tokenType === "Bearer") {
      jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
        if (err) {
          console.log(err);
          return res.status(401).json({ error: "Session Expired" });
        } else {
          // make user available for the next middleware
          res.locals.user = decodedToken.data.id;
          res.locals.remember_me = decodedToken.data.id;
          next();
        }
      });
    }
  }
};

module.exports = {
  login,
  register,
  requestPasswordReset,
  setNewPassword,
  regenerateToken,
  requiresAuth,
};
