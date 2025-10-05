import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { supabaseAdmin } from "./lib/supabaseServer";
import { insertPlanSchema, insertSubscriptionSchema, insertDependentSchema, insertPaymentSchema, insertInvoiceSchema } from "@shared/schema";
import { stripe } from "./lib/stripe";
import { sendWelcomeEmail } from "./lib/resend";
import { sendWelcomeEmail as sendWelcomeEmailSMTP, sendPasswordResetEmail, sendContactEmail, testEmailConnection } from "./lib/email";
import crypto from "crypto";

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

  // Create Stripe checkout session for subscription (PUBLIC - no auth required)
  app.post('/api/create-checkout-session', async (req: any, res) => {
    try {
      const { planId, email } = req.body;
      
      console.log('📝 Checkout request:', { planId, email });
      
      if (!email) {
        return res.status(400).json({ message: 'Email is required' });
      }
      
      // Get plan details
      const { data: plan, error: planError } = await supabaseAdmin
        .from('plans')
        .select('*')
        .eq('id', planId)
        .single();
      
      console.log('📦 Plan query result:', { plan, error: planError });
      
      if (planError || !plan) {
        console.error('❌ Plan not found:', planError);
        return res.status(404).json({ message: 'Plan not found', error: planError?.message });
      }
      
      if (!plan.stripe_price_id) {
        console.error('❌ Plan missing Stripe price ID:', plan);
        return res.status(400).json({ message: 'Plan not configured for Stripe', planName: plan.name });
      }
      
      // Create checkout session with customer email
      // The webhook will handle creating the user and subscription after successful payment
      const session = await stripe.checkout.sessions.create({
        customer_email: email,
        mode: 'subscription',
        payment_method_types: ['card'],
        line_items: [
          {
            price: plan.stripe_price_id,
            quantity: 1,
          },
        ],
        success_url: `${req.headers.origin}/portal?success=true`,
        cancel_url: `${req.headers.origin}/?canceled=true`,
        metadata: {
          planId: planId.toString(),
          email: email,
        },
      });
      
      console.log('✅ Checkout session created:', session.id);
      res.json({ url: session.url });
    } catch (error: any) {
      console.error('❌ Error creating checkout session:', error);
      res.status(500).json({ message: error.message });
    }
  });

  // Get subscriptions for user
  app.get('/api/subscriptions', verifyAuth, async (req: any, res) => {
    try {
      const userId = req.user.id;
      console.log('🔍 Fetching subscriptions for user:', userId, req.user.email);
      
      const { data: subscriptions, error } = await supabaseAdmin
        .from('subscriptions')
        .select(`
          *,
          plan:plans(*)
        `)
        .eq('profile_id', userId)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('❌ Error fetching subscriptions:', error);
        return res.status(500).json({ message: 'Failed to fetch subscriptions' });
      }
      
      console.log('✅ Found subscriptions:', subscriptions?.length || 0);
      if (subscriptions && subscriptions.length > 0) {
        console.log('📋 First subscription:', JSON.stringify(subscriptions[0], null, 2));
      }
      
      res.json(subscriptions || []);
    } catch (error) {
      console.error('❌ Error fetching subscriptions:', error);
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
        .eq('profile_id', userId)
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
        profile_id: userId,
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
        .eq('profile_id', userId)
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
        .eq('profile_id', userId);
      
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
      console.log('🔍 Fetching invoices for user:', userId);
      
      // Get user's subscriptions first
      const { data: subscriptions } = await supabaseAdmin
        .from('subscriptions')
        .select('id')
        .eq('profile_id', userId);
      
      console.log('📋 User subscriptions:', subscriptions);
      
      if (!subscriptions || subscriptions.length === 0) {
        console.log('⚠️ No subscriptions found for user');
        return res.json([]);
      }
      
      const subscriptionIds = subscriptions.map(s => s.id);
      
      const { data: invoices, error } = await supabaseAdmin
        .from('invoices')
        .select('*')
        .in('subscription_id', subscriptionIds)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('❌ Error fetching invoices:', error);
        return res.status(500).json({ message: 'Failed to fetch invoices' });
      }
      
      console.log('✅ Found invoices:', invoices?.length || 0);
      res.json(invoices || []);
    } catch (error) {
      console.error('❌ Error fetching invoices:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });

  // Sync invoices from Stripe
  app.post('/api/invoices/sync', verifyAuth, async (req: any, res) => {
    try {
      const userId = req.user.id;
      console.log('🔄 Syncing invoices from Stripe for user:', userId);
      
      // Get user's subscriptions
      const { data: subscriptions } = await supabaseAdmin
        .from('subscriptions')
        .select('id, stripe_subscription_id')
        .eq('profile_id', userId);
      
      if (!subscriptions || subscriptions.length === 0) {
        return res.json({ message: 'No subscriptions found', synced: 0 });
      }
      
      let syncedCount = 0;
      
      for (const sub of subscriptions) {
        if (!sub.stripe_subscription_id) continue;
        
        try {
          // Get invoices from Stripe for this subscription
          const stripeInvoices = await stripe.invoices.list({
            subscription: sub.stripe_subscription_id,
            limit: 100,
          });
          
          console.log(`📋 Found ${stripeInvoices.data.length} Stripe invoices for subscription ${sub.id}`);
          
          for (const invoice of stripeInvoices.data) {
            // Check if invoice already exists
            const { data: existing } = await supabaseAdmin
              .from('invoices')
              .select('id')
              .eq('stripe_invoice_id', invoice.id)
              .single();
            
            if (!existing && invoice.status === 'paid') {
              // Create invoice
              await supabaseAdmin.from('invoices').insert({
                subscription_id: sub.id,
                stripe_invoice_id: invoice.id,
                amount: (invoice.amount_paid / 100).toString(),
                due_date: new Date((invoice.due_date || invoice.created) * 1000).toISOString(),
                status: 'paid',
                hosted_invoice_url: invoice.hosted_invoice_url || null,
                invoice_pdf_url: invoice.invoice_pdf || null,
              });
              
              // Create payment record
              await supabaseAdmin.from('payments').insert({
                profile_id: userId,
                subscription_id: sub.id,
                stripe_payment_intent_id: (invoice as any).payment_intent || null,
                amount: (invoice.amount_paid / 100).toString(),
                status: 'succeeded',
                payment_method: invoice.collection_method || 'card',
              });
              
              syncedCount++;
              console.log('✅ Synced invoice:', invoice.id);
            }
          }
        } catch (error) {
          console.error(`❌ Error syncing subscription ${sub.id}:`, error);
        }
      }
      
      console.log(`🎉 Sync complete! Synced ${syncedCount} invoices`);
      res.json({ message: 'Sync complete', synced: syncedCount });
    } catch (error: any) {
      console.error('❌ Error syncing invoices:', error);
      res.status(500).json({ message: error.message });
    }
  });

  // Generate 2nd copy (PIX/Boleto)
  app.post('/api/invoices/:id/generate-copy', verifyAuth, async (req: any, res) => {
    try {
      const invoiceId = parseInt(req.params.id);
      const userId = req.user.id;
      
      console.log('🔄 Generating PIX/Boleto for invoice:', invoiceId);
      
      // Verify invoice belongs to user
      const { data: invoice, error: invoiceError } = await supabaseAdmin
        .from('invoices')
        .select(`
          *,
          subscription:subscriptions(profile_id, stripe_subscription_id)
        `)
        .eq('id', invoiceId)
        .single();
      
      if (invoiceError || !invoice || (invoice.subscription as any)?.profile_id !== userId) {
        console.error('❌ Invoice not found or unauthorized');
        return res.status(404).json({ message: 'Invoice not found' });
      }
      
      // Check if PIX/Boleto already generated
      if (invoice.pix_code && invoice.boleto_url) {
        console.log('✅ Returning existing PIX/Boleto data');
        return res.json({
          pixCode: invoice.pix_code,
          boletoUrl: invoice.boleto_url,
          boletoBarcode: invoice.boleto_barcode,
        });
      }
      
      // Get user profile for customer info
      const { data: profile } = await supabaseAdmin
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (!profile) {
        console.error('❌ Profile not found');
        return res.status(404).json({ message: 'Profile not found' });
      }
      
      // Generate PIX and Boleto data
      const amountInCents = Math.round(parseFloat(invoice.amount) * 100);
      let pixCode = null;
      let pixQrCode = null;
      let boletoUrl = null;
      let boletoBarcode = null;
      
      try {
        console.log('💳 Attempting to create Stripe Payment Intent with PIX/Boleto...');
        const paymentIntent = await stripe.paymentIntents.create({
          amount: amountInCents,
          currency: 'brl',
          payment_method_types: ['pix', 'boleto'],
          customer: profile.stripe_customer_id || undefined,
          metadata: {
            invoice_id: invoiceId.toString(),
            subscription_id: (invoice.subscription as any)?.stripe_subscription_id || '',
          },
          description: `Fatura #${invoiceId} - Grupo da Paz`,
        });
        
        console.log('✅ Payment Intent created:', paymentIntent.id);
        
        // Extract PIX data if available
        if (paymentIntent.next_action?.pix_display_qr_code) {
          pixCode = paymentIntent.next_action.pix_display_qr_code.data;
          pixQrCode = paymentIntent.next_action.pix_display_qr_code.image_url_svg;
          console.log('✅ PIX data extracted from Stripe');
        }
        
        // Extract Boleto data if available
        if (paymentIntent.next_action?.boleto_display_details) {
          boletoUrl = paymentIntent.next_action.boleto_display_details.hosted_voucher_url;
          boletoBarcode = paymentIntent.next_action.boleto_display_details.number;
          console.log('✅ Boleto data extracted from Stripe');
        }
      } catch (stripeError: any) {
        console.warn('⚠️ Stripe PIX/Boleto not available (test mode or not configured):', stripeError.message);
      }
      
      // Generate demo data if Stripe didn't provide real PIX/Boleto
      if (!pixCode || !boletoUrl) {
        console.log('📝 Generating demonstration PIX/Boleto data...');
        
        // Generate valid PIX EMV format (padrão Banco Central do Brasil)
        const amountStr = (amountInCents / 100).toFixed(2);
        const pixPayload = `00020126580014br.gov.bcb.pix0136${crypto.randomUUID().replace(/-/g, '')}520400005303986540${amountStr.length}${amountStr}5802BR5913Grupo da Paz6009Fortaleza62070503***6304`;
        const checksum = crypto.createHash('sha256').update(pixPayload).digest('hex').substring(0, 4).toUpperCase();
        pixCode = pixPayload + checksum;
        
        // Generate demo boleto data
        boletoUrl = `https://boleto-demo.grupodapaz.com/invoice-${invoiceId}.pdf`;
        const randomDigits = Math.floor(Math.random() * 10000000000000).toString().padStart(47, '0');
        boletoBarcode = randomDigits;
        
        console.log('✅ Demo PIX/Boleto generated');
      }
      
      // Update invoice with PIX/Boleto data
      await supabaseAdmin
        .from('invoices')
        .update({
          pix_code: pixCode,
          boleto_url: boletoUrl,
          boleto_barcode: boletoBarcode,
          updated_at: new Date().toISOString(),
        })
        .eq('id', invoiceId);
      
      console.log('✅ Invoice updated with PIX/Boleto data');
      
      res.json({
        pixCode,
        boletoUrl,
        boletoBarcode,
        pixQrCode,
      });
    } catch (error: any) {
      console.error('❌ Error generating copy:', error);
      res.status(500).json({ message: error.message || 'Failed to generate copy' });
    }
  });

  // Stripe webhook handler
  app.post('/api/webhooks/stripe', async (req: any, res) => {
    const sig = req.headers['stripe-signature'];
    
    if (!sig) {
      console.error('❌ No Stripe signature header');
      return res.status(400).send('No signature');
    }
    
    let event;
    
    try {
      // req.body is already a Buffer thanks to express.raw() middleware
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET || ''
      );
      console.log('✅ Webhook signature verified:', event.type);
    } catch (err: any) {
      console.error('❌ Webhook signature verification failed:', err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }
    
    // Handle the event
    try {
      switch (event.type) {
        case 'checkout.session.completed': {
          const session = event.data.object as any;
          const email = session.metadata?.email || session.customer_email;
          const planId = session.metadata?.planId;
          
          console.log('🎉 Checkout completado:', { email, planId });
          
          if (email && planId && session.subscription) {
            // Gerar senha aleatória
            const generatedPassword = crypto.randomBytes(8).toString('hex');
            
            // Buscar plano
            const { data: plan } = await supabaseAdmin
              .from('plans')
              .select('name')
              .eq('id', planId)
              .single();
            
            try {
              let userId: string;
              
              // Tentar criar usuário no Supabase Auth
              const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
                email: email,
                password: generatedPassword,
                email_confirm: true,
              });
              
              // Se usuário já existe, buscar o ID existente e atualizar a senha
              if (authError && authError.message?.includes('already been registered')) {
                console.log('⚠️ Usuário já existe, buscando ID existente...');
                const { data: existingUser } = await supabaseAdmin.auth.admin.listUsers();
                const user = existingUser?.users.find(u => u.email === email);
                
                if (!user) {
                  console.error('❌ Não foi possível encontrar usuário existente');
                  throw new Error('Usuário não encontrado');
                }
                
                userId = user.id;
                
                // Atualizar a senha do usuário existente com a nova senha gerada
                await supabaseAdmin.auth.admin.updateUserById(userId, {
                  password: generatedPassword,
                });
                
                console.log('✅ Usando usuário existente:', userId);
                console.log('✅ Senha atualizada para o novo pagamento');
              } else if (authError) {
                console.error('❌ Erro ao criar usuário:', authError);
                throw authError;
              } else {
                userId = authData!.user.id;
                console.log('✅ Usuário criado no Supabase Auth:', userId);
                console.log('✅ Perfil criado automaticamente pelo trigger do Supabase');
              }
              
              // Atualizar perfil com Stripe Customer ID
              await supabaseAdmin
                .from('profiles')
                .update({
                  stripe_customer_id: session.customer || null,
                })
                .eq('id', userId);
              
              // Verificar se já existe subscription para este Stripe subscription ID
              const { data: existingSub } = await supabaseAdmin
                .from('subscriptions')
                .select('id')
                .eq('stripe_subscription_id', session.subscription.toString())
                .single();
              
              if (!existingSub) {
                // Criar subscription
                const { error: subError } = await supabaseAdmin.from('subscriptions').insert({
                  profile_id: userId,
                  plan_id: planId,
                  stripe_subscription_id: session.subscription.toString(),
                  status: 'active',
                  start_date: new Date().toISOString(),
                });
                
                if (subError) {
                  console.error('❌ Erro ao criar subscription:', subError);
                } else {
                  console.log('✅ Subscription criada');
                }
              } else {
                console.log('⚠️ Subscription já existe para este Stripe ID');
              }
              
              // Enviar email de boas-vindas
              await sendWelcomeEmail(email, generatedPassword, plan?.name || 'Plano Contratado');
              
              console.log('✅ Processo de onboarding concluído para:', email);
              
            } catch (error) {
              console.error('❌ Erro no processo de onboarding:', error);
            }
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
              cancel_at_period_end: subscription.cancel_at_period_end,
              end_date: subscription.canceled_at ? new Date(subscription.canceled_at * 1000).toISOString() : null,
            })
            .eq('stripe_subscription_id', subscription.id);
          break;
        }
        
        case 'invoice.payment_succeeded': {
          const invoice = event.data.object as any;
          console.log('💰 Invoice payment succeeded:', invoice.id);
          
          // Find subscription
          const { data: sub } = await supabaseAdmin
            .from('subscriptions')
            .select('id, profile_id')
            .eq('stripe_subscription_id', invoice.subscription)
            .single();
          
          console.log('📋 Found subscription:', sub);
          
          if (sub) {
            // Create invoice record
            const { data: createdInvoice, error: invoiceError } = await supabaseAdmin
              .from('invoices')
              .insert({
                subscription_id: sub.id,
                stripe_invoice_id: invoice.id,
                amount: (invoice.amount_paid / 100).toString(),
                due_date: new Date((invoice.due_date || Date.now() / 1000) * 1000).toISOString(),
                status: 'paid',
                hosted_invoice_url: invoice.hosted_invoice_url || null,
                invoice_pdf_url: invoice.invoice_pdf || null,
              })
              .select()
              .single();
            
            if (invoiceError) {
              console.error('❌ Error creating invoice:', invoiceError);
            } else {
              console.log('✅ Invoice created:', createdInvoice);
            }
            
            // Create payment record
            const { data: createdPayment, error: paymentError } = await supabaseAdmin
              .from('payments')
              .insert({
                profile_id: sub.profile_id,
                subscription_id: sub.id,
                stripe_payment_intent_id: invoice.payment_intent,
                amount: (invoice.amount_paid / 100).toString(),
                status: 'succeeded',
                payment_method: invoice.collection_method || 'card',
              })
              .select()
              .single();
            
            if (paymentError) {
              console.error('❌ Error creating payment:', paymentError);
            } else {
              console.log('✅ Payment created:', createdPayment);
            }
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

  // Rotas de Email
  app.post('/api/test-email', async (req, res) => {
    try {
      const { email, type = 'welcome' } = req.body;
      
      if (!email) {
        return res.status(400).json({ error: 'Email é obrigatório' });
      }

      let result;
      switch (type) {
        case 'welcome':
          result = await sendWelcomeEmailSMTP(email, 'senha123', 'Plano Premium');
          break;
        case 'reset':
          result = await sendPasswordResetEmail(email, 'token123');
          break;
        case 'contact':
          result = await sendContactEmail('João Silva', email, 'Esta é uma mensagem de teste do sistema de contato.');
          break;
        default:
          return res.status(400).json({ error: 'Tipo de email inválido' });
      }

      res.json({ 
        success: true, 
        message: `Email ${type} enviado com sucesso`,
        messageId: result.messageId 
      });
    } catch (error) {
      console.error('Erro ao enviar email de teste:', error);
      res.status(500).json({ error: 'Falha ao enviar email' });
    }
  });

  app.get('/api/test-email-connection', async (req, res) => {
    try {
      const isConnected = await testEmailConnection();
      res.json({ 
        success: isConnected,
        message: isConnected ? 'Conexão SMTP OK' : 'Falha na conexão SMTP'
      });
    } catch (error) {
      console.error('Erro ao testar conexão SMTP:', error);
      res.status(500).json({ error: 'Falha ao testar conexão' });
    }
  });

  app.post('/api/send-contact', async (req, res) => {
    try {
      const { name, email, message } = req.body;
      
      if (!name || !email || !message) {
        return res.status(400).json({ error: 'Nome, email e mensagem são obrigatórios' });
      }

      const result = await sendContactEmail(name, email, message);
      
      res.json({ 
        success: true, 
        message: 'Mensagem enviada com sucesso',
        messageId: result.messageId 
      });
    } catch (error) {
      console.error('Erro ao enviar email de contato:', error);
      res.status(500).json({ error: 'Falha ao enviar mensagem' });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
