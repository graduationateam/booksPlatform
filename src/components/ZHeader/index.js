import { Component } from 'react';
import Link from 'umi/link';
import router from 'umi/router';
import { connect } from 'dva';
import { Menu, Dropdown, Icon, Modal, Button } from 'antd';
import ZBadge from '@/components/ZBadge';
import styles from './index.less';
import { getDto, saveDto } from '@/utils/dto';
import Cookies from 'js-cookie';

@connect(({ global }) => ({
  global
}))
class Zheader extends Component{
  constructor(props){
    super(props);
    this.state={
      user_id: '',
      nick_name: '',
      img_url: '',
      userData: {},
      resourceVisiable: false, //是否显示资源菜单
      isRoll: false, //是否翻转
      isGreen: false, //箭头颜色
      buildVisible: false,
    }
  }
  static defaultProps = {
    addr: 1
  }
  componentDidMount() {
    const token = getDto('userToken');
    if(!!token) {
      this.getUserInfo(token);
    }
  }
  getUserInfo = (token)=> {
    const user_id = getDto('user_id');
    const { dispatch } = this.props;
    dispatch({
      type: 'global/getUserInfo',
      payload:{
        method:'/user/getUser',
        token: token,
      },
      callback:(d)=>{
        if(!user_id) {
          saveDto("user_id",d.data.id,3600*24*15);
        }
        this.setState({
          userData: d.data||{}
        });
      }
    });
  }
  // 退出账户
  signOut = ()=> {
    Cookies.remove("userToken");
    Cookies.remove("user_id");
    router.push("/user/login");
  }
  personalinfo=()=>{
    router.push("/user/personalinfo");
  }
  handleMouseEnter = ()=> {
    this.setState({
      resourceVisiable: true,
      isRoll: true,
      isGreen: true,
    })
  }
  handleMouseLeave = ()=> {
    this.setState({
      resourceVisiable: false,
      isRoll: false,
      isGreen: false,
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
    })
  }
  render(){
    const { addr } = this.props;
    const user_id = getDto('user_id');
    const { userData, resourceVisiable, isRoll, isGreen, buildVisible } = this.state;
    const menu = (
      <Menu>
        <Menu.Item>
          <a onClick={this.personalinfo}><Icon type="user" /> 个人中心</a>
        </Menu.Item>
        <Menu.Item>
          <a onClick={this.signOut}><Icon type="logout" /> 退出账户</a>
        </Menu.Item>
      </Menu>
    );
    return (
      <div className={styles.header}>
        <div className="container">
          <div className={styles.conL}>
            <Link to='/' className={styles.logo}>
              <img src={require('@/assets/mylogo.png')} style={{width:"160px",height:'60px'}}  alt="logo"/>
            </Link>
          </div>
          <ul className={styles.navList}>
            <li className={addr==1?styles.active:''} ><Link to='/'>首页</Link></li>
            <li className={addr==2?styles.active:''} ><Link to='/resource/sells'>出售</Link></li>
            <li className={addr==3?styles.active:''} ><Link to='/resource/buys'>求购</Link></li>
            <li className={addr==4?styles.active:''} ><Link to='/resource/auction'>竞拍</Link></li>
            {/* <li className={styles.resourceLi} onMouseEnter={this.handleMouseEnter.bind(this)} onMouseLeave={this.handleMouseLeave.bind(this)}>
              <div className={addr==4?styles.active:''} >
                <Link to='/resource/course'>资源中心 <img src={addr==4?require('@/assets/arrow_g.png'): isGreen?require('@/assets/arrow_g.png'):require('@/assets/arrow_b.png')} className={isRoll?styles.arrowRoll:styles.arrow}/></Link>
              </div>
            </li> */}
            <li className={addr==5?styles.active:''} >
            {
              !!user_id?
              <Link to='/user/personalinfo'>个人中心</Link>:
              <Link to='/user/login'>个人中心</Link>
            }
            </li>
          </ul>
          <ul className={styles.conR}>
            <li className={styles.hasIcon} onClick={this.showBuilding}>
              <ZBadge count={0}>
                <i className={styles.iconCart}></i>
              </ZBadge>
            </li>
            <li className={styles.hasIcon} onClick={this.showBuilding}>
              <ZBadge count={0}>
                <i className={styles.iconNotice}></i>
              </ZBadge>
            </li>
            <li className={styles.hasIcon} onClick={this.personalinfo}>
              <b className={styles.avatar} style={{backgroundImage: userData.img_url?'url('+userData.img_url+')':`url(${require('@/assets/avatar.jpg')})`}}></b>
            </li>
            <li className={styles.userNameLi}>
            {
              !!user_id?
              <Dropdown overlay={menu}>
                  <a>{userData.userName?userData.userName:''} <Icon type="down" /></a>
              </Dropdown>:
              <Link to="/user/login">去登录</Link>
            }
              
            </li>
          </ul>
        </div>
        <div 
          className={resourceVisiable?styles.resourceCon:styles.resourceHidden}
          onMouseEnter={this.handleMouseEnter.bind(this)} 
          onMouseLeave={this.handleMouseLeave.bind(this)}
        >
          <div className={styles.resourceBtn}>
            <Link to="/resource/course" target="_blank">课程</Link>
            <Link to="/resource/micro" target="_blank">微课</Link>
            <Link to="/resource/lesson" target="_blank">优课</Link>
            <Link to="/resource/material" target="_blank">课件/素材</Link>
            <Link to="/resource/topic" target="_blank">题库</Link>
            <a onClick={this.showBuilding}>试卷</a>
            <a onClick={this.showBuilding}>智慧学案</a>
          </div>
        </div>
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
export default Zheader;
