import React, { Component,Fragment } from 'react';
import Zheader from '@/components/Zheader';
import ZLeft from '@/components/ZLeft';
import XRadioBtn from '@/components/XRadioBtn';
import Fwindow from '@/components/Fwindow';
import ZSelect from '@/components/ZSelect';
import ZUpload from '@/components/ZUpload';
import styles from './user.less';
import { Form,Progress,Tree,Input,Radio,Button,message,Icon,Table,Modal,Checkbox } from 'antd';
import 'moment/locale/zh-cn';
import { connect } from 'dva';
import {getDto} from '@/utils/dto';
const { TextArea } = Input;
const RadioGroup = Radio.Group;
@connect(({ user, itemData,loading}) => ({
  user,
  itemData,
  loading: loading.models.item,
  listSubmitting: loading.effects['user/edit'],
}))
@Form.create()
class PersonalInfo extends Component {
  constructor(props){
    super(props);
  }
  state = {
	 Visible:0,
	 tabsVisible:1,
	 uploadLoading: false,
	 userData:{},//sys_user表数据
	 phoneData:{},//绑定||更换手机号码数据
   passwordData:{},//记录修改密码的数据
   rightWidth:null,
   bool:true,
   addClassSubjectBool:false,
   style: { height: "28px", padding: '0 12px', lineHeight: "28px", textAlign: "center" },
   iconHover:3,
   editModalBool:false
  }
  toChangeBool=()=>{
    this.setState({bool:false})
  }
  handleResize = (e) => {
    let rightWidth 
    this.setState({rightWidth:rightWidth})
  }


	onChange = (e) => {
    console.log('radio checked', e.target.value);
    this.setState({
      value: e.target.value,
    });
  }
  componentDidMount() {
     window.addEventListener('resize', this.handleResize.bind(this)) //监听窗口大小改变
		const { dispatch } = this.props;
		//获取教师职务 、教师职称
		dispatch({
      type:'itemData/get',
			num:'1005',
			payload:{method:'/sys/item/getInfo'}
		});
		dispatch({
      type:'itemData/get',
			num:'1006',
			payload:{method:'/sys/item/getInfo'}
    });
		//个人信息
		this.getUserInfo();

		//查询 教学班级科目信息

	}
	
	//查询用户信息
	getUserInfo=()=>{
		const { dispatch } = this.props;
		dispatch({
      type:'user/request',
      payload:{
				method:'/sys/user/get',
				user_id:getDto("user_id")
			},
      callback:(d)=>{
        if(d.status!=0){
          return;
				}
				if(!d.data.img_url){
					d.data.img_url=require('@/assets/avatar.jpg');
				}
				this.setState({
					userData:d.data||{}
				});
      }
    });
	}

	// 图片操作
  handleUploadChange = (info) => {
    if (info.file.status === 'uploading') {
      this.setState({ uploadLoading: true });
      return;
    }
    if (info.file.status === 'done') {
      const res = info.file.response;
      if(res.status != '0') {
        message.error(res.msg);
        this.setState({ uploadLoading: false });
        return
			}
			let data=this.state.userData;
			data.img_url=res.data.path;
      this.setState({
        userData: data,
        uploadLoading: false,
      })
    }
  }




	onSelect = (selectedKeys, info) => {
    console.log('selected', selectedKeys, info);
  }

  onCheck = (checkedKeys, info) => {
    console.log('onCheck', checkedKeys, info);
  }
	//个人信息右上边选项卡
  personalInfoTab=(val)=>{
    this.setState({Visible:val})
  }
toChangeNumber=(e)=>{
	this.setState({
		tabsVisible:2
	})
}
toAddDelete=()=>{
	this.setState({
		tabsVisible:3
	})
}
toModify=()=>{
	this.setState({
		tabsVisible:4
	})
}
	goBack=()=>{
		this.setState({
			tabsVisible:1
		})
}

