import React, { Component } from 'react';
import Link from 'umi/link';
import Zheader from '@/components/Zheader';
import ZFooter from '@/components/ZFooter';
import styles from './resource.less';
import { connect } from 'dva';
import { getDto } from '@/utils/dto';
import { Input, Modal, Pagination, LocaleProvider, message, Tooltip, Button } from 'antd';
import KnowledgeTree from './components/KnowledgeTree';
import zhCN from 'antd/lib/locale-provider/zh_CN';
const Search = Input.Search;
message.config({
  top: 200
});
@connect(({ resource, material }) => ({
  resource, material
}))
class Sells extends Component {
  constructor(props){
    super(props);
    this.state = {
        tipsVisible: false,
        buildVisible: false,
        isAll: true,
        sellList: {list:[]},
        isMy: false, // 判断我的微课、所有微课
        deleteShow: false,  //删除弹窗
        delete_id: '',
        price_sort: 0,
        time_sort: 0,
        searchValue: '',
        bookType: '',
    }
    this.bookType = '';
    this.isMy = false;
    this.searchValue = '';
  }
  componentDidMount() {
    document.title="233书屋";
    this.getSellList();
  }
  getSellList = (page)=> {
    const { dispatch } = this.props;
    const user_id = getDto('user_id');
    dispatch({
      type: 'book/getSellList',
      payload:{
        method:'/book/toList',
        userId: this.isMy? user_id:'',
        publishType: 2,  
        limit: 20,
        page: page?page:1,
        classification: this.bookType=='a'?'':this.bookType,
        keyword: page&&!!this.searchValue? this.searchValue:'',
      },
      callback:(data)=>{
        this.setState({
          sellList: data,
        });
        this.searchValue = '';
      }
    });
  }
  // 改变书籍类型
  getBookType = (value)=> {
    this.bookType = value;
    this.getSellList();
  }
  //改变所以、我的 
  changeMyOrAll = (value)=> {
    this.isMy = value;
    this.getSellList()
  }
  // 通过搜索框搜索
  fromSearch = (value)=> {
    this.searchValue = value;
    this.getSellList(1)
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
  // ( 综合、时间、价格 )排序
  theSorting = (sortType)=> {
    const { dispatch } = this.props;
    const { price_sort, time_sort } = this.state;
    const user_id = getDto('user_id');
    let price='';
    let time='';
    console.log(price_sort)
    switch(sortType) {
      case 1: price = '';time = '';break;
      case 2: price = price_sort==0? 1:price_sort==1? 2:'';time=''; break;
      case 3: time = time_sort==0? 1:time_sort==1? 2:'';price=''; break;
    }
    console.log(price)
    dispatch({
      type: 'book/getSellList',
      payload:{
        method:'/book/toList',
        userId: this.isMy? user_id:'',
        publishType: 2,  
        limit: 20,
        page: 1,
        classification: this.bookType=='a'?'':this.bookType,
        keyword: !!this.searchValue? this.searchValue:'',
        sname: !!price? 'price':!!time? 'update_time':'',
        sortRule: !!price?price:!!time?time:'',
      },
      callback:(data)=>{
        this.setState({
          sellList: data,
          price_sort: !!price?price:0,
          time_sort: !!time?time:0,
        });
      }
    });
  }
  showModal = (id)=> {
    this.setState({
      tipsVisible: true,
      delete_id: id
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
    const { tipsVisible, sellList, price_sort, time_sort, buildVisible } = this.state;
    const user_id = getDto('user_id');
    return (
      <div>
        <Zheader addr={2}/>
        <div className={styles.moreCon}>
          <div className="container">
            {/* 知识点树共用组件 */}
            <KnowledgeTree 
              onChange={this.getBookType}
            />
            <div className={styles.courseTabs}>
               <ul className={styles.isMyCourse}>
                   <li className={!this.isMy?styles.active:''} onClick={this.changeMyOrAll.bind(this,false)}>所有出售</li>
                   <li className={this.isMy?styles.active:''} onClick={this.changeMyOrAll.bind(this,true)}>我的出售</li>
               </ul>
            </div>
            <div className={styles.courseCon}>
                <div className={styles.btnCon}>
                  <div>
                    <Link className={styles.releaseCourse} to={"/resource/createsell?type=2"} >发布出售</Link>
                      <div className={styles.theSearchCon}>
                        <Search
                          placeholder={"搜索书籍名称/ISBN"}
                          onSearch={value => this.fromSearch(value)}
                          style={{ width: 200 }}
                        />
                      </div>
                  </div>   
                </div>
                <ul className={styles.sorting}>
                    <li className={styles.sortingBtn}>
                      <a onClick={this.theSorting.bind(this,1)}>综合</a>
                      <a onClick={this.theSorting.bind(this,2)} style={{color:price_sort==1||price_sort==2?'#6fc400':''}} >价格{price_sort==1?<i className={styles.up}></i>:price_sort==2?<i className={styles.down}></i>:""}</a>
                      <a onClick={this.theSorting.bind(this,3)} style={{color:time_sort==1||time_sort==2?'#6fc400':''}} >时间{time_sort==1?<i className={styles.up}></i>:time_sort==2?<i className={styles.down}></i>:""}</a>
                    </li>
                  <li className={styles.searchResult}>共<span>{sellList.total}</span>个结果</li>
                </ul>
                <ul className={styles.ListStyle}>
                {
                  sellList.list.map((item,index)=> {
                    return <li key={index}>
                    <div className={styles.linkStyle} >
                      <Link to={{ pathname:'/resource/selldetail?id='+item.id }} target="_blank" >
                          <div className={styles.img} style={{backgroundImage: `url(${require('@/assets/pc/p1.jpg')})`}} >
                              <div className={styles.type}>推荐</div>
                          </div>
                      </Link>
                      <div className={styles.btn}>
                        <div className={styles.isSee}>
                            <a onClick={this.showBuilding}><Tooltip placement="bottom" title="加入购物车"><i className={styles.iconCar}></i></Tooltip></a>
                        </div>
                      </div>
                    </div>
                    <Link to={{ pathname:'/resource/selldetail?id='+item.id }} target="_blank" >
                      <div className={styles.word}>{item.name}</div>
                    </Link>
                    <div className={styles.userInfo}>
                      <span style={{marginRight:'10px',color:"#6fc400"}}>￥{item.price}</span>
                      <i style={{textDecoration:'line-through'}}>￥{item.originalPrice}</i>
                    </div>
                  </li>
                  })
                }
                </ul>
                {/* 分页 */}
                  <div className={styles.paging}>
                    <LocaleProvider locale={zhCN}>
                      <Pagination showQuickJumper current={sellList.pageNum} total={sellList.total} onChange={this.getSellList} defaultPageSize={20}/>
                    </LocaleProvider>
                  </div>
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
            <p>你确定删除该微课吗？</p>
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

export default Sells;
