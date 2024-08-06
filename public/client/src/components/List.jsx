import React from "react";

import "../stylesheets/styles.css"
import ListItem from "./ListItem";

async function addInvt(){
    let name = document.getElementById("itemName").value;
    let amount = document.getElementById("itemAmount").value;
  
    let msg = {name: name, amount: amount};
    
    let response = await fetch("/api/v1/inventory/add", {
      method: "POST",
      body: JSON.stringify(msg),
      headers: {
          'Content-Type': 'application/json'
      }
    })
    
    if(response.status == 401) {
      alert('Item information not found in food database.');
    }
    
    window.location.reload(false);  
  }

const List = (props) => {
  const results = props.inventory.map((item) => {
    return (
      <ListItem key={item.id} item={item} />
    )
  })

  return(
    <div>
      <ul className="list-group">
        <li className="list-group-item align-items-center li-head">
          <div className="d-flex justify-content-center">
            <h2>My Inventory</h2>
          </div>
          <form onSubmit={(e) => e.preventDefault()} className="input-group p-2">
            <div id="addError"></div>
            <input required type="text" className="form-control" placeholder="Item Name" aria-label="Item Name" id="itemName" />
            <input required type="text" className="form-control" placeholder="Amount" aria-label="Amount" id="itemAmount" />
            <button className="btn btn-outline-secondary d-flex align-items-center" onClick={ addInvt }>
            Add Item
            </button>
          </form>

        </li>
        {
        results.length > 0 ? results :
          <div className="p-3 text-center">
            <p className="text-secondary">Looks like you don't have any items :-(  Try adding some!</p>
          </div>
        }
      </ul>
    </div>
  )
};


export default List;