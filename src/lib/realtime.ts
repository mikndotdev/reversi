import { type InferRealtimeEvents, Realtime } from "@upstash/realtime";
import z from "zod";
import { Color } from "@/generated/prisma";
import { redis } from "@/lib/redis";

const schema = {
  join: z.object({
    name: z.string(),
  }),
  accept: z.object({
    name: z.string(),
  }),
  reject: z.object({
    name: z.string(),
  }),
  test: z.object({
    message: z.string(),
  }),
  start: z.object({
    player2Name: z.string(),
  }),
  p2Ready: z.object({
    name: z.string(),
  }),
  place: z.object({
    move: z.object({
      color: z.nativeEnum(Color),
      coord: z.string(),
      flippedPieces: z.array(z.array(z.tuple([z.number(), z.number()]))),
    }),
  }),
};

export const realtime = new Realtime({ schema, redis, maxDurationSecs: 300 });
export type RealtimeEvents = InferRealtimeEvents<typeof realtime>;
