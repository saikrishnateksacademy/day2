const Ajv = require("ajv");
const addFormats = require("ajv-formats");
const ajv = new Ajv();
addFormats(ajv);

const CreateUsersSchema = {
  type: "object",
  properties: {
    first_name: { type: "string", minLength: 3 },
    last_name: { type: "string" },
    email: { type: "string", format: "email" },
    mobile_no: { type: "string", pattern: "^[0-9]{10,15}$" },
    password: { type: "string", minLength: 6 }, 
  },
  required: ["first_name", "email", "mobile_no", "password"],
  additionalProperties: false,
};

const updateUserSchema = {
  type: "object",
  properties: {
    first_name: { type: "string", minLength: 3 },
    last_name: { type: "string" },
    email: { type: "string", format: "email" },
  },
};
const validateCreateUser = ajv.compile(CreateUsersSchema);
const validateUpdateUser = ajv.compile(updateUserSchema);
module.exports = { validateCreateUser, validateUpdateUser };
