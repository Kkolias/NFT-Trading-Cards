<template>
  <div class="component-OpenPack">
    <button class="primary" @click="handleOpenPack()">Open Pack</button>

    <div v-if="cardsOpened" class="opened-card-overlay">
      <button class="blank outside-click-area" @click="closeOpenedCards()"></button>
      <ShowOpenedCards
        class="cards-area"
        v-if="openedCardIds.length"
        :openedCardIds="openedCardIds"
        :cardList="cardList"
      />
    </div>
  </div>
</template>

<script lang="ts">
import type { ICard } from '@/interfaces/card'
import { getContract } from '@/utils/getContract'
import ShowOpenedCards from './ShowOpenedCards.vue'
import { ethers } from 'ethers';

export default {
  components: {
    ShowOpenedCards,
  },
  props: {
    cardList: {
      type: Array as () => ICard[],
      required: true,
    },
  },
  data: () => ({
    openedCardIds: [] as number[],
    cardsOpened: false,
  }),
  methods: {
    async handleOpenPack() {
      const packPrice = ethers.parseEther("0.01"); 
      try {
        const contract = await getContract()
        this.setCardsOpened(true)
        contract.on('PackOpened', (add, val) => {
          console.log('PACK OPENED', add, val)
          this.parseAndSetOpenedCards(val)
        })

        const tx = await contract.openPackV2({ gasLimit: 1000000, value: packPrice })
        await tx.wait()
      } catch (error) {
        console.error('Error opening pack', error)
        this.setCardsOpened(false)
      }
    },
    setOpenedCards(cardIds: number[]): void {
      this.openedCardIds = cardIds
    },
    parseAndSetOpenedCards(cardIds: bigint[]): void {
      const parsedCardIds = this.parseOpenedCardIds(cardIds)
      this.setOpenedCards(parsedCardIds)
    },
    parseOpenedCardIds(cardIds: bigint[]): number[] {
      return cardIds.map((id) => Number(id))?.sort()
    },
    closeOpenedCards(): void {
      this.setCardsOpened(false)
      this.openedCardIds = []
    },

    setCardsOpened(val: boolean): void {
      this.cardsOpened = val
    },
  },
}
</script>

<style lang="less" scoped>
.component-OpenPack {
  .opened-card-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.7);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 10;

    .outside-click-area {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: transparent;
    }
  }
}
</style>
