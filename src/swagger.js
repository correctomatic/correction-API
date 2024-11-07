const descriptions = `
TODO: Add a description of the API here.
`

const swaggerOptions = {
  swagger: {
    info: {
      title: "Correctomatic server API",
      description: descriptions,
      version: "1.0.0",
    },
    schemes: ["http", "https"],
    consumes: ["application/json"],
    produces: ["application/json"],
    tags: [
      {
        name: "Grading Operations",
        description: "Endpoints for grading-related tasks.",
      },
      {
        name: "Assignments Management",
        description: "Endpoints for managing assignments.",
      },
      {
        name: "Users Management",
        description: "Endpoints for managing users.",
      },
      {
        name: "Miscellaneous",
        description: "Misceallaneous endpoints.",
      },
    ],
  },
}

// Code is not showing correctly in the Swagger UI, so we add some custom CSS
const CUSTOM_CSS = `
.swagger-ui .markdown code {
  line-height: 1.7em;
}

.swagger-ui .markdown code, .swagger-ui .renderedMarkdown code {
  padding: 3px 5px;
}
`

const swaggerUiOptions = {
  routePrefix: "/docs",
  exposeRoute: true,
  theme: {
    title: 'Correctomatic server API',
    css: [
      { filename: 'theme.css' , content: CUSTOM_CSS }
    ],
  },
}

module.exports = {
  swaggerOptions,
  swaggerUiOptions
}
