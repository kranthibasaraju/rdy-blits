import Blits from '@lightningjs/blits'
import { logger } from '../services/logger.js'
import Loader from '../components/Loader.js'

const colors = ['#f5f3ff', '#ede9fe', '#ddd6fe', '#c4b5fd', '#a78bfa']

export default Blits.Component('Home', {
  components: {
    Loader,
  },
  template: `
    <Element w="1920" h="1080" color="#1e293b">
      <Element :y.transition="$y">
        <Element
          src="assets/logo.png"
          w="200"
          h="200"
          :scale.transition="{value: $scale, duration: 500}"
          :rotation.transition="{value: $rotation, duration: 800}"
          :x.transition="{value: $x, delay: 200, duration: 1200, easing: 'cubic-bezier(1,-0.64,.39,1.44)'}"
          mount="{x: 0.5}"
          y="320"
          :effects="[$shader('radius', {radius: 8})]"
        />
        <Element y="600" :alpha.transition="$textAlpha">
          <Text size="80" align="center" maxwidth="1920">Hello!</Text>
          <Text
            size="50"
            align="center"
            y="120"
            :x="1920/2"
            maxwidth="500"
            lineheight="64"
            mount="{x: 0.5}"
            color="#ffffffaa"
            content="Let's get started with Lightning 3 & Blits"
          />
          <Element
            :x="1920/2"
            y="240"
            mount="{x: 0.5}"
            :color="$buttonFocus ? '#a78bfa' : '#ffffff'"
            :effects="[$shader('radius', {radius: 8})]"
            w="200"
            h="60"
          >
            <Text
              content="View Games"
              :x="100"
              :y="30"
              mount="{x: 0.5, y: 0.5}"
              size="24"
            />
          </Element>
        </Element>
      </Element>
    </Element>
  `,
  state() {
    return {
      /**
       * Y-position of the entire page contents
       * @type {number}
       */
      y: 0,
      /**
       * X-position of the logo, used to create slide in transition
       * @type {number}
       */
      x: -1000,
      /**
       * Rotation of the logo, used to create a spinning transition
       * @type {number}
       */
      rotation: 0,
      /**
       * Scale of the logo, used to create a zoom-in / zoom-out transition
       * @type {number}
       */
      scale: 1,
      /**
       * Alpha of the loader component, used to create a fade-in / fade-out transition
       * @type {number}
       */
      loaderAlpha: 0,
      /**
       * Alpha of the text, used to create a fade-in transition
       * @type {number}
       */
      textAlpha: 0,
      /**
       * Color passed into the loader component
       * @type {string}
       */
      color: '',
      /**
       * Button focus state
       * @type {boolean}
       */
      buttonFocus: false
    }
  },
  hooks: {
    ready() {
      logger.info('Home component ready', 'Home', { state: this.$state });
      this.rotateColors(200)

      this.loaderAlpha = 1
      this.x = 1920 / 2

      this.$setTimeout(() => {
        logger.debug('Starting logo animation', 'Home', { rotation: 720, scale: 1.5 });
        this.rotation = 720
        this.scale = 1.5
      }, 3000)

      this.$setTimeout(() => {
        logger.debug('Resetting logo scale', 'Home', { scale: 1 });
        this.scale = 1
      }, 3000 + 300)

      this.$setTimeout(() => {
        logger.debug('Showing main content', 'Home', {
          y: -60,
          loaderAlpha: 0,
          scale: 1,
          textAlpha: 1
        });
        this.y = -60
        this.loaderAlpha = 0
        this.scale = 1
        this.textAlpha = 1
      }, 6000)
    },
    destroy() {
      logger.info('Home component unmounting', 'Home', {});
    }
  },
  methods: {
    /**
     * Method to rotate the colors of the loader
     * @param {number} interval - interval in ms
     */
    rotateColors(interval) {
      let i = 0
      this.$setInterval(() => {
        i++
        if (i >= colors.length) i = 0
        this.color = colors[i]
        logger.debug('Loader color changed', 'Home', { color: colors[i] });
      }, interval)
    },
  },
  input: {
    enter(e) {
      logger.info('Navigating to games', 'Home', { event: 'enter' });
      this.$router.to('games')
    },
    up(e) {
      logger.debug('Button focused', 'Home', { event: 'up' });
      this.buttonFocus = true
    },
    down(e) {
      logger.debug('Button unfocused', 'Home', { event: 'down' });
      this.buttonFocus = false
    }
  },
})
