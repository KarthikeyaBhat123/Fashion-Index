import { createStore, combineReducers } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import HomeReducer from "../Reducers/HomeReducer";

const rootReducer = combineReducers({ Home: HomeReducer });

const store = createStore(rootReducer, composeWithDevTools());

export default store;
