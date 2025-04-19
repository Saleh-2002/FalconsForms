import express from "express";
import bodyParser from "body-parser";
import methodOverride from "method-override";
import multer from "multer";
import path from "path";
import xlsx from "xlsx";
import fs from "fs";
import nodemailer from "nodemailer";
import QRCode from 'qrcode';
import { log } from "console";

const app = express();
const Port = 3000;

// File path
const baseDir = process.env.RENDER ? '/data' : path.join(process.cwd(), 'data');
const filePath = path.join(baseDir, 'users.xlsx');




// Middleware
app.use(express.static(path.join(process.cwd(), 'public')));
app.use(express.static("public"));

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use('/node_modules', express.static('node_modules'));
/*
THIS CODE WAS WRITTEN BY SALEH ALGHOOL 2025 Copyright (c)
*/ 
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


async function sendEmail(to, subject, qrCode) {
    let transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "SALEHSSAG10@GMAIL.COM".toLowerCase().trim(), // Use environment variables for better security
            pass: "yorkcqsxsryqsecn",
        },
    });

    let mailOptions = {
        from: `"FalconsFFCW" <SALEHSSAG10@gmail.com>`,
        to: to,
        subject: subject,
        html: `
            <p>You have successfully registered for a special ticket.</p>
            <p>Here is your QR Code:</p>
            <img src="cid:qrCodeImage" alt="QR Code" />
        `,
        attachments: [
            {
                filename: 'qrcode.png',
                content: qrCode.split("base64,")[1], // Extract the base64 data
                encoding: 'base64',
                cid: 'qrCodeImage', // Content ID for embedding in the email
            },
        ],
    };

    try {
        let info = await transporter.sendMail(mailOptions);
        console.log(`Email sent: ${info.response}`);
    } catch (error) {
        console.error("Error sending email:", error);
        throw error;
    }
}

async function createQRCode(Email, fullName, PhoneNumber, ticketCode) {
    try {
        // Create prettified JSON data string with 2 spaces indentation
        const jsonData = JSON.stringify(
            {
                Email, fullName, PhoneNumber, ticketCode
            },
            null,
            2 // Number of spaces for indentation
        );

        // Generate QR code from the prettified JSON data
        const qrCodeDataUrl = await QRCode.toDataURL(jsonData);
        console.log('QR Code generated successfully!');
        return qrCodeDataUrl;
    } catch (error) {
        Eprint('Failed to generate QR code:', error);
        throw error;
    }
}
// ------------------- 🛣️ Routes -------------------

app.get("/", function (req, res) {
    res.render("Home");
});

app.get("/regticket", function (req, res) {
    res.send("This Page is not active anymore!")
});

app.get("/specticket", function (req, res) {
    res.render("specticket");
});

// 🔹 Regular Ticket
// app.post("/submit-regular-ticket", function (req, res) {
//     const { fullName, email, phone } = req.body;
// //console.log(fullName, email, phone);

//     saveToExcel({
//         FullName: fullName,
//         Email: email,
//         Phone: phone,
//         TicketCode: "NONE"
//     });

//     res.redirect("/");
// });

// 🔸 Special Ticket
app.post("/submit-special-ticket", async function (req, res) {
    const { fullName, email, phone, ticketCode, ticketImage } = req.body;

    saveToExcel({
        FullName: fullName,
        Email: email,
        Phone: phone,
        TicketCode: ticketCode,
        TicketImage: ticketImage,
    }); 

    try {
        const qrCode = await createQRCode(email, fullName, phone, ticketCode); // Generate QR Code
        // await sendEmail(
        //     email,
        //     `Welcome ${fullName}`,
        //     qrCode // Pass the QR Code Data URL to the email function
        // );
        res.redirect("/");
    } catch (error) {
        console.error("Error processing special ticket:", error);
        res.status(500).send("An error occurred while processing your request.");
    }
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
