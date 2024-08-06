import React, { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import YoutubeEmbed from "./YoutubeEmbed";

const RecipeDetail = (props) => {
    const recipeDetail = props.recipe;
    const [show, setShow] = useState(props.show);
    const handleClose = (close) => {
        setShow(close);
        props.callback();
    }

    return (
        <Modal
            size="xl"
            show={show}
            onHide={() => handleClose(false)}
            aria-labelledby="examplemodal-sizes-title-lg"
            height="100%"
        >
            <Modal.Header closeButton>
                <Modal.Title id="example-modal-sizes-title-lg">
                    Recipe Detail
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className="recipe__form">
                <div className="detail__header">
                    <h1>{recipeDetail.strMeal}</h1>
                    <h2>({recipeDetail.strArea} - {recipeDetail.strTags})</h2>
                    <YoutubeEmbed url={recipeDetail.strYoutube} />
                </div>
                <div>
                    <p>{recipeDetail.strInstructions}</p>
                </div>
                <div className="results__container"></div>
            </Modal.Body>
        </Modal>
    );
};

export default RecipeDetail;
