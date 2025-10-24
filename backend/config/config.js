import dotenv from 'dotenv';
dotenv.config();

const DB_URI = process.env.DB_URI;
const PORT = process.env.PORT;
const cloud_name = process.env.CLOUD_NAME;
const cloud_key = process.env.CLOUD_KEY;
const cloud_secret = process.env.CLOUD_SECRET;
const stripe_secret_key = process.env.STRIPE_SECRET_KEY; 
export { DB_URI, PORT, cloud_key, cloud_name, cloud_secret };
