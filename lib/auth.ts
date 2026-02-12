import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  // We deliberately do not throw at import time in case of build environments.
  console.warn(
    "[auth] JWT_SECRET is not set. Authentication routes will fail until it is configured."
  );
}

export async function hashPassword(plain: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(plain, salt);
}

export async function verifyPassword(
  plain: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}

export function signUserToken(userId: string): string {
  if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not configured");
  }

  return jwt.sign(
    { sub: userId },
    JWT_SECRET,
    {
      expiresIn: "30d",
    }
  );
}

export function verifyUserToken(token: string): string | null {
  if (!JWT_SECRET) {
    return null;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { sub?: string };
    return decoded.sub ?? null;
  } catch {
    return null;
  }
}

