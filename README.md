# CampusLedger

A decentralized identity verification system for students, built with Next.js 16, MongoDB/Mongoose, and shadcn/ui.

## Stack

- Next.js 16 (App Router) — fullstack
- MongoDB + Mongoose
- shadcn/ui (Radix + Tailwind v4)
- `jose` — signs/verifies JWT-based Verifiable Credentials (Ed25519)
- `@simplewebauthn` — biometric login (fingerprint/Face ID) for students
- `qrcode` — credential sharing
- `iron-session` — cookie sessions

## Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Set up MongoDB**
   Use a local MongoDB instance or a free MongoDB Atlas cluster.

3. **Environment variables**
   Copy `.env.example` to `.env` and fill in the values:
   ```bash
   cp .env.example .env
   ```
   - `MONGODB_URI` — your connection string
   - `SESSION_SECRET` — any random string, at least 32 characters
   - `WEBAUTHN_RP_ID` / `WEBAUTHN_ORIGIN` — leave as `localhost` / `http://localhost:3000` for local dev
   - `ADMIN_SEED_EMAIL` / `ADMIN_SEED_PASSWORD` — credentials for the first admin account

4. **Seed the first admin account** (admins can't self-signup — this is the one manual bootstrapping step)
   ```bash
   npm run seed:admin
   ```

5. **Run the dev server**
   ```bash
   npm run dev
   ```
   Visit `http://localhost:3000`.

## How to test each role

1. **Admin** — log in at `/admin/login` with your seeded credentials.
2. **Institution** — sign up at `/institution/signup`, then approve it from the admin dashboard, then log in.
3. **Student** — from the institution dashboard's "Students" page, invite a student. This generates their DID and an activation link (shown directly in the UI — no real email service is wired up). Open that link to set a password, then optionally register a fingerprint/Face ID on the Security page.
4. **Issue a credential** — from the institution dashboard's "Issue credential" page, select the student and fill in a title/claims.
5. **Employer** — sign up at `/employer/signup` (active immediately, no approval needed). Go to the student's dashboard → a credential → "Share" to get its credential ID, then paste that ID into the employer's "Verify" page.

## Notes on biometric login (WebAuthn)

WebAuthn requires either `localhost` or a real HTTPS domain — it will not work over plain HTTP on a non-localhost address. It also only works with a platform authenticator available on your device (Touch ID, Windows Hello, Android fingerprint) — it won't work in a headless browser or most VMs without one configured.

## Security model notes (for your report)

- Trust is cryptographic: employers verify a signature against the issuing institution's public key rather than contacting the institution directly.
- The one deliberate centralization point is admin approval of institutions — someone has to vouch that an institution is real before it can issue credentials. This is documented as an intentional, minimal root of trust, not an oversight.
- Only credential hashes/signed payloads are ever exposed to employers; institutions never see other institutions' students, and admins only see aggregate student counts, never student PII.
