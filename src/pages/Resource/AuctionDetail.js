import React, { Component } from 'react';
import Link from 'umi/link';
import router from 'umi/router';
import { connect } from 'dva';
import Zheader from '@/components/Zheader';
import ZFooter from '@/components/ZFooter';
import "../../../node_modules/video-react/dist/video-react.css";
import ResourceMenu from './components/ResourceMenu';
import { Modal, Input, Row, Col, Button, Affix, Statistic } from 'antd';
import { getDto } from '@/utils/dto';
import {Player} from 'video-react';
import ZPdf from '@/components/ZPdf';
import styles from '@/pages/Home/index.less';
import utilsView from '@/utils/utilsView';
import KnowledgeTree from './components/KnowledgeTree';
const { TextArea } = Input;
const Countdown = Statistic.Countdown;
const deadline = Date.now() + 1000 * 60 * 60 * 24 * 2 + 1000 * 30;
@connect(({ material }) => ({
  material
}))
class AuctionDetail extends Component {
  constructor(props){
    super(props);
    this.state = {
      reportVisible: false, //举报弹窗
      reportIconVisible: false, //举报图标
      collectVisible: false, //收藏
      isDeleteCollect: false, //是否取消收藏
      type: 1, //类型
      theData: {}, //课件（微课、优课）主数据
      relevantList: [], // 相关课件（微课、优课）
      hasGood: 0, // 是否已赞
      goodNum: 0, // 点赞数量
      starVisiable: false, //星评
      starValue: 0,
      buildVisible: false,
      
    }
  }
  componentDidMount() {
    document.title="233书屋"
    const { location: { query: { id } } } = this.props;
    this.getData(id); //获取数据
  }
  // 获取数据
  getData = (id)=> {
    const { dispatch } = this.props;
    let userId = getDto("user_id");
    dispatch({
      type: 'book/getBookInfo',
      payload:{
        method:'/book/toDetail/'+id,
        id: id,
        publishType: 3,
      },
      callback:(data)=>{
        this.setState({
          theData: data,
        });
        this.getRelevant(data.classification); //获取相关
      }
    });
  }

  // 获取相关
  getRelevant = (classification)=> {
    const { dispatch, location: { query: { id } } } = this.props;
    const { theData } = this.state;
    let relevantList = [];
    dispatch({
      type: 'book/getSellList',
      payload:{
        method: "/book/toList",
        publishType: 1,  
        limit: 5,
        page: 1,
      },
      callback:(data)=>{
        console.log(data)
        for( let i=0; i<data.list.length; i++ ){
          if(data.list[i].id!==id){
            relevantList.push(data.list[i])
          }
        }
        this.setState({
          relevantList: relevantList
        })
      }
    });
  }

