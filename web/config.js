// Completar contractAddress con la dirección resultante de `npm run deploy:amoy`.
const amoyConfig = {
  rpcUrl: "https://polygon-amoy-bor-rpc.publicnode.com",
  chainId: 80002,
  contractAddress: "",
  explorerUrl: "https://amoy.polygonscan.com"
};

// Modo de contingencia para la exposición: usa `?network=local` en la URL.
// Hardhat usa esta dirección al desplegar el primer contrato en una red local nueva.
const localConfig = {
  rpcUrl: "http://127.0.0.1:8545",
  chainId: 31337,
  contractAddress: "0x5fbdb2315678afecb367f032d93f642f64180aa3",
  explorerUrl: ""
};

const isLocalDemo = new URLSearchParams(window.location.search).get("network") === "local";
window.CERTIFICATE_CONFIG = isLocalDemo ? localConfig : amoyConfig;
