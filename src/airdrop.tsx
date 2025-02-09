import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import React from 'react'

const Airdrop = () => {
    const wallet = useWallet()
    const {connection} = useConnection()

    async function sendAirdropToUser(){
        await connection.requestAirdrop(wallet.publicKey!, 10)
        alert("requested air drop")
    }

  return (
    <div>
        <div>
                <input type="text" />
                <button onClick={sendAirdropToUser}>Request Air Drop</button>
        </div>
    </div>
  )
}

export default Airdrop