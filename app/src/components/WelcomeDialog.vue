<template>
  <v-dialog v-model="opened" max-width="450px">
    <v-card elevation="4" outlined>
      <v-card-title class="justify-center">
        <span>¡Bienvenidos!</span>
      </v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="4" style="position: relative">
            <img src="@/assets/robot-s.png" style="max-width: 95%">
          </v-col>
          <v-col cols="8">
            <p>
              Hello and welcome to the Spanish Flashcard App!
            </p>
            <p>
              This is a fast-paced tool to help you learn Spanish vocab <strong>as fast as possible</strong>!
            </p>
          </v-col>
        </v-row>
        <v-row>
          <p>You can press the <v-icon>mdi-image-multiple</v-icon> button to select a deck of flashcards and see your test scores.</p>
          <p>And the <v-icon>mdi-menu</v-icon> button to adjust the audio, turn off the tests, or change what's showing when you tap the card.</p>
          <p>Keep coming back to watch your card count increase (top right number), but <strong>if you skip a day it'll reset</strong>.</p>
        </v-row>
        <v-row class="justify-center" style="margin-top: 25px">
          <v-btn raised color="primary" @click="ackWelcomed()">Let's Go</v-btn>
        </v-row>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapMutations, mapState } from 'vuex'

export default {
  name: 'WelcomeDialog',

  computed: mapState(['dialog']),

  watch: {
    dialog (dialog) {
      this.opened = dialog === 'welcome'
    }
  },

  methods: {
    ...mapMutations(['setGeneric']),
    ackWelcomed() {
      this.setGeneric({prop: 'welcomeDialogDisplayed', value: true})
      this.setGeneric({prop: 'dialog', value: 'none'})
    }
  },

  data: () => ({
    opened: false
  }),


}
</script>
