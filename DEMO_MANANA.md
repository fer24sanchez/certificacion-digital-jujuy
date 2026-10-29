# Plan B: demostración local para la exposición

Este flujo demuestra el mismo contrato, emisión y verificación que Amoy, pero sin usar fondos, claves privadas ni Internet. La blockchain corre temporalmente en la notebook.

Abrí tres terminales en la carpeta del proyecto.

## Terminal 1 — blockchain local

```powershell
npm run node
```

Dejala abierta durante toda la demostración.

## Terminal 2 — emitir el certificado

```powershell
$env:DEMO_RECIPIENT = "0x4C510A2649366400cA45A446dF82f83Be46409d6"
npm run demo:local
```

Copiá la dirección de contrato que imprime el comando.

## Terminal 3 — verificador web

En `web/config.js`, reemplazá temporalmente los valores por:

```js
rpcUrl: "http://127.0.0.1:8545",
chainId: 31337,
contractAddress: "PEGAR_AQUI_LA_DIRECCION_DEL_CONTRATO",
explorerUrl: ""
```

Luego ejecutá:

```powershell
npm run serve:web
```

Abrí `http://localhost:3000`, escribí `1` y verificá el certificado. Al terminar, restaurá `web/config.js` con los valores de Amoy.

## Cómo presentarlo

Decí explícitamente: “La demostración corre en una red local de Hardhat para evitar depender de un faucet externo; el mismo contrato ya está preparado y probado para Polygon Amoy. El despliegue en Amoy se realizará al acreditarse los POL de prueba.”
