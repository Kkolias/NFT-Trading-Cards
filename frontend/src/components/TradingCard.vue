<template>
  <div class="component-TradingCard">
    <button class="blank" @click="openCard()">
      <div class="card-wrapper" :class="{ hide: revealAnimation && !showCard }">
        <img class="image" :src="imageUrl" alt="card image" />
        <div class="frame" :class="rarity"></div>
        <div class="back-frame" :class="rarity"></div>

        <div class="name-wrapper">
          <p class="bold">{{ cardName }}</p>
        </div>
      </div>
    </button>
  </div>
</template>

<script lang="ts">
import type { ICard } from '@/interfaces/card'

export default {
  props: {
    card: {
      type: Object as () => ICard,
      required: true,
    },
    revealAnimation: {
      type: Boolean,
      default: false,
    },
    revealDelaySec: {
      type: Number,
      default: 0,
    },
  },
  data: () => ({
    showCard: false,
  }),
  computed: {
    imageUrl(): string {
      return this.card.imageURI
    },
    rarity(): string {
      return this.card.rarity
    },
    cardName(): string {
      return this.card.name
    },
    getFrameUrl(): string {
      if (this.rarity === 'common') {
        return '/svg/frame-common.svg'
      } else if (this.rarity === 'rare') {
        return '/svg/frame-rare.svg'
      } else if (this.rarity === 'epic') {
        return '/svg/frame-epic.svg'
      } else if (this.rarity === 'legendary') {
        return '/svg/frame-legendary.svg'
      } else {
        return '/svg/frame-common.svg'
      }
    },
  },
  mounted() {
    if (this.revealAnimation) {
      setTimeout(() => {
        this.showCard = true
        console.log('showing card')
      }, this.revealDelaySec * 1000)
    }
  },
  methods: {
    openCard() {
      this.$router.push({ query: { id: this.card.cardId } })
    },
  },
}
</script>

<style lang="less" scoped>
.component-TradingCard {
  .card-wrapper {
    width: 200px;
    height: 300px;
    position: relative;

    transition: transform 0.6s;
    transform-style: preserve-3d;
    .frame {
      width: 100%;
      // height: 100%;
      background-size: contain;
      background-position: center;
      background-repeat: no-repeat;
      aspect-ratio: 200/300;
      position: relative;
      z-index: 2;
      -webkit-backface-visibility: hidden;
      backface-visibility: hidden;

      &.Common {
        background-image: url('/svg/frame-common.svg');
      }

      &.Rare {
        background-image: url('/svg/frame-rare.svg');
      }

      &.Epic {
        background-image: url('/svg/frame-epic.svg');
      }

      &.Legendary {
        background-image: url('/svg/frame-legendary.svg');
      }
    }

    .back-frame {
      width: 100%;
      background-size: contain;
      background-position: center;
      background-repeat: no-repeat;
      aspect-ratio: 200/300;
      z-index: 3;
      position: absolute;
      top: 0;
      left: 0;
      -webkit-backface-visibility: hidden;
      backface-visibility: hidden;

      transform: rotateY(180deg);

      &.Common {
        background-image: url('/svg/back-frame-common.svg');
      }

      &.Rare {
        background-image: url('/svg/back-frame-rare.svg');
      }

      &.Epic {
        background-image: url('/svg/back-frame-epic.svg');
      }

      &.Legendary {
        background-image: url('/svg/back-frame-legendary.svg');
      }
    }

    .image {
      width: 100%;
      position: absolute;
      top: 20px;
      -webkit-backface-visibility: hidden;
      backface-visibility: hidden;
      // transform: rotateY(180deg);
    }

    .name-wrapper {
      display: none;
    }

    &.hide {
      transform: rotateY(180deg);
    }
  }

  &.big {
    .card-wrapper {
      width: 300px;
      height: 450px;

      .name-wrapper {
        display: block;
        position: absolute;
        top: 320px;
        left: 50%;
        transform: translateX(-50%);
        z-index: 3;
        max-width: 230px;
        width: 100%;

        p {
          text-align: center;
          font-size: 2.4rem;
          color: var(--black-1);
        }
      }
    }

    .image {
      width: calc(100% - 40px);
      left: 20px;
    }
  }
}
</style>
