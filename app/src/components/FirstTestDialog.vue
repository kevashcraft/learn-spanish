<template>
  <v-dialog v-model="opened" max-width="450px" persistent>
    <v-card elevation="4" outlined>
      <v-card-title class="justify-center">
        <span>Test Time</span>
      </v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="4" style="position: relative">
            <img src="@/assets/test-robot.png" style="max-width: 95%">
          </v-col>
          <v-col cols="8" style="font-size: 18px">
            <p>
              Get ready, this is your first test.
            </p>
            <p>
              Click the correct image for the word. Your score is next to the progress bar.
            </p>
          </v-col>
        </v-row>
        <v-row class="justify-center">
          <p style="font-size: 18px">¡tú puedes hacerlo!</p>
        </v-row>
        <v-row class="justify-center" style="margin-top: 25px">
          <v-btn raised color="primary" @click="opened=false">Let's Go</v-btn>
        </v-row>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapMutations, mapState } from 'vuex'

export default {
  name: 'FirstTestDialog',

  computed: mapState(['dialog']),

  watch: {
    dialog (dialog) {
      this.opened = dialog === 'firstTest'
    },
    opened (opened) {
      if (!opened) {
        this.setGeneric({prop: 'firstTestDialogDisplayed', value: true})
        this.setGeneric({prop: 'dialog', value: 'none'})
      }
    }
  },

  methods:  mapMutations(['setGeneric']),

  data: () => ({
    opened: false
  }),


}
</script>
