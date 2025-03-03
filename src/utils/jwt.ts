import jwt from "jsonwebtoken";

const SECRET_KEY = "your_secret_key";

export const generateToken = (user: { id: number; role: string }) => {
  return jwt.sign(user, SECRET_KEY, { expiresIn: "1h" });
};

export const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, SECRET_KEY);
  } catch (error) {
    return null;
  }
};
