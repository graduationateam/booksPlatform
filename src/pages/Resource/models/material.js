import { listReq,Req } from '@/services/api';
import { message } from 'antd';
import router from 'umi/router';
import Utils from '@/utils/utils';
import { reset } from 'ansi-colors';
message.config({
  top: 400,
  duration: 2,
  maxCount: 3,
});
export default {
  namespace: 'material',

  state: {
      books: [], //教材数据
      cList: {data:[]}, //课程列表
      courseInfo: {}, //课程信息
  },

  effects: {
    // 获取课件
    *getMaterial({ payload, callback }, { call, put }) {
      const res = yield call(listReq, payload);
      if( res===undefined || res.status!=='0'){
          return;
      }
      // console.log(res)
      if (callback) callback(res);
    },
    // 新建课件
    *addMaterial({ payload, callback }, { call, put }) {
      console.log(payload)
      let type = payload.type;
      const res = yield call(Req, payload);
      
      if( res===undefined || res.status!=='0'){
        message.error(payload.id?"修改失败":"新建失败！",1.5);
        if(callback) callback();
        return;
      }
      if( res.status=='0' ) {
        let theId = payload.id? payload.id:res.data.id;
        message.success(payload.id?"修改成功！正在前往详情页...":"新建成功！正在前往详情页...",1.5);
        setTimeout(() => {
          if(type==1) {
            router.push("/resource/resourcedetail?type=1&id="+theId);
          }
          if(type==2) {
            router.push("/resource/resourcedetail?type=2&id="+theId);
          }
          if(type==5) {
            router.push("/resource/resourcedetail?type=5&id="+theId);
          }
        }, 1800);
      }
      if(callback) callback();
    },
    // 获取课件（微课、优课）信息
    *getMaterialInfo({ payload, callback }, { call, put }) {
      const res = yield call(Req, payload);
      console.log(res)
      if( res===undefined || res.status!=='0'){
          return;
      }
      if (callback) callback(res.data);
    },
    // 删除课件（微课、优课）
    *deleteMaterial({ payload, callback }, { call, put }) {
      const res = yield call(Req, payload);
      if( res===undefined || res.status!=='0'){
        message.error("删除失败！",1.5)
        return;
      }
      if( res.status=='0' ) {
        message.success("删除成功！",1.5)
      }
      if(callback) callback();
    },
    // 获取相关课件（微课、优课） 
    *getRelevant({ payload, callback }, { call, put }) {
      const res = yield call(listReq, payload);
      if( res===undefined || res.status!=='0'){
          return;
      }
      if (callback) callback(res.data);
    },
    // 点赞
    *getGood({ payload, callback }, { call, put }) {
      const res = yield call(Req, payload);
      if( res===undefined || res.status!=='0'){
          return;
      }
      if (callback) callback();
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
    // _getCourse(state,{payload}){
    //   return {
    //       ...state,
    //       cList: payload
    //     }
    // },
  }
};
