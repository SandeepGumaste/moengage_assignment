import mongoose from 'mongoose';

const MONGODB_URI = `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_CLUSTER}/${process.env.MONGODB_DATABASE}?retryWrites=true&w=majority&appName=MyCluster`;

if (!MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable inside .env');
}

const connection = { isConnected: false };

async function connectDB() {
    if (connection.isConnected) {
        return;
    }

    try {
        const db = await mongoose.connect(MONGODB_URI, {
            bufferCommands: false,
        });
        
        connection.isConnected = db.connections[0].readyState === 1;
        
        mongoose.connection.on('error', (err) => {
            console.error('MongoDB connection error:', err);
            connection.isConnected = false;
        });

        return db;
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        throw error;
    }
}

export default connectDB;
