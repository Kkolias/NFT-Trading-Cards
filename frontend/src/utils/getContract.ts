import { ethers } from 'ethers'
import config from '../../config.json'

const contractAddress = config.contractAddress
const contractABI = config.contractABI

export async function getContract(): Promise<ethers.Contract> {
  if (!(window as any).ethereum) throw new Error('MetaMask not installed')

  const provider = new ethers.BrowserProvider((window as any).ethereum)
  const signer = await provider.getSigner()
  const contract = new ethers.Contract(contractAddress, contractABI, signer)
  return contract
}