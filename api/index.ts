import type { Request, Response } from 'express';
import app, { ensureDatabaseReady } from '../server.js';

export default async function handler(req: Request, res: Response) {
  await ensureDatabaseReady();
  return app(req, res);
}
