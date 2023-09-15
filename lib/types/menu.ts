export type Service = "dinner" | "lunch" | "hh" | "drinks" | "dessert";
export type Course = "appetizer" | "entree" | "drink" | "dessert";

export type Services = Service[];

export type Price = { [k in Service]: number | null };

export type Item = {
  idx?: number;
  name: string;
  description: string;
  course: Course;
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
