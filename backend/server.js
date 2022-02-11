const app = require("./app");
// const dotenv = require("dotenv");
const cloudinary = require("cloudinary");
const Database = require("./config/products/database");
process.on("uncaughtException", (err) => {
    console.log(`error:${err}`);
    console.log("shutting server down");
    process.exit(1);
});
// Config
if (process.env.NODE_ENV !== "PRODUCTION") {
    require("dotenv").config({ path: "backend/config/config.env" });
}
// dotenv.config({ path: "backend/config/config.env" });

Database();
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
});
const server = app.listen(process.env.PORT, () => {
    console.log(`server running on http://localhost:${process.env.PORT}`);
});

//unhandled promse rejection
process.on("unhandledRejection", (err) => {
    console.log(`error:${err}`);
    console.log("shutting server down");
    server.close(() => {
        process.exit(1);
    });
});
