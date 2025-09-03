
const Ajv = require("ajv");
const ajv = new Ajv({ coerceTypes: true, useDefaults: true });

const listUsersQuerySchema = {
  type: "object",
  properties: {
    page: { type: ["integer", "string"], minimum: 1, default: 2 },
    page_size: { type: ["integer", "string"], minimum: 1, maximum: 100, default: 6 },
    search: { type: "string" }
  },
  additionalProperties: true
};

const validateListUsersQuery = ajv.compile(listUsersQuerySchema);
module.exports = { validateListUsersQuery };
