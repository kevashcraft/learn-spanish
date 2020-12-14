<template>
  <v-container style="height: 35px; padding: 0 55px">
    <v-row class="fill-height flex-column justify-center" v-show="!testMode">
      <v-progress-linear :value="cardProgress" color="green lighten-2"></v-progress-linear>
    </v-row>
    <v-row class="fill-height flex-column justify-center" v-show="testMode">
      <v-col cols="10">
        <v-progress-linear :value="cardProgress" color="blue darken-2"></v-progress-linear>
      </v-col>
      <v-col>
        {{ score }}%
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapGetters, mapState } from 'vuex'

export default {
  name: 'ProgressBars',

  computed: {
    ...mapGetters(['cardProgress', 'score']),
    ...mapState(['testMode'])
  }

}
</script>
