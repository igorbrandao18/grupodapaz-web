import { supabaseAdmin } from './supabaseServer';
import type { Request, Response, NextFunction } from 'express';

export async function verifySupabaseToken(token: string) {
  try {
    const { data, error } = await supabaseAdmin.auth.getUser(token);
    
    if (error) throw error;
    return data.user;
  } catch (error) {
    return null;
  }
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  
  const token = authHeader.substring(7);
  
  verifySupabaseToken(token).then(user => {
    if (!user) {
      return res.status(401).json({ message: 'Invalid token' });
    }
    
    (req as any).user = user;
    next();
  }).catch(() => {
    res.status(401).json({ message: 'Authentication failed' });
  });
}
