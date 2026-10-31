import { NextFunction, Request, Response, Router } from 'express';

import { adminAuth, readCookie } from '../middleware/admin-auth';
import { loginSchema, settingsSchema, setupSchema } from '../middleware/admin-validation';
import { adminStore } from '../store/admin-store';
import { requestStore } from '../store/request-store';

export const adminRouter = Router();

const asyncRoute = (handler: (request: Request, response: Response) => Promise<void>) =>
  (request: Request, response: Response, next: NextFunction): void => {
    handler(request, response).catch(next);
  };

const validate = (schema: typeof setupSchema | typeof loginSchema | typeof settingsSchema) =>
  (request: Request, response: Response, next: NextFunction): void => {
    const result = schema.safeParse(request.body);
    if (!result.success) {
      response.status(400).json({ error: 'Validation failed', details: result.error.flatten() });
      return;
    }
    request.body = result.data;
    next();
  };

const cookieOptions = (maxAge: number) =>
  `Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAge}${process.env.NODE_ENV === 'production' ? '; Secure' : ''}`;

adminRouter.get('/status', asyncRoute(async (_request, response) => {
  response.json({ setupRequired: !(await adminStore.hasAdmin()) });
}));

adminRouter.post('/setup', validate(setupSchema), asyncRoute(async (request, response) => {
  if (await adminStore.hasAdmin()) {
    response.status(409).json({ error: 'Admin setup has already been completed' });
    return;
  }
  const user = await adminStore.createAdmin(request.body.name, request.body.email, request.body.password);
  response.status(201).json({ message: 'Administrator created', data: user });
}));

adminRouter.post('/login', validate(loginSchema), asyncRoute(async (request, response) => {
  const result = await adminStore.login(request.body.email, request.body.password);
  if (!result) {
    response.status(401).json({ error: 'Invalid email or password' });
    return;
  }
  response.setHeader('Set-Cookie', `famtour_admin_session=${result.token}; ${cookieOptions(8 * 60 * 60)}`);
  response.json({ message: 'Login successful', data: result.user });
}));

adminRouter.post('/logout', asyncRoute(async (request, response) => {
  const token = readCookie(request, 'famtour_admin_session');
  if (token) await adminStore.logout(token);
  response.setHeader('Set-Cookie', `famtour_admin_session=; ${cookieOptions(0)}`);
  response.json({ message: 'Logged out' });
}));

adminRouter.use(adminAuth);
adminRouter.get('/me', (request, response) => response.json({ data: response.locals.admin }));
adminRouter.get('/requests', asyncRoute(async (_request, response) => {
  response.json({ data: await requestStore.listAll() });
}));
adminRouter.get('/settings', asyncRoute(async (_request, response) => {
  response.json({ data: await adminStore.getSettings() });
}));
adminRouter.put('/settings', validate(settingsSchema), asyncRoute(async (request, response) => {
  response.json({ message: 'Settings saved', data: await adminStore.saveSettings(request.body) });
}));
