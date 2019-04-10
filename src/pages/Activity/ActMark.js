import React, { Component, Fragment } from 'react';
import Link from 'umi/link';
import { Table, Modal, Button, Form, Input } from 'antd';
import Zheader from '@/components/Zheader';
import ZFooter from '@/components/ZFooter';
import {Player} from 'video-react';
import "../../../node_modules/video-react/dist/video-react.css";
import styles from './activity.less';
import { connect } from 'dva';
import router from 'umi/router';
import { getDto } from '@/utils/dto';

@connect(({ activity,itemData }) => ({
  activity,
  itemData
}))
@Form.create()
class ActRecord extends Component {
  constructor(props){
    super(props);
    this.state = {
      wayIndex: 0,
      titlIndex: 0,
      markVisible: false,
      listData:[],
      theData:{}
    }
  }

  componentDidMount() {
    const { dispatch } = this.props;
    this.refreshList();
  }

  //绑定 作品列表
  refreshList=()=>{
    const { dispatch,location: { query: { id } }  } = this.props;
    dispatch({
      type:'activity/listRequest',
      payload:{
        method:'/act/actWork/getListPage',
        actActivity_id:id,
        status:1,
        user_id:getDto("user_id"),
        toScore:1
      },
      callback:(d)=>{
        if(d.status!=0){
         return;
        }
        this.setState({
          listData:d.data
        });
      }
    });
  }

  // 跳转评分页
  toMark=(e)=>{
    router.push("/activity/actdetailmark?id="+e);
  }
  
  render() {
    const { markVisible,listData,theData } = this.state;
    const worksColumns = [
      // { title: '序号', align: 'center', width: 80, dataIndex: 'key' }, 
      { title: '作者', align: 'center', width: 100, dataIndex: 'creator_user_name' }, 
      { title: '作品名称', align: 'center', dataIndex: 'works_name' }, 
      // { 
      //     title: '作品',
      //     align: 'center',
      //     dataIndex: 'cover_url', 
      //     key: 'cover_url', 
      //     render: (val, row) => (
      //       <Fragment>
      //           {/* <div style={{ width:'120px', height:'100px', backgroundImage: `url(${require(row.imgUrl)})`}}></div> */}
      //         <img style={{width:'120px',height:'100px'}} src={val||require('../../assets/test1.jpg')} alt="作品封面"/>
      //       </Fragment>
      //     ),
    
      // },
      { title: '成绩', align: 'center', width: 100, dataIndex: 'score' },
      { title: '提交时间', align: 'center',  width: 200, dataIndex: 'create_date' },
      {
        title: '操作',
        align: 'center',
        width: 60,
        render: (val, row) => (
          row.judge_id && !row.judge_score_id?
          <Fragment>
            <a style={{color:'#6fc400'}} onClick={() => this.toMark(row.id)}>评分</a>
          </Fragment>
          :
          <Fragment>
            <a style={{color:'#6fc400'}} onClick={() => this.toMark(row.id)}>查看</a>
          </Fragment>
        ),
      }
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
                <li><Link to='/activity/release'>我发布的活动</Link></li>
                <li><Link to='/activity/participation'>我参与的活动</Link></li>
                <li><Link to='/activity/myscore'>我参与的评分</Link></li>
              </ul>
            </div>
            <div className={styles.activityCon}>
              {/* <ul className={styles.titleBtn}>
                  {
                    titleList.map((item,index)=> {
                      return this.state.titlIndex==index? 
                      <li key={index} className={styles.active} onClick={this.titleTabChange.bind(this,`${index}`)}>{item}</li>:
                      <li key={index} onClick={this.titleTabChange.bind(this,`${index}`)}>{item}</li>
                    })
                  }
              </ul> */}
              <div className={styles.writeInfo}>
                <Table columns={worksColumns} dataSource={listData} style={{display: this.state.titlIndex==0? "block":"none"}}/>
              </div>
            </div>
          </div>
        </div>
        <ZFooter />
      </div>
    );
  }
}

export default ActRecord;
