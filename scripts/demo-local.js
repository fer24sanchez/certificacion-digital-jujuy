const hre = require("hardhat");

const recipient = process.env.DEMO_RECIPIENT;

async function main() {
  if (!recipient) {
    throw new Error("Definí DEMO_RECIPIENT con la dirección pública que recibirá el certificado.");
  }

  const [issuer] = await hre.ethers.getSigners();
  const Factory = await hre.ethers.getContractFactory("CertificadoEducativo");
  const certificate = await Factory.deploy(issuer.address);
  await certificate.waitForDeployment();

  const transaction = await certificate.issueCertificate(
    recipient,
    "Fernando Daniel Sanchez",
    "Certificado de asistencia — Jóvenes Investigadores en Acción — 29/10/2026 — UCSE Sede Jujuy",
    "sha256:2E567E27239B6F84323187C37124DDB8142AD3B3A040B2A345DC82D406E4AECD",
    ""
  );
  await transaction.wait();

  console.log("Demo local lista");
  console.log("Contrato:", await certificate.getAddress());
  console.log("Token ID: 1");
  console.log("Destinatario:", recipient);
}

main().catch((error) => { console.error(error); process.exitCode = 1; });
