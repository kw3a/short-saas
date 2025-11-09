import { db } from "@/db"
import { balance, creditPackage, creditPurchase } from "@/db/schema"
import { WebhookOrderPaidPayload } from "@polar-sh/sdk/models/components/webhookorderpaidpayload.js"
import { eq } from "drizzle-orm"

export async function processOrderPaid(payload: WebhookOrderPaidPayload) {
  const data = payload.data
  const externalUserId = data.customer.externalId
  const productId = data.productId
  const amountCents = data.totalAmount
  const checkoutId = data.id

  if (!externalUserId || !productId) {
    return { handled: false, reason: !externalUserId ? "missing_user" : "missing_product" }
  }

  const pkg = await db
    .select({ id: creditPackage.id, credits: creditPackage.credits })
    .from(creditPackage)
    .where(eq(creditPackage.polarProductId, productId))

  if (pkg.length === 0) {
    return { handled: false, reason: "package_not_found", productId }
  }

  const pkgId = pkg[0].id
  const creditsToAdd = pkg[0].credits

  await db.transaction(async (tx) => {
    const existing = await tx
      .select({ id: balance.id, totalCredits: balance.totalCredits })
      .from(balance)
      .where(eq(balance.userId, externalUserId))
      .limit(1)

    if (existing.length === 0) {
      await tx.insert(balance).values({ userId: externalUserId, totalCredits: creditsToAdd })
    } else {
      await tx
        .update(balance)
        .set({ totalCredits: (existing[0].totalCredits ?? 0) + creditsToAdd, payingUser: true })
        .where(eq(balance.userId, externalUserId))
    }

    if (checkoutId) {
      await tx
        .insert(creditPurchase)
        .values({
          userId: externalUserId,
          packageId: pkgId,
          polarOrderId: checkoutId,
          amountCents: amountCents,
          status: "paid",
        })
        .onConflictDoNothing()
    }
  })

  return { handled: true, userId: externalUserId, productId, creditsAdded: creditsToAdd }
}
