import React, { Component } from 'react';
import Link from 'umi/link';
import Zheader from '@/components/Zheader';
import ZFooter from '@/components/ZFooter';
import Fwindow from '@/components/Fwindow';
import ZBadge from '@/components/ZBadge';
import styles from './index.less';
import utilsView from '@/utils/utilsView';
import { connect } from 'dva';
import { getDto } from '@/utils/dto';
import util from '@/utils/utils';
import router from 'umi/router';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import { Pagination, LocaleProvider, Modal, Button, Carousel, Tooltip } from 'antd';

@connect(({ home }) => ({
  home
}))
class Home extends Component {
  state = {
    myData:[],//我关注的栏目
    informationData:[],//资讯列表
    informationInfoData:[],//单个栏目资讯
    typeId:'',//选中的栏目
    rightWidth:null,
    bool:true,
    buildVisible: false,
    buyList: [],
    sellList: [],
    auctionList: [],
  }
  toChangeBool=()=>{
    this.setState({bool:false})
  }

  componentDidMount() {
    document.title="233书屋"  
    this.getList(1);
    this.getList(2);
    this.getList(3);
  }
  getList = (type)=> {
    const { dispatch } = this.props;
    const user_id = getDto('user_id');
    dispatch({
      type: 'home/getSellList',
      payload:{
        method:'/book/toList',
        publishType: type,  
        limit: 10,
        page: 1,
        sname: 'update_time',
        sortRule: 1,
      },
      callback:(data)=>{
        if(type==1) {
          this.setState({
            buyList: data.list,
          });
        }else if(type==2) {
          this.setState({
            sellList: data.list,
          });
        }else if(type==3) {
          this.setState({
            auctionList: data.list,
          });
        }
      }
    });
  }
  //跳转详情页
  infoClick=(id,typeId)=>{
    router.push("/home/detail?id="+id+"&typeId="+typeId);
  }
  showBuilding = ()=> {
    this.setState({
      buildVisible: true,
    })
  }
  handleCancel = ()=> {
    this.setState({
      buildVisible: false,
    })
  }
  render() {
    const { myData,informationData,informationInfoData,typeId,bool, buildVisible, sellList, buyList } = this.state;
    return (
      <div>
        <Zheader />
        <div className={styles.optionCon}>
          <div className="container">
          <div className="CarouselStyle">
              <Carousel autoplay>
                <div><img src={require('@/assets/timg2.png')} style={{height:'240px',width:'100%'}} alt="轮播图" /></div>
                <div><img src={require('@/assets/timg.png')} style={{height:'240px',width:'100%'}} alt="轮播图" /></div>
              </Carousel>
            </div>
          </div>
        </div>

        <div className={styles.moreCon}>
          <div className="container">
            <div className={styles.messageCon} style={{marginBottom:"20px"}}>
              {utilsView.renderLineTitle('最新出售')}
              <ul className={styles.ListStyle} style={{paddingBottom:"0"}}>
              {
                sellList.map((item,index)=> {
                  return <li key={index}>
                  <div className={styles.linkStyle} >
                    <Link to="" target="_blank" >
                        <div className={styles.img} style={{backgroundImage: `url(${require('@/assets/pc/p1.jpg')})`}} >
                            <div className={styles.type}>推荐</div>
                            
                        </div>
                    </Link>
                    <div className={styles.btn}>
                      <div className={styles.isSee}>
                          <a onClick={this.showBuilding}><Tooltip placement="bottom" title="加入购物车"><i className={styles.iconRelease}></i></Tooltip></a>
                      </div>
                    </div>
                  </div>
                  <Link to="" >
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
            </div>
            <div className={styles.messageCon} style={{marginBottom:"20px"}}>
              {utilsView.renderLineTitle('最新求购')}
              <ul className={styles.ListStyle} style={{paddingBottom:"0"}}>
              {
                buyList.map((item,index)=> {
                  return <li key={index}>
                  <div className={styles.linkStyle} >
                    <Link to="" target="_blank" >
                        <div className={styles.img} style={{backgroundImage: `url(${require('@/assets/pc/p1.jpg')})`}} >
                            <div className={styles.type}>推荐</div>
                            
                        </div>
                    </Link>
                  </div>
                  <Link to="" >
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
            </div>
            <div className={styles.concernCon}>
              {utilsView.renderLineTitle('猜你喜欢')}
              <ul className={styles.concernList}>
                <li className={styles.active}><a>每日好文</a></li>
                <li><a>平台活动</a></li>
                <li><a>热门竞拍</a></li>
                <li><a>热门求购</a></li>
                <li><a>书友交流</a></li>
                <li><a>通知公告</a></li>
              </ul>
              <ul className={styles.photoList}>
                {
                  informationInfoData.map((item,index)=>{
                    return (
                      <li key={index} onClick={()=>{this.infoClick(item.id,item.type_id)}} style={{backgroundImage: `url(${item.cover_url||require('@/assets/test1.jpg')})`}}>
                        <div className={styles.word}>{item.title}</div>
                      </li>
                    )
                  })
                }
              </ul>
            </div>
          </div>
        </div>
        <ZFooter />
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
      </div>
    );
  }
}

export default Home;