  showModal = ()=> {
    this.setState({
      reportVisible: true
    })
  }
  handleCancel = () => {
    this.setState({
      reportVisible: false,
      collectVisible: false,
      buildVisible: false,
     })
  }
  getOther = (id,e)=> {
    const { dispatch, location: { query: { type } } } = this.props;
    router.push("/resource/buydetail?id="+id);
    this.getData(id);
  }
  goodShow = ()=> {
    const { dispatch, location: { query: { type, id } } } = this.props;
    const { hasGood, goodNum } = this.state;
    let userId = getDto("user_id");
    dispatch({
      type: 'material/getGood',
      payload:{
        method: "/res/resLesson/praise",
        id: id,
        user_id: userId,
      },
      callback:()=>{
        this.setState({
          hasGood: hasGood==1?0:1,
          goodNum: hasGood==1? goodNum-1:goodNum+1
        })
      }
    });
  }
  seeReport = ()=> {
    this.setState({
      reportIconVisible: true
    })
  }
  hiddenReport = ()=> {
    this.setState({
      reportIconVisible: false
    })
  }
  showCollect = (flag)=> {
    this.setState({
        collectVisible: true,
        isDeleteCollect: flag,
    })
  }
  // （取消）收藏
  collectOk = ()=> {
    const { location:{query:{id,type}}, dispatch } = this.props;
    const user_id = getDto('user_id');
    dispatch({
      type: 'course/deleteCollect',
      payload:{
        method: "/res/resLesson/collect",
        user_id: user_id,
        lesson_id: id,
        type: type,
      },
      callback:()=>{
        this.handleCancel();
        this.getData(id);
      }
    });
     
  }
  showBuilding = ()=> {
    this.setState({
      buildVisible: true,
    })
  }
  render() {
    const { reportVisible, type, theData, relevantList, hasGood, goodNum, reportIconVisible, 
        buildVisible, isDeleteCollect } = this.state;
    return (
      <div>
        <Zheader addr={4}/>
        <div className={styles.moreCon}>
          <div className="container">
            <div className={styles.relatedCon} style={{marginRight:"30px"}}>
              {utilsView.renderLineTitle("其他竞拍")}
              <ul className={styles.photoList}>
                {
                  relevantList.map((item,index)=> {
                    return <li key={index} style={{backgroundImage: `url(${require('@/assets/pc/p12.jpg')})`}} onClick={this.getOther.bind(this,item.id)} >
                    <div className={styles.word}>{item.name}</div>
                  </li>
                  })
                }
              </ul>
            </div>
            <div className={styles.articleCon}>
              <div className={styles.shadowCon}>
                <div className={styles.article}>
                  <div className={styles.title}>{theData.userName}发布的竞拍 > {theData.name}</div>
                  <div className={styles.resourceFile}>
                  <ul className={styles.messageList}>
                  <li>
                    <div className={styles.listImg}>
                    <div className={styles.img} style={{backgroundImage: `url(${require('@/assets/pc/p11.jpg')})`}}>
                    </div>
                    </div>
                    <div className={styles.textInfo}>
                        <div className={styles.textTitle} >{theData.name}</div>
                        <div className={styles.textCon}>
                          <div>{theData.publishHouse} / {theData.author} </div>
                          <div>{theData.isbn} </div>
                          <div>{theData.bookOldStateName}</div>
                          <div>{theData.classificationName}</div>
                        </div>
                    </div>
                    <div style={{clear:'both'}}></div>
                    <div style={{padding:'20px 0'}}>
                      <p style={{lineHeight:"30px"}}>{theData.description}</p>
                    </div>
                  </li>
                  <div style={{clear:'both'}}></div>
                  </ul>
                  
                  </div>
                  <div className={styles.creatorInfo}>
                    <b className={styles.avatar} style={{backgroundImage: !!theData.creator_img_url?'url('+theData.creator_img_url+')':`url(${require('@/assets/avatar.jpg')})`}}></b>
                    <span className={styles.name}>{theData.userName}</span>
                    <a className={styles.follow} onClick={this.showBuilding}>Ta的主页</a>
                  </div>
                  <div className={styles.profiles}>
                    <div>发布人的话：</div>
                    <p>{theData.remark}</p>
                  </div>
                </div>
                <Affix offsetTop={0} offsetBottom={0}>
                  <div className={styles.handleCon} onMouseEnter={this.seeReport} onMouseLeave={this.hiddenReport}>
                    <div className={styles.handleBtn}>
                      <span style={{fontSize:'18px',marginLeft:"30px"}} onClick={this.showBuilding}>当前竞拍价：<span style={{color:"#6fc400"}}>￥66</span></span>
                     <Countdown style={{float:"left",marginTop:'6px'}} value={deadline} format="D 天 H 时 m 分 s 秒" />
                      { reportIconVisible?<span onClick={this.showBuilding}><i className={styles.iconReport}></i><span>举报</span></span>:'' }
                    </div>
                    <div className={styles.addBtn}>
                      <span className={styles.freeDown}><i></i>竞拍记录</span>
                      <span className={styles.addToBasket} onClick={this.showBuilding}><i></i>立即竞拍</span>
                    </div>
                  </div>
                </Affix>
              </div>
              <div className={styles.comment}>
                <div>
                  <div className={styles.commentNum}>评论<span> ( 1条 )</span></div>
                  <textarea className={styles.inputText} rows="3" placeholder="请输入评论内容" />
                  <button type="button" onClick={this.showBuilding}>发表</button>
                </div>
                <ul className={styles.commentMsg}>
                  <li>
                    <b className={styles.avatar}></b>
                    <div className={styles.msgInfo}>
                      <div>老李<span>8-19 13:21</span></div>
                      <div><p>留个言...</p></div>
                      <div className={styles.otherIcon}>
                        <span onClick={this.showBuilding}><i className={styles.iconMessage}></i>回复</span>
                        <span onClick={this.showBuilding}><i className={styles.iconGood}></i>0</span>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        {/****** 举报弹窗 ******/}
        <Modal
          title="举报"
          okText="提交"
          cancelText="取消"
          visible={reportVisible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <ul>
            <li style={{marginBottom:'10px'}}>
              <Row>
                <Col span={4}>资源名称：</Col>
                <Col span={18} style={{color:'#b3b3b3'}}>{theData.title}</Col>
              </Row>
            </li>
            <li style={{marginBottom:'10px'}}>
              <Row>
                <Col span={4}>发布人：</Col>
                <Col span={18} style={{color:'#b3b3b3'}}>{theData.creator_user_name}</Col>
              </Row>
            </li>
            <li style={{marginBottom:'10px'}}>
              <Row>
                <Col span={4}>发布时间：</Col>
                <Col span={18} style={{color:'#b3b3b3'}}>{theData.create_date}</Col>
              </Row>
            </li>
            <li style={{marginBottom:'10px'}}>
              <Row>
                <Col span={4}>类型：</Col>
                <Col span={18} style={{color:'#b3b3b3'}}>版权盗用</Col>
              </Row>
            </li>
            <li style={{marginBottom:'10px'}}>
              <Row>
                <Col span={4}>说明：</Col>
                <Col span={18}><TextArea placeholder="请举证盗用证明" /></Col>
              </Row>
            </li>
            <li style={{marginBottom:'10px'}}>
              <Row>
                <Col span={4}>原文网址：</Col>
                <Col span={18}><Input /></Col>
              </Row>
            </li>
          </ul>
        </Modal>
        {/* 建设中 */}
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

export default AuctionDetail;
