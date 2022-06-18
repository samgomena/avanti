import menu from "../../data/menu.json";
import {
  Items,
  Item,
  Menu,
  MenuBuckets,
  Service,
  Services,
} from "../types/menu";
import React, { useMemo } from "react";

const useMenu = (): Menu => {
  return menu as Menu;
};

export const useMenuBuckets = <T extends Item | React.ReactNode>({
  as = null,
}: {
  as?: ((item: Item, service: Service, idx: number) => React.ReactNode) | null;
} = {}) => {
  // Use useMenu here to get types for free
  const menu = useMenu();
  // Create "buckets" for each service period to fill with items from that service period
  const _menu = useMemo(
    () =>
      menu.services.reduce(
        (acc, curr) => ({ [curr]: new Array(), ...acc }),
        {} as MenuBuckets<T>
      ),
    [menu.services]
  );

  useMemo(() => {
    menu.items.forEach((item, idx) => {
      (Object.keys(item.price) as Services).forEach((service) => {
        _menu[service].push(
          as !== null ? (as(item, service, idx) as T) : (item as T)
        );
      });
    });
  }, [as, _menu, menu.items]);

  return _menu;
};

export default useMenu;
