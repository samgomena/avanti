export type Service = "dinner" | "lunch" | "hh" | "drinks";
export type Course = "appetizers" | "entrees" | "desserts" | "drinks";

export type Services = Service[];
export type Courses = Course[];

export type Price = { [k in Service]?: number };

export type Item = {
  name: string;
  description: string;
  course: string;
  service: Services;
  price: Price;
};

export type Items = Item[];

export type Menu = {
  services: Services;
  courses: Courses;
  items: Item[];
};

export type MenuBuckets<T = Item> = { [k in Service]: T[] };
