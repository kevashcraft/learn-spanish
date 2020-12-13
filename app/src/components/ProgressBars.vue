<template>
  <v-container style="height: 35px; padding: 0 55px">
    <v-row class="fill-height flex-column justify-center">
      <v-progress-linear :value="cardProgress" color="green lighten-2"></v-progress-linear>
    </v-row>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'ProgressBars',

  computed: mapGetters(['cardProgress']),

}
</script>
