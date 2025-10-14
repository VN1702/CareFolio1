import dotenv from 'dotenv';
import pinataSDK from '@pinata/sdk';

dotenv.config();

const pinataApiKey = process.env.PINATA_API_KEY;
const pinataSecret = process.env.PINATA_SECRET_KEY;

if (!pinataApiKey || !pinataSecret) {
  console.error('Missing PINATA_API_KEY or PINATA_SECRET_KEY in .env');
  process.exit(1);
}

// instantiate with `new`
const pinata = new pinataSDK(pinataApiKey, pinataSecret);

async function testUpload() {
  try {
    const data = { test: 'Hello IPFS!' };
    const result = await pinata.pinJSONToIPFS(data);
    console.log('✅ Upload successful!');
    console.log('CID:', result.IpfsHash);
    console.log('View at:', `https://gateway.pinata.cloud/ipfs/${result.IpfsHash}`);
  } catch (error) {
    console.error('❌ Upload failed:', error.message || error);
  }
}

testUpload();
