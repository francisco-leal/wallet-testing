import {
  useAccount,
  useConnect,
  useDisconnect,
  useSignMessage,
  useSwitchChain,
} from "wagmi";
import { base, baseSepolia } from "viem/chains";
import { useState } from "react";
import { verifyMessage } from "@wagmi/core";
import { config } from "./wagmi";

function App() {
  const account = useAccount();
  const { connectors, connect, status, error } = useConnect();
  const { disconnect } = useDisconnect();
  const { switchChain } = useSwitchChain();
  const { signMessageAsync } = useSignMessage();
  const [signature, setSignature] = useState<`0x${string}` | null>(null);
  const [result, setResult] = useState<boolean | null>(null);

  const handleSignMessage = async () => {
    const signature = await signMessageAsync({
      message: `Signing message from: ${account.address} on chain ${account.chain?.name}`,
    });
    setSignature(signature);
    setResult(null);
  };

  const validateSignature = async () => {
    if (!account.address) return;
    if (!signature) return;

    const result = await verifyMessage(config, {
      address: account.address,
      message: `Signing message from: ${account.address} on chain ${account.chain?.name}`,
      signature,
    });

    console.log(result);
    setResult(result);
  };

  return (
    <>
      <div>
        <h2>Account</h2>

        <div>
          status: {account.status}
          <br />
          addresses: {JSON.stringify(account.addresses)}
          <br />
          chainId: {account.chainId}
        </div>

        {account.status === "connected" && (
          <button type="button" onClick={() => disconnect()}>
            Disconnect
          </button>
        )}
      </div>

      <div>
        <h2>Connect</h2>
        {connectors.map((connector) => (
          <button
            key={connector.uid}
            onClick={() => connect({ connector })}
            type="button"
          >
            {connector.name}
          </button>
        ))}
        <div>{status}</div>
        <div>{error?.message}</div>
      </div>

      <div>
        <h2>Switch Chain - current chainId: {account.chain?.name}</h2>
        <button onClick={() => switchChain({ chainId: baseSepolia.id })}>
          Switch to Base Sepolia
        </button>
        <button onClick={() => switchChain({ chainId: base.id })}>
          Switch to Base
        </button>
      </div>

      <div>
        <h2>Sign Message</h2>
        <button onClick={handleSignMessage} disabled={!account.address}>
          Sign Message
        </button>
        <button onClick={validateSignature} disabled={!signature}>
          Validate Signature
        </button>
        {result !== null && (
          <div>{result ? "Signature is valid" : "Signature is invalid"}</div>
        )}
      </div>
    </>
  );
}

export default App;
