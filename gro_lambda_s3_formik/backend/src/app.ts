import express from "express";
import cors from "cors";
import { debug, fetchUploadUrl, fetchViewUrl } from './util';

const app = express();

app.use("/document", cors());

app.use(function (req, res, next) {
  debug(`INFO: RECEIVED REQUEST FOR ${req.url}`);
  next();
});


app.get("/", function (req, res) {
  res.json("Hello World");
});

app.get("/mirror", function (req, res) {
  res.json(req.query);
});

app.get("/hello", function (req, res) {
  res.json(req.query);
});

app.get("/document", (req, res) => {
  const file = req.query.file
  fetchViewUrl(file)
    .then(data => {
      debug(`GET.DOCUMENT: generated SIGNED-URL: ${data}`);
      res.json({ url: data })
    }).catch(error => {
      res.status(501).json({
        message: error.message,
        description: "Error occured while processing the request"
      });
    });
});

app.post("/document", (req, res) => {
  const file = req.query.file
  const folder = req.query.folder
  fetchUploadUrl(file, folder)
    .then(data => {
      debug(`POST.DOCUMENT: generated SIGNED-URL: ${data}`);
      res.json({ url: data })
    }).catch(error => {
      res.status(501).json({
        message: error.message,
        description: "Error occured while processing the request"
      });
    });
});

app.use(function (req, res) {
  res.type("text/plain");
  res.status(404);
  res.send("404 - Not Found");
});

app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.type("text/plain");
  res.status(500);
  res.send("500 - Server Error");
});

export default app;
