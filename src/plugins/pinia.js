import { createPinia } from 'pinia'
import { createPersistedState } from 'pinia-plugin-persistedstate'

export const store = createPinia()
store.use(createPersistedState())

export default function (app) {
  app.use(store)
}
