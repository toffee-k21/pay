const express = require("express");
const {connectDb} = require("./db");
const rootRouter = require("./routes/index")
const accountRouter = require("./routes/account")
const userRouter = require("./routes/user")
const cors = require("cors");
const { authMiddleware } = require("./middleware");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/v1",rootRouter);
app.use("/api/v1/user",userRouter);
app.use("/api/v1/account", authMiddleware , accountRouter);

connectDb;


app.listen('5000',()=>{
    console.log("app running on port 5000")
})