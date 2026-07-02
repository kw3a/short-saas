import { db } from "@/db"
import { balance, creditPackage, creditPurchase, creditAdjustment } from "@/db/schema"
import { WebhookOrderRefundedPayload } from "@polar-sh/sdk/models/components/webhookorderrefundedpayload.js"
import { eq } from "drizzle-orm"

export async function processOrderRefunded(payload: WebhookOrderRefundedPayload) {
  const data = payload.data
  const externalUserId = data.customer.externalId
  const productId = data.product?.id
  const checkoutId = data.id

  if (!externalUserId || !productId) {
    return { handled: false as const, reason: !externalUserId ? "missing_user" : "missing_product" }
  }

  const pkg = await db
    .select({ id: creditPackage.id, credits: creditPackage.credits })
    .from(creditPackage)
    .where(eq(creditPackage.polarProductId, productId))

  if (pkg.length === 0) {
    return { handled: false as const, reason: "package_not_found", productId }
  }

  const creditsToSubtract = pkg[0].credits

  await db.transaction(async (tx) => {
    const existing = await tx
      .select({ id: balance.id, totalCredits: balance.totalCredits })
      .from(balance)
      .where(eq(balance.userId, externalUserId))
      .limit(1)

    const current = existing[0]?.totalCredits ?? 0
    const newTotal = Math.max(0, current - creditsToSubtract)

    if (existing.length === 0) {
      await tx.insert(balance).values({ userId: externalUserId, totalCredits: newTotal })
    } else {
      await tx
        .update(balance)
        .set({ totalCredits: newTotal })
        .where(eq(balance.userId, externalUserId))
    }

    if (checkoutId) {
      await tx
        .update(creditPurchase)
        .set({ status: "refunded" })
        .where(eq(creditPurchase.polarOrderId, checkoutId))
      
      const existingPurchase = await tx
        .select({ id: creditPurchase.id })
        .from(creditPurchase)
        .where(eq(creditPurchase.polarOrderId, checkoutId))
        .limit(1)
      
      if (existingPurchase.length === 0) {
        return { handled: false as const, reason: "purchase_not_found", checkoutId }
      }
      
      await tx.insert(creditAdjustment).values({
        userId: externalUserId,
        amount: -creditsToSubtract,
        type: "refund",
        reason: "order_refunded",
        creditPurchaseId: existingPurchase[0].id,
      })
    }

  })

  return { handled: true as const, userId: externalUserId, creditsSubtracted: creditsToSubtract }
}
