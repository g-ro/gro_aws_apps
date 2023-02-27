import express from 'express';
import cors from "cors";

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors());

app.get('/', (req, res) => {
    res.json({ "message": "Hello from express-demo app" })
})

app.get("/mirror", function (req, res) {
    res.json(req.query);
});

app.get("/health", function (req, res) {
    res.json({ "message": "Healthy" });
});


app.use((req, res) => {
    res.type("text/plain");
    res.status(404);
    res.send("404 - Not Found");
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.type("text/plain");
    res.status(500);
    res.send("500 - Server Error");
});


app.listen(PORT, (err) => {
    if (err) {
        return console.error(err);
    }
    return console.log(`express-web server started..`);
});


