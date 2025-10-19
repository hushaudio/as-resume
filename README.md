This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

### Environment Setup

First, set up your environment variables:

```bash
# Run the setup script to create .env.local
./setup-env.sh
```

Or manually create a `.env.local` file with:

```env
# Admin Authentication
ADMIN_PW=your_admin_password

# Database Connection (if needed)
# DATABASE_URL=postgresql://user:pass@host:port/database
```

### Development Server

Then, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Admin Panel

Access the admin panel at `/admin` with the password set in your `ADMIN_PW` environment variable.

- **Admin URL**: `http://localhost:3000/admin`
- **Default Password**: `ffwawa108` (change in `.env.local`)

## Features

- **Blog System**: Integrated blog with markdown support
- **Admin Panel**: Protected admin interface for managing blog posts
- **Authentication**: Secure session-based authentication
- **Responsive Design**: Works on desktop and mobile devices

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
