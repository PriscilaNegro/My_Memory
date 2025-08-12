import UserModel from "../models/user-model.js";
import asyncHandler from "express-async-handler";
import bcrypt from "bcrypt";

//@desc     Register a user
//@route    POST /users/create
//@acess    Public
export const createUser =asyncHandler(async (req, res) => {
    const { name, email, password} = req.body;
    if (!name || !email || !password){
        res.status(400);
        throw new Error("Todos os campos são obrigatórios!");
    }

    const emailLower = email.toLowerCase();

    if (await UserModel.findByEmail(email)){
        res.status(400);
        throw new Error("Email já cadastrado!");
    }

    //hashpassword
    const hashedpassword = await bcrypt.hash(password, 10); // esse 10 são rodadas de 'sal'
    const user = await UserModel.create({
        name,
        email,
        passwordHash:hashedpassword});

    if(user){
        res.status(201).json(user)
    }
    else{
        res.status(400);
        throw new Error("Dados de usuario invalidos");
    }
});

//@desc     Update a user
//@route    PUT /users/:id
//@access   Public
export const updateUser = asyncHandler(async (req, res) => {
    const {id} = req.params;
    const {name, email, password} = req.body;

    //verifica se o usuario existe antes de tentar atualizar
    const existingUser = await UserModel.findById(id);
    if (!existingUser) {
        res.status(404);
        throw new Error(`Usuário com ID ${id} não encontrado`);
    }

    const updateData = { id };

    if (name !== undefined) updateData.name = name;
    if (email !== undefined) updateData.email = email.toLowerCase();
    if (password !== undefined) {
        updateData.passwordHash = await bcrypt.hash(password,10);}

    //chama o model para atualizar
    const updatedUser = await UserModel.update(updateData);

    res.status(200).json(updatedUser);
});

//@desc     Delete a user
//@route    DELETE /users/:id
//@acess    Public
export const deleteUser = asyncHandler(async (req,res) => {
    const {id} = req.params;

    const user = await UserModel.findById(id);

    if (!user) {
        res.status(404);
        throw new Error(`Usuário com ID ${id} não encontrado`);
    }

     const deletedUser = await UserModel.delete(id);

    res.status(200).json({
        message: "Usuário deletado com sucesso",
        user: deletedUser
    });

});

//@desc     Get all users
//@route    GET /users
//@access   Public
export const getUsers = asyncHandler(async (req, res) => {
    const users = await UserModel.findAll();
    res.status(200).json(users);
});

//@desc     Get user by id
//@route    GET /users/:id
//@access   Public
export const getUserById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const user = await UserModel.findById(id);
    if (!user) {
        res.status(404);
        throw new Error(`Usuário com ID ${id} não encontrado`);
    }
    res.status(200).json(user);
});

//@desc     Get user by name
//@route    GET /users/name/:name
//@access   Public
export const getUsersByName = asyncHandler(async (req, res) => {
    const { name } = req.params;
    const users = await UserModel.findByName(name);
    if (!users || users.length === 0) {
        res.status(404);
        throw new Error(`Usuário com nome "${name}" não encontrado`);
    }
    res.status(200).json(users);
});

//@desc     Get user by email
//@route    GET /users/email/:email
//@access   Public
export const getUserByEmail = asyncHandler(async (req, res) => {
    const { email } = req.params;
    const user = await UserModel.findByEmail(email);
    if (!user) {
        res.status(404);
        throw new Error(`Usuário com email "${email}" não encontrado`);
    }
    res.status(200).json(user);
});

