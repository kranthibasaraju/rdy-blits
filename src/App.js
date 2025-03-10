import Blits from '@lightningjs/blits'
import { logger } from './services/logger.js'

import Home from './pages/Home.js'
import Games from './pages/Games.js'

export default Blits.Application({
  template: `
    <Element>
      <RouterView />
    </Element>
  `,
  routes: [
    { path: '/', component: Home },
    { path: '/games', component: Games },
    { path: '/game/:id', component: Games }
  ],
  hooks: {
    init() {
      logger.info('Application initializing', 'App', {});
    },
    ready() {
      logger.info('Application mounted', 'App', {});
    },
    destroy() {
      logger.info('Application unmounting', 'App', {});
    }
  }
})
