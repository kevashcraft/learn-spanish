<template>
  <v-container style="height: 55px; padding: 0 55px">
    <v-row class="justify-space-between align-center fill-height">
      <v-menu>
        <template v-slot:activator="{ on, attrs }">
          <v-btn icon v-bind="attrs" v-on="on">
            <v-icon>mdi-image-multiple</v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-subheader style="color: #2995fe"><strong>Available Cards</strong></v-subheader>
          <v-divider></v-divider>
          <v-list-item v-for="d in deckList" :key="d.name"
            @click="deckChange(d)"
            :class="d.name === deck.name ? 'deck-selected' : ''">
            <v-list-item-content>
              <v-list-item-title v-text="d.name"></v-list-item-title>
            </v-list-item-content>
            <v-list-item-icon>
              <v-icon v-if="!d.downloaded">mdi-cloud-download</v-icon>
              <v-icon v-if="d.downloaded">mdi-check</v-icon>
            </v-list-item-icon>
          </v-list-item>
        </v-list>
      </v-menu>

      <v-menu>
        <template v-slot:activator="{ on, attrs }">
          <v-btn icon v-bind="attrs" v-on="on">
            <v-icon v-show="sortMethod === 'alpha'">mdi-sort-alphabetical-ascending-variant</v-icon>
            <v-icon v-show="sortMethod === 'leastViewed'">mdi-sort-ascending</v-icon>
            <v-icon v-show="sortMethod === 'shuffle'">mdi-shuffle-variant</v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-subheader style="color: #2995fe"><strong>Sort Cards</strong></v-subheader>
          <v-divider></v-divider>
          <v-list-item @click="sortCards('alpha')"
            :class="sortMethod === 'alpha' ? 'deck-selected' : ''">
            <v-list-item-content>
              <v-list-item-title>Alphabetical</v-list-item-title>
            </v-list-item-content>
            <v-list-item-icon>
              <v-icon>mdi-sort-alphabetical-ascending-variant</v-icon>
            </v-list-item-icon>
          </v-list-item>
          <v-list-item @click="sortCards('leastViewed')"
            :class="sortMethod === 'leastViewed' ? 'deck-selected' : ''">
            <v-list-item-content>
              <v-list-item-title>Least Viewed</v-list-item-title>
            </v-list-item-content>
            <v-list-item-icon>
              <v-icon>mdi-sort-ascending</v-icon>
            </v-list-item-icon>
          </v-list-item>
          <v-list-item @click="sortCards('shuffle')"
            :class="sortMethod === 'shuffle' ? 'deck-selected' : ''">
            <v-list-item-content>
              <v-list-item-title>Shuffle</v-list-item-title>
            </v-list-item-content>
            <v-list-item-icon>
              <v-icon>mdi-shuffle-variant</v-icon>
            </v-list-item-icon>
          </v-list-item>
        </v-list>
      </v-menu>

      <v-menu>
        <template v-slot:activator="{ on, attrs }">
          <v-btn icon v-bind="attrs" v-on="on">
            <v-icon>mdi-menu</v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-subheader style="color: #2995fe"><strong>Audio and Theme</strong></v-subheader>
          <v-list-item @click="toggleAudioEnabled">
            <v-list-item-title v-show="audioEnabled">Turn Audio Off</v-list-item-title>
            <v-list-item-title v-show="!audioEnabled">Turn Audio On</v-list-item-title>
          </v-list-item>
          <v-list-item @click="toggleDarkTheme">
            <v-list-item-title v-show="darkTheme">Light Theme</v-list-item-title>
            <v-list-item-title v-show="!darkTheme">Dark Theme</v-list-item-title>
          </v-list-item>
          <v-divider></v-divider>
          <v-subheader style="color: #2995fe"><strong>Show Images</strong></v-subheader>
          <v-list-item @click="setShowHints('always')">
            <v-list-item-content>
              <v-list-item-title>Always</v-list-item-title>
            </v-list-item-content>
            <v-list-item-icon>
              <v-icon v-show="showHints === 'always'" color="green">mdi-check</v-icon>
            </v-list-item-icon>
          </v-list-item>
          <v-list-item @click="setShowHints('onTap')">
            <v-list-item-content>
              <v-list-item-title>On Tap</v-list-item-title>
            </v-list-item-content>
            <v-list-item-icon>
              <v-icon v-show="showHints === 'onTap'" color="green">mdi-check</v-icon>
            </v-list-item-icon>
          </v-list-item>
          <v-list-item @click="setShowHints('never')">
            <v-list-item-content>
              <v-list-item-title>Never</v-list-item-title>
            </v-list-item-content>
            <v-list-item-icon>
              <v-icon v-show="showAnswers === 'never'" color="green">mdi-check</v-icon>
            </v-list-item-icon>
          </v-list-item>
          <v-divider></v-divider>
          <v-subheader style="color: #2995fe"><strong>Show Answers</strong></v-subheader>
          <v-list-item @click="setShowAnswers('always')">
            <v-list-item-content>
              <v-list-item-title>Always</v-list-item-title>
            </v-list-item-content>
            <v-list-item-icon>
              <v-icon v-show="showAnswers === 'always'" color="green">mdi-check</v-icon>
            </v-list-item-icon>
          </v-list-item>
          <v-list-item @click="setShowAnswers('onTap')">
            <v-list-item-content>
              <v-list-item-title>On Tap</v-list-item-title>
            </v-list-item-content>
            <v-list-item-icon>
              <v-icon v-show="showAnswers === 'onTap'" color="green">mdi-check</v-icon>
            </v-list-item-icon>
          </v-list-item>
          <v-list-item @click="setShowAnswers('never')">
            <v-list-item-content>
              <v-list-item-title>Never</v-list-item-title>
            </v-list-item-content>
            <v-list-item-icon>
              <v-icon v-show="showAnswers === 'never'" color="green">mdi-check</v-icon>
            </v-list-item-icon>
          </v-list-item>
        </v-list>
      </v-menu>

    </v-row>
  </v-container>
</template>

<style>
.deck-selected {
  background: rgb(0,0,0,.2)
}
</style>

<script>
import { mapActions, mapMutations, mapState } from 'vuex'

export default {
  name: 'ActionBar',
  computed: {
    ...mapState([
      'audioEnabled', 'darkTheme', 'deckList', 'deck',
      'showAnswers', 'showHints', 'sortMethod'
    ])
  },
  methods: {
    ...mapActions(['deckChange', 'sortCards']),
    ...mapMutations([
      'setShowAnswers', 'setShowHints',
      'toggleAudioEnabled', 'toggleDarkTheme'
    ]),
  },
  mounted (){
    console.log('this.deckList', JSON.stringify(this.deckList))
  },
  data: () => ({
    
  }),
}
</script>
