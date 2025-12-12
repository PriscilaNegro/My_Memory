import express from "express";
import "dotenv/config";
import itemsRoutes from "./routes/item-routes.js";
import { errorHandler, notFound } from "./middleware/error-handler.js";
import userRoutes from "./routes/user-routes.js";
import locationRoutes from "./routes/location-routes.js";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3333;

app.use(
    cors({
        origin: [
            "http://localhost:5173", //frontend port
            "https://mymemory2025.netlify.app",
        ],
    })
);

app.use(express.json());

// middleware para capturar JSON inválido
app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
        console.error("Middleware de erro ativado:", err.message);
        return res.status(400).json({
            title: "Invalid JSON",
            message: "O corpo da requisição contém JSON inválido!",
        });
    }
    next(err);
});

//rotas
app.use("/api/items", itemsRoutes);
app.use("/api/users", userRoutes);
app.use("/api/locations", locationRoutes);

//middleware
app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server running at port ${PORT}`);
});
