import React, { Component } from 'react';
import Link from 'umi/link';
import Zheader from '@/components/Zheader';
import ZFooter from '@/components/ZFooter';
import ZSelect from '@/components/ZSelect';
import ZUpload from '@/components/ZUpload';
import ZUeditor from '@/components/ZUeditor';
import config from '@/config';
import ViewUtils from '@/utils/utilsView';
import { getDto } from '@/utils/dto';
import Utils from '@/utils/utils';
import { Modal, Icon, Radio, Upload, Button, Checkbox, DatePicker, TimePicker, Switch, Cascader, Form, Tree, Row, Col, Input, message } from 'antd';
import styles from './activity.less';
import locale from 'antd/lib/date-picker/locale/zh_CN';
import moment from 'moment';
import { connect } from 'dva';
import 'moment/locale/zh-cn';
import router from 'umi/router';
import { getJSDocAugmentsTag } from 'typescript';
moment.locale('zh-cn');
const CheckboxGroup = Checkbox.Group;
const RadioGroup = Radio.Group;
const FormItem = Form.Item;
const Search=Input.Search;
const { RangePicker } = DatePicker;
const { TreeNode } = Tree;

//let temData={};
const titleList = ["活动设计"]
const wayList = ["报名", "投票", "打卡", "作品","奖项"]//"答题"
const options = [
  { label: '标题', value: 1 },
  { label: '描述', value: 2 },
  { label: '附件', value: 3 },
];
const data = [{
  value: '1',
  label: '小学',
  children: [{
    value: '2',
    label: '一年级',
    children: [{
      value: '3',
      label: '1班',
    }],
  }],
}];
const plainOptions = ['李小李', '黄小黄', '林小林', '吴小吴', '微小微'];
// const plainOptions = [];
const defaultCheckedList = ['Apple', 'Orange'];

//报名类型
const enlistTypeData=[{id:1,name:"个人"},{id:2,name:"团队"}];
// 活动对象弹窗
const ChoosePeople = Form.create()(props => {
  const { choosePeopleVisible, defaultCheckedKeys,defaultuserChecked,userOnchange,
          form, handleCancel, userList, onCheck, objOnSelect,orgData,objType,objTypeChange,
          indeterminate,onCheckAllChange,checkAll  } = props;
  return(
    <Modal
      width={800} 
      //destroyOnClose
      title="指定活动参与对象"
      onCancel={() => handleCancel()}
      visible={choosePeopleVisible}
      footer={[
        <div style={{ width: '100%', textAlign:"center"}}><Button style={{ width: '80px'}} key="submit" type="primary" onClick={()=>handleCancel()}>关闭</Button></div>
      ]}
    >
      <FormItem wrapperCol={{ span: 24 }}>
        {form.getFieldDecorator('topic')
        (
          <div>
          <Row className="popUpCon">
            <RadioGroup value={objType} onChange={objTypeChange}>
              <Radio value={1}>按人</Radio>
              <Radio value={2}>按组</Radio>
            </RadioGroup>
            <span style={{color:"red"}}>*</span><span style={{color:"#8E8E8E"}}>【按人】:选择具体某用户;【按组】:选择该组织下的所有用户</span>
          </Row>
          <Row className="popUpCon">
            <Col span={7} style={{border:'1px solid #e6e6e6',marginRight:'10px'}}>
              <Tree
                checkable={objType==1?false:true}
                defaultExpandAll={false}
                defaultCheckedKeys={defaultCheckedKeys}
                onSelect={objOnSelect}
                onCheck={onCheck}
              >
                {ViewUtils.renderTree1(orgData, 'org_name')}
              </Tree>
            </Col>
            <Col className="peopleChoose" span={16} style={{border:'1px solid #e6e6e6', padding:'0 10px'}}>
            <div style={{ borderBottom: '1px solid #E9E9E9' }}>
              <Checkbox
                indeterminate={indeterminate}
                onChange={onCheckAllChange}
                checked={checkAll}
                disabled={objType==1?false:true}
              >
              {checkAll?"反全选":"全选"}
              </Checkbox>
            </div>
            {
              userOnchange.length>0?
              <CheckboxGroup style={{width:'100%', margin:'10px 10px'}} onChange={userOnchange} disabled={objType==1?false:true} value={defaultuserChecked} options={Utils.converCheck(userList,"id","user_name")} />
              : <span style={{color:'#b3b3b3'}}>暂无数据...</span>
            }
              
            </Col>
          </Row>
          </div>
          )}
      </FormItem>
    </Modal>
  )
});

