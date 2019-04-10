import { listReq,Req,Req2 } from '@/services/api';
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
  namespace: 'book',

  state: {
      books: [], //教材数据
      cList: {data:[]}, //课程列表
      courseInfo: {}, //课程信息
  },

  effects: {
    // 获取书籍类型
    *getBookType({ payload, callback }, { call, put }) {
      const res = yield call(Req2, payload);
      if( res===undefined || res.code!==1){
          return;
      }
      if (callback) callback(res.data);
    },
    // 新建（修改）书籍  (包括1求购、2出售、3竞拍)
    *addNewSell({ payload, callback }, { call, put }) {
      const res = yield call(Req2, payload);
      if( res===undefined || res.code!==1){
        message.error(!!payload.id?"修改失败":"发布失败！",1.5);
        if(callback) callback();
        return;
      }
      if( res.code==1 ) {
        // let theId = payload.id? payload.id:res.data.id;
        message.success(!!payload.id?"修改成功！正在前往详情页...":"发布成功！正在前往详情页...",1.5);
        return;
        // setTimeout(() => {
        //   if(type==1) {
        //     router.push("/resource/resourcedetail?type=1&id="+theId);
        //   }
        //   if(type==2) {
        //     router.push("/resource/resourcedetail?type=2&id="+theId);
        //   }
        //   if(type==3) {
        //     router.push("/resource/resourcedetail?type=5&id="+theId);
        //   }
        // }, 1800);
      }
      if(callback) callback();
    },
    // 获取书籍详细信息
    *getBookInfo({ payload, callback }, { call, put }) {
      const res = yield call(Req2, payload);
      console.log(res)
      if( res===undefined || res.code!==1){
          return;
      }
      if (callback) callback(res.data);
    },
    *getSellList({ payload, callback }, { call, put }) {
      console.log(payload)
      // return;
      const res = yield call(Req2, payload);
      console.log(res)
      
      if( res===undefined || res.code!==1){
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
    // 图片上传
    *putPic({ payload, callback }, { call, put }) {
      console.log("zhixing2")
      const res = yield call(Req2, payload);
      console.log(res)
      if( res===undefined || res.code!==1){
          return;
      }
      if (callback) callback(res.data);
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
