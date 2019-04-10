import { Req,listReq} from '@/services/api';

export default {
  namespace: 'exercise',
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
    }
  },
  reducers:{
  }
};