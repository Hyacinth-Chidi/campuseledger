import { SignJWT, jwtVerify } from "jose";
import { importPrivateKeyEncrypted, importPublicKey } from "@/lib/keys";

export interface CredentialClaims {
  [key: string]: string | number | boolean | null;
}

export interface IssueCredentialInput {
  issuerDID: string; // institution's identifier string, embedded as `iss`
  issuerPrivateKeyJwk: string;
  holderDID: string; // student's DID, embedded as `sub`
  credentialType: string;
  title: string;
  claims: CredentialClaims;
}

/**
 * Signs a JWT-based Verifiable Credential. The signature is what lets any
 * verifier (an employer) check authenticity without contacting the
 * institution directly — trust is cryptographic, not a phone call.
 */
export async function issueCredentialJWT(input: IssueCredentialInput) {
  const privateKey = await importPrivateKeyEncrypted(input.issuerPrivateKeyJwk);

  const jwt = await new SignJWT({
    vc: {
      credentialType: input.credentialType,
      title: input.title,
      claims: input.claims,
    },
  })
    .setProtectedHeader({ alg: "EdDSA", typ: "JWT" })
    .setIssuer(input.issuerDID)
    .setSubject(input.holderDID)
    .setIssuedAt()
    .sign(privateKey);

  return jwt;
}

export interface VerifyCredentialResult {
  valid: boolean;
  reason?: string;
  payload?: Record<string, unknown>;
}

/**
 * Verifies a credential's signature against the issuing institution's
 * public key. Signature validity is checked here; revocation status is
 * checked separately against the Credential collection by the caller.
 */
export async function verifyCredentialJWT(
  jwt: string,
  issuerPublicKeyJwk: string
): Promise<VerifyCredentialResult> {
  try {
    const publicKey = await importPublicKey(issuerPublicKeyJwk);
    const { payload } = await jwtVerify(jwt, publicKey);
    return { valid: true, payload: payload as Record<string, unknown> };
  } catch (err) {
    return {
      valid: false,
      reason: err instanceof Error ? err.message : "Signature verification failed",
    };
  }
}
