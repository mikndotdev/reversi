"use server";
import { realtime } from "@/lib/realtime";

export const testEvent = async (message: string) => {
  await realtime.test.message.emit(message);
};
