import {combineReducers, configureStore} from '@reduxjs/toolkit';
import {persistReducer, persistStore} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import userReducer from '../features/userSlice';

const userPersistConfig = {
    key: 'user', 
    storage,
    whitelist: ['user','isAuthenticated']
}

const rootReducer = combineReducers({
    user: persistReducer(userPersistConfig, userReducer)
})

export const store = configureStore({
    reducer: rootReducer, 
})

export type RootState = ReturnType<typeof store.getState>;
export const persistor = persistStore(store)
export default store;