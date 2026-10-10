<div align="center">

# 🌐 LoopTalk

**A language exchange platform. Find native speakers, make friends, and practice through real-time chat and video calls, with an AI coach that corrects your messages as you learn.**

[Live Demo](https://looptalk-sand.vercel.app) · [Report a Bug](https://github.com/Faizurrr/LoopTalkx/issues) · [Request a Feature](https://github.com/Faizurrr/LoopTalkx/issues)

![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=flat-square&logo=node.js&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=flat-square&logo=mongodb&logoColor=white)
![Stream](https://img.shields.io/badge/Stream-Chat%20%26%20Video-005FFF?style=flat-square)
![Tailwind](https://img.shields.io/badge/Tailwind-DaisyUI-38B2AC?style=flat-square&logo=tailwindcss&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white)

</div>

---

## Table of Contents

- [About](#about)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [How It Works](#how-it-works)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Reference](#api-reference)
- [Database Schema](#database-schema)
- [App Routes](#app-routes)
- [Supported Languages](#supported-languages)
- [Contributing](#contributing)
- [Author](#author)
- [License](#license)

---

## About

Learning a language is easier with a real conversation partner. **LoopTalk** connects learners around the world through a *language swap*: you tell the app which language you speak natively and which one you want to learn, and it recommends people who speak your target language and want to learn yours.

Once you connect, you can chat in real time, share files and images, and jump into a video call, all from one interface. While you chat, the built-in **AI Coach** can check your message and correct it in the language you are learning, so you learn from every conversation.

---

## Features

### Authentication and onboarding
- Register with full name, username, email and password.
- Log in with email and password. A JWT is issued on success (7-day expiry).
- Protected routes redirect unauthenticated users to `/login`.
- New users must complete an onboarding step (bio, native language, learning language, city) before reaching the main app.
- Random avatar generation via DiceBear, with a one-click shuffle.

### Matching and discovery
- **Smart recommendations** based on language swap (your native ↔ their learning, and vice versa), with a city-based fallback.
- **Live user search** in the navbar, debounced at 400 ms to keep API calls low.
- Send a friend request straight from recommendations or search results.

### Friends and requests
- Send, accept and reject friend requests.
- Duplicate and self-request prevention on the backend.
- Dedicated notifications page for pending incoming requests.
- Friends page with client-side filtering by name or username.

### Real-time chat (Stream Chat)
- Direct messages with a custom chat UI: header with online status, attachment button, and send button.
- Image and file attachments, previewed before sending.
- Deterministic channel IDs so each pair of users always shares one conversation.

### AI Coach
- A sparkle button in the chat input sends your draft message to the AI Coach.
- The coach corrects the message in **your learning language**, as set during onboarding, so the feedback matches what you are studying.
- Works directly inside the conversation: no copying text into a separate tool.
- Handled by a protected backend endpoint (`POST /api/ai/correct`), so the AI provider key never reaches the browser.

### Video calling (Stream Video)
- Start a call from any chat; a shareable call link is posted into the conversation.
- Call page built with Stream's `SpeakerLayout` and `CallControls`.
- Automatic redirect when the call ends.

### UI and UX
- Multiple DaisyUI themes, with the selection persisted through a Zustand store.
- Sticky, blurred navbar with search, theme switcher, notifications and profile menu.
- Skeleton loaders and optimistic list updates.
- Route guards (`ProtectedRoute`, `OnboardingRoute`, `PublicOnlyRoute`) that react to login and logout without a page reload.

---

## Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 19, Vite, React Router v7, Tailwind CSS + DaisyUI, Zustand, Headless UI, Lucide React, react-hot-toast |
| **Realtime** | Stream Chat React, `stream-chat`, `@stream-io/video-react-sdk` |
| **Backend** | Node.js, Express, MongoDB, Mongoose |
| **AI** | LLM API for message correction (AI Coach), called from the backend |
| **Security** | JWT (`jsonwebtoken`), `bcryptjs` (12 salt rounds), CORS |
| **Tooling** | nodemon, oxlint, dotenv |

---

## How It Works

**Recommendation algorithm.** `getRecommendedFriends` works in two tiers:

1. **Best match:** users whose native language is your learning language *and* whose learning language is your native language.
2. **Fallback:** if there is no perfect swap, users who share at least one language match or the same city (up to 10 results).

Existing friends and users with accepted or rejected requests are excluded.

**Auth flow.** The token and user object are stored in `localStorage`. A custom `auth-change` event is dispatched on login and logout so route guards re-evaluate instantly.

**Stream integration.**
- *Chat:* the `StreamChat` client is created when `ChatPage` mounts. The backend upserts both users into Stream (`/api/chat/token`, `/api/chat/sync-user/:id`) before the channel is created. Channel ID: `[myId, targetId].sort().join("-")`.
- *Video:* the `StreamVideoClient` is created when `CallPage` mounts. The call ID reuses the chat channel ID, and the call link is sent as a chat message.

**AI Coach flow.**
1. The user types a message in the chat input and clicks the sparkle button.
2. The frontend sends the message to `POST /api/ai/correct` with the user's JWT.
3. The backend reads the user's learning language from their profile and asks the AI model to correct the message in that language.
4. The corrected version is returned to the client.

The AI provider key stays on the server in `Backend/.env`, and the endpoint is behind the same JWT middleware as the rest of the API.

---

## Project Structure

```
LoopTalkx/
├── Frontend/
│   ├── public/
│   └── src/
│       ├── Pages/            # Home, ChatPage, CallPage, Friends, Notifications,
│       │                     # Profile, OnBoardingPage, login, register, ...
│       ├── Components/
│       │   ├── Common/       # Navbar, Footer, SideBar, ThemeSelector, CallButton, ChatLoader
│       │   └── Layout/       # SearchBar
│       ├── context/          # AuthContext
│       ├── store/            # useThemeStore (Zustand)
│       ├── Helper/           # Auth and onboarding helpers
│       ├── constants/
│       ├── App.jsx           # Router and route guards
│       └── main.jsx
│
└── Backend/
    └── src/
        ├── server.js
        ├── config/           # db.js (MongoDB connection)
        ├── models/           # user.model.js, friendrequest.model.js
        ├── controllers/      # auth, user, profile, friendrequest, friendlist, chat, search, ai
        ├── routes/
        ├── middlewares/      # auth.middleware.js (JWT protect)
        └── lib/              # stream.js (Stream server client)
```

---

## Getting Started

### Prerequisites
- Node.js v18 or later
- npm v9 or later
- A MongoDB connection string (local or [MongoDB Atlas](https://www.mongodb.com/atlas))
- A [Stream](https://getstream.io) account with Chat and Video enabled (API key and secret)
- An API key for the AI provider used by the AI Coach

### 1. Clone the repository
```bash
git clone https://github.com/Faizurrr/LoopTalkx.git
cd LoopTalkx
```

### 2. Set up the backend
```bash
cd Backend
npm install
```
Create `Backend/.env` (see [Environment Variables](#environment-variables)), then start the server:
```bash
npm run dev
```
The API runs at `http://localhost:5001`.

### 3. Set up the frontend
```bash
cd ../Frontend
npm install
```
Create `Frontend/.env`, then start the dev server:
```bash
npm run dev
```
The app runs at `http://localhost:5173`.

### Available scripts

| Where | Command | Description |
|---|---|---|
| Backend | `npm run dev` | Start with nodemon (hot reload) |
| Backend | `npm start` | Start with node |
| Frontend | `npm run dev` | Vite dev server |
| Frontend | `npm run build` | Production build to `dist/` |
| Frontend | `npm run preview` | Preview the production build |
| Frontend | `npm run lint` | Lint with oxlint |

---

## Environment Variables

**`Backend/.env`**

```env
PORT=5001
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/looptalkx
JWT_SECRET=your_jwt_secret
STREAM_API_KEY=your_stream_api_key
STREAM_API_SECRET=your_stream_api_secret
AI_API_KEY=your_ai_provider_api_key
CLIENT_URL=http://localhost:5173
```

**`Frontend/.env`**

```env
VITE_BACKEND_URL=http://localhost:5001
VITE_STREAM_API_KEY=your_stream_api_key
```

| Variable | Required | Description |
|---|---|---|
| `PORT` | No | Server port (default `5001`) |
| `MONGO_URI` | Yes | MongoDB connection string |
| `JWT_SECRET` | Yes | Secret used to sign JWTs |
| `STREAM_API_KEY` | Yes | Stream API key (backend and frontend) |
| `STREAM_API_SECRET` | Yes | Stream API secret (backend only) |
| `AI_API_KEY` | Yes (for AI Coach) | API key for the AI provider used to correct messages (backend only) |
| `CLIENT_URL` | No | Frontend origin for CORS (default `http://localhost:5173`) |
| `VITE_BACKEND_URL` | Yes | Backend base URL used by the frontend |
| `VITE_STREAM_API_KEY` | Yes | Stream API key used by the frontend |

> Never commit `.env` files, your Stream secret, or your AI provider key.

---

## API Reference

Protected endpoints require the header `Authorization: Bearer <token>`.

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | No | Register a new user |
| `POST` | `/api/auth/login` | No | Log in and receive a JWT |
| `GET` | `/api/auth/me` | Yes | Get the logged-in user |
| `GET` | `/api/users/me` | Yes | Get the current user's profile |
| `GET` | `/api/users/Recommendedfriends` | Yes | Get language-swap recommendations |
| `POST` | `/api/profile/CompleteProfile` | Yes | Create or update profile (onboarding) |
| `POST` | `/api/friendrequest/send` | Yes | Send a friend request (`{ receiverId }`) |
| `PUT` | `/api/friendrequest/accept/:requestId` | Yes | Accept a request |
| `POST` | `/api/friendrequest/reject/:requestId` | Yes | Reject a request |
| `GET` | `/api/friendrequest/get` | Yes | List pending incoming requests |
| `GET` | `/api/friendslist/friends` | Yes | List accepted friends |
| `GET` | `/api/chat/token` | Yes | Get a Stream token and upsert the user |
| `GET` | `/api/chat/sync-user/:id` | Yes | Upsert a target user into Stream |
| `GET` | `/api/user/search?query=` | Yes | Search users by name or username |
| `POST` | `/api/ai/correct` | Yes | AI Coach: correct a message in the user's learning language |

---

## Database Schema

**User** (`users`)

| Field | Type | Notes |
|---|---|---|
| `fullname` | String | Required, 3–50 chars |
| `username` | String | Unique, lowercase, 3–30 chars, `[a-z0-9._]` |
| `email` | String | Unique, lowercase |
| `password` | String | bcrypt hash, `select: false` |
| `avatar` | String | DiceBear URL |
| `bio` | String | Max 200 chars |
| `NativeLanguage` | String | Language the user speaks natively |
| `LearningLanguage` | String | Language the user is learning (also used by the AI Coach) |
| `city` | String | Location |
| `isOnline` | Boolean | Default `false` |
| `lastSeen` | Date | Default `Date.now` |
| `createdAt` / `updatedAt` | Date | Timestamps |

**FriendRequest** (`friendrequests`)

| Field | Type | Notes |
|---|---|---|
| `sender` | ObjectId → User | Required |
| `receiver` | ObjectId → User | Required |
| `status` | String | `pending`, `accepted` or `rejected` |
| `createdAt` / `updatedAt` | Date | Timestamps |

A compound unique index on `{ sender, receiver }` prevents duplicate requests.

---

## App Routes

| Path | Page | Access |
|---|---|---|
| `/` | Home (friends and recommendations) | Authenticated and onboarded |
| `/profile` | Profile | Authenticated and onboarded |
| `/notification` | Friend request notifications | Authenticated and onboarded |
| `/friends` | Friends list | Authenticated and onboarded |
| `/chat/:id` | Direct message chat (with AI Coach) | Authenticated and onboarded |
| `/call/:id` | Video call | Authenticated and onboarded |
| `/onBoarding` | Profile setup and edit | Authenticated |
| `/login` | Login | Unauthenticated only |
| `/register` | Register | Unauthenticated only |

---

## Supported Languages

English · Hindi · Urdu · Arabic · Bengali · Spanish · French · German · Italian · Portuguese · Russian · Japanese · Korean · Mandarin · Turkish · Tamil · Telugu · Punjabi · Indonesian · Dutch

---

## Contributing

Contributions are welcome.

1. Fork the repository.
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m "Add your feature"`
4. Push the branch: `git push origin feature/your-feature`
5. Open a pull request.

---

## Author

**Faizurrahman**

- GitHub: [@Faizurrr](https://github.com/Faizurrr)
- LinkedIn: [faizurrahman](https://www.linkedin.com/in/faizurrahman-868700326/)
- Portfolio: [faizurrr.github.io/portfolio](https://faizurrr.github.io/portfolio/)

---

## License

Distributed under the ISC License.