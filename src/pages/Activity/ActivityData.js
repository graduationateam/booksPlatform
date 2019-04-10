import React, { Component,Fragment } from 'react';
import Link from 'umi/link';
import { Table, Modal, Button, Form, Input } from 'antd';
import Zheader from '@/components/Zheader';
import ZFooter from '@/components/ZFooter';
import styles from './activity.less';
import { connect } from 'dva';
import router from 'umi/router';
const titleList = ["报名记录","作品记录"];
@connect(({ activity }) => ({
  activity
}))
@Form.create()
class ActivityData extends Component {
  constructor(props){
    super(props);
  }
  state = {
    wayIndex: 0,
    titlIndex: 0,
    worksData:[],
    EnroolData:[],
    ScoreData:[],
    scoreVisible:false,
    prizeVisible:false,
  }

  titleTabChange = (value)=> {
    this.setState({
      titlIndex: value
    })
  }
  wayTabChange = (value)=> {
    this.setState({
      wayIndex: value
    })
  }

  componentDidMount() {
    this.getEnroolData();
    this.getWorksData();
    this.getScoreData();
  }

  //查询活动报名记录
  getEnroolData=()=>{
    const { dispatch, location: { query: { id } } } = this.props;
    dispatch({
      type: 'activity/listRequest',
      payload:{
        method: "/act/actObject/getListPage",
        activity_id:id,
        type:2
      },
      callback:(data)=>{
        if(data.status!=0){
            return;
        }
        this.setState({
          EnroolData:data.data
        });
      }
    });
  }
  //查询活动作品记录
  getWorksData=()=>{
    const { dispatch, location: { query: { id } } } = this.props;
    dispatch({
      type: 'activity/listRequest',
      payload:{
        method: "/act/actWork/getListPage",
        activity_id:id,
        status:1
      },
      callback:(data)=>{
        if(data.status!=0){
            return;
        }
        this.setState({
          worksData:data.data
        });
      }
    });
  }

  //查询打分明细
  getScoreData=()=>{
    const { dispatch, location: { query: { id } } } = this.props;
    dispatch({
      type: 'activity/listRequest',
      payload:{
        method: "/act/actWork/getListPage",
        activity_id:id,
        status:1,
        judge:1
      },
      callback:(data)=>{
        if(data.status!=0){
            return;
        }
        this.setState({
          ScoreData:data.data
        });
      }
    });
  }

  //查看详情
  toDetail=(id)=>{
    router.push("/activity/actdetailmark?id="+id);
  }

  //关闭弹窗
  hiddenModal = (key) => {
    this.setState({
      [key]: false
    });
  }
  //打开弹窗
  showModal = (key) => {
    this.setState({
      [key]: true
    });
  }
  tableOp = (row) => {
    return (
      <Fragment>
        <div>
        <p><a style={{color:"#6FC400"}} onClick={()=>{this.toDetail(row.id)}}>查看</a></p>
        </div>
      </Fragment>
    )
  }
  
