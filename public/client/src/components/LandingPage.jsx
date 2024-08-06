import React, { useEffect, useState } from "react";
import { statusCheck } from "../../scripts/utils";

import "../stylesheets/styles.css"
import GroceryList from "./GroceryList";
import HeaderBar from "./HeaderBar";
import List from "./List";
import RecipeModal from "./RecipeModal";

const LandingPage = () => {
    const [allItems, setAllItems] = useState([]);
    const [recipeForm, showRecipeForm] = useState(false);
    const [show, setShow] = useState(false);
    const [activeScreen, setActiveScreen] = useState("inventory");

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    useEffect(() => {
        const getAllItems = async () => {
            try {
                let itemRes = await fetch("/api/v1/getItems");
                await statusCheck(itemRes);
                itemRes = await itemRes.json();

                setAllItems(itemRes);
            } catch (err) {
                console.error(err);
            }
        }

        getAllItems();
    }, [])

    return (
        <div id="root" className="d-flex justify-content-center">
            <div className="body">
                <HeaderBar />
                <div className="py-3 d-flex justify-content-around">
                    <button className={`mx-2 btn ${activeScreen === "inventory" ? "main-button" : "inverse-button"}`} onClick={() => setActiveScreen("inventory")}>Inventory List</button>
                    <button className={`mx-2 btn ${activeScreen === "grocery" ? "main-button" : "inverse-button"}`} onClick={() => setActiveScreen("grocery")}>Grocery List</button>
                    <button className={`mx-2 btn ${activeScreen === "recipes" ? "main-button" : "inverse-button"}`} onClick={handleShow}>
                        Find Recipes
                    </button>
                </div>
                {show ? <RecipeModal show={show} callback={handleClose} /> : ""}
                {
                    activeScreen === "inventory" ? <List inventory={allItems} /> :
                    activeScreen === "grocery" ? <GroceryList /> :
                    <div><h2>Not Found</h2></div>
                }
            </div>
        </div>
    );
};

export default LandingPage;