import React, { Component } from 'react';
import { connect } from 'dva';
import Link from 'umi/link';
import styles from './Login.less';
import router from 'umi/router';
import { Checkbox, Modal, Button, message, Form, Input, Radio } from 'antd';
import ZSelect from '@/components/ZSelect';
import XRadioBtn from '@/components/XRadioBtn';
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
let temData={
  school_id:'',
  school_name:'',
  period_id:'',
  period_name:'',
  grade_id:'',
  grade_name:'',
  class_id:'',
  class_name:'',
  subject_id:'',
  subject_name:'',
  is_leader:0
};
/* eslint react/no-multi-comp:0 */
@connect(({ login, itemData,loading}) => ({
  login,
  itemData,
  loading: loading.models.item,
  listSubmitting: loading.effects['user/edit'],
}))
@Form.create()
class Forgetpwd extends Component {
  state = {
      loading: false,
      visible: false,
      resultVisible: false,
      periodData:[],
      schoolData:[],
      gradeData:[],
      classData:[],
      subjectData:[],
      school_name:'',
      phone:'',//获取验证码的手机号码
      verificationCodeing:true,//获取验证码按钮点击事件是否生效
      verificationCodeTime:60,//等待时间秒
    }
  onChange = (e)=> {
    console.log(`checked = ${e.target.checked}`);
  }
  showModal = (value) => { 
    if(value==2) {
      this.setState({
        resultVisible: true,
      });
    }
  }

  msgHandleCancel=()=>{
    this.setState({ 
      resultVisible: false,
    });
    router.push("/user/login");
  }

  componentDidMount() {
    document.title="233书屋"
    const { dispatch } = this.props;
    //绑定 学校
    dispatch({
      type:'login/request',
      payload:{method:'/base/school/getAll'},
      callback:(d)=>{
        if(d.status!=0){
          return;
        }
        this.setState({
          schoolData:d.data||[]
        });
      }
    });
  }

  //电话号码框change事件
  phoneChange=(e)=>{
    this.setState({
      phone:e.target.value
    });
  }

  //获取验证码
  getVerificationCode=()=>{
    if(this.state.phone){
      //发送短信接口待定
      //设置定时器 60秒
      let verificationCodeTime=this.state.verificationCodeTime;
      const timer = setInterval(() => {
        this.setState({ 
          verificationCodeTime: (verificationCodeTime--),
          verificationCodeing:false
       }, () => {
       if (verificationCodeTime === 0) {
           clearInterval(timer);
           this.setState({
            verificationCodeing: true ,
             verificationCodeTime: 60
           })
         }
        });
      }, 1000);

    }
  }

  //提交注册
  handleSubmit = e => {
    e.preventDefault();
    const { form, dispatch } = this.props;
    form.validateFields({ force: true }, (err, values) => {
      if (!err) {
        if(values.password!=values.password_qr){
          message.info("两次输入密码不一致");
          return;
        }
        dispatch({
          type: 'login/request',
          payload: {
            method:"/user/register",
            userName:values.name,
            phone:values.phone,
            password:values.password,
            password_qr:values.password_qr,
          },
          callback:(d)=>{
            if(d.code!=1){
              message.error(d.msg);
              return;
            }
            this.setState({
              resultVisible: true,
            });
          }
        });
      }
    });
  };

  render() {
    const { resultVisible } = this.state;
    const { form, submitting} = this.props;
    const { getFieldDecorator } = form;
    return (
      <div className={styles.bgCon}>
        {/* 教师注册 */}
        <div className={styles.login}>
          <div className={styles.bigTitle}>账户注册</div>
          <div className={styles.textCon}>
            <Form onSubmit={this.handleSubmit} >
              <div className={styles.cText}>
                <i className={styles.usericon}></i>
                <FormItem>
                {getFieldDecorator('name', {
                  rules: [{
                      required: true,
                      message:"请输入用户名"
                    }],
                  })(
                  <Input size="large" placeholder="请输入用户名" />
                )}
                </FormItem>
              </div>
              <div className={styles.cText}>
                <i className={styles.phoneicon}></i>
                <FormItem>
                {getFieldDecorator('phone', {
                  rules: [
                    {
                      required: true,
                      message:"请输入手机号"
                    },
                    {
                      pattern: /^\d{11}$/,
                      message: "请输入正确的手机号码",
                    }],
                  })(
                  <Input size="large" type="text" maxLength={11} placeholder="请输入手机号" onChange={(e)=>this.phoneChange(e)}/>
                )}
                </FormItem>
              </div>
              {/* <div className={styles.dText}>
                <i className={styles.shortmsgicon}></i>
                <FormItem>
                {getFieldDecorator('verification_code', {
                  rules: [
                    {
                      required: true,
                      message:"请输入验证码"
                    }],
                  })(
                  <Input size="large" maxLength={6} placeholder="请输入验证码" />
                )}
                {this.state.verificationCodeing?
                <button type="button" onClick={this.getVerificationCode}>获取验证码</button>
                :
                <button type="button" style={{background:"#cccc"}} disabled={true}>{this.state.verificationCodeTime}S</button>
                }
                </FormItem>
              </div> */}
              <div className={styles.cText}>
                <i className={styles.pwdicon}></i>
                <FormItem>
                {getFieldDecorator('password', {
                  rules: [{
                      required: true,
                      message:"请输入密码"
                    }],
                  })(
                  <Input type="password" size="large" minLength={6} placeholder="请输入密码" />
                )}
                </FormItem>
              </div>
              <div className={styles.cText}>
                <i className={styles.pwdicon}></i>
                <FormItem>
                {getFieldDecorator('password_qr', {
                  rules: [{
                      required: true,
                      message:"请再次输入密码"
                    }],
                  })(
                  <Input type="password" size="large" minLength={6} placeholder="请再次输入密码" />
                )}
                </FormItem>
              </div>
              <div className={styles.agreement}>
              <FormItem>
                {getFieldDecorator('zcxy', {
                  rules: [{
                      required: true,
                      message:"请阅读《注册协议》"
                    }],
                  })(
                  <Checkbox>已阅读并同意</Checkbox>
                )}
                <Link to='' style={{color:'#6fc400'}}>《注册协议》</Link>
                </FormItem>
              </div>
              <FormItem>
              <Button
                size="large"
                loading={submitting}
                type="primary"
                htmlType="submit"
              >注册</Button>
              </FormItem>
            </Form>
            <div className={styles.returnLogin}><Link to='/user/login' >返回登录</Link></div>
            
            {/* 注册完成提示 */}
            <Modal
              title="注册信息"
              onCancel={this.msgHandleCancel}
              visible={resultVisible}
              footer={[
                <div style={{width:'100%',marginLeft:'-210px'}}><Button key="back" type="primary" onClick={this.msgHandleCancel}>好的</Button></div>,
              ]}
            >
              <div style={{textAlign:'center'}}>
                <div style={{ margin:'0 auto', width:'100px', height:'100px', backgroundImage: `url(${require('@/assets/success.png')})`}}></div>
                <div style={{margin:'10px 0'}}>你的注册信息已提交成功</div>
                <div style={{marginBottom:'30px'}}>请等待学校管理员审核</div>
                <div style={{fontSize:'12px',color:'#b3b3b3'}}><span style={{color:'#ff2727'}}>*</span>如长时间未通过，请联系学校相关管理人员询问</div>
              </div>
            </Modal>
          </div>
          {/* <div className={styles.phoneTips}><p>客服电话：0769-82515399</p></div> */}
        </div>
      </div>
    );
  }
}

export default Forgetpwd;
