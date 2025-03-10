import Blits from '@lightningjs/blits'
import CricketGames from '../data/CricketGames.json'

export default Blits.Component('Column', {
  template: `
    <Element>
      <Element :for="item in $items">
        <Element
          :key="$item.id"
          w="400"
          h="80"
          :y="$index * 100"
          :color="$currentIndex === $index ? '#a78bfa' : '#ffffff33'"
          :effects="[$shader('radius', {radius: 8})]"
        >
          <Text
            :content="'Game ' + $item.id + ': ' + $item.name"
            x="20"
            :y="40"
            mount="{y: 0.5}"
            size="32"
            color="#ffffff"
          />
        </Element>
      </Element>
    </Element>
  `,
  props: ['items'],
  state() {
    return {
      currentIndex: 0,

    }
  },
  hooks: {
    ready() {
      this.items.forEach((item, index) => {
        console.log('Game ' + (item.id + 1) + ': ' + item.name)
      })
    },
  },
  input: {
    up() {
      this.currentIndex = Math.max(0, this.currentIndex - 1)
    },
    down() {
      this.currentIndex = Math.min(this.items.games.length - 1, this.currentIndex + 1)
    },
    enter() {
      this.$emit('itemSelect', this.items.games[this.currentIndex])
    },
  },
})

export const GamePage = Blits.Component('GamePage', {
  template: `
    <Element>
    </Element>
  `,
  input: {
    enter(e) {
      this.$emit('selectGame', this.selectedGame)
    },
  },
})
