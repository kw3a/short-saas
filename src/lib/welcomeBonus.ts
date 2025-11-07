import { balance, creditAdjustment } from "@/db/schema";
import { db } from "@/db";

export async function giveWelcomeBonus(userId: string) {
    await db.insert(balance).values({
      userId,
      totalCredits: 1000,
    })
    await db.insert(creditAdjustment).values({
      userId,
      amount: 1000,
      type: "promotion",
      reason: "Welcome bonus",
    })
}