import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import UserModel from "../models/user-model.js";

export const validateToken = asyncHandler(async (req, res, next) => {
    let token;
    let authHeader = req.headers.authorization || req.headers.Authorization;
    if (authHeader && authHeader.startsWith("Bearer")) {
        token = authHeader.split(" ")[1];
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                console.log("Erro JWT: ", err.message);
                res.status(401);
                throw new Error(
                    "Token inválido ou expirado. Faça login novamente!"
                );
            }
            req.user = decoded.user;
            next(); //important!
        });
    }

    if (!token) {
        res.status(401);
        throw new Error(
            "O usuário não está autorizado ou o token está faltando. Faça login para continuar!"
        );
    }
});
