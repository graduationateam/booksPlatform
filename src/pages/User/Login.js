import React, { Component } from 'react';
import Link from 'umi/link';
import styles from './Login.less';
import { Form, Input, Button, message, Modal } from 'antd';
import router from 'umi/router';
import { connect } from 'dva';
import {saveDto} from '@/utils/dto';
import Cookies from 'js-cookie';

const FormItem = Form.Item;

@connect(({ login}) => ({
  login
}))
@Form.create()
class Login extends Component {
  constructor(props){
    super(props);
    this.state={
      buildVisible: false,
    }
  }
  componentDidMount() {
    document.title="233书屋"
  }
  //登陆
  handleSubmit=e=>{
    e.preventDefault();
    const { form, dispatch } = this.props;
    form.validateFields({ force: true }, (err, values) => {
      if (!err) {
        dispatch({
          type: 'login/request',
          payload: {
            method:"/user/login",
            phone:values.account,
            password:values.password,
          },
          callback:(d)=>{
            router.push("/home");
          }
        });
      }
    })
  }
  toHome = ()=> {
    router.push("/home");
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
  render() {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    const { buildVisible } = this.state;
    return (
      <div className={styles.bgCon}>
        <div className={styles.login}>
          <div className={styles.imgCon}></div>
          <div className={styles.loginCon}>
            <div className={styles.logo}>
              <img src={require('@/assets/mylogo.png')} style={{width:"300px",height:'100px'}} alt="logo" onClick={this.toHome}/>
            </div>
            <div className={styles.textCon}>
              <Form onSubmit={this.handleSubmit}>
                <div className={styles.cText}>
                  <i className={styles.usericon}></i>
                  <FormItem>
                    {getFieldDecorator('account', {
                      rules: [{
                          required: true,
                          message:"请输入账号"
                        }],
                      })(
                      <Input size="large" placeholder="请输入账号" />
                    )}
                  </FormItem>
                </div>
                <div className={styles.cText}>
                  <i className={styles.pwdicon}></i>
                  <FormItem>
                    {getFieldDecorator('password', {
                      rules: [{
                          required: true,
                          message:"请输入密码"
                        }],
                      })(
                      <Input size="large" type="password"  placeholder="请输入密码" />
                    )}
                  </FormItem>
                </div>
                <div className={styles.wText}>
                  <Link to='/user/register'>账户注册</Link>
                  <Link to='/user/Forgetpwd'>忘记密码</Link>
                </div>
                <FormItem>
                  <Button
                    size="large"
                    type="primary"
                    htmlType="submit"
                  >登录</Button>
                  </FormItem>
              </Form>
            </div>
            <div className={styles.otherLogin}>
              <div className={styles.title}>使用其他登录方式</div>
              <div className={styles.iconList}>
                  <i className={styles.wechaticon} onClick={this.showBuilding}></i>
                  <i className={styles.qqicon} onClick={this.showBuilding}></i>
                  <i className={styles.weiboicon} onClick={this.showBuilding}></i>
              </div>
            </div>
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

export default Login;
