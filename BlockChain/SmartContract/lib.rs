use anchor_lang::prelude::*;

declare_id!("32Ft4sykrv6z6DnzsFJTTkysdMYHWHpKSWnvMqspEgYB");

#[program]
pub mod healthcare_certification {
    use super::*;

    // ==================== DOCTOR CERTIFICATION ====================

    /// Create a new doctor certification (Admin only)
    pub fn create_doctor_cert(
        ctx: Context<CreateDoctorCert>,
        credential_cid: String,
        doctor_name: String,
        specialization: String,
        license_number: String,
    ) -> Result<()> {
        require!(credential_cid.len() <= 100, ErrorCode::CidTooLong);
        require!(doctor_name.len() <= 50, ErrorCode::NameTooLong);
        require!(specialization.len() <= 50, ErrorCode::SpecializationTooLong);
        require!(license_number.len() <= 30, ErrorCode::LicenseNumberTooLong);

        let cert = &mut ctx.accounts.doctor_cert;
        cert.admin = ctx.accounts.admin.key();
        cert.doctor = ctx.accounts.doctor.key();
        cert.credential_cid = credential_cid;
        cert.doctor_name = doctor_name;
        cert.specialization = specialization;
        cert.license_number = license_number;
        cert.issued_at = Clock::get()?.unix_timestamp;
        cert.revoked = false;
        cert.revoked_at = None;
        cert.bump = ctx.bumps.doctor_cert;

        emit!(DoctorCertCreated {
            doctor: cert.doctor,
            credential_cid: cert.credential_cid.clone(),
            issued_at: cert.issued_at,
        });

        Ok(())
    }

    /// Verify if a doctor certification is valid
    pub fn verify_doctor_cert(ctx: Context<VerifyDoctorCert>) -> Result<bool> {
        let cert = &ctx.accounts.doctor_cert;

        let is_valid = !cert.revoked;

        emit!(DoctorCertVerified {
            doctor: cert.doctor,
            is_valid,
            checked_at: Clock::get()?.unix_timestamp,
        });

        Ok(is_valid)
    }

    /// Revoke a doctor certification (Admin only)
    pub fn revoke_doctor_cert(ctx: Context<RevokeDoctorCert>, reason: String) -> Result<()> {
        require!(reason.len() <= 200, ErrorCode::ReasonTooLong);
        require!(!ctx.accounts.doctor_cert.revoked, ErrorCode::AlreadyRevoked);

        let cert = &mut ctx.accounts.doctor_cert;
        cert.revoked = true;
        cert.revoked_at = Some(Clock::get()?.unix_timestamp);

        emit!(DoctorCertRevoked {
            doctor: cert.doctor,
            reason,
            revoked_at: cert.revoked_at.unwrap(),
        });

        Ok(())
    }

    // ==================== UNIFIED USER HEALTH LOG ====================

    /// Create a user health log entry (Admin only)
    /// Can be used for both patient health data and fitness data
    pub fn create_user_log(
        ctx: Context<CreateUserLog>,
        log_index: u64,
        data_cid: String,
        log_type: LogType,
        notes: String,
        // Optional fields for fitness data
        activity_type: Option<String>,
        duration_minutes: Option<u32>,
    ) -> Result<()> {
        require!(data_cid.len() <= 100, ErrorCode::CidTooLong);
        require!(notes.len() <= 200, ErrorCode::NotesTooLong);

        if let Some(ref activity) = activity_type {
            require!(activity.len() <= 50, ErrorCode::ActivityTypeTooLong);
        }

        let log = &mut ctx.accounts.user_log;
        log.admin = ctx.accounts.admin.key();
        log.user = ctx.accounts.user.key();
        log.log_index = log_index;
        log.data_cid = data_cid;
        log.log_type = log_type;
        log.notes = notes;
        log.activity_type = activity_type;
        log.duration_minutes = duration_minutes;
        log.created_at = Clock::get()?.unix_timestamp;
        log.bump = ctx.bumps.user_log;

        emit!(UserLogCreated {
            user: log.user,
            log_index: log.log_index,
            log_type: log.log_type,
            data_cid: log.data_cid.clone(),
            created_at: log.created_at,
        });

        Ok(())
    }

