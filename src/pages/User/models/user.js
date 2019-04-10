import { Req } from '@/services/api';

export default {
  namespace: 'user',
  state: {
  },

  effects: {
    //发送请求
    *request({ payload, callback }, { call, put }) {
        const res = yield call(Req, payload);
        if (callback) callback(res);
    },
    
  },
  reducers:{
    
  }
};