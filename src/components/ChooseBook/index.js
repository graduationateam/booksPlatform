import React, { Component } from 'react';
import styles from '../index.less';
import { connect } from 'dva';
import { saveDto, getDto } from '@/utils/dto';
import Cookies from 'js-cookie';
import { Form, Radio } from 'antd';
const FormItem = Form.Item;

// 教材选择
const ChooseBooks = Form.create()(props => {
  const { form, getBooksList, periodData, grade_id, period_id, subject_id, book_id, isChooseSync,
    getGrade, getBook, getSubject, booksList, gradeList, subjectList, changeBookType, editData, bookData } = props;
  const radioBtn = {height:'28px', lineHeight:'28px', marginRight:'10px', borderRadius:'3px', border:'0'};
  return(
    <div className={styles.booksCon}>
      {
        isChooseSync?
        <FormItem labelCol={{ span: 2 }} wrapperCol={{ span: 22 }} label="类型">
          {form.getFieldDecorator('bookType', {
            initialValue: !!editData? editData.type=="1"?"1":"2": !!bookData? bookData.type=="1"?"1":"2" :"1",
            })(
              <Radio.Group buttonStyle="solid" style={{marginLeft:'20px'}} onChange={(e)=>{changeBookType(e.target.value)}} >
                <Radio.Button value="1" style={radioBtn} >同步教材</Radio.Button>
                <Radio.Button value="2" style={radioBtn} >非同步教材</Radio.Button>
              </Radio.Group>
          )}
        </FormItem>:""
      }
      <FormItem labelCol={{ span: 2 }} wrapperCol={{ span: 22 }} label="学段">
        {form.getFieldDecorator('period', {
          initialValue: period_id,
        })(
          <Radio.Group buttonStyle="solid" style={{marginLeft:'20px'}} onChange={(e)=>{getGrade(e.target.value)}}>
            {
              periodData.map((item,index)=>{
                return <Radio.Button key={index} value={item.period_id} style={radioBtn} onClick={getGrade.bind(this,item.period_id)} >{item.period_name}</Radio.Button>
              })
            }
          </Radio.Group>
        )}
      </FormItem>
      <FormItem labelCol={{ span: 2 }} wrapperCol={{ span: 22 }} label="年级">
        {form.getFieldDecorator('grade', {
          initialValue: grade_id,
        })(
          <div>
              <Radio.Group buttonStyle="solid" style={{marginLeft:'20px'}} onChange={(e)=>{getSubject(e.target.value)}} value={grade_id}>
              {
                gradeList.map((item,index)=>{
                  return <Radio.Button key={index} value={item.grade_id} style={radioBtn} onClick={getSubject.bind(this,item.grade_id)} >{item.grade_name}</Radio.Button>
                })
              }
              </Radio.Group>
          </div>
        )}
      </FormItem>
      <FormItem labelCol={{ span: 2 }} wrapperCol={{ span: 22 }} label="科目" >
        {
          form.getFieldDecorator('subject', {
            initialValue: subject_id?subject_id:null,
          })
        (
          <div>
            <Radio.Group buttonStyle="solid" style={{marginLeft:'20px'}} onChange={(e)=>{getBooksList(e.target.value)}} value={subject_id}>
              {
                subjectList.map((item,index)=>{
                  return <Radio.Button key={index} value={item.subject_id} style={radioBtn} onClick={getBooksList.bind(this,item.subject_id)}>{item.subject_name}</Radio.Button>
                })
              }
            </Radio.Group>
          </div>
        )}
      </FormItem>
      <FormItem labelCol={{ span: 2 }} wrapperCol={{ span: 22 }} label="教材">
        {
          form.getFieldDecorator('book', {
            initialValue: book_id?book_id:null,
          })
        ( 
          <Radio.Group buttonStyle="solid" style={{marginLeft:'20px'}} onChange={(e)=>{getBook(e.target.value)}}>
            {
              booksList.map((item,index)=>{
                return <Radio.Button key={index} value={item.id} style={radioBtn} onClick={getBook.bind(this,item.id)}>{item.name}</Radio.Button>
              })
            }
          </Radio.Group>
        )}
      </FormItem>
    </div>
  )
});
const theBookId = getDto('book_id');
const theSyncType = getDto('sync_type');
@Form.create()
@connect(({ itemData,global }) => ({
  itemData,
  global
}))
class ChooseBook extends Component {
  constructor(props){
    super(props);
    this.state = {
      visible: false,
      bookData:'',
      grade_id: '',
      period_id: '',
      subject_id: '',
      book_id: '',
      periodData: [{id:''}],
      gradeList: [{id:''}],
      subjectList: [{subject_id:''}],
      booksList: [{id:''}],
      chooseVisiable: false, //教材选择面板
      syncData: '', //同步数据
      asyncData: '', //异步数据
      syncChapterData: [], //同步树形数据
      asyncChapterData: [], //异步树形数据
      change: false,
      hasVisible: false,
      thesyncType: theBookId&&theSyncType?theSyncType:"1", //选择窗内选择的（非）同步的值
      editData: '', //编辑时放置的教材数据
    }
  }
  componentDidMount() {
    const { book_id } = this.props;
    const bookId = getDto('book_id');
   
    // 教师自带的学段、年级、科目
    const periodId = getDto('period_id');
    if( !!book_id ) {
      this.getBookData(book_id);
    }else if( bookId ) {
      this.getBookData(bookId);
    }else if(periodId) {
      this.getTeacherBook();
    }else {
      this.getPeriod(); //获取学段
    }
  }
  componentWillReceiveProps(nextProps) {
    const { change, syncData, asyncData, syncChapterData, asyncChapterData } = this.state;
    // console.log(nextProps)
    if(change!=nextProps.change ) {
      // console.log("执行")
      if(nextProps.syncType=="1") {
        this.putData(syncData,syncChapterData,true)
      }else if(nextProps.syncType=="2") {
        this.putData(asyncData,asyncChapterData,true)
      }
      if(nextProps.syncType) {
        this.setState({
          change: nextProps.change,
          grade_id: '',
          period_id: '',
          subject_id: '',
          book_id: '',
          periodData: [{id:''}],
          gradeList: [{id:''}],
          subjectList: [{subject_id:''}],
          booksList: [{id:''}],
        })
        this.getPeriod(nextProps.syncType);
      }
    }
  }
  // 通过新建时传过来的book_id或cookies存储的book_id获取教材
  getBookData = (bookId)=> {
    const { dispatch, book_id } = this.props;
    dispatch({
      type: 'global/getBookInfo2',
      payload:{
        method:'/res/resBook/get',
        id: bookId,
      },
      callback:(bookData,chapterData,periodRes,gradeRes,subjectRes,bookListRes,
        periodId,gradeId,subjectId,bookId)=>{
          if(book_id){
            this.setState({
              editData: bookData,
            })
          }
          this.setData(bookData,chapterData,periodRes,gradeRes,subjectRes,
            bookListRes,periodId,gradeId,subjectId,bookId);
      }
    });
  }
  // 教师自带学段、年级、科目时获取教材
  getTeacherBook = ()=> {
    const periodId = getDto('period_id');
    const gradeId = getDto('grade_id');
    const subjectId = getDto('subject_id');
    const { dispatch } = this.props; 
    dispatch({
      type: 'global/getTeacherBook',
      payload:{
        payloadPeriod: {
          method:'/res/resBook/getXD',
          type: 1,
        },
        payloadGrade: {
          method:'/res/resBook/getNJ',
          period_id: periodId,
          type: 1,
        },
        payloadSubject: {
          method:'/res/resBook/getXK',
          period_id: periodId,
          grade_id: gradeId,
          type: 1,
        },
        payloadBookList: {
          method:'/res/resBook/getAll',
          period_id: periodId,
          grade_id: gradeId,
          subject_id: subjectId,
          type: 1
        }
      },
      callback:(bookData,chapterData,periodRes,gradeRes,subjectRes,bookListRes,
        periodId,gradeId,subjectId,bookId)=>{
          this.setData(bookData,chapterData,periodRes,gradeRes,subjectRes,
            bookListRes,periodId,gradeId,subjectId,bookId);
      }
    });
  }
  // 存储数据
  setData = (bookData,chapterData,periodRes,gradeRes,subjectRes,
    bookListRes,periodId,gradeId,subjectId,bookId)=> {
      const { syncType, isChooseSync } = this.props;
      const { thesyncType } = this.state;
      // console.log(syncType)
      // console.log(isChooseSync)
      // console.log(thesyncType)
      if(bookData.id) {
        saveDto("book_id",bookData.id,"2592000");
      }
      saveDto("sync_type",bookData.type,"2592000");
      if(bookData.type=="1") {
        this.setState({
          bookData:bookData,
          syncData:bookData,
          syncChapterData: chapterData,
          period_id: periodId,
          grade_id: gradeId,
          subject_id: subjectId,
          book_id: bookId,
          periodData: periodRes,
          gradeList: gradeRes,
          subjectList: subjectRes,
          booksList: bookListRes,
          thesyncType: bookData.type,
        });
      }else if (bookData.type=="2") {
        this.setState({
          bookData:bookData,
          asyncData:bookData,
          asyncChapterData: chapterData,
          period_id: periodId,
          grade_id: gradeId,
          subject_id: subjectId,
          book_id: bookId,
          periodData: periodRes,
          gradeList: gradeRes,
          subjectList: subjectRes,
          booksList: bookListRes,
          thesyncType: bookData.type,
        });
      }
      this.putData(bookData,chapterData);
  }

