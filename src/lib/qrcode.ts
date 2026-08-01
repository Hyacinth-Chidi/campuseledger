import QRCode from "qrcode";

/**
 * Generates a data URL PNG for a shareable credential presentation link.
 * The QR encodes a URL anyone can open directly, e.g.
 * https://campusledger.app/verify?cred=<credentialId>
 */
export async function generateCredentialQR(shareUrl: string) {
  return QRCode.toDataURL(shareUrl, {
    errorCorrectionLevel: "M",
    margin: 2,
    width: 320,
  });
}
