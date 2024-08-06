import express from "express";
const router = express.Router();


import authRouter from './controllers/auth.js';
import getItemsRouter from "./controllers/getItems.js";
import warningRouter from "./controllers/warning.js";
import inventoryRouter from "./controllers/inventory.js"

router.use('/inventory', inventoryRouter);
router.use('/auth', authRouter);
router.use("/getItems", getItemsRouter);
router.use("/warning", warningRouter);

export default router;
