import asyncHandler from "express-async-handler";
import ItemModel from "../models/item-model.js";

// @desc    Register a item
// @route   POST /api/items
// @access  Private
export const createItem = asyncHandler(async (req, res) => {
    const { name, location_id, image, description } = req.body;
    const user_id = req.user.id; // vem do validateToken

    if (!name || !location_id) {
        res.status(400);
        throw new Error("Nome e local são obrigatórios");
    }

    const newItem = await ItemModel.create({
        name,
        location_id,
        image,
        description,
        user_id,
    });

    res.status(201).json(newItem);
});

// @desc    Get item by id
// @route   GET /api/items/:id
// @access  Private
export const getItemById = asyncHandler(async (req, res) => {
    const user_id = req.user.id;
    const { id } = req.params;

    const item = await ItemModel.findById(id, user_id);

    if (!item) {
        res.status(404);
        throw new Error("Item não encontrado");
    }

    res.json(item);
});

// @desc    Get all items by user
// @route   GET /api/items
// @access  Private
export const getItems = asyncHandler(async (req, res) => {
    const user_id = req.user.id;
    const items = await ItemModel.findAllByUser(user_id);
    res.json(items);
});

// @desc    Update item
// @route   PUT /api/items/:id
// @access  Private
export const updateItem = asyncHandler(async (req, res) => {
    const user_id = req.user.id;
    const { id } = req.params;
    const { name, location_id, image, description } = req.body;

    const updatedItem = await ItemModel.update({
        id,
        name,
        location_id,
        image,
        description,
        user_id,
    });

    if (!updatedItem) {
        res.status(404);
        throw new Error("Item não encontrado ou sem permissão");
    }

    res.json(updatedItem);
});

// @desc    Delete item
// @route   DELETE /api/items/:id
// @access  Private
export const deleteItem = asyncHandler(async (req, res) => {
    const user_id = req.user.id;
    const { id } = req.params;

    const deletedItem = await ItemModel.delete(id, user_id);

    if (!deletedItem) {
        res.status(404);
        throw new Error("Item não encontrado ou sem permissão");
    }

    res.json({ message: "Item deletado com sucesso" });
});
