# Database Design

## 1. Overview
CampusLedger uses MongoDB, a NoSQL document database, interacting with it via the Mongoose Object Data Modeling (ODM) library. The schema design embraces a flexible, document-oriented approach while enforcing strict relational integrity where necessary (e.g., tying credentials to specific institutions and students).

## 2. Core Collections

### 2.1. Users Collection (`User`)
The `User` collection is a unified model that handles multiple roles within the system: `admin`, `institution`, and `student`. This approach simplifies authentication and session management while using role-based fields for specific entity types.

**Key Fields:**
- `role` (String, Required): Enum of `["student", "institution", "admin"]`.
- `email` (String, Required, Unique): Primary identifier.
- `passwordHash` (String, Optional): Used for institution/admin logins.

**Student-Specific Fields:**
- `name` (String): Full name of the student.
- `studentIdNumber` (String): Institutional identifier (e.g., Matriculation number).
- `institutionId` (ObjectId, Ref: `User`): A relational reference to the institution that invited the student.
- `didId` (ObjectId, Ref: `DIDDocument`): A relational reference to the student's decentralized identity document.
- `status` (String): Enum of `["invited", "active"]`.
- `webauthnCredentials` (Array of Subdocuments): Stores public keys and metadata for biometric passkeys.
  - Subdocument fields: `credentialId` (Base64url), `publicKey` (Base64url), `counter` (Number).

**Institution-Specific Fields:**
- `institutionName` (String): Official name of the university/organization.
- `approved` (Boolean): Master toggle for admins to vet and approve institutions.
- `suspended` (Boolean): Flag to revoke an institution's access.
- `signingPublicKey` (String): Public key used by third-parties to verify signatures.
- `signingPrivateKey` (String, Encrypted): Private key used to sign credentials (never sent to the client).

### 2.2. Credentials Collection (`Credential`)
This collection stores the actual verifiable credentials issued to students.

**Key Fields:**
- `issuerId` (ObjectId, Ref: `User`, Required): The institution that issued the credential.
- `holderId` (ObjectId, Ref: `User`, Required): The student receiving the credential.
- `holderDID` (String, Required): The decentralized identifier string mapped to the student.
- `credentialType` (String, Required): Classification (e.g., "Degree", "Transcript").
- `title` (String, Required): Human-readable title (e.g., "B.Sc. Computer Science").
- `claims` (Mixed Object, Required): The dynamic payload of the credential (e.g., GPA, graduation date, honors).
- `jwt` (String, Required): The cryptographically signed JSON Web Token representing the Verifiable Credential.
- `status` (String): Enum of `["active", "revoked"]`.
- `revokedAt` (Date) / `revokedReason` (String): Audit trail if a credential is invalidated by the institution.

### 2.3. Decentralized Identifiers Collection (`DIDDocument`)
Stores the cryptographic identity infrastructure for users (primarily students in this architecture).

**Key Fields:**
- `did` (String, Required, Unique): The standard DID URI (e.g., `did:key:z6Mk...`).
- `ownerId` (ObjectId, Ref: `User`, Required, Unique): The user this identity belongs to.
- `publicKey` (String, Required): The public key material.
- `privateKey` (String, Required, Encrypted): Encrypted private key material.

## 3. Entity Relationships
- **Institution (1) -> (N) Students:** An institution can invite and manage multiple students. (Stored via `User.institutionId`).
- **Institution (1) -> (N) Credentials:** An institution issues multiple credentials over time. (Stored via `Credential.issuerId`).
- **Student (1) -> (N) Credentials:** A student can hold multiple credentials in their digital wallet. (Stored via `Credential.holderId`).
- **Student (1) -> (1) DID Document:** Each student is uniquely mapped to one Decentralized Identity profile. (Stored via `DIDDocument.ownerId` and `User.didId`).
