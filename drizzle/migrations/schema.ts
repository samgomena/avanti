import { sqliteTable, AnySQLiteColumn, uniqueIndex, text, integer, index, foreignKey } from "drizzle-orm/sqlite-core"
  import { sql } from "drizzle-orm"

export const user = sqliteTable("user", {
	id: text().primaryKey().notNull(),
	name: text().notNull(),
	email: text().notNull(),
	emailVerified: integer("email_verified").default(0).notNull(),
	image: text(),
	createdAt: integer("created_at").default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`).notNull(),
	updatedAt: integer("updated_at").default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`).notNull(),
},
(table) => [
	uniqueIndex("user_email_unique").on(table.email),
]);

export const session = sqliteTable("session", {
	id: text().primaryKey().notNull(),
	expiresAt: integer("expires_at").notNull(),
	token: text().notNull(),
	createdAt: integer("created_at").default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`).notNull(),
	updatedAt: integer("updated_at"),
	ipAddress: text("ip_address"),
	userAgent: text("user_agent"),
	userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" } ),
},
(table) => [
	index("session_userId_idx").on(table.userId),
	uniqueIndex("session_token_unique").on(table.token),
]);

export const account = sqliteTable("account", {
	id: text().primaryKey().notNull(),
	accountId: text("account_id").notNull(),
	providerId: text("provider_id").notNull(),
	userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" } ),
	accessToken: text("access_token"),
	refreshToken: text("refresh_token"),
	idToken: text("id_token"),
	accessTokenExpiresAt: integer("access_token_expires_at"),
	refreshTokenExpiresAt: integer("refresh_token_expires_at"),
	scope: text(),
	password: text(),
	createdAt: integer("created_at").default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`).notNull(),
	updatedAt: integer("updated_at"),
},
(table) => [
	index("account_userId_idx").on(table.userId),
]);

export const verification = sqliteTable("verification", {
	id: text().primaryKey().notNull(),
	identifier: text().notNull(),
	value: text().notNull(),
	expiresAt: integer("expires_at").notNull(),
	createdAt: integer("created_at").default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`).notNull(),
	updatedAt: integer("updated_at").default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`),
},
(table) => [
	index("verification_identifier_idx").on(table.identifier),
]);

export const contact = sqliteTable("Contact", {
	id: text().primaryKey().notNull(),
	address: text().notNull(),
	email: text().notNull(),
	phone: text().notNull(),
	facebook: text().notNull(),
	instagram: text().notNull(),
});

export const info = sqliteTable("Info", {
	id: text().primaryKey().notNull(),
	about: text().notNull(),
	contactId: text().notNull().references(() => contact.id),
});

export const hours = sqliteTable("Hours", {
	id: text().primaryKey().notNull(),
	day: text().notNull(),
	open: text().default("").notNull(),
	close: text().default("").notNull(),
	infoId: text().references(() => info.id),
});

export const alert = sqliteTable("Alert", {
	id: text().primaryKey().notNull(),
	start: integer().notNull(),
	end: integer().notNull(),
	title: text(),
	text: text().notNull(),
});

export const menu = sqliteTable("Menu", {
	id: text().primaryKey().notNull(),
	idx: integer().notNull(),
	name: text().notNull(),
	description: text().default(""),
	service: text().default("dinner"),
	course: text().notNull(),
	disabled: integer().default(0).notNull(),
});

export const price = sqliteTable("Price", {
	id: text().primaryKey().notNull(),
	dinner: text().default("").notNull(),
	lunch: text().default("").notNull(),
	hh: text().default("").notNull(),
	drinks: text().default("").notNull(),
	dessert: text().default("").notNull(),
	menuId: text().notNull().references(() => menu.id, { onDelete: "cascade" } ),
});

export const deployment = sqliteTable("Deployment", {
	id: text().primaryKey().notNull(),
	pendingChanges: integer().notNull(),
	createdAt: integer().default(sql`(unixepoch())`).notNull(),
	updatedAt: integer().default(sql`(unixepoch())`).notNull(),
	deployedAt: integer().notNull(),
	userId: text().notNull().references(() => user.id, { onDelete: "cascade" } ),
	status: text().notNull(),
});

export const changeSet = sqliteTable("ChangeSet", {
	id: text().primaryKey().notNull(),
	changes: text().notNull(),
	madeAt: integer().notNull(),
	deploymentId: text().notNull().references(() => deployment.id),
	userId: text().notNull().references(() => user.id),
});

