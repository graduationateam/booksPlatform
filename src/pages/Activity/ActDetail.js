import React, { Component } from 'react';
import Link from 'umi/link';
import { Carousel, Modal, Upload, Icon, message, Button, Form, Radio, Statistic, Pagination, LocaleProvider } from 'antd';
import Zheader from '@/components/Zheader';
import ZFooter from '@/components/ZFooter';
import ZBadge from '@/components/ZBadge';
import styles from './activity.less';
import utilsView from '@/utils/utilsView';
import { connect } from 'dva';
import { getDto } from '@/utils/dto';
import { red } from 'ansi-colors';
import router from 'umi/router';
import zhCN from 'antd/lib/locale-provider/zh_CN';
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const Countdown = Statistic.Countdown;
const props = {
  name: 'file',
  action: '//jsonplaceholder.typicode.com/posts/',
  headers: {
    authorization: 'authorization-text',
  },
  onChange(info) {
    if (info.file.status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    if (info.file.status === 'done') {
      message.success(`${info.file.name} file uploaded successfully`);
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  },
};
// 答题弹窗
const AnswerPopUp = Form.create()(props => {
  const { answerVisible, form, handleCancel } = props;
  const deadline = Date.now() + 60 * 1000;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      // handleAdd(fieldsValue, form);
    });
  };
  return (
    <Modal
      maskClosable={false}
      width={800}
      destroyOnClose={true}
      title="答题游戏"
      onOk={okHandle}
      onCancel={() => handleCancel()}
      visible={answerVisible}
      footer={[
        <div key="submit" style={{ width: '100%', marginLeft: '-346px' }}>
          <Button key="submit" type="primary" onClick={okHandle}>下一题</Button>
        </div>,
      ]}
    >
      <div>
        <div>
          <p>1."小草偷偷从地里冒出来"，下面哪一句描述最接近？（）</p>
          <div style={{ marginLeft: '20px' }}>
            <p>A.春风又绿江南岸</p>
            <p>B.草色遥看近却无</p>
            <p>C.浅草才能没马蹄</p>
            <p>D.风吹草地见牛羊</p>
          </div>
        </div>
        <div className="popUpCon" style={{ margin: '50px 0 20px 0', display: 'flex', flexDirection: 'row' }}>
          <span style={{ lineHeight: 1.6 }}>时间倒计时：</span>
          <Countdown style={{ fontSize: '12px', color: '#6fc400' }} value={deadline} format="s 秒" />
        </div>
        <div style={{ border: '1px solid #e6e6e6', padding: '10px 20px' }}>
          <FormItem labelCol={{ span: 2 }} wrapperCol={{ span: 20 }} label="请作答">
            {form.getFieldDecorator('topic', {
              rules: [{ required: true, message: '请作答' }]
            })
              (<RadioGroup style={{ marginLeft: '10px' }}>
                <Radio value={1}>A</Radio>
                <Radio value={2}>B</Radio>
                <Radio value={3}>C</Radio>
                <Radio value={4}>D</Radio>
              </RadioGroup>)}
          </FormItem>
          <div style={{ textAlign: 'right' }}>得分：<span style={{ color: '#6fc400' }}>2</span></div>
        </div>
      </div>

      {/* 答题完成 */}
      {/* <div style={{textAlign:'center'}}>
        <div style={{margin:'10px 0',fontSize:'20px',color:'#6fc400'}}>恭喜你，答题完成！</div>
        <div style={{fontSize:'12px',color:'#b3b3b3',marginBottom:'30px'}}><span style={{color:'#ff2727'}}>*</span>所有题目答对才能上榜</div>
        <div style={{marginBottom:'10px'}}><span>题目：</span>共10道</div>
        <div style={{marginBottom:'10px'}}><span>错题：</span>共0道</div>
        <div style={{marginBottom:'10px'}}><span>时长：</span>30秒</div>
        <div style={{marginBottom:'10px'}}><span>得分：</span>100分</div>
      </div> */}
    </Modal>
  )
});

@connect(({ activity, itemData }) => ({
  activity,
  itemData
}))

