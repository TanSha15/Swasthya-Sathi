// config/db.js
import mongoose from 'mongoose';
import dns from 'dns';

const connectDB = async () => {
    try {
        // Fix for "querySrv ECONNREFUSED" caused by certain ISPs/Firewalls blocking SRV lookups.
        dns.setServers(['8.8.8.8', '8.8.4.4']);
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

export default connectDB;