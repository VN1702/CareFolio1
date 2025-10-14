// App.js - Main React Application
import React, { useState, useEffect } from 'react';
import './App.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

function App() {
  const [activeTab, setActiveTab] = useState('doctors');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  return (
    <div className="App">
      <header className="header">
        <h1>🏥 Healthcare Certification System</h1>
        <p>Blockchain-based Medical Records & Certifications</p>
      </header>

      <nav className="nav-tabs">
        <button 
          className={activeTab === 'doctors' ? 'active' : ''} 
          onClick={() => setActiveTab('doctors')}
        >
          👨‍⚕️ Doctors
        </button>
        <button 
          className={activeTab === 'logs' ? 'active' : ''} 
          onClick={() => setActiveTab('logs')}
        >
          📝 Health Logs
        </button>
        <button 
          className={activeTab === 'consultations' ? 'active' : ''} 
          onClick={() => setActiveTab('consultations')}
        >
          🏥 Consultations
        </button>
      </nav>

      {message && (
        <div className={`message ${message.type}`}>
          {message.text}
          <button onClick={() => setMessage(null)}>×</button>
        </div>
      )}

      <main className="main-content">
        {activeTab === 'doctors' && <DoctorsTab setMessage={setMessage} />}
        {activeTab === 'logs' && <LogsTab setMessage={setMessage} />}
        {activeTab === 'consultations' && <ConsultationsTab setMessage={setMessage} />}
      </main>
    </div>
  );
}

