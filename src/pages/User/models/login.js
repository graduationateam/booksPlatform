import { Req, Req2 } from '@/services/api';

export default {
  namespace: 'login',
  state: {
    periodData:[],
    userInfo:{}
  },

  effects: {
    //发送请求
    *request({ payload, callback }, { call, put }) {
      const res = yield call(Req2, payload);
      if( res===undefined || res.code!=1 ){
        return;
      }
      if (callback) callback(res);
    },
    *getUserInfo({ payload, callback }, { call, put }) {
      console.log(payload)
      const res = yield call(Req, payload);
      yield put({
        type: '_userInfo',
        payload: res.data,
      });
      if (callback) callback(res.data);
    },
    *test({ payload, callback }, { call, put }) {
      console.log("执行3")
      const res = yield call(Req2, payload);
      console.log(res)
      if (callback) callback(res);
  },
  },
  reducers:{
    _list(state,{payload}){
        return {
            ...state,
            periodData: payload.data
          }
    },
    _userInfo(state,{payload}){
      return {
          ...state,
          userInfo: payload
        }
    },
  }
};
