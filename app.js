import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import models from "./models.js";

import apiv1Router from "./routes/api/v1/apiv1.js";

import { fileURLToPath } from 'url';
import { dirname } from 'path';

import multer from 'multer';
import sessions from 'express-session';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

var app = express();

app.use(multer().none());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    req.models = models;
    next();
});

const oneDay = 1000 * 60 * 60 * 24;

app.use(sessions({
    secret: "21o3890dakhjf90e980adfs34280985",
    saveUninitialized: true,
    cookie: {maxAge: oneDay},
    resave: false
}))

app.use("/api/v1", apiv1Router);

export default app;
