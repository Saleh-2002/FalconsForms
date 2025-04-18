import express from "express";
import bodyParser from "body-parser";
import methodOverride from "method-override";
import multer from "multer";
import path from "path";
import xlsx from "xlsx";
import fs from "fs";
import { log } from "console";

const app = express();
const Port = 3000;

// File path
const filePath = path.join(process.cwd(), 'data', 'users.xlsx');




// Middleware
app.use(express.static(path.join(process.cwd(), 'public')));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use('/node_modules', express.static('node_modules'));

// ------------------- 🔧 Excel Helper Function -------------------

function saveToExcel(userData) {
    const dataDir = path.join(process.cwd(), 'data');
    if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir);
    }

    let data = [];
    let workbook;

    if (fs.existsSync(filePath)) {
        // Read the existing workbook
        workbook = xlsx.readFile(filePath);
        const worksheet = workbook.Sheets["Users"];
        data = xlsx.utils.sheet_to_json(worksheet); // Convert existing sheet to JSON
    } else {
        // Create a new workbook if it doesn't exist
        workbook = xlsx.utils.book_new();
    }

    // Add new user data to the array
    data.push(userData);

    // Create a new worksheet from the updated data
    const newSheet = xlsx.utils.json_to_sheet(data);

    // Replace the old "Users" sheet with the new one
    workbook.Sheets["Users"] = newSheet;
    workbook.SheetNames = ["Users"];

    // Save the updated workbook
    xlsx.writeFile(workbook, filePath);
    console.log("✅ Data saved to Excel:", userData);
}
 
// ------------------- 🛣️ Routes -------------------

app.get("/", function (req, res) {
    res.render("Home");
});

app.get("/regticket", function (req, res) {
    res.render("regticket");
});

app.get("/specticket", function (req, res) {
    res.render("specticket");
});

// 🔹 Regular Ticket
app.post("/submit-regular-ticket", function (req, res) {
    const { fullName, email, phone } = req.body;
//console.log(fullName, email, phone);

    saveToExcel({
        FullName: fullName,
        Email: email,
        Phone: phone,
        TicketCode: "NONE"
    });

    res.redirect("/");
});

// 🔸 Special Ticket
app.post("/submit-special-ticket", function (req, res) {
    const { fullName, email, phone, ticketCode } = req.body;
//console.log(fullName, email, phone, ticketCode);

    saveToExcel({
        FullName: fullName,
        Email: email,
        Phone: phone,
        TicketCode: ticketCode
    });


    res.redirect("/");
});

// Route to export/download the Excel file
app.get("/export-users", (req, res) => {
    const fileName = "users.xlsx";
    const fileLocation = path.join(process.cwd(), "data", fileName);

    if (fs.existsSync(fileLocation)) {
        res.download(fileLocation, fileName, (err) => {
            if (err) {
                console.error("Error during download:", err);
                res.status(500).send("Error downloading the file.");
            }
        });
    } else {
        res.status(404).send("File not found.");
    }
});

// ------------------- 🚀 Start Server -------------------

app.listen(Port, function () {
    console.log(`Server running at http://localhost:${Port}`);
});
