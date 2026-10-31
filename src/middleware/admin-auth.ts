import { NextFunction, Request, Response } from 'express';

import { adminStore } from '../store/admin-store';

function readCookie(request: Request, name: string): string | undefined {
  const cookies = request.headers.cookie?.split(';').map((item) => item.trim()) ?? [];
  return cookies.find((item) => item.startsWith(`${name}=`))?.slice(name.length + 1);
}

export function adminAuth(request: Request, response: Response, next: NextFunction): void {
  const token = readCookie(request, 'famtour_admin_session');
  if (!token) {
    response.status(401).json({ error: 'Admin authentication required' });
    return;
  }
  adminStore.findByToken(token).then((user) => {
    if (!user) {
      response.status(401).json({ error: 'Admin session expired' });
      return;
    }
    response.locals.admin = user;
    next();
  }).catch(next);
}

export { readCookie };
