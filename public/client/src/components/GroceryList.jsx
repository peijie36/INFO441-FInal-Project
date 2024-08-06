import { useEffect, useState } from "react";
import { statusCheck } from "../../scripts/utils";

const GroceryList = () => {
  const [listItems, setListItems] = useState({});

  useEffect(() => {
    const getItemInfo = async () => {
      let groceryList = await getGroceryListItems();
      setListItems(groceryList);
    }

    getItemInfo();
  }, []);

  return (
    <div>
      <h1>Grocery Items:</h1>
      <div>
        {Object.keys(listItems).length > 0 ? <GroceryListView list={listItems} /> : <p>Loading...</p>}
      </div>
    </div>
  )
};

const GroceryListView = ({ list }) => {
  let soonToExpire = list["soon-to-expire"].map((item) => {
    console.log(item);
    return (
      <li key={item["id"]} className="list-group-item d-flex justify-content-between align-items-center">
        <div className="d-flex">
          <div className="me-3 d-flex">
            <img className={"thumbnail"} src={item["url"]} alt={item["name"]} />
          </div>
          <div className="w-100 mb-2">
            <h3 className="m-0">
              {item["name"]}
            </h3>
            <p>Last Purchased: {Math.round(((new Date()).getTime() - (new Date(item["lastPurchasedData"])).getTime()) / (1000 * 3600 * 24))} days ago</p>
          </div>
        </div>
      </li>
    )
  });

  let frequentlyPurchased = list["frequently-purchased"].map((item) => {
    return (
      <li key={item["id"]} className="list-group-item d-flex justify-content-between align-items-center">
        <div className="d-flex">
          <div className="me-3 d-flex">
            <img className={"thumbnail"} src={item["url"]} alt={item["name"]} />
          </div>
          <div className="w-100 mb-2">
            <h3 className="m-0">
              {item["name"]}
            </h3>
            <p>Last Purchased: {(new Date(item["lastPurchasedData"])).toLocaleDateString()}</p>
          </div>
        </div>
      </li>
    )
  });

  return (
    <>
      <div className="my-3">
        <h3>Expiring Soon</h3>
        <ul className="list-group">
          {soonToExpire}
        </ul>
      </div>
      <div className="my-3">
        <h3>Frequently Purchased:</h3>
        <ul className="list-group">
          {frequentlyPurchased}
        </ul>
      </div>
    </>
  )
}

async function getGroceryListItems() {
  try {
    let list = await fetch("/api/v1/getItems/list");

    await statusCheck(list);

    list = await list.json();

    console.log();
    return list;
  } catch (err) {
    console.error(err);
  }
}

export default GroceryList;