//选择评委的弹窗
const JudgePeople=Form.create()(props => {
  const { judgevisible, form, handleCancel,indeterminate,onCheckAllChange,checkAll,judgeDefaltChecked,judgeDefaltData,judgeDefaltDataTem,judgeOnChange,judgeTemChange,judgeRemove,getJudge} = props;
  return(
    <Modal
      width={800} 
      destroyOnClose
      title="指定评委"
      onCancel={() => handleCancel()}
      visible={judgevisible}
      footer={[
        <div style={{ width: '100%', textAlign:"center"}}><Button style={{ width: '80px'}} key="submit" type="primary" onClick={()=>handleCancel()}>关闭</Button></div>
      ]}
    >
    <FormItem wrapperCol={{ span: 24 }}>
    {form.getFieldDecorator('topic1')(
      <div>
        <Row className="popUpCon">
          <Col span={12} className="peopleChoose" style={{marginRight:"10px"}}>
            <div style={{ borderBottom: '1px solid #E9E9E9' }}>
              <Search
                placeholder="输入评委名称查询"
                onSearch={value=>getJudge(value)}
                style={{ width: 200 }}
              />
            </div>
            <CheckboxGroup style={{width:'100%', margin:'10px 10px'}} onChange={judgeTemChange} options={Utils.converCheck(judgeDefaltDataTem,"id","user_name")} />
          </Col>
          <Col span={11} className="peopleChoose">
            <div style={{ borderBottom: '1px solid #E9E9E9' }}>
              <Checkbox
                indeterminate={indeterminate}
                onChange={onCheckAllChange}
                checked={checkAll}
              >
              {checkAll?"反全选":"全选"}
              </Checkbox>
              <a style={{color:"#80C900",marginLeft:"10px"}} onClick={()=>judgeRemove()}>移除选中项</a>
            </div>
            <CheckboxGroup style={{width:'100%', margin:'10px 10px'}} value={judgeDefaltChecked} onChange={judgeOnChange} options={Utils.converCheck(judgeDefaltData,"id","user_name")} />
          </Col>
        </Row>
      </div>
      )}
    </FormItem>
    </Modal>
  )
});
// 选择题目弹窗
const TopicForm = Form.create()(props => {
  const { visible, form, handleCancel, radioBtn, checkedList, indeterminate, checkAll, onCheckAllChange, onTopicChange  } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      // handleAdd(fieldsValue, form);
    });
  };
  return(
    <Modal
      width={800} 
      destroyOnClose
      title="选择题目"
      onOk={okHandle}
      onCancel={() => handleCancel()}
      visible={visible}
      cancelText="取消"
      okText="保存"
    >
      <FormItem labelCol={{ span: 3 }} wrapperCol={{ span: 20 }} label="知识点">
        {form.getFieldDecorator('knowleage', {
          rules: [{ required: true, message: '请选择知识点' }]
        })(<Cascader
              placeholder="请选择知识点"
              options={data}
              expandTrigger="hover"
              style={{width:'60%'}}
        />)}
      </FormItem>
      <FormItem labelCol={{ span: 3 }} wrapperCol={{ span: 20 }} label="类型">
        {form.getFieldDecorator('type', {
          initialValue: '1',
          rules: [{ required: true, message: '请选择类型' }]
        })(<Radio.Group buttonStyle="solid">
            <Radio.Button style={radioBtn} value="1">选择题</Radio.Button>
            <Radio.Button style={radioBtn} value="2">判断题</Radio.Button>
          </Radio.Group>)}
      </FormItem>
      <FormItem labelCol={{ span: 3 }} wrapperCol={{ span: 20 }} label="难度">
        {form.getFieldDecorator('subject', {
          initialValue: '1',
          rules: [{ required: true, message: '请选择难度' }]
        })
        (<Radio.Group buttonStyle="solid">
            <Radio.Button style={radioBtn} value="1">容易</Radio.Button>
            <Radio.Button style={radioBtn} value="2">一般</Radio.Button>
            <Radio.Button style={radioBtn} value="3">较难</Radio.Button>
            <Radio.Button style={radioBtn} value="4">困难</Radio.Button>
          </Radio.Group>)}
      </FormItem>
      <FormItem labelCol={{ span: 3 }} wrapperCol={{ span: 20 }} label="备选题目">
        {form.getFieldDecorator('topic', {
        })
        (<div className="popUpCon" style={{border:'1px solid #e6e6e6'}}>
          <div style={{ borderBottom: '1px solid #E9E9E9', margin:'0 10px' }}>
            <Checkbox
              indeterminate={indeterminate}
              onChange={onCheckAllChange}
              checked={checkAll}
            >
            全选
            </Checkbox>
          </div>
          <CheckboxGroup className="topicChoose" style={{width:'100%', margin:'10px 10px'}} value={checkedList} options={plainOptions} onChange={onTopicChange} />
        </div>)}
      </FormItem>
    </Modal>
  )
});
// 查看已选题目弹窗
const SeeTopicForm = Form.create()(props => {
  const { seeTopicVisible, form, handleCancel, checkedList, indeterminate, checkAll, onCheckAllChange, onTopicChange  } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      // handleAdd(fieldsValue, form);
    });
  };
  return(
    <Modal
      width={800} 
      destroyOnClose
      title="查看已选题目"
      onOk={okHandle}
      onCancel={() => handleCancel()}
      visible={seeTopicVisible}
      footer={[
        <div key="submit" style={{width:'100%',marginLeft:'-320px'}}>
          <Button key="submit" type="primary" onClick={okHandle}>移除</Button>
          <Button key="back" onClick={handleCancel}>关闭</Button>
        </div>,
      ]}
    >
      <FormItem labelCol={{ span: 3 }} wrapperCol={{ span: 20 }} label="已选题目">
        {form.getFieldDecorator('topic', {
        })
        (<div className="popUpCon" style={{border:'1px solid #e6e6e6'}}>
          <div style={{ borderBottom: '1px solid #E9E9E9', margin:'0 10px' }}>
            <Checkbox
              indeterminate={indeterminate}
              onChange={onCheckAllChange}
              checked={checkAll}
            >
            全选
            </Checkbox>
          </div>
          <CheckboxGroup className="topicChoose" style={{width:'100%', margin:'10px 10px'}} value={checkedList} options={plainOptions} onChange={onTopicChange} />
        </div>)}
      </FormItem>
    </Modal>
  )
});
@connect(({ activity,itemData }) => ({
  activity,
  itemData
}))
@Form.create()
class ActDesign extends Component {
  constructor(props){
    super(props);
    this.state = {
      saveData:{name:''},//数据集用于保存数据和初始化数据
      bannerData:[],//banner图数组
      orgData:[],//组织架构数据
      wayIndex: 0,
      titlIndex: 0,
      topicVisible: false, //添加题目弹窗
      seeTopicVisible: false, //查看题目弹窗
      choosePeopleVisible: false, //活动对象弹窗
      uploadLoading:false,//上传图片 load
      enlistVisible:false,//操作成功的弹窗

      userList:[],//记录 绑定用户的原数据
      defaultOrgCheckedKeys:[],//记录选中的组织
      defaultuserChecked:[],//记录选中的用户
      objType:1,//记录选择的对象类型
      objIndeterminate: false,//记录用户选择是否全选
      objCheckAll: false,//记录用户选择是否全选

      judgevisible:false,//选择评委的弹窗
      judgeIndeterminate:false,
      judgeCheckAll:false,
      judgeDefaltChecked:[],//记录选中状态的评委
      judgeDefaltData:[],//记录评委数据
      judgeDefaltDataTem:[],//记录查询到的用户数据

      prizeData:[{prize:""}],//奖励数据


      checkedList: defaultCheckedList,
    }
  }
  onChange= (date, dateString)=> {
    console.log(date, dateString);
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
  handleOk = (e)=> {
    console.log(e);
  }
  //打开弹框
  showModal = (num)=> {
    if(num==1) {
      this.setState({
        topicVisible: true
      })
    }else if(num==2) {
      this.setState({
        seeTopicVisible: true
      })
    }else if(num==3) {
      this.setState({
        choosePeopleVisible: true
      })
    }else if(num==4){
      this.setState({
        judgevisible:true
      })
    }
  }
  //关闭弹框
  handleCancel=()=>{
    this.setState({
      seeTopicVisible: false,
      opicVisible: false,
      choosePeopleVisible: false,
      judgevisible:false
    })
  }
  onCheckAllChange = (e) => {
    console.log(e)
    this.setState({
      checkedList: e.target.checked ? plainOptions : [],
      indeterminate: false,
      checkAll: e.target.checked,
    });
  }
  onTopicChange = (checkedList) => {
    this.setState({
      checkedList,
      indeterminate: !!checkedList.length && (checkedList.length < plainOptions.length),
      checkAll: checkedList.length === plainOptions.length,
    });
  }
  onSelect = (selectedKeys, info) => {
    console.log('selected', selectedKeys, info);
  }

  onCheck = (checkedKeys, info) => {
    console.log('onCheck', checkedKeys, info);
  }

  /********************************初始化数据绑定******************************************/
  componentDidMount() {
    const { dispatch, location: { query: { id } }} = this.props;
    //获取数据字段 活动类型
    dispatch({
      type: 'itemData/get',//活动类型
      num: '1010',
      payload:{method:'/sys/item/getInfo'}
    }); 
    //获取数据字典活动性质
    dispatch({
      type: 'itemData/get',//活动性质
      num: '1012',
      payload:{method:'/sys/item/getInfo'}
    });
    //获取数据字典打卡频率
    dispatch({
      type: 'itemData/get',//活动性质
      num: '1013',
      payload:{method:'/sys/item/getInfo'}
    });
    //获取数据字典评分标准
    dispatch({
      type: 'itemData/get',//活动性质
      num: '1014',
      payload:{method:'/sys/item/getInfo'}
    });
    //获取能力素质目标
    dispatch({
      type: 'itemData/get',//能力素质目标
      num: '1015',
      payload:{method:'/sys/item/getInfo'}
    });
    //获取积分类型
    dispatch({
      type: 'itemData/get',//积分类型
      num: '1016',
      payload:{method:'/sys/item/getInfo'}
    });

    //获取组织架构树
    dispatch({
      type: 'activity/request',
      payload:{
        org_id:getDto('org_id')||'1',
        method:'/sys/org/listAll'
      },
      callback:(d)=>{
        var parent_id='';
        d.data.map((item)=>{
          if(item.id==getDto("org_id")){
            parent_id=item.parent_id;
          }
        });
        var data=Utils.convertArr(d.data,parent_id);
        this.setState({
        orgData:data
        });
      }
    });

    //如果是修改则 加载原活动数据
    if(id){

      //查询活动主表数据
      dispatch({
          type: 'activity/request',
          payload: {
          method:"/act/actActivity/get",
          id:id
        },
        callback:(d)=>{
          if(d.status!=0){
            return;
          }
          let temData=d.data;
          if(!temData.enlist_type){
            temData.enlist_type=1;
          }
          if(d.data.enlist_star_date){
            temData.enlistDate=[moment(d.data.enlist_star_date||''),moment(d.data.enlist_end_date||'')];
          }
          if(d.data.act_star_date){
            temData.actDate=[moment(d.data.act_star_date||''),moment(d.data.act_end_date||'')];
          }
          this.setState({
            saveData:temData
          });

          //查询活动附属表数据
          dispatch({
            type: 'activity/request',
            payload: {
            method:"/act/actSub/getAll",
            act_id:id
            },
            callback:(d)=>{
              if(d.status!=0){
                return;
              }
              let data1=[];
              let data2=[];
              d.data.map((item)=>{
                if(item.type==1){
                  data1.push(item.ability_target_id);
                }
                if(item.type==2){
                  data2.push(item.tag_name);
                }
              });
              let temData=this.state.saveData;
              temData.tag=data2;
              temData.ability_target=data1;
              this.setState({
                saveData:temData
              });
            }
          });
        }
      });
      //查询海报图
      dispatch({
        type: 'activity/request',
        payload: {
        method:"/act/actBanner/getAll",
        act_id:id
        },
        callback:(d)=>{
          if(d.status!=0){
            return;
          }
          this.setState({
            bannerData:d.data
          });
        }
      });

      //查询活动 对象表数据
      dispatch({
        type: 'activity/request',
        payload: {
        method:"/act/actObject/getAll",
        activity_id:id,
        type:'0'
        },
        callback:(d)=>{
          if(d.status!=0){
            return;
          }
          let data=[];
          let type=1;
          let data1=[];
          d.data.map((item)=>{
            data.push({id:item.object_id,user_name:item.object_user_name});
            type=item.obj_type;
            data1.push(item.object_id);
          });
          this.setState({
            defaultOrgCheckedKeys:type==1?[]:data1,//记录选中的组织
            defaultuserChecked:type==1?data1:[],//记录选中的用户
            userList:type==1?data:[],//初始化用户数据
            objType:type,//记录选择的对象类型
          });
        }
      });

      //查询活动 奖项表
      dispatch({
        type: 'activity/request',
        payload: {
        method:"/act/actPrize/getAll",
        act_id:id
        },
        callback:(d)=>{
          if(d.status!=0){
            return;
          }
          let data=[];
          d.data.map((item)=>{
            data.push({prize:item.prize,integral_id:item.integral_id,qty:item.qty});
          })
          if(data.length>0){
            this.setState({
              prizeData:data
            });
          }
        }
      });
      //查询活动 评委表
      dispatch({
        type: 'activity/request',
        payload: {
        method:"/act/actJudge/getAll",
        activity_id:id
        },
        callback:(d)=>{
          if(d.status!=0){
            return;
          }
          let data=[];
          d.data.map((item)=>{
            data.push({id:item.judge_id,user_name:item.judge_name});
          })
          if(data.length>0){
            this.setState({
              judgeDefaltData:data
            });
          }
        }
      });
      

    }
  }

  /************************************活动对象的操作*************************************************/

  /************************************主页面上的操作************************************************/
  //通用 onchange事件 用于把 页面的填入的值 赋值到saveData数据集中
  //key 为键值 value为值 type(‘bool’转换 true-false:1-0,‘dateS’转换时间组，‘date’转化时间)
  toolsOnChange=(key,value,type)=>{
    console.log(value)
    let temData=this.state.saveData;
    if(!type){
      temData[key]=value;
    }
    if(type=="bool"){
      value=value?1:0;
      temData[key]=value;
    }
    if(type=="dateS"){
      if(value==[]){
        temData[key+'_star_date']='';
        temData[key+'_end_date']='';
      }else{
        temData[key+'_star_date']=value[0].format('YYYY-MM-DD');
        temData[key+'_end_date']=value[1].format('YYYY-MM-DD');
      }
    }
    this.setState({
      saveData:temData
    });
  }

  //上传图片
  handleUploadChange=(info,index)=>{
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
      if(index==-2){
        let temData=this.state.saveData;
        temData.cover_url=res.data.path;
        this.setState({
          saveData:temData,
          uploadLoading: false,
        })
      } else if(index==-1){
        var data=this.state.bannerData;
        data.push({img_url:res.data.path});
        this.setState({
          bannerData:data,
          uploadLoading: false,
        })
      }else{
        var data=this.state.bannerData;
        data[index]={img_url:res.data.path};
        this.setState({
          bannerData:data,
          uploadLoading: false,
        })
      }
    }
  }
  //获取 富文本框的值
  ueditorChange=(e)=>{
    let temData=this.state.saveData;
    temData.content=e;
    this.setState({
      saveData:temData
    })
  }


