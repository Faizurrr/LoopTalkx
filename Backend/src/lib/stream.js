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