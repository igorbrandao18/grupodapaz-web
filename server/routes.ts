import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { supabaseAdmin } from "./lib/supabaseServer";
import { insertPlanSchema, insertSubscriptionSchema, insertDependentSchema, insertPaymentSchema, insertInvoiceSchema } from "@shared/schema";
import { stripe } from "./lib/stripe";

async function verifyAuth(req: any, res: any, next: any) {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const token = authHeader.split(' ')[1];
  
  try {
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);
    
    if (error || !user) {
      return res.status(401).json({ message: 'Invalid token' });
    }
    
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Authentication failed' });
  }
}

async function verifyAdmin(req: any, res: any, next: any) {
  try {
    const { data: profile, error } = await supabaseAdmin
      .from('profiles')
      .select('role')
      .eq('id', req.user.id)
      .single();
    
    if (error || !profile || profile.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }
    
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Forbidden' });
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  app.get('/api/config/supabase', (req, res) => {
    const url = process.env.SUPABASE_URL;
    const anonKey = process.env.SUPABASE_ANON_KEY;
    
    if (!url || !anonKey) {
      return res.status(500).json({ 
        message: 'Supabase configuration missing',
        error: 'Server environment variables not configured'
      });
    }
    
    res.json({ url, anonKey });
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
  app.post('/api/plans', verifyAuth, verifyAdmin, async (req, res) => {
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
  app.patch('/api/plans/:id', verifyAuth, verifyAdmin, async (req, res) => {
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
  app.patch('/api/plans/:id/status', verifyAuth, verifyAdmin, async (req, res) => {
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
  app.delete('/api/plans/:id', verifyAuth, verifyAdmin, async (req, res) => {
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

  // Get single plan by ID
  app.get('/api/plans/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      const { data: plan, error } = await supabaseAdmin
        .from('plans')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) {
        return res.status(404).json({ message: 'Plan not found' });
      }
      
      res.json(plan);
    } catch (error) {
      console.error('Error fetching plan:', error);
      res.status(500).json({ message: 'Failed to fetch plan' });
    }
  });

  // Get all profiles (admin only)
  app.get('/api/profiles', verifyAuth, verifyAdmin, async (req, res) => {
    try {
      const { data: profiles, error } = await supabaseAdmin
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching profiles:', error);
        return res.status(500).json({ message: 'Failed to fetch profiles' });
      }
      
      res.json(profiles || []);
    } catch (error) {
      console.error('Error fetching profiles:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });

  // Update profile (admin only)
  app.patch('/api/profiles/:id', verifyAuth, verifyAdmin, async (req, res) => {
    try {
      const id = req.params.id;
      const updates = req.body;
      
      const { data: updatedProfile, error } = await supabaseAdmin
        .from('profiles')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        console.error('Error updating profile:', error);
        return res.status(500).json({ message: 'Failed to update profile' });
      }
      
      res.json(updatedProfile);
    } catch (error) {
      console.error('Error updating profile:', error);
      res.status(400).json({ message: 'Invalid profile data' });
    }
  });

  // Create Stripe checkout session for subscription
  app.post('/api/create-checkout-session', verifyAuth, async (req: any, res) => {
    try {
      const { planId } = req.body;
      const userId = req.user.id;
      
      // Get plan details
      const { data: plan, error: planError } = await supabaseAdmin
        .from('plans')
        .select('*')
        .eq('id', planId)
        .single();
      
      if (planError || !plan) {
        return res.status(404).json({ message: 'Plan not found' });
      }
      
      if (!plan.stripePriceId) {
        return res.status(400).json({ message: 'Plan not configured for Stripe' });
      }
      
      // Get or create Stripe customer
      const { data: profile } = await supabaseAdmin
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      let customerId = profile?.stripeCustomerId;
      
      if (!customerId) {
        const customer = await stripe.customers.create({
          email: profile?.email || req.user.email,
          metadata: {
            userId: userId,
          },
        });
        customerId = customer.id;
        
        // Update profile with Stripe customer ID
        await supabaseAdmin
          .from('profiles')
          .update({ stripeCustomerId: customerId })
          .eq('id', userId);
      }
      
      // Create checkout session
      const session = await stripe.checkout.sessions.create({
        customer: customerId,
        mode: 'subscription',
        payment_method_types: ['card'],
        line_items: [
          {
            price: plan.stripePriceId,
            quantity: 1,
          },
        ],
        success_url: `${req.headers.origin}/portal?success=true`,
        cancel_url: `${req.headers.origin}/?canceled=true`,
        metadata: {
          userId: userId,
          planId: planId.toString(),
        },
      });
      
      res.json({ url: session.url });
    } catch (error: any) {
      console.error('Error creating checkout session:', error);
      res.status(500).json({ message: error.message });
    }
  });

  // Get subscriptions for user
  app.get('/api/subscriptions', verifyAuth, async (req: any, res) => {
    try {
      const userId = req.user.id;
      
      const { data: subscriptions, error } = await supabaseAdmin
        .from('subscriptions')
        .select(`
          *,
          plan:plans(*)
        `)
        .eq('profileId', userId)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching subscriptions:', error);
        return res.status(500).json({ message: 'Failed to fetch subscriptions' });
      }
      
      res.json(subscriptions || []);
    } catch (error) {
      console.error('Error fetching subscriptions:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });

  // Get dependents for user
  app.get('/api/dependents', verifyAuth, async (req: any, res) => {
    try {
      const userId = req.user.id;
      
      const { data: dependents, error } = await supabaseAdmin
        .from('dependents')
        .select('*')
        .eq('profileId', userId)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching dependents:', error);
        return res.status(500).json({ message: 'Failed to fetch dependents' });
      }
      
      res.json(dependents || []);
    } catch (error) {
      console.error('Error fetching dependents:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });

  // Create dependent
  app.post('/api/dependents', verifyAuth, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const validatedData = insertDependentSchema.parse({
        ...req.body,
        profileId: userId,
      });
      
      const { data: newDependent, error } = await supabaseAdmin
        .from('dependents')
        .insert([validatedData])
        .select()
        .single();
      
      if (error) {
        console.error('Error creating dependent:', error);
        return res.status(500).json({ message: 'Failed to create dependent' });
      }
      
      res.status(201).json(newDependent);
    } catch (error) {
      console.error('Error creating dependent:', error);
      res.status(400).json({ message: 'Invalid dependent data' });
    }
  });

  // Update dependent
  app.patch('/api/dependents/:id', verifyAuth, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      const userId = req.user.id;
      const updates = req.body;
      
      const { data: updatedDependent, error } = await supabaseAdmin
        .from('dependents')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .eq('profileId', userId)
        .select()
        .single();
      
      if (error) {
        console.error('Error updating dependent:', error);
        return res.status(500).json({ message: 'Failed to update dependent' });
      }
      
      res.json(updatedDependent);
    } catch (error) {
      console.error('Error updating dependent:', error);
      res.status(400).json({ message: 'Invalid dependent data' });
    }
  });

  // Delete dependent
  app.delete('/api/dependents/:id', verifyAuth, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      const userId = req.user.id;
      
      const { error } = await supabaseAdmin
        .from('dependents')
        .delete()
        .eq('id', id)
        .eq('profileId', userId);
      
      if (error) {
        console.error('Error deleting dependent:', error);
        return res.status(500).json({ message: 'Failed to delete dependent' });
      }
      
      res.status(204).send();
    } catch (error) {
      console.error('Error deleting dependent:', error);
      res.status(500).json({ message: 'Failed to delete dependent' });
    }
  });

  // Get invoices for user
  app.get('/api/invoices', verifyAuth, async (req: any, res) => {
    try {
      const userId = req.user.id;
      
      // Get user's subscriptions first
      const { data: subscriptions } = await supabaseAdmin
        .from('subscriptions')
        .select('id')
        .eq('profileId', userId);
      
      if (!subscriptions || subscriptions.length === 0) {
        return res.json([]);
      }
      
      const subscriptionIds = subscriptions.map(s => s.id);
      
      const { data: invoices, error } = await supabaseAdmin
        .from('invoices')
        .select('*')
        .in('subscriptionId', subscriptionIds)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching invoices:', error);
        return res.status(500).json({ message: 'Failed to fetch invoices' });
      }
      
      res.json(invoices || []);
    } catch (error) {
      console.error('Error fetching invoices:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });

  // Generate 2nd copy (PIX/Boleto)
  app.post('/api/invoices/:id/generate-copy', verifyAuth, async (req: any, res) => {
    try {
      const invoiceId = parseInt(req.params.id);
      const userId = req.user.id;
      
      // Verify invoice belongs to user
      const { data: invoice, error: invoiceError } = await supabaseAdmin
        .from('invoices')
        .select(`
          *,
          subscription:subscriptions(profileId)
        `)
        .eq('id', invoiceId)
        .single();
      
      if (invoiceError || !invoice || (invoice.subscription as any)?.profileId !== userId) {
        return res.status(404).json({ message: 'Invoice not found' });
      }
      
      // For now, return existing data (PIX/Boleto would be generated here)
      res.json({
        pixCode: invoice.pixCode || 'PIX_CODE_EXAMPLE',
        boletoUrl: invoice.boletoUrl || 'https://example.com/boleto.pdf',
        boletoBarcode: invoice.boletoBarcode || '12345678901234567890',
      });
    } catch (error) {
      console.error('Error generating copy:', error);
      res.status(500).json({ message: 'Failed to generate copy' });
    }
  });

  // Stripe webhook handler
  app.post('/api/webhooks/stripe', async (req, res) => {
    const sig = req.headers['stripe-signature'];
    
    if (!sig) {
      return res.status(400).send('No signature');
    }
    
    let event;
    
    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET || ''
      );
    } catch (err: any) {
      console.error('Webhook signature verification failed:', err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }
    
    // Handle the event
    try {
      switch (event.type) {
        case 'checkout.session.completed': {
          const session = event.data.object;
          const userId = session.metadata?.userId;
          const planId = session.metadata?.planId;
          
          if (userId && planId && session.subscription) {
            // Create subscription record
            await supabaseAdmin.from('subscriptions').insert({
              profileId: userId,
              planId: parseInt(planId),
              stripeSubscriptionId: session.subscription.toString(),
              status: 'active',
              startDate: new Date().toISOString(),
            });
          }
          break;
        }
        
        case 'customer.subscription.updated':
        case 'customer.subscription.deleted': {
          const subscription = event.data.object;
          
          // Update subscription status
          await supabaseAdmin
            .from('subscriptions')
            .update({
              status: subscription.status,
              cancelAtPeriodEnd: subscription.cancel_at_period_end,
              endDate: subscription.canceled_at ? new Date(subscription.canceled_at * 1000).toISOString() : null,
            })
            .eq('stripeSubscriptionId', subscription.id);
          break;
        }
        
        case 'invoice.payment_succeeded': {
          const invoice = event.data.object as any;
          
          // Find subscription
          const { data: sub } = await supabaseAdmin
            .from('subscriptions')
            .select('id')
            .eq('stripeSubscriptionId', invoice.subscription)
            .single();
          
          if (sub) {
            // Create invoice record
            await supabaseAdmin.from('invoices').insert({
              subscriptionId: sub.id,
              stripeInvoiceId: invoice.id,
              amount: (invoice.amount_paid / 100).toString(),
              dueDate: new Date((invoice.due_date || Date.now() / 1000) * 1000).toISOString(),
              status: 'paid',
              hostedInvoiceUrl: invoice.hosted_invoice_url || null,
              invoicePdfUrl: invoice.invoice_pdf || null,
            });
          }
          break;
        }
      }
      
      res.json({ received: true });
    } catch (error) {
      console.error('Error processing webhook:', error);
      res.status(500).json({ error: 'Webhook processing failed' });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
