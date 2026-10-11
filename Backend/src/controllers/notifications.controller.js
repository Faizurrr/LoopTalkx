// import FriendRequest from "../models/friendrequest.model.js";
// import User from '../models/user.model.js';
const clients = new Map(); // userId -> Set of response objects

export const sseConnect = (req, res) => {
  const userId = String( req.user._id || req.user.id); 

  res.set({
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache, no-transform",
    Connection: "keep-alive",
    "X-Accel-Buffering": "no", // stops nginx from buffering the stream
  });
  res.flushHeaders();
  res.write("retry: 5000\n\n"); // browser reconnects after 5s if dropped

  if (!clients.has(userId)) clients.set(userId, new Set());
  clients.get(userId).add(res);

  // heartbeat so proxies don't close an idle connection
  const heartbeat = setInterval(() => res.write(": ping\n\n"), 25000);

  req.on("close", () => {
    clearInterval(heartbeat);
    clients.get(userId)?.delete(res);
    if (clients.get(userId)?.size === 0) clients.delete(userId);
  });
};

// call this from any controller to push an event to one user
export const sendToUser = (userId, event, data) => {
  const userClients = clients.get(String(userId));
  if (!userClients) return;
  for (const res of userClients) {
    res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
  }
};