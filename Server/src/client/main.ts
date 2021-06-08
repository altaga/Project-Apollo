
import {
  establishConnection,
  establishPayer,
  checkProgram,
  sendData,
  reportState,
} from './add_data';



async function main(name,location) {
  console.log("Let's send data to a Solana account...");

  // Establish connection to the cluster
  await establishConnection();

  // Determine who pays for the fees
  await establishPayer();

  // Check if the program has been deployed
  var hash = await checkProgram(name);

  // Send Data to an account
  await sendData(location);

  // Check data
  await reportState();
  return hash
}

const express = require("express");
const app = express();
const port = 8080; // default port to listen

// define a route handler for the default home page
app.get("/api", (req, res) => {
  main(req.headers.name,req.headers.loc).then((hash) => {
    res.send(hash)
  });
});

app.get("/", (req, res) => {
    res.send("Hello Solana!")
});

// start the Express server
app.listen(port, () => {
  console.log(`server started at http://localhost:${port}`);
});
