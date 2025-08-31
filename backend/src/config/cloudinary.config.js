import {v2 as cloudinary} from "cloudinary"
import env from "./env.config.js"


cloudinary.config({
    cloud_name: env.cloudinary.cloudName,
    api_key: env.cloudinary.apiKey,
    api_secret: env.cloudinary.apiSecret,
    secure: true
})

console.log("Cloudinary Configured:", {
    cloud_name: env.cloudinary.cloudName,
    api_key: env.cloudinary.apiKey,
    api_secret: env.cloudinary.apiSecret
})

export default cloudinary;