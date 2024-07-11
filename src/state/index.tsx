/* eslint-disable @typescript-eslint/no-explicit-any */
import { Action, AnyAction, configureStore, Store, ThunkAction, ThunkDispatch } from '@reduxjs/toolkit'
import { persistReducer, persistStore } from 'redux-persist'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import createWebStorage from 'redux-persist/lib/storage/createWebStorage'
import reducer from './reducer'
import crossBrowserListener from '@/src/library/utils/redux/reduxPersistListener'

const PERSISTED_KEYS: string[] = ['user', 'apr']

const createNoopStorage = () => {
  return {
    getItem(_key: any) {
      return Promise.resolve(null)
    },
    setItem(_key: any, value: any) {
      return Promise.resolve(value)
    },
    removeItem(_key: any) {
      return Promise.resolve()
    },
  }
}
const storage = typeof window !== 'undefined' ? createWebStorage('local') : createNoopStorage()

const persistConfig: any = {
  key: 'root',
  whitelist: PERSISTED_KEYS,
  storage,
}

const persistedReducer = persistReducer(persistConfig, reducer)

function makeStore(preloadedState = undefined) {
  return configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        thunk: true,
        immutableCheck: true,
        serializableCheck: false,
      }),
    devTools: process.env.NODE_ENV === 'development',
    preloadedState,
  })
}

let store: Store<any, AnyAction>

export const getOrCreateStore = (preloadedState = undefined) => {
  let _store = store ?? makeStore(preloadedState)
  const formattedPreloadedState = preloadedState ?? {}

  // After navigating to a page with an initial Redux state, merge that state
  // with the current state in the store, and create a new store
  if (preloadedState && store) {
    _store = makeStore({
      ...store.getState(),
      ...formattedPreloadedState,
    })
    // Reset the current store
    store = makeStore()
  }

  // For SSG and SSR always create a new store
  if (typeof window === 'undefined') return _store

  // Create the store once in the client
  if (!store) store = _store

  return _store
}

store = getOrCreateStore()

export type AppState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, AppState, unknown, Action<string>>
export type AppThunkDispatch = ThunkDispatch<{}, void, AnyAction>

export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<AppState> = useSelector

export default store

export const persistor = persistStore(store)

if (typeof window === 'object') {
  window.addEventListener('storage', crossBrowserListener(store, persistConfig))
}
