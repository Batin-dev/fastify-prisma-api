import { FastifyReply, FastifyRequest } from "fastify";
import { verifyToken } from "../utils/jwt";

export const authMiddleware = (request: FastifyRequest, reply: FastifyReply, done: Function) => {
  const authHeader = request.headers.authorization;
  if (!authHeader) {
    return reply.status(401).send({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  const decoded = verifyToken(token);
  if (!decoded) {
    return reply.status(403).send({ message: "Invalid token" });
  }

  (request as any).user = decoded;
  done();
};
