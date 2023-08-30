import routes from "./../routes/routes.js";
import express from "express";
import cors from "cors";

const app = express();

app.use(cors());

routes(app);

export default app;