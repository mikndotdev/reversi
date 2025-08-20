import type { D1Database } from '@cloudflare/workers-types';
import { zValidator } from '@hono/zod-validator';
import Turnstile from 'cf-turnstile';
import { Hono } from 'hono';
import { getCookie, setCookie } from 'hono/cookie';
import { partyserverMiddleware } from 'hono-party';
import { Server } from 'partyserver';
import * as z from 'zod';
import { PieceType } from '@/interfaces/gameState.ts';
import { prisma } from './lib/prisma';

export type Bindings = {
  DB: D1Database;
  TURNSTILE_SECRET: string;
};

export class reversi_server extends Server {
  static Options = {
    hibernate: true,
  };
}

const gameCreateSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  side: z.enum(PieceType),
  token: z.string(),
});

function generateInviteCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 4; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

function createBlankBoard(size = 8): PieceType[][] {
  return Array.from({ length: size }, () =>
    Array.from({ length: size }, () => PieceType.EMPTY)
  );
}

const app = new Hono<{ Bindings: Bindings }>();

app.use('*', partyserverMiddleware());

app.get('/api/count', async (c) => {
  const db = await prisma.client(c.env.DB);
  const gameCount = await db.game.count();
  return c.json({ count: gameCount });
});

app.get('/api/userinfo', async (c) => {
  const db = await prisma.client(c.env.DB);
  const id = getCookie(c, 'user_id');
  if (!id) {
    return c.json({ error: 'User not found' }, 404);
  }
  const userInfo = await db.user.findUnique({
    where: { id },
  });
  if (!userInfo) {
    return c.json({ error: 'User not found' }, 404);
  }
  return c.json({ userInfo });
});

app.post('/api/game/', zValidator('json', gameCreateSchema), async (c) => {
  const db = await prisma.client(c.env.DB);
  const { name, side, token } = c.req.valid('json');
  let userId = getCookie(c, 'user_id');
  let user;

  const turnstile = Turnstile(c.env.TURNSTILE_SECRET);
  const result = await turnstile(token);

  if (!result.success) {
    return c.json({ error: 'Turnstile verification failed' }, 401);
  }

  if (userId) {
    user = await db.user.update({
      where: { id: userId },
      data: { name, pieceType: side },
    });
  } else {
    user = await db.user.create({
      data: { name, pieceType: side },
    });
    setCookie(c, 'user_id', user.id, { path: '/', httpOnly: true });
    userId = user.id;
  }

  const inviteCode = generateInviteCode();
  const boardState = JSON.stringify(createBlankBoard());
  const game = await db.game.create({
    data: {
      hostId: userId,
      boardState,
      inviteCode,
    },
  });

  return c.json({ userId, user, game });
});

export default app;
export type AppType = typeof app;
