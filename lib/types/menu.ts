export type Service = "dinner" | "lunch" | "hh" | "drinks" | "dessert";

export type Services = Service[];

export type Price = { [k in Service]?: number };

export type Item = {
  name: string;
  description: string;
  service: Services;
  price: Price;
  disabled?: boolean;
};

export type Items = Item[];

export type Menu = {
  services: Services;
  items: Item[];
};

export type MenuBuckets<T = Item> = { [k in Service]: T[] };
