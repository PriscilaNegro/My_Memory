import express from "express";
import "dotenv/config"
import objectsRoutes from "./routes/object-routes.js"
import { errorHandler } from "./middleware/error-handler.js";
import userRoutes from "./routes/user-routes.js";

const app = express();
const PORT= process.env.PORT || 3333;

app.use(express.json());

//rotas
app.use("/api/objects",objectsRoutes);
app.use("/api/users",userRoutes);

//middleware
app.use(errorHandler);

app.listen(PORT,()=>{
    console.log(`Sever running at port ${PORT}`);
});



