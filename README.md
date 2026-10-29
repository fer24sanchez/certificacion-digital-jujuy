# Certificación digital educativa — Jujuy

Prototipo funcional mínimo para el OE1 del proyecto de investigación: emisión y verificación pública de certificados educativos representados como NFTs no transferibles en Polygon Amoy.

## Qué demuestra

- Un contrato Solidity ERC-721 con rol de emisor, huella SHA-256 del documento, metadata, fecha y revocación.
- NFTs no transferibles: la credencial queda vinculada al titular originalmente certificado.
- Emisión reproducible desde consola.
- Una interfaz estática y pública que lee blockchain sin pedir billetera.

## Puesta en marcha

Requiere Node.js 20 o superior. Instalá dependencias y corré las pruebas locales:

```powershell
npm install
npm test
```

Para desplegar en Polygon Amoy, copiá `.env.example` como `.env`, cargá una cuenta de prueba con POL de faucet y ejecutá:

```powershell
npm run deploy:amoy
```

Copiá la dirección mostrada a `CONTRACT_ADDRESS` en `.env` y a `contractAddress` en `web/config.js`.

## Diccionario básico

### Faucet

Un **faucet** es un servicio que entrega gratuitamente pequeñas cantidades de criptomonedas de prueba. En este proyecto se utiliza para obtener **POL de prueba** en Polygon Amoy y pagar el gas necesario para desplegar el contrato o emitir un certificado. Esos POL no tienen valor económico real, solo sirven para experimentar en la red de pruebas.

## Emitir una demostración

No se suben datos personales ni el PDF a blockchain. Se registra solo una huella criptográfica. Definí las variables en tu sesión de PowerShell:

```powershell
$env:RECIPIENT = "0xDIRECCION_DE_LA_BILLETERA_DESTINATARIA"
$env:RECIPIENT_NAME = "Nombre de demostración"
$env:PROGRAM = "Certificado de participación — Mesa de Jóvenes Investigadores"
$env:DOCUMENT_HASH = "sha256:REEMPLAZAR_CON_HASH_DEL_PDF"
$env:METADATA_URI = ""
npm run issue:amoy
```

Para obtener la huella de un PDF local: `Get-FileHash -Algorithm SHA256 .\certificado-demo.pdf`.

Luego serví el verificador en local:

```powershell
npm run serve:web
```

Abrí `http://localhost:3000`, ingresá el ID devuelto por la emisión y mostrale al público la consulta y el enlace a PolygonScan.

## Guion breve de demo (90 segundos)

1. Presentar el problema: una institución necesita una forma verificable y resistente a alteraciones para acreditar certificados.
2. Explicar privacidad: el PDF no va a blockchain; se almacena su hash y los datos mínimos de la credencial.
3. Emitir un certificado demo desde consola o usar uno ya emitido para evitar demoras de red.
4. Ingresar el ID en el sitio público: se muestra titular, programa, fecha, hash y estado válido/revocado.
5. Abrir PolygonScan para evidenciar que la verificación proviene de Polygon Amoy y no de una base de datos privada.

## Límites del prototipo

Es un MVP académico: antes de producción se requiere modelo institucional de gobernanza de emisores, protección de datos, persistencia de metadata (IPFS/servidor institucional), auditoría de seguridad y evaluación con usuarios.
