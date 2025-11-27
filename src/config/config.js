import dotenv from 'dotenv';

dotenv.config();
const config = {
    port: process.env.PORT || 3000,
    mongoDb: {
        uri: process.env.MONGO_URI || 'mongodb://mongoadmin:1234localhost:27017/java61?authSource=admin',
        db: {
            dbName: process.env.DB_NAME || 'java61',
        },
        // collectionName: process.env.COLLECTION_NAME || 'posts'

    }
}

export default config;