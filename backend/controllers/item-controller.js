import * as Item from "../models/item-model.js";
//@desc Get all items
//@roure Get/api/items
//@acess Public
export const getItems = async (req, res) => {
    const items = await Item.getAllItems();
    res.json(items);
};