  getPeriod = (value)=> {
    const { dispatch, syncType, isChooseSync } = this.props;
    const { syncData, thesyncType } = this.state;
    
    dispatch({
      type: 'global/getPeriod',
      payload:{
        method:'/res/resBook/getXD',
        type: !!value?value:isChooseSync?thesyncType:syncType=="1"?1 : 2
      },
      callback:(data)=>{
        this.setState({
          periodData: data,
        });
        // cookies存在时，修改默认学段
        this.getGrade(!!syncData?syncData.period_id:data[0].id)
      }
    });
  }

  // 监听学段的值并改变年级
  getGrade = (e,flag)=> {
    let periodId = e;
    const { dispatch, syncType, isChooseSync } = this.props;
    const { thesyncType } = this.state;
    dispatch({
      type: 'global/getGrade',
      payload:{
        method:'/res/resBook/getNJ',
        period_id: periodId,
        type: isChooseSync?thesyncType:syncType=="1"?1 : 2
      },
      callback:(data)=>{
        this.setState({
          gradeList: data,
          period_id: periodId,
          subjectList: !!flag?this.state.subjectList:[{id:''}],
          booksList: !!flag?this.state.booksList:[{id:''}],
          grade_id: !!flag?this.state.grade_id:'',
          subject_id: !!flag?this.state.subject_id:'',
          book_id: !!flag?this.state.book_id:'',
        });
      }
    });
  }
  
