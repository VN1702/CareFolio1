// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { Connection, Keypair, PublicKey } = require('@solana/web3.js');
const { Program, AnchorProvider, web3, BN } = require('@coral-xyz/anchor');
const axios = require('axios');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/healthcare', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB Connected'))
.catch(err => console.error('❌ MongoDB Error:', err));

// MongoDB Schemas
const doctorCertSchema = new mongoose.Schema({
  doctor: { type: String, required: true, unique: true },
  doctorName: String,
  specialization: String,
  licenseNumber: String,
  credentialCid: String,
  issuedAt: Date,
  revoked: { type: Boolean, default: false },
  revokedAt: Date,
  txSignature: String,
  createdAt: { type: Date, default: Date.now }
});

const userLogSchema = new mongoose.Schema({
  user: { type: String, required: true },
  logIndex: { type: Number, required: true },
  dataCid: String,
  logType: { type: String, enum: ['PatientHealth', 'Fitness'] },
  notes: String,
  activityType: String,
  durationMinutes: Number,
  createdAt: Date,
  txSignature: String
}, { timestamps: true });

const consultationSchema = new mongoose.Schema({
  patient: { type: String, required: true },
  doctor: { type: String, required: true },
  consultIndex: { type: Number, required: true },
  notesCid: String,
  diagnosis: String,
  prescriptionCid: String,
  createdAt: Date,
  txSignature: String
}, { timestamps: true });

const DoctorCert = mongoose.model('DoctorCert', doctorCertSchema);
const UserLog = mongoose.model('UserLog', userLogSchema);
const Consultation = mongoose.model('Consultation', consultationSchema);

// Solana Setup
const PROGRAM_ID = new PublicKey(process.env.PROGRAM_ID);
const ADMIN_KEYPAIR = Keypair.fromSecretKey(
  Uint8Array.from(JSON.parse(process.env.ADMIN_PRIVATE_KEY))
);

console.log('📍 Program ID:', PROGRAM_ID.toString());
console.log('👤 Admin Public Key:', ADMIN_KEYPAIR.publicKey.toString());

// IPFS Helper Functions using Pinata
async function uploadToIPFS(data) {
  try {
    const url = 'https://api.pinata.cloud/pinning/pinJSONToIPFS';
    const response = await axios.post(url, data, {
      headers: {
        'Content-Type': 'application/json',
        'pinata_api_key': process.env.PINATA_API_KEY,
        'pinata_secret_api_key': process.env.PINATA_SECRET_KEY
      }
    });
    return response.data.IpfsHash; // Returns CID
  } catch (error) {
    console.error('IPFS Upload Error:', error.response?.data || error.message);
    throw new Error('Failed to upload to IPFS');
  }
}

async function getFromIPFS(cid) {
  try {
    const url = `https://gateway.pinata.cloud/ipfs/${cid}`;
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error('IPFS Fetch Error:', error.message);
    throw new Error('Failed to fetch from IPFS');
  }
}

// Helper: Get Solana Program
function getProgram() {
  const connection = new Connection(
    process.env.SOLANA_RPC_URL || 'https://api.devnet.solana.com',
    'confirmed'
  );
  
  const wallet = {
    publicKey: ADMIN_KEYPAIR.publicKey,
    signTransaction: async (tx) => {
      tx.partialSign(ADMIN_KEYPAIR);
      return tx;
    },
    signAllTransactions: async (txs) => {
      return txs.map(tx => {
        tx.partialSign(ADMIN_KEYPAIR);
        return tx;
      });
    }
  };

  const provider = new AnchorProvider(connection, wallet, {
    commitment: 'confirmed'
  });

  const idl = require('./idl.json');
  return new Program(idl, PROGRAM_ID, provider);
}

// ==================== ROUTES ====================

// Health Check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date(),
    programId: PROGRAM_ID.toString(),
    adminPublicKey: ADMIN_KEYPAIR.publicKey.toString()
  });
});

