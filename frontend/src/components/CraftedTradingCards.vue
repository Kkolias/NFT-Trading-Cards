<template>
  <div class="component-CraftedTradingCards">
    <TradingCardList :list="list" />
    <pre style="font-size: 1.6rem">{{ list }}</pre>
  </div>
</template>

<script lang="ts">
import walletMixin from '@/mixins/walletMixin'
import { getContract } from '@/utils/getContract'
import TradingCardList from '@/components/TradingCardList.vue'
import { parseCardList } from '@/utils/parseCardList'

export default {
  mixins: [walletMixin],
  components: {
    TradingCardList,
  },
  data: () => ({
    list: [],
  }),
  computed: {
    isAuthenticated(): boolean {
      return !!this.walletAddress
    },
  },
  mounted() {
    console.log('here')
    this.fetchData()
  },
  methods: {
    async fetchData() {
      const contract = await getContract()
      const list = await contract.getCards()

      const parsedList = parseCardList(list)
      console.log(parsedList)
      this.list = parsedList
    },
  },
}
</script>
