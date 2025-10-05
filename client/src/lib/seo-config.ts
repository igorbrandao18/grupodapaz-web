// SEO Configuration for Grupo da Paz website
export const seoConfig = {
  // Site information
  siteName: 'Grupo da Paz',
  siteUrl: 'https://grupodapazbr.com.br',
  siteDescription: 'Proteção familiar completa com 15 anos de experiência. Planos de funeral premium no Ceará. Atendimento 24h, velórios, cremação e sepultamento.',
  
  // Default meta tags
  defaultTitle: 'Grupo da Paz - Proteção Familiar Premium | Planos de Funeral no Ceará',
  defaultDescription: 'Proteção familiar completa com 15 anos de experiência. Planos de funeral premium no Ceará. Atendimento 24h, velórios, cremação e sepultamento. Proteja sua família com carinho e respeito.',
  
  // Keywords for funeral services
  keywords: [
    'plano funeral',
    'proteção familiar',
    'velório',
    'cremação',
    'sepultamento',
    'Ceará',
    'Fortaleza',
    'funeral premium',
    'seguro funeral',
    'assistência funeral',
    'casa funerária',
    'serviços funerários',
    'plano de proteção',
    'assistência familiar',
    'funeral completo',
    'velório 24h',
    'cremação Ceará',
    'sepultamento Fortaleza',
    'proteção familiar Ceará',
    'grupo da paz'
  ],
  
  // Social media
  social: {
    facebook: 'https://www.facebook.com/grupodapazbr',
    instagram: 'https://www.instagram.com/grupodapazbr',
    twitter: 'https://www.twitter.com/grupodapazbr',
    linkedin: 'https://www.linkedin.com/company/grupodapazbr'
  },
  
  // Contact information
  contact: {
    phone: '+55-85-99999-9999',
    email: 'contato@grupodapazbr.com.br',
    address: {
      street: 'Rua das Flores, 123',
      city: 'Fortaleza',
      state: 'CE',
      zipCode: '60000-000',
      country: 'Brasil'
    }
  },
  
  // Business information
  business: {
    name: 'Grupo da Paz',
    foundedYear: 2009,
    yearsOfExperience: 15,
    familiesServed: '50K+',
    unitsCount: 3,
    serviceArea: 'Ceará',
    serviceType: 'Funeral Services',
    businessHours: '24 horas por dia, 7 dias por semana'
  },
  
  // SEO settings
  seo: {
    robots: 'index, follow',
    language: 'pt-BR',
    geoRegion: 'BR-CE',
    geoPlacename: 'Ceará',
    geoPosition: '-3.7172;-38.5434',
    icbm: '-3.7172, -38.5434'
  },
  
  // Page-specific configurations
  pages: {
    home: {
      title: 'Grupo da Paz - Proteção Familiar Premium | Planos de Funeral no Ceará',
      description: 'Proteção familiar completa com 15 anos de experiência. Planos de funeral premium no Ceará. Atendimento 24h, velórios, cremação e sepultamento.',
      keywords: 'plano funeral, proteção familiar, velório, cremação, sepultamento, Ceará, Fortaleza'
    },
    login: {
      title: 'Portal do Cliente - Grupo da Paz',
      description: 'Acesse seu portal do cliente Grupo da Paz. Gerencie seu plano de proteção familiar, dependentes e pagamentos.',
      keywords: 'portal cliente, login, plano funeral, proteção familiar'
    },
    portal: {
      title: 'Portal do Cliente - Grupo da Paz',
      description: 'Gerencie seu plano de proteção familiar no portal do cliente Grupo da Paz.',
      keywords: 'portal cliente, plano funeral, proteção familiar, dependentes'
    }
  },
  
  // Structured data schemas
  schemas: {
    organization: {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'Grupo da Paz',
      description: 'Proteção familiar completa com 15 anos de experiência. Planos de funeral premium no Ceará.',
      url: 'https://grupodapazbr.com.br',
      logo: 'https://grupodapazbr.com.br/assets/image_1759342528663.png',
      telephone: '+55-85-99999-9999',
      email: 'contato@grupodapazbr.com.br',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Rua das Flores, 123',
        addressLocality: 'Fortaleza',
        addressRegion: 'CE',
        postalCode: '60000-000',
        addressCountry: 'BR'
      },
      foundingDate: '2009',
      areaServed: {
        '@type': 'State',
        name: 'Ceará'
      },
      serviceType: 'Funeral Services'
    },
    
    service: {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: 'Serviços Funerários Premium',
      description: 'Oferecemos serviços completos de funeral com atendimento 24h, velórios, cremação, sepultamento e assistência familiar.',
      provider: {
        '@type': 'Organization',
        name: 'Grupo da Paz'
      },
      areaServed: {
        '@type': 'State',
        name: 'Ceará'
      },
      serviceType: 'Funeral Services'
    }
  }
};

// Helper function to generate page title
export const generatePageTitle = (pageTitle?: string): string => {
  if (pageTitle) {
    return `${pageTitle} | ${seoConfig.siteName}`;
  }
  return seoConfig.defaultTitle;
};

// Helper function to generate page description
export const generatePageDescription = (pageDescription?: string): string => {
  return pageDescription || seoConfig.defaultDescription;
};

// Helper function to generate keywords string
export const generateKeywordsString = (additionalKeywords?: string[]): string => {
  const allKeywords = [...seoConfig.keywords];
  if (additionalKeywords) {
    allKeywords.push(...additionalKeywords);
  }
  return allKeywords.join(', ');
};
