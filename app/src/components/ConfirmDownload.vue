<template>
  <v-dialog v-model="opened" persistent max-width="450px">
    <v-card>
      <v-card-title>Download GIF Deck?</v-card-title>
      <v-card-text>
        This deck of cards is kinda large ({{ Math.round(proposedDeck.size / 1000000) }}MB).<br>
        It'll take a few minutes. <br>
        You should probably only download it if you're on Wifi.
      </v-card-text>
      <v-divider></v-divider>

      <v-card-actions>
        <v-row class="justify-space-around">
          <v-btn @click="setProposedDeck()">
            Cancel
          </v-btn>
          <v-btn color="primary" @click="deckChange(proposedDeck)">
            Download
          </v-btn>
        </v-row>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapActions, mapMutations, mapState } from 'vuex'

export default {
  name: 'ConfirmDownload',

  computed: {
    ...mapState(['proposedDeck'])
  },

  watch: {
    proposedDeck (deck) {
      this.opened = !!deck.name
    }
  },

  data: () => ({
    opened: false
  }),

  methods: {
    ...mapMutations(['setProposedDeck']),
    ...mapActions(['deckChange'])
  }

}
</script>
