import withAdminNav from "../../lib/withAdminNav";
import { useMenuBuckets } from "../../lib/hooks/useMenu";
import {
  Item,
  MenuBuckets,
  Price,
  Service,
  Services,
} from "../../lib/types/menu";
import { useEffect } from "react";
import useFlags from "../../lib/hooks/useFlags";
import { useRouter } from "next/router";

type MenuBucketStats = { [k in Service]: { total: number; avgPrice: number } };

const sumPrice = (price: Price) =>
  Object.values(price).reduce((acc, curr) => acc + curr, 0);

// This is used to simplify the average price calculation in the function below.
// I don't feel like typing the whole thing so ts-ignore it is :sigh:
// @ts-ignore
const sum = (acc, { price }, _, { length }) => acc + sumPrice(price) / length;

const getStats = (menuBuckets: MenuBuckets) =>
  (["lunch", "dinner", "hh", "drinks"] as Services).reduce(
    (acc, service) => ({
      ...acc,
      [service]: {
        total: menuBuckets[service].length,
        avgPrice: menuBuckets[service].reduce(sum, 0).toFixed(2),
      },
    }),
    {} as MenuBucketStats
  );

const Overview: React.FC = () => {
  const router = useRouter();
  const { adminPage } = useFlags();

  useEffect(() => {
    // Default to adding items for now
    router.push(adminPage ? "/admin/menu/add" : "/");
  }, [adminPage, router]);

  const menuBuckets = useMenuBuckets();
  const stats = getStats(menuBuckets as MenuBuckets<Item>);

  return (
    <div className="row justify-content-center">
      <div className="col">
        <h3>Overview</h3>
        <div>
          <p>Total lunch items: {stats.lunch.total}</p>
          <p>Average lunch item price: ${stats.lunch.avgPrice}</p>
        </div>
        <div>
          <p>Total dinner items: {stats.dinner.total}</p>
          <p>Average dinner item price: ${stats.dinner.avgPrice}</p>
        </div>
        <div>
          <p>Total happy hour items: {stats.hh.total}</p>
          <p>Average happy hour item price: ${stats.hh.avgPrice}</p>
        </div>
        <div>
          <p>Total drinks: {stats.drinks.total}</p>
          <p>Average drink price: ${stats.drinks.avgPrice}</p>
        </div>
      </div>
    </div>
  );
};

export default withAdminNav(Overview);