	userNameChange=(e)=>{
		let data=this.state.userData;
		data.user_name=e.target.value;
		this.setState({
			userData:data
		});
	}
	nickNameChange=(e)=>{
		let data=this.state.userData;
		data.nick_name=e.target.value;
		this.setState({
			userData:data
		});
	}
	mobileChange=(e)=>{
		let data=this.state.userData;
		data.mobile=e.target.value;
		this.setState({
			userData:data
		});
	}
	technicalTitleChange=(e)=>{
		let data=this.state.userData;
		data.technical_title=e;
		this.setState({
			userData:data
		});
	}
	dutieChange=(e)=>{
		let data=this.state.userData;
		data.dutie=e;
		this.setState({
			userData:data
		});
	}
	honoraryTitleChange=(e)=>{
		let data=this.state.userData;
		data.honorary_title=e.target.value;
		this.setState({
			userData:data
		});
	}
	artRemarkChange=(e)=>{
		let data=this.state.userData;
		data.art_remark=e.target.value;
		this.setState({
			userData:data
		});
	}
	genderChange=(e)=>{
		let data=this.state.userData;
		data.gender=e.target.value;
		this.setState({
			userData:data
		});
	}    

	//保存修改
	saveUser=()=>{
		const { dispatch } = this.props;
		//校验是否填写完整
		const {userData}=this.state;
		if(!userData.user_name){
			message.info("请填写姓名");
			return;
		}
		
		dispatch({
      type:'user/request',
      payload:{
				method:'/sys/user/saveUser',
				...userData
			},
      callback:(d)=>{
        if(d.status!=0){
          return;
				}
				message.success("保存成功!");
      }
		});
	}

	//跟换||绑定手机
	phoneVeriChange=(e)=>{
		let data=this.state.phoneData;
		data.veri_code=e.target.value;
		this.setState({
			phoneData:data
		});
	}
	oldPhoneChange=(e)=>{
		let data=this.state.phoneData;
		data.old_phone=e.target.value;
		if(data.old_phone==data.new_phone){
			message.info("新旧手机号码不能重复.");
			return;
		}
		this.setState({
			phoneData:data
		});
	}
	newPhoneChange=(e)=>{
		let data=this.state.phoneData;
		data.new_phone=e.target.value;
		if(data.old_phone==data.new_phone){
			message.info("新旧手机号码不能重复.");
			return;
		}
		this.setState({
			phoneData:data
		});
	}
	changePhone=()=>{
		const { dispatch } = this.props;
		//校验填写是否完整
		const {phoneData,userData}=this.state;
		if(userData.phone && !phoneData.old_phone){
			message.info("请填写原手机号！");
			return;
		}
		if(!phoneData.new_phone){
			message.info("请填写新手机号！");
			return;
		}
		if(!phoneData.veri_code){
			message.info("请短信验证码！");
			return;
		}
		
		dispatch({
			type:'user/request',
			payload:{
				method:'/sys/user/changePhone',
				veri_code:phoneData.veri_code,
				new_phone:phoneData.new_phone,
				old_phone:phoneData.old_phone,
				type:userData.phone?1:2,
				user_id:userData.id,
				relation_id:userData.relation_id
			},
			callback:(d)=>{
				if(d.status!=0){
					message.error(d.msg);
					return;
				}
				message.success("保存成功!");
			}
		});
	}

	//修改密码
	oldPasswordChamge=(e)=>{
		let data=this.state.passwordData;
		data.old_password=e.target.value;
		this.setState({
			passwordData:data
		});
	}
	newPasswordChamge=(e)=>{
		let data=this.state.passwordData;
		data.new_password=e.target.value;
		// if(data.new_password!=data.new2_password){
		// 	message.info("两次输入的新密码不一致.");
		// 	return;
		// }
		this.setState({
			passwordData:data
		});
	}
	new2PasswordChamge=(e)=>{
		let data=this.state.passwordData;
		data.new2_password=e.target.value;
		// if(data.new_password!=data.new2_password){
		// 	message.info("两次输入的新密码不一致.");
		// 	return;
		// }
		this.setState({
			passwordData:data
		});
	}

