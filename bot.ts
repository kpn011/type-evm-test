import { ethers } from 'ethers';
import * as dotenv from 'dotenv';
import { randomInt } from 'crypto';

dotenv.config();

async function sendEvmTransaction(): Promise<void> {
    const rpcUrl: string = process.env.SEPOLIA_RPC_URL!;
    const privateKey: string = process.env.PRIVATE_KEY!;
    const senderAddress: string = process.env.SENDER_ADDRESS!;
    
    const provider = new ethers.JsonRpcProvider(rpcUrl);
    const wallet = new ethers.Wallet(privateKey, provider);
    
    const recipients: string[] = [
        "0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B",
        "0x1Db3439a222C519ab44bb1144fC28167b4Fa6EE6",
        "0x3fC91A3afd70395Cd496C647d5a6CC9D4B2b7FAD",
    ];
    
    const randomIndex = randomInt(0, recipients.length);
    const recipient = recipients[randomIndex];
    
    const minAmount = ethers.parseEther("0.0001");
    const maxAmount = ethers.parseEther("0.001");
    const randomAmount = BigInt(Math.floor(Math.random() * Number(maxAmount - minAmount))) + minAmount;
    
    const balance = await provider.getBalance(senderAddress);
    
    if (balance < randomAmount) {
        throw new Error("Insufficient balance");
    }
    
    const tx = await wallet.sendTransaction({
        to: recipient,
        value: randomAmount,
        gasLimit: 21000,
    });
    
    console.log(`Transaction sent: ${tx.hash}`);
    
    const receipt = await tx.wait();
    
    if (receipt) {
        console.log(`Confirmed in block: ${receipt.blockNumber}`);
    }
}

sendEvmTransaction().catch(console.error);
