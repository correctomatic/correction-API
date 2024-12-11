// This is not validated ¿?
const HELLO_RESPONSE = {
  200: {
    // type: "string"
    type: "object",
    required: ["greeting"],
    properties: {
      greeting: { const: "BANANA" }
    },
  }
}

const HELLO_QUERY_STRING = {
  type: "object",
  required: ["name"],
  properties: {
    name: { type: "string" }
  }
}

const HELLO_SCHEMA = {
  tags: ["Miscellaneous"],
  summary: "Returns a greeting",
  description: "\
**This endpoint is intended for debugging purposes**. \n \
Always returns 'Hello, World!' . \
",
  security: [],
  querystring: HELLO_QUERY_STRING,
  response: HELLO_RESPONSE
}

export {
  HELLO_SCHEMA
}
