import React, { Component } from 'react';
import styles from './index.less';
import { Tree,Collapse } from 'antd';
import 'moment/locale/zh-cn';
import router from 'umi/router';
import { getDto, removeToken } from '@/utils/dto';
import { connect } from 'dva';

const Panel = Collapse.Panel;
@connect(({ global }) => ({
  global
}))
class ZLeft extends Component {
  constructor(props){
    super(props);
    this.state={
      user_id: '',
      userData: {}
    }
  }
  componentDidMount() {
    const user_id = getDto('user_id');
    if(user_id) {
      this.setState({
        user_id: user_id,
      })
      this.getUserInfo();
    }else {
      router.push("/user");
    }
  }

  getUserInfo = ()=> {
    const user_id = getDto('user_id');
    const { dispatch } = this.props;
    dispatch({
      type: 'global/getUserInfo',
      payload:{
        method:'/sys/user/get',
        user_id: user_id,
      },
      callback:(d)=>{
				if(!d.img_url){
					d.img_url=require('@/assets/avatar.jpg');
				}
				this.setState({
					userData:d||{}
				});
      }
    });
  }

    render(){
      function callback(key) {
        console.log(key);
      }

      const {userData} = this.state
        return (
            <div className={styles.personalInfoLeft}>
				<ul className={styles.personalInfoLeftUl}>
					<li>
						<img src={userData.img_url} alt="logo"  className={styles.avatar}/>
					</li>
					<li style={{margin:'10px 0'}}> {userData.user_name}</li>
					<li style={{color: '#b3b3b3'}}>{userData.art_remark}</li>
				</ul>
				<div style={{marginTop:'30px',background:'#fff'}}>
        <Collapse defaultActiveKey={['1']} onChange={callback}>
            <Panel header="我的空间" key="1">
              <ul className={styles.myHomePlace}>
                <li>个人资料</li>
                <li>我的收藏</li>
                <li>我的出售</li>
                <li>我的订单</li>
                <li>我的求购</li>
                <li>我的竞拍</li>
                <li>通知</li>
                <li>提问</li>
              </ul>
            </Panel>
        </Collapse>
				</div>
				{/* <div className={styles.punchClock}>
					<span>打卡</span>签到第几天
				</div> */}
		    </div>
        );
    };

}
export default ZLeft;

