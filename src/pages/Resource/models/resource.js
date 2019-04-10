import { listReq,Req } from '@/services/api';
import { message } from 'antd';
import Utils from '@/utils/utils';
import { reset } from 'ansi-colors';
message.config({
  top: 400,
  duration: 2,
  maxCount: 3,
});
export default {
  namespace: 'resource',

  state: {
      books: [], //教材数据
      courseList: {data:[]}, //课程列表
      courseInfo: {}, //课程信息
      theResource: [], //课程下资源情况
      resourceList: {data:[]}, //第一种资源列表（如 微课列表）
      tagList: [], //标签
  },

  effects: {
    *books({ payload, callback }, { call, put }) {
        const res = yield call(Req, payload);
        if( res===undefined || res.status!=='0'){
          return;
        }
        yield put({
          type: '_books',
          payload: res,
        });
        if (callback) callback();
    },
    // 获取课程 
    *getCourse({ payload, callback }, { call, put }) {
      const res = yield call(listReq, payload);
      if( res===undefined || res.status!=='0'){
          return;
      }
      if (callback) callback(res);
    },
    // 课程信息
    *courseInfo({ payload, callback }, { call, put }) {
      const res = yield call(Req, payload);
      if( res===undefined || res.status!=='0'){
          return;
      }
      yield put({
          type: '_courseInfo',
          payload: res.data,
        });
      if (callback) callback(res);
    },
    // 课程下的相关资源(首次进入)
    *getResource({ payload, callback }, { call, put }) {
      const res = yield call(Req, payload);
      if( res===undefined || res.status!=='0'){
        return;
      }
      let payload2 = {
        course_id: payload.course_id,
        type: res.data[0].type,
        method: '/res/resSourseExtend/getKjAll',
      }
      // 获取首次展示的第一种资源（如 微课）
      const firstResource = yield call(Req, payload2);
      yield put({
        type: '_getResource',
        payload: res.data,
      });
      yield put({
        type: '_resourceList',
        payload: firstResource,
      });
    },
    // 课程下的相关资源(刷新获取)
    *getResource2({ payload, callback }, { call, put }) {
      const res = yield call(Req, payload);
      if( res===undefined || res.status!=='0'){
        return;
      }
      yield put({
        type: '_getResource',
        payload: res.data,
      });
    },
    // 各资源列表
    *resourceList({ payload, callback }, { call, put }) {
      const res = yield call(Req, payload);
      if( res===undefined || res.status!=='0'){
        return;
      }
      yield put({
        type: '_resourceList',
        payload: res,
      });
    },
    // 移除资源
    *removeResource({ payload, callback }, { call, put }) {
      console.log(payload)
      const res = yield call(Req, payload);
      if( res===undefined || res.status!=='0'){
        message.error("移除失败！",1.5)
        return;
      }
      if( res.status=='0' ) {
        message.success("移除成功！",1.5)
      }
      if(callback) callback();
    },
    // 获取全部标签
    *getTags({ payload, callback }, { call, put }) {
      const res = yield call(Req, payload);
      if( res===undefined || res.status!=='0'){
        return;
      }
      if(callback) callback(res)
      yield put({
        type: '_tagsList',
        payload: res,
      });
    },
    // 课程评分
    *getStar({ payload, callback }, { call, put }) {
      console.log(payload)
      const res = yield call(Req, payload);
      console.log(res)
      if( res===undefined || res.status!=='0'){
        message.error("评分失败！",1.5)
        return;
      }
      if( res.status=='0' ) {
        message.success("评分成功！",1.5)
      }
      if(callback) callback();
    },
    // 设置可不可见
    *setUpSee({ payload, callback }, { call, put }) {
      console.log(payload)
      const res = yield call(Req, payload);
      console.log(res)
      if( res===undefined || res.status!=='0'){
        message.error("设置失败！",1.5)
        return;
      }
      if( res.status=='0' ) {
        message.success("设置成功！",1.5)
      }
      if(callback) callback();
    },
  },

  reducers:{
    _books(state,{payload}){
        return {
            ...state,
            books: payload
          }
    },
    _courseInfo(state,{payload}){
      return {
          ...state,
          courseInfo: payload
        }
    },
    _getResource(state,{payload}){
      return {
          ...state,
          theResource: payload
        }
    },
    _firstResource(state,{payload}){
        return {
            ...state,
            resourceList: payload
          }
    },
    _resourceList(state,{payload}){
      return {
          ...state,
          resourceList: payload
        }
    },
    _tagsList(state,{payload}){
      return {
          ...state,
          tagList: payload
        }
    },
  }
};