  //提交活动发布
  handleSubmit=(e)=>{
    console.log(e)
    const { dispatch } = this.props;
    const {
      defaultOrgCheckedKeys,
      defaultuserChecked,
      objType,
      judgeDefaltData,
      prizeData,
      saveData,
    }=this.state
    let temData=saveData;
    //校验 数据完整性
    if(!temData.name){message.info('请填写活动名称');return;}
    if(!temData.type){message.info('请选择活动类型');return;}
    if(!temData.nature){message.info('请选择活动性质');return;}
    if(!temData.act_star_date){message.info('请填写活动时间');return;}
    if(!temData.act_end_date){message.info('请填写活动时间');return;}
    if(!temData.content){message.info('请填写活动内容');return;}
    
    
   
    //提交数据
    dispatch({
      type: 'activity/request',
      payload: {
        method:"/act/actActivity/save",
        status:e,
        bannerData:this.state.bannerData,
        objType:objType,
        objData:objType==1?defaultuserChecked:defaultOrgCheckedKeys,
        judgeDefaltData:judgeDefaltData,
        prizeData:prizeData,
        ...temData
      },
      callback:(d)=>{
        if(d.status!=0){
          message.error(d.msg);
          return;
        }
        this.setState({
          enlistVisible:true
        });
      }
    });
  }
  //通用关闭窗口
  hiddenModal=(key)=>{
    this.setState({
      [key]:false
    });
    if(key=="enlistVisible"){
      //跳转到列表页面
      router.push("/activity/release");
    }
  }
  /*********************************奖励设置***********************************************/
  //值改变事件
  prizeChange=(e,index,key)=>{
    var data=this.state.prizeData;
    data[index][key]=e;
    this.setState({
      prizeData:data
    });
  }
  //行改变事件
  prizeClosmunChange=(type,index)=>{
    let data=this.state.prizeData;
    if(type==1){
      data.push({prize:""});
    }
    if(type==2){
      data.splice(0,1);
    }
    this.setState({
      prizeData:data
    });
  }

