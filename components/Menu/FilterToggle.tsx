import { CSSProperties, SetStateAction, useId } from "react";
import ToggleButton from "react-bootstrap/ToggleButton";

type FilterToggleProps<T> = {
  filter: T;
  setFilter: React.Dispatch<SetStateAction<T>>;
  filterKey: string;
  children: React.ReactNode | ((checked: boolean) => React.ReactNode);
};

export default function FilterToggle<T extends Record<string, boolean>>({
  filter,
  setFilter,
  filterKey,
  children,
  ...rest
}: FilterToggleProps<T>) {
  const id = useId();
  return (
    <ToggleButton
      style={
        {
          "--bs-btn-padding-y": "0.24rem",
          "--bs-btn-padding-x": "0.75rem",
          "--bs-btn-font-size": "0.875rem",
          "--bs-btn-border-radius": "1rem",
        } as CSSProperties
      }
      id={id}
      className="me-1"
      value={filterKey}
      variant="outline-secondary"
      size="sm"
      checked={filter[filterKey]}
      type="checkbox"
      onClick={(_e) =>
        setFilter((prev) => ({ ...prev, [filterKey]: !filter[filterKey] }))
      }
      {...rest}
    >
      {typeof children === "function" ? children(filter[filterKey]) : children}
    </ToggleButton>
  );
}
