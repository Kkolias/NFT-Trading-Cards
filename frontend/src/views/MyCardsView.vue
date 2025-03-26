<template>
  <div class="component-MyCardsView">
    <h1>My Cards</h1>
    <MyCardsList />
  </div>
</template>

<script lang="ts">
import MyCardsList from '@/components/MyCardsList.vue'
export default {
  components: {
    MyCardsList,
  },
}
</script>
