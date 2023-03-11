import express from 'express';
import { engine } from 'express-handlebars';
import cors from "cors";
import { join } from 'path';
import routes from './routes';

// import bodyParser from 'body-parser';
// const bodyParser = require('body-parser');

const app = express()
const PORT = process.env.PORT || 5050

const environment = process.env.ENVIRONMENT ? process.env.ENVIRONMENT.trim() : "PROD";

console.log(`server starting for environment: ${environment}`);

const publicDir = environment === "DEV" ?
    join(__dirname, '/..', '/public') : join(__dirname, '/public');
const viewsDir = join(__dirname, 'views');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', viewsDir);

app.use(express.static(publicDir));

routes(app);

app.use((req, res) => {
    res.status(404);
    res.render('404');
});

app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.status(500);
    res.render('500');
});


app.listen(PORT, (err) => {
    if (err) {
        return console.error(err);
    }
    return console.log(`express - web server started..`);
});
