const PORT = 3000;
const express = require("express");
const app = express();
app.use(express.json());
require("./databases/mongoCnnect");

const userRout = require("./routes/userRout");
app.use("/user", userRout)

app.listen(PORT, () => {
    console.log("on port " + PORT);
});