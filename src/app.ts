import path from 'node:path';

import compression from 'compression';
import cors from 'cors';
import express from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import morgan from 'morgan';

import { env } from './config/env';
import { errorHandler, notFoundHandler } from './middleware/errors';
import { apiRouter } from './routes/api';
import { adminRouter } from './routes/admin';
import { adminDashboard } from './admin/dashboard';

export const app = express();
app.set('trust proxy', env.TRUST_PROXY);
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({ origin: env.CLIENT_ORIGIN === '*' ? true : env.CLIENT_ORIGIN }));
app.use(compression());
app.use(express.json({ limit: '100kb' }));
app.use(express.urlencoded({ extended: false, limit: '100kb' }));
app.use(morgan(env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use('/api', rateLimit({ windowMs: 15 * 60 * 1000, limit: 100, standardHeaders: true, legacyHeaders: false }));

app.get('/health', (_request, response) => response.json({ status: 'ok', service: 'tanzania-famtour', timestamp: new Date().toISOString() }));
app.use('/api', apiRouter);
app.use('/api/admin', rateLimit({ windowMs: 15 * 60 * 1000, limit: 20, standardHeaders: true, legacyHeaders: false }), adminRouter);
app.get('/admin', (_request, response) => response.type('html').send(adminDashboard));
app.get('/', (_request, response) => {
  response.type('html').sendFile(path.resolve(process.cwd(), 'Tanzania_Famtour.ejs'));
});
app.use(notFoundHandler);
app.use(errorHandler);
