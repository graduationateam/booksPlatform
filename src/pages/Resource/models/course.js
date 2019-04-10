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
  namespace: 'course',

  state: {
      books: [], //教材数据
      cList: {data:[]}, //课程列表
      courseInfo: {}, //课程信息
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
      if (callback) callback(res.data);
    },
    // 新建课程
    *addCourse({ payload, callback }, { call, put }) {
      const res = yield call(Req, payload);
      console.log(res)
      if( res===undefined || res.status!=='0'){
        message.error("新建课程失败！",1.5);
        if(callback) callback();
        return;
      }
      if( res.status=='0' ) {
        console.log(payload);
        message.success("新建课程成功！正在前往课程详情...",1.5)
        setTimeout(() => {
          router.push("/resource/coursedetail?cId="+res.data.id);
        }, 1800);
      }
      if(callback) callback();
    },
    *editCourse({ payload, callback }, { call, put }) {
      console.log(payload)
      const res = yield call(Req, payload);
      if( res===undefined || res.status!=='0'){
        message.error("课程修改失败！",1.5);
        if(callback) callback();
        return;
      }
      if( res.status=='0' ) {
        message.success("课程修改成功！正在前往课程详情...",1.5)
        setTimeout(() => {
          router.push("/resource/coursedetail?cId="+payload.id);
        }, 1800);
      }
      if(callback) callback();
    },
    // 删除课程
    *deleteCourse({ payload, callback }, { call, put }) {
      
      const res = yield call(Req, payload);
      if( res===undefined || res.status!=='0'){
        message.error("删除课程失败！",1.5)
        return;
      }
      if( res.status=='0' ) {
        message.success("删除课程成功！",1.5)
      }
      if(callback) callback();
    },
    // 添加资源到课程
    *addResource({ payload, callback }, { call, put }) {
      const res = yield call(Req, payload);
      if( res===undefined || res.status!=='0'){
        message.error("添加失败！",1.5)
        return;
      }
      if( res.status=='0' ) {
        message.success("添加成功！",1.5)
      }
      if(callback) callback();
    },
    // 收藏课程(资源)
    *collectCourse({ payload, callback }, { call, put }) {
      const res = yield call(Req, payload);
      if( res===undefined || res.status!=='0'){
        message.error("收藏失败！",1.5)
        return;
      }
      if( res.status=='0' ) {
        message.success("收藏成功！",1.5)
      }
      if(callback) callback();
    },
    // 取消收藏课程(资源)
    *deleteCollect({ payload, callback }, { call, put }) {
      console.log(payload)
      const res = yield call(Req, payload);
      if( res===undefined || res.status!=='0'){
        message.error("取消收藏失败！",1.5)
        return;
      }
      if( res.status=='0' ) {
        message.success("取消收藏成功！",1.5)
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
    // _getCourse(state,{payload}){
    //   return {
    //       ...state,
    //       cList: payload
    //     }
    // },
  }
};
