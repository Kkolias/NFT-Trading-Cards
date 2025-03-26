<template>
  <div class="component-TradingCardList">
    <ul>
      <li v-for="card in list">
        <TradingCard :card="card" />
      </li>
    </ul>

    <button v-if="openedCard" class="blank opened-card" @click="closeCard()">
      <TradingCard :card="openedCard" class="big" />
      <div class="info-wrapper">
        <p class="bold center">{{ openedCard.name }}</p>
        <p>
          Description: <span class="bold">&nbsp;{{ openedCard.description }}</span>
        </p>
        <p>
          Rarity:<span class="bold">&nbsp;{{ openedCard.rarity }}</span>
        </p>
        <p>
          Supply: <span class="bold">&nbsp;{{ openedCard.maxSupply }}</span>
        </p>
        <p>
          Exists: <span class="bold">&nbsp;{{ openedCard.currentSupply }}</span>
        </p>
      </div>
    </button>
  </div>
</template>

<script lang="ts">
import TradingCard from '@/components/TradingCard.vue'
import type { ICard } from '@/interfaces/card'
export default {
  components: {
    TradingCard,
  },
  props: {
    list: {
      type: Array as () => ICard[],
      required: true,
    },
  },
  computed: {
    selectedCardId(): string | null {
      return (this.$route.query?.id as string) || null
    },
    openedCard(): ICard | null {
      return this.list.find((card) => card.cardId === this.selectedCardId) || null
    },
  },
  methods: {
    closeCard() {
      this.$router.push({ query: {} })
    },
  }
}
</script>

<style lang="less" scoped>
.component-TradingCardList {
  padding: 20px;
  margin: 0 auto;
  ul,
  li {
    list-style: none;
    margin: 0;
  }

  ul {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    justify-content: center;
  }

  .opened-card {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 100;

    .info-wrapper {
      border: 1px solid var(--white-1);
      padding: 12px;
      border-radius: 10px;
      height: 450px;
      background: rgba(0, 0, 0, 0.5);
      margin-left: 8px;

      p {
        &.center {
            text-align: center;
        }

        font-size: 1.8rem;
        margin-bottom: 12px;
      }
    }
  }
}
</style>
