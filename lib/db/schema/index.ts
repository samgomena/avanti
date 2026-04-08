import { relations, sql } from "drizzle-orm";
import {
  integer,
  sqliteTable,
  text,
} from "drizzle-orm/sqlite-core";

import {
  account,
  accountRelations,
  session,
  sessionRelations,
  user,
  userRelations,
  verification,
} from "./auth";

/** Mirrors Prisma `Days` — SQLite stores enum-like values as text. */
export const dayValues = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
] as const;
export type Day = (typeof dayValues)[number];

export const serviceValues = [
  "dinner",
  "lunch",
  "hh",
  "drinks",
  "dessert",
] as const;
export type Service = (typeof serviceValues)[number];

export const courseValues = [
  "appetizer",
  "entree",
  "drink",
  "dessert",
] as const;
export type Course = (typeof courseValues)[number];

export const deploymentStatusValues = [
  "OPEN",
  "PENDING",
  "CLOSED",
  "REVERTED",
] as const;
export type DeploymentStatus = (typeof deploymentStatusValues)[number];

export const contact = sqliteTable("Contact", {
  id: text("id").primaryKey(),
  address: text("address").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  facebook: text("facebook").notNull(),
  instagram: text("instagram").notNull(),
});

export const info = sqliteTable("Info", {
  id: text("id").primaryKey(),
  about: text("about").notNull(),
  contactId: text("contactId")
    .notNull()
    .references(() => contact.id),
});

export const hours = sqliteTable("Hours", {
  id: text("id").primaryKey(),
  day: text("day", { enum: dayValues }).notNull(),
  open: text("open").notNull().default(""),
  close: text("close").notNull().default(""),
  infoId: text("infoId").references(() => info.id),
});

export const alert = sqliteTable("Alert", {
  id: text("id").primaryKey(),
  start: integer("start", { mode: "timestamp" }).notNull(),
  end: integer("end", { mode: "timestamp" }).notNull(),
  title: text("title"),
  text: text("text").notNull(),
});

export const menu = sqliteTable("Menu", {
  id: text("id").primaryKey(),
  idx: integer("idx").notNull(),
  name: text("name").notNull(),
  description: text("description").default(""),
  service: text("service", { enum: serviceValues }).default("dinner"),
  course: text("course", { enum: courseValues }).notNull(),
  disabled: integer("disabled", { mode: "boolean" }).notNull().default(false),
});

/**
 * Display / admin list order: appetizers (incl. soups & salads) → mains → dessert → drinks.
 * Use with `asc(menuCourseDisplayOrder)`, then `asc(menu.idx)`.
 */
export const menuCourseDisplayOrder = sql`(CASE ${menu.course} WHEN 'appetizer' THEN 0 WHEN 'entree' THEN 1 WHEN 'dessert' THEN 2 WHEN 'drink' THEN 3 ELSE 99 END)`;

/**
 * Same ordering as {@link menuCourseDisplayOrder}, for raw SQL (`FROM "Menu"` column `course`).
 * Keep in sync when changing course order.
 */
export const MENU_COURSE_ORDER_CASE_SQL = `
CASE course
  WHEN 'appetizer' THEN 0
  WHEN 'entree' THEN 1
  WHEN 'dessert' THEN 2
  WHEN 'drink' THEN 3
  ELSE 99
END`;

export const price = sqliteTable("Price", {
  id: text("id").primaryKey(),
  dinner: text("dinner").notNull().default(""),
  lunch: text("lunch").notNull().default(""),
  hh: text("hh").notNull().default(""),
  drinks: text("drinks").notNull().default(""),
  dessert: text("dessert").notNull().default(""),
  menuId: text("menuId")
    .notNull()
    .unique()
    .references(() => menu.id, { onDelete: "cascade" }),
});

export const deployment = sqliteTable("Deployment", {
  id: text("id").primaryKey(),
  pendingChanges: integer("pendingChanges").notNull(),
  createdAt: integer("createdAt", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
  updatedAt: integer("updatedAt", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
  deployedAt: integer("deployedAt", { mode: "timestamp" }).notNull(),
  userId: text("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  status: text("status", { enum: deploymentStatusValues }).notNull(),
});

export const changeSet = sqliteTable("ChangeSet", {
  id: text("id").primaryKey(),
  changes: text("changes", { mode: "json" }).notNull().$type<Record<string, unknown>>(),
  madeAt: integer("madeAt", { mode: "timestamp" }).notNull(),
  deploymentId: text("deploymentId")
    .notNull()
    .references(() => deployment.id),
  userId: text("userId")
    .notNull()
    .references(() => user.id),
});

export const contactRelations = relations(contact, ({ many }) => ({
  infos: many(info),
}));

export const infoRelations = relations(info, ({ one, many }) => ({
  contact: one(contact, {
    fields: [info.contactId],
    references: [contact.id],
  }),
  hours: many(hours),
}));

export const hoursRelations = relations(hours, ({ one }) => ({
  info: one(info, {
    fields: [hours.infoId],
    references: [info.id],
  }),
}));

export const menuRelations = relations(menu, ({ one }) => ({
  price: one(price, {
    fields: [menu.id],
    references: [price.menuId],
  }),
}));

export const priceRelations = relations(price, ({ one }) => ({
  menu: one(menu, {
    fields: [price.menuId],
    references: [menu.id],
  }),
}));

export const changeSetRelations = relations(changeSet, ({ one }) => ({
  deployment: one(deployment, {
    fields: [changeSet.deploymentId],
    references: [deployment.id],
  }),
  user: one(user, {
    fields: [changeSet.userId],
    references: [user.id],
  }),
}));

export const deploymentRelations = relations(deployment, ({ many, one }) => ({
  changeSets: many(changeSet),
  user: one(user, {
    fields: [deployment.userId],
    references: [user.id],
  }),
}));

export const sqliteSchema = {
  user,
  session,
  account,
  verification,
  contact,
  info,
  hours,
  alert,
  menu,
  price,
  deployment,
  changeSet,
  userRelations,
  sessionRelations,
  accountRelations,
  contactRelations,
  infoRelations,
  hoursRelations,
  menuRelations,
  priceRelations,
  deploymentRelations,
  changeSetRelations,
};

export {
  account,
  session,
  user,
  verification,
} from "./auth";
