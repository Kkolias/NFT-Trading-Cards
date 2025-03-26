<template>
  <div class="component-MyCardsList">
    <button class="primary" @click="handleOpenPack()">Open Pack</button>

    <TradingCardList :list="myOwnedCards" />
  </div>
</template>

<script lang="ts">
import walletMixin from '@/mixins/walletMixin'
import { getContract } from '@/utils/getContract'
import TradingCardList from '@/components/TradingCardList.vue'
import { parseCardList } from '@/utils/parseCardList'
import type { ICard } from '@/interfaces/card'
export default {
  mixins: [walletMixin],
  components: {
    TradingCardList,
  },
  data: () => ({
    craftedCards: [],
    myCardIds: [],

    contract: null,
  }),
  computed: {
    myOwnedCards(): ICard[] {
      return this.myCardIds.map((id: number) => {
        return this.craftedCards.find((card: ICard) => card.id === id)
      })
    },
  },
  mounted() {
    this.fetchData()
  },
  methods: {
    parseMyCardIds(myCardIdsUnparsed: bigint[]): number[] {
      return myCardIdsUnparsed.map((id) => Number(id))
    },

    async fetchData() {
      const contract = await getContract()
      this.contract = contract
      const list = await contract.getCards()

    //   const common = await contract.getRarityToCardsByKey('Common')
    //   const rare = await contract.getRarityToCardsByKey('Rare')
    //   const epic = await contract.getRarityToCardsByKey('Epic')
    //   const legendary = await contract.getRarityToCardsByKey('Legendary')
    //   console.log('COMMON', common)
    //   console.log('RARE', rare)
    //   console.log('EPIC', epic)
    //   console.log('LEGENDARY', legendary)

      const parsedList = parseCardList(list)
      console.log(parsedList)
      this.craftedCards = parsedList

      this.fetchMyCardIds(contract)
    },
    async fetchMyCardIds(contract: any) {
      const myCardIds = await contract.getMyCardIds()
      const myCardIdsParsed = this.parseMyCardIds(myCardIds)

      this.myCardIds = myCardIdsParsed
    },
    // async handleOpenPack() {
    //   const walletAddress = this.walletAddress
    //   if (!walletAddress) {
    //     alert('Please connect your wallet')
    //     return
    //   }
    //   const contract = await getContract()
    //   const tx = await contract.openPack(walletAddress)
    //   await tx.wait()

    //   this.fetchMyCardIds(contract)
    // },
    async handleOpenPack() {
      // // const walletAddress = this.walletAddress
      // if (!walletAddress) {
      //   alert('Please connect your wallet')
      //   return
      // }

      const contract = await getContract()
      contract.on('PackOpened', (add, val) => {
        console.log('PACK OPENED', add, val)
      })
      contract.on('SingleCardMinted', (add, val) => {
        console.log('SINGLE CARD MINTED', add, val)
      })
      contract.on('Debug', (val) => {
        console.log('DEBUG', val)
      })
      const tx = await contract.openPackV2()
      await tx.wait()

      this.fetchMyCardIds(contract)
    },
  },
}
</script>

<style lang="less" scoped>
.component-MyCardsList {
}
</style>
