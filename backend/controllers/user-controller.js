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

    if (await UserModel.findByEmail(email)){
        res.status(400);
        throw new Error("Email já cadastrado!");
    }

    //hashpassword
    const hashedpassword = await bcrypt.hash(password, 10); // esse 10 são rodadas de 'sal'
    const user = await UserModel.create({name,email,passwordHash:hashedpassword});

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

    let passwordHash;

    if (password) {
        passwordHash = await bcrypt.hash(password, 10);
    }

    const updateData = { id };

    if (name !== undefined) updateData.name = name;
    if (email !== undefined) updateData.email = email;
    if (passwordHash !== undefined) updateData.passwordHash = passwordHash;

    const updatedUser = await UserModel.update(updateData);

    if (!updatedUser) {
        res.status(404);
        throw new Error(`Usuário com ID ${id} não encontrado`);
    }

    res.status(200).json(updatedUser);
});

//@desc     Delete a user
//@route    DELETE /users/:id
//@acess    Public
export const deleteUser = asyncHandler(async (req,res) => {
    const {id} = req.params;

    const user = await UserModel.findById(id);

    if(user){
        const deletedUser = await UserModel.delete(id);
        if(deleteUser){
            res.status(200).json({
            message: "Usuário deletado com sucesso",
            user: deletedUser
        })}
    }else{
        res.status(404);
        throw new Error(`Usuário com ID ${id} não encontrado`);
    }
 

});



