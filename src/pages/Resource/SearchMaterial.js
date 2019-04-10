import React, { Component } from 'react';
import Link from 'umi/link';
import ZSelect from '@/components/ZSelect';
import styles from './resource.less';
import { connect } from 'dva';
import { getDto } from '@/utils/dto';
import { Input, Checkbox, Modal, Button, Pagination, LocaleProvider, message } from 'antd';
import KnowledgeTree from './components/KnowledgeTree';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');
const Search = Input.Search;
message.config({
  top: 200
});
@connect(({ resource, material }) => ({
    resource, material
  }))
class SearchMaterial extends Component {
  constructor(props){
    super(props);
    this.state = {
        tipsVisible: false,
        toCatalogVisible: false,
        type: '',
        bookId: '',
        knowLedgeId: '',
        isAll: false,
        isKnowledge: false,
        lessonList: {data:[]},
        addId: '', //要添加的课件（微课、优课）ID
        see_sort: 0,
        star_sort: 0,
        searchValue: '',
        is_boutique: false, //精品
        is_ecommend: false, //推荐
        isChangStatus: false,
        theResourceId: '',
        theResourceType: 1,
    }
  }
  static defaultProps = {
    type: 1, // 类型：1微课、2课件/素材、5优课
    countNum: 16,
  }
  componentWillReceiveProps(nextProps) {
    const { changStatus, resourceId, type } = nextProps;
    const { isChangStatus, theResourceId, theResourceType } = this.state;
    if( isChangStatus!=changStatus ) {
      this.setState({
        isChangStatus: changStatus
      })
      this.changeStatus()
    }
    if(resourceId!=theResourceId) {
      this.setState({
        theResourceId: resourceId
      })
      this.changeStatus()
    }
    if(type!==theResourceType) {
      this.setState({
        theResourceType: type
      })
      this.changeStatus()
    }
  }
  changeStatus = ()=> {
    const { bookId } = this.state;
    this.getKnowledge(bookId,false)
  }

