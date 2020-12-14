<template>
  <v-dialog v-model="opened" max-width="450px" persistent>
    <v-card elevation="4" outlined>
      <v-card-title class="justify-center">
        <span>Please Rate Us</span>
      </v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="4">
            <img src="@/assets/rate-us-robot.png">
          </v-col>
          <v-col cols="8" style="font-size: 18px">
            <p>
              Are you enjoying this flashcard app?
            </p>
            <p v-show="androidApp">
              Please rate the app in the Play Store!
            </p>
            <p v-show="iOSApp">
              Please rate the app in the App Store!
            </p>
          </v-col>
        </v-row>
        <v-row class="justify-space-around" style="margin-top: 25px">
          <v-btn text @click="noShow">Don't Show Again</v-btn>
          <v-btn raised color="primary" @click="rateUs">Rate The App</v-btn>
        </v-row>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapGetters, mapMutations, mapState } from 'vuex'

/* NOTglobal device */

export default {
  name: 'RateUsDialog',

  computed: {
    ...mapState(['isApp', 'dialog']),
    ...mapGetters(['score'])
  },

  mounted () {
    // this.androidApp = this.isApp && device.platform === 'Android'
    // this.iOSApp = this.isApp && device.platform === 'iOS'
  },

  watch: {
    dialog (dialog) {
      this.opened = dialog === 'rateUs'
    },
    opened (opened) {
      if (!opened) {
        this.setGeneric({prop: 'dialog', value: 'none'})
      }
    }
  },

  methods: {
    ...mapMutations(['setGeneric']),
    rateUs () {
      this.noShow()
      if (this.androidApp) {
        window.open('market://details?id=com.kevapps.spanish_photo_flash')
      }
      // if (this.iOSApp) {
      //   window.open('market://details?id=com.kevapps.spanish_photo_flash')
      // }
    },
    noShow () {
      this.setGeneric({prop: 'rateUsDialogEnabled', value: false })
      this.opened = false
    }
  },

  data: () => ({
    androidApp: true,
    iOSApp: false,
    opened: false
  }),


}
</script>
