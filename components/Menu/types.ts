export type Service = "dinner" | "lunch" | "hh" | "drinks";

export type Services = Service[];

export type Item = {
  name: string;
  description: string;
  service: Services;
  price: number | { [k in Service]: number };
};

export type Items = Item[];

export type Menu = {
  services: Services;
  items: Items;
};
