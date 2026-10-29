const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  const Factory = await hre.ethers.getContractFactory("CertificadoEducativo");
  const certificate = await Factory.deploy(deployer.address);
  await certificate.waitForDeployment();

  console.log("Contrato desplegado:", await certificate.getAddress());
  console.log("Administrador/emisor:", deployer.address);
}

main().catch((error) => { console.error(error); process.exitCode = 1; });
