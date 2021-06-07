# Project-Apollo


<img src="./Images/logo.png" width="1000">

# Table of Contents:

- [Project-Apollo](#project-apollo)
- [Table of Contents:](#table-of-contents)
- [Introduction:](#introduction)
- [Solution:](#solution)
- [Diagrams:](#diagrams)
  - [Software:](#software)
  - [Hardware:](#hardware)
- [Solana Cluster:](#solana-cluster)
  - [Transaction Signatures:](#transaction-signatures)
- [Platform:](#platform)
  - [Elements:](#elements)
    - [Check product:](#check-product)
    - [Add Trace:](#add-trace)
- [Device:](#device)
- [Demo:](#demo)

# Introduction:



# Solution:



# Diagrams:
## Software:

<img src="./Images/plat.png">

## Hardware:

<img src="./Images/hw.png">

# Solana Cluster:

El cluster de solana se hizo correr en una maquina virtual de EC2, toda la configuracion y codigo esta en la carpeta Server.

<img src="./Images/server.png">

Para colocar la informacion en la blockchain utilizamos un on-chain program.

Esta es la Program Account si gustan revisarla:
[Eq7k6ETwxnWP2KMdtUdAC5mvUmqCG67XiawFZwfFd8EY](https://explorer.solana.com/address/Eq7k6ETwxnWP2KMdtUdAC5mvUmqCG67XiawFZwfFd8EY?cluster=devnet)

Y para poder interactuar con el y el codigo on-chain se realizo un servidor express con NodeJS, conectado directamente a nuestra API Gateway.

    const express = require("express");
    const app = express();
    const port = 8080; // default port to listen

    // Define a route handler to add new trace 
    app.get("/api", (req, res) => {
      main(req.headers.name,req.headers.loc).then((hash) => {
        res.send(hash)
      });
    });

    // Test Route

    app.get("/", (req, res) => {
        res.send("Hello Solana!")
    });

    // start the Express server
    app.listen(port, () => {
      console.log(`server started at http://localhost:${port}`);
    });

Para acceder a el desde la misma API Gateway realizamos un puente entre el servidor y API Gateway.

    import json
    import http.client

    def lambda_handler(event, context):
        conn = http.client.HTTPConnection("ec2-xxx-xxx-xxx-xxx.compute-1.amazonaws.com", 8080)
        payload = ''
        headers = {
        }
        conn.request("GET", "/", payload, headers)
        res = conn.getresponse()
        data = res.read()
        return {
            'statusCode': 200,
            'body': json.dumps(data.decode("utf-8"))
        }

Aqui una muestra de el servidor funcionando.

<img src="./Images/serv-test.png">

## Transaction Signatures:

En este caso estamos asignando un address a cada medicamento con el fin de poderlo trazar a travez de la blockchain.

<img src="./Images/med1.png">

Aqui podemos ver el registro en el explorador.

[7nuexkNtPjejALaQjr4rxbkyZ6tMm5qE3BtRBbN17gTs](https://explorer.solana.com/address/7nuexkNtPjejALaQjr4rxbkyZ6tMm5qE3BtRBbN17gTs?cluster=devnet)

Aqui lo que nos interesa son los Transaction Signatures, ya que en cada una de estas sigatures esta cifrada la localizacion en latitude y longitude del producto cada vez que alguien agrego un trace.

<img src="./Images/trace.png">

Aqui la data que almacenamos.

<img src="./Images/data.png">

Las transactions signatures contienen los datos mandados a la blockchain, a travez de la API de Solana Explorer, nosotros somos capaces de obtener estos datos en codigo para añadirlosa nuestro programa.

- Signatures:

<img src="./Images/sign1.png">

- Data from each Siganture:

<img src="./Images/sign2.png">

Todo esto se agrego a nuestra API para comunicarse directamente con la pagina web.

<img src="./Images/address.png">

# Platform:
## Elements:

<img src="./Images/platform1.png">

### Check product:

Al presionar el boton aparecera un lector de QR, el cual es compatible con mobile y desktop.

<img src="./Images/qr.png">

En la version mobile debido a que algunos celulares tienen como deafult la camara frontal, se agrego un selector de camara.

<img src="./Images/mobile-qr.png" height="400px" >

Una vez se ha hecho la lectura del producto, podremos ver la informacion de trace, siempre se mostrara en el mapa el lugar de la ultimo trace agregado, ademas de los datos de trace se mostrara informacion del producto.

<img src="./Images/qr-product.png">

### Add Trace:

La funcion de Add Trace solo esta habiliatada una vez se ha loggeado el intermediario que recibe la medicina.

<img src="./Images/logged.png">

Puedes habilitar esta funcion mediante el siguiente user y password.

    User:apolloprojectchain@gmail.com
    Password:toor

Para agregar un trace, primero deberemos escanear un producto.

<img src="./Images/qr-log.png">

Los datos que veremos seran los mismos que en [Check product](#check-product) sin embargo podremos ver los datos del sensor en tiempo real, para ver las coondiciones del producto al recibirlo.

<img src="./Images/iot.png">



# Device:

# Demo:


