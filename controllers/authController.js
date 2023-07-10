import userModel from "../models/userModel.js";
import { comparePassword, hashPassword } from "./../helpers/authHelper.js";
import JWT from "jsonwebtoken";

export const registerController = async (req, res) => {
  try {
    const { name, email, password, phone, address, answer } = req.body;

    // validations
    if (!name) return res.send({ message: "Name is required" });
    if (!email) return res.send({ message: "Email is required" });
    if (!password) return res.send({ message: "Password is required" });
    if (!phone) return res.send({ message: "Phone is required" });
    if (!address) return res.send({ message: "Address is required" });
    if (!answer) return res.send({ message: "Answer is required" });

    // if the user exists
    const existingUser = await userModel.findOne({ email });
    if (existingUser)
      return res.status(200).send({
        success: false,
        message: "User already exists, please Log In...",
      });

    // register the user
    const hashedPassword = await hashPassword(password);

    // save the user
    const user = await new userModel({
      name,
      email,
      password: hashedPassword,
      phone,
      address,
      answer,
    }).save();

    res.status(201).send({
      success: true,
      message: "User Registered successfully",
      user,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      success: false,
      message: "Registration unsuccessful",
      err,
    });
  }
};

export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    // validation
    if (!email || !password) {
      res.status(404).send({
        success: false,
        message: "Invalid email or password",
      });
    }

    // get the user on the basis of the email
    const user = await userModel.findOne({ email });
    // if we don't get the user
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found, please register...",
      });
    }

    // compare the password
    const match = await comparePassword(password, user.password);
    // if passwor doesn't match
    if (!match) {
      return res.status(200).send({
        success: false,
        message: "Invalid password",
      });
    }
    // if password matches then create token
    const token = await JWT.sign(
      {
        _id: user._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "2d",
      }
    );
    res.status(200).send({
      success: true,
      message: "Successfully Logged In...",
      user: {
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role,
      },
      token,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      success: false,
      message: "Unsuccessful Login...",
      err,
    });
  }
};

// Forgot Password Controller
export const forgotPasswordController = async (req, res) => {
  try {
    const { email, answer, newPassword } = req.body;

    // validations
    if (!email) {
      res.status(400).send({
        message: "Email is required",
      });
    }
    if (!answer) {
      res.status(400).send({
        message: "Answer is required",
      });
    }
    if (!newPassword) {
      res.status(400).send({
        message: "New Password is required",
      });
    }

    // check if email and answer are valid then only we reset the password
    const user = await userModel.findOne({ email, answer });
    // validation
    if (!user) {
      res.status(404).send({
        success: false,
        message: "Wrong Email or Answer",
      });
    }
    const hashed = await hashPassword(newPassword);
    console.log(user);
    await userModel.findByIdAndUpdate(user._id, { password: hashed });
    res.status(200).send({
      success: true,
      message: "Password updated successfully",
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      success: false,
      message: "Something went wrong",
      err,
    });
  }
};

export const testController = (req, res) => {
  res.send("Protected Route...");
};

// update profile
export const updateProfileController = async (req, res) => {
  try {
    const { name, email, password, address, phone } = req.body;
    const user = await userModel.findById(req.user._id);
    if (password && password.length < 6) {
      return res.json({ error: "Passsword is required and 6 character long" });
    }
    const hashedPassword = password ? await hashPassword(password) : undefined;
    const updatedUser = await userModel.findByIdAndUpdate(
      req.user._id,
      {
        name: name || user.name,
        password: hashedPassword || user.password,
        phone: phone || user.phone,
        address: address || user.address,
      },
      { new: true }
    );
    res.status(200).send({
      success: true,
      message: "Profile Updated Successfully",
      updatedUser,
    });
  } catch (err) {
    res.status(500).send({
      success: false,
      message: "Couldn't update profile",
      err,
    });
  }
};
