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
