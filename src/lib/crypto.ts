import { randomBytes, createCipheriv, createDecipheriv } from "crypto";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 12;
const AUTH_TAG_LENGTH = 16;
const PREFIX = "enc:";

function getKey(): Buffer {
  const hex = process.env.KEY_ENCRYPTION_KEY;
  if (!hex || hex.length !== 64) {
    throw new Error(
      "KEY_ENCRYPTION_KEY must be a 64-character hex string (32 bytes). " +
        "Generate one with: node -e \"console.log(require('crypto').randomBytes(32).toString('hex'))\""
    );
  }
  return Buffer.from(hex, "hex");
}

/**
 * Encrypts a plaintext string with AES-256-GCM.
 * Output format: "enc:<iv_hex>:<authTag_hex>:<ciphertext_hex>"
 */
export function encryptKey(plaintext: string): string {
  const key = getKey();
  const iv = randomBytes(IV_LENGTH);
  const cipher = createCipheriv(ALGORITHM, key, iv, { authTagLength: AUTH_TAG_LENGTH });

  let encrypted = cipher.update(plaintext, "utf8", "hex");
  encrypted += cipher.final("hex");
  const authTag = cipher.getAuthTag().toString("hex");

  return `${PREFIX}${iv.toString("hex")}:${authTag}:${encrypted}`;
}

/**
 * Decrypts a ciphertext string produced by `encryptKey`.
 * Also transparently handles legacy plaintext values (not prefixed with "enc:").
 */
export function decryptKey(cipherOrPlain: string): string {
  if (!cipherOrPlain.startsWith(PREFIX)) {
    // Legacy plaintext — return as-is
    return cipherOrPlain;
  }

  const key = getKey();
  const payload = cipherOrPlain.slice(PREFIX.length);
  const [ivHex, authTagHex, ciphertextHex] = payload.split(":");

  if (!ivHex || !authTagHex || !ciphertextHex) {
    throw new Error("Malformed encrypted key payload");
  }

  const iv = Buffer.from(ivHex, "hex");
  const decipher = createDecipheriv(ALGORITHM, key, iv, {
    authTagLength: AUTH_TAG_LENGTH,
  });
  decipher.setAuthTag(Buffer.from(authTagHex, "hex"));

  let decrypted = decipher.update(ciphertextHex, "hex", "utf8");
  decrypted += decipher.final("utf8");

  return decrypted;
}
