/**
 * AuthService — handles registration, login, password reset scaffolding.
 * Passwords are hashed with bcrypt; JWT carries `sub` (user id) + `role`.
 */

import bcrypt from "bcryptjs";
import jwt, { type SignOptions } from "jsonwebtoken";
import type { UserRole } from "@prisma/client";
import { prisma } from "../lib/prisma";
import { AppError } from "../utils/AppError";

function signToken(userId: string, role: UserRole) {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new AppError(500, "Server misconfiguration");
  const signOptions: SignOptions = { expiresIn: "7d" };
  return jwt.sign({ sub: userId, role }, secret, signOptions);
}

export class AuthService {
  async register(input: { email: string; password: string; name: string; phone?: string }) {
    const exists = await prisma.user.findUnique({ where: { email: input.email.toLowerCase() } });
    if (exists) throw new AppError(409, "Email already registered");
    const passwordHash = await bcrypt.hash(input.password, 12);
    const user = await prisma.user.create({
      data: {
        email: input.email.toLowerCase(),
        passwordHash,
        name: input.name,
        phone: input.phone,
        role: "USER",
      },
    });
    const token = signToken(user.id, user.role);
    return { user: sanitizeUser(user), token };
  }

  async login(input: { email: string; password: string }) {
    const user = await prisma.user.findUnique({ where: { email: input.email.toLowerCase() } });
    if (!user?.passwordHash) throw new AppError(401, "Invalid credentials");
    const ok = await bcrypt.compare(input.password, user.passwordHash);
    if (!ok) throw new AppError(401, "Invalid credentials");
    const token = signToken(user.id, user.role);
    return { user: sanitizeUser(user), token };
  }

  /**
   * Forgot password — generates opaque token (demo stores plain; production: hash token).
   */
  async requestPasswordReset(email: string) {
    const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
    if (!user) return { ok: true }; // do not leak existence
    const resetToken = `${user.id}-${Date.now()}`;
    const resetExpires = new Date(Date.now() + 1000 * 60 * 60); // 1 hour
    await prisma.user.update({
      where: { id: user.id },
      data: { resetToken, resetExpires },
    });
    // In production: send email with link `${CLIENT_URL}/reset-password?token=...`
    return { ok: true, devToken: process.env.NODE_ENV === "development" ? resetToken : undefined };
  }

  async resetPassword(token: string, newPassword: string) {
    const user = await prisma.user.findFirst({
      where: { resetToken: token, resetExpires: { gt: new Date() } },
    });
    if (!user) throw new AppError(400, "Invalid or expired token");
    const passwordHash = await bcrypt.hash(newPassword, 12);
    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash, resetToken: null, resetExpires: null },
    });
    return { ok: true };
  }

  async me(userId: string) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new AppError(404, "User not found");
    return sanitizeUser(user);
  }
}

function sanitizeUser(user: { id: string; email: string; name: string; phone: string | null; role: UserRole; avatarUrl: string | null; emailVerified: boolean }) {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    phone: user.phone,
    role: user.role,
    avatarUrl: user.avatarUrl,
    emailVerified: user.emailVerified,
  };
}
