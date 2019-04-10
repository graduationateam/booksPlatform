/**
 * 全局的models
 */
import { sysParam } from '@/services/global';
import { Req, Req2 } from '@/services/api';

export default {
  namespace: 'global',

  state: {
    sysParam: {}, // 系统参数
    userInfo:{}
  },

  effects: {
    // 系统参数
    *getSysParam({ payload, callback }, { call, put }) {
      const res = yield call(sysParam, payload);
      yield put({
        type: '_getSysParam',
        payload: res.data,
      });
      if (callback) callback();
    },
    *getUserInfo({ payload, callback }, { call, put }) {
      const res = yield call(Req2, payload);
      if( res===undefined || res.code!==1){
        return;
      }
      console.log(res)
      if (callback) callback(res);
    },
  },

  reducers: {
    _getSysParam(state, action) {
      return {
        ...state,
        sysParam: action.payload
      };
    },
  },
};
