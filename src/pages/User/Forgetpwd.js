import React, { Component } from 'react';
import Link from 'umi/link';
import styles from './Login.less';

class Forgetpwd extends Component {
  componentDidMount() {
    document.title="233书屋"
  }
  render() {
    return (
      <div className={styles.bgCon}>
        <div className={styles.login}>
          <div className={styles.forgetCon}>
            <div className={styles.bigTitle}>忘记密码</div>
            <div className={styles.textCon}>
                <div className={styles.cText}>
                  <i className={styles.usericon}></i>
                  <input type="text" placeholder="请输入手机号"/>
                </div>
                <div className={styles.dText}>
                  <i className={styles.shortmsgicon}></i>
                  <input type="text" placeholder="请输入验证码"/>
                  <button type="button">获取验证码</button>
                </div>
                <div className={styles.cText}>
                  <i className={styles.pwdicon}></i>
                  <input type="password" placeholder="请输入新密码"/>
                </div>
                <div className={styles.cText}>
                  <i className={styles.pwdicon}></i>
                  <input type="password" placeholder="请再次输入新密码"/>
                </div>
                <button type="button">修改密码</button>
                <div className={styles.returnLogin} style={{marginTop:'10px'}}><Link to='/user/login' >返回登录</Link></div>
            </div>
          </div>
          
        </div>
      </div>
    );
  }
}

export default Forgetpwd;
