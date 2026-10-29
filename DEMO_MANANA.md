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

No hace falta modificar ningún archivo. Ejecutá:

```powershell
npm run serve:web
```

Abrí `http://localhost:3000/web/?network=local`, escribí `1` y verificá el certificado. La URL activa el modo local y usa la dirección predecible del primer contrato desplegado por Hardhat. Este modo carga `ethers` desde las dependencias ya instaladas, por lo que no depende de Internet.

## Cómo presentarlo

Decí explícitamente: “La demostración corre en una red local de Hardhat para evitar depender de un faucet externo; el mismo contrato ya está preparado y probado para Polygon Amoy. El despliegue en Amoy se realizará al acreditarse los POL de prueba.”
