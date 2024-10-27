const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
    try {
        console.log('Attempting to connect to MongoDB...');
        await mongoose.connect(process.env.DATABASE_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 30000, // 30 seconds timeout
            socketTimeoutMS: 45000, // 45 seconds socket timeout
        });
        console.log('Database connected successfully');
        console.log('Mongoose connection:', mongoose.connection);
    } catch (error) {
        console.error('Database connection failed:', error.message);
        process.exit(1); // Exit process with failure
    }
};

module.exports = connectDB;