	changePassword=()=>{
		const { dispatch } = this.props;
		//校验填写是否完整
		const {passwordData,userData}=this.state;
		if(!passwordData.old_password){
			message.info("请输入原密码");
			return;
		}
		if(!passwordData.new_password){
			message.info("请输入新密码");
			return;
		}
		if(!passwordData.new2_password){
			message.info("请再次输入新密码");
			return;
		}
		if(passwordData.new_password!=passwordData.new2_password){
			message.info("两次输入密码不一致");
			return;
		}

		dispatch({
			type:'user/request',
			payload:{
				method:'/sys/user/changePwd',
				password:passwordData.old_password,
				new_password:passwordData.new_password,
				user_id:userData.id,
			},
			callback:(d)=>{
				if(d.status!=0){
					message.error(d.msg);
					return;
				}
				message.success("保存成功!");
			}
		});

	}
	toTableSetUp=()=>{
    console.log("aaa")
  }
  addClassSubject=()=>{
    this.setState({addClassSubjectBool:true})
  }
  iconHover=(val)=>{
    this.setState({iconHover:val})
  }
  iconLeave=(val)=>{
    this.setState({iconHover:val+10})
  }
  editModalCancel=()=>{
    this.setState({editModalBool:false})
  }
  render() {
		const { Visible,phoneNumber,VisibleTab,tabsVisible,userData,uploadLoading,rightWidth,bool,iconHover} = this.state
		const { form,itemData:{dutieData,titleData}} = this.props;
		const { getFieldDecorator } = form;
		function callback(key) {
		  console.log(key);
		}
		
    const str2 = userData.phone?userData.phone.substring(0,3)+ "****" + userData.phone.substring(7):'';
    const worksColumns = [
      { title: '是否班主任', align: 'center', width: '15%', dataIndex: 'teacher' }, 
      { title: '学年', align: 'center', width:  '20%', dataIndex: 'year' }, 
      { title: '学期', align: 'center', width:  '15%', dataIndex: 'term' }, 
      { 
          title: '学校',
          align: 'center',
          dataIndex:'school',
          width:'20%'
      },
      { title: '班级科目', align: 'center', width:  '15%', dataIndex: 'subject' },
      {
        title: '',
        align: 'center',
		    width:  '15%',
        render: (val, row) => (
          <div>
            <Fragment>
              {
                  console.log(row)
              }
            <a style={{color:'#666'}} onClick={()=>{this.setState({editModalBool:true})}}>设置</a>
          </Fragment>
          </div>
          
        ),
      }
    ];
    const worksData = [
      {
        teacher: '否',
        year: '2018~2019',
        term: '下学期',
        school: '广州市第十六中学',
        subject:'301语文',
      },
      {
        teacher: '否',
        year: '2018~2019',
        term: '下学期',
        school: '广州市第十六中学',
        subject:'301语文',
      },
      {
        teacher: '否',
        year: '2018~2019',
        term: '下学期',
        school: '广州市第十六中学',
        subject:'301语文',
      },

    ];
    const editColumns = [
      {
        title: '',
        align: 'right',
		    width:  '10%',
        render: (val, row) => (
          <div>
            <Fragment>
              {
                  console.log(row)
              }
            <Checkbox></Checkbox>
          </Fragment>
          </div>
          
        ),
      },
      { title: '学号', align: 'center', width: '20%', dataIndex: 'number' }, 
      { title: '姓名', align: 'center', width:  '25%', dataIndex: 'name' }, 
      { title: '性别', align: 'center', width:  '20%', dataIndex: 'sex' }, 
      { title: '小组',align: 'center',dataIndex:'group',width:'25%'},
    ];
    const editData = [
      {
        number: '666666',
        name: '李白',
        sex: '男',
        group: '青春靓丽',
      },
      {
        number: '666666',
        name: '李白',
        sex: '男',
        group: '青春靓丽',
      },
      {
        number: '666666',
        name: '李白',
        sex: '男',
        group: '青春靓丽',
      },
    ];
    const periodArr = [
      {value:1,name:'小学'},
      {value:2,name:'初中'},
      {value:3,name:'高中'},
    ]
    const gradeArr = [
      {value:1,name:'一年级'},
      {value:2,name:'二年级'},
      {value:3,name:'三年级'},
      {value:4,name:'四年级'},
      {value:5,name:'五年级'},
      {value:6,name:'六年级'},
    ]
    const classArr = [
      {value:1,name:'一班'},
      {value:2,name:'二班'},
      {value:3,name:'三班'},
    ]
    const subjectArr = [
      {value:1,name:'语文'},
      {value:2,name:'数学'},
    ]
    const groupArr = [
      {key:'0',name:'青春靓丽'},
      {key:'1',name:'活力四射'},
      {key:'2',name:'永不言败'}
    ]
    return (
      <div>
        <Zheader addr={5}/>
					<div className={styles.personalInfo}>

						<ZLeft/>

						<div className={styles.personalInfoRight}>
								<div style={{display:'flex'}}>
										<Button onClick={this.personalInfoTab.bind(this,0)} style={{width:'90px',height:'30px',lineHeight:'30px',fontSize:'14px',background:Visible == 0?'#6fc400':'none',color:Visible == 0?'#fff':'#000',border:'none'}}>基本资料</Button>
                    <Button onClick={this.personalInfoTab.bind(this,1)} style={{width:'90px',height:'30px',lineHeight:'30px',fontSize:'14px',background:Visible == 1?'#6fc400':'none',marginLeft:'10px',color:Visible == 1?'#fff':'#000',border:'none'}}>账户安全</Button>
								</div>
								<div className={styles.messageLeft} style={{display:Visible == 0?'block':'none'}}>
								{
									// 上
								}

								{/* <img src={require('@/assets/avatar.jpg')} alt="logo" className={styles.avatar}/>   */}
								
								<div style={{width: "80px",height: "120px",margin:"0 auto 0"}}>
									{getFieldDecorator('img_url', {
										initialValue:userData.img_url,
										})(
											<ZUpload
												onChange={this.handleUploadChange}
												loading={uploadLoading}
												className='avatar-uploader'
												listType='picture'
											>
												{userData.img_url ?
													<div style={{textAlign:'center',cursor:'pointer'}}>
                            <img src={userData.img_url} alt="logo" className={styles.avatar}/>
                            <div style={{color:'#999'}}>点击更换头像</div>
                          </div> :
													<div>
														<Icon type={uploadLoading ? 'loading' : 'plus'} />
														<div className="ant-upload-text">上传</div>
													</div>
												}
											</ZUpload>
									)}
								</div>
								<p className={styles.explain}>{userData.art_remark||'修改你的个人资料，显示在个人名片中'}</p>
								<Progress percent={userData.growth_value} showInfo={false} className={styles.progress} strokeColor="#6fc400" style={{display:'block',margin:'0 auto'}}/>
								<div style={{textAlign:'center'}}>Lv{userData.grade||1}   {userData.growth_value||0}/100</div>
								<div style={{margin:'20px 0 20px',fontWeight:'bold'}}>个人信息</div>
								
								<div className={styles.personalMessage}>
									<ul>
										<li>
												<span>昵称</span>
												{getFieldDecorator('nick_name', {
													initialValue:userData.nick_name,
													})(
														<Input placeholder="输入昵称" onChange={(e)=>{this.nickNameChange(e)}}/> 
												)} 
												
										</li>
										<li>
												<span>邮箱</span>
												{getFieldDecorator('mobile', {
													initialValue:userData.mobile,
													})(
														<Input placeholder="联系电话" onChange={(e)=>{this.mobileChange(e)}}/>
												)}
												
										</li>
										<li>
												<span>个人简介</span>
												{getFieldDecorator('art_remark', {
													initialValue:userData.art_remark,
													})(
														<TextArea rows={4}  placeholder="输入个人简介" onChange={(e)=>{this.artRemarkChange(e)}}/> 
												)}
												
										</li>
									</ul>
									<div style={{padding:'15px 0 0 50px'}}>
											<span style={{paddingRight:'10px'}}>性别</span>	
											{getFieldDecorator('gender', {
													initialValue:userData.gender,
													})(
														<RadioGroup onChange={(e)=>{this.genderChange(e)}}>
															<Radio value={1}>男</Radio>
															<Radio value={0}>女</Radio>
														</RadioGroup>
												)}
									</div>

								</div>
								<div style={{display:'flex',justifyContent:'center',marginTop:'60px'}}>
										<Button style={{width:'120px',height:'34px',background:'#6fc400',color:'#fff'}} onClick={this.saveUser}>保存</Button>
										{/* <Button style={{width:'120px',height:'34px',marginLeft:'24px',color:'#fff',background:'#cccccc'}}>返回</Button> */}
								</div>
								
								{
									// 下
								}
								<div style={{fontWeight:'bold',margin:'10px 0',display:'none'}}>学校班级信息</div>
									<div className={styles.personalMessage}>
										{/* <ul>
											<li>
													<span>学校名称</span>
													<Input placeholder="Basic usage"/>
											</li>
											<li>
													<span>班级</span>
													<Input placeholder="Basic usage"/>
											</li>
											<li>
													<span>任教科目</span>
													<Input placeholder="Basic usage"/>
											</li>
										</ul> */}
									</div>
									{/* <div style={{display:'flex',justifyContent:'center',marginTop:'60px'}}>
										<Button style={{width:'120px',height:'34px',background:'#6fc400',color:'#fff'}}>保存</Button>
										<Button style={{width:'120px',height:'34px',marginLeft:'24px',color:'#fff',background:'#cccccc'}}>返回</Button>
									</div> */}
								</div>
								<div className={styles.accountTab} style={{display:Visible == 1?'block':'none'}}>
								{
									//原始页面
								}
											<ul style={{display:tabsVisible==1?'block':'none'}} className={styles.accountTabUlOne}>
													<li>
														<span>用户账户</span>
														<span>{userData.account}</span>
													</li>
													<li>
														<span>用户名称</span>
														<span>{userData.user_name}</span>
													</li>
													<li>
														<span>手机号码</span>
														<span>{str2}</span>
														<div onClick={()=>{this.toChangeNumber()}}>{str2?'更换':'绑定'}</div>
													</li>
													<li>
														<span>第三方绑定</span>
														<span className={styles.iconfont}>
                              <i className={styles.wechaticon}></i>
                              <i className={styles.qqicon}></i>
                            </span>
														<div onClick={()=>{this.toAddDelete()}}>添加/删除</div>
													</li>
													<li>
														<span>登录密码</span>
														<span>********</span>
														<div onClick={()=>{this.toModify()}}>修改</div>
													</li>
											</ul>
											{
												// 更换手机号
											}
										  <div style={{display:tabsVisible==2?'block':'none'}} className={styles.toChangePhoneNumber}>
											   <div className={styles.title}>{str2?'更换手机号':'绑定手机号'}</div>
											   <ul>
												 		{str2?
														<li><Input placeholder="输入原手机号" onChange={(e)=>{this.oldPhoneChange(e)}}/></li>
														:''
														}
														<li><Input placeholder="输入新手机号" onChange={(e)=>{this.newPhoneChange(e)}}/></li>
														<li>
															<Input placeholder="输入验证码" className={styles.identifyingCode} onChange={(e)=>{this.phoneVeriChange(e)}}/>
															<Button className={styles.getIdentifyingCode} style={{height:'42px'}}>获取验证码</Button>
														</li>
														<li className={styles.button}>
															<Button style={{width:'120px',height:'34px',background:'#6fc400',color:'#fff'}} onClick={this.changePhone}>保存</Button>
															<Button style={{width:'120px',height:'34px',marginLeft:'24px',color:'#fff',background:'#cccccc'}} onClick={()=>{this.goBack()}}>返回</Button>
														</li>
												 </ul>
											</div>
											{
												// 第三方绑定
											}
											<div style={{display:tabsVisible==3?'block':'none'}} className={styles.toChangePhoneNumber}>
											  <div className={styles.title}>第三方绑定</div>
											  	<ul className={styles.toBind}>
											  		<li>
                              <i className={styles.qqicon}></i>
                              <b className={styles.current}>Dang</b>
                              <span className={styles.remove}>解除</span>
														</li>
											  		<li>
                              <i className={styles.wechaticon}></i>
                              <b>未绑定</b>
                              <span className={styles.bind}>绑定</span>
														</li>
														<li>
                              <i className={styles.weiboicon}></i>
                              <b>未绑定</b>
                              <span className={styles.bind}>绑定</span>
														</li>
											  		<li className={styles.button}>
											  			<Button style={{width:'120px',height:'34px',marginLeft:'24px',color:'#fff',background:'#b3b3b3'}} onClick={()=>{this.goBack()}}>返回</Button>
											  		</li>
											  	</ul>
											</div>
											{
												// 修改密码
											}
											<div style={{display:tabsVisible==4?'block':'none'}} className={styles.toChangePhoneNumber}>
											<div className={styles.title}>修改密码</div>
												<ul>
													<li><Input type="password" placeholder="输入原密码" onChange={(e)=>{this.oldPasswordChamge(e)}}/></li>
													<li><Input type="password" placeholder="输入新密码" onChange={(e)=>{this.newPasswordChamge(e)}}/></li>
													<li><Input type="password" placeholder="输确认新密码" onChange={(e)=>{this.new2PasswordChamge(e)}}/></li>
													<li className={styles.button}>
														<Button style={{width:'120px',height:'34px',background:'#6fc400',color:'#fff'}} onClick={this.changePassword}>保存</Button>
														<Button style={{width:'120px',height:'34px',marginLeft:'24px',color:'#fff',background:'#b3b3b3'}} onClick={()=>{this.goBack()}}>返回</Button>
													</li>
												</ul>
											</div>
								</div>
                <div style={{display:Visible == 2?'block':'none'}} className={styles.SubjectGroup}>
                <div className={styles.title} onClick={()=>{this.addClassSubject()}}>+添加班级科目</div>
                <Table columns={worksColumns} dataSource={worksData} pagination={false}/>
                </div>
						</div>
					</div>
          {/* 添加班级科目 弹窗 */}
          <Modal
              title="添加班级科目"
              visible={this.state.addClassSubjectBool}
              closable={false}
              footer={null}
              width={400}
              >
              <ul className={styles.addClassSubjectModal}>
                <li>
                  <span className={styles.title}>学校</span>
                  <Input type="text" placeholder="请输入学校名称"/>
                </li>
                <li>
                  <span className={styles.title}>学段</span>
                  <XRadioBtn
                    option={periodArr}
                    style={this.state.style}
                  ></XRadioBtn>
                </li>
                <li>
                  <span className={styles.title}>年级</span>
                  <XRadioBtn
                    option={gradeArr}
                    style={this.state.style}
                  ></XRadioBtn>
                </li>
                <li>
                  <span className={styles.title}>班级</span>
                  <XRadioBtn
                    option={classArr}
                    style={this.state.style}
                  ></XRadioBtn>
                </li>
                <li>
                  <span className={styles.title}>科目</span>
                  <XRadioBtn
                    option={subjectArr}
                    style={this.state.style}
                  ></XRadioBtn>
                </li>
                <li>
                  <span className={styles.title}></span>
                  <Checkbox>是否班主任</Checkbox>
                </li>
                <li className={styles.button}>
                  <span className={styles.title}></span>
                  <div>
                    <Button style={{width:'120px',height:'34px',background:'#6fc400',color:'#fff'}} onClick={()=>{}}>确定</Button>
                    <Button style={{width:'120px',height:'34px',marginLeft:'24px',color:'#fff',background:'#cccccc'}} onClick={()=>{this.setState({addClassSubjectBool:false})}}>取消</Button>
                  </div>
                </li>
              </ul>
            
		    </Modal>
        {/* 表格编辑弹窗 */}
        <Modal
              title="编辑301语文小组"
              visible={this.state.editModalBool}
              closable={true}
              footer={null}
              width={814}
              className={styles.editModal}
              onCancel={()=>{this.editModalCancel()}}
              >
              <div className={styles.editTableSetUp}>
                    <div className={styles.search}>
                      <Input type="text" placeholder="请输入小组名称（不超过20个字符）"/>
                      <Button style={{width:'60px',height:'32px',background:'#6fc400',color:'#fff',marginLeft:'12px'}} onClick={()=>{}}>添加</Button>
                    </div>
                    <div>
                      <ul>
                        {
                          groupArr.map((item,i)=>{
                            return(
                              <li onMouseEnter={this.iconHover.bind(this,item.key)} onMouseLeave={this.iconLeave.bind(this,item.key)}>
                                  {item.name}（<span>10</span>人）
                                <div className={styles.iconHover} style={{display:iconHover==item.key?'block':'none'}}>
                                  <i className={styles.iconEdit}></i>
                                  <i className={styles.iconDelete}></i>
                                </div>
                              </li>
                            )
                          })
                        }
                        {/* <li onMouseEnter={this.iconHover.bind(this,0)} onMouseLeave={this.iconLeave.bind(this,0)}>
                          青春靓丽（<span>10</span>人）
                          <div className={styles.iconHover} style={{display:iconHover==0?'block':'none'}}>
                            <i className={styles.iconEdit}></i>
                            <i className={styles.iconDelete}></i>
                          </div>
                        </li>
                        <li onMouseEnter={this.iconHover.bind(this,1)} onMouseLeave={this.iconLeave.bind(this,1)}>
                          青春靓丽（<span>10</span>人）
                          <div className={styles.iconHover} style={{display:iconHover==1?'block':'none'}}>
                            <i className={styles.iconEdit}></i>
                            <i className={styles.iconDelete}></i>
                          </div>
                        </li>
                        <li onMouseEnter={this.iconHover.bind(this,2)} onMouseLeave={this.iconLeave.bind(this,2)}>
                          青春靓丽（<span>10</span>人）
                          <div className={styles.iconHover} style={{display:iconHover==2?'block':'none'}}>
                            <i className={styles.iconEdit}></i>
                            <i className={styles.iconDelete}></i>
                          </div>
                        </li> */}
                      </ul>
                    </div>
                    <div className={styles.editBottom}>
                        <div>学生分组</div>
                        <div style={{color:'#919191',margin:'20px 0'}}>
                            选中（<span>10</span>人）添加至
                          <ZSelect 
															data={titleData}
															placeholder=""
															style={{width: "126px",height:'28px',marginLeft:'12px'}}
															// onChange={}
														/>
                        </div>
                        <Table columns={editColumns} dataSource={editData} pagination={false}/>
                    </div>
              </div>
		    </Modal>
          {/* 浮动窗口 */}
        {/* <div style={{display:bool === true ? 'block' : 'none'}}>
          <Fwindow changeBool={()=>{this.toChangeBool()}}/>
        </div> */}
      </div>
    )
  }
}
export default PersonalInfo;
