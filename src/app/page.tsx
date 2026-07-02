import type { Metadata } from "next"
import { NavBar } from "@/components/navbar"
import { PricingPlans } from "@/components/pricing-plans"
import { getActivePricingPlans } from "@/lib/pricing"
import { Hero } from "@/components/hero"
import { Features } from "@/components/features"
import { FAQ } from "@/components/faq"
import { Products } from "@/components/products"
import { Footer } from "@/components/footer"
import { getLandingMessages, resolveRequestLocale } from "@/lib/i18n"
import { siteConfig, siteUrl, ogLocale } from "@/lib/site"

export async function generateMetadata(): Promise<Metadata> {
  const locale = await resolveRequestLocale()
  const messages = getLandingMessages(locale)
  return {
    title: messages.metadata.title,
    description: messages.metadata.description,
    alternates: {
      canonical: "/",
      languages: {
        en: "/",
        es: "/",
        "x-default": "/",
      },
    },
    openGraph: {
      type: "website",
      siteName: siteConfig.name,
      title: messages.metadata.title,
      description: messages.metadata.description,
      url: siteUrl,
      locale: ogLocale[locale],
      alternateLocale: locale === "en" ? ["es_ES"] : ["en_US"],
    },
    twitter: {
      card: "summary_large_image",
      title: messages.metadata.title,
      description: messages.metadata.description,
    },
  }
}

export default async function Home() {
  const pricingPlans = getActivePricingPlans()
  const locale = await resolveRequestLocale()
  const messages = getLandingMessages(locale)

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${siteUrl}/#organization`,
        name: siteConfig.name,
        url: siteUrl,
        logo: `${siteUrl}/icon.png`,
      },
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: siteUrl,
        name: siteConfig.name,
        description: messages.metadata.description,
        publisher: { "@id": `${siteUrl}/#organization` },
        inLanguage: locale,
      },
      {
        "@type": "WebApplication",
        name: siteConfig.name,
        url: siteUrl,
        applicationCategory: "MultimediaApplication",
        operatingSystem: "Web",
        description: messages.metadata.description,
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
          description: "Free to start with 1000 credits on sign up",
        },
      },
      {
        "@type": "FAQPage",
        mainEntity: messages.faq.items.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: item.answer,
          },
        })),
      },
    ],
  }

  return (
    <div className="bg-zinc-950 text-white flex flex-col min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="flex-1">
        <NavBar labels={messages.navbar} />
        <Hero messages={messages.hero} />
        <Products messages={messages.products} />
        <Features messages={messages.features} />
        
        {/* Pricing Section */}
        <section id="pricing" className="py-16 sm:py-20 bg-zinc-900/50">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-4xl mx-auto text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">{messages.pricingSection.title}</h2>
              <p className="text-lg text-zinc-300 max-w-2xl mx-auto">
                {messages.pricingSection.subtitle}
              </p>
            </div>
            <div className="max-w-7xl mx-auto">
              <PricingPlans plans={pricingPlans} />
            </div>
          </div>
        </section>
        
        <FAQ messages={messages.faq} />
        
        {/* CTA Section */}
        <section className="py-20 bg-zinc-900/30">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">{messages.pricingSection.title}</h2>
            <p className="text-xl text-zinc-300 mb-8 max-w-2xl mx-auto">
              {messages.pricingSection.subtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="/dashboard" 
                className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-lg hover:opacity-90 transition-opacity text-lg shadow-lg hover:shadow-xl shadow-blue-500/20"
              >
                {messages.pricingSection.primaryCta}
              </a>
              <a 
                href="#pricing" 
                className="px-8 py-4 border border-zinc-700 text-white font-medium rounded-lg hover:bg-zinc-800/50 transition-colors text-lg hover:border-zinc-600"
              >
                {messages.pricingSection.secondaryCta}
              </a>
            </div>
          </div>
        </section>
      </div>
      <Footer messages={messages.footer} />
    </div>
  )
}
