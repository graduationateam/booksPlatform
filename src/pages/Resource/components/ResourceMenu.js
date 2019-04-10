import React, { Component } from 'react';
import Link from 'umi/link';
import styles from '../resource.less';
import { Menu, Dropdown, Icon } from 'antd';
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');
const menu = (
    <Menu>
      <Menu.Item><Link to="/resource">课程</Link></Menu.Item>
      <Menu.Item><Link to="/resource/material">课件/素材</Link></Menu.Item>
      <Menu.Item><Link to="/resource/wisdom">智慧学案</Link></Menu.Item>
      <Menu.Item><Link to="/resource/examinationpaper">试卷</Link></Menu.Item>
      <Menu.Item><Link to="/resource/topic">题库</Link></Menu.Item>
      <Menu.Item><Link to="/resource/micro">微课</Link></Menu.Item>
      <Menu.Item><Link to="/resource/lesson">优课</Link></Menu.Item>
      <Menu.Item><Link to="/resource/resourcebasket">资源篮</Link></Menu.Item>
    </Menu>
);

class ResourceMenu extends Component {
  constructor(props){
    super(props);
    this.state = {
    }
  }
  static defaultProps = {
    resourceType: 1,
    third: ''
  }
  onChange= ()=> {
  }
  render() {
    const { resourceType, third } = this.props;
    return (
        <div className={styles.palceCon}>
            <div className="container">
            <Link to=''>资源中心</Link>
            <span style={{margin:'0 5px'}}>/</span>
            <Dropdown overlay={menu}>
            {
              resourceType==2?
              <Link to="/resource/material">课件/素材 <Icon type="down" /></Link>
              :resourceType==3?
              <Link to="/resource/wisdom">智慧学案 <Icon type="down" /></Link>
              :resourceType==4?
              <Link to="/resource/examinationpaper">试卷 <Icon type="down" /></Link>
              :resourceType==5?
              <Link to="/resource/newpractice">题库 <Icon type="down" /></Link>
              :resourceType==6?
              <Link to="/resource/micro">微课 <Icon type="down" /></Link>
              :resourceType==7?
              <Link to="/resource/lesson">优课 <Icon type="down" /></Link>
              :resourceType==8?
              <Link to="/resource/resourcebasket">资源篮 <Icon type="down" /></Link>
              :<Link to="/resource">课程 <Icon type="down" /></Link>
            }
            </Dropdown>
            {
              !!third?
              <span style={{margin:'0 5px',color:'#333'}}><span style={{color:'#b2b2b2'}}>/ </span>{third}</span>
              :''
            }
            </div>
        </div>
    );
  }
}

export default ResourceMenu;
