const descriptions = `
TODO: Add a description of the API here.
`

const swaggerOptions = {
  openapi:{
    info: {
      title: 'Correctomatic server API',
      description: 'API para operaciones de calificación y gestión',
      version: '1.0.0',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Servidor local'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    },
    security: [{ bearerAuth: [] }],
    tags: [
      {
        name: 'Grading Operations',
        description: 'Endpoints para tareas de calificación'
      },
      {
        name: 'Assignments Management',
        description: 'Endpoints para gestión de asignaciones'
      },
      {
        name: 'Users Management',
        description: 'Endpoints para gestión de usuarios'
      },
      {
        name: 'Miscellaneous',
        description: 'Endpoints misceláneos'
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
      { filename: 'theme.css' , content: CUSTOM_CSS }
    ],
  },
}

module.exports = {
  swaggerOptions,
  swaggerUiOptions
}
