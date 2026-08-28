import { Response } from 'express';
/**
 * Standard error envelope: { ok: false, payload: message }
 */
export const sendError = (
  res: Response,
  status: number,
  message: string
): Response => {
  return res.status(status).json({
    ok: false,
    payload: message,
  });
};