import express from "express";
const router = express.Router();

router.get('/', async (req, res, next) => {
    if (req.session.userId) {
        try {
            const inventory = await req.models.Inventory.findOne({ itemId: req.query.itemId, userId: req.session.userId });
            if (!inventory) {
                res.status(404).json({ status: "error", error: "Inventory item not found" });
                return;
            }
            const purchaseDate = inventory.lastPurchasedDate;
            console.log(purchaseDate)
            const today = Date.now();
            const daysSincePurchase = Math.floor((today - purchaseDate) / (1000 * 60 * 60 * 24));
            const isAboutToExpire = daysSincePurchase >= 7 && inventory.amountTheyHave > 0;

            if (isAboutToExpire) {
                res.json({ warning: true });
            } else {
                res.json({ warning: false });
            }
    
        } catch (error) {
            console.log(error);
            res.status(500).json({ status: "error", error: error });
        }
    } else {
        res.type('text').status(401).send("You must be logged in to post");
    }
});

export default router;