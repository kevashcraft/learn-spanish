<template>
  <v-dialog v-model="opened" max-width="450px">
    <v-card elevation="4" outlined>
      <v-card-title class="justify-center">
        <span>Software and Media API Licenses</span>
      </v-card-title>
      <v-card-text>
        <v-row>
          <a href="/licenses/vuejs.txt" target="_blank">VueJS</a>
        </v-row>
        <v-row>
          <a href="/licenses/pixabay.txt" target="_blank">Pixabay</a>
        </v-row>
        <v-row>
          <a href="/licenses/giphy.txt" target="_blank">GIPHy</a>
        </v-row>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapMutations, mapState } from 'vuex'

export default {
  name: 'LicensesDialog',

  computed: mapState(['dialog']),

  watch: {
    dialog (dialog) {
      this.opened = dialog === 'licenses'
    }
  },

  methods: {
    ...mapMutations(['setGeneric']),
    ackWelcomed() {
      this.setGeneric({prop: 'dialog', value: 'none'})
    }
  },

  data: () => ({
    opened: false
  }),


}
</script>