    // ==================== CONSULTATION NOTE ====================

    /// Create a consultation note (Admin only)
    pub fn create_consultation_note(
        ctx: Context<CreateConsultationNote>,
        consult_index: u64,
        notes_cid: String,
        diagnosis: String,
        prescription_cid: Option<String>,
    ) -> Result<()> {
        require!(notes_cid.len() <= 100, ErrorCode::CidTooLong);
        require!(diagnosis.len() <= 200, ErrorCode::DiagnosisTooLong);

        if let Some(ref pcid) = prescription_cid {
            require!(pcid.len() <= 100, ErrorCode::CidTooLong);
        }

        // Verify doctor has valid certification
        require!(
            !ctx.accounts.doctor_cert.revoked,
            ErrorCode::DoctorCertRevoked
        );

        let note = &mut ctx.accounts.consultation_note;
        note.admin = ctx.accounts.admin.key();
        note.patient = ctx.accounts.patient.key();
        note.doctor = ctx.accounts.doctor.key();
        note.consult_index = consult_index;
        note.notes_cid = notes_cid;
        note.diagnosis = diagnosis;
        note.prescription_cid = prescription_cid;
        note.created_at = Clock::get()?.unix_timestamp;
        note.bump = ctx.bumps.consultation_note;

        emit!(ConsultationNoteCreated {
            patient: note.patient,
            doctor: note.doctor,
            consult_index: note.consult_index,
            created_at: note.created_at,
        });

        Ok(())
    }
}

// ==================== ENUMS ====================

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy, PartialEq, Eq)]
pub enum LogType {
    PatientHealth,
    Fitness,
}

// ==================== ACCOUNT STRUCTURES ====================

#[account]
pub struct DoctorCert {
    pub admin: Pubkey,           // Admin who issued cert
    pub doctor: Pubkey,          // Doctor's wallet
    pub credential_cid: String,  // IPFS CID of credential document
    pub doctor_name: String,     // Doctor's full name
    pub specialization: String,  // Medical specialization
    pub license_number: String,  // Medical license number
    pub issued_at: i64,          // Unix timestamp
    pub revoked: bool,           // Revocation status
    pub revoked_at: Option<i64>, // Revocation timestamp
    pub bump: u8,                // PDA bump seed
}

#[account]
pub struct UserLog {
    pub admin: Pubkey,                 // Admin who created the log
    pub user: Pubkey,                  // User's wallet (patient or fitness user)
    pub log_index: u64,                // Sequential log number
    pub data_cid: String,              // IPFS CID of health/fitness data
    pub log_type: LogType,             // Type: PatientHealth or Fitness
    pub notes: String,                 // Brief notes/description
    pub activity_type: Option<String>, // For fitness: activity type
    pub duration_minutes: Option<u32>, // For fitness: duration
    pub created_at: i64,               // Unix timestamp
    pub bump: u8,                      // PDA bump seed
}

#[account]
pub struct ConsultationNote {
    pub admin: Pubkey,                    // Admin who created the note
    pub patient: Pubkey,                  // Patient's wallet
    pub doctor: Pubkey,                   // Doctor's wallet
    pub consult_index: u64,               // Sequential consultation number
    pub notes_cid: String,                // IPFS CID of consultation notes
    pub diagnosis: String,                // Brief diagnosis
    pub prescription_cid: Option<String>, // Optional prescription CID
    pub created_at: i64,                  // Unix timestamp
    pub bump: u8,                         // PDA bump seed
}

// ==================== CONTEXT STRUCTURES ====================

