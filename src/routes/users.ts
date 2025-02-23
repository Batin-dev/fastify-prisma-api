import { FastifyPluginAsync } from "fastify";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const userRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.get("/users", async (_, reply) => {
    const users = await prisma.user.findMany();
    return reply.send(users);
  });

  fastify.post("/users/add", async (request, reply) => {
    if (!request.body || Object.keys(request.body).length === 0) {
      return reply.status(400).send({ message: "Body cannot be empty" });
    }
    try {
      const { name, surname, email, age } = request.body as {
        name: string;
        surname: string;
        email: string;
        age: number;
      };
      if (!name || !surname || !email || age === undefined) {
        return reply
          .status(400)
          .send({ message: "name, surname, email, and age are required" });
      }
      if (
        typeof name !== "string" ||
        typeof surname !== "string" ||
        typeof email !== "string" ||
        typeof age !== "number"
      ) {
        return reply
          .status(400)
          .send({
            message:
              "name, surname, and email must be string; age must be number",
          });
      }

      const newUser = await prisma.user.create({
        data: { name, surname, email, age },
      });

      return reply.status(200).send({ success: true, newUser });
    } catch (error) {
      console.error(error);
      return reply.status(500).send({
        message: "Internal Server Error",
        error: error instanceof Error ? error.message : error,
      });
    }
  });
  fastify.post("/users/update/:id", async (request, reply) => {
    try {
      const { id } = request.params as { id: string };
      const idNumber = Number(id);

      if (isNaN(idNumber)) {
        return reply.status(400).send({ message: "id must be a valid number" });
      }

      const { name, surname, email, age } = request.body as {
        name?: string;
        surname?: string;
        email?: string;
        age?: number;
      };

      if (!name && !surname && !email && age === undefined) {
        return reply
          .status(400)
          .send({ message: "At least one field is required to update" });
      }

      const existingUser = await prisma.user.findUnique({
        where: { id: idNumber },
      });

      if (!existingUser) {
        return reply.status(404).send({ message: "User not found" });
      }

      const updatedUser = await prisma.user.update({
        where: { id: idNumber },
        data: { name, surname, email, age },
      });

      return reply.status(200).send({ success: true, updatedUser });
    } catch (error) {
      console.error(error);
      return reply.status(500).send({
        message: "Internal Server Error",
        error: error instanceof Error ? error.message : error,
      });
    }
  });

  fastify.post("/users/delete/:id", async (request, reply) => {
    try {
      const { id } = request.params as { id: string };
      const idNumber = Number(id);

      if (isNaN(idNumber)) {
        return reply.status(400).send({ message: "id must be a valid number" });
      }

      await prisma.user.delete({
        where: { id: idNumber },
      });

      return reply.status(200).send({ message: "User deleted successfully" });
    } catch (error) {
      console.error(error);
      return reply.status(500).send({
        message: "Internal Server Error",
        error: error instanceof Error ? error.message : error,
      });
    }
  });
};

export default userRoutes;
