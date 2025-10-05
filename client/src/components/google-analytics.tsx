import { useEffect } from 'react';

interface GoogleAnalyticsProps {
  measurementId: string;
}

export default function GoogleAnalytics({ measurementId }: GoogleAnalyticsProps) {
  useEffect(() => {
    // Load Google Analytics script
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    document.head.appendChild(script);

    // Initialize gtag
    window.dataLayer = window.dataLayer || [];
    function gtag(...args: any[]) {
      window.dataLayer.push(args);
    }
    gtag('js', new Date());
    gtag('config', measurementId, {
      page_title: document.title,
      page_location: window.location.href,
    });

    // Track page views on route changes
    const handleRouteChange = () => {
      gtag('config', measurementId, {
        page_title: document.title,
        page_location: window.location.href,
      });
    };

    // Listen for popstate events (back/forward navigation)
    window.addEventListener('popstate', handleRouteChange);

    return () => {
      window.removeEventListener('popstate', handleRouteChange);
    };
  }, [measurementId]);

  return null;
}

// Google Analytics 4 event tracking functions
export const trackEvent = (eventName: string, parameters?: Record<string, any>) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, parameters);
  }
};

// Common events for the funeral service website
export const trackPlanView = (planName: string, planPrice: string) => {
  trackEvent('view_item', {
    item_name: planName,
    value: parseFloat(planPrice.replace(/[^\d,]/g, '').replace(',', '.')),
    currency: 'BRL',
    item_category: 'funeral_plans'
  });
};

export const trackPlanClick = (planName: string, planPrice: string) => {
  trackEvent('select_item', {
    item_name: planName,
    value: parseFloat(planPrice.replace(/[^\d,]/g, '').replace(',', '.')),
    currency: 'BRL',
    item_category: 'funeral_plans'
  });
};

export const trackContactForm = (formType: string) => {
  trackEvent('generate_lead', {
    form_type: formType,
    event_category: 'contact'
  });
};

export const trackPhoneClick = (phoneNumber: string) => {
  trackEvent('phone_call', {
    phone_number: phoneNumber,
    event_category: 'contact'
  });
};

export const trackWhatsAppClick = () => {
  trackEvent('whatsapp_click', {
    event_category: 'contact'
  });
};

// Declare gtag function for TypeScript
declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}
