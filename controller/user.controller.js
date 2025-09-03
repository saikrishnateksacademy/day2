const { Op } = require("sequelize");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Users = require("../model/user.model");
const {
  validateCreateUser,
  validateUpdateUser,
} = require("../validators/user.validator");
const { validateListUsersQuery } = require("../validators/query.validator");

//-------------creating user------------------


const formatValidationErrors = (errors) =>
  errors.map(({ keyword, params, instancePath, message }) => {
    const field = instancePath.replace("/", "");
    switch (keyword) {
      case "format":
        return params.format === "email" ? "Invalid email format." : `${field} ${message}`;
      case "pattern":
        return instancePath === "/mobile_no" ? "Mobile number must be 10 digits." : `${field} ${message}`;
      case "minLength":
        return `${field} must be at least ${params.limit} characters long.`;
      case "required":
        return `${params.missingProperty} is required.`;
      default:
        return `${field} ${message}`;
    }
  });
 

const createUserController = async (req, res) => {
  if (!validateCreateUser(req.body)) {
    return res.status(400).json({
      success: false,
      message: "Validation failed. Please check your input.",
      errors: formatValidationErrors(validateCreateUser.errors),
    });
  }
  const saltRounds = 10;

  try {
    const { first_name, last_name, email, mobile_no, password } = req.body;
    const payload = {
      first_name,
      last_name,
      email,
      mobile_no,
      password: password ? await bcrypt.hash(password, saltRounds) : undefined,
    };

    const user = await Users.create(payload);

    return res.status(201).json({
      success: true,
      message: "User created successfully",
      data: { id: user.id, first_name, last_name, email: user.email, mobile_no },
    });
  } catch (err) {
    if (err.name === "SequelizeUniqueConstraintError") {
      return res.status(400).json({
        success: false,
        message: "Email or mobile number already exists.",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later.",
    });
  }
};

// ---------------- GET USERS ----------------
const getUsersController = async (req, res) => {
  const valid = validateListUsersQuery(req.query);
  if (!valid) {
    return res.status(400).json({ errors: validateListUsersQuery.errors });
  }

  try {
    let page = parseInt(req.query.page, 10);
    let pageSize = parseInt(req.query.page_size, 10);

    if (!Number.isInteger(page) || page < 1) page = 1;
    if (!Number.isInteger(pageSize) || pageSize < 1) pageSize = 10;

    const search =
      typeof req.query.search === "string" ? req.query.search.trim() : "";

    const limit = pageSize;
    const offset = (page - 1) * pageSize;

    let whereClause = {};
    if (search) {
      const term = `%${search.toLowerCase()}%`;
      whereClause = {
        [Op.or]: [
          { first_name: { [Op.like]: term } },
          { last_name: { [Op.like]: term } },
          { email: { [Op.like]: term } },
          { mobile_no: { [Op.like]: term } },
        ],
      };
    }

    const { rows, count } = await Users.findAndCountAll({
      where: whereClause,
      limit,
      offset,
      order: [["created_at", "DESC"]],
      attributes: { exclude: ["password"] },
    });

    res.json({
      success: true,
      data: rows,
      meta: {
        page,
        page_size: limit,
        total: count,
        total_pages: Math.max(1, Math.ceil(count / limit)),
      },
    });
  } catch (e) {
    console.error("Search error:", e);
    res.status(500).json({
      success: false,
      message: "Failed to fetch users",
      error: e.message,
    });
  }
};

// ---------------- UPDATE USER ----------------
const updateUserController = async (req, res) => {
  const valid = validateUpdateUser(req.body);
  if (!valid) {
    return res.status(400).json({
      success: false,
      message: "Validation failed. Please check your input.",
      errors: validateUpdateUser.errors,
    });
  }

  try {
    if (req.body.email) req.body.email = req.body.email.toLowerCase();
    if (req.body.password) {
      req.body.password = await bcrypt.hash(req.body.password, 10);
    }

    const [updated] = await Users.update(req.body, {
      where: { id: req.params.id },
    });

    if (updated) {
      return res.json({ success: true, message: "User updated successfully" });
    } else {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
  } catch (e) {
    return res.status(500).json({
      success: false,
      message: "Failed to update user",
      error: e.message,
    });
  }
};

// ---------------- DELETE USER ----------------
const deleteUserController = async (req, res) => {
  const { id } = req.params;

  if (!id || isNaN(Number(id))) {
    return res.status(400).json({
      success: false,
      message: "Invalid user ID",
      error: "User ID must be a valid number",
    });
  }

  try {
    const user = await Users.findByPk(id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    await user.destroy();

    return res.status(200).json({
      success: true,
      message: "User deleted successfully",
      data: { id: user.id, email: user.email },
    });
  } catch (error) {
    console.error(`Failed to delete user ${id}:`, error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete user",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// ---------------- LOGIN  ---------------

const loginController = async (req, res) => {
  try {
    const { identifier = "", password = "" } = req.body || {};
    if (!identifier.trim() || !password.trim()) {
      return res.status(400).json({ success: false, message: "Provide email/mobile and password" });
    }

    const user = await Users.findOne({
      where: { [Op.or]: [{ email: identifier.toLowerCase() }, { mobile_no: identifier }] }
    });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ success: false, message: "Invalid email/mobile or password" });
    }

    res.json({
      success: true,
      message: "Login successful",
      data: (({ id, first_name, last_name, email, mobile_no }) => ({ id, first_name, last_name, email, mobile_no }))(user)
    });
  } catch (e) {
    console.error("Login error:", e);
    res.status(500).json({ success: false, message: "Something went wrong. Please try again later." });
  }
};





module.exports = {
  createUserController,
  getUsersController,
  updateUserController,
  deleteUserController,
  loginController,
};