@Form.create()
class HomeDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      shareVisible: false, //打卡弹窗
      uploadVisible: false, //报名上传弹窗
      previewVisible: false, //查看封面大图
      goodVisible: false, //点赞弹窗
      answerVisible: false, //答题弹窗
      previewImage: '',
      fileList: [],

      ownWork:{},//我的作品


      bannerData: [],//轮播图
      actData: {},//活动主表信息
      workData:{},//参赛作品数据
      enlistVisible: false,//报名成功弹窗
      voteVisible: false,//投票成功弹窗

    }
  }
  showModal = (num) => {
    if (num == 1) {
      this.setState({
        uploadVisible: true,
      });
    } else if (num == 2) {
      this.setState({
        shareVisible: true,
      });
    } else if (num == 3) {
      this.setState({
        goodVisible: true,
      });
    } else if (num == 4) {
      this.setState({
        answerVisible: true
      })
    }
  }

  shareHandleOk = (e) => {
    this.setState({
      shareVisible: false,
    });
  }
  shareHandleCancel = (e) => {
    this.setState({
      shareVisible: false,
    });
  }

  signupHandleOk = (e) => {
    this.setState({
      uploadVisible: false,
    });
  }
  signupHandleCancel = (e) => {
    this.setState({
      uploadVisible: false,
    });
  }

  handleCancel = () => {
    this.setState({
      previewVisible: false,
      answerVisible: false
    })
  }
  handlePreview = (file) => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  }
  handleChange = ({ fileList }) => this.setState({ fileList })

  goodHandleOk = () => {
    this.setState({
      goodVisible: false,
    });
  }


  /****************************初始化数据****************************/
  componentDidMount() {
    const { dispatch, location: { query: { id } } } = this.props;
    //浏览量+
    dispatch({
      type: 'activity/request',
      payload:{
        method:'/act/actActivity/addBrowseVolume',
        id:id,
        user_id:getDto("user_id")
      }
    });

    //查询轮播图
    dispatch({
      type: 'activity/request',
      payload: {
        method: "/act/actBanner/getAll",
        act_id: id
      },
      callback: (d) => {
        if (d.status != 0) {
          return;
        }
        this.setState({
          bannerData: d.data
        });
      }
    });

    //查询 活动主表信息
    dispatch({
      type: 'activity/request',
      payload: {
        method: "/act/actActivity/get",
        id: id
      },
      callback: (d) => {
        if (d.status != 0) {
          return;
        }
        this.setState({
          actData: d.data
        });

        //查询活动报名/参与人总数 活动报名/参与人信息
        this.getActObject(d.data.status);

        //查询参赛作品
        this.getworkAll(10);

        //查询 我上传的作品
        this.getworkOwn();
      }
    });

    //查询 是否点过赞
    dispatch({
      type: 'activity/request',
      payload: {
        method: "/act/actActivity/getThumbsUp",
        act_id: id,
        user_id:getDto("user_id")
      },
      callback: (d) => {
        if (d.status != 0) {
          return;
        }
        var actData=this.state.actData;
        actData.act_thumbs_up=false;
        if(d.data.length>0){
          actData.act_thumbs_up=true;
        }

        this.setState({
          actData:actData
        });
      }
    });
  }

  //查询参赛作品
  getworkAll=(pageNum)=>{
    const { dispatch, location: { query: { id } } } = this.props;
    dispatch({
      type: 'activity/listRequest',
      payload: {
        method: "/act/actWork/getListPage",
        activity_id: id,
        status:1,
        currpage: pageNum,
      },
      callback: (d) => {
        if (d.status != 0) {
          return;
        }
        this.setState({
          workData:d
        });
      }
   })
  }

  //查询我上传的作品
  getworkOwn=()=>{
    const { dispatch, location: { query: { id } } } = this.props;
    dispatch({
      type: 'activity/request',
      payload: {
        method: "/act/actWork/getAll",
        activity_id: id,
        user_id:getDto("user_id")
      },
      callback: (d) => {
        if (d.status != 0) {
          return;
        }
        let data=this.state.ownWork;
        if(d.data.length>0){
          data=d.data[0];
        }
        this.setState({
          ownWork:data
        });
        
      }
   })
  }
  //活动报名/参与人总数 活动报名/参与人信息 调用分页查询接口 一并获取 总数和 显示第一页数据
  getActObject=(e)=>{
    if(e!=1&&e!=2&&e!=3){
      return;
    }
    const { dispatch, location: { query: { id } } } = this.props;
    dispatch({
      type: 'activity/listRequest',
      payload: {
        method: "/act/actObject/getListPage",
        activity_id: id,
        type:e==1?1:2
      },
      callback: (d) => {
        console.log(d);
        if (d.status != 0) {
          return;
        }
        var data=this.state.actData;
        data.totalObject=d.totalresult;
        data.objectData=d.data;
        this.setState({
          actData:data
        });

        //如果e=1 查询 自己是否已报名
        
        dispatch({
          type: 'activity/request',
          payload: {
            method: "/act/actObject/findExistEnlist",
            activity_id: id,
            object_id:getDto("user_id")
          },
          callback: (d) => {
            console.log(d);
            if (d.status != 0) {
              return;
            }
            var data=this.state.actData;
            data.isExistEnlist=d.data.isEnlist;
            this.setState({
              actData:data
            });
          }
        });
      }
    });
  }
  /**************************基础操作******************************/
  //关闭弹窗
  hiddenModal = (key) => {
    this.setState({
      [key]: false
    });
  }
  //点赞
  toThumbsUp=()=>{
    const { dispatch, location: { query: { id } } } = this.props;
    dispatch({
      type: 'activity/request',
      payload: {
        method: "/act/actActivity/thumbsUp",
        act_id: id,
        user_id: getDto("user_id")
      },
      callback: (d) => {
        if (d.status != 0) {
          return;
        }
        var actData=this.state.actData;
        var b=actData.act_thumbs_up;
        actData.thumbs_up_total=b?actData.thumbs_up_total-1:actData.thumbs_up_total+1;
        actData.act_thumbs_up=!b;
        this.setState({
          actData:actData,
          goodVisible:b?false:true
        });
      }
    });
  }
  //活动报名==单人
  toEnlist = () => {
    const { dispatch, location: { query: { id } } } = this.props;
    dispatch({
      type: 'activity/request',
      payload: {
        method: "/act/actObject/actEnlist",
        activity_id: id,
        object_id: getDto("user_id"),
        type: 1
      },
      callback: (d) => {
        if (d.status != 0) {
          message.error(d.msg);
          return;
        }
        this.setState({
          enlistVisible: true
        });
      }
    });
  }

  //前往上传作品
  toUploadWorks=(e)=>{
    const { location: { query: { id } } } = this.props;
    router.push('/activity/uploadworks?actID='+id+'&id='+e);
  }
  

  render() {
    const textareaStyle = { width: '350px', resize: 'none', outline: 'none', padding: '10px', border: '1px solid #e6e6e6', verticalAlign: 'top', borderRadius: '2px' };
    const inputStyle = { width: '350px', height: '26px', outline: 'none', padding: '10px', border: '1px solid #e6e6e6', borderRadius: '2px', marginLeft: '10px' };
    const { previewVisible, previewImage, fileList, answerVisible, bannerData, actData, enlistVisible, voteVisible,workData,ownWork } = this.state;
    
    console.log(actData)
    
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">上传封面</div>
      </div>
    );


    // 答题弹窗传数据
    const answerMethods = {
      answerVisible: answerVisible,
      handleCancel: this.handleCancel,
    }
    return (
      <div>
        <Zheader addr={3} />
        <div className={styles.palceCon}>
          <div className="container">
            <span>扩展活动</span> / <span>详情</span>
            {/* <Link to=''>首页</Link> */}
          </div>
        </div>
        <div className={styles.moreCon}>
          <div className="container">
            <div className="CarouselStyle">
              <Carousel autoplay>
                {bannerData.length > 0 ?
                  bannerData.map((item, index) => {
                    return (
                      <div><img src={item.img_url} alt="轮播图" key={index} /></div>
                    );
                  })
                  :
                  <div><img src={require('@/assets/activitybg.jpg')} alt="轮播图" /></div>
                }
              </Carousel>
            </div>
            <div className={styles.articleCon}>
              <div className={styles.process} style={{ backgroundImage: `url(${require('@/assets/ongoing.jpg')})` }}></div>
              <div className={styles.article}>
                <div className={styles.artContainer}>
                    <div className={styles.title}>{actData.name}</div>
                    <ul className={styles.artInfo}>
                      <li>
                        <div className={styles.userInfo}>
                          <b className={styles.avatar} style={{backgroundImage:`url(${actData.creator_img_url||require('@/assets/avatar.jpg')})`}}></b>
                          <span>{actData.creator_user_name}</span>
                          <span className={styles.follow}>+关注</span>
                        </div>
                      </li>
                      {/* <li>栏目：动态报道</li> */}
                      <li>浏览：{actData.browse_volume || 0}</li>
                      <li>发布时间：{actData.create_date}</li>
                    </ul>
                    <div className={styles.artText}>
                      {/* 获奖名单位置 */}
                      {/* <div>
                        获奖名单
                      </div> */}
                      <div dangerouslySetInnerHTML={{ __html: actData.content }}></div>

                    </div>
                  </div>
                


                {/* 已参加人员 */}
                <div className={styles.relevant}>
                {/* 当前活动状态为 报名中  展示已报名人员 */}
                  {
                    actData.status==0?
                    ''
                    :
                    actData.status==1?
                      actData.isExistEnlist==1?
                      <div>
                        <span className={styles.people}>已参加</span>
                        {actData.objectData?actData.objectData.map((item,index)=>{
                            return <i className={styles.avatar} style={{backgroundImage:`url(${item.object_img_url||require('@/assets/avatar.jpg')})`}} key={index}></i>
                        }):''}

                        {actData.is_warks==1?
                          <button type="button" className={styles.signupBtn} onClick={()=>{this.toUploadWorks(ownWork.id)}}>{ownWork.id?'修改作品':'作品上传'}</button>
                          :
                          actData.is_answer == 1 ?
                          <button type="button" className={styles.signupBtn} onClick={this.showModal.bind(this, 4)}>答题</button>
                          : ''
                        }
                      </div>
                      :
                      <div>
                        <span className={styles.people}>已报名(<span style={{color:"red"}}>{actData.totalObject}</span>)</span>
                        {actData.objectData?actData.objectData.map((item,index)=>{
                            return <i className={styles.avatar} style={{backgroundImage:`url(${item.object_img_url||require('@/assets/avatar.jpg')})`}} key={index}></i>
                        }):''}
                        <button type="button" className={styles.signupBtn}>已报名</button>
                      </div>
                    :
                    <div>
                      <span className={styles.people}>已参加</span>
                      {actData.objectData?actData.objectData.map((item,index)=>{
                          return <i className={styles.avatar} style={{backgroundImage:`url(${item.object_img_url||require('@/assets/avatar.jpg')})`}} key={index}></i>
                      }):''}

                      {actData.is_warks==1?
                        '' // <button type="button" className={styles.signupBtn} onClick={()=>{this.toUploadWorks(ownWork.id)}}>{ownWork.id?'修改作品':'作品上传'}</button>
                        :
                        actData.is_answer == 1 ?
                        <button type="button" className={styles.signupBtn} onClick={this.showModal.bind(this, 4)}>答题</button>
                        : ''
                      }
                    </div>
                  }
                  
                  {/* 报名作品上传 */}



                  {/* 活动报名 */}
                  {/* {actData.is_enlist == 1 ?
                    1 == 1 ? <button type="button" className={styles.signupBtn} onClick={this.toEnlist}>报名</button>
                      : <button type="button" className={styles.signupBtn} onClick={this.showModal.bind(this, 1)}>上传作品</button>
                    : ''
                  } */}




                  {/* 参与中 */}
                  {/* <button type="button" className={styles.signupBtn}>参与中</button> */}
                  {/* 答题参与 */}


                </div>
                {/* 参赛作品展示 */}
                {
                  workData.totalresult>0?
                    // <div className={styles.relevant}>
                    <div className={styles.relevantAlready}>
                      <div className={styles.smallTitle}>参赛作品(<span style={{color:"red"}}>{workData.totalresult}</span>)</div>
                      <ul className={styles.actList}>

                        {workData.data.map((item,index)=>{
                          return(
                          <li className={styles.relevantAlreadyLi}>
                            <div className={styles.img} style={{backgroundImage: `url(${item.cover_url||require('@/assets/test1.jpg')})`}}></div>
                            <div className={styles.userInfo}>
                                <b className={styles.avatar} style={{backgroundImage:`url(${item.creator_img_url||require('@/assets/avatar.jpg')})`}}></b>
                                <span className={styles.name}>{item.creator_user_name}</span>
                            </div>
                            <div className={styles.other} style={{padding:'0',float:'right'}}>
                                <span><i className={styles.iconEye}></i>{item.browse_total||0}</span>
                                <span><i className={styles.iconGood}></i>{item.thumbs_up_total||0}</span>
                            </div>
                          </li>
                          )
                        })}
                      </ul>
                      {
                        workData.totalpage>1?
                        <div className={styles.paging}>
                          <LocaleProvider locale={zhCN}>
                            <Pagination showQuickJumper current={workData.currpage} total={workData.totalresult} onChange={this.getworkAll} defaultPageSize={10}/>
                          </LocaleProvider>
                        </div>
                        :''
                      }

                    </div> 
                :''
                }

                {/* 答题类 */}
                {actData.is_answer == 1 ?
                  <div className={styles.relevant}>
                    <div className={styles.smallTitle}>荣誉排行榜<span>（所有题目都答对才能上榜）</span></div>
                    <ul className={styles.actList}>
                      <li>
                        <div className={styles.userInfo}>
                          <span>1.</span>
                          <b className={styles.avatar}></b>
                          <span className={styles.name}>李老师</span>
                          <span>时间：30秒</span>
                        </div>
                      </li>
                      <li>
                        <div className={styles.userInfo}>
                          <span>2.</span>
                          <b className={styles.avatar}></b>
                          <span className={styles.name}>黄老师</span>
                          <span>时间：30秒</span>
                        </div>
                      </li>
                      <li>
                        <div className={styles.userInfo}>
                          <span>3.</span>
                          <b className={styles.avatar}></b>
                          <span className={styles.name}>林老师</span>
                          <span>时间：30秒</span>
                        </div>
                      </li>
                    </ul>
                  </div>
                  : ''
                }

                <div className={styles.other}>
                  <a >收藏</a>
                  <a >分享</a>
                  <div className={styles.good} onClick={()=>{this.toThumbsUp()}}>
                      {actData.act_thumbs_up?
                        <span style={{color:"#6fc400"}}><i className={styles.hasGood}></i>{actData.thumbs_up_total}</span>
                        :<span><i className={styles.iconGood}></i>{actData.thumbs_up_total||0}</span>
                      }
                  </div>
                </div>
              </div>
              <div className={styles.comment}>
                <div>
                  <div className={styles.commentNum}>评论<span> ( 2条 )</span></div>

                  {/* 打卡 */}
                  {actData.is_note == 1 ?
                    <button type="button" className={styles.shareBtn} onClick={this.showModal.bind(this, 2)}>打卡分享</button>
                    : ''
                  }
                  {false ? <button type="button" className={styles.shareBtn} style={{ backgroundColor: "#b2b2b2" }}>已打卡</button> : ''}


                  <textarea className={styles.inputText} rows="3" placeholder="请输入评论内容" />
                  <button className={styles.publishBtn} type="button">发表</button>
                </div>
                <ul className={styles.commentMsg}>
                  <li>
                    <b className={styles.avatar}></b>
                    <div className={styles.msgInfo}>
                      <div>黄老师<span>8-19 13:21</span></div>
                      <div><p>新中国成立后，收回了教育主权，对旧中国遗留下来的各类教育问题进行了彻底的改造。</p></div>
                      <div className={styles.otherIcon}>
                        <span><i className={styles.iconMessage}></i>回复</span>
                        <span><i className={styles.iconGood}></i>195</span>
                      </div>
                    </div>
                  </li>
                  <li>
                    <b className={styles.avatar}></b>
                    <div className={styles.msgInfo}>
                      <div>黄老师<span>8-19 13:21</span></div>
                      <div><p>新中国成立后，收回了教育主权，对旧中国遗留下来的各类教育问题进行了彻底的改造。</p></div>
                      <div className={styles.otherIcon}>
                        <span><i className={styles.iconMessage}></i>回复</span>
                        <span><i className={styles.iconGood}></i>195</span>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
              <div className={styles.otherAct}>
                {utilsView.renderLineTitle('其他活动')}
                <ul className={styles.otherActList}>
                  <li style={{ backgroundImage: `url(${require('@/assets/test1.jpg')})` }}>
                    <div className={styles.word}>亲子嘉年华</div>
                  </li>
                  <li style={{ backgroundImage: `url(${require('@/assets/test1.jpg')})` }}>
                    <div className={styles.word}>亲子嘉年华</div>
                  </li>
                  <li style={{ backgroundImage: `url(${require('@/assets/test1.jpg')})` }}>
                    <div className={styles.word}>亲子嘉年华</div>
                  </li>
                  <li style={{ backgroundImage: `url(${require('@/assets/test1.jpg')})` }}>
                    <div className={styles.word}>亲子嘉年华</div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>


        {/* 点赞成功弹出框 */}
        <Modal
          title="点赞成功"
          visible={this.state.goodVisible}
          onCancel={this.goodHandleOk}
          width={300}
          footer={[
            <div style={{ width: '100%', marginLeft: '-92px' }}><Button style={{ width: '80px', marginLeft: '100px' }} key="submit" type="primary" onClick={this.goodHandleOk}>知道啦</Button></div>
          ]}
        >
          <div style={{ textAlign: 'center' }}>
            <div style={{ margin: '0 auto', width: '150px', height: '140px', backgroundImage: `url(${require('@/assets/goodSuccess.png')})` }}></div>
            <div style={{ marginBottom: '30px' }}>人气值<span style={{ color: '#ff2727' }}>+1</span></div>
          </div>
        </Modal>

        {/* 投票成功的弹窗 */}
        <Modal
          title="投票成功"
          visible={voteVisible}
          onCancel={() => { this.hiddenModal('voteVisible') }}
          width={300}
          footer={[
            <div style={{ width: '100%', marginLeft: '-92px' }}><Button style={{ width: '80px', marginLeft: '100px' }} key="submit" type="primary" onClick={() => { this.hiddenModal('voteVisible') }}>知道啦</Button></div>
          ]}
        >
          <div style={{ textAlign: 'center' }}>
            <div style={{ margin: '0 auto', width: '100px', height: '100px', backgroundImage: `url(${require('@/assets/success.png')})` }}></div>
            <div style={{ marginBottom: '30px' }}>投票成功!</div>
          </div>
        </Modal>

        {/* 报名成功的弹窗 */}
        <Modal
          title="报名成功"
          visible={enlistVisible}
          onCancel={() => { this.hiddenModal('enlistVisible') }}
          width={300}
          footer={[
            <div style={{ width: '100%', marginLeft: '-92px' }}><Button style={{ width: '80px', marginLeft: '100px' }} key="submit" type="primary" onClick={() => { this.hiddenModal('enlistVisible') }}>知道啦</Button></div>
          ]}
        >
          <div style={{ textAlign: 'center' }}>
            <div style={{ margin: '0 auto', width: '100px', height: '100px', backgroundImage: `url(${require('@/assets/success.png')})` }}></div>
            <div style={{ marginBottom: '30px' }}>报名成功!</div>
          </div>
        </Modal>

        {/* 打卡分享的弹窗 */}
        <Modal
          title="打卡分享"
          visible={this.state.shareVisible}
          onOk={this.shareHandleOk}
          onCancel={this.shareHandleCancel}
          okText="分享"
          cancelText="取消"
        >
          <div className="shareCon">
            <textarea rows="3" style={{ ...textareaStyle, width: '472px' }} placeholder="说点什么吧..."></textarea>
            <div className="moreShare">更多分享至：
                        <i className="wechaticon"></i>
              <i className="qqicon"></i>
              <i className="weiboicon"></i>
              <span>需要分享才算打卡完成哦！</span>
            </div>
          </div>
        </Modal>


        {/* 作品上传弹窗 */}
        <Modal
          title="上传参赛作品"
          visible={this.state.uploadVisible}
          onOk={this.signupHandleOk}
          onCancel={this.signupHandleCancel}
          okText="提交"
          cancelText="取消"
        >
          <ul className="shareCon">
            <li><span>作品名称：</span><input style={inputStyle} type="text" placeholder="请输入作品名称" /></li>
            <li><span>作品简介：</span><textarea style={{ ...textareaStyle, marginLeft: '10px' }} rows="4" placeholder="请输入作品简介"></textarea></li>
            <li className="clearfix">
              <div>上传封面：<span style={{ fontSize: '12px', marginLeft: '10px', color: '#b3b3b3' }}><i style={{ color: '#ff2727' }}>*</i>建议图片大小200*150px</span></div>
              <div style={{ marginLeft: '80px', marginTop: '10px' }}>
                <Upload
                  action="//jsonplaceholder.typicode.com/posts/"
                  listType="picture-card"
                  fileList={fileList}
                  onPreview={this.handlePreview}
                  onChange={this.handleChange}
                >
                  {fileList.length == 0 ? uploadButton : null}
                </Upload>
              </div>

              <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                <img alt="example" style={{ width: '100%' }} src={previewImage} />
              </Modal>
            </li>
            <li><span>作品详情：</span>
              <Upload {...props}>
                <Button style={{ marginLeft: '10px' }}>上传附件</Button>
              </Upload>
              <div style={{ fontSize: '12px', marginLeft: '80px', marginTop: '5px', color: '#b3b3b3' }}><i style={{ color: '#ff2727' }}>*</i>附件格式：.doc、.pdf、ppt、mp3、mp4</div>
            </li>
          </ul>
        </Modal>



        <AnswerPopUp {...answerMethods} />
        <ZFooter />
      </div>
    );
  }
}

export default HomeDetail;
