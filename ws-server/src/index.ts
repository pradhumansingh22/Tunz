import { prismaClient } from '../../db/db'
import { createNodeWebSocket } from "@hono/node-ws";
import { Hono } from "hono";
import { serve } from "@hono/node-server";

const app = new Hono();

const { injectWebSocket, upgradeWebSocket } = createNodeWebSocket({ app });

app.get(
  "/ws",
  upgradeWebSocket((c) => ({
    // https://hono.dev/helpers/websocket
  }))
);

const server = serve(app);
injectWebSocket(server);

