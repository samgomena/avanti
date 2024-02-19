import { Hours } from "../../types/info";
import {
  serviceToDisplay,
  capitalize,
  inflect,
  to12,
  formatPhone,
  compactHours,
} from "../utils";

test("Service to display", () => {
  expect(serviceToDisplay("dinner")).toBe("Dinner");
  expect(serviceToDisplay("lunch")).toBe("Lunch");
  expect(serviceToDisplay("drinks")).toBe("Drinks");
  expect(serviceToDisplay("hh")).toBe("Happy Hour");
});

test("Captialize", () => {
  expect(capitalize("whatever")).toBe("Whatever");
  expect(capitalize("Whatever")).toBe("Whatever");
  expect(capitalize("")).toBe("");
});

test("Inflect", () => {
  const penguins = inflect("penguin");
  expect(penguins(1)).toBe("penguin");
  expect(penguins(-1)).toBe("penguin");
  expect(penguins(2)).toBe("penguins");
  expect(penguins(-2)).toBe("penguins");

  const people = inflect("person", "people");
  expect(people(1)).toBe("person");
  expect(people(2)).toBe("people");
});

test("To 12 hour format", () => {
  expect(to12("")).toBe("");
  expect(to12("00:00")).toBe("12:00 AM");
  expect(to12("24:00")).toBe("12:00 AM");
  expect(to12("23:10")).toBe("11:10 PM");
  expect(to12("9:06")).toBe("9:06 AM");
  expect(to12("12:00")).toBe("12:00 PM");
  expect(to12("12:00:00")).toBe("12:00 PM");
});

test("Format phone number", () => {
  expect(formatPhone("1234567890")).toBe("(123)-456-7890");
  expect(formatPhone("")).toBe("");
});

test("Compact hours", () => {
  // No hours defined; this should never be the case but we should handle it gracefully I guess
  expect(compactHours([])).toStrictEqual([]);

  expect(
    compactHours([{ day: "monday", open: "12:00", close: "13:00" }])
  ).toStrictEqual([[{ day: "monday", open: "12:00", close: "13:00" }]]);

  const allHoursSame: Hours = [
    { day: "monday", open: "12:00", close: "13:00" },
    { day: "tuesday", open: "12:00", close: "13:00" },
    { day: "wednesday", open: "12:00", close: "13:00" },
    { day: "thursday", open: "12:00", close: "13:00" },
    { day: "friday", open: "12:00", close: "13:00" },
    { day: "saturday", open: "12:00", close: "13:00" },
    { day: "sunday", open: "12:00", close: "13:00" },
  ];
  expect(compactHours(allHoursSame)).toStrictEqual([[...allHoursSame]]);

  const allHoursSameButClosed: Hours = [
    { day: "monday", open: "", close: "" },
    { day: "tuesday", open: "", close: "" },
    { day: "wednesday", open: "", close: "" },
    { day: "thursday", open: "", close: "" },
    { day: "friday", open: "", close: "" },
    { day: "saturday", open: "", close: "" },
    { day: "sunday", open: "", close: "" },
  ];
  expect(compactHours(allHoursSameButClosed)).toStrictEqual([
    [...allHoursSameButClosed],
  ]);

  const allHoursDifferent: Hours = [
    { day: "monday", open: "12:00", close: "13:00" },
    { day: "tuesday", open: "13:00", close: "14:00" },
    { day: "wednesday", open: "12:00", close: "13:00" },
    { day: "thursday", open: "13:00", close: "14:00" },
    { day: "friday", open: "12:00", close: "13:00" },
    { day: "saturday", open: "13:00", close: "14:00" },
    { day: "sunday", open: "12:00", close: "13:00" },
  ];
  expect(compactHours(allHoursDifferent)).toStrictEqual([
    [{ day: "monday", open: "12:00", close: "13:00" }],
    [{ day: "tuesday", open: "13:00", close: "14:00" }],
    [{ day: "wednesday", open: "12:00", close: "13:00" }],
    [{ day: "thursday", open: "13:00", close: "14:00" }],
    [{ day: "friday", open: "12:00", close: "13:00" }],
    [{ day: "saturday", open: "13:00", close: "14:00" }],
    [{ day: "sunday", open: "12:00", close: "13:00" }],
  ]);

  const someHoursSame: Hours = [
    { day: "monday", open: "12:00", close: "13:00" },
    { day: "tuesday", open: "12:00", close: "13:00" },
    { day: "wednesday", open: "12:00", close: "13:00" },
    { day: "thursday", open: "12:00", close: "13:00" },
    { day: "friday", open: "12:00", close: "14:00" },
    { day: "saturday", open: "12:00", close: "14:00" },
    { day: "sunday", open: "12:00", close: "14:00" },
  ];
  expect(compactHours(someHoursSame)).toStrictEqual([
    [
      { day: "monday", open: "12:00", close: "13:00" },
      { day: "tuesday", open: "12:00", close: "13:00" },
      { day: "wednesday", open: "12:00", close: "13:00" },
      { day: "thursday", open: "12:00", close: "13:00" },
    ],
    [
      { day: "friday", open: "12:00", close: "14:00" },
      { day: "saturday", open: "12:00", close: "14:00" },
      { day: "sunday", open: "12:00", close: "14:00" },
    ],
  ]);

  const someHoursDifferentWithClosed: Hours = [
    { day: "monday", open: "", close: "" },
    { day: "tuesday", open: "12:00", close: "13:00" },
    { day: "wednesday", open: "12:00", close: "13:00" },
    { day: "thursday", open: "12:00", close: "13:00" },
    { day: "friday", open: "12:00", close: "14:00" },
    { day: "saturday", open: "12:00", close: "14:00" },
    { day: "sunday", open: "", close: "" },
  ];
  expect(compactHours(someHoursDifferentWithClosed)).toStrictEqual([
    [{ day: "monday", open: "", close: "" }],
    [
      { day: "tuesday", open: "12:00", close: "13:00" },
      { day: "wednesday", open: "12:00", close: "13:00" },
      { day: "thursday", open: "12:00", close: "13:00" },
    ],
    [
      { day: "friday", open: "12:00", close: "14:00" },
      { day: "saturday", open: "12:00", close: "14:00" },
    ],
    [{ day: "sunday", open: "", close: "" }],
  ]);
});
