# Get Started

Upstash Realtime is the easiest way to add realtime features to any Next.js project.

<Frame>
  <img src="https://raw.githubusercontent.com/upstash/realtime/refs/heads/main/public/thumbnail.png" alt="Upstash Realtime" />
</Frame>

## Why Upstash Realtime?

* ⏰ Setup takes 60 seconds
* 🧨 Clean APIs & first-class TypeScript support
* ⚡ Extremely fast, zero dependencies, 1.9kB gzipped
* 💻 Deploy anywhere: Vercel, Netlify, etc.
* 💎 100% type-safe using zod v4 or zod mini
* 🔌 Automatic connection management w/ message delivery guarantee
* 🔋 Built-in middleware and helpers - batteries included
* 📶 HTTP-based: Redis streams & server-sent events

***

## Quickstart

Get Upstash Realtime running in your Next.js app in under 60 seconds.

### 1. Installation

<CodeGroup>
  ```bash npm theme={"system"}
  npm install @upstash/realtime
  ```

  ```bash yarn theme={"system"}
  yarn add @upstash/realtime
  ```

  ```bash pnpm theme={"system"}
  pnpm add @upstash/realtime
  ```

  ```bash bun theme={"system"}
  bun install @upstash/realtime
  ```
</CodeGroup>

### 2. Configure Upstash Redis

