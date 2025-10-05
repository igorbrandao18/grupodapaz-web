import { useEffect } from 'react';

// Performance optimization utilities
export const preloadImage = (src: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = src;
  });
};

export const preloadImages = async (srcs: string[]): Promise<void> => {
  try {
    await Promise.all(srcs.map(src => preloadImage(src)));
  } catch (error) {
    console.warn('Some images failed to preload:', error);
  }
};

// Intersection Observer for lazy loading
export const useIntersectionObserver = (
  callback: (entries: IntersectionObserverEntry[]) => void,
  options?: IntersectionObserverInit
) => {
  useEffect(() => {
    const observer = new IntersectionObserver(callback, {
      threshold: 0.1,
      rootMargin: '50px',
      ...options,
    });

    return () => observer.disconnect();
  }, [callback, options]);
};

// Critical resource hints
export const addResourceHints = () => {
  useEffect(() => {
    // Preconnect to external domains
    const preconnectDomains = [
      'https://fonts.googleapis.com',
      'https://fonts.gstatic.com',
      'https://www.googletagmanager.com',
    ];

    preconnectDomains.forEach(domain => {
      const link = document.createElement('link');
      link.rel = 'preconnect';
      link.href = domain;
      link.crossOrigin = 'anonymous';
      document.head.appendChild(link);
    });

    // DNS prefetch for external resources
    const dnsPrefetchDomains = [
      'https://images.unsplash.com',
      'https://cdn.jsdelivr.net',
    ];

    dnsPrefetchDomains.forEach(domain => {
      const link = document.createElement('link');
      link.rel = 'dns-prefetch';
      link.href = domain;
      document.head.appendChild(link);
    });
  }, []);
};

// Web Vitals tracking
export const trackWebVitals = () => {
  useEffect(() => {
    // Track Largest Contentful Paint (LCP)
    const trackLCP = () => {
      new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        const lastEntry = entries[entries.length - 1];
        
        if (window.gtag) {
          window.gtag('event', 'web_vitals', {
            event_category: 'Performance',
            event_label: 'LCP',
            value: Math.round(lastEntry.startTime),
            non_interaction: true,
          });
        }
      }).observe({ entryTypes: ['largest-contentful-paint'] });
    };

    // Track First Input Delay (FID)
    const trackFID = () => {
      new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        entries.forEach((entry) => {
          if (window.gtag) {
            window.gtag('event', 'web_vitals', {
              event_category: 'Performance',
              event_label: 'FID',
              value: Math.round(entry.processingStart - entry.startTime),
              non_interaction: true,
            });
          }
        });
      }).observe({ entryTypes: ['first-input'] });
    };

    // Track Cumulative Layout Shift (CLS)
    const trackCLS = () => {
      let clsValue = 0;
      new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        entries.forEach((entry) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        });
        
        if (window.gtag) {
          window.gtag('event', 'web_vitals', {
            event_category: 'Performance',
            event_label: 'CLS',
            value: Math.round(clsValue * 1000),
            non_interaction: true,
          });
        }
      }).observe({ entryTypes: ['layout-shift'] });
    };

    // Initialize tracking
    if ('PerformanceObserver' in window) {
      trackLCP();
      trackFID();
      trackCLS();
    }
  }, []);
};

// Image optimization component
interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  loading?: 'lazy' | 'eager';
  priority?: boolean;
}

export const OptimizedImage = ({ 
  src, 
  alt, 
  className = '', 
  loading = 'lazy',
  priority = false 
}: OptimizedImageProps) => {
  useEffect(() => {
    if (priority) {
      preloadImage(src);
    }
  }, [src, priority]);

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading={priority ? 'eager' : loading}
      decoding="async"
    />
  );
};
