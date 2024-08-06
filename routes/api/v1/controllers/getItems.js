import express from "express";
const router = express.Router();

router.get('/', async (req, res, next) => {
    try {
        let userItems = await req.models.Inventory.find({
            "userId": req.session.userId
        });
        let allItems = await Promise.all(userItems.map(async (item) => {
            let itemInfo = await req.models.Item.findById(item["itemId"]);

            return {
                "id": itemInfo["_id"],
                "quantity": item["amountTheyHave"],
                "name": itemInfo["name"],
                "info": itemInfo["info"],
                "url": itemInfo["url"]
            }
        }));

        res.json(allItems);
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: "error", error: error });
    }
});

router.get("/list", async (req, res) => {
    if (req.session.userId) {
        try {
            let soonToExpire = await req.models.Inventory.find({
                userId: req.session.userId
            })
                .sort({ lastPurchasedDate: -1 })
                .limit(10);
    
            let frequentlyPurchased = await req.models.Inventory.find({
                userId: req.session.userId
            })
                .sort({ frequencyPurchased: -1 })
                .limit(10);
    
    
            soonToExpire = await refToProducts(soonToExpire, req.models);
            frequentlyPurchased = await refToProducts(frequentlyPurchased, req.models);
    
            res.json({
                "soon-to-expire": soonToExpire,
                "frequently-purchased": frequentlyPurchased
            });
        } catch (err) {
            res.type('text').status(500).send("Server error");
        }
    } else {
        res.type('text').status(401).send("You must be logged in!")
    }
});

async function refToProducts(refs, databases) {
    return Promise.all(refs.map(async (ref) => {
        try {
            let itemInfo = await databases.Item.findById(ref["itemId"]);
            return {
                ...itemInfo["_doc"],
                "lastPurchasedData": ref["lastPurchasedDate"]
            }
        } catch (err) {
            throw new Error(err);
        }
    }));
}

export default router;