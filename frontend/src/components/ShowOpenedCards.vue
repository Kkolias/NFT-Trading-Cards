<template>
  <div class="component-ShowOpenedCards">
    <ul>
      <li v-for="card in openedCards">
        <TradingCard :revealAnimation="true" :revealDelaySec="2" :card="card" />
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import type { ICard } from '@/interfaces/card'
import TradingCard from '@/components/TradingCard.vue'

export default {
  components: {
    TradingCard,
  },
  props: {
    openedCardIds: {
      type: Array as () => number[],
      required: true,
    },
    cardList: {
      type: Array as () => ICard[],
      required: true,
    },
  },
  data: () => ({
    openedCards: [] as ICard[],
  }),
  mounted() {
    this.pushToListLoop()
  },
  methods: {
    pushToListLoop() {
      console.log('looping')
      this.openedCardIds.forEach((cardId, index) => {
        const gap = 300
        const multiplier = index + 1
        const delay = gap * multiplier
        setTimeout(() => {
          console.log('pushing')
          this.pushItemToList(cardId)
        }, delay)
      })
    },
    pushItemToList(cardId: number) {
      const card = this.cardList.find((card) => card.id === cardId)
      if (card) {
        this.openedCards.push(card)
      }
    },
  },
}
</script>

<style lang="less" scoped>
.component-ShowOpenedCards {
  margin-top: 30px;
  margin-bottom: 30px;
  ul,
  li {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  ul {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 1rem;
  }
}
</style>
