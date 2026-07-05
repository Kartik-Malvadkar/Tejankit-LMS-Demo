const QRCode = require("qrcode");
const { v4: uuidv4 } = require("uuid");

// Generates a unique, human-readable certificate ID like TJK-2026-4F9A2C
const generateCertificateId = () => {
  const year = new Date().getFullYear();
  const shortId = uuidv4().split("-")[0].toUpperCase();
  return `TJK-${year}-${shortId}`;
};

// Generates a QR code (as a data URL) that points to the public verification page
const generateQrCode = async (certificateId, clientUrl) => {
  const verifyUrl = `${clientUrl}/verify/${certificateId}`;
  const qrCodeDataUrl = await QRCode.toDataURL(verifyUrl);
  return { verifyUrl, qrCodeDataUrl };
};

module.exports = { generateCertificateId, generateQrCode };
