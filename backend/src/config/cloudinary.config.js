import {v2 as cloudinary} from "cloudinary"
import env from "./env.config.js"

// Ensure we have the necessary Cloudinary credentials
const { cloudName, apiKey, apiSecret } = env.cloudinary ?? {};
if (!cloudName || !apiKey || !apiSecret) {
  throw new Error(
    "Missing Cloudinary credentials. Ensure cloudName, apiKey and apiSecret are set."
  );
}

// Optional: redacted debug log (opt-in, non-production only)
if (env.nodeEnv!== "production" &&  env.debug=== "1") {
  console.log("Cloudinary configured.", {
    cloud_name: env.cloudinary.cloudName,
    api_key_last4: String(env.cloudinary.apiKey || "").slice(-4),
  });
}  


export default cloudinary;