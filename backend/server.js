import express from "express";
import "dotenv/config";
import itemsRoutes from "./routes/item-routes.js";
import { errorHandler, notFound } from "./middleware/error-handler.js";
import userRoutes from "./routes/user-routes.js";
import locationRoutes from "./routes/location-routes.js";

const app = express();
const PORT = process.env.PORT || 3333;

app.use(express.json());

//rotas
app.use("/api/items", itemsRoutes);
app.use("/api/users", userRoutes);
app.use("/api/locations", locationRoutes);

//middleware
app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Sever running at port ${PORT}`);
});
