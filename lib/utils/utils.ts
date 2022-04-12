export const serviceToDisplay = (code: string) => {
  switch (code) {
    case "dinner":
      return "Dinner";
    case "lunch":
      return "Lunch";
    case "hh":
      return "Happy Hour";
    case "drinks":
      return "Drinks";
  }
};

export const capitalize = (str: string) =>
  str.slice(0, 1).toUpperCase() + str.slice(1);

export const inflect =
  (singular: string, plural: string = `${singular}s`) =>
  (quantity: number) =>
    Math.abs(quantity) === 1 ? singular : plural;

export const to12 = (input: string) => {
  // I think this always returns an array with at least one element (""), but default to empty string JIC
  let [hours, minutes] = input.split(":");
  if (hours === "") {
    return "";
  }
  let hoursInt = parseInt(hours, 10);
  const suffix = hoursInt >= 12 ? "PM" : "AM";
  // TODO: This doesn't handle the case for stuff that happens after midnight, which may be desirable
  // I.e. 25:00 => 1:00 AM
  hoursInt = hoursInt > 12 ? hoursInt - 12 : hoursInt;
  hoursInt = hours === "00" ? 12 : hoursInt;

  return `${hoursInt}:${minutes} ${suffix}`;
};

export const formatPhone = (number: string) => {
  const area = number.slice(0, 3);
  const middle = number.slice(3, 6);
  const end = number.slice(6);
  return `(${area})-${middle}-${end}`;
};
