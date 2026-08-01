# Architecture and System Design

## 1. System Overview
CampusLedger is a modern, decentralized academic credential management system. It aims to bridge the gap between traditional educational institutions and the future of verifiable digital identities. The system allows academic institutions to issue cryptographically signed, tamper-proof credentials directly to students. Students hold these credentials in a secure digital wallet (secured via biometric passkeys) and can share them with third parties (e.g., employers), who can instantly verify their authenticity without needing to contact the issuing institution.

## 2. Technology Stack
The application is built upon a modern, full-stack JavaScript ecosystem:
- **Frontend Framework:** Next.js (App Router) & React.
- **Styling:** Tailwind CSS with utility-first classes, heavily utilizing CSS variables for consistent theming and glassmorphic UI elements (via `framer-motion` for animations).
- **Backend/API:** Next.js Server Components and Route Handlers for seamless frontend/backend integration.
- **Database:** MongoDB (via Mongoose ODM) for flexible, document-based storage.
- **Authentication (Institutions/Admins):** Traditional password-based login using bcrypt hashing and Iron-Session for secure, encrypted cookies.
- **Authentication (Students):** Passwordless biometric authentication using the WebAuthn standard (`@simplewebauthn/browser` and `@simplewebauthn/server`).
- **Cryptography & Signatures:** Standard JSON Web Signatures (JWS) via the `jose` library to sign and verify credentials.

## 3. Core Architectural Patterns
### 3.1. Three-Tier Architecture
The system follows a standard three-tier architecture embedded within the Next.js framework:
1. **Presentation Layer (Client Components):** Interactive UI elements rendered in the browser (e.g., Dashboards, Biometric setup, QR Scanners).
2. **Application Layer (Server Components & API Routes):** Handles business logic, authentication guards, email dispatching, and cryptographic signing.
3. **Data Layer (MongoDB):** Persistent storage for Users, Decentralized Identifiers (DIDs), and Credentials.

### 3.2. Decentralized Identity (DID) Flow
Instead of relying purely on centralized databases for verification, the system uses principles from Decentralized Identity:
- **Key Pairs:** When a student is invited, a unique cryptographic key pair (Public/Private) is generated.
- **DID Document:** A Decentralized Identifier (e.g., `did:key:...`) is created for the student and stored in the `DIDDocument` collection.
- **Issuance:** When an institution issues a credential, the data (claims) is signed using the institution's private key, creating a verifiable JSON Web Token (JWT).
- **Verification:** Third parties verify the credential by checking the JWT signature against the institution's known public key. If the signature matches and the credential is not marked as revoked in the database, it is cryptographically proven to be authentic.

### 3.3. Passwordless Security Model (WebAuthn)
To enhance security and user experience for students, the application implements FIDO2/WebAuthn standards:
1. **Registration:** The student's device (phone, laptop) generates a hardware-bound public/private key pair. The public key is sent to the CampusLedger server.
2. **Authentication:** When logging in, the server sends a random "challenge". The user's device prompts for a biometric check (Face ID, Touch ID), signs the challenge with the hardware private key, and sends it back. The server verifies the signature using the stored public key.

## 4. Security Measures
- **Data Encryption:** Sensitive keys (like the institution's signing private key or the student's DID private key) are encrypted at rest in MongoDB using AES-256-GCM. They are decrypted in memory only when actively signing a credential.
- **Session Management:** `iron-session` is used to encrypt session data in HTTP-only cookies, preventing Cross-Site Scripting (XSS) from accessing session tokens.
- **Role-Based Access Control (RBAC):** API routes and page layouts are protected by strict role checks (`requireRole`), ensuring students cannot access institution endpoints and vice versa.
