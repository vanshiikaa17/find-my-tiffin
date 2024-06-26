const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const sendEmail=require('../util/sendEmail');
const User = require("../models/user");
const Account = require("../models/account");
const Seller = require("../models/seller");

exports.signupUser = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const error = new Error("Validation Failed, Incorrect data entered.");
    error.statusCode = 422;
    error.errors = errors.array();
    throw error;
  }

  const email = req.body.email;
  const firstName = req.body.firstName;
  const password = req.body.password;
  const lastName = req.body.lastName;
  const role = req.body.role;
  let token;

  if (role !== "ROLE_USER") {
    const error = new Error(
      "Signing up an user should have a role of ROLE_USER"
    );
    error.statusCode = 500;
    throw error;
  }

  bcrypt
    .hash(password, 12)
    .then((hashedPassword) => {
      token = crypto.randomBytes(32).toString("hex");

      const account = new Account({
        role: role,
        email: email,
        password: hashedPassword,
        accountVerifyToken: token,
        accountVerifyTokenExpiration: Date.now() + 3600000,
      });
      return account.save();
    })
    .then((savedAccount) => {
      const user = new User({
        firstName: firstName,
        lastName: lastName,
        account: savedAccount,
      });
      res.status(201).json({
        message: "User signed-up successfully, please Login.",
        userId: user._id,
      });
      return user.save();
    })
    .then((savedUser) => {
      try {
        const message = `Please verify your email by clicking on the link below - Find my tiffin\nClick this to verify your account.\n\nhttp://localhost:3002/auth/verify/${token} \n`;
        sendEmail({
          email: email,
          subject: "Verify your Account on Find my tiffin",
          message,
        }).then(console.log("email sent"));
      } catch (error) {
        console.log("error while sending mail");
        console.log(error.message);
      }

      res.status(201).json({
        message:
          "User signed-up successfully, please verify your email before logging in.",
        userId: savedUser._id,
      });
    })
    .catch((err) => {
      if (!err.statusCode) err.statusCode = 500;
      next(err);
    });
};

exports.verifyAccount = (req, res, next) => {
  const token = req.params.token;
  Account.findOne({
    accountVerifyToken: token,
    accountVerifyTokenExpiration: { $gt: Date.now() },
  })
    .then((account) => {
      if (!account) {
        const error = new Error(
          "Token in the url is tempered, don't try to fool me!"
        );
        error.statusCode = 403;
        throw error;
      }
      account.isVerified = true;
      account.accountVerifyToken = undefined;
      account.accountVerifyTokenExpiration = undefined;
      return account.save();
    })
    .then((account) => {
      res.json({ message: "Account verified successfully." });
    })
    .catch((err) => {
      if (!err.statusCode) err.statusCode = 500;
      next(err);
    });
};

exports.login = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  let loadedUser;

  Account.findOne({ email: email })
    .then((account) => {
      if (!account) {
        const error = new Error("Account not found");
        error.statusCode = 401;
        throw error;
      }
      loadedUser = account;
      return bcrypt.compare(password, account.password);
    })
    .then((isEqual) => {
      if (!isEqual) {
        const error = new Error("Invalid email/password combination.");
        error.statusCode = 401;
        throw error;
      }
      if (loadedUser.isVerified === false) {
        const error = new Error(
          "Verify your email before accessing the platform."
        );
        error.statusCode = 401;
        throw error;
      }
      const token = jwt.sign(
        { accountId: loadedUser._id.toString() },
        "supersecretkey-foodWebApp",
        { expiresIn: "10h" }
      );
      res.status(200).json({ message: "Logged-in successfully", token: token });
    })
    .catch((err) => {
      if (!err.statusCode) err.statusCode = 500;
      next(err);
    });
};

exports.signupSeller = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const error = new Error("Validation Failed, Incorrect data entered.");
    error.statusCode = 422;
    error.errors = errors.array();
    throw error;
  }

  if (req.files.length == 0) {
    const error = new Error("Upload an image as well.");
    error.statusCode = 422;
    throw error;
  }

  const arrayFiles = req.files.map((file) => file.path);
  const email = req.body.email;
  const name = req.body.name;
  const password = req.body.password;
  const tags = req.body.tags;
  const role = req.body.role;
  const payment = req.body.payment;
  const paymentArray = payment.split(" ");
  const minOrderAmount = req.body.minOrderAmount;
  const costForOne = req.body.costForOne;
  const phoneNo = req.body.phoneNo;
  const street = req.body.street;
  const aptName = req.body.aptName;
  const formattedAddress = req.body.formattedAddress;
  const lat = req.body.lat;
  const lng = req.body.lng;
  const locality = req.body.locality;
  const zip = req.body.zip;
  const rating = 0;

  let token;

  if (role !== "ROLE_SELLER") {
    const error = new Error(
      "Signing up a seller should have a role of ROLE_SELLER"
    );
    error.statusCode = 500;
    throw error;
  }

  bcrypt
    .hash(password, 12)
    .then((hashedPassword) => {
      token = crypto.randomBytes(32).toString("hex");

      const account = new Account({
        role: role,
        email: email,
        password: hashedPassword,
        accountVerifyToken: token,
        accountVerifyTokenExpiration: Date.now() + 3600000,
      });
      return account.save();
    })
    .then((savedAccount) => {
      const seller = new Seller({
        name: name,
        tags: tags,
        imageUrl: arrayFiles,
        minOrderAmount: minOrderAmount,
        costForOne: costForOne,
        account: savedAccount,
        payment: paymentArray,
        formattedAddress: formattedAddress,
        address: {
          street: street,
          zip: zip,
          phoneNo: phoneNo,
          locality: locality,
          aptName: aptName,
          lat: lat,
          lng: lng,
        },
        rating: rating,
      });
      res.status(201).json({
        message: "Seller signed-up successfully, please login.",
        sellerId: seller._id,
      });
      return seller.save();
    })
    .then((savedSeller) => {
      try {
        const message = `Please verify your email by clicking on the link below - Find my tiffin\nClick this to verify your account.\n\nhttp://localhost:3002/auth/verify/${token} \n`;
        sendEmail({
          email: email,
          subject: "Verify your Account on Find my tiffin",
          message,
        }).then(console.log("email sent"));
      } catch (error) {
        console.log("error while sending mail");
        console.log(error.message);
      }
      // transporter.sendMail({
      //   to: email,
      //   from: "tiffinyadm@gmail.com",
      //   subject: "Verify your Account on Tiffiny",
      //   html: `
      //     <p>Please verify your email by clicking on the link below - Tiffiny</p>
      //     <p>Click this <a href="http://localhost:3002/auth/verify/${token}">link</a> to verify your account.</p>
      //   `,
      // });
      res.status(201).json({
        message:
          "Seller signed-up successfully, please verify your email before logging in.",
        sellerId: savedSeller._id,
      });
    })
    .catch((err) => {
      if (!err.statusCode) err.statusCode = 500;
      next(err);
    });
};

exports.imagesTest = (req, res, next) => {
  if (!req.files) {
    const error = new Error("Upload an image as well.");
    error.statusCode = 422;
    throw error;
  }

  const arrayFiles = req.files.map((file) => file.path);
  console.log(arrayFiles);

  res.status(200).json({ message: "success" });
};
