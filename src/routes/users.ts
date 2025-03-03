import { FastifyPluginAsync } from "fastify";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/jwt";
import { authMiddleware } from "../middlewares/auth";

const prisma = new PrismaClient();
const SALT_ROUNDS = 10;

const userRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.get("/users", { preHandler: authMiddleware }, async (request, reply) => {
    const user = (request as any).user;
    
    if (user.role !== "admin") {
      return reply.status(403).send({ message: "Access denied" });
    }

    const users = await prisma.user.findMany({
      select: { id: true, name: true, surname: true, email: true, age: true, role: true },
    });
    return reply.send(users);
  });

  fastify.get("/users/me", { preHandler: authMiddleware }, async (request, reply) => {
    return reply.send({ user: (request as any).user });
  });

  fastify.post("/login", async (request, reply) => {
    const { email, password } = request.body as { email: string; password: string };

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return reply.status(401).send({ message: "Invalid credentials" });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return reply.status(401).send({ message: "Invalid credentials" });
    }


    const token = generateToken({ id: user.id, role: user.role });

    return reply.send({ token });
  });


  fastify.post("/users/add", async (request, reply) => {
    const { name, surname, email, password, age, role } = request.body as {
      name: string;
      surname: string;
      email: string;
      password: string;
      age: number;
      role?: string;
    };

    if (!name || !surname || !email || !password || age === undefined) {
      return reply.status(400).send({ message: "All fields are required" });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return reply.status(400).send({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const newUser = await prisma.user.create({
      data: { name, surname, email, password: hashedPassword, age, role: role || "user" },
    });

    return reply.status(201).send({ success: true, newUser });
  });

  fastify.put("/users/:id", { preHandler: authMiddleware }, async (request, reply) => {
    const { id } = request.params as { id: string };
    const idNumber = Number(id);
    if (isNaN(idNumber)) {
      return reply.status(400).send({ message: "id must be a valid number" });
    }

    const { name, surname, email, password, age, role } = request.body as {
      name?: string;
      surname?: string;
      email?: string;
      password?: string;
      age?: number;
      role?: string;
    };

    if (!name && !surname && !email && !password && age === undefined && !role) {
      return reply.status(400).send({ message: "At least one field is required to update" });
    }

    const existingUser = await prisma.user.findUnique({ where: { id: idNumber } });

    if (!existingUser) {
      return reply.status(404).send({ message: "User not found" });
    }

    const user = (request as any).user;
    if (user.id !== idNumber && user.role !== "admin") {
      return reply.status(403).send({ message: "Unauthorized" });
    }

    const updateData: any = { name, surname, email, age, role };
    if (password) {
      updateData.password = await bcrypt.hash(password, SALT_ROUNDS);
    }

    const updatedUser = await prisma.user.update({
      where: { id: idNumber },
      data: updateData,
    });

    return reply.status(200).send({ success: true, updatedUser });
  });

  fastify.delete("/users/:id", { preHandler: authMiddleware }, async (request, reply) => {
    const { id } = request.params as { id: string };
    const idNumber = Number(id);

    if (isNaN(idNumber)) {
      return reply.status(400).send({ message: "id must be a valid number" });
    }

    const user = (request as any).user;

    if (user.id !== idNumber && user.role !== "admin") {
      return reply.status(403).send({ message: "Unauthorized" });
    }

    await prisma.user.delete({ where: { id: idNumber } });

    return reply.status(200).send({ message: "User deleted successfully" });
  });
};

export default userRoutes;
