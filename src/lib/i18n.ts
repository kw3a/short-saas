export type Locale = "en" | "es"

export const supportedLocales: Locale[] = ["en", "es"]

export function detectLocale(acceptLanguage: string | null | undefined): Locale {
  // Browser language is intentionally ignored; default to English
  return "en"
}

/**
 * Resolve the active locale from the request: prefer the `lang` cookie,
 * fall back to the Accept-Language header. Safe to call from any Server
 * Component / route handler.
 */
export async function resolveRequestLocale(): Promise<Locale> {
  const { headers } = await import("next/headers")
  const h = await headers()
  const cookieHeader = h.get("cookie") ?? ""
  if (cookieHeader) {
    const match = cookieHeader.match(/(?:^|; )lang=(en|es)(?:;|$)/)
    const cookieLang = match?.[1] as Locale | undefined
    if (cookieLang && supportedLocales.includes(cookieLang)) {
      return cookieLang
    }
  }
  return detectLocale(h.get("accept-language") ?? null)
}

export type LandingMessages = {
  metadata: {
    title: string
    description: string
  }
  navbar: {
    pricing: string
    dashboard: string
    gallery: string
    login: string
    dashboardCta: string
  }
  hero: {
    title: string
    subtitle: string
    primaryCta: string
    secondaryCta: string
    bullets: string[]
    note: string
    monetizationCta: string
    monetizationModalTitle: string
    monetizationModalBody: string[]
    monetizationModalClose: string
  }
  products: {
    sectionTitle: string
    sectionSubtitle: string
    items: {
      narrationName: string
      narrationDescription: string
      askredditName: string
      askredditDescription: string
      comingSoonName: string
      comingSoonDescription: string
      comingSoonCta: string
      tryPrefix: string
    }
  }
  features: {
    sectionTitle: string
    sectionSubtitle: string
    items: string[]
  }
  faq: {
    sectionTitle: string
    sectionSubtitle: string
    items: { question: string; answer: string }[]
  }
  pricingSection: {
    title: string
    subtitle: string
    primaryCta: string
    secondaryCta: string
  }
  footer: {
    productsTitle: string
    narratedStories: string
    askredditShorts: string
    aboutTitle: string
    terms: string
    privacy: string
  }
}

export type DashboardMessages = {
  metadata: {
    title: string
    description: string
  }
  main: {
    stepsTitle: string
    step1Title: string
    step1Description: string
    step2Title: string
    step2Description: string
    step3Title: string
    step3Description: string
    promoTitle: string
    promoSubtitle: string
    promoCta: string
    toolsTitle: string
    narrationTitle: string
    narrationDescription: string
    narrationCta: string
    askredditTitle: string
    askredditDescription: string
    askredditCta: string
  }
  sidebar: {
    videoGenerationSection: string
    historySection: string
    narrationLink: string
    askredditLink: string
    galleryLink: string
    purchaseHistoryLink: string
    creditHistoryLink: string
    creditsSuffix: string
    creditsLoading: string
    buyCreditsTitle: string
    signOut: string
    signIn: string
  }
  mobile: {
    menuTitle: string
    videoGenerationSection: string
    historySection: string
    narrationLink: string
    askredditLink: string
    galleryLink: string
    purchaseHistoryLink: string
    creditHistoryLink: string
    creditsSuffix: string
    creditsLoading: string
    buyCreditsTitle: string
    signOut: string
    logIn: string
  }
  forms: {
    narration: {
      pageTitle: string
      pageSubtitle: string
      generateCta: string
      generatingLabel: string
      fields: {
        scriptLabel: string
        scriptPlaceholder: string
        scriptCounterSuffix: string
        titleLabel: string
        titlePlaceholder: string
        titleCounterSuffix: string
        languageLabel: string
        voiceLabel: string
        musicLabel: string
        backgroundLabel: string
      }
    }
    askreddit: {
      pageTitle: string
      pageSubtitle: string
      generateCta: string
      generatingLabel: string
      fields: {
        titleLabel: string
        titlePlaceholder: string
        titleCounterSuffix: string
        commentsLabel: string
        commentLabelPrefix: string
        languageLabel: string
        voiceLabel: string
        musicLabel: string
        backgroundLabel: string
      }
    }
    buy: {
      title: string
      subtitle: string
    }
  }
}

