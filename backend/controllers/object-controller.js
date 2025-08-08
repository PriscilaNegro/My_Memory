//@desc Get all objects
//@roure Get/api/objects
//@acess Public
export const getObjects = 
    async (req, res) => {
        const objects = await Object.find();
        res.json(objects);
    }

