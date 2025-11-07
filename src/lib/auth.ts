import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db";
import { polar, checkout, webhooks } from "@polar-sh/better-auth";
import { Polar } from "@polar-sh/sdk";
import { getCheckoutProducts } from "@/lib/pricing";
import { processOrderPaid } from "@/lib/order-paid";
import { processOrderRefunded } from "@/lib/order-refunded";
import { giveWelcomeBonus } from "./welcomeBonus";

export const polarClient = new Polar({
  accessToken: process.env.POLAR_ACCESS_TOKEN,
  server: "sandbox",
});

const checkoutProducts = await (async () => {
  try {
    const list = await getCheckoutProducts();
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
})();

export const auth = betterAuth({
  secret: process.env.BETTER_AUTH_SECRET,
  socialProviders: {
    google: {
      prompt: "select_account", // This will force the user to select an account
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }
  },
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
  baseURL: process.env.BETTER_AUTH_URL,
  session: {
    modelName: "sessions",
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // Cache duration in seconds
    },
  },
  plugins: [
    polar({
      client: polarClient,
      //createCustomerOnSignUp: true,
      use: [
        checkout({
          products: checkoutProducts,
          successUrl: process.env.POLAR_SUCCESS_URL,
          authenticatedUsersOnly: true
        }),
        webhooks({
          secret: process.env.POLAR_WEBHOOK_SECRET ?? "",
          onOrderPaid: async (payload) => {
            console.log("[polar webhook] onOrderPaid", payload)
            try {
              await processOrderPaid(payload)
            } catch (e) {
              console.error("[polar webhook] onOrderPaid handler error", e)
            }
          },
          onOrderRefunded: async (payload) => {
            console.log("[polar webhook] onOrderRefunded", payload)
            try {
              await processOrderRefunded(payload)
            } catch (e) {
              console.error("[polar webhook] onOrderRefunded handler error", e)
            }
          },
        }),
      ],
    })
  ],
  user: {
    modelName: "users",
    deleteUser: {
      enabled: true,
      afterDelete: async (user, request) => {
        await polarClient.customers.deleteExternal({
          externalId: user.id,
        });
      },
    },
  },
});