export const landingMessages: Record<Locale, LandingMessages> = {
  en: {
    metadata: {
      title: "ViralShort — AI Faceless Video Generator",
      description:
        "Create viral faceless short videos from scripts or AskReddit threads. Generate subtitles, voiceover, and cinematic backgrounds.",
    },
    navbar: {
      pricing: "Pricing",
      dashboard: "Dashboard",
      gallery: "Gallery",
      login: "Log in",
      dashboardCta: "Dashboard",
    },
    hero: {
      title: "Create Viral Shorts in Minutes",
      subtitle: "Transform your ideas into engaging short videos with AI. No editing skills required.",
      primaryCta: "Create a Video Now",
      secondaryCta: "Our Products",
      bullets: [
        "Avoid zero views",
        "Perfect format to post on YouTube, TikTok and Facebook",
        "Monetize your account with faceless videos",
      ],
      note: "No credit card required. Get 1000 free credits on sign up",
      monetizationCta: "How to monetize my TikTok channel?",
      monetizationModalTitle: "How to monetize your TikTok channel",
      monetizationModalBody: [
        "Create a TikTok account with your correct age, and if possible in a Tier 1 region (US, UK, CA, etc.) where CPMs are higher.",
        "Choose a clear niche (stories, Reddit content, tutorials, etc.).",
        "Create videos easily with our AI video generator.",
        "Post consistently so the algorithm understands your content.",
        "Use strong hooks in the first 2–3 seconds so people stop scrolling.",
        "Optimize watch time: keep videos short, dynamic and easy to understand, and add clear calls to action (follow, link in bio, playlist, etc.).",
        "Expect 20 USD to 40 USD per 1M views (or 0.02 to 0.04 per 1000 views).",
      ],
      monetizationModalClose: "Close",
    },
    products: {
      sectionTitle: "Our Video Generation Products",
      sectionSubtitle:
        "Choose the perfect video type for your content needs. Each product is designed to help you create engaging content effortlessly.",
      items: {
        narrationName: "Narrated Story",
        narrationDescription: "Create engaging narrated stories with AI voiceovers and popular background videos.",
        askredditName: "AskReddit Videos",
        askredditDescription: "Turn popular Reddit threads into engaging videos with AI voiceovers and comment screenshots.",
        comingSoonName: "More Coming Soon",
        comingSoonDescription: "We're constantly adding new video generation types. Stay tuned!",
        comingSoonCta: "Coming Soon",
        tryPrefix: "Try ",
      },
    },
    features: {
      sectionTitle: "Everything You Need to Go Viral",
      sectionSubtitle:
        "Our platform provides all the tools you need to create, optimize, and publish engaging short-form content.",
      items: [
        "One-Click Generation",
        "Lightning Fast",
        "AI-Powered",
        "Flexible Credits",
      ],
    },
    faq: {
      sectionTitle: "Frequently Asked Questions",
      sectionSubtitle:
        "Everything you need to know about ViralShort. Can't find the answer you're looking for? Contact our support team.",
      items: [
        {
          question: "How does the credit system work?",
          answer:
            "ViralShort uses a credit-based system where each video generation cost is based on the amount of characters in the prompt. 1 credit = 1 character",
        },
        {
          question: "What can I create with ViralShort?",
          answer:
            "You can create engaging short-form videos for platforms like TikTok, Instagram Reels, and YouTube Shorts. Our AI helps you generate professional-quality content in minutes, complete with visuals and voiceovers.",
        },
        {
          question: "How long does it take to generate a video?",
          answer:
            "Most videos are generated in under 2 minutes, depending on the length, complexity and load of the server.",
        },
        {
          question: "Can I download my generated videos?",
          answer: "Yes, you can download your generated videos anytime.",
        },
        {
          question: "How to create watermark-free videos?",
          answer: "Buy any credit package and your videos will be always watermark-free.",
        },
        {
          question: "In how much time the credits expire?",
          answer: "The credits never expire.",
        },
      ],
    },
    pricingSection: {
      title: "Simple, Transparent Pricing",
      subtitle: "Choose the perfect plan for your needs. No subscriptions, no recurring payments.",
      primaryCta: "Start Creating Now",
      secondaryCta: "View Credit Packages",
    },
    footer: {
      productsTitle: "Products",
      narratedStories: "Narrated stories",
      askredditShorts: "AskReddit Shorts",
      aboutTitle: "About",
      terms: "Terms of Service",
      privacy: "Privacy Policy",
    },
  },
  es: {
    metadata: {
      title: "ViralShort — Generador de shorts sin rostro",
      description:
        "Crea shorts virales a partir de guiones o hilos de Reddit. Genera subtítulos y voz en off.",
    },
    navbar: {
      pricing: "Precios",
      dashboard: "Panel",
      gallery: "Galería",
      login: "Iniciar sesión",
      dashboardCta: "Panel",
    },
    hero: {
      title: "Crea shorts virales en minutos",
      subtitle: "Convierte tus ideas en videos cortos atractivos con IA. No necesitas saber editar.",
      primaryCta: "Crear un video ahora",
      secondaryCta: "Nuestros productos",
      bullets: [
        "Evita tener cero vistas",
        "Formato perfecto para YouTube, TikTok y Facebook",
        "Monetiza tu cuenta con videos sin mostrar tu cara",
      ],
      note: "No necesitas tarjeta. Consigue 1000 créditos gratis al registrarte",
      monetizationCta: "¿Cómo monetizo mi canal de TikTok?",
      monetizationModalTitle: "Cómo monetizar tu canal de TikTok",
      monetizationModalBody: [
        "Crea una cuenta de TikTok con tu edad real y, si es posible, en una región de alto pago como EE. UU., Reino Unido o Canadá.",
        "Elige un nicho claro (historias, contenido de Reddit, tutoriales, etc.).",
        "Crea videos fácilmente con nuestro generador de video AI.",
        "Publica consistentemente para que el algoritmo entienda tu contenido.",
        "Usa ganchos fuertes en los primeros 2–3 segundos para que la gente no haga scroll.",
        "Optimiza el tiempo de visualización: mantén los videos cortos, dinámicos y fáciles de entender, y añade llamados a la acción claros (seguir, enlace en la bio, playlist, etc.).",
        "Espera de 20 a 40 dólares por cada 1M vistas (o 0.02 a 0.04 por cada 1000 vistas) que consigas con tus videos.",
      ],
      monetizationModalClose: "Cerrar",
    },
    products: {
      sectionTitle: "Nuestros productos de video",
      sectionSubtitle:
        "Elige el tipo de video perfecto para tu contenido. Cada producto está diseñado para ayudarte a crear contenido atractivo fácilmente.",
      items: {
        narrationName: "Historia narrada",
        narrationDescription: "Crea historias narradas con voz, subtítulos y fondos populares.",
        askredditName: "Preguntas de Reddit",
        askredditDescription:
          "Convierte hilos populares de Reddit en videos atractivos con voz y screenshots.",
        comingSoonName: "Más muy pronto",
        comingSoonDescription: "Seguimos agregando nuevos tipos de generación de video. Mantente atento.",
        comingSoonCta: "Muy pronto",
        tryPrefix: "Probar ",
      },
    },
    features: {
      sectionTitle: "Todo lo que necesitas para volverte viral",
      sectionSubtitle:
        "Nuestra plataforma te da todas las herramientas para crear, optimizar y publicar contenido corto atractivo.",
      items: [
        "Generación con un clic",
        "Súper rápido",
        "Potenciado por IA",
        "Créditos flexibles",
      ],
    },
    faq: {
      sectionTitle: "Preguntas frecuentes",
      sectionSubtitle:
        "Todo lo que necesitas saber sobre ViralShort. ¿No encuentras la respuesta? Escríbenos a soporte.",
      items: [
        {
          question: "¿Cómo funciona el sistema de créditos?",
          answer:
            "ViralShort usa un sistema de créditos donde el costo de cada video depende de la cantidad de caracteres en el prompt. 1 crédito = 1 carácter.",
        },
        {
          question: "¿Qué puedo crear con ViralShort?",
          answer:
            "Puedes crear videos cortos para TikTok, Instagram Reels y YouTube Shorts. La IA te ayuda a generar contenido profesional en minutos, con subtítulos y voz en off.",
        },
        {
          question: "¿Cuánto tarda en generarse un video?",
          answer:
            "La mayoría de los videos se generan en menos de 5 minutos, según la longitud, complejidad y carga del servidor.",
        },
        {
          question: "¿Puedo descargar mis videos?",
          answer: "Sí, puedes descargar tus videos generados cuando quieras.",
        },
        {
          question: "¿Cómo creo videos sin marca de agua?",
          answer:
            "Compra cualquier paquete de créditos y tus videos serán siempre sin marca de agua.",
        },
        {
          question: "¿En cuánto tiempo vencen los créditos?",
          answer: "Los créditos nunca vencen.",
        },
      ],
    },
    pricingSection: {
      title: "Precios simples y transparentes",
      subtitle: "Elige el plan perfecto para ti. Sin suscripciones ni pagos recurrentes.",
      primaryCta: "Empezar a crear",
      secondaryCta: "Ver paquetes de créditos",
    },
    footer: {
      productsTitle: "Productos",
      narratedStories: "Historias narradas",
      askredditShorts: "Preguntas de Reddit",
      aboutTitle: "Acerca de",
      terms: "Términos del servicio",
      privacy: "Política de privacidad",
    },
  },
}

