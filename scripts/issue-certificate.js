const hre = require("hardhat");

const required = ["CONTRACT_ADDRESS", "RECIPIENT", "RECIPIENT_NAME", "PROGRAM", "DOCUMENT_HASH"];

async function main() {
  const missing = required.filter((key) => !process.env[key]);
  if (missing.length) throw new Error(`Faltan variables: ${missing.join(", ")}`);

  const certificate = await hre.ethers.getContractAt(
    "CertificadoEducativo",
    process.env.CONTRACT_ADDRESS
  );
  const transaction = await certificate.issueCertificate(
    process.env.RECIPIENT,
    process.env.RECIPIENT_NAME,
    process.env.PROGRAM,
    process.env.DOCUMENT_HASH,
    process.env.METADATA_URI || ""
  );
  console.log("Transaccion enviada:", transaction.hash);
  const receipt = await transaction.wait();
  const event = receipt.logs
    .map((log) => { try { return certificate.interface.parseLog(log); } catch { return null; } })
    .find((log) => log?.name === "CertificateIssued");
  console.log("Certificado emitido. Token ID:", event.args.tokenId.toString());
}

main().catch((error) => { console.error(error); process.exitCode = 1; });
