const express = require("express");
const app = express();
const cors = require("cors");
const corsOptions = {
    origin: "https://localhost:5173",
}

app.use(cors(corsOptions));

app.get("/Api/names",(req,res)=>{
    res.json({name: ["SAMMY", "BAKILI", "IAN"]});
});

app.listen(3000, ()=>{
    console.log("Server is running on port 3000");
});
