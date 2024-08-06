import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import RecipeCard from "./RecipeCard";
import "../stylesheets/recipe.css";

const mealdb_api = `https://www.themealdb.com/api/json/v1/1/`;


async function getRandomRecipe() {
    let response = await fetch(`${mealdb_api}random.php`);
    return response.json();
}

const RecipeModal = (props)=> {
    const [show, setShow] = useState(props.show);
    const [randomRecipe, setRandomRecipe] = useState({});
    const [ingredient, setIngredient] = useState("");
    const [allRecipes, setAllRecipes] = useState();

    const getRandom = () => {
        setRandomRecipe(getRandomRecipe());
    };

    // Triggers upon pressing the "Enter" key -
    // asynch fetch call to the MealDB api to get all recipes that contain
    // the inputted main ingredient in JSON and store it in a useState variable
    const getAllRecipes = (event) => {
        if (event.key == "Enter") {
            fetch(
                `https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredient}`
            )
            .then((res) => res.json())
            .then((data) => {
                setAllRecipes(data.meals);
                setIngredient("");
            });
        }
    };

    const handleClose = (close) => {
        setShow(close);
        props.callback();
    }

    return (
        <>
            <Modal
                size="lg"
                show={show}
                onHide={() => handleClose(false)}
                aria-labelledby="examplemodal-sizes-title-lg"
            >
                <Modal.Header closeButton>
                    <Modal.Title id="example-modal-sizes-title-lg">
                        Find Recipes
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="recipe__form">
                    <div className="search">
                        <label className="label">Main Ingredient:</label>
                        <input
                            id="ingredient"
                            className="search__bar"
                            type="search"
                            onChange={(e) => setIngredient(e.target.value)}
                            value={ingredient}
                            onKeyDown={getAllRecipes}
                            placeholder="use _ for multi-word ingredient (ex: chicken_breast)"
                        />
                    </div>
                    <div className="results__container">
                        {allRecipes == null ? (
                            <h4 className="no__results">No results yet</h4>
                        ) : (
                            allRecipes.map((recipe) => {
                                return (
                                    <RecipeCard
                                        key={recipe.idMeal}
                                        recipe={recipe}
                                    />
                                );
                            })
                        )}
                    </div>
                </Modal.Body>
            </Modal>
        </>
    );
}

export default RecipeModal;