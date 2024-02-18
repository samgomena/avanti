import React, {
  PropsWithChildren,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

type MasonryProps = {
  columns?: number;
  columnBreakpoints?: { [key: number]: number };
  gutter?: number;
  responsive?: boolean;
};

const DEFAULT_COLUMN_COUNT = 3;
const DEFAULT_SCREEN_SIZE = 900;

const getWindowWidth = () => {
  return typeof window === "undefined"
    ? DEFAULT_SCREEN_SIZE
    : window.innerWidth;
};

const useWindowWidth = () => {
  const [width, setWidth] = useState(getWindowWidth());
  const hasWindow = typeof window !== "undefined";

  const handleResize = useCallback(() => {
    setWidth(getWindowWidth());
  }, []);

  useEffect(() => {
    if (hasWindow) {
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, [hasWindow, handleResize]);

  return width;
};

export default function Masonry({
  columns = 3,
  columnBreakpoints = { 350: 1, 750: 2, 900: 3 },
  gutter = 0,
  responsive = false,
  children,
}: PropsWithChildren<MasonryProps>) {
  const windowWidth = useWindowWidth();

  const responsiveColumnsCount = useMemo(() => {
    const breakpoints: number[] = Object.keys(columnBreakpoints)
      .sort((a, b) => parseInt(a) - parseInt(b))
      .map((breakpoint) => parseInt(breakpoint));

    let count = DEFAULT_COLUMN_COUNT;
    breakpoints.forEach((breakpoint) => {
      if (breakpoint < windowWidth) {
        count = columnBreakpoints[breakpoint];
      }
    });

    return count;
  }, [windowWidth, columnBreakpoints]);

  columns = responsive ? responsiveColumnsCount : columns;
  const columnBuckets: React.ReactNode[][] = Array.from(
    { length: columns },
    () => [] // Initializer
  );

  React.Children.forEach(children, (child, idx) => {
    if (React.isValidElement(child)) {
      columnBuckets[idx % columns].push(child);
    }
  });

  const renderColumn = useCallback(
    (column: React.ReactNode[]) =>
      column.map((item, idx) => (
        <div
          key={idx}
          style={{
            marginTop: idx > 0 ? `${gutter}px` : undefined,
          }}
        >
          {item}
        </div>
      )),
    [gutter]
  );

  const renderColumns = useCallback(
    (columns: React.ReactNode[][]) =>
      columns.map((column, idx) => (
        <div
          key={idx}
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            alignContent: "stretch",
            flex: 1,
            marginLeft: idx > 0 ? `${gutter}px` : undefined,
          }}
        >
          {renderColumn(column)}
        </div>
      )),
    [gutter, renderColumn]
  );

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignContent: "stretch",
        boxSizing: "border-box",
        width: "100%",
        maxWidth: "100%",
      }}
    >
      {renderColumns(columnBuckets)}
    </div>
  );
}
