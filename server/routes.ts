import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { db } from "./db";
import { plans } from "@shared/schema";
import { asc } from "drizzle-orm";

export async function registerRoutes(app: Express): Promise<Server> {
  app.get('/api/config/supabase', (req, res) => {
    res.json({
      url: process.env.SUPABASE_URL || '',
      anonKey: process.env.SUPABASE_ANON_KEY || ''
    });
  });

  app.get('/api/plans', async (req, res) => {
    try {
      const allPlans = await db
        .select()
        .from(plans)
        .orderBy(asc(plans.displayOrder));
      
      res.json(allPlans);
    } catch (error) {
      console.error('Error fetching plans:', error);
      res.status(500).json({ message: 'Failed to fetch plans' });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
