# **CareFolio – Intelligent and Secure Health Management Platform 🩺🔒**

**Personalized Wellness Plans, Verified by Solana Blockchain.**

CareFolio bridges the gap between generic fitness apps and clinical care by providing highly personalized, medically-aware meal and workout plans, secured with an immutable audit trail on the Solana blockchain.

## **✨ Key Features: The Three Pillars**

CareFolio's solution is built upon three core pillars: **Intelligence**, **Trust**, and **Accessibility**, ensuring a comprehensive and secure user experience.

| Feature Category | Description | Technical Implementation |
| :---- | :---- | :---- |
| **🧠 Intelligent Planning** | Generates bespoke Meal and Workout Plans using **hybrid ML models** (Rule-Based \+ XGBoost) that are medically aware of chronic conditions like **diabetes** and **hypertension**. Plans are synchronized for safety and maximum efficacy. | Python ML Engine, XGBoost, Rule-Based Safety Logic. |
| **🔐 Immutable Trust Layer** | Logs the cryptographic **hash (SHA-256)** of every prescription onto the **Solana Blockchain**. This creates a tamper-proof audit trail and ensures **doctor certifications** are verified on-chain. | Solana Web3 SDK, **Anchor** (Rust Smart Contracts), Hashing Algorithm. |
| **📞 Expert Care Access** | Provides users with an integrated **Streamlit Chatbot** for instant plan guidance and an **Expert Care** option to connect directly with **blockchain-verified doctors** via chat or video call. | React Frontend, Streamlit, LLM Integration. |
| **🛡️ Data Privacy** | Sensitive user data remains **off-chain** in a secure, encrypted database. Only the non-sensitive, auditable prescription hash is logged on the public ledger. | Node.js Backend Orchestration, Secure Database. |

## **🏗️ System Architecture Overview**

The CareFolio system utilizes a resilient service-oriented architecture, with the Node.js/Express backend acting as the secure orchestrator between the user interface, the ML intelligence, and the decentralized Solana ledger.

The core data flow is: **Survey Data**  **ML Plan Generation**  **Plan Hashing**  **Solana Logging (Audit Proof)**  **Frontend Display (Plan \+ TXID)**.

### **Architectural Flow: Data Hashing for Privacy**

This process ensures that user privacy is protected while maintaining an immutable audit trail.

1. **User (React Frontend):** Submits validated survey data (transformed to one-hot encoding).  
2. **Backend (Node.js/Express):** Orchestrates data flow, calls ML service, and performs two critical, simultaneous steps:  
   * **Secure Database:** Stores sensitive user profile and the full generated plan (off-chain).  
   * **Solana Program:** Sends the **Prescription Hash** and Doctor's Key for on-chain logging (audit record only).  
3. **Solana Blockchain:** Confirms the transaction, providing a unique **Transaction ID (TXID)** as cryptographic proof of the plan's existence and verification.  
4. **Frontend:** Displays the personalized plan and the **TXID** for user verification.

## **🚀 Tech Stack**

Our platform is built on a scalable and secure full-stack technology foundation.

| Component | Technologies Used | Purpose in CareFolio |
| :---- | :---- | :---- |
| **Frontend & UI** | **React, Tailwind CSS, Bootstrap** | Intuitive and responsive multi-step survey and user dashboard. |
| **Backend Orchestration** | **Node.js/Express, Firebase/Firestore** | Secure API Gateway, routing data between all services, handling user authentication, and performing **data transformation** (one-hot encoding). |
| **Machine Learning** | **Python (XGBoost/Rule-Based Logic), Streamlit** | Core intelligence for personalized plan generation, safety checks, and hosting the interactive chatbot. |
| **Blockchain** | **Solana Web3 SDK, Anchor (Rust)** | High-throughput, low-cost decentralized ledger for secure prescription auditing and doctor certification. |

## **🛠️ Setup and Installation**

To run the complete CareFolio platform locally, you must have **Node.js**, **Python**, and the **Solana CLI** installed.

### **1\. Project Cloning**

git clone \[YOUR\_REPO\_URL\] carefolio  
cd carefolio

### **2\. Frontend Setup (React)**

cd carefolio-frontend  
npm install  
npm start  
\# Runs on http://localhost:3000

### **3\. Backend Setup (Node.js/Express)**

cd ../carefolio-api  
npm install  
\# Note: Ensure environment variables are set for Firestore/Firebase and Solana keys  
npm start  
\# Runs on http://localhost:8080 (or specified port)

### **4\. ML/Streamlit Setup (Python)**

cd ../carefolio-ml-service  
pip install \-r requirements.txt  
\# To run the integrated chatbot interface  
streamlit run chatbot/app.py

### **5\. Blockchain Setup (Solana/Anchor)**

cd ../carefolio-solana-program  
\# Build the smart contract  
anchor build  
\# Deploy to Devnet (requires local Solana keypair setup)  
anchor deploy

## **👥 Team**

CareFolio was developed by a specialized, four-person team focused on cross-disciplinary excellence:

| Role | Name |
| :---- | :---- |
| **Frontend Developer** |  |
| **Backend Developer** |  |
| **Blockchain Developer** |  |
| **ML Engineer** |  |

