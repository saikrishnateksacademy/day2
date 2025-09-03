const express = require("express");
const {
  createUserController,
  getUsersController,
  updateUserController,
  deleteUserController,
  loginController

} = require("../controller/user.controller.js");

const router = express.Router();
//create
router.post("/api/v1/users", createUserController);

// Get all
router.get("/api/v1/users", getUsersController);

// Update
router.put("/api/v1/users/:id", updateUserController);

router.patch("/api/v1/users/:id", updateUserController);

// Delete
router.delete("/api/v1/users/:id", deleteUserController);

// login
router.post("/api/v1/login", loginController);


module.exports = router;
