import jwt from "jsonwebtoken";

export type JWTPayload = { employeeId: string };

export function signToken(payload: JWTPayload) {
  return jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: "1d" });
}

export function verifyToken(token: string): JWTPayload {
  return jwt.verify(token, process.env.JWT_SECRET!) as JWTPayload;
}
