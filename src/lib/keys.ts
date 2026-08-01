import { generateKeyPair, exportJWK, importJWK, type JWK } from "jose";
import { decryptKey } from "@/lib/crypto";

/**
 * Generates an Ed25519 (EdDSA) keypair, exported as JWKs (JSON strings) so
 * they can be stored directly in MongoDB and re-imported whenever we need
 * to sign or verify something.
 */
export async function generateEdKeyPair() {
  const { publicKey, privateKey } = await generateKeyPair("EdDSA", {
    crv: "Ed25519",
    extractable: true,
  });

  const publicJwk = await exportJWK(publicKey);
  const privateJwk = await exportJWK(privateKey);

  return {
    publicKeyJwk: JSON.stringify(publicJwk),
    privateKeyJwk: JSON.stringify(privateJwk),
  };
}

export async function importPublicKey(jwkString: string) {
  const jwk = JSON.parse(jwkString) as JWK;
  return importJWK(jwk, "EdDSA");
}

export async function importPrivateKey(jwkString: string) {
  const jwk = JSON.parse(jwkString) as JWK;
  return importJWK(jwk, "EdDSA");
}

/**
 * Imports a private key that may be AES-256-GCM encrypted (prefixed with "enc:").
 * Transparently handles both encrypted and legacy plaintext JWK strings.
 */
export async function importPrivateKeyEncrypted(cipherOrPlain: string) {
  const plainJwk = decryptKey(cipherOrPlain);
  return importPrivateKey(plainJwk);
}

/**
 * Derives a short, stable, non-reversible id from a public key JWK so
 * different keys never collide in a DID string. Not a full JWK thumbprint
 * spec implementation — sufficient for uniqueness in this project.
 */
export async function shortKeyId(jwkString: string) {
  const jwk = JSON.parse(jwkString) as JWK;
  const data = new TextEncoder().encode(jwk.x ?? JSON.stringify(jwk));
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Buffer.from(digest).toString("base64url").slice(0, 22);
}
