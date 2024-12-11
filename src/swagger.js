const description = `
API for the Correctomatic server
`

const swaggerOptions = {
  openapi: {
    info: {
      title: 'Correctomatic server API',
      description,
      version: '1.0.0',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Local server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        },
        apiKeyAuth: {
          type: 'apiKey',
          in: 'header',
          name: 'x-api-key'
        }
      }
    },
    security: [{ bearerAuth: [], apiKeyAuth: [] }],
    tags: [
      {
        name: 'Grading Operations',
        description: 'Endpoints for grading operations'
      },
      {
        name: 'Assignments Management',
        description: 'Endpoints for managing assignments'
      },
      {
        name: 'Users Management',
        description: 'Endpoints for managing users'
      },
      {
        name: 'API Key Management',
        description: 'Endpoints for managing API keys'
      },
      {
        name: 'Miscellaneous',
        description: 'Miscellaneous endpoints'
      }
    ]
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
      { filename: 'theme.css', content: CUSTOM_CSS }
    ],
  },
}

export { swaggerOptions, swaggerUiOptions }
