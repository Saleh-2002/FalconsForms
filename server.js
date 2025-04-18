import express from "express";
import bodyParser from "body-parser";
import methodOverride from "method-override";
import multer from "multer";
import path from "path";
import xlsx from "xlsx";
import fs from "fs";



const app = express();
const Port = 3000;
app.use(express.static(path.join(process.cwd(), 'public')));
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use('/node_modules', express.static('node_modules'));

app.get("/", (req, res) => {res.render("Home");});
app.get("/regticket", (req, res) => {res.render("regticket");});
app.get("/specticket", (req, res) => {res.render("specticket");});


app.listen(Port, () => { console.log(`Server running at http://localhost:${Port}`) });