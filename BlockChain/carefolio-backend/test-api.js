// test-api.js
// Test all API endpoints

const axios = require('axios');

const API_URL = 'http://localhost:5000/api';

// Replace with actual wallet addresses for testing
const TEST_DOCTOR = 'FsCovHKfceWnrH75xr9aowgeob461QrVezwtg2toNqp5'; // Replace with real address
const TEST_PATIENT = '9cnaWqT8uHes44V8gVqvfKNRSs3zu3DdTSTkiFz3ubZr'; // Replace with real address

async function testHealthCheck() {
  console.log('\n🏥 Testing Health Check...');
  try {
    const res = await axios.get('http://localhost:5000/health');
    console.log('✅ Health Check:', res.data);
    return true;
  } catch (error) {
    console.error('❌ Health Check Failed:', error.message);
    return false;
  }
}

async function testDoctorCertification() {
  console.log('\n👨‍⚕️ Testing Doctor Certification...');
  try {
    const res = await axios.post(`${API_URL}/doctor/certify`, {
      doctorAddress: TEST_DOCTOR,
      doctorName: 'Dr. John Smith',
      specialization: 'Cardiology',
      licenseNumber: 'MED-12345',
      credentialData: {
        degree: 'MBBS, MD',
        university: 'Harvard Medical School',
        graduationYear: 2015,
        experience: '8 years'
      }
    });
    console.log('✅ Doctor Certified:', res.data);
    return res.data;
  } catch (error) {
    console.error('❌ Certification Failed:', error.response?.data || error.message);
    return null;
  }
}

async function testVerifyDoctor() {
  console.log('\n🔍 Testing Doctor Verification...');
  try {
    const res = await axios.get(`${API_URL}/doctor/verify/${TEST_DOCTOR}`);
    console.log('✅ Verification Result:', res.data);
    return res.data;
  } catch (error) {
    console.error('❌ Verification Failed:', error.response?.data || error.message);
    return null;
  }
}

async function testCreatePatientLog() {
  console.log('\n📝 Testing Patient Log Creation...');
  try {
    const res = await axios.post(`${API_URL}/user/log`, {
      userAddress: TEST_PATIENT,
      logType: 'PatientHealth',
      healthData: {
        bloodPressure: '120/80',
        heartRate: 72,
        temperature: 98.6,
        symptoms: 'Mild headache',
        date: new Date().toISOString()
      },
      notes: 'Regular checkup - all vitals normal'
    });
    console.log('✅ Patient Log Created:', res.data);
    return res.data;
  } catch (error) {
    console.error('❌ Log Creation Failed:', error.response?.data || error.message);
    return null;
  }
}

async function testCreateFitnessLog() {
  console.log('\n🏃 Testing Fitness Log Creation...');
  try {
    const res = await axios.post(`${API_URL}/user/log`, {
      userAddress: TEST_PATIENT,
      logType: 'Fitness',
      healthData: {
        steps: 10000,
        caloriesBurned: 450,
        distance: '5.2 km',
        date: new Date().toISOString()
      },
      notes: 'Morning run at park',
      activityType: 'Running',
      durationMinutes: 45
    });
    console.log('✅ Fitness Log Created:', res.data);
    return res.data;
  } catch (error) {
    console.error('❌ Log Creation Failed:', error.response?.data || error.message);
    return null;
  }
}

async function testGetUserLogs() {
  console.log('\n📋 Testing Get User Logs...');
  try {
    const res = await axios.get(`${API_URL}/user/logs/${TEST_PATIENT}`);
    console.log(`✅ Found ${res.data.count} logs for user`);
    console.log('Logs:', res.data.logs);
    return res.data;
  } catch (error) {
    console.error('❌ Get Logs Failed:', error.response?.data || error.message);
    return null;
  }
}

async function testCreateConsultation() {
  console.log('\n🏥 Testing Consultation Creation...');
  try {
    const res = await axios.post(`${API_URL}/consultation/create`, {
      patientAddress: TEST_PATIENT,
      doctorAddress: TEST_DOCTOR,
      consultationData: {
        chiefComplaint: 'Persistent headache for 3 days',
        vitalSigns: {
          bloodPressure: '130/85',
          heartRate: 78,
          temperature: 99.1
        },
        symptoms: ['headache', 'mild fever', 'fatigue'],
        examinationFindings: 'No abnormalities detected',
        date: new Date().toISOString()
      },
      diagnosis: 'Viral infection - Common cold',
      prescriptionData: {
        medications: [
          {
            name: 'Paracetamol',
            dosage: '500mg',
            frequency: 'Twice daily',
            duration: '5 days'
          },
          {
            name: 'Vitamin C',
            dosage: '1000mg',
            frequency: 'Once daily',
            duration: '7 days'
          }
        ],
        instructions: 'Take with food. Rest and stay hydrated.',
        followUp: '1 week'
      }
    });
    console.log('✅ Consultation Created:', res.data);
    return res.data;
  } catch (error) {
    console.error('❌ Consultation Failed:', error.response?.data || error.message);
    return null;
  }
}

async function testGetConsultations() {
  console.log('\n📋 Testing Get Consultations...');
  try {
    const res = await axios.get(`${API_URL}/consultation/${TEST_PATIENT}`);
    console.log(`✅ Found ${res.data.count} consultations for patient`);
    console.log('Consultations:', res.data.consultations);
    return res.data;
  } catch (error) {
    console.error('❌ Get Consultations Failed:', error.response?.data || error.message);
    return null;
  }
}

async function testGetAllDoctors() {
  console.log('\n👥 Testing Get All Doctors...');
  try {
    const res = await axios.get(`${API_URL}/doctors`);
    console.log(`✅ Found ${res.data.doctors.length} doctors`);
    console.log('Doctors:', res.data.doctors);
    return res.data;
  } catch (error) {
    console.error('❌ Get Doctors Failed:', error.response?.data || error.message);
    return null;
  }
}

// Run all tests
async function runAllTests() {
  console.log('🧪 Starting API Tests...');
  console.log('================================');
  
  // Check if test addresses are set
  if (TEST_DOCTOR === 'DOCTOR_WALLET_ADDRESS_HERE' || 
      TEST_PATIENT === 'PATIENT_WALLET_ADDRESS_HERE') {
    console.error('\n❌ ERROR: Please update TEST_DOCTOR and TEST_PATIENT addresses in test-api.js');
    console.log('\nYou can use any Solana wallet address for testing.');
    console.log('Example: Generate addresses at https://solana.com/wallet\n');
    return;
  }

  const health = await testHealthCheck();
  if (!health) {
    console.error('\n❌ Server is not running! Start it with: node server.js\n');
    return;
  }

  await testDoctorCertification();
  await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2s

  await testVerifyDoctor();
  await new Promise(resolve => setTimeout(resolve, 1000));

  await testCreatePatientLog();
  await new Promise(resolve => setTimeout(resolve, 2000));

  await testCreateFitnessLog();
  await new Promise(resolve => setTimeout(resolve, 2000));

  await testGetUserLogs();
  await new Promise(resolve => setTimeout(resolve, 1000));

  await testCreateConsultation();
  await new Promise(resolve => setTimeout(resolve, 2000));

  await testGetConsultations();
  await new Promise(resolve => setTimeout(resolve, 1000));

  await testGetAllDoctors();

  console.log('\n================================');
  console.log('✅ All tests completed!\n');
}

// Run tests
runAllTests().catch(console.error);