import asyncHandler from "express-async-handler";
import ItemModel from "../models/item-model.js";
import LocationModel from "../models/location-model.js";

// @desc    Register a item
// @route   POST /api/items
// @access  Private
export const createItem = asyncHandler(async (req, res) => {
    let { name, location_id, image, description } = req.body;
    const user_id = req.user.id; // vem do validateToken

    if (!name || !location_id) {
      res.status(400);
      throw new Error("Nome e local são obrigatórios.");
    }

    // Se vier string (ex: "carteira"), criar novo local
    const isNumeric = /^\d+$/.test(location_id);

    if (!isNumeric) {
        const newLocation = await LocationModel.create({
        name: location_id,
        userId: user_id   // <- MUITO IMPORTANTE: seu model usa 'userId'
        });

        // Substituir pelo ID numérico criado
        location_id = newLocation.id;
    }

    // Garantir que o ID existe (caso seja numérico)
    const locationExists = await LocationModel.findById(location_id);

    if (!locationExists) {
        res.status(400);
        throw new Error("A localização informada não existe.");
    }

    // Criar item
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
    let { name, location_id, image, description } = req.body;

    const existingItem = await ItemModel.findById(id, user_id);

    if (!existingItem) {
        res.status(404);
        throw new Error("Item não encontrado");
    }

    if (existingItem.user_id !== user_id) {
        res.status(403);
        throw new Error("Você não tem permissão para atualizar este item");
    }

    // Validar localização somente se fornecida
    let newLocationId = existingItem.location_id;
    if (location_id !== undefined) {
        const isNumeric = /^\d+$/.test(location_id);
        
        if (!isNumeric) {
            const newLocation = await LocationModel.create({
                name: location_id,
                userId: user_id,
            });

            newLocationId = newLocation.id;
        } else {
            // Verifica se o ID realmente existe no banco
            const locationExists = await LocationModel.findById(location_id);
            if (!locationExists) {
                res.status(400);
                throw new Error(`Localização com ID ${location_id} não existe`);
            }

            newLocationId = location_id;
        }
    }

    const updateData = {
        id,
        name: name ?? existingItem.name,
        location_id: location_id ?? existingItem.location_id,
        image: image ?? existingItem.image,
        description: description ?? existingItem.description,
        user_id,
    };

    const updatedItem = await ItemModel.update(updateData);

    res.status(200).json(updatedItem);
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
