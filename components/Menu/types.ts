export type Service = "dinner" | "lunch" | "hh" | "drinks";

export type Services = Service[];

export type Price = { [k in Service]?: number };

export type Item = {
  name: string;
  description: string;
  service: Services;
  price: Price;
};

export type Items = Item[];

export type Menu = {
  services: Services;
  items: Item[];
};

export type MenuBuckets<T> = { [k in Service]: T[] };
