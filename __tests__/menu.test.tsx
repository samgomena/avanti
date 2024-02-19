import { render, screen } from "@testing-library/react";
import Menu from "../pages/menu";
import { ParallaxProvider } from "react-scroll-parallax";
import { Bucket } from "@/lib/types/menu";

const apps = [
  {
    name: "Marinated Olives",
    description: "",
    price: {
      dinner: 8,
    },
  },
  {
    name: "Marcona Almonds",
    description: "",
    price: {
      dinner: 6,
    },
  },
  {
    name: "Bread Service",
    description: "",
    price: {
      dinner: 5,
    },
  },
  {
    name: "Cheese Plate",
    description:
      "A handful of rotating cheeses with seasonal fruit, Marcona almonds, and fig compote",
    price: {
      dinner: 22,
    },
  },
  {
    name: "Arancini",
    description: "Fried risotto cakes filled with smoked pork and goat cheese",
    price: {
      dinner: 16,
    },
  },
] as Bucket;

const entrees = [
  {
    name: "Butternut Squash Risotto",
    description:
      "Served with pancetta, goat cheese, spinach, cipollini onions, and hazelnuts",
    price: {
      dinner: 28,
    },
  },
  {
    name: "Braised Short Ribs",
    description:
      "Served in a hoisin burgundy sauce with pomme purée, carrots, parsnips, and cippolini onions",
    price: {
      dinner: 37,
    },
  },
  {
    name: "Pan Roasted Sturgeon",
    description:
      "Served over a bed of creamed wild rice with grilled broccolini and tomato hazelnut pesto",
    price: {
      dinner: 36,
    },
  },
  {
    name: "Panko and Herb-Crusted Mahi Mahi",
    description:
      "Served with crème fraîche, rice, sauce chasseur with bacon, mushroom, tomato, shallots, and grilled asparagus",
    price: {
      dinner: 35,
    },
  },
  {
    name: "Smoked Pork Chop",
    description:
      "Brined in apple cider vinegar, served with French onion bread pudding and green beans, finished with mushroom sauce",
    price: {
      dinner: 36,
    },
  },
] as Bucket;

const drinks = [
  {
    name: "Last Word",
    description: "Tanqueray, Luxardo, Green Chartreuse, lime",
    price: {
      drinks: 12,
    },
  },
  {
    name: "Hemingway Daiquiri",
    description: "Bacardi, Luxardo, grapefruit, lime",
    price: {
      drinks: 12,
    },
  },
  {
    name: "Grapefruit Drop",
    description: "Vodka, Campari, grapefruit, lemon",
    price: {
      drinks: 11,
    },
  },
  {
    name: "Pineapple Mule",
    description: "Vodka, pineapple, lime, ginger beer",
    price: {
      drinks: 10,
    },
  },
] as Bucket;

describe("Menu", () => {
  it("fucking renders", () => {
    render(
      <ParallaxProvider>
        <Menu apps={apps} entrees={entrees} drinks={drinks} />
      </ParallaxProvider>
    );

    const heading = screen.getByText("Our Menu");
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveClass("display-6", "fw-bold", "text-white");
  });

  it("Has all the tabs", () => {
    render(
      <ParallaxProvider>
        <Menu apps={apps} entrees={entrees} drinks={drinks} />
      </ParallaxProvider>
    );

    ["Dinner", "Drinks"].forEach((_tab) => {
      const tab = screen.getByText(_tab);
      expect(tab).toBeInTheDocument();
      expect(tab).toHaveClass("nav-link");
    });
  });

  // TODO: Update the ff thingy and ensure that it's actually working
  it("Does not have ff'd tabs", () => {
    render(
      <ParallaxProvider>
        <Menu apps={apps} entrees={entrees} drinks={drinks} />
      </ParallaxProvider>
    );

    ["Lunch", "Happy Hour", "Dessert"].forEach((_tab) => {
      expect(screen.queryByText(_tab)).toBeNull();
    });
  });

  it("Has dinner selected by default", () => {
    render(
      <ParallaxProvider>
        <Menu apps={apps} entrees={entrees} drinks={drinks} />
      </ParallaxProvider>
    );

    const tab = screen.getByText("Dinner");
    expect(tab).toBeInTheDocument();
    expect(tab).toHaveClass("active");
  });
});
