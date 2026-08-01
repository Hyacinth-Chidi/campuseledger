# Project Structure

CampusLedger is built using the Next.js 15 App Router. The codebase follows a highly organized, modular structure separating UI components, business logic, database models, and API routes.

## Directory Overview

```text
src/
├── app/                  # Next.js App Router (Pages, Layouts, API Routes)
├── components/           # React Components (UI, Shared, Role-specific)
├── lib/                  # Utility Functions, Crypto logic, DB connection
├── models/               # Mongoose Database Schemas
├── proxy.ts              # Proxy server configuration (if applicable)
└── scripts/              # Standalone utility scripts (e.g., database seeding)
```

## 1. The `app/` Directory (Routing & Controllers)
The `app` directory contains all route definitions. It is divided functionally by user role and feature set:

- **`app/admin/`**: Super admin portal for vetting institutions.
- **`app/institution/`**: The issuer portal. Contains dashboards for inviting students (`dashboard/students`), issuing credentials (`dashboard/issue`), and viewing issuance history. Includes its own login and signup flows.
- **`app/student/`**: The holder portal. Contains the secure biometric login flow, account activation (`activate/[token]`), the digital wallet dashboard (`dashboard/credentials`), security settings (`dashboard/security`), and credential sharing logic.
- **`app/verify/`**: The public-facing verification portal where third parties can scan QR codes or enter credential IDs to verify cryptographically signed claims.
- **`app/api/`**: The backend REST-like endpoints (Route Handlers).
  - `api/auth/`: Handles traditional login/logout and all WebAuthn/FIDO2 flows (`register-options`, `auth-options`, etc.).
  - `api/credentials/`: Endpoints for issuing and revoking JWT-signed credentials.
  - `api/institutions/` & `api/admin/`: Endpoints for institution signup and admin approvals.
  - `api/students/`: Logic for inviting students, which generates DIDs and sends emails.

## 2. The `components/` Directory (Presentation)
Separated into logical buckets to keep the UI modular:

- **`components/ui/`**: Base UI elements built on Radix UI and styled with Tailwind CSS (e.g., `button.tsx`, `dialog.tsx`, `input.tsx`). These are pure, stateless presentation components.
- **`components/shared/`**: Components used across multiple portals, such as the `AuthShell`, `Navbar`, `QRScanner`, and `dashboard-nav`.
- **`components/admin/`, `components/institution/`, `components/student/`**: Role-specific layout components like sidebars and dashboard shells.

## 3. The `lib/` Directory (Business Logic & Core Systems)
This directory houses the complex business logic that powers the decentralized architecture:

- **`crypto.ts` & `keys.ts`**: Core cryptographic functions for AES-256-GCM encryption/decryption of private keys stored in the database.
- **`credentials.ts`**: Wraps the `jose` library to handle the actual creation, signing (JWS), and verification of the Verifiable Credentials.
- **`did.ts`**: Logic for generating key pairs and creating Decentralized Identifier (DID) documents.
- **`webauthn.ts`**: Server-side WebAuthn configuration and verification helpers.
- **`session.ts` & `authGuard.ts`**: Iron-Session configuration and role-based access control wrappers for API routes.
- **`email.ts`**: Handles dispatching invitation and activation emails.
- **`mongodb.ts`**: Database connection caching and initialization.

## 4. The `models/` Directory (Data Layer)
Contains the Mongoose schemas defining the MongoDB database structure:

- **`User.ts`**: The unified collection for Admins, Institutions, and Students.
- **`Credential.ts`**: Stores the Verifiable Credentials and their revocation status.
- **`DIDDocument.ts`**: Stores the public keys and encrypted private keys for the decentralized identities.
- **`AuditLog.ts`**: Tracks critical actions (e.g., credential issuance, institution approval) for security and auditing purposes.

## 5. Security & Environment Configuration
The project relies heavily on environment variables (`.env`) to manage secrets, which include:
- `MONGODB_URI`: Database connection string.
- `SESSION_SECRET`: Complex string used by `iron-session` to encrypt cookies.
- `KEY_ENCRYPTION_KEY`: A 32-byte hex string used to encrypt DID private keys via AES-256-GCM before saving them to MongoDB.
- `WEBAUTHN_RP_ID` & `WEBAUTHN_RP_NAME`: Relying Party configurations to bind biometric passkeys strictly to the deployment domain.
