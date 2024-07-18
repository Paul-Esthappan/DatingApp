import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web

import authReducer from './slice/authSlice'; // Ensure the correct path to your authSlice

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth'], // Reducer names to be persisted
};

const rootReducer = combineReducers({
  auth: authReducer,
  // Add other reducers as needed
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Disable serializable check
    }),
});

export const persistor = persistStore(store);
