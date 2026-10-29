const ABI = [
  "function getCertificate(uint256 tokenId) view returns ((string recipientName,string program,string documentHash,uint64 issuedAt,bool revoked),address,string)",
  "function name() view returns (string)"
];

const form = document.querySelector("form");
const result = document.querySelector("#result");
const configWarning = document.querySelector("#config-warning");
const networkLabel = document.querySelector("#network-label");

if (window.CERTIFICATE_CONFIG.chainId === 31337) {
  networkLabel.textContent = "PROTOTIPO DE INVESTIGACIÓN · BLOCKCHAIN LOCAL";
}

function show(message, kind = "") {
  result.className = kind;
  result.textContent = message;
}

function formatDate(seconds) {
  return new Intl.DateTimeFormat("es-AR", { dateStyle: "long", timeStyle: "short" })
    .format(new Date(Number(seconds) * 1000));
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const tokenId = document.querySelector("#token-id").value.trim();
  if (!window.CERTIFICATE_CONFIG.contractAddress) {
    show("Configuración pendiente: ingresá la dirección del contrato en web/config.js.", "error");
    return;
  }

  show("Consultando la blockchain…");
  try {
    const provider = new ethers.JsonRpcProvider(window.CERTIFICATE_CONFIG.rpcUrl);
    const contract = new ethers.Contract(window.CERTIFICATE_CONFIG.contractAddress, ABI, provider);
    const [certificate, recipient, metadataUri] = await contract.getCertificate(tokenId);
    const explorer = window.CERTIFICATE_CONFIG.explorerUrl
      ? `${window.CERTIFICATE_CONFIG.explorerUrl}/token/${window.CERTIFICATE_CONFIG.contractAddress}?a=${tokenId}`
      : "";
    result.className = certificate.revoked ? "revoked" : "valid";
    result.innerHTML = `
      <h2>${certificate.revoked ? "Certificado revocado" : "Certificado válido"}</h2>
      <dl>
        <dt>Nombre</dt><dd>${escapeHtml(certificate.recipientName)}</dd>
        <dt>Trayecto / programa</dt><dd>${escapeHtml(certificate.program)}</dd>
        <dt>Titular blockchain</dt><dd class="mono">${recipient}</dd>
        <dt>Fecha de emisión</dt><dd>${formatDate(certificate.issuedAt)}</dd>
        <dt>Huella del documento</dt><dd class="mono">${escapeHtml(certificate.documentHash)}</dd>
        <dt>Metadata</dt><dd>${metadataUri ? `<a href="${escapeAttribute(metadataUri)}" target="_blank" rel="noreferrer">Ver metadata</a>` : "No declarada"}</dd>
      </dl>
      ${explorer ? `<a class="explorer" href="${explorer}" target="_blank" rel="noreferrer">Ver transacción / NFT en PolygonScan ↗</a>` : `<p class="local-note">Verificación realizada en la blockchain local de demostración.</p>`}`;
  } catch (error) {
    console.error(error);
    show("No se encontró un certificado con ese ID o no se pudo consultar la red.", "error");
  }
});

function escapeHtml(value) {
  const element = document.createElement("span");
  element.textContent = value;
  return element.innerHTML;
}

function escapeAttribute(value) { return encodeURI(value).replace(/"/g, "%22"); }

if (!window.CERTIFICATE_CONFIG.contractAddress) configWarning.hidden = false;
