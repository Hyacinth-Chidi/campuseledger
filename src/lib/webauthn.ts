import {
  generateRegistrationOptions,
  verifyRegistrationResponse,
  generateAuthenticationOptions,
  verifyAuthenticationResponse,
} from "@simplewebauthn/server";
import type {
  RegistrationResponseJSON,
  AuthenticationResponseJSON,
} from "@simplewebauthn/server";

const RP_NAME = "CampusLedger";
const RP_ID = process.env.WEBAUTHN_RP_ID || "localhost";
const ORIGIN = process.env.WEBAUTHN_ORIGIN || "http://localhost:3000";

export interface StoredWebauthnCredential {
  credentialId: string;
  publicKey: string;
  counter: number;
  transports: string[];
}

export async function buildRegistrationOptions(params: {
  userId: string;
  email: string;
  existingCredentials: StoredWebauthnCredential[];
}) {
  return generateRegistrationOptions({
    rpName: RP_NAME,
    rpID: RP_ID,
    userName: params.email,
    userID: new TextEncoder().encode(params.userId),
    attestationType: "none",
    excludeCredentials: params.existingCredentials.map((c) => ({
      id: c.credentialId,
      transports: c.transports as AuthenticatorTransportFuture[],
    })),
    authenticatorSelection: {
      // Prefer the device's built-in fingerprint/face sensor rather than a
      // separate security key, since the goal is biometric verification.
      authenticatorAttachment: "platform",
      userVerification: "required",
      residentKey: "preferred",
    },
  });
}

export async function checkRegistrationResponse(params: {
  response: RegistrationResponseJSON;
  expectedChallenge: string;
}) {
  return verifyRegistrationResponse({
    response: params.response,
    expectedChallenge: params.expectedChallenge,
    expectedOrigin: ORIGIN,
    expectedRPID: RP_ID,
  });
}

export async function buildAuthenticationOptions(params: {
  allowCredentials: StoredWebauthnCredential[];
}) {
  return generateAuthenticationOptions({
    rpID: RP_ID,
    userVerification: "required",
    allowCredentials: params.allowCredentials.map((c) => ({
      id: c.credentialId,
      transports: c.transports as AuthenticatorTransportFuture[],
    })),
  });
}

export async function checkAuthenticationResponse(params: {
  response: AuthenticationResponseJSON;
  expectedChallenge: string;
  credential: StoredWebauthnCredential;
}) {
  return verifyAuthenticationResponse({
    response: params.response,
    expectedChallenge: params.expectedChallenge,
    expectedOrigin: ORIGIN,
    expectedRPID: RP_ID,
    credential: {
      id: params.credential.credentialId,
      publicKey: Buffer.from(params.credential.publicKey, "base64url"),
      counter: params.credential.counter,
      transports: params.credential.transports as AuthenticatorTransportFuture[],
    },
  });
}

type AuthenticatorTransportFuture =
  | "ble"
  | "hybrid"
  | "internal"
  | "nfc"
  | "usb";
