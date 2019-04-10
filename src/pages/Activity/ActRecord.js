import React, { Component } from 'react';
import Link from 'umi/link';
import { Table, Divider, Tag } from 'antd';
import Zheader from '@/components/Zheader';
import ZFooter from '@/components/ZFooter';
import ZSelect from '@/components/ZSelect';
import styles from './activity.less';
import utilsView from '@/utils/utilsView';
const Data1 = [{name:'已保存',value: 1}, {name:'进行中',value: 2}, {name:'已结束',value: 3}]
const Data2 = [{name:'教研交流',value: 1}]
const titleList = ["报名记录", "作品记录"]
const wayList = ["报名", "投票", "打卡", "答题"]
// const wayCon = (props) => {
//   console.log(props);
// }
const signUpData = [{
  key: '1',
  name: '小李',
  address: '一年级1班',
  time: '2019-01-01'
}];
const worksData = [{
  key: '1',
  name: '小李',
  address: '一年级1班',
  score: '一等奖',
  datas: 'xxx',
  time: '2019-01-01'
}];
const signUpColumns = [
  { title: '序号',dataIndex: 'key',key: 'key',render: text => <a href="javascript:;">{text}</a>, }, 
  { title: '姓名',dataIndex: 'name',key: 'name' }, 
  { title: '班级',dataIndex: 'address',key: 'address', },
  { title: '报名时间',dataIndex: 'time',key: 'action', }
];
const worksColumns = [
  { title: '序号',dataIndex: 'key',key: 'key',render: text => <a href="javascript:;">{text}</a>, }, 
  { title: '姓名',dataIndex: 'name',key: 'name' }, 
  { title: '作品',dataIndex: 'address',key: 'address', },
  { title: '成绩',dataIndex: 'score',key: 'score', },
  { title: '数据',dataIndex: 'datas',key: 'datas', },
  { title: '时间',dataIndex: 'time',key: 'action', }
];

class ActRecord extends Component {
  constructor(props){
    super(props);
    this.state = {
      wayIndex: 0,
      titlIndex: 0,
    }
  }
  onchange= (value)=> {
    console.log(value);
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
  
  render() {
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
              <ul className={styles.titleBtn}>
                  {
                    titleList.map((item,index)=> {
                      return this.state.titlIndex==index? 
                      <li key={index} className={styles.active} onClick={this.titleTabChange.bind(this,`${index}`)}>{item}</li>:
                      <li key={index} onClick={this.titleTabChange.bind(this,`${index}`)}>{item}</li>
                    })
                  }
              </ul>
              <div className={styles.writeInfo}>
                <Table columns={signUpColumns} dataSource={signUpData} style={{display: this.state.titlIndex==0? "block":"none"}}/>
                <Table columns={worksColumns} dataSource={worksData} style={{display: this.state.titlIndex==1? "block":"none"}}/>
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
