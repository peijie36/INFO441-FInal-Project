import express from 'express';
// import {promises as fs} from 'fs';
// import models from '../../../../models.js';
// import bodyParser from 'body-parser';

const router = express.Router();

router.post("/add", async (req,res) => {
 
    if (req.body && req.body.name && req.body.amount) {
      let name = req.body.name.toLowerCase();
    try {
      let response = await existingItem(name, req.models.Item);

      if(response.status == 'success') {
        let newInvt = await existingInvt(
          {
            "amount": parseInt(req.body.amount),
            "info": response.result
          },
          req.session.userId,
          req.models.Inventory
        );
  
        res.json({"status": "success"});
      } else {
        console.log(response.result);
        res.status(401).json({
          "status": "error",
          "error": response.result
        })
      }    
    } catch (error) {
      console.error(error);
      res.status(500).json({
        "status": "error",
        "error": error.message
      })
    }
  } else {
    res.status(400).json({
      "status": "error",
      "error": "Missing necessary user input"
    })
  }
  
});

async function existingInvt(itemInfo, user, schema) {
  let existingInvt = await schema.findOne({
    "userId": user,
    "itemId": itemInfo.info["_id"]
  });


  if (!existingInvt) {
    existingInvt = new schema({
      "userId": user,
      "itemId": itemInfo.info["_id"],
      "amountTheyHave": itemInfo.amount,
      "totalAmountPurchased": itemInfo.amount,
      "frequencyPurchased": 1
    });
  } else {
    existingInvt.frequencyPurchased = getFrequencyPurchased(
      existingInvt.lastPurchasedDate,
      itemInfo.amount,
      existingInvt.frequencyPurchased,
      existingInvt.totalAmountPurchased
    );
    existingInvt.amountTheyHave += itemInfo.amount;
    existingInvt.totalAmountPurchased += itemInfo.amount;
  }

  await existingInvt.save();
}

async function existingItem(item, schema) {
  try {
    let existingItem = await schema.findOne({
      "name": item
    });
  
    if (!existingItem) { 
      const response = await fetch('https://trackapi.nutritionix.com/v2/search/instant?query=' + item, {
        method: 'get',
        headers: {
          "x-app-id": "4be0c3ba",
          "x-app-key": "946837a76fb5e6c81a160b1669c10c18",
        }
      });
  
      const data = await response.json();
      const bestMatch = data.common[0];
      console.log(bestMatch);
  
      try {
        if(bestMatch.food_name.toLowerCase() == item) {
          // nutri
         const API_URL = 'https://trackapi.nutritionix.com/v2/natural/nutrients';
         
         const body = {
           "query": item
         };
   
         let response = await fetch(API_URL, {
           method: 'POST',
           headers: {
             'Content-Type': 'application/json',
             'x-app-id': '4be0c3ba',
             'x-app-key': '946837a76fb5e6c81a160b1669c10c18'
           },
           body: JSON.stringify(body)
         })
   
         let data = await response.json();
         let nutri = data.foods[0];
             
         if(nutri){
            const filteredNutri = Object.fromEntries(
              Object.entries(nutri).filter(([key, value]) => key.startsWith('nf_'))
            );
      
            existingItem = await new schema({
              "name": item,
              "url": bestMatch.photo.thumb,
              "info": filteredNutri
            });
      
            console.log("EXISTING ITEM:");
            console.log(existingItem)
      
            await existingItem.save();
      
            return {status: 'success',
                    result: existingItem};
   
         } else {
            return {status: 'error',
                    result: 'No nutrition information found for this item'};
         } 
       } else {
        return {status: 'error',
                result: 'Item information not found in food database.'};
       }
      } catch (error) {
        return {status: 'error',
                result: 'Item information not found in food database.'};   
      }
      
    } else {
      return {status: 'success',
              result: existingItem};
    }
  } catch (error) {
    console.log(error)
  }
}

export function getFrequencyPurchased(lastPurchasedDate, amountPurchased, frequencyPurchased, timesPurchased) {
  let today = new Date();
  let daysBetweenPurchases = today - new Date(lastPurchasedDate);
  let differenceInDays = Math.floor(daysBetweenPurchases / (1000 * 60 * 60 * 24));

  let frequencyPurchasedPastPurchase = amountPurchased / (differenceInDays > 0 ? differenceInDays : 1);
  let trueTotalAmountPurchased = timesPurchased * frequencyPurchased;

  let totalFrequencyPurchased = (frequencyPurchasedPastPurchase + trueTotalAmountPurchased) / (timesPurchased);

  return totalFrequencyPurchased;
}

router.delete("/delete:item?", async (req, res, next) => {
  try {
      let itemID = req.query.item;
       console.log(itemID);
      if(itemID != undefined) {
          await req.models.Inventory.deleteOne({ itemId: itemID });
          res.json({ status: "success" });
      } else {
          res.status(404).json({ status: "error", error: "Item not found" });
      }
      
  } catch (error) {
      console.log(error);
      res.status(500).json({ status: "error", error: error });
  }
});

router.post("/update", async (req, res) => {
  if (!req.body["itemId"] || !req.body["amount"]) {
    res.type('text').status(400).send("Missing information");
  } else if (!req.session["userId"]) {
    res.type('text').status(401).send("You must be logged in update your inventory!");
  } else {
    try {
      let item = await req.models.Inventory.findOne({
        "itemId": req.body["itemId"],
        "userId": req.session["userId"],
      });

      if (item) {

        let newlyPurchasedAmount = req.body["amount"] - item.amountTheyHave;

        if (newlyPurchasedAmount > 0) {

          item.frequencyPurchased = getFrequencyPurchased(
            item.lastPurchasedDate,
            newlyPurchasedAmount,
            item.frequencyPurchased,
            item.totalAmountPurchased
          );

          item.totalAmountPurchased += 1;

          console.log(item.frequencyPurchased);
        }

        item.amountTheyHave = req.body["amount"];

        await item.save();

        res.type('text').send("Success!");
      } else {
        res.type("text").status(404).send("The item you tried to change doesn't exist!");
      }
    } catch (err) {
      console.error(err);
      res.type("text").status(500).send("Server error");
    }
  }
});


export default router;