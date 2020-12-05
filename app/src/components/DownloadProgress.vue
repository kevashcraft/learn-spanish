<template>
  <v-dialog v-model="opened">
    <v-card elevation="4" outlined>
      <v-card-title>Downloading Flashcard Data</v-card-title>
      <v-card-text>
        <v-progress-linear v-model="downloadProgress" persistent></v-progress-linear>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'DownloadProgress',

  computed: mapState(['downloadProgress']),

  watch: {
    downloadProgress (progress) {
      this.opened = progress !== -1
    }
  },

  data: () => ({
    opened: false
  }),


}
</script>
