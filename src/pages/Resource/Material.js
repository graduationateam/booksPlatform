import React, { Component } from 'react';
import Link from 'umi/link';
import { connect } from 'dva';
import Zheader from '@/components/Zheader';
import ZFooter from '@/components/ZFooter';
import styles from './resource.less';
import { getDto } from '@/utils/dto';
import { Input, Checkbox, Modal, Pagination, LocaleProvider, Select, message, Tooltip, Button } from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import KnowledgeTree from './components/KnowledgeTree';
import ResourceMenu from './components/ResourceMenu';
const Search = Input.Search;
const Option = Select.Option;
message.config({
  top: 200
});
@connect(({ material, itemData }) => ({
  material, itemData
}))
class Material extends Component {
  constructor(props){
    super(props);
    this.state = {
        tipsVisible: false,
        bookId: '',
        knowLedgeId: '',
        isAll: false,
        isKnowledge: false,
        materialList: {data:[]},
        isMy: false, // 判断我的课件、所有课件
        deleteShow: false,  //删除弹窗
        delete_id: '',
        see_sort: 0,
        star_sort: 0,
        searchValue: '',
        fileType: '', //文件类型
        is_boutique: false, //精品
        is_ecommend: false, //推荐
        searchType: 1,
        buildVisible: false,
    }
  }
  componentDidMount() {
    this.getItemData();
  }
  getItemData = ()=> {
    const { dispatch } = this.props;
    //获取数据字段 文件类型
    dispatch({
      type: 'itemData/get',//活动类型
      num: 'fileType',
      payload:{method:'/sys/item/getInfo'}
    });
  }
  
