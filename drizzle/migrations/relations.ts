import { relations } from "drizzle-orm/relations";
import { user, session, account, contact, info, hours, menu, price, deployment, changeSet } from "./schema";

export const sessionRelations = relations(session, ({one}) => ({
	user: one(user, {
		fields: [session.userId],
		references: [user.id]
	}),
}));

export const userRelations = relations(user, ({many}) => ({
	sessions: many(session),
	accounts: many(account),
	deployments: many(deployment),
	changeSets: many(changeSet),
}));

export const accountRelations = relations(account, ({one}) => ({
	user: one(user, {
		fields: [account.userId],
		references: [user.id]
	}),
}));

export const infoRelations = relations(info, ({one, many}) => ({
	contact: one(contact, {
		fields: [info.contactId],
		references: [contact.id]
	}),
	hours: many(hours),
}));

export const contactRelations = relations(contact, ({many}) => ({
	infos: many(info),
}));

export const hoursRelations = relations(hours, ({one}) => ({
	info: one(info, {
		fields: [hours.infoId],
		references: [info.id]
	}),
}));

export const priceRelations = relations(price, ({one}) => ({
	menu: one(menu, {
		fields: [price.menuId],
		references: [menu.id]
	}),
}));

export const menuRelations = relations(menu, ({many}) => ({
	prices: many(price),
}));

export const deploymentRelations = relations(deployment, ({one, many}) => ({
	user: one(user, {
		fields: [deployment.userId],
		references: [user.id]
	}),
	changeSets: many(changeSet),
}));

export const changeSetRelations = relations(changeSet, ({one}) => ({
	user: one(user, {
		fields: [changeSet.userId],
		references: [user.id]
	}),
	deployment: one(deployment, {
		fields: [changeSet.deploymentId],
		references: [deployment.id]
	}),
}));