import UserModel from "../models/user-model.js";
import asyncHandler from "express-async-handler";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const { sign } = jwt;

//@desc     Register a user
//@route    POST /users/create
//@acess    Public
export const createUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        res.status(400);
        throw new Error("Todos os campos são obrigatórios!");
    }

    const emailLower = email.toLowerCase();

    if (await UserModel.findByEmail(emailLower)) {
        res.status(400);
        throw new Error("Email já cadastrado!");
    }

    //hashpassword
    const hashedpassword = await bcrypt.hash(password, 10); // esse 10 são rodadas de 'sal'
    const user = await UserModel.create({
        name,
        email: emailLower,
        passwordHash: hashedpassword,
    });

    res.status(201).json(user);
});

//@desc     Login user and generate JWT token
//@route    POST /users/login
//@access   Public
export const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        res.status(400);
        throw new Error("Email e senha são obrigatórios");
    }

    const user = await UserModel.findByEmail(email.toLowerCase());

    if (!user) {
        res.status(401);
        throw new Error("Email ou senha inválidos");
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
        res.status(401);
        throw new Error("Email ou senha inválidos");
    }

    // Gerar token JWT
    const token = sign(
        {
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
            },
        },
        process.env.JWT_SECRET, // use variável de ambiente no futuro!
        { expiresIn: "1h" }
    );

    res.status(200).json({
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
        },
        token,
    });
});

//@desc     Update a user
//@route    PUT /users/:id
//@access   Public
export const updateUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { name, email, password, newPassword } = req.body;

    //Verifica se usuário logado é o mesmo que está sendo atualizado
    if (req.user.id !== parseInt(id)) {
        res.status(403);
        throw new Error("Você não tem permissão para atualizar este usuário");
    }

    //verifica se o usuario existe antes de tentar atualizar
    const existingUser = await UserModel.findById(id);
    if (!existingUser) {
        res.status(404);
        throw new Error(`Usuário com ID ${id} não encontrado`);
    }

    if (!password) {
        res.status(400);
        throw new Error("A senha é obrigatória para atualizar os dados");
    }

    const passwordMatch = await bcrypt.compare(password, existingUser.password);
    if (!passwordMatch) {
        res.status(401);
        throw new Error("Senha incorreta. Alterações não realizadas.");
    }

    if (email) {
        const emailLower = email.toLowerCase();
        const userWithEmail = await UserModel.findByEmail(emailLower);
        if (userWithEmail && userWithEmail.id != id) {
            res.status(400);
            throw new Error(
                "Este email já está sendo usado por outro usuário!"
            );
        }
    }

    const updateData = { id };

    if (name !== undefined) updateData.name = name;
    if (email !== undefined) updateData.email = email.toLowerCase();
    //if (password !== undefined) {
    //  updateData.passwordHash = await bcrypt.hash(password, 10);
    if (newPassword) {
        updateData.passwordHash = await bcrypt.hash(newPassword, 10);
    }

    //chama o model para atualizar
    const updatedUser = await UserModel.update(updateData);

    res.status(200).json(updatedUser);
});

//@desc     Delete a user
//@route    DELETE /users/:id
//@acess    Public
export const deleteUser = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const user = await UserModel.findById(id);

    if (!user) {
        res.status(404);
        throw new Error(`Usuário com ID ${id} não encontrado`);
    }

    const deletedUser = await UserModel.delete(id);

    res.status(200).json({
        message: "Usuário deletado com sucesso",
        user: deletedUser,
    });
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

//@desc     Get users (all, by name, or by email)
//@route    GET /users
//@access   Public
export const getUsers = asyncHandler(async (req, res) => {
    const { name, email } = req.query;

    if (name && email) {
        const users = await UserModel.findByNameAndEmail(name, email);
        if (!users || users.length === 0) {
            res.status(404);
            throw new Error(
                `Nenhum usuário encontrado com nome "${name}" e email "${email}"`
            );
        }
        return res.status(200).json(users);
    }

    if (name) {
        const users = await UserModel.findByName(name);
        if (!users || users.length === 0) {
            res.status(404);
            throw new Error(`Usuário com nome "${name}" não encontrado`);
        }
        return res.status(200).json(users);
    }

    if (email) {
        const user = await UserModel.findByEmail(email);
        if (!user) {
            res.status(404);
            throw new Error(`Usuário com email "${email}" não encontrado`);
        }
        return res.status(200).json(user);
    }

    // Se não veio nome nem email, retorna todos
    const allUsers = await UserModel.findAll();
    res.status(200).json(allUsers);
});

// @desc     Get current user data from JWT
// @route    GET /users/current
// @access   Private
export const getCurrentUser = asyncHandler(async (req, res) => {
    res.json(req.user);
});