  // 监听年级并改变科目
  getSubject = (e,flag)=>{
    if(e) { var grade_id = e }else return;

    const { syncData, period_id, thesyncType } = this.state;
    const { dispatch, syncType, isChooseSync } = this.props;
    dispatch({
      type: 'global/getSubject',
      payload:{
        method:'/res/resBook/getXK',
        period_id: period_id,
        grade_id: grade_id,
        type: isChooseSync?thesyncType:syncType=="1"?1 : 2
      },
      callback:(data)=>{
        this.setState({
          subjectList: data,
          grade_id: grade_id,
          booksList: [{id:''}],
          subject_id: '',
          book_id: '',
        });
        if(!!flag) this.getBooksList(syncData.subject_id)
      }
    });
  }

  // 监听科目并获取教材列表
  getBooksList = (e)=> {
    if(e) { var subject_id = e }else return;

    const { dispatch, syncType, isChooseSync } = this.props; 
    const { period_id, grade_id, thesyncType } = this.state;
    if(!!subject_id) {
      dispatch({
        type: 'global/getBooksList',
        payload:{
          method:'/res/resBook/getAll',
          period_id: period_id,
          grade_id: grade_id,
          subject_id: subject_id,
          type: isChooseSync?thesyncType:syncType=="1"?1 : 2
        },
        callback:(data)=>{
          this.setState({
            booksList: data,
            subject_id: subject_id,
            book_id: ''
          });
        }
      });
    }
  } 
  
