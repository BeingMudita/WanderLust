const mongoose = require("mongoose");
const initdata = require("./data"); // Replace with the path to your data file
const Listing = require("../models/listing"); // Replace with the correct path to your Listing model

const Mongo_URL = "mongodb://127.0.0.1:27017/wanderLust"; // Update the database name if necessary

// Connect to MongoDB and initialize the database
async function main() {
    try {
        await mongoose.connect(Mongo_URL);
        console.log("Connected to MongoDB");

        await initDB();
    } catch (err) {
        console.error("Error connecting to the database:", err);
    } finally {
        mongoose.connection.close();
    }
}

// Function to initialize the database
const initDB = async () => {
    try {
        // Delete all existing listings in the database
        await Listing.deleteMany({});
        console.log("Existing listings deleted");

        const ownerId = "678f72a90435fdcf3bb2e05e"; // Replace with the valid owner ID

        // Add the `owner` property to each listing and insert them into the database
        const transformedData = initdata.data.map((item) => ({
            ...item,
            owner: ownerId, // Assign the owner field
        }));

        await Listing.insertMany(transformedData);
        console.log("Listings initialized with owner property");
    } catch (error) {
        console.error("Error initializing database:", error);
    }
};

// Start the database initialization
main();
