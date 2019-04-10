import React, { Component } from 'react';
import Link from 'umi/link';
import router from 'umi/router';
import { connect } from 'dva';
import Zheader from '@/components/Zheader';
import ZFooter from '@/components/ZFooter';
import ZSelect from '@/components/ZSelect'
import "../../../node_modules/video-react/dist/video-react.css";
import { Modal, Input, Row, Col, Button, Pagination, LocaleProvider,Form,message } from 'antd';
import { getDto } from '@/utils/dto';
import {Player} from 'video-react';
import ZPdf from '@/components/ZPdf';
import styles from '@/pages/Home/index.less';
import utilsView from '@/utils/utilsView';
import zhCN from 'antd/lib/locale-provider/zh_CN';
const { TextArea } = Input;
const scoreData=[{id:"1",name:"1"},
                 {id:"2",name:"2"},
                 {id:"3",name:"3"},
                 {id:"4",name:"4"},
                 {id:"5",name:"5"},
                 {id:"6",name:"6"},
                 {id:"7",name:"7"},
                 {id:"8",name:"8"},
                 {id:"9",name:"9"},
                 {id:"10",name:"10"}
                ];
@connect(({ activity }) => ({
    activity
}))
@Form.create()
class Actdetailmark extends Component {
  constructor(props){
    super(props);
    this.state = {
      infoData:{},//作品信息
      mainResource:{},//作品主素材
      lessResource:[],//课件素材
      paperResource:[],//练习素材
      relevantData:{},//相关作品
      relevantList:[],
      score:'',
      enlistVisible:false,
      scoreVisible:false,
      showScore:false,
    }
  }
  componentDidMount() {
    this.getData(); //获取数据
  }
  // 获取数据
  getData = ()=> {
    const { location: { query: {id } } } = this.props;
    const { dispatch } = this.props;
    dispatch({
      type: 'activity/request',
      payload:{
        method:'/act/actWork/get',
        id: id,
        toScore:1,
        user_id:getDto("user_id")
      },
      callback:(d)=>{
        var mainResource={},//主素材
        lessResource=[],//课件素材
        paperResource=[];//练习素材
        d.data.fileList.map((item)=>{
            if(item.is_main==1){
                mainResource=item;
            }
            if(item.type==2){
                lessResource.push(item);
            }
            if(item.type==3){
                paperResource.push(item);
            }
        })
        if(d.data.judge_id && !d.data.judge_score_id){
          this.setState({
            showScore:true
          });
        }
        this.setState({
          infoData: d.data,
          mainResource:mainResource,
          lessResource:lessResource,
          paperResource:paperResource
        });
        this.getRelevant(1); //获取相关作品
      }
    });
  }

  //查询 作品点评数据

