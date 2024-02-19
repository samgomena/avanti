export type Contact = {
  address: string;
  phone: string;
  email: string;
  facebook?: string;
  instagram?: string;
};

type OpenClose = {
  open: `${number}:${number}` | "";
  close: `${number}:${number}` | "";
  start?: `${number}:${number}` | "";
};

export type Days =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";

// TODO: Consider refactoring hours into a more compact format
// export type Hours = ({ days: Days[] } & OpenClose)[];
export type Hours = {
  day: Days;
  open: string;
  close: string;
}[];

export type Info = {
  about: string;
  contact: Contact;
  hours: Hours;
};
