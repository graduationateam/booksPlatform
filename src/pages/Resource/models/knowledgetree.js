import { listReq,Req } from '@/services/api';
import { message } from 'antd';
import Utils from '@/utils/utils';
import { reset } from 'ansi-colors';

export default {
  namespace: 'knowledgetree',
  state: {
    periodData: [{id:''}], //学段
    gradeData: [], //年级
    bookData: [], //教材
    subjectData: [], //科目
    booksListData: [], //教材列表
  },

  effects: {
    // 获取学段
    *getPeriod({ payload, callback }, { call, put }) {
        const res = yield call(Req, payload);
        if( res===undefined || res.status!=='0'){
          return;
        }
        if(callback) callback(res.data)
    },
    // 获取年级
    *getGrade({ payload, callback }, { call, put }) {
        const res = yield call(Req, payload);
        if( res===undefined || res.status!=='0'){
            return;
        }
        if(callback) callback(res.data)
    },
    // 获取科目
    *getSubject({ payload, callback }, { call, put }) {
        const res = yield call(Req, payload);
        if( res===undefined || res.status!=='0'){
            return;
        }
        res.data.map((item,index)=>{
            item.id = item.subject_id;
            item.name = item.subject_name;
        })
        if(callback) callback(res.data)
    },
    // 获取教材列表
    *getBooksList({ payload, callback }, { call, put }) {
        const res = yield call(Req, payload);
        if( res===undefined || res.status!=='0'){
            return;
        }
        if(callback) callback(res.data)
    },
    // 获取教材  
    *getBook({ payload, callback }, { call, put }) {
        const res = yield call(Req, payload);
        if( res===undefined || res.status!=='0'){
            return;
        }
        let payload2 = {
            method:'/res/resChapter/getPageList',
            book_id: res.data.id
        }
        const chapterRes = yield call(Req, payload2);
        // 树形数据整理
        const chapterData = Utils.convertArr(chapterRes.data,payload2.book_id);
        if(callback) callback(res.data,chapterData);
    },
    *getBookInfo({ payload, callback }, { call, put }) {
        const res = yield call(Req, payload);
        if( res===undefined || res.status!=='0'){
            return;
        }
        let payload2 = {
            method:'/res/resChapter/getPageList',
            book_id: payload.id
        }
        const chapterRes = yield call(Req, payload2);
        // 树形数据整理
        const chapterData = Utils.convertArr(chapterRes.data,payload2.book_id);
        if(callback) callback(res.data,chapterData);
    },

    // 获取教材信息，顺带获取其学段，年级，科目,教材列表数据
    *getBookInfo2({ payload, callback }, { call, put }) {
        const res = yield call(Req, payload);
        if( res===undefined || res.status!=='0'){
            return;
        }
        // console.log(res)
        let payloadPeriod = {
            method:'/res/resBook/getXD',
            type: res.data.type,
        }
        let payloadGrade = {
            method:'/res/resBook/getNJ',
            period_id: res.data.period_id,
            type: res.data.type,
        }
        let payloadSubject = {
            method:'/res/resBook/getXK',
            period_id: res.data.period_id,
            grade_id: res.data.grade_id,
            type: res.data.type,
        }
        let payloadBookList = {
            method:'/res/resBook/getAll',
            period_id: res.data.period_id,
            grade_id: res.data.grade_id,
            subject_id: res.data.subject_id,
            type: res.data.type
        }
        let payloadChapter = {
            method:'/res/resChapter/getPageList',
            book_id: payload.id
        }
        const periodRes = yield call(Req, payloadPeriod);
        const gradeRes = yield call(Req, payloadGrade);
        const subjectRes = yield call(Req, payloadSubject);
        const bookListRes = yield call(Req, payloadBookList);
        const chapterRes = yield call(Req, payloadChapter);
        // 树形数据整理
        const chapterData = Utils.convertArr(chapterRes.data,payloadChapter.book_id);
        if(callback) callback(res.data,chapterData,periodRes.data,gradeRes.data,subjectRes.data,bookListRes.data,
            res.data.period_id,res.data.grade_id,res.data.subject_id,payload.id);
    },

    // 根据教师自带的信息获取其学段，年级，科目,教材列表数据
    *getTeacherBook({ payload, callback }, { call, put }) {
        // const res = yield call(Req, payload);
        const periodRes = yield call(Req, payload.payloadPeriod);
        if( periodRes===undefined || periodRes.status!=='0'){
            return;
        }
        const gradeRes = yield call(Req, payload.payloadGrade);
        const subjectRes = yield call(Req, payload.payloadSubject);
        const bookListRes = yield call(Req, payload.payloadBookList);
        
        // 获取章节，并整理出树形数据
        if( bookListRes.data.length>0 ) {
            var payloadChapter = {
                method:'/res/resChapter/getPageList',
                book_id: bookListRes.data[0].id
            }
            var chapterRes = yield call(Req, payloadChapter);
            // 树形数据整理
            var chapterData = Utils.convertArr(chapterRes.data,payloadChapter.book_id);
        }else {
            var chapterData = [];
        }
        if(callback) callback(bookListRes.data.length>0?bookListRes.data[0]:[{id:''}], chapterData, periodRes.data, gradeRes.data, subjectRes.data, 
            bookListRes.data.length>0?bookListRes.data:[{id:''}], payload.payloadGrade.parent_id, payload.payloadSubject.grade_id, 
            payload.payloadBookList.subject_id, bookListRes.data.length>0?bookListRes.data[0].id:'');
    },

    // 获取初始学段或点击获取学段，同时获取其下的第一个年级，科目，教材
    *getInitPeriod({ payload, callback }, { call, put }) {
        let payloadData = payload;
        if(payload.periodId) {
            payloadData = {
                method:'/res/resBook/getXD',
            }
        }
        const res = yield call(Req, payloadData);
        if( res===undefined || res.status!=='0'){
          return;
        }
        // 获取年级
        let payloadGrade = {
            method:'/res/resBook/getNJ',
            period_id: payload.periodId?payload.periodId:res.data[0].id,
        }
        const gradeRes = yield call(Req, payloadGrade);
        
        // 获取科目
        let payloadSubject = {
            method:'/res/resBook/getXK',
            period_id: payload.periodId?payload.periodId:res.data[0].id,
            grade_id: gradeRes.data[0].id,
        }
        const subjectRes = yield call(Req, payloadSubject);

        // 获取教材
        let payloadBookList = {
            method:'/res/resBook/getAll',
            period_id: payload.periodId?payload.periodId:res.data[0].id,
            grade_id: gradeRes.data[0].id,
            subject_id: subjectRes.data[0].subject_id,
            type: 1
        }
        const bookListRes = yield call(Req, payloadBookList);

        // 获取章节，并整理出树形数据
        if( bookListRes.data.length>0 ) {
            var payloadChapter = {
                method:'/res/resChapter/getPageList',
                book_id: bookListRes.data[0].id
            }
            var chapterRes = yield call(Req, payloadChapter);
            // 树形数据整理
            var chapterData = Utils.convertArr(chapterRes.data,payloadChapter.book_id);
        }else {
            var chapterData = [];
        }
        if(callback) callback(bookListRes.data.length>0?bookListRes.data[0]:[{id:''}], chapterData, res.data, gradeRes.data, subjectRes.data, 
            bookListRes.data.length>0?bookListRes.data:[{id:''}], payload.periodId?payload.periodId:res.data[0].id, 
            gradeRes.data[0].id, subjectRes.data[0].subject_id, bookListRes.data.length>0?bookListRes.data[0].id:'');
    },
  },

  reducers:{
    _getPeriod(state,{payload}){
        return {
            ...state,
            periodData: payload.data,
        }
    },
    _getGrade(state,{payload}){
        return {
            ...state,
            gradeData: payload.data,
        }
    },
    _getSubject(state,{payload}){
        return {
            ...state,
            subjectData: payload.data,
        }
    },
    _getBooksList(state,{payload}){
        return {
            ...state,
            booksListData: payload.data
        }
    },
  }
};
