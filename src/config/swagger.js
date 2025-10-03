const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Auth Backend API",
      version: "1.0.0",
      description: "API de autenticación con roles y permisos"
    },
    servers: [
      {
        url: "http://localhost:3000/api"
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {              // 🔐 esquema JWT
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT"
        }
      }
    }
  },
  apis: ["./src/routes/*.js"], // 📌 tus rutas documentadas
};

const swaggerSpec = swaggerJsDoc(options);

const swaggerDocs = (app) => {
  app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};

module.exports = swaggerDocs;
