import { Realtime, InferRealtimeEvents } from "@upstash/realtime";
import { redis } from "@/lib/redis";
import z from "zod";

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
};

export const realtime = new Realtime({ schema, redis });
export type RealtimeEvents = InferRealtimeEvents<typeof realtime>;