#[derive(Accounts)]
pub struct CreateDoctorCert<'info> {
    #[account(
        init,
        payer = admin,
        space = 8 + 32 + 32 + 104 + 54 + 54 + 34 + 8 + 1 + 9 + 1,
        seeds = [b"doctor_cert", doctor.key().as_ref()],
        bump
    )]
    pub doctor_cert: Account<'info, DoctorCert>,

    #[account(mut)]
    pub admin: Signer<'info>,

    /// CHECK: Doctor's public key
    pub doctor: AccountInfo<'info>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct VerifyDoctorCert<'info> {
    #[account(
        seeds = [b"doctor_cert", doctor.key().as_ref()],
        bump = doctor_cert.bump
    )]
    pub doctor_cert: Account<'info, DoctorCert>,

    /// CHECK: Doctor's public key
    pub doctor: AccountInfo<'info>,
}

#[derive(Accounts)]
pub struct RevokeDoctorCert<'info> {
    #[account(
        mut,
        seeds = [b"doctor_cert", doctor_cert.doctor.as_ref()],
        bump = doctor_cert.bump,
        has_one = admin
    )]
    pub doctor_cert: Account<'info, DoctorCert>,

    #[account(mut)]
    pub admin: Signer<'info>,
}

#[derive(Accounts)]
#[instruction(log_index: u64)]
pub struct CreateUserLog<'info> {
    #[account(
        init,
        payer = admin,
        space = 8 + 32 + 32 + 8 + 104 + 1 + 204 + 55 + 5 + 8 + 1,
        seeds = [b"user_log", user.key().as_ref(), &log_index.to_le_bytes()],
        bump
    )]
    pub user_log: Account<'info, UserLog>,

    #[account(mut)]
    pub admin: Signer<'info>,

    /// CHECK: User's public key (patient or fitness user)
    pub user: AccountInfo<'info>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(consult_index: u64)]
pub struct CreateConsultationNote<'info> {
    #[account(
        init,
        payer = admin,
        space = 8 + 32 + 32 + 32 + 8 + 104 + 204 + 105 + 8 + 1,
        seeds = [b"consult_note", patient.key().as_ref(), &consult_index.to_le_bytes()],
        bump
    )]
    pub consultation_note: Account<'info, ConsultationNote>,

    #[account(
        seeds = [b"doctor_cert", doctor.key().as_ref()],
        bump = doctor_cert.bump
    )]
    pub doctor_cert: Account<'info, DoctorCert>,

    #[account(mut)]
    pub admin: Signer<'info>,

    /// CHECK: Doctor's public key
    pub doctor: AccountInfo<'info>,

    /// CHECK: Patient's public key
    pub patient: AccountInfo<'info>,

    pub system_program: Program<'info, System>,
}

// ==================== EVENTS ====================

#[event]
pub struct DoctorCertCreated {
    pub doctor: Pubkey,
    pub credential_cid: String,
    pub issued_at: i64,
}

#[event]
pub struct DoctorCertVerified {
    pub doctor: Pubkey,
    pub is_valid: bool,
    pub checked_at: i64,
}

#[event]
pub struct DoctorCertRevoked {
    pub doctor: Pubkey,
    pub reason: String,
    pub revoked_at: i64,
}

#[event]
pub struct UserLogCreated {
    pub user: Pubkey,
    pub log_index: u64,
    pub log_type: LogType,
    pub data_cid: String,
    pub created_at: i64,
}

#[event]
pub struct ConsultationNoteCreated {
    pub patient: Pubkey,
    pub doctor: Pubkey,
    pub consult_index: u64,
    pub created_at: i64,
}

// ==================== ERROR CODES ====================

#[error_code]
pub enum ErrorCode {
    #[msg("CID string exceeds maximum length")]
    CidTooLong,

    #[msg("Name exceeds maximum length")]
    NameTooLong,

    #[msg("Specialization exceeds maximum length")]
    SpecializationTooLong,

    #[msg("License number exceeds maximum length")]
    LicenseNumberTooLong,

    #[msg("Notes exceed maximum length")]
    NotesTooLong,

    #[msg("Activity type exceeds maximum length")]
    ActivityTypeTooLong,

    #[msg("Diagnosis exceeds maximum length")]
    DiagnosisTooLong,

    #[msg("Reason exceeds maximum length")]
    ReasonTooLong,

    #[msg("Doctor certification is already revoked")]
    AlreadyRevoked,

    #[msg("Doctor certification has been revoked")]
    DoctorCertRevoked,
}