  /********************************选择活动对象的弹窗操作***********************************/
  //组织架构树 取消/选中的操作
  objOnSelect=(e,option)=>{
    //调用 用户查询接口查询该组织下的用户
    const { dispatch } = this.props;
    dispatch({
      type: 'activity/request',
      payload: {
        method:"/sys/user/listAll",
        org_id:e[0]
      },
      callback:(d)=>{
        if(d.status!=0){
          message.error(d.msg);
          return;
        }
        this.setState({
          userList:d.data
        });
      }
    });
  }

  //用户复选框选中事件
  userOnchange=(e)=>{
    const {userList}=this.state;
    this.setState({
      defaultuserChecked:e,
      objIndeterminate: !!e.length && (e.length < userList.length),
      objCheckAll: e.length === userList.length,
    });
  }
  //用户选择全选按钮
  objOnCheckAllChange=(e)=>{
    const {userList}=this.state;
    var data=[];
    userList.map((item)=>{
      data.push(item.id);
    })
    this.setState({
      defaultuserChecked: e.target.checked ? data : [],
      objIndeterminate: false,
      objCheckAll: e.target.checked,
    });
  }
  //活动对象 改变事件
  objTypeChange=(e)=>{
    this.setState({
      objType:e.target.value
    });
  }
  //组织架构选中事件
  orgOnCheck=(e)=>{
    this.setState({
      defaultOrgCheckedKeys:e
    })
  }

