import { Req,listReq, Req2} from '@/services/api';

export default {
  namespace: 'home',
  state: {
  },

  effects: {
    //发送 非分页 请求
    *request({ payload, callback }, { call, put }) {
        const res = yield call(Req, payload);
        if (callback) callback(res);
    },
    *listRequest({ payload, callback }, { call, put }){
        const res = yield call(listReq, payload);
        if (callback) callback(res);
    },
    *getSellList({ payload, callback }, { call, put }) {
      const res = yield call(Req2, payload);
      if( res===undefined || res.code!==1){
          return;
      }
      if (callback) callback(res.data);
    },
  },
  reducers:{
  }
};