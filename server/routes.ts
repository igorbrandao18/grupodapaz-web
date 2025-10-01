import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { supabaseAdmin } from "./lib/supabaseServer";
import { insertPlanSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  app.get('/api/config/supabase', (req, res) => {
    res.json({
      url: process.env.SUPABASE_URL || '',
      anonKey: process.env.SUPABASE_ANON_KEY || ''
    });
  });

  // Get active plans only (for public display)
  app.get('/api/plans', async (req, res) => {
    try {
      const { data: allPlans, error } = await supabaseAdmin
        .from('plans')
        .select('*')
        .eq('active', true)
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
            description: 'Proteção individual com serviços essenciais de funeral',
            dependents: 1,
            popular: false,
            active: true,
            image: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=800&h=600&fit=crop',
            features: ['Cobertura individual', 'Velório 24h', 'Sepultamento', 'Transporte local', 'Assistência documental'],
            displayOrder: 1,
            updatedAt: new Date().toISOString()
          },
          {
            id: 2,
            name: 'Plano Essencial',
            price: 'R$ 149,90',
            period: '/mês',
            description: 'Proteção para você e sua família com serviços completos',
            dependents: 3,
            popular: true,
            active: true,
            image: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=800&h=600&fit=crop',
            features: ['Até 3 dependentes', 'Velório premium', 'Cremação ou sepultamento', 'Transporte estadual', 'Floricultura inclusa', 'Assistência psicológica'],
            displayOrder: 2,
            updatedAt: new Date().toISOString()
          },
          {
            id: 3,
            name: 'Plano Premium',
            price: 'R$ 249,90',
            period: '/mês',
            description: 'Proteção familiar ampliada com serviços premium e personalizados',
            dependents: 6,
            popular: false,
            active: true,
            image: 'https://images.unsplash.com/photo-1518709414768-a88981a4515d?w=800&h=600&fit=crop',
            features: ['Até 6 dependentes', 'Velório VIP', 'Cremação e sepultamento', 'Transporte nacional', 'Floricultura premium', 'Assistência jurídica', 'Cerimônia personalizada', 'Memorial digital'],
            displayOrder: 3,
            updatedAt: new Date().toISOString()
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

  // Get all plans including inactive (for admin)
  app.get('/api/plans/all', async (req, res) => {
    try {
      const { data: allPlans, error } = await supabaseAdmin
        .from('plans')
        .select('*')
        .order('display_order', { ascending: true });
      
      if (error) {
        console.log('Table not found in Supabase, using fallback data');
        const fallbackPlans = [
          {
            id: 1,
            name: 'Plano Básico',
            price: 'R$ 89,90',
            period: '/mês',
            description: 'Proteção individual com serviços essenciais de funeral',
            dependents: 1,
            popular: false,
            active: true,
            image: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=800&h=600&fit=crop',
            features: ['Cobertura individual', 'Velório 24h', 'Sepultamento', 'Transporte local', 'Assistência documental'],
            displayOrder: 1,
            updatedAt: new Date().toISOString()
          },
          {
            id: 2,
            name: 'Plano Essencial',
            price: 'R$ 149,90',
            period: '/mês',
            description: 'Proteção para você e sua família com serviços completos',
            dependents: 3,
            popular: true,
            active: true,
            image: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=800&h=600&fit=crop',
            features: ['Até 3 dependentes', 'Velório premium', 'Cremação ou sepultamento', 'Transporte estadual', 'Floricultura inclusa', 'Assistência psicológica'],
            displayOrder: 2,
            updatedAt: new Date().toISOString()
          },
          {
            id: 3,
            name: 'Plano Premium',
            price: 'R$ 249,90',
            period: '/mês',
            description: 'Proteção familiar ampliada com serviços premium e personalizados',
            dependents: 6,
            popular: false,
            active: true,
            image: 'https://images.unsplash.com/photo-1518709414768-a88981a4515d?w=800&h=600&fit=crop',
            features: ['Até 6 dependentes', 'Velório VIP', 'Cremação e sepultamento', 'Transporte nacional', 'Floricultura premium', 'Assistência jurídica', 'Cerimônia personalizada', 'Memorial digital'],
            displayOrder: 3,
            updatedAt: new Date().toISOString()
          }
        ];
        return res.json(fallbackPlans);
      }
      
      res.json(allPlans || []);
    } catch (error) {
      console.error('Error fetching all plans:', error);
      res.status(500).json({ message: 'Failed to fetch plans' });
    }
  });

  // Create a new plan
  app.post('/api/plans', async (req, res) => {
    try {
      const validatedData = insertPlanSchema.parse(req.body);
      
      const { data: newPlan, error } = await supabaseAdmin
        .from('plans')
        .insert([validatedData])
        .select()
        .single();
      
      if (error) {
        console.error('Error creating plan:', error);
        return res.status(500).json({ message: 'Failed to create plan' });
      }
      
      res.status(201).json(newPlan);
    } catch (error) {
      console.error('Error creating plan:', error);
      res.status(400).json({ message: 'Invalid plan data' });
    }
  });

  // Update a plan
  app.patch('/api/plans/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = req.body;
      
      const { data: updatedPlan, error } = await supabaseAdmin
        .from('plans')
        .update({ ...updates, updatedAt: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        console.error('Error updating plan:', error);
        return res.status(500).json({ message: 'Failed to update plan' });
      }
      
      res.json(updatedPlan);
    } catch (error) {
      console.error('Error updating plan:', error);
      res.status(400).json({ message: 'Invalid plan data' });
    }
  });

  // Update plan status (active/inactive)
  app.patch('/api/plans/:id/status', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { active } = req.body;
      
      const { data: updatedPlan, error } = await supabaseAdmin
        .from('plans')
        .update({ active, updatedAt: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        console.error('Error updating plan status:', error);
        return res.status(500).json({ message: 'Failed to update plan status' });
      }
      
      res.json(updatedPlan);
    } catch (error) {
      console.error('Error updating plan status:', error);
      res.status(400).json({ message: 'Invalid status data' });
    }
  });

  // Delete a plan
  app.delete('/api/plans/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      const { error } = await supabaseAdmin
        .from('plans')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Error deleting plan:', error);
        return res.status(500).json({ message: 'Failed to delete plan' });
      }
      
      res.status(204).send();
    } catch (error) {
      console.error('Error deleting plan:', error);
      res.status(500).json({ message: 'Failed to delete plan' });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
