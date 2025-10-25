import {v2 as cloudinary} from 'cloudinary';
import { cloud_name, cloud_key, cloud_secret } from './config.js';
cloudinary.config({
    cloud_name: cloud_name,
    api_key: cloud_key,
    api_secret: cloud_secret 
})

export default cloudinary;