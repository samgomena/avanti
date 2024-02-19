import { render, fireEvent } from "@testing-library/react";
import FilterToggle from "../../Menu/FilterToggle";

test("filter items when FilterToggle is clicked", () => {
  const setFilter = jest.fn();
  const { getByTestId } = render(
    <FilterToggle
      filterKey="appetizer"
      filter={{ appetizer: false }}
      setFilter={setFilter}
      data-testid="filter-appetizers"
    >
      Appetizers
    </FilterToggle>
  );

  const toggleButton = getByTestId("filter-appetizers");
  fireEvent.click(toggleButton);

  expect(setFilter).toHaveBeenCalled();
});

test("filter items when multiple FilterToggle components are clicked", () => {
  const setFilter = jest.fn();
  const filter = { appetizer: false, entree: false };
  const { getByTestId } = render(
    <>
      <FilterToggle
        filterKey="appetizer"
        filter={filter}
        setFilter={setFilter}
        data-testid="filter-appetizers"
      >
        Appetizers
      </FilterToggle>
      <FilterToggle
        filterKey="entree"
        filter={filter}
        setFilter={setFilter}
        data-testid="filter-entrees"
      >
        Entrees
      </FilterToggle>
    </>
  );

  const toggleButtonAppetizers = getByTestId("filter-appetizers");
  const toggleButtonEntrees = getByTestId("filter-entrees");

  fireEvent.click(toggleButtonAppetizers);
  fireEvent.click(toggleButtonEntrees);
  expect(setFilter).toHaveBeenCalledTimes(2);

  fireEvent.click(toggleButtonAppetizers);
  expect(setFilter).toHaveBeenCalledTimes(3);

  fireEvent.click(toggleButtonEntrees);
  expect(setFilter).toHaveBeenCalledTimes(4);
});
