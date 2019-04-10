import React, { Component } from 'react';
import Link from 'umi/link';
import { connect } from 'dva';
import Zheader from '@/components/Zheader';
import ZFooter from '@/components/ZFooter';
import styles from './resource.less';
import { Input, Button, Form, Row, Col, Radio, message, Dropdown, Icon, Menu, Popconfirm, Modal  } from 'antd';
import ZUeditor from '@/components/ZUeditor';
import ChooseBook from './components/ChooseBook';
import ChooseKnow from './components/ChooseKnow';
import creatHistory from 'history/createBrowserHistory' 
import SearchMaterial from './SearchMaterial';
import SearchPaper from './SearchPaper';
import { getDto } from '@/utils/dto';
import moment from 'moment';
import 'moment/locale/zh-cn';
const history = creatHistory();
moment.locale('zh-cn');
const FormItem = Form.Item;
message.config({
  top: 200,
});
@connect(({ course }) => ({
  course
}))
class CreateCourse extends Component {
  constructor(props){
    super(props);
    this.state = {
      getVisible: false,
      preVisible: false,
      chapterData: [],
      visible: false,
      treeSelect: '',
      knowledgeName: '',
      isPrevent: false, //防止多次点击提交
      isModify: false, //是否为修改
      courseInfo: '', //存放课程信息
      prefaceData: '', //富文本框的值
      courseType: 1,
      first: 'a',
      second: 'a',
      third: 'a',
      resourceId: '',
      resourceType: 2,
      rIndex: 0,
      catalogData: [
        {
          level: 1,
          name: '',
          preface:'',
          sort: 0,
          micro: [],
          paper: [],
          material: [],
          children:[]
        },
      ],
    }
  }
	componentDidMount() {
    const knowledge_id = getDto('knowledge_id');
    const knowledgeName = getDto('knowledgeName');
    const { location:{query:{cId,type}} } = this.props;
    if( knowledge_id&&knowledgeName ) {
      this.setState({
        treeSelect: knowledge_id,
        knowledgeName: knowledgeName
      })
    }
    if(cId) {
      this.setState({
        isModify: true,
        courseType: type,
      })
      this.getCourseInfo(cId);
    }
  }
  getCourseInfo = (cId)=>{
    const { dispatch } = this.props;
    dispatch({
      type: 'course/courseInfo',
      payload: {
          method: '/res/resCourse/get',
          id: cId
      },
      callback:(data)=>{
        console.log(data);
        this.setState({
          courseInfo: data.data,
          prefaceData: data.data.preface,
          // catalogData: data.data.data,
        })
      }
    });
  }
  getBookData = (bookData,chapterData)=> {
    const knowledge_id = getDto('knowledge_id');
    const knowledgeName = getDto('knowledgeName');
    this.setState({
      chapterData: chapterData,
      treeSelect: knowledge_id?knowledge_id:'',
      knowledgeName: knowledgeName?knowledgeName:'',
    })
  }
  handleSubmit = (e) => {
    e.preventDefault();
    this.setState({
      isPrevent: true
    })
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (err) return;
      else {
        if(!!values.knowledge) {
          this.addCourse(values);
        }else{
					message.warning("请选择知识节点！",1);return;
				}
      }
    });
  }
  addCourse = (values)=> {
    let userId = getDto("user_id");
    let orgId = getDto("org_id");
    let school_id = getDto("school_id");
    const { name, power, remark, type, knowledge} = values;
    const { isModify, prefaceData, catalogData } = this.state;
    const { dispatch, location:{query:{cId}} } = this.props;
    let reqType = 'course/addCourse';
    let method = '/res/resCourse/add'
    if(isModify) {
      reqType = 'course/editCourse';
      method = '/res/resCourse/edit'
    }
    console.log(catalogData);
    // this.setState({
    //   isPrevent: false 
    // });
    // return;
    dispatch({
      type: reqType,
      payload: {
          id: cId?cId:'',
          method: method,
          name: name,
          role: power,
          remark: remark,
          type: type,
          org_id: orgId,
          creator_id: userId,
          school_id: school_id?school_id:'',
          preface: prefaceData,
          knowledge_id: knowledge,
          catalogData: catalogData,
      },
      callback:()=>{
        setTimeout(() => {
          this.setState({
            isPrevent: false 
          });
        }, 2000);
      }
    });
  }
  onTreeSelect = (ids, e) => {
    let name = e.node.props.dataRef.name;
    if(ids.length<=0) {
      name = ''
    }
    this.setState({
      treeSelect: ids[0],
      knowledgeName: name
    })
  }
  prevent = ()=> {
    this.setState({
      isPrevent: true
    })
  }
  //获取 富文本框的值
  ueditorChange=(e)=>{
    console.log(e)
    this.setState({
      prefaceData:e
    })
  }
  theKnowledge = (value,name)=> {
    this.setState({
      treeSelect: value,
      knowledgeName: name
    })
  }
  // 切换创建的课程类型
  changeCourseType = (type)=> {
    this.setState({
      courseType: type,
    })
  }
  // 新增目录
  newCatalog = (rank)=> {
    /**
     * rank值区分同级目录(1)、下级目录(2)、微课(3)、试卷(4)、素材(5)
     */
    const { first, second, third, catalogData } = this.state;
    let catalogList = catalogData;
    // 一级目录操作
    if(first!='a'&&second=='a') {
      switch(rank) {
        case 1: catalogList.push({level: 1,name:'',micro:[],paper:[],material:[],children:[],preface:'',sort:catalogList.length});break;
        case 2: 
          let len = catalogList[first].children.length;
          catalogList[first].children.push({level: 2,name:'',micro:[],paper:[],material:[],children:[],preface:'',sort:len});break;
        case 3: catalogList[first].micro.push({id:'',title:''});break;
        case 4: catalogList[first].paper.push({id:'',title:''});break;
        case 5: catalogList[first].material.push({id:'',title:''});break;
        case 6: catalogList[first].preface=' ';break;
      }
    }
    // 二级目录操作
    else if(second!='a'&&third=='a') {
      switch(rank) {
        case 1: catalogList[first].children.push({level: 2,name:'',micro:[],paper:[],material:[],children:[],preface:'',sort:catalogList[first].children.length});break;
        case 2:   
          let len = catalogList[first].children[second].children.length;
          catalogList[first].children[second].children.push({level: 3,name:'',micro:[],paper:[],material:[],children:[],preface:'',sort:len});break;
        case 3: catalogList[first].children[second].micro.push({id:'',title:''});break;
        case 4: catalogList[first].children[second].paper.push({id:'',title:''});break;
        case 5: catalogList[first].children[second].material.push({id:'',title:''});break;
        case 6: catalogList[first].children[second].preface=' ';break;
      }
    }
    // 三级目录操作
    else if(third!='a') {
      switch(rank) {
        case 1: catalogList[first].children[second].children.push({level: 2,name:'',micro:[],paper:[],material:[],preface:'',sort:catalogList[first].children[second].children.length});break;
        case 3: catalogList[first].children[second].children[third].micro.push({id:'',title:''});break;
        case 4: catalogList[first].children[second].children[third].paper.push({id:'',title:''});break;
        case 5: catalogList[first].children[second].children[third].material.push({id:'',title:''});break;
        case 6: catalogList[first].children[second].children[third].preface=' ';break;
      }
    }
    this.setState({
      catalogData: catalogList,
    })
  }
  // 删减目录或资源
  reduceCatalog = (first,second,third,type,resourceIndex,e)=> {
    /**
     * type值区分目录(1)、微课(2)、试卷(3)、素材(4)、导学(6)
     */
    const { catalogData } = this.state;
    let catalogList = catalogData;
    let i = 0;
    let len = 0;
    
    // 一级目录操作
    if(first!='a'&&second=='a') {
      switch(type) {
        case 1: 
          catalogList.splice(first,1);
          for( i=first, len=catalogList.length; i<len; i++ ) {
            catalogList[i].sort = i;
          }break;
        case 2: catalogList[first].micro.splice(resourceIndex,1);break;
        case 3: catalogList[first].paper.splice(resourceIndex,1);break;
        case 4: catalogList[first].material.splice(resourceIndex,1);break;
        case 6: catalogList[first].preface='';break;
      }
    }
    // 二级目录操作
    else if(second!='a'&&third=='a') {
      switch(type) {
        case 1: 
          catalogList[first].children.splice(second,1);
          for( i=second, len=catalogList[first].children.length; i<len; i++ ) {
            catalogList[first].children[i].sort = i;
          }break;
        case 2: catalogList[first].children[second].micro.splice(resourceIndex,1);break;
        case 3: catalogList[first].children[second].paper.splice(resourceIndex,1);break;
        case 4: catalogList[first].children[second].material.splice(resourceIndex,1);break;
        case 6: catalogList[first].children[second].preface='';break;
      } 
    }
    // 三级目录操作
    else if(third!='a') {
      switch(type) {
        case 1: 
          catalogList[first].children[second].children.splice(third,1);
          for( i=second, len=catalogList[first].children[second].children.length; i<len; i++ ) {
            catalogList[first].children[second].children[i].sort = i;
          }break;
        case 2: catalogList[first].children[second].children[third].micro.splice(resourceIndex,1);break;
        case 3: catalogList[first].children[second].children[third].paper.splice(resourceIndex,1);break;
        case 4: catalogList[first].children[second].children[third].material.splice(resourceIndex,1);break;
        case 6: catalogList[first].children[second].children[third]. preface='';break;
      }
    }
    this.setState({
      catalogData: [],
    })
    setTimeout(()=>{
      this.setState({
        catalogData: catalogList,
      })
    },1)
  }
  // 添加资源
  getResourceId = (id,name)=> {
    const { first, second, third, catalogData, resourceId, resourceType, rIndex } = this.state;
    let catalogList = catalogData;
    /**
     * type值区分资源类型，微课(2)、试卷(3)、素材(4)
     */
    // 一级目录操作
    if(first!='a'&&second=='a') {
      switch(resourceType) {
        case 2: catalogList[first].micro[rIndex].id=id; catalogList[first].micro[rIndex].title=name;break;
        case 3: catalogList[first].paper[rIndex].id=id; catalogList[first].paper[rIndex].title=name;break;
        case 4: catalogList[first].material[rIndex].id=id; catalogList[first].material[rIndex].title=name;break;
      }
    }
    // 二级目录操作
    else if(second!='a'&&third=='a') {
      switch(resourceType) {
        case 2: 
          catalogList[first].children[second].micro[rIndex].id=id; 
          catalogList[first].children[second].micro[rIndex].title=name; break;
        case 3: 
          catalogList[first].children[second].paper[rIndex].id=id; 
          catalogList[first].children[second].paper[rIndex].title=name; break;
        case 4: 
          catalogList[first].children[second].material[rIndex].id=id; 
          catalogList[first].children[second].material[rIndex].title=name; break;
      }
    }
    // 三级目录操作
    else if(third!='a') {
      switch(resourceType) {
        case 2: 
          catalogList[first].children[second].children[third].micro[rIndex].id=id;
          catalogList[first].children[second].children[third].micro[rIndex].title=name; break;
        case 3:
          catalogList[first].children[second].children[third].paper[rIndex].id=id;
          catalogList[first].children[second].children[third].paper[rIndex].title=name; break; 
        case 4: 
          catalogList[first].children[second].children[third].material[rIndex].id=id;
          catalogList[first].children[second].children[third].material[rIndex].title=name; break;
      }
    }
    this.setState({
      catalogData: catalogList,
      resourceId: id,
    })
    this.handleCancel();
  }
  // 点击“+”图标时获取相关索引值
  saveCatalogIndex = (firstIndex,secondIndex,thirdIndex,e)=> {
    this.setState({
      first: firstIndex,
      second: secondIndex,
      third: thirdIndex,
    })
  }
  // 监听保存目录输入框内容
  getInputValue = (type)=> {
    const { first, second, third, catalogData } = this.state;
    let name = '';
    switch(type) {
      case 1: name = document.getElementById("first"+first).value;break;
      case 2: name = document.getElementById("second"+second).value;break;
      case 3: name = document.getElementById("third"+third).value;break;
    }
    let catalogList = catalogData;
    if(first!='a'&&second=='a') {
      catalogList[first].name=name;
    }
    // 二级目录操作
    else if(second!='a'&&third=='a') {
        catalogList[first].children[second].name=name;
    }
    // 三级目录操作
    else if(third!='a') {
      catalogList[first].children[second].children[third].name=name;
    }
    this.setState({
      catalogData: catalogList,
    })
  }
  // 监听保存知识导学
  savePreface = ()=> {
    const { first, second, third, prefaceData, catalogData } = this.state;
    let catalogList = catalogData;
    console.log(prefaceData)
    if(first!='a'&&second=='a') {
      catalogList[first].preface=prefaceData;
    }
    // 二级目录操作
    else if(second!='a'&&third=='a') {
        catalogList[first].children[second].preface=prefaceData;
    }
    // 三级目录操作
    else if(third!='a') {
      catalogList[first].children[second].children[third].preface=prefaceData;
    }
    this.setState({
      catalogData: catalogList,
    })
    this.handleCancel();

  }
  showGetModal = (firstIndex,secondIndex,thirdIndex,type,resourceIndex,resourceId)=> {
    this.setState({
      getVisible: true,
      first: firstIndex,
      second: secondIndex,
      third: thirdIndex,
      rIndex: resourceIndex,
      resourceType: type,
      resourceId: resourceId,
    })
  }
  showPreface = (firstIndex,secondIndex,thirdIndex,preface)=> {
    this.setState({
      preVisible: true,
      first: firstIndex,
      second: secondIndex,
      third: thirdIndex,
      prefaceData: preface,
    })
  }
  handleCancel= ()=> {
    this.setState({
      getVisible: false,
      preVisible: false,
    })
  }
  getTest = (e)=> {
    console.log(e)
  } 
  render() {
    const { form } = this.props;
    const { location:{query:{cId}} } = this.props;
    const { chapterData, knowledgeName, treeSelect, isPrevent, courseInfo, prefaceData, 
      courseType, catalogData, getVisible, preVisible, resourceId, resourceType} = this.state;
    const radioBtn = {height:'28px', lineHeight:'28px', marginRight:'10px', borderRadius:'3px', border:'0'};
    let isModify = false;
    if(cId) { isModify = true }
    const newMenu = (
      <Menu>
        <Menu.Item><a onClick={this.newCatalog.bind(this,1)}><Icon type="bars" /> 添加同级目录</a></Menu.Item>
        <Menu.Item><a onClick={this.newCatalog.bind(this,2)}><Icon type="bars" /> 添加下级目录</a></Menu.Item>
        <Menu.Item><a onClick={this.newCatalog.bind(this,6)}><Icon type="plus-circle" /> 本目录添加导学</a></Menu.Item>
        <Menu.Item><a onClick={this.newCatalog.bind(this,3)}><Icon type="plus-circle" /> 本目录添加微课</a></Menu.Item>
        <Menu.Item><a onClick={this.newCatalog.bind(this,4)}><Icon type="plus-circle" /> 本目录添加试卷</a></Menu.Item>
        <Menu.Item><a onClick={this.newCatalog.bind(this,5)}><Icon type="plus-circle" /> 本目录添加素材</a></Menu.Item>
      </Menu>
    );
    const thirdMenu = (
      <Menu>
        <Menu.Item><a onClick={this.newCatalog.bind(this,1)}><Icon type="bars" /> 添加同级目录</a></Menu.Item>
        <Menu.Item><a onClick={this.newCatalog.bind(this,6)}><Icon type="plus-circle" /> 本目录添加导学</a></Menu.Item>
        <Menu.Item><a onClick={this.newCatalog.bind(this,3)}><Icon type="plus-circle" /> 本目录添加微课</a></Menu.Item>
        <Menu.Item><a onClick={this.newCatalog.bind(this,4)}><Icon type="plus-circle" /> 本目录添加试卷</a></Menu.Item>
        <Menu.Item><a onClick={this.newCatalog.bind(this,5)}><Icon type="plus-circle" /> 本目录添加素材</a></Menu.Item>
      </Menu>
    );
    console.log(catalogData)
    return (
      <div>
        <Zheader addr={4}/>
          <div className="container">
            <div className={styles.releaseCon}>
                <Form onSubmit={this.handleSubmit} >
                    <FormItem labelCol={{ span: 2 }} wrapperCol={{ span: 17 }} label="类型">
                        {form.getFieldDecorator('type', {
                            initialValue: isModify? courseInfo.type:1,
                            rules: [{ required: true, message: '请选择类型' }]
                            })(
                              <Radio.Group buttonStyle="solid" style={{marginLeft:'20px'}}>
                              { isModify? 
                                courseInfo.type==1?<Radio.Button value={1} style={radioBtn} >标准课程</Radio.Button>:'' 
                                : <Radio.Button value={1} style={radioBtn} onClick={this.changeCourseType.bind(this,1)} >标准课程</Radio.Button> 
                              }
                              { isModify? 
                                courseInfo.type==2?<Radio.Button value={2} style={radioBtn} >专题课程</Radio.Button>:'' 
                                : <Radio.Button value={2} style={radioBtn} onClick={this.changeCourseType.bind(this,2)} >专题课程</Radio.Button> 
                              }
                              </Radio.Group>
                            )}
                    </FormItem>
                    <FormItem labelCol={{ span: 2 }} wrapperCol={{ span: 17 }} label="课程名称">
                        {form.getFieldDecorator('name', {
                          initialValue: isModify? courseInfo.name:'',
                          rules: [{ required: true, message: '请填写课程名称' }],
                        })(
                          <Input style={{width:'60%',marginLeft:'20px'}} />
                        )}
                    </FormItem>
                    <FormItem labelCol={{ span: 2 }} wrapperCol={{ span: 17 }} label="权限">
                        {form.getFieldDecorator('power', {
                          initialValue: isModify? courseInfo.role:1,
                          rules: [{ required: true, message: '请选择权限' }]
                        })(
                          <Radio.Group buttonStyle="solid" style={{marginLeft:'20px'}}>
                            <Radio.Button value={1} style={radioBtn}>仅自己</Radio.Button>
                            <Radio.Button value={2} style={radioBtn}>全校</Radio.Button>
                            <Radio.Button value={3} style={radioBtn}>公开</Radio.Button>
                            <Radio.Button value={4} style={radioBtn}>区域</Radio.Button>
                          </Radio.Group>)}
                    </FormItem>
                    <Row style={{width:'100%',marginBottom:'20px'}}>
                        <Col span={2} style={{textAlign:'right',lineHeight:'32px'}} >选择教材：</Col>
                        <Col span={17} style={{marginLeft:'20px'}}>
                          { isModify&&courseInfo.book_id? <ChooseBook onChange={this.getBookData} book_id={courseInfo.book_id} isChooseSync={true} noWork={true}/>:'' }
                          { isModify?'': <ChooseBook onChange={this.getBookData} isChooseSync={true} noWork={true}/> }
                        </Col>
                    </Row>
                    
                    <FormItem labelCol={{ span: 2 }} wrapperCol={{ span: 17 }} label="知识节点">
                        {form.getFieldDecorator('knowledge', {
                          initialValue: isModify? courseInfo.knowledge_id:!!treeSelect? treeSelect:'',
                        })(
                          <div style={{margin:'3px 0 0 20px'}}><ChooseKnow  chapterData={chapterData} onChange={this.theKnowledge}
                            Name={isModify?courseInfo.knowledge_name:!!knowledgeName? knowledgeName+' >>' : '请选择知识节点 >>'}/></div>
                        )}
                    </FormItem>
                    {
                      courseType==1?
                      <FormItem labelCol={{ span: 2 }} wrapperCol={{ span: 17 }} label="知识导学">
                        {form.getFieldDecorator('preface', {
                        })(
                          <div style={{marginLeft:'20px'}}>
                          { isModify&&courseInfo.preface==''||isModify&&courseInfo.preface?<ZUeditor id="content" content={prefaceData} initialContent={courseInfo.preface} onchange={(e)=>this.ueditorChange(e)}/>:'' }
                          { isModify?'':<ZUeditor id="content" content={prefaceData} initialContent={prefaceData} onchange={(e)=>this.ueditorChange(e)}/> }
                          </div>
                        )}
                      </FormItem> :
                      <Row style={{width:'100%',marginBottom:'20px'}}>
                        <Col span={2} style={{textAlign:'right',lineHeight:'32px'}} >学习目录：</Col>
                        <Col span={17} style={{marginLeft:'20px'}} className={styles.studyCatalog}>
                        {
                          catalogData.map((firstItem,firstIndex)=> {
                            return <div key={firstIndex} className={styles.firstCatalog}>
                              { catalogData.length==1?'':
                                firstItem.children.length>0?
                                <Popconfirm title="删除该目录将会一并删除其子目录，你确定删除吗?" onConfirm={this.reduceCatalog.bind(this,firstIndex,'a','a',1)} okText="确定" cancelText="取消">
                                  <i className={styles.reduceicon} ></i> 
                                </Popconfirm> : 
                                <i className={styles.reduceicon} onClick={this.reduceCatalog.bind(this,firstIndex,'a','a',1)}></i>
                              }
                              <Dropdown overlay={newMenu} trigger={['click']} >
                                <i className={styles.plusicon} onClick={this.saveCatalogIndex.bind(this,firstIndex,'a','a')}>&nbsp;</i>
                              </Dropdown>
                              <input className={styles.catalogInput} id={"first"+firstIndex} onFocus={this.saveCatalogIndex.bind(this,firstIndex,'a','a')} onBlur={this.getInputValue.bind(this,1)} defaultValue={firstItem.name} placeholder="请输入一级目录标题" />
                              {/* 一级目录下资源位置 */}
                              {
                                !!firstItem.preface?
                                <div className={styles.catalogResource}>
                                  <span className={styles.catalogSpan} ><span>知识导学：</span><div className={styles.preText} dangerouslySetInnerHTML={{ __html: firstItem.preface }}></div></span>
                                  <span className={styles.iSpan}>
                                    <i className={styles.reduceicon} onClick={this.reduceCatalog.bind(this,firstIndex,'a','a', 6 )}></i>
                                    <i className={styles.plusicon} onClick={this.showPreface.bind(this,firstIndex,'a','a',firstItem.preface )}></i> 
                                  </span>
                                </div>:''
                              }
                              {
                                // 微课
                                firstItem.micro?
                                firstItem.micro.map((firstMaItem,firstMaIndex)=>{
                                  return <div key={firstMaIndex} className={styles.catalogResource}>
                                    <span className={styles.catalogSpan} >微课：{firstMaItem.title}</span>
                                    <span className={styles.iSpan}>
                                      <i className={styles.reduceicon} onClick={this.reduceCatalog.bind(this,firstIndex,'a','a',2, firstMaIndex)}></i>
                                      <i className={styles.plusicon} onClick={this.showGetModal.bind(this,firstIndex,'a','a',2, firstMaIndex,firstMaItem.id)}></i> 
                                    </span>
                                  </div>
                                }):""
                              }
                              { 
                                // 试卷
                                firstItem.paper?
                                firstItem.paper.map((firstMaItem,firstMaIndex)=>{
                                  return <div key={firstMaIndex} className={styles.catalogResource}>
                                    <span className={styles.catalogSpan} >试卷：{firstMaItem.title}</span>
                                    <span className={styles.iSpan}>
                                      <i className={styles.reduceicon} onClick={this.reduceCatalog.bind(this,firstIndex,'a','a',3, firstMaIndex)}></i>
                                      <i className={styles.plusicon} onClick={this.showGetModal.bind(this,firstIndex,'a','a',3, firstMaIndex,firstMaItem.id)}></i> 
                                    </span>
                                  </div>
                                }):""
                              }
                              {
                                firstItem.material?
                                firstItem.material.map((firstMaItem,firstMaIndex)=>{
                                  return <div key={firstMaIndex} className={styles.catalogResource}>
                                    <span className={styles.catalogSpan} >素材：{firstMaItem.title}</span>
                                    <span className={styles.iSpan}>
                                      <i className={styles.reduceicon} onClick={this.reduceCatalog.bind(this,firstIndex,'a','a',4, firstMaIndex)}></i>
                                      <i className={styles.plusicon} onClick={this.showGetModal.bind(this,firstIndex,'a','a',4, firstMaIndex,firstMaItem.id)}></i> 
                                    </span>
                                  </div>
                                }):""
                              }
                              {/* 二级目录位置 */}
                              {
                                firstItem.children?firstItem.children.map((secondItem,secondIndex)=> {
                                  return <div key={secondIndex} className={styles.secondCatalog}>
                                    {
                                      secondItem.children.length>0?
                                      <Popconfirm title="删除该目录将会一并删除其子目录，你确定删除吗?" onConfirm={this.reduceCatalog.bind(this,firstIndex,secondIndex,'a',1)} okText="确定" cancelText="取消">
                                        <i className={styles.reduceicon} ></i> 
                                      </Popconfirm> :
                                      <i className={styles.reduceicon} onClick={this.reduceCatalog.bind(this,firstIndex,secondIndex,'a',1)}></i>
                                    }
                                    <Dropdown overlay={newMenu} trigger={['click']}>
                                      <i className={styles.plusicon} onClick={this.saveCatalogIndex.bind(this,firstIndex,secondIndex,'a')}>&nbsp;</i>
                                    </Dropdown>
                                    <input className={styles.catalogInput} id={"second"+secondIndex} onFocus={this.saveCatalogIndex.bind(this,firstIndex,secondIndex,'a')} onBlur={this.getInputValue.bind(this,2)} placeholder="请输入二级目录标题" />
                                    {/* 二级目录下资源位置 */}
                                    {
                                      !!secondItem.preface?
                                      <div className={styles.catalogResource}>
                                        <span className={styles.catalogSpan} ><span>知识导学：</span><div style={{width:'300px'}} className={styles.preText} dangerouslySetInnerHTML={{ __html: secondItem.preface }}></div></span>
                                        <span className={styles.iSpan}>
                                          <i className={styles.reduceicon} onClick={this.reduceCatalog.bind(this,firstIndex,secondIndex,'a', 6 )}></i>
                                          <i className={styles.plusicon} onClick={this.showPreface.bind(this,firstIndex,secondIndex,'a',secondItem.preface )}></i> 
                                        </span>
                                      </div>:''
                                    }
                                    {
                                      // 微课
                                      secondItem.micro?
                                      secondItem.micro.map((secondMaItem,secondMaIndex)=>{
                                        return <div key={secondMaIndex} className={styles.catalogResource}>
                                          <span className={styles.catalogSpan} >微课：{secondMaItem.title}</span>
                                          <span className={styles.iSpan}>
                                            <i className={styles.reduceicon} onClick={this.reduceCatalog.bind(this,firstIndex,secondIndex,'a',2,secondMaIndex)}></i>
                                            <i className={styles.plusicon} onClick={this.showGetModal.bind(this,firstIndex,secondIndex,'a',2, secondMaIndex,secondMaItem.id)}></i> 
                                          </span>
                                        </div>
                                      }):""
                                    }
                                    { 
                                      // 试卷
                                      secondItem.paper?
                                      secondItem.paper.map((secondMaItem,secondMaIndex)=>{
                                        return <div key={secondMaIndex} className={styles.catalogResource}>
                                          <span className={styles.catalogSpan} >试卷：{secondMaItem.title}</span>
                                          <span className={styles.iSpan}>
                                            <i className={styles.reduceicon} onClick={this.reduceCatalog.bind(this,firstIndex,secondIndex,'a',3,secondMaIndex)}></i>
                                            <i className={styles.plusicon} onClick={this.showGetModal.bind(this,firstIndex,secondIndex,'a',3, secondMaIndex,secondMaItem.id)}></i> 
                                          </span>
                                        </div>
                                      }):""
                                    }
                                    {
                                      secondItem.material?
                                      secondItem.material.map((secondMaItem,secondMaIndex)=>{
                                        return <div key={secondMaIndex} className={styles.catalogResource}>
                                          <span className={styles.catalogSpan} >素材：{secondMaItem.title}</span>
                                          <span className={styles.iSpan}>
                                            <i className={styles.reduceicon} onClick={this.reduceCatalog.bind(this,firstIndex,secondIndex,'a',4,secondMaIndex)}></i>
                                            <i className={styles.plusicon} onClick={this.showGetModal.bind(this,firstIndex,secondIndex,'a',4, secondMaIndex,secondMaItem.id)}></i> 
                                          </span>
                                        </div>
                                      }):""
                                    }
                                    {/* 三级目录位置 */}
                                    {
                                      secondItem.children?secondItem.children.map((thirdItem,thirdIndex)=>{
                                        return <div key={thirdIndex} className={styles.thirdCatalog}>
                                          <i className={styles.reduceicon} onClick={this.reduceCatalog.bind(this,firstIndex,secondIndex,thirdIndex,1)}></i>
                                          <Dropdown overlay={thirdMenu} trigger={['click']}>
                                            <i className={styles.plusicon} onClick={this.saveCatalogIndex.bind(this,firstIndex,secondIndex,thirdIndex)}>&nbsp;</i>
                                          </Dropdown>
                                          <input className={styles.catalogInput} id={"third"+thirdIndex} onFocus={this.saveCatalogIndex.bind(this,firstIndex,secondIndex,thirdIndex)} onBlur={this.getInputValue.bind(this,3)} placeholder="请输入三级目录标题" />
                                          {/* 三级目录下资源位置 */}
                                          {
                                            !!thirdItem.preface?
                                            <div className={styles.catalogResource}>
                                              <span className={styles.catalogSpan} ><span>知识导学：</span><div style={{width:'280px'}} className={styles.preText} dangerouslySetInnerHTML={{ __html: thirdItem.preface }}></div></span>
                                              <span className={styles.iSpan}>
                                                <i className={styles.reduceicon} onClick={this.reduceCatalog.bind(this,firstIndex,secondIndex,thirdIndex, 6 )}></i>
                                                <i className={styles.plusicon} onClick={this.showPreface.bind(this,firstIndex,secondIndex,thirdIndex,thirdItem.preface )}></i> 
                                              </span>
                                            </div>:''
                                          }
                                          {
                                            // 微课
                                            thirdItem.micro?
                                            thirdItem.micro.map((thirdMaItem,thirdMaIndex)=>{
                                              return <div key={thirdMaIndex} className={styles.catalogResource}>
                                                <span className={styles.catalogSpan} >微课：{thirdMaItem.title}</span>
                                                <span className={styles.iSpan}>
                                                  <i className={styles.reduceicon} onClick={this.reduceCatalog.bind(this,firstIndex,secondIndex,thirdIndex,2,thirdMaIndex)}></i>
                                                  <i className={styles.plusicon} onClick={this.showGetModal.bind(this,firstIndex,secondIndex,thirdIndex,2, thirdMaIndex,thirdMaItem.id)}></i> 
                                                </span>
                                              </div>
                                            }):""
                                          }
                                          { 
                                            // 试卷
                                            thirdItem.paper?
                                            thirdItem.paper.map((thirdMaItem,thirdMaIndex)=>{
                                              return <div key={thirdMaIndex} className={styles.catalogResource}>
                                                <span className={styles.catalogSpan} >试卷：{thirdMaItem.title}</span>
                                                <span className={styles.iSpan}>
                                                  <i className={styles.reduceicon} onClick={this.reduceCatalog.bind(this,firstIndex,secondIndex,thirdIndex,3,thirdMaIndex)}></i>
                                                  <i className={styles.plusicon} onClick={this.showGetModal.bind(this,firstIndex,secondIndex,thirdIndex,3, thirdMaIndex,thirdMaItem.id)}></i> 
                                                </span>
                                              </div>
                                            }):""
                                          }
                                          {
                                            thirdItem.material?
                                            thirdItem.material.map((thirdMaItem,thirdMaIndex)=>{
                                              return <div key={thirdMaIndex} className={styles.catalogResource}>
                                                <span className={styles.catalogSpan} >素材：{thirdMaItem.title}</span>
                                                <span className={styles.iSpan}>
                                                  <i className={styles.reduceicon} onClick={this.reduceCatalog.bind(this,firstIndex,secondIndex,thirdIndex,4,thirdMaIndex)}></i>
                                                  <i className={styles.plusicon} onClick={this.showGetModal.bind(this,firstIndex,secondIndex,thirdIndex,4, thirdMaIndex,thirdMaItem.id)}></i> 
                                                </span>
                                              </div>
                                            }):""
                                          }
                                        </div>
                                      }):''
                                    }
                                  </div>
                                }):''
                              }
                            </div>
                          })
                        }
                        </Col>
                      </Row>
                    }
                    <FormItem labelCol={{ span: 2 }} wrapperCol={{ span: 17 }} label="备注" style={{marginTop:'-10px'}}>
                        {form.getFieldDecorator('remark',{
                          initialValue: isModify? courseInfo.remark:'',
                        })
                        ( 
                          <Input style={{width:'60%',marginLeft:'20px'}} placeholder="请输入备注内容" />
                        )}
                    </FormItem>
                    <Row>
                      <Col className={styles.courseTips} style={{marginLeft:'114px'}}>
                          <p><span>*</span>标准课程：统一标准，教师自定义添加微课、课件/素材、习题、试卷、讨论课题（里面资源数量不限）</p>
                          <p>专题课程：可自定义目录，在每个目录下可添加微课、试卷或课件/素材</p>
                      </Col>
                    </Row>
                    <Form.Item>
                      <Row className={styles.resultBtn} style={{marginLeft:'70px'}}>
                          <Col offset={1} className={styles.courseTips}>
                            {
                              isPrevent?
                              <Button>新建提交</Button>
                              :  <Button htmlType="submit" >{isModify?"修改提交":"新建提交"}</Button>
                            }
                              <Button className={styles.backBtn} onClick={()=>{history.goBack()}}>返回</Button>
                          </Col>
                      </Row>
                    </Form.Item>
                </Form>
            </div>
          </div>
        <ZFooter />
        <Modal
          destroyOnClose={true}
          width={1220}
          onCancel={this.handleCancel}
          visible={getVisible}
          footer={null}
        >
          <div>
            {
              resourceType==3?
              <SearchPaper countNum={8} toCatalog={true} resourceId={resourceId} onChange={this.getResourceId}/>
              :<SearchMaterial type={resourceType==2?1:2} countNum={8} toCatalog={true} resourceId={resourceId} onChange={this.getResourceId}/>
            }
            
          </div>
        </Modal>
        {/* 知识导学弹窗 */}
        <Modal
          width={800}
          destroyOnClose={true}
          onCancel={this.handleCancel}
          onOk={this.savePreface}
          visible={preVisible}
          okText="确定"
          cancelText="取消"
        >
          <ZUeditor id="content2" content={prefaceData} initialContent={prefaceData} onchange={(e)=>this.ueditorChange(e)}/>
        </Modal>
      </div>
    );
  }
}
CreateCourse = Form.create()(CreateCourse);
export default CreateCourse;
