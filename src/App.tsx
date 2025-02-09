import { generateMnemonic, mnemonicToSeed } from 'bip39';
import React, { useState } from 'react'
import { derivePath } from "ed25519-hd-key";
import { Keypair } from "@solana/web3.js";
import nacl from "tweetnacl";
import { Wallet, HDNodeWallet } from "ethers";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { UnsafeBurnerWalletAdapter } from "@solana/wallet-adapter-wallets";
import {
  WalletModalProvider,
  WalletDisconnectButton,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";
import { clusterApiUrl } from "@solana/web3.js";
import Airdrop from './airdrop';

// Default styles that can be overridden by your app
import '@solana/wallet-adapter-react-ui/styles.css';

const App = () => {
  const [mnemonic, setMnemonic] = useState("");

  return (
    <ConnectionProvider endpoint={"https://api.devnet.solana.com"}>
      <WalletProvider wallets={[]} autoConnect>
        <WalletModalProvider>
          <WalletMultiButton></WalletMultiButton>
          <WalletDisconnectButton></WalletDisconnectButton>
          <h1>Creating a Web Based Wallet</h1>
          <span>Menemonic is {mnemonic}</span>


          <div>

          <h2>Airdrop</h2>

          <Airdrop/>
          </div>
          <button
            onClick={async function () {
              const mn = await generateMnemonic();
              setMnemonic(mn);
            }}
          >
            Create Seed Phrase
          </button>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}


export function SolanaWallet({ mnemonic }:{mnemonic:string}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [publicKeys, setPublicKeys] = useState([]);

  return (
    <div>
      <button
        onClick={function () {
          const seed = mnemonicToSeed(mnemonic);
          const path = `m/44'/501'/${currentIndex}'/0'`;
          const derivedSeed = derivePath(path, seed.toString("hex")).key;
          const secret = nacl.sign.keyPair.fromSeed(derivedSeed).secretKey;
          const keypair = Keypair.fromSecretKey(secret);
          setCurrentIndex(currentIndex + 1);
          setPublicKeys([...publicKeys, keypair.publicKey]);
        }}
      >
        Add wallet
      </button>
      {publicKeys.map((p) => (
        <div>{p.toBase58()}</div>
      ))}
    </div>
  );
}

export default App


const ETHWallet = ({mnemonic}: { mnemonic :string}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [addresses, setAddresses] = useState([]);
  return (
    <div>
      <button
        onClick={async function () {
          const seed = await mnemonicToSeed(mnemonic);
          const derivationPath = `m/44'/60'/${currentIndex}'/0'`;
          const hdNode = HDNodeWallet.fromSeed(seed);
          const child = hdNode.derivePath(derivationPath);
          const privateKey = child.privateKey;
          const wallet = new Wallet(privateKey);
          setCurrentIndex(currentIndex + 1);
          setAddresses([...addresses, wallet.address]);
        }}
      >
        Add ETH wallet
      </button>

      {addresses.map((p) => (
        <div>Eth - {p}</div>
      ))}
    </div>
  );
};