<template>
  <div class="component-MyCardsList">
    <OpenPack :cardList="craftedCards" /> 

    <TradingCardList :list="myOwnedCards" />
  </div>
</template>

<script lang="ts">
import walletMixin from '@/mixins/walletMixin'
import { getContract } from '@/utils/getContract'
import TradingCardList from '@/components/TradingCardList.vue'
import { parseCardList } from '@/utils/parseCardList'
import type { ICard } from '@/interfaces/card'
import OpenPack from '@/components/OpenPack.vue'
export default {
  mixins: [walletMixin],
  components: {
    TradingCardList,
    OpenPack
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
   
    async handleOpenPack() {
      

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
