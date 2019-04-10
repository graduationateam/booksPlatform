import { Component } from 'react';
import styles from './index.less';

class ZFooter extends Component{
  constructor(props){
    super(props);
    this.state={
    }
  }

  render(){
    return (
      <div className={styles.footerCon}>
        <div className={styles.title}>233书屋二手书交易平台</div>
        <div className={styles.info}>
          <span><i className={styles.phone}></i>17876253527</span>
          <span><i className={styles.email}></i>1048900106@qq.com</span>
          <span><i className={styles.address}></i>广东省肇庆市端州区肇庆学院</span>
        </div>
        <div className={styles.copyright}>二手书交易平台&nbsp;&nbsp;肇庆学院老李Copyright 2019 etiantian.All Rights Reserved.&nbsp;&nbsp;粤0212001311-2&nbsp;&nbsp;建议使用谷歌浏览器</div>
      </div>
    );
  }
}
export default ZFooter;
