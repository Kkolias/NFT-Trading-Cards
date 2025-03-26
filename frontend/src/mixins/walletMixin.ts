import { ethers } from "ethers";

interface IData {
  walletAddress: string | null
}

export default {
  data: (): IData => ({
    walletAddress: null,
  }),
  computed: {
    walletShortAddress(): string {
      if (this.walletAddress) {
        return `${this.walletAddress.slice(0, 6)}...${this.walletAddress.slice(-4)}`
      }
      return ''
    }
  } as any,
  methods: {
    async checkWalletConnection(): Promise<void> {
      if ((window as any).ethereum) {
        const accounts = await (window as any).ethereum.request({ method: 'eth_accounts' })
        this.walletAddress = accounts.length > 0 ? accounts[0] : null
      } else {
        console.error('MetaMask ei ole asennettuna')
      }
    },
    async connectWallet() {
      if (!(window as any).ethereum) {
        alert("Lompakkoa ei ole asennettuna!");
        return null;
      }
    
      const provider = new ethers.BrowserProvider((window as any).ethereum);
      await (window as any).ethereum.request({ method: "eth_requestAccounts" });
      const signer = await provider.getSigner();

    
      const network = await provider.getNetwork();
      console.log("Verkko:", network.chainId);
    
      const address = await signer.getAddress();
      console.log("Osoite:", address);
      this.walletAddress = address;
    },
    discounnectWallet() {
      this.walletAddress = null
    }
  } as any,
  created() {
    this.checkWalletConnection()
  },
}