// 1. CREATE DOCTOR CERTIFICATION
app.post('/api/doctor/certify', async (req, res) => {
  try {
    const { doctorAddress, doctorName, specialization, licenseNumber, credentialData } = req.body;

    // Validate inputs
    if (!doctorAddress || !doctorName || !specialization || !licenseNumber) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Check if already certified
    const existing = await DoctorCert.findOne({ doctor: doctorAddress });
    if (existing) {
      return res.status(400).json({ error: 'Doctor already certified' });
    }

    // Upload credential to IPFS
    console.log('📤 Uploading credential to IPFS...');
    const credentialCid = await uploadToIPFS(credentialData || {
      doctorName,
      specialization,
      licenseNumber,
      issuedBy: 'Healthcare Platform',
      timestamp: new Date().toISOString()
    });
    console.log('✅ IPFS CID:', credentialCid);

    // Get PDA
    const program = getProgram();
    const [doctorCertPDA] = PublicKey.findProgramAddressSync(
      [Buffer.from('doctor_cert'), new PublicKey(doctorAddress).toBuffer()],
      PROGRAM_ID
    );

    console.log('📝 Creating doctor certification on-chain...');
    
    // Call Solana program
    const tx = await program.methods
      .createDoctorCert(
        credentialCid,
        doctorName,
        specialization,
        licenseNumber
      )
      .accounts({
        doctorCert: doctorCertPDA,
        admin: ADMIN_KEYPAIR.publicKey,
        doctor: new PublicKey(doctorAddress),
        systemProgram: web3.SystemProgram.programId,
      })
      .signers([ADMIN_KEYPAIR])
      .rpc();

    console.log('✅ Transaction:', tx);

    // Save to MongoDB
    const cert = await DoctorCert.create({
      doctor: doctorAddress,
      doctorName,
      specialization,
      licenseNumber,
      credentialCid,
      issuedAt: new Date(),
      txSignature: tx
    });

    res.json({ 
      success: true, 
      cert, 
      txSignature: tx,
      ipfsUrl: `https://gateway.pinata.cloud/ipfs/${credentialCid}`
    });
  } catch (error) {
    console.error('❌ Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// 2. GET ALL DOCTORS
app.get('/api/doctors', async (req, res) => {
  try {
    const doctors = await DoctorCert.find({}).sort({ issuedAt: -1 });
    res.json({ success: true, doctors });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 3. GET DOCTOR BY ADDRESS
app.get('/api/doctor/:doctorAddress', async (req, res) => {
  try {
    const { doctorAddress } = req.params;
    const doctor = await DoctorCert.findOne({ doctor: doctorAddress });
    
    if (!doctor) {
      return res.status(404).json({ error: 'Doctor not found' });
    }

    res.json({ success: true, doctor });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 4. VERIFY DOCTOR CERTIFICATION (On-chain)
app.get('/api/doctor/verify/:doctorAddress', async (req, res) => {
  try {
    const { doctorAddress } = req.params;
    
    const program = getProgram();
    const [doctorCertPDA] = PublicKey.findProgramAddressSync(
      [Buffer.from('doctor_cert'), new PublicKey(doctorAddress).toBuffer()],
      PROGRAM_ID
    );

    // Fetch account data
    const certAccount = await program.account.doctorCert.fetch(doctorCertPDA);
    const isValid = !certAccount.revoked;

    res.json({ 
      success: true, 
      isValid,
      doctorName: certAccount.doctorName,
      specialization: certAccount.specialization,
      licenseNumber: certAccount.licenseNumber,
      issuedAt: new Date(certAccount.issuedAt.toNumber() * 1000),
      revoked: certAccount.revoked
    });
  } catch (error) {
    res.status(500).json({ error: error.message, isValid: false });
  }
});

// 5. REVOKE DOCTOR CERTIFICATION
app.post('/api/doctor/revoke', async (req, res) => {
  try {
    const { doctorAddress, reason } = req.body;

    if (!doctorAddress || !reason) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const program = getProgram();
    const [doctorCertPDA] = PublicKey.findProgramAddressSync(
      [Buffer.from('doctor_cert'), new PublicKey(doctorAddress).toBuffer()],
      PROGRAM_ID
    );

    const tx = await program.methods
      .revokeDoctorCert(reason)
      .accounts({
        doctorCert: doctorCertPDA,
        admin: ADMIN_KEYPAIR.publicKey,
      })
      .signers([ADMIN_KEYPAIR])
      .rpc();

    await DoctorCert.findOneAndUpdate(
      { doctor: doctorAddress },
      { revoked: true, revokedAt: new Date() }
    );

    res.json({ success: true, txSignature: tx });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// 6. CREATE USER LOG (Patient/Fitness)
app.post('/api/user/log', async (req, res) => {
  try {
    const { 
      userAddress, 
      logType, 
      healthData, 
      notes, 
      activityType, 
      durationMinutes 
    } = req.body;

    if (!userAddress || !logType || !healthData || !notes) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Upload health/fitness data to IPFS
    console.log('📤 Uploading data to IPFS...');
    const dataCid = await uploadToIPFS(healthData);
    console.log('✅ Data CID:', dataCid);

    // Get next log index
    const lastLog = await UserLog.findOne({ user: userAddress })
      .sort({ logIndex: -1 });
    const logIndex = lastLog ? lastLog.logIndex + 1 : 0;

    const program = getProgram();
    const [userLogPDA] = PublicKey.findProgramAddressSync(
      [
        Buffer.from('user_log'),
        new PublicKey(userAddress).toBuffer(),
        new BN(logIndex).toArrayLike(Buffer, 'le', 8)
      ],
      PROGRAM_ID
    );

    // Create log type enum properly
    const logTypeEnum = logType === 'PatientHealth' 
      ? { patientHealth: {} } 
      : { fitness: {} };

    console.log('📝 Creating user log on-chain...');

    const tx = await program.methods
      .createUserLog(
        new BN(logIndex),
        dataCid,
        logTypeEnum,
        notes,
        activityType || null,
        durationMinutes ? Number(durationMinutes) : null
      )
      .accounts({
        userLog: userLogPDA,
        admin: ADMIN_KEYPAIR.publicKey,
        user: new PublicKey(userAddress),
        systemProgram: web3.SystemProgram.programId,
      })
      .signers([ADMIN_KEYPAIR])
      .rpc();

    console.log('✅ Transaction:', tx);

    const log = await UserLog.create({
      user: userAddress,
      logIndex,
      dataCid,
      logType,
      notes,
      activityType,
      durationMinutes,
      createdAt: new Date(),
      txSignature: tx
    });

    res.json({ 
      success: true, 
      log, 
      txSignature: tx,
      ipfsUrl: `https://gateway.pinata.cloud/ipfs/${dataCid}`
    });
  } catch (error) {
    console.error('❌ Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// 7. GET USER LOGS
app.get('/api/user/logs/:userAddress', async (req, res) => {
  try {
    const { userAddress } = req.params;
    const { logType } = req.query;

    const query = { user: userAddress };
    if (logType) query.logType = logType;

    const logs = await UserLog.find(query).sort({ logIndex: -1 });
    res.json({ success: true, logs, count: logs.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 8. GET SINGLE LOG WITH IPFS DATA
app.get('/api/user/log/:userAddress/:logIndex', async (req, res) => {
  try {
    const { userAddress, logIndex } = req.params;
    
    const log = await UserLog.findOne({ 
      user: userAddress, 
      logIndex: parseInt(logIndex) 
    });

    if (!log) {
      return res.status(404).json({ error: 'Log not found' });
    }

    // Fetch IPFS data
    const ipfsData = await getFromIPFS(log.dataCid);

    res.json({ 
      success: true, 
      log,
      data: ipfsData 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 9. CREATE CONSULTATION NOTE
app.post('/api/consultation/create', async (req, res) => {
  try {
    const { 
      patientAddress, 
      doctorAddress, 
      consultationData, 
      diagnosis,
      prescriptionData 
    } = req.body;

    if (!patientAddress || !doctorAddress || !consultationData || !diagnosis) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Upload to IPFS
    console.log('📤 Uploading consultation to IPFS...');
    const notesCid = await uploadToIPFS(consultationData);
    const prescriptionCid = prescriptionData 
      ? await uploadToIPFS(prescriptionData) 
      : null;

    // Get next consult index
    const lastConsult = await Consultation.findOne({ patient: patientAddress })
      .sort({ consultIndex: -1 });
    const consultIndex = lastConsult ? lastConsult.consultIndex + 1 : 0;

    const program = getProgram();
    
    const [consultNotePDA] = PublicKey.findProgramAddressSync(
      [
        Buffer.from('consult_note'),
        new PublicKey(patientAddress).toBuffer(),
        new BN(consultIndex).toArrayLike(Buffer, 'le', 8)
      ],
      PROGRAM_ID
    );

    const [doctorCertPDA] = PublicKey.findProgramAddressSync(
      [Buffer.from('doctor_cert'), new PublicKey(doctorAddress).toBuffer()],
      PROGRAM_ID
    );

    console.log('📝 Creating consultation note on-chain...');

    const tx = await program.methods
      .createConsultationNote(
        new BN(consultIndex),
        notesCid,
        diagnosis,
        prescriptionCid
      )
      .accounts({
        consultationNote: consultNotePDA,
        doctorCert: doctorCertPDA,
        admin: ADMIN_KEYPAIR.publicKey,
        doctor: new PublicKey(doctorAddress),
        patient: new PublicKey(patientAddress),
        systemProgram: web3.SystemProgram.programId,
      })
      .signers([ADMIN_KEYPAIR])
      .rpc();

    console.log('✅ Transaction:', tx);

    const consultation = await Consultation.create({
      patient: patientAddress,
      doctor: doctorAddress,
      consultIndex,
      notesCid,
      diagnosis,
      prescriptionCid,
      createdAt: new Date(),
      txSignature: tx
    });

    res.json({ 
      success: true, 
      consultation, 
      txSignature: tx,
      notesUrl: `https://gateway.pinata.cloud/ipfs/${notesCid}`,
      prescriptionUrl: prescriptionCid ? `https://gateway.pinata.cloud/ipfs/${prescriptionCid}` : null
    });
  } catch (error) {
    console.error('❌ Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// 10. GET CONSULTATIONS FOR PATIENT
app.get('/api/consultation/:patientAddress', async (req, res) => {
  try {
    const { patientAddress } = req.params;
    const consultations = await Consultation.find({ patient: patientAddress })
      .sort({ consultIndex: -1 });
    res.json({ success: true, consultations, count: consultations.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 11. GET CONSULTATION WITH IPFS DATA
app.get('/api/consultation/:patientAddress/:consultIndex', async (req, res) => {
  try {
    const { patientAddress, consultIndex } = req.params;
    
    const consultation = await Consultation.findOne({ 
      patient: patientAddress, 
      consultIndex: parseInt(consultIndex) 
    });

    if (!consultation) {
      return res.status(404).json({ error: 'Consultation not found' });
    }

    // Fetch IPFS data
    const notesData = await getFromIPFS(consultation.notesCid);
    const prescriptionData = consultation.prescriptionCid 
      ? await getFromIPFS(consultation.prescriptionCid)
      : null;

    res.json({ 
      success: true, 
      consultation,
      notes: notesData,
      prescription: prescriptionData
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 12. GET IPFS DATA BY CID
app.get('/api/ipfs/:cid', async (req, res) => {
  try {
    const { cid } = req.params;
    const data = await getFromIPFS(cid);
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n🚀 Server running on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/health`);
  console.log(`🔗 Program ID: ${PROGRAM_ID.toString()}`);
  console.log(`👤 Admin: ${ADMIN_KEYPAIR.publicKey.toString()}\n`);
});