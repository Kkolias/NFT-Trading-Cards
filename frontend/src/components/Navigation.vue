<template>
  <div class="component-Navigation">
    <div class="grid-container">
      <h2>Trading Cards NFT</h2>

      <div class="center">{{ walletShortAddress }}</div>
    </div>
    <div class="button-container">
      <button class="primary" v-if="!walletAddress" @click="handleConnectWallet()">
        Connect wallet
      </button>
      <button class="primary" v-if="walletAddress" @click="discounnectWallet()">
        Disconnect wallet
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import walletMixin from '@/mixins/walletMixin'

export default {
  mixins: [walletMixin],
  methods: {
    handleConnectWallet() {
      this.connectWallet()
    },
  },
}
</script>

<style lang="less" scoped>
.component-Navigation {
  width: 100%;
  height: 60px;
  position: relative;

  padding: 10px;
  box-shadow: 0 10px 10px rgba(0, 0, 0, 0.1);

  h2 {
    text-align: left;
    height: 40px;
    display: inline-block;
    line-height: 40px;
  }

  .button-container {
    position: absolute;
    right: 20px;
    top: 50%;
    transform: translateY(-50%);
  }

  .grid-container {
    display: grid;
    grid-template-columns: 1fr 1fr;

    .center {
      height: 40px;
      line-height: 40px;
    }
  }
}
</style>
