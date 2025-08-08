import express from "express";
import dotenv from  "dotenv";
import objectsRoutes from "./routes/object-routes.js"

dotenv.config();

const app = express();
const PORT= process.env.PORT || 3333;

app.use(express.json());
app.use("/api/objects",objectsRoutes);


app.listen(PORT,()=>{
    console.log(`Sever running at port ${PORT}`);
});



