import * as Object from "../models/object-model.js"
//@desc Get all objects
//@roure Get/api/objects
//@acess Public
export const getObjects = 
    async (req, res) => {
        const objects = await Object.getAllObjects();
        res.json(objects);
    }

