import Fastify from "fastify";
import userRoutes from "./routes/users";
import swagger from "@fastify/swagger";
import swaggerUI from "@fastify/swagger-ui";
import cors from "@fastify/cors"; // CORS ekliyoruz
import productRoutes from "./routes/products";


const fastify = Fastify();

fastify.register(cors, {
  origin: "*",
  methods: ["GET", "POST", "DELETE", "PUT"],
});

fastify.register(swagger, {
  openapi: {
    info: {
      title: "Fastify API",
      description: "Fastify + Prisma + SQLite API Dokümantasyonu",
      version: "1.0.0",
    },
    servers: [{ url: "http://localhost:3000" }],
  },
});

fastify.register(swaggerUI, {
  routePrefix: "/docs",
  staticCSP: true,
  transformSpecificationClone: true,
});

fastify.register(userRoutes, { prefix: "/users" });
fastify.register(productRoutes, { prefix: "/products" });

fastify.setNotFoundHandler((request, reply) => {
  reply.status(404).send({
    error: "Not Found",
    message: `The route ${request.method} ${request.url} does not exist.`,
    statusCode: 404,
  });
});

const serverport = 3000;

fastify.listen({ port: serverport }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`🚀 Server running at ${address}`);
});
