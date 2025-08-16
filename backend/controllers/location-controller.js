import asyncHandler from "express-async-handler";
import LocationModel from "../models/location-model.js";

//@desc     Register a location
//@route    POST /locations/create
//@acess    Private
export const createLocation = asyncHandler(async (req, res) => {
    const { name } = req.body;
    const userId = req.user.id; // vem do token de autenticação

    if (!name) {
        res.status(400);
        throw new Error("O nome da localização é obrigatório");
    }

    const location = await LocationModel.create({ name, userId });
    res.status(201).json(location);
});

//@desc     Get location by id
//@route    GET /locations/:id
//@access   Public
export const getLocationById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const location = await LocationModel.findById(id);

    if (!location) {
        res.status(404);
        throw new Error("Localização não encontrada");
    }

    res.json(location);
});

//@desc     Get location by my
//@route    GET /locations/:id
//@access   Public
export const getMyLocations = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const locations = await LocationModel.findByUserId(userId);
    res.status(200).json(locations);
});

//@desc     Get all locations
//@route    GET /location
//@access   Public
export const getAllLocations = asyncHandler(async (req, res) => {
    const locations = await LocationModel.findAll();
    res.json(locations);
});

//@desc     Update a location
//@route    PUT /locations/:id
//@access   Public
export const updateLocation = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;

    const updated = await LocationModel.update({ id, name });

    if (!updated) {
        res.status(404);
        throw new Error("Localização não encontrada");
    }

    res.json(updated);
});

//@desc     Delete a location
//@route    DELETE /locations/:id
//@acess    Public
export const deleteLocation = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const deleted = await LocationModel.delete(id);

    if (!deleted) {
        res.status(404);
        throw new Error("Localização não encontrada");
    }

    res.json({ message: "Localização removida com sucesso" });
});
