import { pgTable, text, timestamp, boolean, integer, serial, uuid, jsonb } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
					id: text('id').primaryKey(),
					name: text('name').notNull(),
 email: text('email').notNull().unique(),
 emailVerified: boolean('email_verified').$defaultFn(() => false).notNull(),
 image: text('image'),
 createdAt: timestamp('created_at').$defaultFn(() => /* @__PURE__ */ new Date()).notNull(),
 updatedAt: timestamp('updated_at').$defaultFn(() => /* @__PURE__ */ new Date()).notNull()
				});

export const sessions = pgTable("sessions", {
					id: text('id').primaryKey(),
					expiresAt: timestamp('expires_at').notNull(),
 token: text('token').notNull().unique(),
 createdAt: timestamp('created_at').notNull(),
 updatedAt: timestamp('updated_at').notNull(),
 ipAddress: text('ip_address'),
 userAgent: text('user_agent'),
 userId: text('user_id').notNull().references(()=> users.id, { onDelete: 'cascade' })
				});

export const account = pgTable("account", {
					id: text('id').primaryKey(),
					accountId: text('account_id').notNull(),
 providerId: text('provider_id').notNull(),
 userId: text('user_id').notNull().references(()=> users.id, { onDelete: 'cascade' }),
 accessToken: text('access_token'),
 refreshToken: text('refresh_token'),
 idToken: text('id_token'),
 accessTokenExpiresAt: timestamp('access_token_expires_at'),
 refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
 scope: text('scope'),
 password: text('password'),
 createdAt: timestamp('created_at').notNull(),
 updatedAt: timestamp('updated_at').notNull()
				});

export const verification = pgTable("verification", {
					id: text('id').primaryKey(),
					identifier: text('identifier').notNull(),
 value: text('value').notNull(),
 expiresAt: timestamp('expires_at').notNull(),
 createdAt: timestamp('created_at').$defaultFn(() => /* @__PURE__ */ new Date()),
 updatedAt: timestamp('updated_at').$defaultFn(() => /* @__PURE__ */ new Date())
				});

// 6️⃣ Balance (cached current credit balance)
export const balance = pgTable("balance", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id").notNull().references(()=> users.id, { onDelete: 'set null' }).unique(),
  totalCredits: integer("total_credits").notNull().default(0),
  payingUser: boolean("paying_user").notNull().default(false),
  updatedAt: timestamp("updated_at").notNull().$onUpdate(() => /* @__PURE__ */ new Date()),
});

// 3️⃣ Credit packages (purchase options)
export const creditPackage = pgTable("credit_package", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  credits: integer("credits").notNull(),
  priceCents: integer("price_cents").notNull(),
  currency: text("currency").default("USD"),
  polarSlug: text("polar_slug").notNull(),
  polarProductId: text("polar_product_id").notNull(),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// 4️⃣ Credit purchases (linked to Polar checkout)
export const creditPurchase = pgTable("credit_purchase", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id").notNull().references(()=> users.id, { onDelete: 'set null' }),
  packageId: integer("package_id").references(() => creditPackage.id),
  polarOrderId: text("polar_order_id").notNull().unique(),
  amountCents: integer("amount_cents").notNull(),
  status: text("status", {
    enum: ["pending", "paid", "failed", "refunded"],
  }),
  createdAt: timestamp("created_at").defaultNow(),
});

export const video = pgTable("video", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id").notNull().references(()=> users.id, { onDelete: 'set null' }),
  type: text("type").notNull(),
  creditCost: integer("credit_cost"),
  status: text("status", {
    enum: ["queued", "rendering", "completed", "failed"],
  }).notNull().default("queued"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

// Credit adjustments, for special cases like refunds, failed generations, promotions, etc.
export const creditAdjustment = pgTable("credit_adjustment", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id").notNull().references(()=> users.id, { onDelete: 'set null' }),
  amount: integer("amount").notNull(),
  type: text("type", {
    enum: ["refund", "failed_task", "promotion", "other"],
  }).notNull(),
  reason: text("reason"),
  videoId: uuid("video_id").references(()=> video.id, { onDelete: 'set null' }),
  creditPurchaseId: uuid("credit_purchase_id").references(()=> creditPurchase.id, { onDelete: 'set null' }),
  createdAt: timestamp("created_at").defaultNow(),
})

export const narratedVideo = pgTable("narrated_video", {
  id: uuid("id").defaultRandom().primaryKey(),
  videoId: uuid("video_id").notNull().references(()=> video.id, { onDelete: 'set null' }),
  title: text("title").notNull().default(""),
  script: text("script").notNull(),
  voice: text("voice").notNull(),
  bgVideo: text("bg_video").notNull(),
  music: text("music").notNull().default(""),
  createdAt: timestamp("created_at").defaultNow(),
})

export const askredditVideo = pgTable("askreddit_video", {
  id: uuid("id").defaultRandom().primaryKey(),
  videoId: uuid("video_id").notNull().references(()=> video.id, { onDelete: 'set null' }),
  title: text("title").notNull().default(""),
  comments: text("comments").array().notNull(),
  voice: text("voice").notNull(),
  bgVideo: text("bg_video").notNull(),
  music: text("music").notNull().default(""),
  createdAt: timestamp("created_at").defaultNow(),
})