  /**************************************选择评委数据**********************************************/
  //全选/反全选
  judgeOnCheckAllChange=(e)=>{
    const {judgeDefaltData}=this.state;
    var data=[];
    judgeDefaltData.map((item)=>{
      data.push(item.id);
    })
    this.setState({
      judgeDefaltChecked: e.target.checked ? data : [],
      judgeIndeterminate: false,
      judgeCheckAll: e.target.checked,
    });
  }
  //评委选中事件
  judgeOnChange=(e)=>{
    const {judgeDefaltData}=this.state;
    this.setState({
      judgeDefaltChecked:e,
      judgeIndeterminate: !!e.length && (e.length < judgeDefaltData.length),
      judgeCheckAll: e.length === judgeDefaltData.length,
    });
  }
  //选择查询到的用户
  judgeTemChange=(e)=>{
    const {judgeDefaltData,judgeDefaltChecked,judgeDefaltDataTem}=this.state;
    let data=judgeDefaltData;
    for(let i=0;i<e.length;i++){
      let k=true;
      for(let l=0;l<data.length;l++){
        if(e[i]==data[l].id){
          k=false;
        }
      }
      if(k){
        for(let j=0;j<judgeDefaltDataTem.length;j++){
          if(e[i]==judgeDefaltDataTem[j].id){
            data.push(judgeDefaltDataTem[j]);
          }
        }
      }
    }
    this.setState({
      judgeDefaltData:data,
      judgeIndeterminate: !!judgeDefaltChecked.length && (judgeDefaltChecked.length < data.length),
      judgeCheckAll: judgeDefaltChecked.length === data.length,
    });
  }

  //移除选中的评委
  judgeRemove=()=>{
    const {judgeDefaltData,judgeDefaltChecked}=this.state;
    console.log(judgeDefaltChecked)
    let data=[];
    for(let i=0;i<judgeDefaltData.length;i++){
      let bool=true;
      for(let l=0;l<judgeDefaltChecked.length;l++){
        if(judgeDefaltData[i].id==judgeDefaltChecked[l]){
          bool=false;
        }
      }
      if(bool){
        data.push(judgeDefaltData[i]);
      }
    }
    this.setState({
      judgeDefaltData:data,
      judgeDefaltChecked:[],
      judgeIndeterminate:false,
      judgeCheckAll:false,
    });
  }