  getKnowledge = (bookId, knowLedgeId)=> {
    console.log(bookId)
    const { dispatch } = this.props;
    // 传知识点ID,通过知识点查课件/素材
    if(!bookId){
      dispatch({
        type: 'material/getMaterial',
        payload:{
          method:'/res/resLesson/getListPage',
          knowledge_id: knowLedgeId,
          type: 2,
          count: 16,
          currpage: 1,
        },
        callback:(data)=>{
          this.setState({
            materialList: data,
            knowLedgeId: knowLedgeId,
            isKnowledge: true,
            isAll: false,
            see_sort: 0,
            star_sort: 0,
            searchValue: '',
            fileType: '', //文件类型
            is_boutique: false, //精品
            is_ecommend: false, //推荐
            searchType: 1,
          });
        }
      });
    }
    // 传教材ID，通过教材查该教材下所有课件/素材
    else if(!knowLedgeId||bookId=="a"){
      dispatch({
        type: 'material/getMaterial',
        payload:{
          method:'/res/resLesson/getListPage',
          book_id: bookId,
          type: 2,
          count: 16,
          currpage: 1,
        },
        callback:(data)=>{
          this.setState({
            materialList: data,
            bookId: bookId,
            isKnowledge: false,
            isAll: bookId=="a"?false:true,
            see_sort: 0,
            star_sort: 0,
            searchValue: '',
            fileType: '', //文件类型
            is_boutique: false, //精品
            is_ecommend: false, //推荐
            searchType: 1,
          });
        }
      });
    }
  }
  showModal = (id)=> {
    this.setState({
      tipsVisible: true,
      delete_id: id
    })
  }
  changeMyOrAll = (value)=> {
    const { dispatch } = this.props;
    const { isAll, bookId, knowLedgeId } = this.state;
    const user_id = getDto('user_id');
    this.setState({
      isMy: value
    })
    if(!bookId||bookId=="a") return;
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
        creator_id: value? user_id:'',
        type: 2,
        count: 16,
        currpage: 1,
      },
      callback:(data)=>{
        this.setState({
          materialList: data,
          see_sort: 0,
          star_sort: 0,
          searchValue: '',
          fileType: '', //文件类型
          is_boutique: false, //精品
          is_ecommend: false, //推荐
          searchType: 1,
        });
      }
    });
  }
  handleClick = (e)=> {
    console.log(e)
  }
  changePage = (pageNum)=>{
    const { dispatch } = this.props;
    const { isAll, bookId, knowLedgeId, isMy, see_sort, star_sort, searchValue, is_boutique, is_ecommend, fileType, searchType } = this.state;
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
        title: searchValue,
        creator_id: isMy? user_id:'',
        is_ecommend: is_ecommend?"1":"",
        is_boutique: is_boutique?"1":"",
        type: 2,
        count: 16,
        currpage: pageNum,
        pageviews: see_sort==0?'':see_sort,
        star_val: star_sort==0?'':star_sort,
        file_type: fileType,
        searchType: searchType,
      },
      callback:(data)=>{
        this.setState({
          materialList: data
        });
      }
    });
  }
  onDelete = ()=> {
    const { dispatch } = this.props;
    const { delete_id } = this.state;
    dispatch({
      type: 'material/deleteMaterial',
      payload:{
        method: "/res/resLesson/delete" ,
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
    const { isAll, bookId, knowLedgeId, isMy, see_sort, star_sort, searchValue, is_boutique, is_ecommend, fileType, searchType } = this.state;
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
        type: 2,
        count: 16,
        currpage: 1,
        pageviews: pageviews,
        star_val: star_val,
        file_type: fileType,
        searchType: searchType,
      },
      callback:(data)=>{
        this.setState({
          materialList: data,
          see_sort: !!pageviews?pageviews:0,
          star_sort: !!star_val?star_val:0,
        });
      }
    });
  }
  // 通过搜索框搜索
  fromSearch = (value)=> {
    const { dispatch } = this.props;
    const { isAll, bookId, knowLedgeId, isMy, searchType } = this.state;
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
        type: 2,
        count: 16,
        currpage: 1,
        searchType: searchType,
      },
      callback:(data)=>{
        if(data.data.length==0) {
          message.warning("查无此课件/素材...",1);
          return;
        }
        this.setState({
          materialList: data,
          see_sort: 0,
          star_sort: 0,
          searchValue: value,
          is_ecommend: false,
          is_boutique: false,
          file_type: '',
        });
      }
    });
  }
  // 改变文件类型
  fileTypeChange = (value)=> {
    console.log(value)
    const { dispatch } = this.props;
    const { isAll, bookId, knowLedgeId, isMy, searchValue, is_boutique, is_ecommend, searchType, buildVisible } = this.state;
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
        title: searchValue,
        creator_id: isMy? user_id:'',
        is_ecommend: is_ecommend?"1":"",
        is_boutique: is_boutique?"1":"",
        file_type: value,
        type: 2,
        count: 16,
        currpage: 1,
        searchType: searchType,
      },
      callback:(data)=>{
        this.setState({
          materialList: data,
          see_sort: 0,
          star_sort: 0,
          fileType: value,
        });
      }
    });
  }
  tagsChange = (num,e)=> {
    const { dispatch } = this.props;
    const { isAll, bookId, knowLedgeId, isMy, searchValue, is_boutique, is_ecommend, fileType, searchType } = this.state;
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
        file_type: fileType,
        type: 2,
        count: 16,
        currpage: 1,
        searchType: searchType,
      },
      callback:(data)=>{
        this.setState({
          materialList: data,
          see_sort: 0,
          star_sort: 0,
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
      tipsVisible: false,
    })
  }
  render() {
    const { tipsVisible, materialList, isMy, see_sort, star_sort, is_ecommend, is_boutique, isAll, isKnowledge, buildVisible } = this.state;
    const { itemData:{fileTypeData} } = this.props;
    const user_id = getDto('user_id');
    console.log(materialList)
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
                   <li className={!isMy?styles.active:''} onClick={this.changeMyOrAll.bind(this,false)}>所有课件/素材</li>
                   <li className={isMy?styles.active:''} onClick={this.changeMyOrAll.bind(this,true)}>我的课件/素材</li>
               </ul>
            </div>
            <div className={styles.courseCon}>
                <div className={styles.btnCon}>
                  <div>
                  <Link className={styles.releaseCourse} to={"/resource/createLesson?type=2"} >上传资源</Link>
                    {
                      materialList.data.length>0||isAll||isKnowledge?
                      <div className={styles.theSearchCon}>
                        <Select style={{ width: '100px',marginRight:'6px',color:'#999' }} defaultValue={1} onChange={this.searchTypeChange}>
                          <Option value={1} style={{color:'#999'}}>资源</Option>
                          <Option value={2} style={{color:'#999'}}>发布者</Option>
                          <Option value={3} style={{color:'#999'}}>学校</Option>
                        </Select>
                        <Search
                          placeholder={"搜索微课"}
                          onSearch={value => this.fromSearch(value)}
                          style={{ width: 200 }}
                        />
                      </div>:""
                    } 
                  </div>  
                </div>
                <ul className={styles.sorting}>
                  {
                    materialList.data.length>0||isAll||isKnowledge?
                    <li className={styles.sortingBtn}>
                      <a onClick={this.theSorting.bind(this,1)} >综合</a>
                      <a onClick={this.theSorting.bind(this,2)} style={{color:see_sort==1||see_sort==2?'#6fc400':''}} >浏览{see_sort==1?<i className={styles.up}></i>:see_sort==2?<i className={styles.down}></i>:""}</a>
                      <a onClick={this.theSorting.bind(this,3)} style={{color:star_sort==1||star_sort==2?'#6fc400':''}} >星级{star_sort==1?<i className={styles.up}></i>:star_sort==2?<i className={styles.down}></i>:""}</a>
                      <Select placeholder="文档类型" style={{width:'100px',marginLeft:'20px'}} onChange={this.fileTypeChange}>
                        <Option value="">全部</Option>
                        {
                          fileTypeData.map((item,index)=>{
                            return <Option key={index} value={item.name}>{item.name}</Option>
                          })
                        }
                      </Select>
                      <Checkbox style={{marginLeft:'20px'}} onChange={this.tagsChange.bind(this,1)} checked={is_boutique}>精品</Checkbox>
                      <Checkbox onChange={this.tagsChange.bind(this,2)} checked={is_ecommend}>推荐</Checkbox>
                    </li>:''
                  }
                  <li className={styles.searchResult}>共<span>{materialList.totalresult?materialList.totalresult:0}</span>个结果</li>
                </ul>
                <ul className={styles.ListStyle} style={{paddingTop:'0'}}>
                  {
                    materialList.data.map((item,index)=>{
                      return <li key={index} style={{marginRight:(index+1)%4==0?0:''}}>
                          <div className={styles.linkStyle} >
                            <Link to={{ pathname:'/resource/resourcedetail?type=2&id='+item.id }} target="_blank" >
                                <div className={styles.img} style={{backgroundImage: item.cover_url?'url('+item.cover_url+')':`url(${require('@/assets/test1.jpg')})`}} >
                                    <div className={styles.type}>{item.file_type}</div>
                                </div>
                            </Link>
                            <div className={styles.btn}>
                            {
                              item.creator_id==user_id?
                              <div className={styles.isSee}>
                                  <a onClick={this.showBuilding}><Tooltip placement="bottom" title="发布"><i className={styles.iconRelease}></i></Tooltip></a>
                                  <Link to={`/resource/createlesson?type=2&id=${item.id}`} ><Tooltip placement="bottom" title="编辑"><i className={styles.iconEdit}></i></Tooltip></Link>
                                  <a onClick={this.showModal.bind(this,`${item.id}`)}><Tooltip placement="bottom" title="删除"><i className={styles.iconDelete}></i></Tooltip></a>
                              </div>
                              :<div className={styles.isSee}>
                                <a onClick={this.showBuilding}><Tooltip placement="bottom" title="发布"><i className={styles.iconRelease}></i></Tooltip></a>
                              </div>
                            }
                            </div>
                          </div>
                          <Link to={'/resource/resourcedetail?type=2&id='+item.id} >
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
                  materialList.data.length>0?
                  <div className={styles.paging}>
                    <LocaleProvider locale={zhCN}>
                      <Pagination showQuickJumper current={materialList.currpage} total={materialList.totalresult} onChange={this.changePage} defaultPageSize={16}/>
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
          visible={tipsVisible}
          okText="是"
          cancelText="否"
        >
          <div style={{textAlign:'center'}}>
          <div style={{width:'155px',height:'155px',margin:'0 auto', backgroundImage: `url(${require('@/assets/remove.png')})`}}></div>
            <p>你确定删除该课件/素材吗？</p>
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

export default Material;