Upstash Realtime is powered by Redis. Grab your credentials from the [Upstash Console](https://console.upstash.com).

<Frame>
  <img src="https://mintcdn.com/upstash/eu0laKPu7u_-Kw04/img/getting_started/database.png?fit=max&auto=format&n=eu0laKPu7u_-Kw04&q=85&s=4530264625c10bdf334129ec8b367511" width="100%" data-og-width="1590" data-og-height="1080" data-path="img/getting_started/database.png" data-optimize="true" data-opv="3" srcset="https://mintcdn.com/upstash/eu0laKPu7u_-Kw04/img/getting_started/database.png?w=280&fit=max&auto=format&n=eu0laKPu7u_-Kw04&q=85&s=729b8c0843969c86866b06e22747c785 280w, https://mintcdn.com/upstash/eu0laKPu7u_-Kw04/img/getting_started/database.png?w=560&fit=max&auto=format&n=eu0laKPu7u_-Kw04&q=85&s=d44be677d29134227ff6839fbfc10674 560w, https://mintcdn.com/upstash/eu0laKPu7u_-Kw04/img/getting_started/database.png?w=840&fit=max&auto=format&n=eu0laKPu7u_-Kw04&q=85&s=414a590eb3c8ed98001a5a781a6268bf 840w, https://mintcdn.com/upstash/eu0laKPu7u_-Kw04/img/getting_started/database.png?w=1100&fit=max&auto=format&n=eu0laKPu7u_-Kw04&q=85&s=eca30f6532a78f7f25952b41beac50d5 1100w, https://mintcdn.com/upstash/eu0laKPu7u_-Kw04/img/getting_started/database.png?w=1650&fit=max&auto=format&n=eu0laKPu7u_-Kw04&q=85&s=e60ccc845ab5a2a2b4fb9d66ac0fe948 1650w, https://mintcdn.com/upstash/eu0laKPu7u_-Kw04/img/getting_started/database.png?w=2500&fit=max&auto=format&n=eu0laKPu7u_-Kw04&q=85&s=b999e96686847b5aeeebc960cf2d5a30 2500w" />
</Frame>

Add them to your environment variables:

```bash title=".env" theme={"system"}
UPSTASH_REDIS_REST_URL=https://striking-osprey-20681.upstash.io
UPSTASH_REDIS_REST_TOKEN=AVDJAAIjcDEyZ...
```

Create a Redis instance:

```typescript title="lib/redis.ts" theme={"system"}
import { Redis } from "@upstash/redis"

export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
})
```

### 3. Define Event Schema

Define the structure of realtime events in your app:

```typescript title="lib/realtime.ts" theme={"system"}
import { Realtime, InferRealtimeEvents } from "@upstash/realtime"
import { redis } from "./redis"
import z from "zod"

const schema = {
  notification: z.object({
    alert: z.string(),
  }),
}

export const realtime = new Realtime({ schema, redis })
export type RealtimeEvents = InferRealtimeEvents<typeof realtime>
```

### 4. Create Realtime Route Handler

Create your realtime endpoint under `/api/realtime/route.ts`:

<Warning>
  It's important that your route matches this path exactly: `/api/realtime/route.ts`
</Warning>

```typescript title="app/api/realtime/route.ts" theme={"system"}
import { handle } from "@upstash/realtime"
import { realtime } from "@/lib/realtime"

export const GET = handle({ realtime })
```

### 5. Emit Events

From any server component or API route:

```typescript title="app/api/notify/route.ts" theme={"system"}
import { realtime } from "@/lib/realtime"

export const POST = async () => {
  // 👇 100% type-safe
  await realtime.notification.alert.emit("Hello world")
  return new Response("OK")
}
```

### 6. Subscribe to Events

In your client components:

```typescript title="app/components/notifications.tsx" theme={"system"}
"use client"

import { useRealtime } from "@upstash/realtime/client"
import type { RealtimeEvents } from "@/lib/realtime"

export default function Notifications() {
  useRealtime<RealtimeEvents>({
    events: {
      notification: {
        alert: (data) => console.log(data),
      },
    },
  })

  return <div>Listening for events...</div>
}
```

<Check>
  That's it! Your app is now listening for realtime events with full type safety. 🎉
</Check>

## Next Steps

<CardGroup cols={2}>
  <Card title="Channels" icon="tower-broadcast" href="/realtime/features/channels">
    Scope events to specific rooms or channels
  </Card>

  <Card title="Middleware" icon="shield" href="/realtime/features/middleware">
    Add authentication and authorization
  </Card>
</CardGroup>

# Channels

Channels allow you to scope events to specific people or rooms. Perfect for chat rooms, realtime workspaces, or multi-tenant applications.

## Basic Usage

Emit events to a specific channel:

```typescript route.ts theme={"system"}
const channel = realtime.channel("user-123")

// 👇 emit to a specific channel:
await channel.notification.alert.emit("Hello user123!")
```

Subscribe to a specific channel:

```tsx page.tsx theme={"system"}
"use client"

import { useRealtime } from "@upstash/realtime/client"
import type { RealtimeEvents } from "@/lib/realtime"

export default function Page() {
  useRealtime<RealtimeEvents>({
    // 👇 subscribe to a specific channel:
    channel: "user-123",
    events: {
      notification: {
        alert: (data) => console.log(data),
      },
    },
  })

  return <>...</>
}
```

## Channel Patterns

<AccordionGroup>
  <Accordion title="User-Specific Channels">
    Send notifications to individual users:

    ```typescript route.ts theme={"system"}
    await realtime.channel(`user-${userId}`).notification.alert.emit("You have a new message")
    ```

    ```typescript page.tsx theme={"system"}
    useRealtime<RealtimeEvents>({
      channel: `user-${currentUser.id}`,
      events: { /* ... */ },
    })
    ```
  </Accordion>

  <Accordion title="Room-Based Channels">
    Broadcast to all users in a room:

    ```typescript route.ts theme={"system"}
    await realtime.channel(`room-${roomId}`).message.new.emit({
      text: "Hello everyone!",
      sender: "Alice"
    })
    ```
  </Accordion>

  <Accordion title="Team Workspaces">
    Scope events to team workspaces:

    ```typescript route.ts theme={"system"}
    await realtime.channel(`team-${teamId}`).update.project.emit({
      project: "Website Redesign",
      status: "In Progress"
    })
    ```
  </Accordion>
</AccordionGroup>

## Dynamic Channels

Switch channels dynamically based on user navigation:

```tsx page.tsx theme={"system"}
"use client"

import { useState } from "react"
import { useRealtime } from "@upstash/realtime/client"

export default function Page() {
  const [roomId, setRoomId] = useState("lobby")

  useRealtime<RealtimeEvents>({
    channel: roomId,
    events: {
      chat: {
        message: (data) => console.log(`[${roomId}]`, data),
      },
    },
  })

  return (
    <div>
      <button onClick={() => setRoomId("lobby")}>Join Lobby</button>
      <button onClick={() => setRoomId("room-1")}>Join Room 1</button>
    </div>
  )
}
```

## Broadcasting to Multiple Channels

Emit to multiple channels simultaneously:

```typescript route.ts theme={"system"}
const channels = ["room-1", "room-2", "room-3"]

await Promise.all(
  channels.map((c) => {
    const channel = realtime.channel(c)
    await channel.announcement.broadcast.emit(`Hi channel ${channelName}!`)
  })
)
```

## Channel Security

Combine channels with [middleware](/realtime/features/middleware) for secure access control:

```typescript title="app/api/realtime/route.ts" theme={"system"}
import { handle } from "@upstash/realtime"
import { realtime } from "@/lib/realtime"
import { currentUser } from "@/auth"

export const GET = handle({
  realtime,
  middleware: async ({ request, channel }) => {
    const user = await currentUser(request)

    if (!user.canAccessChannel(channel)) {
      return new Response("Unauthorized", { status: 401 })
    }
  },
})
```

<Card title="Authenticate Realtime Requests" icon="shield" href="/realtime/features/middleware">
  See the middleware documentation for authentication examples
</Card>

# Middleware & Authentication

Protect your realtime endpoints with custom authentication and authorization logic.

## Basic Middleware

Add middleware to your realtime endpoint:

```typescript api/realtime/route.ts theme={"system"}
import { handle } from "@upstash/realtime"
import { realtime } from "@/lib/realtime"
import { currentUser } from "@/auth"

export const GET = handle({
  realtime,
  middleware: async ({ request, channel }) => {
    const user = await currentUser(request)

    if (!user) {
      return new Response("Unauthorized", { status: 401 })
    }
  },
})
```

## Middleware API

The middleware function receives:

<ParamField path="request" type="Request">
  The incoming HTTP Request object
</ParamField>

<ParamField path="channel" type="string" default="default">
  The channel the client is attempting to connect to
</ParamField>

<ResponseField name="return">
  * Return `undefined` or nothing to allow the connection - Return a `Response` object to
    block the connection with a custom error
</ResponseField>

## Authentication Patterns

<AccordionGroup>
  <Accordion title="Session-Based Auth">
    Verify user sessions before allowing connections:

    ```typescript api/realtime/route.ts theme={"system"}
    import { getSession } from "@/auth"

    export const GET = handle({
      realtime,
      middleware: async ({ request }) => {
        const session = await getSession(request)

        if (!session?.user) {
          return new Response("Please sign in", { status: 401 })
        }
      },
    })
    ```
  </Accordion>

  <Accordion title="Token-Based Auth">
    Validate JWT tokens or API keys:

    ```typescript api/realtime/route.ts theme={"system"}
    import { verifyToken } from "@/auth"

    export const GET = handle({
      realtime,
      middleware: async ({ request }) => {
        const token = request.headers.get("Authorization")?.replace("Bearer ", "")

        if (!token) {
          return new Response("Missing token", { status: 401 })
        }

        const payload = await verifyToken(token)
        if (!payload) {
          return new Response("Invalid token", { status: 401 })
        }
      },
    })
    ```
  </Accordion>

  <Accordion title="Channel Permissions">
    Verify users can access specific channels:

    ```typescript api/realtime/route.ts theme={"system"}
    export const GET = handle({
      realtime,
      middleware: async ({ request, channel }) => {
        const user = await currentUser(request)

        if (channel === user.id) {
          return
        }

        if (channel !== user.id) {
          return new Response("You can only access your own channel", { status: 403 })
        }
      },
    })
    ```
  </Accordion>

  <Accordion title="Role-Based Access">
    Control access based on user roles:

    ```typescript api/realtime/route.ts theme={"system"}
    export const GET = handle({
      realtime,
      middleware: async ({ request, channel }) => {
        const user = await currentUser(request)

        if (channel?.startsWith("admin-") && user.role !== "admin") {
          return new Response("Admin access required", { status: 403 })
        }

        if (channel?.startsWith("team-")) {
          const teamId = channel.replace("team-", "")
          const isMember = await checkTeamMembership(user.id, teamId)

          if (!isMember) {
            return new Response("Not a team member", { status: 403 })
          }
        }
      },
    })
    ```
  </Accordion>
</AccordionGroup>

## Custom Error Messages

Return detailed error responses:

```typescript api/realtime/route.ts theme={"system"}
export const GET = handle({
  realtime,
  middleware: async ({ request, channel }) => {
    const user = await currentUser(request)

    if (!user) {
      return new Response("Authentication required", { status: 401 })
    }

    if (!user.isVerified) {
      return new Response("Verify your email", { status: 403 })
    }
  },
})
```

## Rate Limiting

Combine with Upstash Ratelimit for connection throttling:

```typescript api/realtime/route.ts theme={"system"}
import { Ratelimit } from "@upstash/ratelimit"
import { redis } from "@/lib/redis"

const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, "60 s"),
})

export const GET = handle({
  realtime,
  middleware: async ({ request }) => {
    const ip = request.headers.get("x-forwarded-for") ?? "anonymous"
    const { success } = await ratelimit.limit(ip)

    if (!success) {
      return new Response("Too many connections", { status: 429 })
    }
  },
})
```

## Multi-Tenant Applications

To make sure users only access their organization's data:

```typescript api/realtime/route.ts theme={"system"}
export const GET = handle({
  realtime,
  middleware: async ({ request, channel }) => {
    const user = await currentUser(request)
    const orgId = channel?.split("-")[0]

    if (orgId !== user.organizationId) {
      return new Response("Access denied", { status: 403 })
    }
  },
})
```
# Deployment

Configure Upstash Realtime for optimal performance on serverless platforms.

<Note>
  Deploy Upstash Realtime to providers that bill based on active CPU time. Great places to
  deploy are Vercel with Fluid Compute enabled, Cloudflare, Railway, a personal VPS or any
  other service that does not bill based on connection duration.
</Note>

## Deploying to Vercel

To deploy Upstash Realtime to Vercel, [enable Fluid Compute](https://vercel.com/docs/fluid-compute#enable-for-entire-project) for your project. For new projects, this is enabled by default.

Fluid Compute allows for less cold-starts, has much higher function timeouts compared to serverless functions, and most importantly **only bills for active CPU time**.

That way, you're only billed for actual message processing time, not connection duration.

<Frame>
  <img src="https://mintcdn.com/upstash/IhGKcftpCFCMbFa7/img/realtime/vercel-fluid-enabled.png?fit=max&auto=format&n=IhGKcftpCFCMbFa7&q=85&s=8e435be20d9e2df4a8614a298e1d9045" data-og-width="1585" width="1585" data-og-height="876" height="876" data-path="img/realtime/vercel-fluid-enabled.png" data-optimize="true" data-opv="3" srcset="https://mintcdn.com/upstash/IhGKcftpCFCMbFa7/img/realtime/vercel-fluid-enabled.png?w=280&fit=max&auto=format&n=IhGKcftpCFCMbFa7&q=85&s=ed2ded1fa339a85100951f28e538c954 280w, https://mintcdn.com/upstash/IhGKcftpCFCMbFa7/img/realtime/vercel-fluid-enabled.png?w=560&fit=max&auto=format&n=IhGKcftpCFCMbFa7&q=85&s=74a48de000159e68adf24dcc73845ec5 560w, https://mintcdn.com/upstash/IhGKcftpCFCMbFa7/img/realtime/vercel-fluid-enabled.png?w=840&fit=max&auto=format&n=IhGKcftpCFCMbFa7&q=85&s=4a3dd60fc3da2ca6f9dad002a08ce8b7 840w, https://mintcdn.com/upstash/IhGKcftpCFCMbFa7/img/realtime/vercel-fluid-enabled.png?w=1100&fit=max&auto=format&n=IhGKcftpCFCMbFa7&q=85&s=5a7c25e835f3b1476cdf8c96ac6ca059 1100w, https://mintcdn.com/upstash/IhGKcftpCFCMbFa7/img/realtime/vercel-fluid-enabled.png?w=1650&fit=max&auto=format&n=IhGKcftpCFCMbFa7&q=85&s=35a68e28e8417005b96dcbaff89ce952 1650w, https://mintcdn.com/upstash/IhGKcftpCFCMbFa7/img/realtime/vercel-fluid-enabled.png?w=2500&fit=max&auto=format&n=IhGKcftpCFCMbFa7&q=85&s=23e2da2c9842686b61dc50879ac4cd9b 2500w" />
</Frame>

## Billing Example

Traditional serverless connection billing:

```plaintext Serverless Billing theme={"system"}
Connection duration: 5 minutes
Billing: 5 minutes = $$$
```

Upstash Realtime with fluid compute:

```plaintext Fluid Compute Billing theme={"system"}
Connection duration: 5 minutes
Active processing: 2 seconds
Billing: 2 seconds x CPU cost = $
```

## Automatic Reconnection

The client automatically reconnects before your function timeout:

```tsx page.tsx theme={"system"}
"use client"

import { useRealtime } from "@upstash/realtime/client"

export default function Component() {
  // 👇 'connecting' | 'connected' | 'reconnecting' | 'disconnected'
  const { status } = useRealtime<RealtimeEvents>({
    events: {
      notification: {
        alert: (data) => console.log(data),
      },
    },
  })

  return <div>Status: {status}</div>
}
```

## Message Delivery Guarantee

Upstash Realtime is powered by Redis Streams:

<Steps>
  <Step title="Client Connects">Establishes connection and subscribes to stream</Step>
  <Step title="Timeout Approaching">Client disconnects before function timeout</Step>
  <Step title="Automatic Reconnection">Client reconnects in milliseconds</Step>
  <Step title="Stream Replay">Redis auto-replays all messages sent during reconnect</Step>
</Steps>

# Connection Control

Enable or disable connections dynamically:

```tsx page.tsx theme={"system"}
"use client"

import { useState } from "react"
import { useRealtime } from "@upstash/realtime/client"
import type { RealtimeEvents } from "@/lib/realtime"

export default function Page() {
  const [enabled, setEnabled] = useState(true)

  const { status } = useRealtime<RealtimeEvents>({
    enabled,
    events: {
      notification: {
        alert: (data) => console.log(data),
      },
    },
  })

  return (
    <div>
      <button onClick={() => setEnabled((prev) => !prev)}>
        {enabled ? "Disconnect" : "Connect"}
      </button>
      <p>Status: {status}</p>
    </div>
  )
}
```

## Connection States

The `status` value indicates the current connection state:

<ParamField path="connecting" type="string">
  Initial connection is being established
</ParamField>

<ParamField path="connected" type="string">
  Active connection, receiving events
</ParamField>

<ParamField path="reconnecting" type="string">
  Reconnecting after timeout or network interruption
</ParamField>

<ParamField path="disconnected" type="string">
  Connection closed (either by setting `enabled: false` or error)
</ParamField>

## Best Practices

Establish a realtime connection only when needed:

```tsx page.tsx theme={"system"}
"use client"

import { useRealtime } from "@upstash/realtime/client"

export default function Page({ userId }: { userId?: string }) {
  useRealtime<RealtimeEvents>({
    // 👇 only connect if userId exists
    enabled: Boolean(userId),
    channel: `user-${userId}`,
    events: {
      notification: {
        alert: (data) => console.log(data),
      },
    },
  })

  return <div>Notifications {userId ? "enabled" : "disabled"}</div>
}
```
