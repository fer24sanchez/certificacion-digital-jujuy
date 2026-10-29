const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("CertificadoEducativo", function () {
  async function deploy() {
    const [admin, recipient, outsider] = await ethers.getSigners();
    const Factory = await ethers.getContractFactory("CertificadoEducativo");
    const certificate = await Factory.deploy(admin.address);
    return { certificate, admin, recipient, outsider };
  }

  it("emite y expone un certificado verificable", async function () {
    const { certificate, recipient } = await deploy();
    await certificate.issueCertificate(
      recipient.address, "Ana Pérez", "Tecnicatura Universitaria", "sha256:abc123", "ipfs://ejemplo"
    );
    const [data, owner, uri] = await certificate.getCertificate(1);
    expect(owner).to.equal(recipient.address);
    expect(data.recipientName).to.equal("Ana Pérez");
    expect(data.revoked).to.equal(false);
    expect(uri).to.equal("ipfs://ejemplo");
  });

  it("impide transferir el certificado", async function () {
    const { certificate, recipient, outsider } = await deploy();
    await certificate.issueCertificate(recipient.address, "Ana", "Curso", "sha256:x", "");
    await expect(certificate.connect(recipient).transferFrom(recipient.address, outsider.address, 1))
      .to.be.revertedWith("Certificado no transferible");
  });

  it("solo permite revocar al emisor autorizado", async function () {
    const { certificate, recipient, outsider } = await deploy();
    await certificate.issueCertificate(recipient.address, "Ana", "Curso", "sha256:x", "");
    await expect(certificate.connect(outsider).revokeCertificate(1, "Error"))
      .to.be.reverted;
    await certificate.revokeCertificate(1, "Correccion administrativa");
    const [data] = await certificate.getCertificate(1);
    expect(data.revoked).to.equal(true);
  });
});
