import React from "react";


import "../stylesheets/styles.css"

const NutriFacts = (props) => {
  const results = Object.entries(props.nf).map(([key, value]) => {
    let keyPrint = `${key}`.split("_").slice(1).map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
    let x = keyPrint.length;
    let y = `${value}`.length;
    let z = 40 - x - y;
    let hyphens = "-".repeat(z);
    return (
      <li class="list-group-item">{keyPrint + ' ' +  hyphens +' ' +value}</li>
    )
  });
  
  return (
    <ul className="p-0">
      <h3>Nutrition Facts</h3>
      {results}
    </ul>
  );
};

export default NutriFacts;