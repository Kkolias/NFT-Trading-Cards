<template>
  <div class="component-AdminCraftView">
    <h1>Craft Cards</h1>

    <form @submit.prevent="handleCraftCard">
      <div class="input-wrapper">
        <label for="cardId">Card ID</label>
        <input type="text" id="cardId" v-model="cardId" />
      </div>
      <div class="input-wrapper">
        <label for="name">Name</label>
        <input type="text" id="name" v-model="name" required />
      </div>
      <div class="input-wrapper">
        <label for="description">Description</label>
        <input type="text" id="description" v-model="description" required />
      </div>
      <div class="input-wrapper">
        <label for="imageUrl">Image URL</label>
        <input type="text" id="imageUrl" v-model="imageUrl" required />
      </div>
      <div class="input-wrapper">
        <label for="maxSupply">MAX Supply</label>
        <input type="number" id="maxSupply" v-model.number="maxSupply" required />
      </div>
      <button :disabled="!isAuthenticated" class="primary" type="submit">Craft</button>
    </form>

    <CraftedTradingCards />
  </div>
</template>

<script lang="ts">
import CraftedTradingCards from '@/components/CraftedTradingCards.vue'
import walletMixin from '@/mixins/walletMixin'
import { getContract } from '@/utils/getContract'

export default {
  components: {
    CraftedTradingCards,
  },
  mixins: [walletMixin],
  data: () => ({
    cardId: '',
    name: '',
    description: '',
    imageUrl: '',
    maxSupply: 0,
  }),
  computed: {
    isAuthenticated(): boolean {
      return !!this.walletAddress
    },
  },
  methods: {
    async handleCraftCard() {
      const contract = await getContract()
      const tx = await contract.registerCard(
        this.cardId,
        this.name,
        this.description,
        this.imageUrl,
        this.maxSupply,
        { gasLimit: 1000000 },
      )
      // const tx = await contract.registerTest({ gasLimit: 25000 })
      await tx.wait()
    },
  },
}
</script>

<style lang="less" scoped>
.component-AdminCraftView {
  margin-top: 50px;
  form {
    max-width: 400px;
    margin: 0 auto;
    margin-top: 20px;
    border: 1px solid var(--white-1);
    border-radius: 10px;
    padding: 20px;

    .input-wrapper {
      margin-bottom: 20px;
      label {
        display: block;
        margin-bottom: 5px;
      }
      input {
        width: 100%;
      }
    }
  }
}
</style>
