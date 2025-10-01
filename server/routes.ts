import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { supabaseAdmin } from "./lib/supabaseServer";

export async function registerRoutes(app: Express): Promise<Server> {
  app.get('/api/config/supabase', (req, res) => {
    res.json({
      url: process.env.SUPABASE_URL || '',
      anonKey: process.env.SUPABASE_ANON_KEY || ''
    });
  });

  app.get('/api/plans', async (req, res) => {
    try {
      const { data: allPlans, error } = await supabaseAdmin
        .from('plans')
        .select('*')
        .order('display_order', { ascending: true });
      
      if (error) {
        console.log('Table not found in Supabase, using fallback data');
        
        // Fallback plans data
        const fallbackPlans = [
          {
            id: 1,
            name: 'Plano Básico',
            price: 'R$ 89,90',
            period: '/mês',
            popular: false,
            image: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=800&h=600&fit=crop',
            features: ['Cobertura individual', 'Velório 24h', 'Sepultamento', 'Transporte local', 'Assistência documental'],
            display_order: 1
          },
          {
            id: 2,
            name: 'Plano Essencial',
            price: 'R$ 149,90',
            period: '/mês',
            popular: true,
            image: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=800&h=600&fit=crop',
            features: ['Até 3 dependentes', 'Velório premium', 'Cremação ou sepultamento', 'Transporte estadual', 'Floricultura inclusa', 'Assistência psicológica'],
            display_order: 2
          },
          {
            id: 3,
            name: 'Plano Premium',
            price: 'R$ 249,90',
            period: '/mês',
            popular: false,
            image: 'https://images.unsplash.com/photo-1518709414768-a88981a4515d?w=800&h=600&fit=crop',
            features: ['Até 6 dependentes', 'Velório VIP', 'Cremação e sepultamento', 'Transporte nacional', 'Floricultura premium', 'Assistência jurídica', 'Cerimônia personalizada', 'Memorial digital'],
            display_order: 3
          }
        ];
        
        return res.json(fallbackPlans);
      }
      
      res.json(allPlans || []);
    } catch (error) {
      console.error('Error fetching plans:', error);
      res.status(500).json({ message: 'Failed to fetch plans' });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
