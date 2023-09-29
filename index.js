import app from "./src/config/express.js";

app.listen(process.env.PORT || 3030, () => console.log("Application online on port " + process.env.PORT));