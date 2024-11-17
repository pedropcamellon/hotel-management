import mongoose from 'mongoose';

declare global {
    var mongooseGlobal: {
        conn: typeof mongoose | null;
        promise: Promise<typeof mongoose> | null;
    } | undefined;
}

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable inside .env');
}

let cached = global.mongooseGlobal;

if (!cached) {
    cached = global.mongooseGlobal = { conn: null, promise: null };
}

async function dbConnect(): Promise<typeof mongoose> {
    if (cached?.conn) {
        return cached.conn;
    }

    if (!cached?.promise) {
        const opts = {
            bufferCommands: false,
        };

        cached!.promise = mongoose
            .connect(MONGODB_URI!, opts)
            .then((mongoose) => mongoose);
    }

    try {
        cached!.conn = await cached!.promise;
    } catch (e) {
        cached!.promise = null;
        throw e;
    }

    return cached!.conn;
}

export default dbConnect;