# Project Requirements and Features

## 1. Objective
The objective of CampusLedger is to design and implement a decentralized academic credentialing system that mitigates academic fraud, simplifies the verification process for employers, and returns data ownership to the students via secure digital wallets.

## 2. Functional Requirements & Key Features

### 2.1. Super Admin Module
- **Institution Vetting:** Ability to view all registered institutions and manually approve or suspend their ability to issue credentials.
- **Analytics:** High-level dashboard displaying system-wide metrics (total institutions, students, and issued credentials).

### 2.2. Institution Portal (The Issuer)
- **Authentication:** Standard email/password login.
- **Student Roster Management:** Ability to invite students to the platform. Inviting a student automatically provisions a Decentralized Identifier (DID) and sends a secure activation link via email.
- **Credential Issuance:** A dynamic form allowing institutions to issue custom credentials (e.g., Degrees, Transcripts) with specific claims (GPA, Honors).
- **Cryptographic Signing:** When issued, the credential payload is automatically signed using the institution's private key to generate a Verifiable Credential (JWT).
- **Revocation:** Ability for an institution to revoke a previously issued credential if issued in error or due to academic misconduct.

### 2.3. Student Portal (The Holder/Wallet)
- **Account Activation:** Secure onboarding flow via an email token.
- **Passwordless Security (Biometrics):** Ability to register local device hardware (Face ID, Touch ID, Windows Hello) via the WebAuthn API for seamless, passwordless logins.
- **Digital Wallet Dashboard:** A visual interface ("glassmorphism" ID card style) to view all received credentials.
- **Cryptographic Sharing:** Generation of secure, verifiable links and QR Codes. The sharing mechanism allows a student to prove ownership of their credential without relying on the institution's active participation.

### 2.4. Verification Portal (The Verifier)
- **Public Access:** A public-facing portal allowing employers or third-parties to verify a credential.
- **Manual & QR Verification:** Verifiers can input a Credential ID or scan a student's QR code using their device camera (via HTML5 QR Code scanning).
- **Cryptographic Validation:** The system verifies the JWT signature against the issuing institution's public key, checks the credential's revocation status, and confirms the institution is currently approved.

## 3. Non-Functional Requirements

### 3.1. Security
- **Data Protection:** Private keys must be encrypted at rest using AES-256-GCM.
- **Session Security:** Use HTTP-only, secure, encrypted cookies to prevent XSS session hijacking.
- **Phishing Resistance:** WebAuthn implementation must tie credentials to the exact origin domain, making phishing attacks structurally impossible.

### 3.2. Performance & UX
- **Responsive Design:** All portals (Admin, Institution, Student, Public Verify) must be fully functional and aesthetically pleasing on mobile, tablet, and desktop devices.
- **Modern Aesthetics:** Implement micro-animations, glassmorphism, and gradient backgrounds to provide a premium "fintech" feel.
- **Fast Rendering:** Utilize Next.js App Router for optimized Server-Side Rendering (SSR) and fast page loads.
