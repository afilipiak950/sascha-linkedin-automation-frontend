import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { setupLogger } from '../utils/logger';

const logger = setupLogger();

export interface AuthRequest extends Request {
  user?: any;
}

export const authenticateToken = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    logger.warn('Authentifizierungsversuch ohne Token');
    return res.status(401).json({ error: 'Nicht autorisiert' });
  }

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    req.user = user;
    next();
  } catch (error) {
    logger.error('Token-Validierungsfehler:', error);
    return res.status(403).json({ error: 'Ungültiges Token' });
  }
};

export const generateToken = (user: any): string => {
  return jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET || 'your-secret-key',
    { expiresIn: '24h' }
  );
}; 