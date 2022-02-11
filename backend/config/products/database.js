const mongoose = require("mongoose");

const Database = () => {
    mongoose.connect(process.env.DB_URI).then((data) => {
        console.log(`mongoDB database connected ${data.connection.host}`);
    });
};

module.exports = Database;