  // 获取相关作品
  getRelevant = (pageNum)=> {
    const { dispatch, location: { query: { id } } } = this.props;
    const { infoData } = this.state;
    dispatch({
      type: 'activity/listRequest',
      payload:{
        method: "/act/actWork/getListPage",
        count: 4,
        currpage: pageNum,
        activity_id:infoData.activity_id,
        status:1
      },
      callback:(data)=>{
        if(data.status!=0){
            return;
        }
        this.setState({
            relevantData:data,
            relevantList:data.data
        });
      }
    });
  }
  getOther = (id,e)=> {
    router.push("/activity/actdetailmark?id="+id);
    this.getData();
  }
  scoreChange=(e)=>{
      this.setState({
          score:e
      });
  }
  toMark=()=>{
    const {score}=this.state;
    if(!score){
        message.info("请选择分值!");
        return;
    }
    this.setState({
      scoreVisible:true
    });
  }
  toMarkOk=()=>{
    const { dispatch, location: { query: { id } } } = this.props;
    const {score}=this.state;
    dispatch({
      type: 'activity/request',
      payload:{
        method: "/act/actJudgeScore/save",
        score:score,
        work_id:id,
        judge_id:getDto("user_id")
      },
      callback:(data)=>{
        if(data.status!=0){
            return;
        }
        this.setState({
          enlistVisible:true,
          scoreVisible:false,
          score:''
        });
        this.getData();
      }
    });
  }
  hiddenModal=(key)=>{
    this.setState({
      [key]:false
    });
  }
  render() {
    const {form}=this.props;
    const { showScore,score,infoData,relevantData,relevantList,mainResource,lessResource,paperResource,enlistVisible,scoreVisible } = this.state;
    return (
      <div>
        <Zheader addr={4}/>
        <div className={styles.moreCon}>
          <div className="container">
            <div className={styles.relatedCon}>
              {utilsView.renderLineTitle(`${"相关作品"}`)}
              <ul className={styles.photoList}>
                {relevantList.map((item,index)=>{
                    return (
                        <li key={index} onClick={this.getOther.bind(this,item.id)} style={{backgroundImage:`url(${item.cover_url||require('@/assets/test1.jpg')})`}} >
                            <div className={styles.word}>{item.works_name||''}</div>
                        </li>
                    )
                })
                }
              </ul>
              
              {
                relevantData.totalpage>1?
                <div className={styles.paging}>
                <LocaleProvider locale={zhCN}>
                <Pagination showQuickJumper current={relevantData.currpage} total={relevantData.totalresult} onChange={this.getRelevant} defaultPageSize={10}/>
                </LocaleProvider>
                </div>
                :''
              }
            </div>
            <div className={styles.articleCon}>
              <div className={styles.article}>
                <div className={styles.resourceFile}>
                    <Player ref="player" videoId={mainResource.id} poster={infoData.cover_url}>
                        <source src={mainResource.resource_url}/>
                    </Player>
                </div>
                <div className={styles.title} style={{marginTop: '20px'}}>
                  {infoData?infoData.works_name:''}
                </div>
                <div className={styles.profiles}>
                  <div>简介</div>
                  <p>{infoData.remark}</p>
                </div>
                <ul className={styles.artInfo} style={{marginBottom:'20px'}}>
                  <li>
                    <div className={styles.userInfo}>
                      <b className={styles.avatar} style={{backgroundImage: !!infoData.creator_img_url?'url('+infoData.creator_img_url+')':`url(${require('@/assets/avatar.jpg')})`}}></b>
                      <span className={styles.name}>{infoData?infoData.creator_user_name:''}</span>
                      <span className={styles.follow}>+关注</span>
                    </div>
                  </li>
                  <li>浏览：{infoData.browse_total||0}</li>
                  <li>点评：{infoData.browse_total||0}</li>
                  <li>投票：{infoData.browse_total||0}</li>
                </ul>
                {   paperResource.length>0?
                    <div className={styles.profiles}>
                    <div><span style={{fontWeight: '700'}}>配套习题:</span>
                        {
                            paperResource.map((item,index)=>{
                                return (
                                <span key={index} style={{marginLeft: '10px'}}><a>{item.file_name}</a></span>
                                )
                            })
                        }
                    </div>
                    </div>
                    :''
                }
                
                {   lessResource.length>0?
                    <div className={styles.profiles}>
                    <div><span style={{fontWeight: '700'}}>配套课件/素材:</span>
                        {
                            lessResource.map((item,index)=>{
                                return (
                                <span key={index} style={{marginLeft: '10px'}}><a>{item.file_name}</a></span>
                                )
                            })
                         }
                    </div>
                    </div>
                    :''
                }

              </div>

              {showScore?
                <div className={styles.comment}>
                <span style={{color:"red"}}>*</span><span>评分:</span>
                {form.getFieldDecorator('score',{
                    initialValue:score
                })(<ZSelect
                    data={scoreData}
                    style={{width:"150px"}}
                    onChange={(e)=>this.scoreChange(e)}
                    />
                )}
                <button type="button" style={{float:"right"}} onClick={()=>this.toMark()}>提交</button>
                </div>
                :''
              }

              <div className={styles.comment}>
                <div>
                  <div className={styles.commentNum}>点评<span> ( 1条 )</span></div>
                  <textarea className={styles.inputText} rows="3" placeholder="请输入评论内容" />
                  <button type="button">发表</button>
                </div>
                <ul className={styles.commentMsg}>
                  <li>
                    <b className={styles.avatar}></b>
                    <div className={styles.msgInfo}>
                      <div>黄老师<span>8-19 13:21</span></div>
                      <div><p>新中国成立后，收回了教育主权，对旧中国遗留下来的各类教育问题进行了彻底的改造。</p></div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* 评分确认弹窗 */}
        <Modal
          title="评分确认"
          visible={scoreVisible}
          onCancel={() => { this.hiddenModal('scoreVisible') }}
          width={300}
          onOk={()=>{this.toMarkOk()}}
          okText="确定"
          cancelText="取消"
        >
          <div style={{ textAlign: 'center' }}>
            <div style={{ marginBottom: '30px' }}>您选择的分值为:{score}分,是否提交该评分?</div>
          </div>
        </Modal>

        {/* 评分成功的弹窗 */}
        <Modal
          title="评分成功"
          visible={enlistVisible}
          onCancel={() => { this.hiddenModal('enlistVisible') }}
          width={300}
          footer={[
            <div style={{ width: '100%', marginLeft: '-92px' }}><Button style={{ width: '80px', marginLeft: '100px' }} key="submit" type="primary" onClick={() => { this.hiddenModal('enlistVisible') }}>知道啦</Button></div>
          ]}
        >
          <div style={{ textAlign: 'center' }}>
            <div style={{ margin: '0 auto', width: '100px', height: '100px', backgroundImage: `url(${require('@/assets/success.png')})` }}></div>
            <div style={{ marginBottom: '30px' }}>评分成功!</div>
          </div>
        </Modal>

        <ZFooter />
      </div>
    );
  }
}

export default Actdetailmark;
