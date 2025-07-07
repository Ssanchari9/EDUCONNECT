# EduConnect Nexus Hub

A modern educational platform for students and educators.

## Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v14 or higher)
- Vercel CLI (`npm install -g vercel`)

## Environment Setup

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

2. Update the `.env` file with your actual values:
   - Database credentials
   - API URLs
   - Authentication secrets
   - External service credentials (if needed)

## Local Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

## Deployment

1. Login to Vercel:
   ```bash
   vercel login
   ```

2. Set up environment variables in Vercel:
   ```bash
   vercel env add DB_HOST
   vercel env add DB_PORT
   vercel env add DB_USER
   vercel env add DB_PASSWORD
   vercel env add DB_NAME
   ```

3. Run the deployment script:
   ```bash
   chmod +x scripts/deploy.sh
   ./scripts/deploy.sh
   ```

## Project Structure

- `src/components/` - React components
- `src/pages/` - Next.js pages
- `src/types/` - TypeScript type definitions
- `src/database/` - Database schema and migrations
- `src/api/` - API routes
- `public/` - Static assets

## Features

- Course catalog with search and filtering
- Video tutorials and recommendations
- User authentication and profiles
- Progress tracking
- Interactive learning modules

## License

MIT
