export type PricingPlan = {
  name: string;
  credits: number;
  priceCents: number;
  highlight: boolean;
  savings: number;
  slug: string;
  productId: string;
};

const STATIC_PLANS: PricingPlan[] = [
  {
    name: "Storyboard",
    credits: 35000,
    priceCents: 999,
    highlight: false,
    savings: 0,
    slug: "storyboard",
    productId: process.env.ENVIRONMENT === "production" ? "59fcf1ae-cb86-431a-ac62-fb00e9ce5c44" : "9d2e10ae-4cc4-49d3-906a-472494c11753"
  },
  {
    name: "Producer",
    credits: 150000,
    priceCents: 2499,
    highlight: true,
    savings: 70,
    slug: "producer",
    productId: process.env.ENVIRONMENT === "production" ? "aff73a53-6af4-4f10-b55b-bac67a396fca" : "3627039b-0d53-4e2e-8f57-2e4795aa4f32"
  },
  {
    name: "Studio",
    credits: 750000,
    priceCents: 9999,
    highlight: false,
    savings: 25,
    slug: "studio",
    productId: process.env.ENVIRONMENT === "production" ? "ccacbdd4-d2c3-4a21-bcbc-f48f1ced14ec" : "f1454fcc-67f7-4feb-82e4-bb3073cf81f6"
  }
];

export function getActivePricingPlans() {
  return STATIC_PLANS;
}

export function getCheckoutProducts() {
  return STATIC_PLANS.map(plan => ({
    productId: plan.productId,
    slug: plan.slug
  }));
}
