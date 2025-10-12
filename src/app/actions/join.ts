"use server";
import { validateTurnstileToken } from "next-turnstile";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { Color } from "@/generated/prisma";
import { db } from "@/lib/db";
import { randomBytes } from "crypto";
import { realtime } from "@/lib/realtime";

export const createGame = async (name: string, color: Color, token: string) => {
  const cookieStore = await cookies();
  const result = await validateTurnstileToken({
    token,
    secretKey: process.env.TURNSTILE_SECRET_KEY!,
  });
  if (!result.success) {
    throw new Error("Turnstile validation failed");
  }

  const player = await db.player.create({
    data: { name },
  });

  const inviteId = randomBytes(3).toString("hex").toUpperCase();

  const game = await db.game.create({
    data: {
      inviteId,
      player1Id: player.id,
      status: "PENDING",
    },
  });

  const accessToken = randomBytes(16).toString("hex");
  await db.token.create({
    data: {
      playerId: player.id,
      gameId: game.id,
      id: accessToken,
    },
  });

  cookieStore.set("GAME_SESSION", accessToken, {
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secure: true,
  });

  return redirect(`/lobby/${game.id}`);
};

export const verifyCode = async (code: string) => {
  const game = await db.game.findUnique({
    where: { inviteId: code },
  });
  if (!game) {
    throw new Error("Game not found");
  }
  return game;
};

export const requestJoin = async (gameId: string, name: string) => {
  const channel = realtime.channel(gameId);
  await channel.join.name.emit(name);
};

export const rejectJoin = async (gameId: string, name: string) => {
  const channel = realtime.channel(gameId);
  await channel.reject.name.emit(name);
};
