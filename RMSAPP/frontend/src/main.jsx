import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import {configureStore} from '@reduxjs/toolkit'
import {Provider} from "react-redux";
import dishesReducer, { dishesFetch } from './features/dishesSlice.jsx';
import { dishesApi } from './features/dishesapi.js';
import cartReducer, { updateProductQuantity } from './features/cartSlice.js';

const store = configureStore({
  reducer: {
    dishes: dishesReducer,
    cart : cartReducer,
    [dishesApi.reducerPath]: dishesApi.reducer, // for RTK Query
  },
  // custom middleware
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware().concat(dishesApi.middleware); // Add return statement here
  }
});

store.dispatch(dishesFetch());
store.dispatch(updateProductQuantity())

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store = {store}>
    <App />
    </Provider>
  </React.StrictMode>,
)