  showModal = (id)=> {
      this.setState({
        tipsVisible: true,
        addId: id,
      })
  }
  handleOk = ()=> {
    const { dispatch, type, courseId } = this.props;
    const { addId, isAll, bookId, knowLedgeId } = this.state;
    dispatch({
      type: 'course/addResource',
      payload:{
        method:'/res/resSourseExtend/save',
        course_id: courseId,
        relation_id: addId,
        type: type,
      },
      callback:()=>{
        this.handleCancel();
        if(isAll) {
          this.getKnowledge(bookId)
        }else {
          this.getKnowledge(false,knowLedgeId)
        }
        this.changeResourceNum();
      }
    });
  }
  showToCatalog = (id,name)=> {
    console.log(id)
    console.log(name)
    this.setState({
      toCatalogVisible: true,
      addId: id,
      addName: name,
    })
  }
  handleYes = ()=> {
    const { onChange } = this.props;
    const { addId, addName, isAll, bookId, knowLedgeId } = this.state;
    console.log(addId)
    console.log(addName)
    if(onChange) {
      onChange(addId, addName)
    }
    if(isAll) {
      this.getKnowledge(bookId)
    }else {
      this.getKnowledge(false,knowLedgeId)
    }
    this.handleCancel();
  }
  handleCancel =()=> {
    this.setState({
        tipsVisible: false,
        toCatalogVisible: false,
      })
  }
  // 刷新父组件资源数量
  changeResourceNum = ()=> {
    const { onChange } = this.props;
    if(onChange) {
      onChange(true);
    }
  }
  onchange= (value)=> {
    console.log(value);
  }
  // 选择树形
  onTreeSelect = (ids, e) => {
    console.log(ids);
  }
  getKnowledge = (bookId, knowLedgeId)=> {
    const { dispatch, type, courseId, countNum, resourceId } = this.props;
    // 传知识点ID,通过知识点查课件/素材
    if(!bookId){
      dispatch({
        type: 'material/getMaterial',
        payload:{
          method:'/res/resLesson/getListPage',
          knowledge_id: knowLedgeId,
          type: type,
          count: countNum,
          currpage: 1,
          course_id: courseId,
        },
        callback:(data)=>{
          this.setState({
            lessonList: data,
            knowLedgeId: knowLedgeId,
            isKnowledge: true,
            isAll: false,
            see_sort: 0,
            star_sort: 0,
            searchValue: '',
            is_boutique: false, //精品
            is_ecommend: false, //推荐
            theResourceId: resourceId,
          });
        }
      });
    }
    // 传教材ID，通过教材查该教材下所有课件/素材
    else if(!knowLedgeId){
      dispatch({
        type: 'material/getMaterial',
        payload:{
          method:'/res/resLesson/getListPage',
          book_id: bookId,
          type: type,
          count: countNum,
          currpage: 1,
          course_id: courseId,
        },
        callback:(data)=>{
          this.setState({
            lessonList: data,
            bookId: bookId,
            isKnowledge: false,
            isAll: true,
            see_sort: 0,
            star_sort: 0,
            searchValue: '',
            is_boutique: false, //精品
            is_ecommend: false, //推荐
            theResourceId: resourceId,
          });
        }
      });
    }
  }
  changePage = (pageNum)=>{
    const { dispatch, type, countNum } = this.props;
    const { isAll, bookId, knowLedgeId, isMy, see_sort, star_sort, searchValue, is_boutique, is_ecommend } = this.state;
    const user_id = getDto('user_id');
    let param = {};
    if(isAll) {
      param = { book_id: bookId }
    }else {
      param = { knowledge_id: knowLedgeId }
    }
    dispatch({
      type: 'material/getMaterial',
      payload:{
        method:'/res/resLesson/getListPage',
        ...param,
        creator_id: isMy? user_id:'',
        title: searchValue,
        type: type,
        count: countNum,
        currpage: pageNum,
        pageviews: see_sort==0?'':see_sort,
        star_val: star_sort==0?'':star_sort,
        is_ecommend: is_ecommend?"1":"",
        is_boutique: is_boutique?"1":"",
      },
      callback:(data)=>{
        this.setState({
          lessonList: data
        });
      }
    });
  }
  // ( 综合、浏览、星级 )排序
  theSorting = (sortType)=> {
    const { dispatch, type, countNum } = this.props;
    const { isAll, bookId, knowLedgeId, isMy, see_sort, star_sort, searchValue, is_boutique, is_ecommend } = this.state;
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
      type: 'material/getMaterial',
      payload:{
        method:'/res/resLesson/getListPage',
        ...param,
        title: searchValue,
        creator_id: isMy? user_id:'',
        is_ecommend: is_ecommend?"1":"",
        is_boutique: is_boutique?"1":"",
        type: type,
        count: countNum,
        currpage: 1,
        pageviews: pageviews,
        star_val: star_val,
      },
      callback:(data)=>{
        this.setState({
          lessonList: data,
          see_sort: !!pageviews?pageviews:0,
          star_sort: !!star_val?star_val:0,
        });
      }
    });
  }
  tagsChange = (num,e)=> {
    const { dispatch, type, countNum } = this.props;
    const { isAll, bookId, knowLedgeId, isMy, searchValue, is_ecommend, is_boutique  } = this.state;
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
      type: 'material/getMaterial',
      payload:{
        method:'/res/resLesson/getListPage',
        ...param,
        title: searchValue,
        creator_id: isMy? user_id:'',
        is_ecommend: recommend?"1":"",
        is_boutique: boutique?"1":"",
        type: type,
        count: countNum,
        currpage: 1,
      },
      callback:(data)=>{
        this.setState({
          lessonList: data,
          see_sort: 0,
          star_sort: 0,
        });
      }
    });
  }
  // 通过搜索框搜索
  fromSearch = (value)=> {
    const { dispatch, type, countNum } = this.props;
    const { isAll, bookId, knowLedgeId, isMy } = this.state;
    const user_id = getDto('user_id');
    let param = {};
    if(isAll) {
      param = { book_id: bookId }
    }else {
      param = { knowledge_id: knowLedgeId }
    }
    dispatch({
      type: 'material/getMaterial',
      payload:{
        method:'/res/resLesson/getListPage',
        ...param,
        title: value,
        creator_id: isMy? user_id:'',
        type: type,
        count: countNum,
        currpage: 1,
      },
      callback:(data)=>{
        if(data.data.length==0) {
          message.warning("查无此微课...",1);
          return;
        }
        this.setState({
          lessonList: data,
          see_sort: 0,
          star_sort: 0,
          searchValue: value,
          is_ecommend: false,
          is_boutique: false,
        });
      }
    });
  }
  render() {
    const { tipsVisible, toCatalogVisible, lessonList, see_sort, star_sort, is_boutique, is_ecommend, isAll, isKnowledge } = this.state;
    const { type, countNum, toCatalog, resourceId } = this.props;
    let typeText = type==1?"微课":type==2?"课件/素材":"优课";
    return (
    <div className="container" style={{margin:'0 0 0 -20px',backgroundColor:'#fff'}}>
      <div className={styles.clearFixCon}>
        <KnowledgeTree 
            onChange={this.getKnowledge}
            haveBoxShadow={false}
        />
        <div className={styles.courseCon} style={{width: '920px',marginLeft:'0', marginBottom:'0', boxShadow:'0 0 0 #fff'}}>
            <ul className={styles.sorting}>
              {
                lessonList.data.length>0||isAll||isKnowledge?
                <li className={styles.sortingBtn}>
                  <a onClick={this.theSorting.bind(this,1)}>综合</a>
                  <a onClick={this.theSorting.bind(this,2)} >浏览{see_sort==1?<i className={styles.up}></i>:see_sort==2?<i className={styles.down}></i>:""}</a>
                  <a onClick={this.theSorting.bind(this,3)} >星级{star_sort==1?<i className={styles.up}></i>:star_sort==2?<i className={styles.down}></i>:""}</a>
                  <Checkbox style={{marginLeft:'20px'}} onChange={this.tagsChange.bind(this,1)} checked={is_boutique}>精品</Checkbox>
                  <Checkbox onChange={this.tagsChange.bind(this,2)} checked={is_ecommend}>推荐</Checkbox>
                </li>:""
              }
              <li className={styles.searchResult}>共<span>{lessonList.totalresult}</span>个结果</li>
              <li className={styles.theSearch}>
                <Search
                  placeholder={"搜索"}
                  onSearch={value => this.fromSearch(value)}
                  style={{ width: 200 }}
                />
              </li>
            </ul>
            <ul className={styles.detailSearchStyle} style={{paddingTop:'0'}}>
                {
                  lessonList.data.map((item,index)=>{
                      return <li key={index}>
                          <div className={styles.linkStyle} >
                              <Link to={{ pathname:'/resource/resourcedetail?type='+item.type+'&id='+item.id }} target="_blank" >
                                  <div className={styles.img} style={{backgroundImage: item.cover_url?'url('+item.cover_url+')':`url(${require('@/assets/test1.jpg')})`}} >
                                      <div className={styles.type}>{item.file_type}</div>
                                  </div>
                              </Link>
                              <div className={styles.btn}>
                                  <div className={styles.isSee}>
                                  {
                                    toCatalog?
                                    item.id==resourceId? <a>已添加至目录</a>:
                                    <a onClick={this.showToCatalog.bind(this,`${item.id}`,`${item.title}`)}><i className={styles.iconAdd} title="添加"></i>添加至目录</a>
                                    :item.repeat==1? <a>已添加至课程</a>:
                                    <a onClick={this.showModal.bind(this,`${item.id}`)}><i className={styles.iconAdd} title="添加"></i>添加至课程</a>
                                  }
                                  </div>
                              </div>
                          </div>
                          <Link to={'/resource/resourcedetail?type='+type+'&id='+item.id} >
                            <div className={styles.word}>
                                { item.is_boutique==1?<span>精</span>:'' }
                                { item.is_ecommend==1?<span>荐</span>:'' }
                                {item.title}
                            </div>
                          </Link>
                          <div className={styles.userInfo}>
                              <b className={styles.avatar} style={{backgroundImage: !!item.creator_img_url?'url('+item.creator_img_url+')':`url(${require('@/assets/avatar.jpg')})`}} ></b>
                              <span className={styles.name}>{item.creator_user_name}</span>
                              <span className={styles.other}><i className={styles.iconEye}></i>{item.pageviews?item.pageviews>=10000?item.pageviews/10000+"w":item.pageviews : 0}</span>
                              <span className={styles.other}><i className={styles.iconHalfStar}></i>{item.star_val?item.star_val : 0}</span>
                          </div>
                      </li>
                  })
                }
            </ul>
            {/* 分页 */}
            {
              lessonList.data.length>0?
              <div className={styles.paging}>
                <LocaleProvider locale={zhCN}>
                  <Pagination showQuickJumper current={lessonList.currpage} total={lessonList.totalresult} onChange={this.changePage} defaultPageSize={countNum}/>
                </LocaleProvider>
              </div>
              :''
            }
        </div>
      </div>
        <Modal
            visible={tipsVisible}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
            footer={[
                <div key="submit" style={{width:'100%',marginLeft:'-185px'}}>
                <Button key="submit" type="primary" onClick={this.handleOk}>是</Button>
                <Button key="back" onClick={this.handleCancel}>否</Button>
                </div>,
            ]}
        > 
          <div style={{textAlign:'center'}}>
            <div style={{width:'155px',height:'155px',margin:'0 auto', backgroundImage: `url(${require('@/assets/add.png')})`}}></div>
            <p>是否将此{typeText}添加至本课程下面？</p>
          </div>
        </Modal>
        {/* 系列课程添加资源至目录 */}
        <Modal
            visible={toCatalogVisible}
            onOk={this.handleYes}
            onCancel={this.handleCancel}
            footer={[
                <div key="submit" style={{width:'100%',marginLeft:'-185px'}}>
                <Button key="submit" type="primary" onClick={this.handleYes}>是</Button>
                <Button key="back" onClick={this.handleCancel}>否</Button>
                </div>,
            ]}
        > 
          <div style={{textAlign:'center'}}>
            <div style={{width:'155px',height:'155px',margin:'0 auto', backgroundImage: `url(${require('@/assets/add.png')})`}}></div>
            <p>是否将此{typeText}添加至目录？</p>
          </div>
        </Modal>
    </div>
    );
  }
}
export default SearchMaterial;
