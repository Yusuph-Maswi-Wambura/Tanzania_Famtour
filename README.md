# Tanzania Famtour

Deployment-ready TypeScript and Express backend for the Tanzania Famtour experience.

## Features

- Typed REST API for tours, destinations, operators, custom trip requests, quotation requests, and contact messages.
- PostgreSQL persistence for all enquiries, with startup schema initialization and indexed timestamps.
- Input validation with Zod, security headers with Helmet, compression, CORS, request logging, rate limiting, and a health endpoint.
- Existing `Tanzania_Famtour.ejs` served at `/`.
- Docker and Docker Compose configuration.

## Local development

```powershell
Copy-Item .env.example .env
npm install
npm run dev
```

Open `http://localhost:3000`. API routes are under `/api`:

- `GET /health`
- `GET /api/tours`
- `GET /api/tours/:id`
- `GET /api/destinations`
- `GET /api/operators`
- `POST /api/requests`
- `POST /api/quotes`
- `POST /api/contact`

Enquiries are persisted in PostgreSQL. The application creates its small request schema on startup; for a larger production system, manage the same schema with a dedicated migration tool and add email/CRM notifications.

## Production and Docker

```powershell
npm ci
npm run build
npm start
```

Or:

```powershell
docker compose up --build -d
```

This starts the API and PostgreSQL with a persistent `famtour-postgres` volume. Set `CLIENT_ORIGIN` and `DATABASE_URL` to deployment values before publishing. A domain can be added later without changing the API routes.

## GitHub deployment checklist

1. Configure a hosting service that supports Node.js or Docker.
2. Set `NODE_ENV=production`, `DATABASE_URL`, `CLIENT_ORIGIN`, and `PORT` in the host environment.
3. Use `npm ci`, `npm run build`, and `npm start`, or deploy the included `Dockerfile`.
4. Configure the host health check to use `GET /health`.
5. Add the final domain to `CLIENT_ORIGIN` after DNS is configured.
