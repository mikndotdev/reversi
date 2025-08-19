import { Hono } from "hono";
import { partyserverMiddleware } from "hono-party";
import { Server } from "partyserver";
import { D1Database } from "@cloudflare/workers-types";
import { prisma } from "./lib/prisma";

type Bindings = {
    DB: D1Database
}

export class reversi_server extends Server {
    static Options = {
        hibernate: true,
    };
}

const app = new Hono<{ Bindings: Bindings }>()
app.use("*", partyserverMiddleware());

app.get("/api/count", async (c) => {
    const db = await prisma.client(c.env.DB)
    const gameCount = await db.game.count()
    return c.json({ count: gameCount });
})

export default app;