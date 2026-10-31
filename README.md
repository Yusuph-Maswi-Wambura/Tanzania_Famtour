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

## Admin dashboard

Open `/admin` after the application is running. On the first visit:

1. Create the first administrator with a unique email and a password of at least 12 characters.
2. Log in using the new administrator account.
3. Enter business and communication information only when ready.
4. Optionally enter bank/payment instructions; these fields are encrypted before storage.
5. Review customer requests from the protected dashboard.

The admin session uses an HTTP-only cookie. Passwords are hashed with `scrypt`, and admin-only API routes require a valid server-side session. The public website cannot read business settings, bank details, or customer requests.

The initial dashboard provides settings and request viewing. Email delivery, WhatsApp integration, status workflows, and staff accounts should be added only after the core admin access has been configured.

For a frontend-only preview when PostgreSQL is not installed, use:

```powershell
$env:DATABASE_URL="postgresql://preview:preview@localhost:5432/preview"
$env:PREVIEW_MODE="true"
npm run build
npm start
```

Preview mode serves the website, but enquiry submissions require PostgreSQL and should not be used for production.

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

### Deploy with Render

The repository includes [render.yaml](./render.yaml), which provisions the Docker web service without requiring a paid Render database. Render will ask you to provide `DATABASE_URL` securely during setup.

1. Open the Render Blueprint deployment page:
   `https://dashboard.render.com/blueprint/new?repo=https://github.com/Yusuph-Maswi-Wambura/Tanzania_Famtour`
2. Sign in with GitHub and approve the repository.
3. Create a free PostgreSQL database with a provider such as Neon or Supabase and copy its pooled PostgreSQL connection string.
4. Enter that connection string as the private `DATABASE_URL` Blueprint variable when Render asks for it. Never commit it to GitHub.
5. Click **Apply**.
6. Render will provide a public URL similar to `https://tanzania-famtour.onrender.com`.

After deployment, set `CLIENT_ORIGIN` to the generated Render URL. A free external database and Render free web service may sleep when inactive.
