import React, { useState, useEffect } from "react";
import { statusCheck } from "../../scripts/utils";

import "../stylesheets/recipe.css";
import RecipeDetail from "./RecipeDetail";

const RecipeCard = (props) => {
    const recipe = props.recipe;
    const [recipeDetail, getRecipeDetail] = useState({});
    const [detail, showDetail] = useState(false);

    const handleClose = () => showDetail(false);

    useEffect(() => {
        const fetchRecipeDetail = async () => {
            try {
                let itemRes = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${recipe.idMeal}`);
                await statusCheck(itemRes);
                itemRes = await itemRes.json();
                getRecipeDetail(itemRes.meals[0]);
            } catch (err) {
                console.error(err);
            }
        };
        fetchRecipeDetail();
    }, []);
    
    return (
        <>
            <div className="recipe__card">
                <img
                    style={{ width: "190px" }}
                    src={recipe.strMealThumb}
                    alt={`image of ${recipe.strMeal}`}
                />
                <div className="info">
                    <h2>{recipe.strMeal}</h2>
                    <button
                        type="button"
                        className="btn btn-outline-secondary details__button"
                        onClick={() => (showDetail(true))}
                    >
                        Details
                    </button>
                    {detail ? <RecipeDetail recipe={recipeDetail} show={detail} callback={handleClose} /> : ""}
                </div>
            </div>
        </>
    );
};

export default RecipeCard;
