export type Contact = {
  address: string;
  phone: string;
  email: string;
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

export type Hours = ({ days: Days[] } & OpenClose)[];
export type HoursPreview = {
  day: Days;
  open: string | null;
  close: string | null;
}[];

export type Info = {
  about: string;
  contact: Contact;
  hours: Hours;
  hoursPreview: HoursPreview;
};
