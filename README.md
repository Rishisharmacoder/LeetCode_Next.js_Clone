# LeetCode Clone

A modern coding platform inspired by LeetCode, built with Next.js, Prisma, PostgreSQL, and Clerk authentication. It includes a homepage, problem browsing, user profile tracking, playlist management, and an admin flow for creating coding challenges.

## Features

- Interactive home page with marketing sections and call-to-action blocks
- Problem listing and detail experience for coding challenges
- User authentication and session management with Clerk
- Personalized profile page with solved problems and submission history
- Playlist support for saving and organizing practice sets
- Admin support to create new problems
- Dark mode support and responsive UI
- PostgreSQL database integration with Prisma ORM

## Tech Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- Prisma ORM
- PostgreSQL
- Clerk Auth
- Monaco Editor
- Docker Compose

## Project Structure

```bash
.
├── app/
│   ├── (auth)/
│   ├── (root)/
│   ├── api/
│   └── globals.css
├── components/
├── modules/
├── prisma/
├── public/
├── docker-compose.yml
├── package.json
├── next.config.ts
├── tsconfig.json
└── README.md
```

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Start PostgreSQL with Docker

```bash
docker compose up -d
```

### 3. Set up environment variables

Create a `.env` file in the root directory and add the required variables:

```bash
DATABASE_URL="postgresql://postgres:postgres123@localhost:5435/leetcode"
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="your_clerk_publishable_key"
CLERK_SECRET_KEY="your_clerk_secret_key"
NEXT_PUBLIC_CLERK_SIGN_IN_URL="/sign-in"
NEXT_PUBLIC_CLERK_SIGN_UP_URL="/sign-up"
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL="/"
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL="/"
```

### 4. Generate Prisma client

```bash
npx prisma generate
```

### 5. Run the app

```bash
npm run dev
```

Open http://localhost:3000

## Available Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
```

## Database

This project uses PostgreSQL and Prisma. The database is started through Docker Compose using the configuration defined in `docker-compose.yml`.

## Authentication

Authentication is handled by Clerk. You need to configure your own Clerk project and add the publishable and secret keys in the environment variables.

## Contributing

Contributions are welcome. If you want to improve the platform, please fork the repository, create a feature branch, and submit a pull request.

## License

This project is licensed under the MIT License.
