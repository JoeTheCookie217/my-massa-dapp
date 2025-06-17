import { bytesToStr, GrpcProvider, JsonRPCClient } from "@massalabs/massa-web3";
import { useEffect, useState } from "react";
import { MassaLogo } from "@massalabs/react-ui-kit";
import "./App.css";

const sc_addr = "AS121byc9dBwjbeREk4rzUZisFyfMkdZ1Uhtcnm6n6s5hnCX6fsHc"; // TODO Update with your deployed contract address

/**
 * The key used to store the greeting in the smart contract
 */
const GREETING_KEY = "greeting_key";

/**
 * App component that handles interactions with a Massa smart contract
 * @returns The rendered component
 */
function App() {
  const [greetingJSON, setGreetingJSON] = useState<string | null>(null);
  const [greetingGRPC, setGreetingGRPC] = useState<string | null>(null);

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

  /**
   * Function to get the current greeting from the smart contract
   */
  async function getGreetingJSON() {
    if (client) {
      console.time("getGreetingJSON");
      const dataStoreVal = await client.getDatastoreEntry(
        GREETING_KEY,
        sc_addr,
        false
      );
      console.timeEnd("getGreetingJSON");
      const greetingDecoded = dataStoreVal ? bytesToStr(dataStoreVal) : null;
      console.log("Greeting from JSON:", greetingDecoded);
      setGreetingJSON(greetingDecoded);
    }
  }

  async function getGreetingGRPC() {
    if (client) {
      console.time("getGreetingGRPC");
      const dataStoreVal = await grpcClient
        .readStorage(sc_addr, [GREETING_KEY], false)
        .then((res) => res[0]); // dataStoreVal is an array, we take the first element
      console.timeEnd("getGreetingGRPC");
      if (!dataStoreVal?.length)
        throw new Error("No data found for the given key");

      const greetingDecoded = dataStoreVal ? bytesToStr(dataStoreVal) : null;
      console.log("Greeting from GRPC:", greetingDecoded);
      setGreetingGRPC(greetingDecoded);
    }
  }

  return (
    <>
      <div>
        <MassaLogo className="logo" size={100} />
        <div>
          <h2>Greeting message JSON:</h2>
          <h1>{greetingJSON}</h1>
        </div>
        <div>
          <h2>Greeting message GRPC:</h2>
          <h1>{greetingGRPC}</h1>
        </div>
      </div>
    </>
  );
}

export default App;
