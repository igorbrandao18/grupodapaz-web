import { useEffect } from 'react';

interface StructuredDataProps {
  type: 'Organization' | 'Service' | 'FAQ' | 'BreadcrumbList';
  data: any;
}

export default function StructuredData({ type, data }: StructuredDataProps) {
  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(data);
    script.id = `structured-data-${type.toLowerCase()}`;
    
    // Remove existing script if it exists
    const existingScript = document.getElementById(`structured-data-${type.toLowerCase()}`);
    if (existingScript) {
      existingScript.remove();
    }
    
    document.head.appendChild(script);
    
    return () => {
      const scriptToRemove = document.getElementById(`structured-data-${type.toLowerCase()}`);
      if (scriptToRemove) {
        scriptToRemove.remove();
      }
    };
  }, [type, data]);

  return null;
}

// Predefined structured data for the organization
export const organizationStructuredData = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Grupo da Paz",
  "description": "Proteção familiar completa com 15 anos de experiência. Planos de funeral premium no Ceará. Atendimento 24h, velórios, cremação e sepultamento.",
  "url": "https://grupodapazbr.com.br",
  "logo": "https://grupodapazbr.com.br/assets/image_1759342528663.png",
  "image": "https://grupodapazbr.com.br/assets/image_1759342528663.png",
  "telephone": "+55-85-99999-9999",
  "email": "contato@grupodapazbr.com.br",
  "address": {
    "@type": "PostalAddress",
    "addressRegion": "CE",
    "addressCountry": "BR",
    "addressLocality": "Fortaleza"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": "-3.7172",
    "longitude": "-38.5434"
  },
  "foundingDate": "2009",
  "areaServed": {
    "@type": "State",
    "name": "Ceará"
  },
  "serviceType": "Funeral Services",
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "Planos de Proteção Familiar",
    "itemListElement": [
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Plano Básico",
          "description": "Proteção individual com serviços essenciais de funeral"
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Plano Essencial",
          "description": "Proteção para você e sua família com serviços completos"
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Plano Premium",
          "description": "Proteção familiar ampliada com serviços premium e personalizados"
        }
      }
    ]
  },
  "sameAs": [
    "https://www.facebook.com/grupodapazbr",
    "https://www.instagram.com/grupodapazbr"
  ]
};

export const serviceStructuredData = {
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "Serviços Funerários Premium",
  "description": "Oferecemos serviços completos de funeral com atendimento 24h, velórios, cremação, sepultamento e assistência familiar.",
  "provider": {
    "@type": "Organization",
    "name": "Grupo da Paz"
  },
  "areaServed": {
    "@type": "State",
    "name": "Ceará"
  },
  "serviceType": "Funeral Services",
  "offers": {
    "@type": "Offer",
    "description": "Planos de proteção familiar com cobertura completa",
    "priceRange": "R$ 89,90 - R$ 249,90"
  }
};
