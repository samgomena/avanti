import type { Hours } from "../types/info";
import { Service } from "../types/menu";

export const serviceToDisplay = (code: Service) => {
  switch (code) {
    case "dinner":
    case "lunch":
    case "drinks":
      return capitalize(code);
    case "hh":
      return "Happy Hour";
  }
};

export const capitalize = (str: string) =>
  str.slice(0, 1).toUpperCase() + str.slice(1);

export const inflect =
  (singular: string, plural = `${singular}s`) =>
  (quantity: number) =>
    Math.abs(quantity) === 1 ? singular : plural;

/**
 * Given a string in 24 hour time (i.e. 23:10) convert it to 12 hour time with an appropriate suffix.
 * E.g.
 *  23:10 => 11:10 PM
 *  9:06 => 9:06 AM
 *  12:00 => 12:00 PM
 * Notably, it doesn't do any input validation nor does it take seconds into consideration:
 *  12:## => 12:## PM
 *  12:00:00 => 12:00 PM
 * @param input 24 hour time in the format hh:mm
 * @returns The 12 hour clock representation of the input with an appropriate suffix
 */
export const to12 = (input: string) => {
  // I think this always returns an array with at least one element (""), but default to empty string JIC
  let [hours, minutes] = input.split(":");
  if (hours === "") {
    return "";
  }
  let hoursInt = parseInt(hours, 10);
  const suffix = hoursInt >= 12 && hoursInt < 24 ? "PM" : "AM";
  // TODO: This doesn't handle the case for stuff that happens after midnight, which may be desirable
  // I.e. 25:00 => 1:00 AM
  hoursInt = hoursInt > 12 ? hoursInt - 12 : hoursInt;
  hoursInt = hours === "00" ? 12 : hoursInt;

  return `${hoursInt}:${minutes} ${suffix}`;
};

export const formatPhone = (phone: string) => {
  if (phone === "") {
    return "";
  }

  const area = phone.slice(0, 3);
  const middle = phone.slice(3, 6);
  const end = phone.slice(6);
  return `(${area})-${middle}-${end}`;
};

export const compactHours = (hours: Hours) => {
  const result = [];

  for (let i = 0; i < hours.length; i++) {
    const { open, close } = hours[i];

    // At the end of the hours array, add the entry and break out of the loop
    if (i + 1 === hours.length) {
      result.push([hours[i]]);
      break;
    }

    const bucket = [];
    let nextOpen = hours[i + 1].open;
    let nextClose = hours[i + 1].close;
    // While the following days have the same open and close times, add them to the bucket
    while (open === nextOpen && close === nextClose) {
      bucket.push(hours[i]);
      i++;

      // Check if we're at the end *again* this happens if the hours are the same for at least the last two days of the week
      if (i + 1 === hours.length) {
        break;
      }

      nextOpen = hours[i + 1].open;
      nextClose = hours[i + 1].close;
    }
    // The next day has different open and close times, but we still need to add the current day to the bucket
    result.push([...bucket, hours[i]]);
  }
  return result;
};

export const isProd = () => process.env.NODE_ENV === "production";
