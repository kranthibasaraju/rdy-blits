import Blits from '@lightningjs/blits'
import Column from '../components/Column.js'
import cricketGames from '../data/CricketGames.json'

export default Blits.Component('Games', {
  components: {
    Column,
  },
  template: `
    <Element w="1920" h="1080" color="#1e293b">
      <Text
        content="Cricket Games"
        size="60"
        color="#ffffff"
        x="60"
        y="40"
      />
      <Column
        x="60"
        y="140"
        :items="$games"
        @itemSelect="$handleGameSelect"
      />
    </Element>
  `,
  state() {
    return {
      games: cricketGames.games,
    }
  },
  methods: {
    handleGameSelect(game) {
      console.log('Selected game:', game)
      this.$router.to('game/' + game.id)
    }
  },
  input: {
    back() {
      this.$router.to('/')
    }
  },
})
