import { Args, GrpcProvider, JsonRPCClient } from "@massalabs/massa-web3";
import { useEffect, useState } from "react";
import { MassaLogo } from "@massalabs/react-ui-kit";
import "./App.css";

const sc_addr = "AS125Y3UWiMoEx3w71jf7iq1RwkxXdwkEVdoucBTAmvyzGh2KUqXS";

/**
 * The key used to store the greeting in the smart contract
 */
const KEY =
  "PAIR_INFORMATION::AS12N76WPYB3QNYKGhV2jZuQs1djdhNJLQgnm7m52pHWecvvj1fCQ:AS12upNRkQ2L1UEfZRR1b5vfrpbc9eea8pu3cCiC1nh2F1uYnsMnz:25";

/**
 * App component that handles interactions with a Massa smart contract
 * @returns The rendered component
 */
function App() {
  /**
   * Initialize the web3 client
   */
  const client = JsonRPCClient.buildnet();
  const grpcClient = GrpcProvider.buildnet();

  /**
   * Fetch the greeting when the web3 client is initialized
   */
  useEffect(() => {
    getGreetingJSON();
    getGreetingGRPC();
  }, []);

  const dec = (bytes: Uint8Array) => {
    const args = new Args(bytes);

    const binStep = args.nextU32();
    const LBPair = args.nextString();
    const createdByOwner = args.nextBool();
    const isBlacklisted = args.nextBool();
    const res = { binStep, LBPair, createdByOwner, isBlacklisted };
    return res;
  };

  /**
   * Function to get the current greeting from the smart contract
   */
  async function getGreetingJSON() {
    if (client) {
      const dataStoreVal = await client.getDatastoreEntry(KEY, sc_addr, false);

      console.log("JSON response", dataStoreVal);

      const greetingDecoded = dataStoreVal ? dec(dataStoreVal) : null;
      console.log("Greeting from JSON:", greetingDecoded);
    }
  }

  async function getGreetingGRPC() {
    if (client) {
      const dataStoreVal = await grpcClient
        .readStorage(sc_addr, [KEY], false)
        .then((res) => res[0]); // dataStoreVal is an array, we take the first element
      if (!dataStoreVal?.length)
        throw new Error("No data found for the given key");

      console.log("GRPC response", dataStoreVal);

      const greetingDecoded = dataStoreVal ? dec(dataStoreVal) : null;
      console.log("Greeting from GRPC:", greetingDecoded);
    }
  }

  return (
    <>
      <div>
        <MassaLogo className="logo" size={100} />
        <div>Open console</div>
      </div>
    </>
  );
}

export default App;