  //查询用户信息
  getJudge=(e)=>{
    if(!e){
      message.info("请输入评委名称查询!");
      return;
    }
    const { dispatch } = this.props;
    dispatch({
      type: 'activity/request',
      payload: {
        method:"/sys/user/listAll",
        name:e
      },
      callback:(d)=>{
        if(d.status!=0){
          message.error(d.msg);
          return;
        }
        this.setState({
          judgeDefaltDataTem:d.data
        });
      }
    });
  }
  render() {
    const { uploadLoading,enlistVisible,topicVisible, checkedList, indeterminate, checkAll, 
      seeTopicVisible,saveData,bannerData,orgData,prizeData,integralTypeData,
      choosePeopleVisible,userList,defaultOrgCheckedKeys,defaultuserChecked,objType,objIndeterminate,objCheckAll,
      judgevisible,judgeIndeterminate,judgeCheckAll,judgeDefaltChecked,judgeDefaltData,judgeDefaltDataTem,
    } = this.state;
    const {form,itemData:{actNatureData,actTypeData,actNoteFrequencyData,standardData,abilityTargetData},location:{query:{id}} }=this.props;
    const { getFieldDecorator } = form;
    const radioBtn = {height:'28px', lineHeight:'28px', marginRight:'10px', borderRadius:'3px', border:'0' };
    console.log("奖励:"+abilityTargetData)
    console.log("评委:"+judgeDefaltData)
    console.log("用户:")
    console.log(userList)

    const topicMethods = {
      visible: topicVisible,
      seeTopicVisible: seeTopicVisible,
      choosePeopleVisible: choosePeopleVisible,
      handleCancel: this.handleCancel,
      radioBtn: radioBtn,
      checkedList: checkedList,
      indeterminate: indeterminate,
      checkAll: checkAll,
      onCheckAllChange: this.onCheckAllChange,
      onTopicChange: this.onTopicChange,
      onSelect: this.onSelect,
      onCheck: this.onCheck,
      orgData:orgData
    }

    //指定对象的弹窗
    const topicMethodsObj = {
      handleCancel: this.handleCancel,
      orgData:orgData,
      userList: userList,
      defaultCheckedKeys:defaultOrgCheckedKeys,
      defaultuserChecked:defaultuserChecked,
      userOnchange:this.userOnchange,
      objOnSelect: this.objOnSelect,
      objTypeChange:this.objTypeChange,
      objType:objType,
      onCheck:this.orgOnCheck,
      indeterminate:objIndeterminate,
      checkAll:objCheckAll,
      onCheckAllChange: this.objOnCheckAllChange,
      choosePeopleVisible: choosePeopleVisible,
    }

    //指定 评委的弹窗
    const judgeMethods={
      judgevisible: judgevisible,
      handleCancel: this.handleCancel,
      indeterminate:judgeIndeterminate, 
      onCheckAllChange:this.judgeOnCheckAllChange,
      checkAll:judgeCheckAll,
      judgeDefaltChecked,//记录选中状态的评委
      judgeDefaltData,//记录评委数据
      judgeDefaltDataTem,//记录查询到的用户数据
      judgeOnChange:this.judgeOnChange,//评委勾选改变事件
      judgeTemChange:this.judgeTemChange,//查询到的临时数勾选改变事件
      judgeRemove:this.judgeRemove,//移除评委
      getJudge:this.getJudge,//查询评委
    }

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
              <Form>
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
                  <ul className={styles.baseInfo}>
                    <li><span>活动名称：</span>
                      {getFieldDecorator('name', {
                        initialValue:saveData.name||''
                      })(
                        <input type="text" onChange={(e)=>this.toolsOnChange('name',e.target.value)} placeholder="请输入活动名称"/>
                      )}
                    </li>
                    <li><span>活动类型：</span>
                      {getFieldDecorator('type', {
                        initialValue:saveData.type
                      })(
                        <ZSelect data={actTypeData} onChange={(e)=>this.toolsOnChange('type',e)} style={{width:'360px'}} />
                      )}
                    </li>
                    <li><span>活动性质：</span>
                      {getFieldDecorator('nature', {
                        initialValue:saveData.nature
                      })(
                        <ZSelect data={actNatureData} onChange={(e)=>this.toolsOnChange('nature',e)} style={{width:'360px'}} />
                      )}
                    </li>
                    <li><span>能力素质：</span>
                      {getFieldDecorator('ability_target', {
                        initialValue:saveData.ability_target
                      })(
                        <ZSelect data={abilityTargetData} 
                        mode='multiple' 
                        onChange={(e)=>this.toolsOnChange('ability_target',e)} 
                        style={{width:'360px'}} />
                      )}
                    </li>
                    <li><span>活动标签：</span>
                      {getFieldDecorator('tag', {
                        initialValue:saveData.tag
                      })(
                        <ZSelect 
                        mode='tags' 
                        onChange={(e)=>this.toolsOnChange('tag',e)} 
                        placeholder="请输入活动标签"
                        style={{width:'360px'}} />
                      )}
                    </li>
                    <li><span>活动时间：</span>
                      {getFieldDecorator('actDate', {
                        initialValue:saveData.actDate
                      })(
                        <RangePicker 
                        locale={locale} 
                        style={{width:"360px"}}
                        onChange={(e)=>this.toolsOnChange('act',e,'dateS')} />
                      )}
                    </li>
                    <li><span>活动对象：</span>
                      <input type="text" className={styles.choose} onClick={this.showModal.bind(this,3)} readOnly={true} placeholder="指定活动对象"/>
                    </li>
                    <li className="clearfix">
                        <div>封面图片：<span style={{fontSize: '12px',marginLeft: '10px',color:'#b3b3b3'}}><i style={{color:'#ff2727'}}>*</i>建议图片大小200*150px</span></div>
                        <div style={{marginLeft:'80px', marginTop:'10px'}}>
                          {getFieldDecorator('cover_url', {
                            initialValue:saveData.cover_url
                          })(
                            <ZUpload
                            onChange={(e)=>this.handleUploadChange(e,-2)}
                              loading={uploadLoading}
                              className='avatar-uploader'
                              listType='picture-card'
                            >
                              {saveData.cover_url ?
                                <img src={saveData.cover_url} style={{width: 100}} /> :
                                <div>
                                  <Icon type={uploadLoading ? 'loading' : 'plus'} />
                                  <div className="ant-upload-text">上传</div>
                                </div>
                              }
                            </ZUpload>
                          )}
                        </div>
                        {/* <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                            <img alt="example" style={{ width: '100%' }} src={previewImage} />
                        </Modal> */}
                    </li>
                    <li className="clearfix upload-width">
                      <div>海报图片：<span style={{fontSize: '12px',marginLeft: '10px',color:'#b3b3b3'}}><i style={{color:'#ff2727'}}>*</i>建议图片大小1200*500px  限3张</span></div>
                      
                        {bannerData.map((item,index)=>{
                          return(
                            <div style={{marginLeft:index==0?'80px':'20px', marginTop:'10px',float:'left'}} data-id={index} key={index}>
                            <ZUpload
                              onChange={(e)=>this.handleUploadChange(e,index)}
                              loading={uploadLoading}
                              className='avatar-uploader'
                              listType='picture-card'
                            >
                            <img src={item.img_url} style={{width:"200px",height:"84px"}} />
                            </ZUpload>
                          </div>
                          )
                        })}
                        {
                          bannerData.length<3?
                          <div style={{marginLeft:bannerData.length<1?'80px':'20px', marginTop:'10px',float:'left'}}>
                            <ZUpload
                              onChange={(e)=>this.handleUploadChange(e,-1)}
                              loading={uploadLoading}
                              className='avatar-uploader'
                              listType='picture-card'
                            >
                            <div>
                              <Icon type={uploadLoading ? 'loading' : 'plus'} />
                              <div className="ant-upload-text">上传</div>
                            </div>
                            </ZUpload>
                          </div>
                          :''
                        }
                    </li>
                    <li><span>活动内容：</span>
                      {
                          id?
                          (saveData.content==''||saveData.content)?
                          <ZUeditor id="content" style={{marginLeft:"80px"}} initialContent={saveData.content} onchange={(e)=>this.ueditorChange(e)}/>
                          :''
                          :<ZUeditor id="content" style={{marginLeft:"80px"}} onchange={(e)=>{this.ueditorChange(e)}}/>
                      }
                    </li>
                  </ul>
                  <div className={styles.setupInfo}>
                    <div className={styles.wayBtn}>
                      <span>活动方式：</span>
                      <ul className={styles.actWay}>
                        {
                          wayList.map((item,index)=> {
                            return this.state.wayIndex==index? 
                            <li key={index} className={styles.active} onClick={this.wayTabChange.bind(this,`${index}`)}>{item}</li>:
                            <li key={index} onClick={this.wayTabChange.bind(this,`${index}`)}>{item}</li>
                          })
                        }
                      </ul>
                    </div>

                    <ul className={styles.otherInfo} style={{display: this.state.wayIndex==0? "block":"none"}}>
                      <li><span>启用报名：</span>
                        {getFieldDecorator('is_enlist', {
                          initialValue:saveData.is_enlist
                        })(
                          <Switch checkedChildren="是" unCheckedChildren="否" checked={saveData.is_enlist} onChange={(e)=>this.toolsOnChange('is_enlist',e,'bool')} />
                        )}
                      </li>
                      <li><span>报名类型：</span>
                        {getFieldDecorator('enlist_type', {
                          initialValue:saveData.enlist_type
                        })(
                          <ZSelect data={enlistTypeData} onChange={(e)=>this.toolsOnChange('enlist_type',e)} style={{width:'360px'}} />
                        )}
                      </li>
                      <li><span>报名时间：</span>
                        {getFieldDecorator('enlistDate', {
                          initialValue:saveData.enlistDate
                        })(
                          <RangePicker style={{width:"360px"}} locale={locale} onChange={(e)=>this.toolsOnChange('enlist',e,'dateS')} />
                        )}
                      </li>
                      {/* <li><span>人数上限：</span>
                        {getFieldDecorator('enlist_max_totxl', {
                          initialValue:saveData.enlist_max_totxl||0
                        })(
                          <input type='text' placeholder="人数上限" onChange={(e)=>this.toolsOnChange('enlist_max_totxl',e.target.value)}/>
                        )}
                        <span style={{fontSize: '12px',marginLeft: '10px',color:'#b3b3b3'}}>(人)<i style={{color:'#ff2727'}}>*</i>设置活动可报名人数,不设或0表示不限人数</span>
                      </li> */}
                    </ul>
                    <ul className={styles.otherInfo} style={{display: this.state.wayIndex==1? "block":"none"}}>
                      <li><span>启用投票：</span>
                        {getFieldDecorator('is_vote', {
                          initialValue:saveData.is_vote
                        })(
                          <Switch checkedChildren="是" unCheckedChildren="否" checked={saveData.is_vote} onChange={(e)=>this.toolsOnChange('is_vote',e,'bool')}/>
                        )}
                      </li>
                      <li><span>家长投票：</span>
                        {getFieldDecorator('is_parent_vote', {
                          initialValue:saveData.is_parent_vote
                        })(
                          <Switch checkedChildren="是" unCheckedChildren="否" checked={saveData.is_parent_vote} onChange={(e)=>this.toolsOnChange('is_parent_vote',e,'bool')} />
                        )}
                      </li>
                      <li><span>自己投票：</span>
                        {getFieldDecorator('is_own_vote', {
                          initialValue:saveData.is_own_vote
                        })(
                          <Switch checkedChildren="是" unCheckedChildren="否" checked={saveData.is_own_vote} onChange={(e)=>this.toolsOnChange('is_own_vote',e,'bool')}/>
                        )}
                      </li>
                    </ul>
                    <ul className={styles.otherInfo} style={{display: this.state.wayIndex==2? "block":"none"}}>
                      <li><span>启用打卡：</span>
                        {getFieldDecorator('is_note', {
                          initialValue:saveData.is_note
                        })(
                          <Switch checkedChildren="是" unCheckedChildren="否" checked={saveData.is_note} onChange={(e)=>this.toolsOnChange('is_note',e,'bool')} />
                        )}
                      </li>
                      <li><span>打卡频率：</span>
                        {getFieldDecorator('note_frequency', {
                          initialValue:saveData.note_frequency
                        })(
                          <ZSelect data={actNoteFrequencyData} style={{width:'110px'}} />
                        )}
                      </li>
                      <li><span>截止时间：</span>
                        {getFieldDecorator('note_end_time', {
                          initialValue:saveData.note_end_time
                        })(
                          <TimePicker placeholder="请选择时间" defaultOpenValue={moment('00:00:00', 'HH:mm:ss')} onChange={(e)=>this.toolsOnChange('note_end_time',e)}/>
                        )}
                        <span style={{color:"#8E8E8E"}}>每天打卡截止时间</span>
                      </li>
                      <li><span>需要分享：</span>
                        {getFieldDecorator('is_share', {
                          initialValue:saveData.is_share
                        })(
                          <Switch checkedChildren="是" unCheckedChildren="否" checked={saveData.is_share} onChange={(e)=>this.toolsOnChange('is_share',e,'bool')}/>
                        )}
                      
                        <div className={styles.shareSetup}>
                          {getFieldDecorator('share_option', {
                            initialValue:saveData.share_option
                          })(
                            <CheckboxGroup options={options} />
                          )}
                          <div className={styles.shareTitle}>
                            {getFieldDecorator('shar_title', {
                              initialValue:saveData.shar_title||''
                            })(
                              <input type="text" placeholder="请输入分享的标题" onChange={(e)=>this.toolsOnChange('share_title',e)}/>
                            )}
                          </div>
                          <div className={styles.shareDescribe}>
                            {getFieldDecorator('share_remark', {
                              initialValue:saveData.share_remark||''
                            })(
                              <textarea type="text" rows="3" placeholder="请输入分享的描述内容" onChange={(e)=>this.toolsOnChange('share_remark',e)}/>
                            )}
                          </div>
                        </div>
                      </li>
                    </ul>
                    {/* <ul className={styles.otherInfo} style={{display: this.state.wayIndex==3? "block":"none"}}>
                      <li><span>启用答题：</span>
                        {getFieldDecorator('is_answer', {
                          initialValue:saveData.is_answer
                        })(
                          <Switch checkedChildren="是" unCheckedChildren="否"  onChange={(e)=>this.toolsOnChange('is_answer',e,'bool')}/>
                        )}
                      </li>
                      <li><span>设置题库：</span>
                        <Button onClick={this.showModal.bind(this,2)} style={{backgroundColor:'#f2f2f2', marginRight: '10px'}}>已选100道</Button>
                        <Button onClick={this.showModal.bind(this,1)}>添加</Button>
                        <Modal
                          title="添加题目"
                          okText="保存"
                          cancelText="取消"
                          visible={this.state.topicVisible}
                          onOk={this.handleOk}
                          onCancel={this.handleCancel}
                        >
                          <ul>
                          <li style={{marginBottom:'10px'}}>
                              <span>知识点：</span>
                              <Cascader
                                options={data}
                                expandTrigger="hover"
                                style={{width:'80%'}}
                              />
                            </li>
                            <li style={{marginBottom:'10px'}}>
                              <span>类型：</span>
                              <Radio.Group defaultValue="a" buttonStyle="solid">
                                <Radio.Button style={radioBtn} value="1">选择题</Radio.Button>
                                <Radio.Button style={radioBtn} value="2">判断题</Radio.Button>
                              </Radio.Group>
                            </li>
                            <li>
                              <span>难度：</span>
                              <Radio.Group defaultValue="a" buttonStyle="solid">
                                <Radio.Button style={radioBtn} value="a">容易</Radio.Button>
                                <Radio.Button style={radioBtn} value="b">一般</Radio.Button>
                                <Radio.Button style={radioBtn} value="c">较难</Radio.Button>
                                <Radio.Button style={radioBtn} value="d">困难</Radio.Button>
                              </Radio.Group>
                            </li>
                          </ul>
                        </Modal>
                      </li>
                      <li><span>答题时间：</span>
                        {getFieldDecorator('answer_date', {
                          initialValue:saveData.answer_date||0
                        })(
                          <input type="text" onChange={(e)=>this.toolsOnChange('answer_date',e)}/>
                        )}
                        <span style={{fontSize: '12px',marginLeft: '10px',color:'#b3b3b3'}}>(分钟)<i style={{color:'#ff2727'}}>*</i>设置总答题时间,不设或0表示不限答题时间</span>
                      </li>
                      <li><span>次数限制：</span>
                        {getFieldDecorator('answer_number', {
                          initialValue:saveData.answer_number||0
                        })(
                          <input type="text" onChange={(e)=>this.toolsOnChange('answer_number',e)}/>
                        )}
                        <span style={{fontSize: '12px',marginLeft: '10px',color:'#b3b3b3'}}>(次)<i style={{color:'#ff2727'}}>*</i>限制每人可参与次数,不设或0表示不限次数</span>
                      </li>
                    </ul> */}
                    <ul className={styles.otherInfo} style={{display: this.state.wayIndex==3? "block":"none"}}>
                      <li><span>作品上传：</span>
                        {getFieldDecorator('is_warks', {
                          initialValue:saveData.is_warks
                        })(
                          <Switch checkedChildren="是" unCheckedChildren="否" checked={saveData.is_warks} onChange={(e)=>this.toolsOnChange('is_warks',e,'bool')}/>
                        )}
                      </li>
                      <li><span>需要评分：</span>
                        {getFieldDecorator('is_Judges', {
                          initialValue:saveData.is_Judges
                        })(
                          <Switch checkedChildren="是" unCheckedChildren="否" checked={saveData.is_Judges} onChange={(e)=>this.toolsOnChange('is_Judges',e,'bool')}/>
                        )}
                      </li>
                      {saveData.is_Judges==1?
                        <li><span>评委名单：</span>
                        <button className={styles.choose} type="button" onClick={this.showModal.bind(this,4)}>请选择评委</button>
                        </li>
                        :''
                      }
                      
                      {/* <li><span>评分标准：</span>
                        {getFieldDecorator('standard', {
                          initialValue:saveData.standard
                        })(
                          <ZSelect data={standardData} style={{width:'110px'}} onChange={(e)=>this.toolsOnChange('standard',e)}/>
                        )}
                      </li> */}
                      <li><span>作品公开：</span>
                        {getFieldDecorator('open_set', {
                          initialValue:saveData.open_set
                        })(
                          <Switch checkedChildren="自定义时间" unCheckedChildren="不公开"  checked={saveData.open_set} onChange={(e)=>this.toolsOnChange('open_set',e,'bool')}/>
                        )}

                        <span style={{marginLeft:10}}>
                          {getFieldDecorator('open_date', {
                            initialValue:saveData.open_date
                          })(
                            <DatePicker onChange={(e)=>this.toolsOnChange('open_date',e,'date')}/>
                          )}
                        </span>
                      </li> 
                    </ul>
                    <ul className={styles.otherInfo} style={{display: this.state.wayIndex==4? "block":"none"}}>
                      <li><span>奖项设置：</span>
                        {getFieldDecorator('is_prize', {
                          initialValue:saveData.is_prize
                        })(
                          <Switch checkedChildren="是" unCheckedChildren="否" checked={saveData.is_prize} onChange={(e)=>this.toolsOnChange('is_prize',e,'bool')}/>
                        )}
                        {saveData.is_prize==1?
                          <a style={{color:"#80C900",marginLeft:"10px"}} onClick={()=>{this.prizeClosmunChange(1)}}>+添加项</a>
                          :''
                        }
                        {
                          saveData.is_prize==1?
                          prizeData.map((item,index)=>{
                            return (
                              <div style={{marginLeft:"80px",marginTop:"20px"}} key={index}>
                                {getFieldDecorator('prize'+index, {
                                  initialValue:item.prize
                                })(
                                  <input type="text" onChange={(e)=>{this.prizeChange(e.target.value,index,'prize')}} placeholder="输入奖项名称" />
                                )}

                                {getFieldDecorator('integral_id'+index, {
                                  initialValue:item.integral_id
                                })(
                                  <ZSelect 
                                    data={integralTypeData} 
                                    onChange={(e)=>this.toolsOnChange('standard',e)}
                                    placeholder="选择奖励"
                                    style={{width:"126px",marginRight:"10px"}}
                                    onChange={(e)=>{this.prizeChange(e,index,'integral_id')}}
                                  />
                                )}
                                {getFieldDecorator('qty'+index, {
                                  initialValue:item.qty
                                })(
                                  <input type="number" onChange={(e)=>{this.prizeChange(e.target.value,index,'qty')}} placeholder="输入奖励数量"/>
                                )}
                                <a style={{color:"#80C900"}} onClick={()=>{this.prizeClosmunChange(2,index)}}>-删除项</a>
                              </div>
                            )
                          })
                          :''
                        }
                        
                      </li>
                    </ul>
                  </div>
                  <div className={styles.resultBtn}>
                    <button type="submit" onClick={()=>this.handleSubmit('0')}>保存活动</button>
                    <button type="submit" onClick={()=>this.handleSubmit('1')}>发布活动</button>
                    <button type="submit" style={{display:"none"}}>返回</button>
                  </div>
              </div>
              </Form>
            </div>
          </div>
        </div>
        {/* 保存成功的弹窗 */}
        <Modal
          title="操作成功"
          visible={enlistVisible}
          onCancel={() => { this.hiddenModal('enlistVisible') }}
          width={300}
          footer={[
            <div style={{ width: '100%', marginLeft: '-92px' }}><Button style={{ width: '80px', marginLeft: '100px' }} key="submit" type="primary" onClick={() => { this.hiddenModal('enlistVisible') }}>知道啦</Button></div>
          ]}
        >
          <div style={{ textAlign: 'center' }}>
            <div style={{ margin: '0 auto', width: '100px', height: '100px', backgroundImage: `url(${require('@/assets/success.png')})` }}></div>
            <div style={{ marginBottom: '30px' }}>操作成功!</div>
          </div>
        </Modal>
        {/* 选择题目弹窗 */}
        <TopicForm {...topicMethods}/>
        {/* 查看已选题目弹窗 */}
        <SeeTopicForm {...topicMethods}/>
        {/* 选择对象的弹窗 */}
        <ChoosePeople {...topicMethodsObj}/>
        {/* 选择评委的弹窗 */}
        <JudgePeople {...judgeMethods}/>

        <ZFooter />
      </div>
    );
  }
}

export default ActDesign;