export const dashboardMessages: Record<Locale, DashboardMessages> = {
  en: {
    metadata: {
      title: "Dashboard — ViralShort",
      description:
        "Start creating faceless short videos. Access tools, buy credits, and manage your content.",
    },
    main: {
      stepsTitle: "Get started in 3 steps",
      step1Title: "Create your account",
      step1Description: "Sign up and get 1000 credits for free.",
      step2Title: "Create your faceless video",
      step2Description: "Pick a tool, fill the form, and generate.",
      step3Title: "Publish your video",
      step3Description: "Download and post to your favorite platform.",
      promoTitle: "Buy any credit package and remove the watermark forever",
      promoSubtitle: "Upgrade once. No subscriptions.",
      promoCta: "View credit packages",
      toolsTitle: "Tools",
      narrationTitle: "Narrated Story",
      narrationDescription:
        "Turn your script into a faceless video with subtitles and background.",
      narrationCta: "Create a new video",
      askredditTitle: "AskReddit",
      askredditDescription:
        "Generate videos from a Reddit-style title and comments thread.",
      askredditCta: "Create a new video",
    },
    sidebar: {
      videoGenerationSection: "Video Generation",
      historySection: "History",
      narrationLink: "Narrated Story",
      askredditLink: "AskReddit",
      galleryLink: "Gallery",
      purchaseHistoryLink: "Purchase History",
      creditHistoryLink: "Credit History",
      creditsSuffix: "credits",
      creditsLoading: "Loading...",
      buyCreditsTitle: "Buy more credits",
      signOut: "Sign Out",
      signIn: "Sign In",
    },
    mobile: {
      menuTitle: "Menu",
      videoGenerationSection: "Video Generation",
      historySection: "History",
      narrationLink: "Narrated Story",
      askredditLink: "AskReddit",
      galleryLink: "Gallery",
      purchaseHistoryLink: "Purchase History",
      creditHistoryLink: "Credit History",
      creditsSuffix: "credits",
      creditsLoading: "Loading...",
      buyCreditsTitle: "Buy more credits",
      signOut: "Sign Out",
      logIn: "Log in",
    },
    forms: {
      narration: {
        pageTitle: "Narrated Story Generator",
        pageSubtitle: "Create a narrated short using popular background videos and music.",
        generateCta: "Generate",
        generatingLabel: "Generating...",
        fields: {
          scriptLabel: "Your script",
          scriptPlaceholder: "Paste text or write your script...",
          scriptCounterSuffix: "chars",
          titleLabel: "Title (optional)",
          titlePlaceholder: "My awesome video",
          titleCounterSuffix: "chars",
          languageLabel: "Language",
          voiceLabel: "Voice",
          musicLabel: "Background Music (Optional)",
          backgroundLabel: "Background Video",
        },
      },
      askreddit: {
        pageTitle: "AskReddit Generator",
        pageSubtitle: "Create engaging AskReddit videos with multiple comments.",
        generateCta: "Generate",
        generatingLabel: "Generating...",
        fields: {
          titleLabel: "Title",
          titlePlaceholder: "Enter post title...",
          titleCounterSuffix: "characters",
          commentsLabel: "Comments",
          commentLabelPrefix: "Comment",
          languageLabel: "Language",
          voiceLabel: "Voice",
          musicLabel: "Background Music (Optional)",
          backgroundLabel: "Background Video",
        },
      },
      buy: {
        title: "Buy Credits",
        subtitle: "Choose the perfect plan for your needs. No subscriptions, no recurring payments.",
      },
    },
  },
  es: {
    metadata: {
      title: "Panel — ViralShort",
      description:
        "Empieza a crear videos cortos sin mostrar tu cara. Accede a las herramientas, compra créditos y gestiona tu contenido.",
    },
    main: {
      stepsTitle: "Empieza en 3 pasos",
      step1Title: "Crea tu cuenta",
      step1Description: "Regístrate y consigue 1000 créditos gratis.",
      step2Title: "Crea tu video sin mostrar tu cara",
      step2Description: "Elige una herramienta, completa el formulario y genera.",
      step3Title: "Publica tu video",
      step3Description: "Descarga y publica en tu plataforma favorita.",
      promoTitle: "Compra cualquier paquete de créditos y quita la marca de agua para siempre",
      promoSubtitle: "Paga una sola vez. Sin suscripciones.",
      promoCta: "Ver paquetes de créditos",
      toolsTitle: "Herramientas",
      narrationTitle: "Historia narrada",
      narrationDescription:
        "Convierte tu guion en un video sin mostrar tu cara con subtítulos y fondo.",
      narrationCta: "Crear un nuevo video",
      askredditTitle: "Preguntas de Reddit",
      askredditDescription:
        "Genera videos a partir de un título y comentarios al estilo Reddit.",
      askredditCta: "Crear un nuevo video",
    },
    sidebar: {
      videoGenerationSection: "Generación de video",
      historySection: "Historial",
      narrationLink: "Historia narrada",
      askredditLink: "Preguntas de Reddit",
      galleryLink: "Galería",
      purchaseHistoryLink: "Historial de compras",
      creditHistoryLink: "Historial de créditos",
      creditsSuffix: "créditos",
      creditsLoading: "Cargando...",
      buyCreditsTitle: "Comprar más créditos",
      signOut: "Cerrar sesión",
      signIn: "Iniciar sesión",
    },
    mobile: {
      menuTitle: "Menú",
      videoGenerationSection: "Generación de video",
      historySection: "Historial",
      narrationLink: "Historia narrada",
      askredditLink: "Preguntas de Reddit",
      galleryLink: "Galería",
      purchaseHistoryLink: "Historial de compras",
      creditHistoryLink: "Historial de créditos",
      creditsSuffix: "créditos",
      creditsLoading: "Cargando...",
      buyCreditsTitle: "Comprar más créditos",
      signOut: "Cerrar sesión",
      logIn: "Iniciar sesión",
    },
    forms: {
      narration: {
        pageTitle: "Generador de historias narradas",
        pageSubtitle: "Crea un corto narrado usando videos de fondo y música populares.",
        generateCta: "Generar",
        generatingLabel: "Generando...",
        fields: {
          scriptLabel: "Tu guion",
          scriptPlaceholder: "Pega texto o escribe tu guion...",
          scriptCounterSuffix: "caracteres",
          titleLabel: "Título (opcional)",
          titlePlaceholder: "Mi video increíble",
          titleCounterSuffix: "caracteres",
          languageLabel: "Idioma",
          voiceLabel: "Voz",
          musicLabel: "Música de fondo (opcional)",
          backgroundLabel: "Video de fondo",
        },
      },
      askreddit: {
        pageTitle: "Generador de Preguntas de Reddit",
        pageSubtitle: "Crea videos de Preguntas de Reddit atractivos con múltiples comentarios.",
        generateCta: "Generar",
        generatingLabel: "Generando...",
        fields: {
          titleLabel: "Título",
          titlePlaceholder: "Escribe el título del post...",
          titleCounterSuffix: "caracteres",
          commentsLabel: "Comentarios",
          commentLabelPrefix: "Comentario",
          languageLabel: "Idioma",
          voiceLabel: "Voz",
          musicLabel: "Música de fondo (opcional)",
          backgroundLabel: "Video de fondo",
        },
      },
      buy: {
        title: "Comprar créditos",
        subtitle: "Elige el plan perfecto para ti. Sin suscripciones ni pagos recurrentes.",
      },
    },
  },
}

export function getLandingMessages(locale: Locale): LandingMessages {
  return landingMessages[locale] ?? landingMessages.en
}

export function getDashboardMessages(locale: Locale): DashboardMessages {
  return dashboardMessages[locale] ?? dashboardMessages.en
}
