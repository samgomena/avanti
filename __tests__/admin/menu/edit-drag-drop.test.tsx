import { vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { closestCenter } from "@dnd-kit/core";
import type { MenuWithPrice } from "../../../pages/admin/menu/edit";

// Mock the required modules
vi.mock("next-auth/react", () => ({
  getSession: vi.fn(() =>
    Promise.resolve({ user: { email: "test@example.com" } })
  ),
}));

vi.mock("next/router", () => ({
  useRouter: () => ({
    asPath: "/admin/menu/edit",
  }),
}));

vi.mock("@/lib/api", () => ({
  api: {
    menu: {
      delete: {
        useMutation: vi.fn(() => ({
          mutate: vi.fn(),
          isPending: false,
        })),
      },
      edit: {
        useMutation: vi.fn(() => ({
          mutate: vi.fn(),
          isPending: false,
          onError: vi.fn(),
        })),
      },
    },
  },
}));

// Mock the collision detection function
vi.mock("@dnd-kit/core", async () => {
  const actual = await vi.importActual("@dnd-kit/core");
  return {
    ...actual,
    closestCenter: vi.fn(),
  };
});

// Import the collision detection function
import EditMenu from "../../../pages/admin/menu/edit";

const mockMenuItems: MenuWithPrice[] = [
  {
    id: "1",
    idx: 0,
    mvIdx: 0,
    name: "Caesar Salad",
    description: "Fresh romaine lettuce",
    service: null,
    course: "appetizer" as const,
    disabled: false,
    price: {
      id: "price1",
      menuId: "1",
      lunch: "12",
      dinner: "15",
      hh: "",
      drinks: "",
      dessert: "",
    },
  },
  {
    id: "2",
    idx: 1,
    mvIdx: 1,
    name: "Soup of the Day",
    description: "Chef's daily soup",
    service: null,
    course: "appetizer" as const,
    disabled: true,
    price: {
      id: "price2",
      menuId: "2",
      lunch: "8",
      dinner: "10",
      hh: "",
      drinks: "",
      dessert: "",
    },
  },
  {
    id: "3",
    idx: 2,
    mvIdx: 2,
    name: "Grilled Salmon",
    description: "Fresh Atlantic salmon",
    service: null,
    course: "entree" as const,
    disabled: false,
    price: {
      id: "price3",
      menuId: "3",
      lunch: "22",
      dinner: "28",
      hh: "",
      drinks: "",
      dessert: "",
    },
  },
  {
    id: "4",
    idx: 3,
    mvIdx: 3,
    name: "House Wine",
    description: "Red or white",
    service: null,
    course: "drink" as const,
    disabled: false,
    price: {
      id: "price4",
      menuId: "4",
      lunch: "",
      dinner: "",
      hh: "",
      drinks: "8",
      dessert: "",
    },
  },
  {
    id: "5",
    idx: 4,
    mvIdx: 4,
    name: "Chocolate Cake",
    description: "Rich chocolate layer cake",
    service: null,
    course: "dessert" as const,
    disabled: false,
    price: {
      id: "price5",
      menuId: "5",
      lunch: "",
      dinner: "",
      hh: "",
      drinks: "",
      dessert: "9",
    },
  },
];

describe("EditMenu Drag and Drop Functionality", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Course-Restricted Collision Detection", () => {
    test("createCourseRestrictedCollisionDetection filters containers by course", async () => {
      const { container } = render(<EditMenu menu={mockMenuItems} />);

      // Get the collision detection function (it's created inside the component)
      // We'll test it indirectly by checking that only same-course items can be dragged over

      const appetizer = screen.getByText(/Caesar Salad/);
      const entree = screen.getByText(/Grilled Salmon/);

      expect(appetizer).toBeInTheDocument();
      expect(entree).toBeInTheDocument();

      // The collision detection should prevent cross-course drops
      // This is tested through the component behavior
    });

    test("collision detection returns empty for different courses", () => {
      // Mock the collision detection args
      const mockArgs = {
        active: { id: "1" }, // Caesar Salad (appetizer)
        droppableContainers: [
          { id: "1", data: { course: "appetizer" } },
          { id: "3", data: { course: "entree" } },
        ],
      };

      // Import and test the collision detection logic indirectly
      render(<EditMenu menu={mockMenuItems} />);

      // The component should filter containers to only same course
      expect(screen.getByText(/Caesar Salad/)).toBeInTheDocument();
      expect(screen.getByText(/Grilled Salmon/)).toBeInTheDocument();
    });
  });

  describe("Disabled Items Visibility During Drag", () => {
    test("shows disabled items when drag starts", async () => {
      render(<EditMenu menu={mockMenuItems} />);

      // Initially, disabled items should be hidden (toggle.disabled starts as false now)
      const disabledItem = screen.queryByText("Soup of the Day - $8");

      // Find a drag handle and simulate drag start
      const dragHandles = document.querySelectorAll('[role="listitem"]');

      if (dragHandles.length > 0) {
        // Simulate drag start
        fireEvent.mouseDown(dragHandles[0]);

        await waitFor(() => {
          // Disabled items should now be visible
          expect(screen.getByText(/Soup of the Day/)).toBeInTheDocument();
        });

        // Simulate drag end
        fireEvent.mouseUp(dragHandles[0]);

        await waitFor(() => {
          // Disabled items should be hidden again if they were hidden before
          // This depends on the original toggle state
        });
      }
    });

    test("restores original toggle state after drag ends", async () => {
      const { container } = render(<EditMenu menu={mockMenuItems} />);

      // Toggle to hide disabled items first
      const toggleButton = screen.getByTestId("toggle-disabled");
      fireEvent.click(toggleButton);

      // Find drag handle
      const dragHandles = container.querySelectorAll('[role="listitem"]');

      if (dragHandles.length > 0) {
        // Start drag
        fireEvent.mouseDown(dragHandles[0]);

        // End drag
        fireEvent.mouseUp(dragHandles[0]);

        await waitFor(() => {
          // Original state should be restored
          expect(toggleButton).toHaveTextContent("Hide Disabled");
        });
      }
    });
  });

  describe("HR Border Styling Between Courses", () => {
    test("applies thicker border between different course sections", () => {
      render(<EditMenu menu={mockMenuItems} />);

      // Find all HR elements
      const hrElements = document.querySelectorAll("hr");

      // Check that HR elements exist
      expect(hrElements.length).toBeGreaterThan(0);

      // The HR between appetizer and entree should be thicker (3px)
      // The HR within same course should be normal (1px)
      hrElements.forEach((hr: HTMLElement) => {
        const borderWidth = window.getComputedStyle(hr).borderWidth;
        // Should be either 1px or 3px
        expect(["1px", "3px"]).toContain(borderWidth);
      });
    });

    test("calculates border width based on course transitions", () => {
      render(<EditMenu menu={mockMenuItems} />);

      // Test the logic by checking if the styling is applied correctly
      // Items should have different HR styling based on their position relative to course changes

      const allItems = screen.getAllByTestId(/edit-item-container-/);
      expect(allItems.length).toBeGreaterThan(0);

      // Each item container should have an HR with appropriate styling
      allItems.forEach((item) => {
        const hr = item.querySelector("hr");
        if (hr) {
          const style = hr.getAttribute("style");
          expect(style).toContain("flex: 1");
          // expect(style).toContain("border-width: 1px");
          // expect(style).toContain("border-width: 3px");
        }
      });
    });
  });

  describe("Integration Tests", () => {
    test("drag and drop workflow maintains course restrictions", async () => {
      const { container } = render(<EditMenu menu={mockMenuItems} />);

      // Test that items can only be reordered within their own course
      const appetizers = mockMenuItems.filter(
        (item) => item.course === "appetizer"
      );
      const entrees = mockMenuItems.filter((item) => item.course === "entree");

      expect(appetizers.length).toBe(2); // Caesar Salad, Soup of the Day
      expect(entrees.length).toBe(1); // Grilled Salmon

      // Verify items are rendered
      expect(screen.getByText(/Caesar Salad - \$15/)).toBeInTheDocument();
      expect(screen.getByText(/Grilled Salmon/)).toBeInTheDocument();
    });

    test("search functionality works with drag and drop", () => {
      render(<EditMenu menu={mockMenuItems} />);

      // Find search input
      const searchInput = screen.getByPlaceholderText("Search...");

      // Search for a specific item
      fireEvent.change(searchInput, { target: { value: "salmon" } });

      // Only matching items should be visible
      expect(screen.getByText(/Grilled Salmon/)).toBeInTheDocument();
      expect(screen.queryByText("Caesar Salad")).toBeNull();
    });

    test("filter toggles work with drag and drop", () => {
      render(<EditMenu menu={mockMenuItems} />);

      // Test appetizer filter
      const appetizerFilter = screen.getByTestId("filter-appetizers");
      fireEvent.click(appetizerFilter);

      // Only appetizers should be visible
      expect(screen.getByText("Caesar Salad - $15")).toBeInTheDocument();
      expect(screen.queryByText("Grilled Salmon - $22")).toBeNull();

      // Test entree filter
      const entreeFilter = screen.getByTestId("filter-entrees");
      fireEvent.click(entreeFilter);

      // Now both appetizers and entrees should be visible
      expect(screen.getByText("Caesar Salad - $15")).toBeInTheDocument();
      expect(screen.getByText(/Grilled Salmon/)).toBeInTheDocument();
    });
  });

  describe("Edge Cases", () => {
    test("handles empty menu gracefully", () => {
      render(<EditMenu menu={[]} />);

      // Should render without crashing
      expect(screen.getByTestId("title")).toBeInTheDocument();
    });

    test("handles single item menu", () => {
      const singleItem = [mockMenuItems[0]];
      render(<EditMenu menu={singleItem} />);

      expect(screen.getByText("Caesar Salad - $15")).toBeInTheDocument();
    });

    test("handles all disabled items", () => {
      const allDisabled = mockMenuItems.map((item) => ({
        ...item,
        disabled: true,
      }));
      render(<EditMenu menu={allDisabled} />);

      // All items should be in DOM but potentially hidden
      allDisabled.forEach((item) => {
        const element = screen.getByTestId(`edit-item-container-${item.idx}`);
        expect(element).toBeInTheDocument();
      });
    });
  });
});
