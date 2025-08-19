import { Hono } from "hono";
import { partyserverMiddleware } from "hono-party";
import { Server } from "partyserver";

// Multiple party servers
export class reversi_server extends Server {
    static Options = {
        hibernate: true,
    };
}

// Basic setup
const app = new Hono();
app.use("*", partyserverMiddleware());

export default app;