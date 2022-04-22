import menu from "../../data/menu.json";
import { Items, Item, Menu, MenuBuckets, Service } from "../types/menu";
import React, { useMemo } from "react";

const useMenu = (): Menu => {
  return menu as Menu;
};

export const useMenuBuckets = <T extends Item | React.ReactNode>({
  as = null,
}: {
  as?: ((item: Item, service: Service, idx: number) => React.ReactNode) | null;
} = {}) => {
  // Create "buckets" for each service period to fill with items from that service period
  const _menu = useMemo(
    () =>
      menu.services.reduce(
        (acc, curr) => ({ [curr]: new Array(), ...acc }),
        {} as MenuBuckets<T>
      ),
    []
  );

  useMemo(() => {
    let idx = 0;
    for (const item of menu.items as Items) {
      for (const service of item.service) {
        if (as !== null) {
          _menu[service].push(as(item, service, idx) as T);
        } else {
          _menu[service].push(item as T);
        }
      }
      idx++;
    }
  }, [as, _menu]);

  return _menu;
};

export default useMenu;
