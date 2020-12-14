<template>
  <v-dialog v-model="opened" max-width="450px" persistent>
    <v-card elevation="4" outlined>
      <v-card-title class="justify-center">
        <span>Test Complete</span>
      </v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="4" style="position: relative">
            <img src="@/assets/test-complete-robot.png" style="max-width: 95%">
          </v-col>
          <v-col cols="8" style="font-size: 18px">
            <p>
              Good job! You finished and scored {{score}}%!
            </p>
            <p>
              Checkout the deck menu <v-icon>mdi-image-multiple</v-icon> to see your best scores for each set of flashcards.
            </p>
          </v-col>
        </v-row>
        <v-row class="justify-space-around" style="margin-top: 25px">
          <v-btn text @click="noShow">Don't Show Again</v-btn>
          <v-btn raised color="primary" @click="opened=false">Keep Going!</v-btn>
        </v-row>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapGetters, mapMutations, mapState } from 'vuex'

export default {
  name: 'TestCompleteDialog',

  computed: {
    ...mapState(['dialog']),
    ...mapGetters(['score'])
  },

  watch: {
    dialog (dialog) {
      this.opened = dialog === 'testComplete'
    },
    opened (opened) {
      if (!opened) {
        this.setGeneric({prop: 'dialog', value: 'none'})
      }
    }
  },

  methods: {
    ...mapMutations(['setGeneric']),
    noShow () {
      this.setGeneric({prop: 'testCompleteDialogEnabled', value: false })
      this.opened = false
    }
  },

  data: () => ({
    opened: false
  }),


}
</script>