  render() {
    const {worksData,EnroolData,ScoreData,titlIndex, scoreVisible,prizeVisible}=this.state;
    const enroolColumns = [
      { title: '姓名', align: 'center', dataIndex: 'object_user_name' }, 
	    { title: '报名时间', align: 'center', dataIndex: 'create_date' }
    ];
    const worksColumns = [
      { title: '姓名', align: 'center', dataIndex: 'creator_user_name' }, 
      { title: '作品', align: 'center', dataIndex: 'cover_url',
      render: (val, row) => (
        <img style={{width:'80px'}} src={val||require('../../assets/test1.jpg')} alt="作品封面" title={row.works_name}/>
      )},
      { title: '数据', align: 'center', dataIndex: 'id',
      render: (val, row) => (
        <div>
          <p>浏览: {row.browse_total||0}</p>
          <p>评论: {row.comment_total||0}</p>
          <p>投票: {row.vote_total||0}</p>
        </div>
      )},
      { title: '成绩', align: 'center', dataIndex: 'prize' },
      { title: '提交时间', align: 'center', dataIndex: 'create_date' },
      {
        title: '操作',
        width: 100,
        fixed: 'right',
        render: (row) => this.tableOp(row),
      },
    ];

    const scoreColumns=[
      { title: '姓名', align: 'center', dataIndex: 'creator_user_name' }, 
      { title: '作品', align: 'center', dataIndex: 'cover_url',
      render: (val, row) => (
        <img style={{width:'80px'}} src={val||require('../../assets/test1.jpg')} alt="作品封面" title={row.works_name}/>
      )},
      { title: '平均得分', align: 'center', dataIndex: 'score' },
      { title: '排名', align: 'center', dataIndex: 'rank' },
      { title: '评委', align: 'center', dataIndex: 'judge_name',
      render: (value, row, index) => {
        return (
            row.scoreList.map(item=>{
                return(
                    <div key={item.judge_name} style={{padding:"5px 0"}}>
                        <span>{item.judge_name}</span>
                    </div>
                )       
            })
        )                    
      }},
      { title: '打分', align: 'center', dataIndex: 'judge_score',
      render: (value, row, index) => {
        return (
            row.scoreList.map(item=>{
                return(
                    <div key={item.score} style={{padding:"5px 0"}}>
                        <span>{item.score}</span>
                    </div>
                )       
            })
        )                    
      }},
    ];

    const prizeColumns=[
      { title: '姓名', align: 'center', dataIndex: 'creator_user_name' }, 
      { title: '作品', align: 'center', dataIndex: 'cover_url',
      render: (val, row) => (
        <img style={{width:'80px'}} src={val||require('../../assets/test1.jpg')} alt="作品封面" title={row.works_name}/>
      )},
      { title: '平均得分', align: 'center', dataIndex: 'score' },
      { title: '排名', align: 'center', dataIndex: 'rank' },
      { title: '评奖', align: 'center', dataIndex: 'prize',
      render: (value, row, index) => {
        return (
          <input style={{width: "150px",height: "30px",border: "1px #cccc solid"}}></input>
        )                    
      }},
    ];

    return (
      <div>
        <Zheader addr={3}/>
        <div className={styles.palceCon}>
          <div className="container">
            <Link to=''>扩展活动</Link> / <span>我的活动</span>
          </div>
        </div>
        <div className={styles.moreCon}>
          <div className="container">
            <div className={styles.chooseCon}>
              <ul className={styles.btnList}>
                <li><Link to='/activity/release' style={{color:"#6fc400"}}>我发布的活动</Link></li>
                <li><Link to='/activity/participation'>我参与的活动</Link></li>
                <li><Link to='/activity/myscore'>我参与的评分</Link></li>
              </ul>
            </div>
            <div className={styles.activityCon} style={{paddingBottom:'300px'}}>
			      <div style={{display:'flex',justifyContent:'space-between',paddingRight:'30px',lineHeight:'86px'}}>
              <ul className={styles.titleBtn}>
                  {
                    titleList.map((item,index)=> {
                      return titlIndex==index? 
                      <li key={index} className={styles.active} onClick={this.titleTabChange.bind(this,`${index}`)}>{item}</li>:
                      <li key={index} onClick={this.titleTabChange.bind(this,`${index}`)}>{item}</li>
                    })
                  }
              </ul>
              {
                titlIndex==1?
                <div>
                <span><a onClick={()=>{this.showModal("scoreVisible")}}>评分明细</a></span>
                <span style={{marginLeft:"10px"}}><a onClick={()=>{this.showModal("prizeVisible")}}>设置奖项</a></span>
                </div>
                :''
              }
			      </div>
            <div className={styles.writeInfo}>
              {titlIndex==0?
                <Table columns={enroolColumns} dataSource={EnroolData} pagination={true}/>
                :
                titlIndex==1?
                <Table columns={worksColumns} dataSource={worksData} pagination={true}/>
                :''
              }
                
            </div>
            </div>
          </div>
        </div>

        {/* 评分明细的弹窗 */}
        <Modal
          title="评分明细"
          visible={scoreVisible}
          width="1050px"
          onCancel={(e)=>{this.hiddenModal('scoreVisible')}}
          footer={[
            <div style={{ width: '100%', textAlign:"center"}}><Button style={{ width: '80px'}} key="submit" type="primary" onClick={()=>{this.hiddenModal('scoreVisible')}}>关闭</Button></div>
          ]}
        >
           <div className={styles.writeInfo}>
           <Table columns={scoreColumns} dataSource={ScoreData} pagination={true}/>
           </div>
        </Modal>

        {/* 作品评奖弹窗 */}
        <Modal
          title="评分明细"
          visible={prizeVisible}
          width="1050px"
          onCancel={(e)=>{this.hiddenModal('prizeVisible')}}
          footer={[
            <div style={{ width: '100%', textAlign:"center"}}>
              <Button style={{ width: '80px'}} key="submit" type="primary" >提交</Button>
              <Button style={{ width: '80px'}} key="submit" onClick={()=>{this.hiddenModal('prizeVisible')}}>关闭</Button>
            </div>
          ]}
        >
           <div className={styles.writeInfo}>
           <Table columns={prizeColumns} dataSource={worksData} pagination={true}/>
           </div>
        </Modal>



        <ZFooter />
      </div>
    );
  }
}

export default ActivityData;
