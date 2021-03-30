const redux = require("redux");
//npm install redux-logger
const reduxLogger = require("redux-logger");
// 함수 자체를 변수에 넣어줌
const createStore = redux.createStore;
const applyMiddleware = redux.applyMiddleware;
// 함수를 변수에 넣어줌
const logger = reduxLogger.createLogger;
const combineReducers = redux.combineReducers;
// actions
// action-types(반복해서 사용할 것이므로 type을 정의)
const ADD_SUBSCRIBER = "ADD_SUBSCRIBER";
const ADD_VIEWCOUNT = "ADD_VIEWCOUNT";
const addSubscriber = () => {
  // object return
  return {
    //일반적인 convention
    type: ADD_SUBSCRIBER,
  };
};
const addViewCount = () => {
  // object return
  return {
    //일반적인 convention
    type: ADD_VIEWCOUNT,
  };
};
// reducers
const subscriberState = {
  subscribers: 365,
};
const subscriberReducer = (state = subscriberState, action) => {
  switch (action.type) {
    case ADD_SUBSCRIBER:
      return {
        ...state,
        subscribers: state.subscribers + 1,
      };
    default:
      return state;
  }
};
const viewState = {
  viewCount: 100,
};
const viewReducer = (state = viewState, action) => {
  switch (action.type) {
    case ADD_VIEWCOUNT:
      return {
        ...state,
        viewCount: state.viewCount + 1,
      };
    default:
      return state;
  }
};

const rootReducer = combineReducers({
  view: viewReducer,
  subscriber: subscriberReducer,
});
// store  인자로 reducer을 바로 넘겨줌
// 두 개의 reducer가 combining돼서 store로 사용할 수 있게 됨
// store 생성 시 middleware추가해서 log를 찍어볼 수 있음..
const store = createStore(rootReducer, applyMiddleware(logger));
// subscribe - view - dispatch
console.log(store.getState()); // { subscribers: 365} 출력됨
store.dispatch(addSubscriber()); //action 호출 -> reducer가 작동을 하면서 상태의 값이 변동
console.log(store.getState()); // { subscribers: 366} 출력됨

// store.subscribe(() => {
//   console.log("subscribe ==>>", store.getState());
// });
store.dispatch(addSubscriber());
store.dispatch(addSubscriber());
store.dispatch(addSubscriber());
store.dispatch(addViewCount());
store.dispatch(addViewCount());
