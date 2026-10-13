import { StreamChat } from "stream-chat";
  import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({
    path: path.join(__dirname, "../../.env")
});

const apiKey = process.env.STREAM_API_KEY ;
const apiSecret = process.env.STREAM_API_SECRET ;


if (!apiKey || !apiSecret) {
  console.error(
    " STREAM_API_KEY or STREAM_API_SECRET is missing in the backend .env"
  );
}

// Created lazily so dotenv has already run by the time this is used
let streamClient = null;

const getClient = () => {
  if (!streamClient) {
    if (!process.env.STREAM_API_KEY || !process.env.STREAM_API_SECRET) {
      throw new Error("Stream API key/secret not configured on the server");
    }
    streamClient = StreamChat.getInstance(
      process.env.STREAM_API_KEY,
      process.env.STREAM_API_SECRET
    );
  }
  return streamClient;
};

// Create or update a user in Stream. Throws on failure (no silent errors).
export const upsertStreamUser = async ({ id, name, image }) => {
  const userData = { id: String(id), name: name || "User" };
  if (image) userData.image = image;

  await getClient().upsertUsers([userData]);
  return userData;
};

export const generateStreamToken = (userId) => {
  return getClient().createToken(String(userId));
};

export const getStreamClient = () => getClient();


// (https://getstream.io/chat/docs/node/push-template/)
export const upsertChatPushTemplate = async ({
  pushProviderType = "firebase",
  pushProviderName = "",
  template,
} = {}) => {
  const client = getClient();
  const defaultTemplate = JSON.stringify({
    data: {
      version: "v2",
      sender: "stream.chat",
      type: "{{ event_type }}",
      id: "{{ message.id }}",
      message_id: "{{ message.id }}",
      channel_type: "{{ channel.type }}",
      channel_id: "{{ channel.id }}",
      cid: "{{ channel.cid }}",
      receiver_id: "{{ receiver.id }}",
    },
    android: {
      priority: "high",
    },
    apns: {
      payload: {
        aps: {
          alert: {
            title: "New message from {{ sender.name }}",
            body: "{{ truncate message.text 150 }}",
          },
          badge: "{{ unread_count }}",
          sound: "default",
          "mutable-content": 1,
          "content-available": 0,
        },
      },
    },
  });

  return await client.upsertPushTemplate({
    enable_push: true,
    event_type: "message.new",
    push_provider_type: pushProviderType,
    ...(pushProviderName ? { push_provider_name: pushProviderName } : {}),
    template: template || defaultTemplate,
  });
};
