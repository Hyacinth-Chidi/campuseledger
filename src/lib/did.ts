import { connectDB } from "@/lib/mongodb";
import { DIDDocument } from "@/models/DIDDocument";
import { generateEdKeyPair, shortKeyId } from "@/lib/keys";
import { encryptKey } from "@/lib/crypto";
import type { Types } from "mongoose";

/**
 * Creates a decentralized identifier for a student: generates a fresh
 * Ed25519 keypair, derives a DID string from the public key, and persists
 * the DID document. This is a simplified `did:key`-style method
 * (did:cledger:<key-id>) rather than a spec-exact implementation — the
 * underlying idea is identical: the identifier is self-certifying and
 * derived from the key itself, not issued by a central registry.
 */
export async function createDIDForUser(ownerId: Types.ObjectId | string) {
  await connectDB();

  const { publicKeyJwk, privateKeyJwk } = await generateEdKeyPair();
  const keyId = await shortKeyId(publicKeyJwk);
  const did = `did:cledger:${keyId}`;

  const doc = await DIDDocument.create({
    did,
    ownerId,
    publicKey: publicKeyJwk,
    privateKey: encryptKey(privateKeyJwk),
  });

  return doc;
}

export async function resolveDID(did: string) {
  await connectDB();
  return DIDDocument.findOne({ did });
}

export async function getDIDByOwner(ownerId: Types.ObjectId | string) {
  await connectDB();
  return DIDDocument.findOne({ ownerId });
}
