import React, { useState, useEffect }  from "react";

import Modal from 'react-bootstrap/Modal';

import "../stylesheets/styles.css"
import NutriFacts from "./NutriFacts";

 async function deleteItem(itemId) {
    if(itemId) {
        let response = await fetch(`/api/v1/inventory/delete?item=${itemId}`, {
            method: "DELETE",
            body: { itemID: itemId }
        });
    } else {
        console.log("Unsuccessful");
    }
    
 }

 async function editInvt(item) {
  let amount = document.getElementById("editAmount").value;
  
  let response = await fetch("/api/v1/inventory/update", {
    method: "POST",
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      itemId: item.id,
      amount: amount
    })
  })
}

async function getWarnings(itemId) {
  let response = await fetch(`/api/v1/warning?itemId=${itemId}`);
    if (response) {
      let data = await response.json();
      if (data.warning) {
        return "*about to expire";
      }
    }
  return "";
}

const ListItem = ({item}) => {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [nutri, setNutri] = useState(false);
  const handleNClose = () => setNutri(false);
  const handleNShow = () => setNutri(true);

  async function handleUpdate() {
    setShow(false);
    editInvt(item);    
    window.location.reload(false);  
  } 
  
  async function handleDelete() {
    setShow(false);
    deleteItem(item.id)
    window.location.reload(false);  
  } 

  const [warning, setWarning] = useState("");
  useEffect(() => {
    getWarnings(item.id).then((warning) => setWarning(warning));
  }, [item.id]);

  console.log(warning)

    return (
      <li className="list-group-item d-flex justify-content-between align-items-center">
        <div className="d-flex">
          <div className="me-3 d-flex">
            <img src={encodeURI(item.url)} alt={'Picture of ' + item.name} className='thumbnail'></img>
          </div>
          <div>
            <div className="w-100 mb-2">
              <h3 className="m-0">{item.name.split(" ").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")}</h3> <h3 id="warning-test">{warning}</h3>
            </div>
            <div>{item.quantity} units</div>
          </div>
        </div>

        <div className="flex-fill">
          <div className="d-flex justify-content-end me-3">
          <button className="btn secondary-button"  data-bs-toggle="modal" data-bs-target="#nutriModal" onClick={ handleNShow }> Show nutrition info</button>     
          </div>    
        </div>

        

        <Modal show={nutri} onHide={handleNClose}>
            <Modal.Header closeButton>
              <Modal.Title><h1>Nutrition - {item.name}</h1></Modal.Title>
            </Modal.Header>
            <Modal.Body className="d-flex justify-content-center">
              <div className="d-flex">
                <NutriFacts nf={item.info} />
              </div>
            </Modal.Body>
          </Modal> 
        

        <div className="p-1 align-items-center">
        <button className="btn p-1"  data-bs-toggle="modal" data-bs-target="#editModal" onClick={ handleShow }>
          <span className="material-symbols-outlined">
            edit
          </span>
        </button>

        <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title><h1>Edit - {item.name}</h1></Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <input type="text" className="form-control" placeholder="Amount" aria-label="Amount" id="editAmount" />
        </Modal.Body>
        <Modal.Footer className="d-flex justify-content-between">
        <button type="button" className="btn btn-outline-secondary" data-bs-dismiss="modal" onClick={handleDelete }>Delete Item</button>
        
        <button type="button" className="btn secondary-button" onClick={ handleUpdate }>Save Changes</button>
        </Modal.Footer>
      </Modal>
      </div>
    </li>
    )
};

export default ListItem;