  // 获取教材
  getBook = (bookId)=> {
    const { dispatch, syncType, isChooseSync } = this.props;
    const { thesyncType } = this.state;
    // console.log(syncType)
    // console.log(thesyncType)
    dispatch({
      type: 'global/getBook',
      payload:{
        id: bookId,
        method: "/res/resBook/get"
      },
      callback:(bookData,chapterData)=>{
        saveDto("book_id",bookData.id,"2592000");
        saveDto("sync_type",isChooseSync?thesyncType:syncType,"2592000");
        Cookies.remove("knowledgeName");
        Cookies.remove("knowledge_id");
        if(bookData.type=="1") {
          this.setState({
            bookData:bookData,
            syncData:bookData,
            book_id: bookId,
            syncChapterData: chapterData
          });
        }else if (bookData.type=="2") {
          this.setState({
            bookData:bookData,
            asyncData:bookData,
            book_id: bookId,
            asyncChapterData: chapterData
          });
        }
        this.handleMouseLeave();
        this.putData(bookData,chapterData)
      }
    });
  }
  changeBookType = (value)=> {
    // console.log(value)
    this.setState({
      thesyncType: value,
      grade_id: '',
      period_id: '',
      subject_id: '',
      book_id: '',
      periodData: [{id:''}],
      gradeList: [{id:''}],
      subjectList: [{subject_id:''}],
      booksList: [{id:''}],
    })
    this.getPeriod(value);
  }
  // 将数据传给父级
  putData = (bookData,chapterData,flag)=> {
    const { onChange } = this.props;
    if(onChange) {
        onChange(bookData,chapterData,flag)
      }
  }
  handleCancel =()=> {
    this.setState({
      visible: false
    })
  }
  handleMouseEnter = ()=> {
    this.setState({
      chooseVisiable: true,
    })
  }
  handleMouseLeave = (e)=> {
    this.setState({
      chooseVisiable: false,
    });
  }
  render() {
    const { syncData, asyncData, booksList, gradeList, subjectList, periodData,  grade_id, 
      period_id, subject_id, book_id, chooseVisiable, editData, bookData } = this.state;
    const { syncType, isChooseSync } = this.props;
    // console.log(syncType)
    // console.log(syncData)
    // console.log(asyncData)
    // 给教材选择传递参数方法
    const chooseMethods = {
      periodData, booksList, gradeList, subjectList,
      getGrade: this.getGrade,
      getSubject: this.getSubject,
      getBook: this.getBook,
      getBooksList: this.getBooksList,
      changeBookType: this.changeBookType,
      grade_id, 
      period_id, 
      subject_id, 
      book_id,
      isChooseSync,
      editData,
      bookData
    }
    
    return (
      <div>
          <div className={styles.chooseBook} onMouseEnter={this.handleMouseEnter.bind(this)} onMouseLeave={this.handleMouseLeave.bind(this)}>
            <a>{ 
              syncType?
              syncType=="1"? syncData.name? syncData.name+" >>":"请选择教材 >>" : asyncData.name? asyncData.name+" >>":"请选择教材 >>"
              : bookData.type=="1"? syncData.name? syncData.name+" >>":"请选择教材 >>" : asyncData.name? asyncData.name+" >>":"请选择教材 >>"
            }</a>
            <div 
              className={chooseVisiable?styles.bookChooseCon:styles.bookChooseHidden} 
              onMouseEnter={this.handleMouseEnter.bind(this)}
              onMouseLeave={this.handleMouseLeave.bind(this)}
            >
              <ChooseBooks {...chooseMethods}/>
            </div>
          </div>
      </div>
    );
  }
}
export default ChooseBook;
