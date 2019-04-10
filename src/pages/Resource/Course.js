import React, { Component } from 'react';
import Link from 'umi/link';
import { connect } from 'dva';
import Zheader from '@/components/Zheader';
import ZFooter from '@/components/ZFooter';
import styles from './resource.less';
import { getDto } from '@/utils/dto';
import { Input, Select, Pagination, LocaleProvider, Modal, Checkbox, Tooltip, Button } from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import XRadioBtn from '@/components/XRadioBtn';
import KnowledgeTree from './components/KnowledgeTree';
import ResourceMenu from './components/ResourceMenu';
const Search = Input.Search;
const Option = Select.Option;
const courseTypeData = [
  {value:1,name:'标准课程'},
  {value:2,name:'专题课程'},
]
@connect(({ course, itemData }) => ({
  course,
  itemData
}))
class Course extends Component {
  constructor(props){
    super(props);
    this.state = {
      courseList: {data:[]}, //课程列表
      bookId: '', 
      knowLedgeId: '',
      isAll: false,  // 树形是否选中教材
      isKnowledge: false,  // 树形是否选中知识点
      type: 0,  // 不限、标准课程、专题课程
      isMy: false, // 判断我的课程、所有课程
      deleteShow: false,  //删除课程弹窗
      delete_id: '', 
      see_sort: 0, // 浏览排序（0默认，1上升，2下降）
      star_sort: 0, // 星级排序（0默认，1上升，2下降）
      searchValue: '',
      is_boutique: false, //精品
      is_ecommend: false, //推荐
      searchType: 1, //搜索类型
      buildVisible: false,
    }
  }
  onChange= (value)=> {
    console.log(value);
  }
  changeType = (type)=> {
    const { dispatch } = this.props;
    const { isAll, isKnowledge, bookId, knowLedgeId, isMy } = this.state;
    const user_id = getDto('user_id');
    this.setState({
      type: type,
      see_sort: 0,
      star_sort: 0,
      is_boutique: false, //精品
      is_ecommend: false, //推荐
    })
    let id = '';
    let payload = {};
    if( isAll ) id = bookId;
    if( isKnowledge ) id = knowLedgeId;
    if(!!id){
      if(type==0&&isAll) {
        payload = {
          method:'/res/resCourse/getListPage',
          book_id: id,
        }
      }else if(type==0&&isKnowledge){
        payload = {
          method:'/res/resCourse/getListPage',
          knowledge_id: id,
        }
      }else if(type!=0&&isAll) {
        payload = {
          method:'/res/resCourse/getListPage',
          book_id: id,
          type: type,
        }
      }else if(type!=0&&isKnowledge) {
        payload = {
          method:'/res/resCourse/getListPage',
          knowledge_id: id,
          type: type,
        }
      }
      dispatch({
        type: 'course/getCourse',
        payload: {
          ...payload,
          count: 5,
          currpage: 1,
          creator_id: isMy? user_id:''
        },
        callback:(data)=>{
          this.setState({
            courseList: data,
            searchValue:'',
            searchType: 1,
          });
        }
      });
    }
  }
  getKnowledge = (bookId, knowLedgeId)=> {
    const { dispatch } = this.props;
    const { type, isMy } = this.state;
    const user_id = getDto('user_id');
    // 传知识点ID,通过知识点查课程
    if(!bookId){
      dispatch({
        type: 'course/getCourse',
        payload:{
          method:'/res/resCourse/getListPage',
          knowledge_id: knowLedgeId,
          creator_id: isMy? user_id:'',
          type: type==0?'':type,
          count: 5,
          currpage: 1,
        },
        callback:(data)=>{
          this.setState({
            courseList: data,
            knowLedgeId: knowLedgeId,
            isKnowledge: true,
            isAll: false,
            see_sort: 0,
            star_sort: 0,
            searchValue:'',
            is_boutique: false, //精品
            is_ecommend: false, //推荐
            searchType: 1,
          });
        }
      });
    }
    // 传教材ID，通过教材查该教材下所有课程
    else if(!knowLedgeId||bookId=="a"){
      // console.log(bookId)
      dispatch({
        type: 'course/getCourse',
        payload:{
          method:'/res/resCourse/getListPage',
          book_id: bookId,
          creator_id: isMy? user_id:'',
          type: type==0?'':type,
          count: 5,
          currpage: 1,
        },
        callback:(data)=>{
          this.setState({
            courseList: data,
            bookId: bookId,
            isKnowledge: false,
            isAll: bookId=="a"?false:true,
            see_sort: 0,
            star_sort: 0,
            searchValue:'',
            is_boutique: false, //精品
            is_ecommend: false, //推荐
            searchType: 1,
          });
        }
      });
    }
  }
  // 改变页码
  changePage = (pageNum)=>{
    const { dispatch } = this.props;
    const { isAll, bookId, knowLedgeId, type, isMy, see_sort, star_sort, searchValue, is_ecommend, is_boutique, searchType } = this.state;
    const user_id = getDto('user_id');
    let param = {};
    if(isAll) {
      param = { book_id: bookId }
    }else {
      param = { knowledge_id: knowLedgeId }
    }
    dispatch({
      type: 'course/getCourse',
      payload:{
        method:'/res/resCourse/getListPage',
        ...param,
        title: searchValue,
        creator_id: isMy? user_id:'',
        type: type==0?'':type,
        count: 5,
        currpage: pageNum,
        pageviews: see_sort==0? '': see_sort,
        star_val: star_sort==0? '': star_sort,
        is_ecommend: is_ecommend?"1":"",
        is_boutique: is_boutique?"1":"",
        searchType: searchType,
      },
      callback:(data)=>{
        this.setState({
          courseList: data
        });
      }
    });
  }
  // 所有或我的
  changeMyOrAll = (value)=> {
    const { dispatch } = this.props;
    const { isAll, bookId, knowLedgeId, type } = this.state;
    const user_id = getDto('user_id');
    this.setState({
      isMy: value,
      is_boutique: false, //精品
      is_ecommend: false, //推荐
    })
    if(!bookId||bookId=="a") return;
    let param = {};
    if(isAll) {
      param = { book_id: bookId }
    }else {
      param = { knowledge_id: knowLedgeId }
    }
    dispatch({
      type: 'course/getCourse',
      payload:{
        method:'/res/resCourse/getListPage',
        ...param,
        type: type==0?'':type,
        creator_id: value? user_id:'',
        count: 5,
        currpage: 1,
      },
      callback:(data)=>{
        this.setState({
          courseList: data,
          see_sort: 0,
          star_sort: 0,
          searchValue:'',
          searchType: 1,
        });
      }
    });
  }
  showModal = (id)=> {
    this.setState({
      deleteShow: true,
      delete_id: id
    })
  }
  // 删除
  onDelete = ()=> {
    const { dispatch } = this.props;
    const { delete_id } = this.state;
    dispatch({
      type: 'course/deleteCourse',
      payload:{
        method: "/res/resCourse/delete" ,
        id: delete_id
      },
      callback:()=>{
        this.changeMyOrAll(true)
        this.handleCancel()
      }
    });
  }
  // ( 综合、浏览、星级 )排序
  theSorting = (sortType)=> {
    const { dispatch } = this.props;
    const { isAll, bookId, knowLedgeId, type, isMy, see_sort, star_sort, searchValue, is_ecommend, 
      is_boutique, searchType, buildVisible } = this.state;
    const user_id = getDto('user_id');
    let pageviews='';
    let star_val='';
    let param = {};
    switch(sortType) {
      case 1: pageviews = '';star_val = '';break;
      case 2: pageviews = see_sort==0? 1:see_sort==1? 2:'';star_val=''; break;
      case 3: star_val = star_sort==0? 1:star_sort==1? 2:'';pageviews=''; break;
    }
    if(isAll) {
      param = { book_id: bookId }
    }else {
      param = { knowledge_id: knowLedgeId }
    }
    dispatch({
      type: 'course/getCourse',
      payload:{
        method:'/res/resCourse/getListPage',
        ...param,
        name: searchValue,
        creator_id: isMy? user_id:'',
        type: type==0?'':type,
        is_ecommend: is_ecommend?"1":"",
        is_boutique: is_boutique?"1":"",
        count: 5,
        currpage: 1,
        pageviews: pageviews,
        star_val: star_val,
        searchType: searchType,
      },
      callback:(data)=>{
        this.setState({
          courseList: data,
          see_sort: !!pageviews?pageviews:0,
          star_sort: !!star_val?star_val:0,
        });
      }
    });
  }
  // 精品、推荐
  tagsChange = (num,e)=> {
    const { dispatch } = this.props;
    const { isAll, bookId, knowLedgeId, isMy, searchValue, is_ecommend, is_boutique, type, searchType  } = this.state;
    const user_id = getDto('user_id');
    let param = {};
    let boutique = is_boutique;
    let recommend = is_ecommend;
    switch(num) {
      case 1: 
        boutique = e.target.checked;
        this.setState({
          is_boutique: e.target.checked, //精品
        });break;
      case 2: 
        recommend = e.target.checked;
        this.setState({
          is_ecommend: e.target.checked, //推荐
        });break;
    }
    if(isAll) {
      param = { book_id: bookId }
    }else {
      param = { knowledge_id: knowLedgeId }
    }
    dispatch({
      type: 'course/getCourse',
      payload:{
        method:'/res/resCourse/getListPage',
        ...param,
        name: searchValue,
        creator_id: isMy? user_id:'',
        is_ecommend: recommend?"1":"",
        is_boutique: boutique?"1":"",
        type: type==0?'':type,
        count: 5,
        currpage: 1,
        searchType: searchType,
      },
      callback:(data)=>{
        this.setState({
          courseList: data,
          see_sort: 0,
          star_sort: 0,
        });
      }
    });
  }
  // 通过搜索框搜索
  fromSearch = (value)=> {
    const { dispatch } = this.props;
    const { isAll, bookId, knowLedgeId, type, isMy, searchType } = this.state;
    const user_id = getDto('user_id');
    let param = {};
    if(isAll) {
      param = { book_id: bookId }
    }else {
      param = { knowledge_id: knowLedgeId }
    }
    dispatch({
      type: 'course/getCourse',
      payload:{
        method:'/res/resCourse/getListPage',
        ...param,
        name: value,
        creator_id: isMy? user_id:'',
        type: type==0?'':type,
        count: 5,
        currpage: 1,
        searchType: searchType,
      },
      callback:(data)=>{
        this.setState({
          courseList: data,
          see_sort: 0,
          star_sort: 0,
          searchValue: value,
          is_ecommend: false,
          is_boutique: false,
        });
      }
    });
  }
  // 改变搜索类型
  searchTypeChange = (value)=> {
    this.setState({
      searchType: value
    })
  }
  showBuilding = ()=> {
    this.setState({
      buildVisible: true,
    })
  }
  handleCancel = ()=> {
    this.setState({
      buildVisible: false,
      deleteShow: false,
    })
  }
  render() {
    const { courseList, isMy, deleteShow, see_sort, star_sort, isAll, isKnowledge, is_boutique, is_ecommend, buildVisible  } = this.state;
    const user_id = getDto('user_id');
    return (
      <div>
        <Zheader addr={4}/>
        <div className={styles.moreCon}>
          <div className="container">
            {/* 知识点树共用组件 */}
            <KnowledgeTree 
              onChange={this.getKnowledge}
            />
            <div className={styles.courseTabs}>
               <ul className={styles.isMyCourse}>
                   <li className={!isMy?styles.active:''} onClick={this.changeMyOrAll.bind(this,false)}>所有课程</li>
                   <li className={isMy?styles.active:''} onClick={this.changeMyOrAll.bind(this,true)}>我的课程</li>
               </ul>
            </div>
            <div className={styles.courseCon}>
                <div className={styles.btnCon}>
                  <XRadioBtn
                    option={courseTypeData}
                    initial="不限"
                    onChange={this.changeType}
                    style={{height:'32px',lineHeight:'32px'}}
                  />
                  <div>
                    <Link className={styles.releaseCourse} to="/resource/createcourse">+新建课程</Link>
                    {
                      courseList.data.length>0||isAll||isKnowledge?
                      <div className={styles.theSearchCon}>
                        <Select style={{ width: '100px',marginRight:'6px',color:'#999' }} defaultValue={1} onChange={this.searchTypeChange}>
                          <Option value={1} style={{color:'#999'}}>按标题</Option>
                          <Option value={2} style={{color:'#999'}}>按用户名</Option>
                          <Option value={3} style={{color:'#999'}}>按学校</Option>
                        </Select>
                        <Search
                          placeholder="搜索课程"
                          onSearch={value => this.fromSearch(value)}
                          style={{ width: 200 }}
                        />
                      </div>
                      :""
                    } 
                  </div>  
                </div>
                <ul className={styles.sorting}>
                  {
                    courseList.data.length>0||isAll||isKnowledge?
                    <li className={styles.sortingBtn}>
                      <a onClick={this.theSorting.bind(this,1)} >综合</a>
                      <a onClick={this.theSorting.bind(this,2)} style={{color:see_sort==1||see_sort==2?'#6fc400':''}}>浏览{see_sort==1?<i className={styles.up}></i>:see_sort==2?<i className={styles.down}></i>:""}</a>
                      <a onClick={this.theSorting.bind(this,3)} style={{color:star_sort==1||star_sort==2?'#6fc400':''}}>星级{star_sort==1?<i className={styles.up}></i>:star_sort==2?<i className={styles.down}></i>:""}</a>
                      <Checkbox style={{marginLeft:'20px'}} onChange={this.tagsChange.bind(this,1)} checked={is_boutique}>精品</Checkbox>
                      <Checkbox onChange={this.tagsChange.bind(this,2)} checked={is_ecommend}>推荐</Checkbox>
                    </li>
                    :''
                  }
                  <li className={styles.searchResult}>共<span>{courseList.totalresult?courseList.totalresult:0}</span>个结果</li>
                </ul>
                <ul className={styles.courseList}>
                  {/* 课程列表 */}
                  {/* type=1 为标准课程， type=2 为专题课程
                      这里只列 标准课程跟专题课程
                  */}
                  {
                    courseList.data.map((item,index)=>{
                      return courseList.data.length>0? 
                      <li key={index}>
                        <div className={styles.courseInfo}>
                            <div className={styles.courseType} style={{backgroundColor:item.type==1? '#ff9900':'#6fc400'}} >{item.type==1? '标准课程':'专题课程'}</div>
                            
                            <Link to={{ pathname:"/resource/"+item.type==1?"coursedetail":"seriescourse"+"?cId="+item.id+"&type="+item.type }} target="_blank" >
                              <div className={styles.courseTitle}>
                                <b className={styles.courseName}>{item.name}</b>
                                { item.is_boutique==1?<span>精</span>:'' }
                                { item.is_ecommend==1?<span>荐</span>:'' }
                              </div>
                            </Link>
                            <div className={styles.others}>
                              <div className={styles.teacherInfo}>
                                <b className={styles.avatar} style={{backgroundImage: !!item.creator_img_url?'url('+item.creator_img_url+')':`url(${require('@/assets/avatar.jpg')})`}}></b>
                                <span>{item.creator_user_name}</span>
                              </div>
                              <div className={styles.collection}>收藏（{item.collect_total}）</div>
                              <div className={styles.collection}>星评（{item.star_val?item.star_val:0}）</div>
                            </div>
                        </div>
                        <div className={styles.courseRelated}>
                          {
                            item.type==1? 
                            item.course_res.map((sitem,sindex)=>{
                              return <div key={sindex} className={styles.related}>
                                <span>{sitem.type_name}<span>（{sitem.count}）</span></span>
                            </div>
                            })
                            : <div className={styles.introduction}>
                              {
                                item.catalogData?item.catalogData.map((catalogItem,catalogIndex)=> {
                                  return catalogIndex<2?<span key={catalogIndex}>{catalogItem.name}</span>:''
                                }):''
                              }
                              </div>
                          }
                          <div className={styles.handleBtns}>
                          {
                            item.creator_id==user_id?
                            <div className={styles.isSee}>
                              <a onClick={this.showBuilding}><Tooltip placement="bottom" title="发布"><i className={styles.iconRelease}></i></Tooltip></a>
                              <Link to={`/resource/createcourse?cId=${item.id}&type=${item.type}`} ><Tooltip placement="bottom" title="编辑"><i className={styles.iconEdit}></i></Tooltip></Link>
                              <a onClick={this.showModal.bind(this,`${item.id}`)}><Tooltip placement="bottom" title="删除"><i className={styles.iconDelete}></i></Tooltip></a>
                            </div> 
                            : <div className={styles.isSee}>
                                <a onClick={this.showBuilding}><Tooltip placement="bottom" title="发布"><i className={styles.iconRelease}></i></Tooltip></a>
                              </div>
                          }
                          </div>
                        </div>
                      </li>
                      : ''
                    })
                  }
                </ul>
                {/* 分页 */}
                {
                  courseList.data.length>0?
                  <div className={styles.paging}>
                    <LocaleProvider locale={zhCN}>
                      <Pagination showQuickJumper current={courseList.currpage} total={courseList.totalresult} onChange={this.changePage} defaultPageSize={5}/>
                    </LocaleProvider>
                  </div>
                  :''
                }
            </div>
          </div>
        </div>
        {/* 删除弹窗 */}
        <Modal
          onCancel={this.handleCancel}
          onOk={this.onDelete}
          visible={deleteShow}
          okText="是"
          cancelText="否"
        >
          <div style={{textAlign:'center'}}>
            <div style={{width:'155px',height:'155px',margin:'0 auto', backgroundImage: `url(${require('@/assets/remove.png')})`}}></div>
            <p>你确定删除该课程吗？</p>
          </div>
        </Modal>
        <Modal
          visible={buildVisible}
          onCancel={this.handleCancel}
          style={{textAlign:'center'}}
          footer={[
            <div style={{width:'100%',marginLeft:'-210px'}}><Button key="back" type="primary" onClick={this.handleCancel}>好的</Button></div>,
          ]}
        >
          <div style={{textAlign:'center'}}>
            <div style={{width:'155px',height:'155px',margin:'0 auto', backgroundImage: `url(${require('@/assets/build.png')})`}}></div>
            <p>正在建设中...</p>
          </div>
        </Modal>
        <ZFooter />
      </div>
    );
  }
}

export default Course;
