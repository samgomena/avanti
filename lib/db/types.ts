import type { InferSelectModel } from "drizzle-orm";

import {
  alert,
  contact,
  hours,
  info,
  menu,
  price,
} from "./schema";

export type Alert = InferSelectModel<typeof alert>;
export type Contact = InferSelectModel<typeof contact>;
export type Info = InferSelectModel<typeof info>;
export type Hours = InferSelectModel<typeof hours>;
export type Menu = InferSelectModel<typeof menu>;
export type Price = InferSelectModel<typeof price>;