// ==================== DOCTORS TAB ====================
function DoctorsTab({ setMessage }) {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    doctorAddress: '',
    doctorName: '',
    specialization: '',
    licenseNumber: '',
    degree: '',
    university: '',
    graduationYear: ''
  });

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/doctors`);
      const data = await res.json();
      setDoctors(data.doctors || []);
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to fetch doctors' });
    }
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/doctor/certify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          credentialData: {
            degree: formData.degree,
            university: formData.university,
            graduationYear: formData.graduationYear
          }
        })
      });
      const data = await res.json();
      
      if (data.success) {
        setMessage({ type: 'success', text: 'Doctor certified successfully!' });
        setShowForm(false);
        fetchDoctors();
        setFormData({
          doctorAddress: '',
          doctorName: '',
          specialization: '',
          licenseNumber: '',
          degree: '',
          university: '',
          graduationYear: ''
        });
      } else {
        setMessage({ type: 'error', text: data.error || 'Certification failed' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to certify doctor' });
    }
    setLoading(false);
  };

  const handleRevoke = async (doctorAddress) => {
    if (!window.confirm('Are you sure you want to revoke this certification?')) return;
    
    const reason = prompt('Enter revocation reason:');
    if (!reason) return;

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/doctor/revoke`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ doctorAddress, reason })
      });
      const data = await res.json();
      
      if (data.success) {
        setMessage({ type: 'success', text: 'Certification revoked' });
        fetchDoctors();
      } else {
        setMessage({ type: 'error', text: data.error });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to revoke certification' });
    }
    setLoading(false);
  };

  return (
    <div className="tab-content">
      <div className="tab-header">
        <h2>Doctor Certifications</h2>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : '+ Certify New Doctor'}
        </button>
      </div>

      {showForm && (
        <form className="form-card" onSubmit={handleSubmit}>
          <h3>Certify New Doctor</h3>
          <div className="form-grid">
            <input
              type="text"
              placeholder="Doctor Wallet Address *"
              value={formData.doctorAddress}
              onChange={(e) => setFormData({...formData, doctorAddress: e.target.value})}
              required
            />
            <input
              type="text"
              placeholder="Full Name *"
              value={formData.doctorName}
              onChange={(e) => setFormData({...formData, doctorName: e.target.value})}
              required
            />
            <input
              type="text"
              placeholder="Specialization *"
              value={formData.specialization}
              onChange={(e) => setFormData({...formData, specialization: e.target.value})}
              required
            />
            <input
              type="text"
              placeholder="License Number *"
              value={formData.licenseNumber}
              onChange={(e) => setFormData({...formData, licenseNumber: e.target.value})}
              required
            />
            <input
              type="text"
              placeholder="Degree (e.g., MBBS, MD)"
              value={formData.degree}
              onChange={(e) => setFormData({...formData, degree: e.target.value})}
            />
            <input
              type="text"
              placeholder="University"
              value={formData.university}
              onChange={(e) => setFormData({...formData, university: e.target.value})}
            />
            <input
              type="number"
              placeholder="Graduation Year"
              value={formData.graduationYear}
              onChange={(e) => setFormData({...formData, graduationYear: e.target.value})}
            />
          </div>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Processing...' : 'Certify Doctor'}
          </button>
        </form>
      )}

      {loading && !showForm ? (
        <div className="loading">Loading doctors...</div>
      ) : (
        <div className="cards-grid">
          {doctors.map((doctor) => (
            <div key={doctor._id} className={`card ${doctor.revoked ? 'revoked' : ''}`}>
              <div className="card-header">
                <h3>{doctor.doctorName}</h3>
                <span className={`status ${doctor.revoked ? 'revoked' : 'active'}`}>
                  {doctor.revoked ? '❌ Revoked' : '✅ Active'}
                </span>
              </div>
              <div className="card-body">
                <p><strong>Specialization:</strong> {doctor.specialization}</p>
                <p><strong>License:</strong> {doctor.licenseNumber}</p>
                <p><strong>Wallet:</strong> {doctor.doctor.slice(0, 8)}...{doctor.doctor.slice(-8)}</p>
                <p><strong>Issued:</strong> {new Date(doctor.issuedAt).toLocaleDateString()}</p>
                {doctor.credentialCid && (
                  <a 
                    href={`https://gateway.pinata.cloud/ipfs/${doctor.credentialCid}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link"
                  >
                    View Credentials on IPFS →
                  </a>
                )}
              </div>
              {!doctor.revoked && (
                <button 
                  className="btn-danger" 
                  onClick={() => handleRevoke(doctor.doctor)}
                  disabled={loading}
                >
                  Revoke Certification
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ==================== LOGS TAB ====================
function LogsTab({ setMessage }) {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [userAddress, setUserAddress] = useState('');
  const [logType, setLogType] = useState('PatientHealth');
  const [formData, setFormData] = useState({
    userAddress: '',
    notes: '',
    bloodPressure: '',
    heartRate: '',
    temperature: '',
    symptoms: '',
    activityType: '',
    durationMinutes: ''
  });

  const fetchLogs = async () => {
    if (!userAddress) {
      setMessage({ type: 'error', text: 'Please enter a user address' });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/user/logs/${userAddress}`);
      const data = await res.json();
      setLogs(data.logs || []);
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to fetch logs' });
    }
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const healthData = logType === 'PatientHealth' ? {
      bloodPressure: formData.bloodPressure,
      heartRate: formData.heartRate,
      temperature: formData.temperature,
      symptoms: formData.symptoms,
      date: new Date().toISOString()
    } : {
      activityType: formData.activityType,
      durationMinutes: parseInt(formData.durationMinutes),
      date: new Date().toISOString()
    };

    try {
      const res = await fetch(`${API_URL}/user/log`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userAddress: formData.userAddress,
          logType,
          healthData,
          notes: formData.notes,
          activityType: logType === 'Fitness' ? formData.activityType : undefined,
          durationMinutes: logType === 'Fitness' ? parseInt(formData.durationMinutes) : undefined
        })
      });
      const data = await res.json();
      
      if (data.success) {
        setMessage({ type: 'success', text: 'Log created successfully!' });
        setShowForm(false);
        if (userAddress === formData.userAddress) fetchLogs();
      } else {
        setMessage({ type: 'error', text: data.error });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to create log' });
    }
    setLoading(false);
  };

  return (
    <div className="tab-content">
      <div className="tab-header">
        <h2>Health & Fitness Logs</h2>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : '+ Create New Log'}
        </button>
      </div>

      {showForm && (
        <form className="form-card" onSubmit={handleSubmit}>
          <h3>Create New Log</h3>
          <div className="form-group">
            <label>Log Type:</label>
            <select value={logType} onChange={(e) => setLogType(e.target.value)}>
              <option value="PatientHealth">Patient Health</option>
              <option value="Fitness">Fitness Activity</option>
            </select>
          </div>
          
          <input
            type="text"
            placeholder="User Wallet Address *"
            value={formData.userAddress}
            onChange={(e) => setFormData({...formData, userAddress: e.target.value})}
            required
          />

          {logType === 'PatientHealth' ? (
            <>
              <input
                type="text"
                placeholder="Blood Pressure (e.g., 120/80)"
                value={formData.bloodPressure}
                onChange={(e) => setFormData({...formData, bloodPressure: e.target.value})}
              />
              <input
                type="number"
                placeholder="Heart Rate (bpm)"
                value={formData.heartRate}
                onChange={(e) => setFormData({...formData, heartRate: e.target.value})}
              />
              <input
                type="number"
                step="0.1"
                placeholder="Temperature (°F)"
                value={formData.temperature}
                onChange={(e) => setFormData({...formData, temperature: e.target.value})}
              />
              <input
                type="text"
                placeholder="Symptoms"
                value={formData.symptoms}
                onChange={(e) => setFormData({...formData, symptoms: e.target.value})}
              />
            </>
          ) : (
            <>
              <input
                type="text"
                placeholder="Activity Type (e.g., Running, Yoga) *"
                value={formData.activityType}
                onChange={(e) => setFormData({...formData, activityType: e.target.value})}
                required
              />
              <input
                type="number"
                placeholder="Duration (minutes) *"
                value={formData.durationMinutes}
                onChange={(e) => setFormData({...formData, durationMinutes: e.target.value})}
                required
              />
            </>
          )}

          <textarea
            placeholder="Notes *"
            value={formData.notes}
            onChange={(e) => setFormData({...formData, notes: e.target.value})}
            required
          />

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Creating...' : 'Create Log'}
          </button>
        </form>
      )}

      <div className="search-bar">
        <input
          type="text"
          placeholder="Enter user wallet address to view logs"
          value={userAddress}
          onChange={(e) => setUserAddress(e.target.value)}
        />
        <button className="btn-primary" onClick={fetchLogs} disabled={loading}>
          Search Logs
        </button>
      </div>

      {loading ? (
        <div className="loading">Loading logs...</div>
      ) : (
        <div className="cards-grid">
          {logs.map((log) => (
            <div key={log._id} className="card">
              <div className="card-header">
                <h3>
                  {log.logType === 'PatientHealth' ? '🏥 Health Log' : '🏃 Fitness Log'} 
                  #{log.logIndex}
                </h3>
                <span className="badge">{log.logType}</span>
              </div>
              <div className="card-body">
                <p><strong>Notes:</strong> {log.notes}</p>
                {log.activityType && <p><strong>Activity:</strong> {log.activityType}</p>}
                {log.durationMinutes && <p><strong>Duration:</strong> {log.durationMinutes} mins</p>}
                <p><strong>Date:</strong> {new Date(log.createdAt).toLocaleString()}</p>
                {log.dataCid && (
                  <a 
                    href={`https://gateway.pinata.cloud/ipfs/${log.dataCid}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link"
                  >
                    View Full Data on IPFS →
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ==================== CONSULTATIONS TAB ====================
function ConsultationsTab({ setMessage }) {
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [patientAddress, setPatientAddress] = useState('');
  const [formData, setFormData] = useState({
    patientAddress: '',
    doctorAddress: '',
    chiefComplaint: '',
    diagnosis: '',
    medications: '',
    instructions: ''
  });

  const fetchConsultations = async () => {
    if (!patientAddress) {
      setMessage({ type: 'error', text: 'Please enter a patient address' });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/consultation/${patientAddress}`);
      const data = await res.json();
      setConsultations(data.consultations || []);
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to fetch consultations' });
    }
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const consultationData = {
      chiefComplaint: formData.chiefComplaint,
      date: new Date().toISOString()
    };

    const prescriptionData = formData.medications ? {
      medications: formData.medications.split('\n').map(med => ({ name: med.trim() })),
      instructions: formData.instructions
    } : null;

    try {
      const res = await fetch(`${API_URL}/consultation/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientAddress: formData.patientAddress,
          doctorAddress: formData.doctorAddress,
          consultationData,
          diagnosis: formData.diagnosis,
          prescriptionData
        })
      });
      const data = await res.json();
      
      if (data.success) {
        setMessage({ type: 'success', text: 'Consultation created successfully!' });
        setShowForm(false);
        if (patientAddress === formData.patientAddress) fetchConsultations();
      } else {
        setMessage({ type: 'error', text: data.error });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to create consultation' });
    }
    setLoading(false);
  };

  return (
    <div className="tab-content">
      <div className="tab-header">
        <h2>Consultations</h2>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : '+ Create Consultation'}
        </button>
      </div>

      {showForm && (
        <form className="form-card" onSubmit={handleSubmit}>
          <h3>Create New Consultation</h3>
          <input
            type="text"
            placeholder="Patient Wallet Address *"
            value={formData.patientAddress}
            onChange={(e) => setFormData({...formData, patientAddress: e.target.value})}
            required
          />
          <input
            type="text"
            placeholder="Doctor Wallet Address *"
            value={formData.doctorAddress}
            onChange={(e) => setFormData({...formData, doctorAddress: e.target.value})}
            required
          />
          <textarea
            placeholder="Chief Complaint *"
            value={formData.chiefComplaint}
            onChange={(e) => setFormData({...formData, chiefComplaint: e.target.value})}
            required
          />
          <textarea
            placeholder="Diagnosis *"
            value={formData.diagnosis}
            onChange={(e) => setFormData({...formData, diagnosis: e.target.value})}
            required
          />
          <textarea
            placeholder="Medications (one per line)"
            value={formData.medications}
            onChange={(e) => setFormData({...formData, medications: e.target.value})}
          />
          <textarea
            placeholder="Instructions"
            value={formData.instructions}
            onChange={(e) => setFormData({...formData, instructions: e.target.value})}
          />
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Creating...' : 'Create Consultation'}
          </button>
        </form>
      )}

      <div className="search-bar">
        <input
          type="text"
          placeholder="Enter patient wallet address"
          value={patientAddress}
          onChange={(e) => setPatientAddress(e.target.value)}
        />
        <button className="btn-primary" onClick={fetchConsultations} disabled={loading}>
          Search Consultations
        </button>
      </div>

      {loading ? (
        <div className="loading">Loading consultations...</div>
      ) : (
        <div className="cards-grid">
          {consultations.map((consult) => (
            <div key={consult._id} className="card">
              <div className="card-header">
                <h3>Consultation #{consult.consultIndex}</h3>
                <span className="badge">Completed</span>
              </div>
              <div className="card-body">
                <p><strong>Doctor:</strong> {consult.doctor.slice(0, 8)}...{consult.doctor.slice(-8)}</p>
                <p><strong>Diagnosis:</strong> {consult.diagnosis}</p>
                <p><strong>Date:</strong> {new Date(consult.createdAt).toLocaleString()}</p>
                <div className="links">
                  <a 
                    href={`https://gateway.pinata.cloud/ipfs/${consult.notesCid}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link"
                  >
                    View Notes →
                  </a>
                  {consult.prescriptionCid && (
                    <a 
                      href={`https://gateway.pinata.cloud/ipfs/${consult.prescriptionCid}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="link"
                    >
                      View Prescription →
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;