<template>
  <v-snackbar v-model="opened" :timeout="-1" :right="true">
    <v-row class="justify-center align-center" style="position: relative">
      <div style="font-size: 19px">Download the App</div>
      <v-btn icon @click="opened=false" style="position: absolute; top: -5px; right: -5px">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-row>
    <v-row class="justify-center">
      <a href="https://play.google.com/store/apps/details?id=com.kevapps.spanish_photo_flash" target="_blane">
        <img src="@/assets/google-play-badge.png" height="75">
      </a>
    </v-row>
  </v-snackbar>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'AppDownloadSnackbar',

  computed: mapState(['isApp']),

  mounted () {
    if (!this.isApp && window.screen.width > 1200) {
      setTimeout(() => {
        this.opened = true
      }, 15000)
    }
  },

  data: () => ({
    opened: false
  }),


}
</script>
