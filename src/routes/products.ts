import { FastifyPluginAsync, FastifyRequest, FastifyReply } from "fastify";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const productRoutes: FastifyPluginAsync = async (fastify) => {

  fastify.get("/", async (_, reply) => {
    const products = await prisma.product.findMany();
    return reply.send(products);
  });

  fastify.post("/add", async (request, reply) => {
    try {
      const { name, price } = request.body as { name: string; price: number };

      if (!name || !price) {
        return reply.status(400).send({ message: "Name and price are required" });
      }
      if (typeof name !== "string" || typeof price !== "number") {
        return reply.status(400).send({ message: "Invalid data types" });
      }

      const newProduct = await prisma.product.create({
        data: { name, price },
      });

      return reply.status(200).send({ success: true, newProduct });
    } catch (error) {
      console.error(error);
      return reply.status(500).send({ message: "Internal Server Error" });
    }
  });

  fastify.post("/delete/:id", async (request, reply) => {
    try {
      const { id } = request.params as { id: string };

      if (!id) return reply.status(400).send({ message: "Product ID is required" });

      await prisma.product.delete({
        where: { id: Number(id) },
      });

      return reply.status(200).send({ message: "Product deleted successfully" });
    } catch (error) {
      console.error(error);
      return reply.status(500).send({ message: "Internal Server Error" });
    }
  });

  fastify.post("/update/:id", async (request, reply) => {
    try {
      const { id } = request.params as { id: string };
      const { name, price } = request.body as { name?: string; price?: number };

      if (!id) {
        return reply.status(400).send({ message: "Product ID is required" });
      }

      if (name === undefined && price === undefined) {
        return reply.status(400).send({ message: "At least one field is required for update" });
      }

      const updatedProduct = await prisma.product.update({
        where: { id: Number(id) },
        data: { name, price },
      });

      return reply.status(200).send({ success: true, updatedProduct });
    } catch (error) {
      console.error(error);
      return reply.status(500).send({ message: "Internal Server Error" });
    }
  });
};

export default productRoutes;
