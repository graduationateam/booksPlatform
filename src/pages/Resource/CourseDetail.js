import React, { Component } from 'react';
import Link from 'umi/link';
import { Modal, Rate, Icon, Checkbox, Form, Radio, Statistic, Menu, Dropdown, Input, Tooltip, Button } from 'antd';
import { connect } from 'dva';
import { getDto } from '@/utils/dto';
import Zheader from '@/components/Zheader';
import ZFooter from '@/components/ZFooter';
import XRadioBtn from '@/components/XRadioBtn';
import styles from './resource.less';
import SearchMaterial from './SearchMaterial';
import SearchPaper from './SearchPaper';
import utilsView from '@/utils/utilsView';
import ResourceMenu from './components/ResourceMenu';
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const Search = Input.Search;
const Countdown = Statistic.Countdown;
const fromData = [
    {value:1,name:'收藏'},
    {value:2,name:'自建'},
];
const topicTypeData = [
    {value:1,name:'选择题'},
    {value:2,name:'填空题'},
    {value:3,name:'判断题'},
    {value:4,name:'应用题'},
];
const difficultyData = [
    {value:1,name:'容易'},
    {value:2,name:'一般'},
    {value:3,name:'困难'},
]
@connect(({ course, resource }) => ({
    course, resource
}))
class CourseDetail extends Component {
    constructor(props){
        super(props);
        this.state = {
            tabsVisible: 1,
            listVisible: true,
            searchVisible: false,
            createVisible: false,
            collectVisible: false,
            removeShow: false, //移除资源弹窗
            remove_id: '', //要移除的资源的关联id
            starVisiable: false, //评分弹窗
            starVal: 0, //评分值
            changStatus: false, // 父级改变时刷新组件状态
            buildVisible: false,
        }
    }
    componentDidMount() {
        this.getCourseInfo();
        this.getResource();
    }
    getCourseInfo = ()=> {
        const { location:{query:{cId}}, dispatch } = this.props;
        const user_id = getDto('user_id');
        dispatch({
            type: 'course/courseInfo',
            payload: {
                method: '/res/resCourse/get',
                id: cId,
                user_id: user_id,
            }
        });
    }
    getResource = (isNotStart)=> {
        const { location:{query:{cId}}, dispatch } = this.props;
        if(isNotStart) {
            dispatch({
                type: 'resource/getResource2',
                payload: {
                    method: '/res/resSourseExtend/count',
                    course_id: cId,
                }
            });
        }else {
            dispatch({
                type: 'resource/getResource',
                payload: {
                    method: '/res/resSourseExtend/count',
                    course_id: cId
                }
            });
        } 
    }
    onTypeChange = (e)=> {
        const { location:{query:{cId}}, dispatch } = this.props;
        let value = e;
        if(!!e.target) {
            value = e.target.value;
        }
        let method = '';
        this.setState({
            tabsVisible: value
        });
        switch(value) {
            case 1:
            case 2:
            case 5:
                method = "/res/resSourseExtend/getKjAll";break;
            case 3:
                method = "/res/resSourseExtend/getSjAll";break;
            case 4:
                method = "/res/resSourseExtend/getXtAll";break;
            case 6:
                method = "/res/resSourseExtend/getTlAll";break;
        }
        dispatch({
            type: 'resource/resourceList',
            payload: {
                method: method,
                course_id: cId,
                type: value
            }
        })
        
    }
    onFromChange = (value)=> {
        console.log(value)
    }
    onTopicChange = (value)=> {

    }
    onDifficultyChange = (value)=> {

    }
    showList = (value)=> {
        this.setState({
            listVisible: true,
            searchVisible: false,
            createVisible: false,
        })
        this.onTypeChange(value);
    }
    toSearch = ()=> {
        this.setState({
            listVisible: false,
            searchVisible: true,
            createVisible: false,
        })
    }
    handleClick = (e)=> {
        console.log(e)
    }
    refreshNum = (flag)=> {
        if(flag) {
            this.getResource();
        }
    }
    showModal = (id)=> {
        this.setState({
            removeShow: true,
            remove_id: id
        })
    }
    collectShow = ()=> {
        this.setState({
            collectVisible: true,
        })
    }
    // 收藏
    collectOk = ()=> {
        const { location:{query:{cId}}, dispatch } = this.props;
        const user_id = getDto('user_id');
        dispatch({
            type: 'course/collectCourse',
            payload:{
              method: "/res/resCourse/collect",
              user_id: user_id,
              course_id: cId,
            },
            callback:()=>{
                this.handleCancel();
                this.getCourseInfo();
            }
        });
    }
    handleCancel= ()=> {
        this.setState({
            removeShow: false,
            starVisiable: false,
            collectVisible: false,
            buildVisible: false,
        })
    }
    // 移除
    onRemove = ()=> {
        const { dispatch } = this.props;
        const { remove_id, tabsVisible } = this.state;
        dispatch({
        type: 'resource/removeResource',
        payload:{
            method: "/res/resSourseExtend/delete" ,
            id: remove_id
        },
        callback:()=>{
            this.onTypeChange(tabsVisible)
            this.getResource(true)
            this.handleCancel()
            this.setState({
                changStatus: !this.state.changStatus,
            })
        }
        });
    }
    getStar = (value)=> {
        let starVal = value*2;
        this.setState({
            starVisiable: true,
            starVal: starVal
        })
    }
    starModal = ()=> {
        const { location:{query:{cId}}, dispatch } = this.props;
        const user_id = getDto('user_id');
        const { starVal } = this.state;
        dispatch({
            type: 'resource/getStar',
            payload:{
            method: "/res/resCourse/scoreRecord",
            course_id: cId,
            user_id: user_id,
            score: starVal,
            },
            callback:()=>{
                this.handleCancel();
                this.getCourseInfo();
            }
        });
    }
    // 设置可不可见（仅针对学生）
    setUpIsSee = (isAll,res_id,nowStatus)=> {
        const { location:{query:{cId}}, dispatch } = this.props;
        const { tabsVisible } = this.state;
        if( isAll ) {
            dispatch({
                type: 'resource/setUpSee',
                payload:{
                method: "/res/resSourseExtend/so",
                course_id: cId,
                type: tabsVisible,
                is_so: nowStatus?0:1,
                },
                callback:()=>{
                    this.onTypeChange(tabsVisible)
                }
            });
        }else {
            dispatch({
                type: 'resource/setUpSee',
                payload:{
                method: "/res/resSourseExtend/so",
                course_res_id: res_id,
                is_so: nowStatus?0:1,
                },
                callback:()=>{
                    this.onTypeChange(tabsVisible)
                }
            });
        }
    }
    showBuilding = ()=> {
        this.setState({
          buildVisible: true,
        })
      }
  render() {
    const { course:{ courseInfo }, location:{query:{cId}}, resource:{ theResource, resourceList } } = this.props;
    const user_id = getDto('user_id');
    const radioBtn = {height:'28px', lineHeight:'28px', marginRight:'10px', borderRadius:'3px', border:'0'};
    const { tabsVisible, listVisible, searchVisible, createVisible, collectVisible, removeShow, 
        starVisiable, starVal, changStatus, buildVisible } = this.state;
    const handFlag = (
        <Menu>
            {/* {
                tabsVisible==1?
                <Menu.Item><Link style={{color:'#808080'}} to={"/resource/createLesson?type=1"} ><Icon type="plus" /> 新建微课</Link></Menu.Item>
                :tabsVisible==2?
                <Menu.Item><Link style={{color:'#808080'}} to="/resource/creatematerial"><Icon type="plus" /> 新建课件</Link></Menu.Item>
                :tabsVisible==3?
                <Menu.Item><Link style={{color:'#808080'}} to="/resource/creatematerial" ><Icon type="plus" /> 新建试卷</Link></Menu.Item>
                :tabsVisible==4?
                <Menu.Item><Link style={{color:'#808080'}} to="/resource/creatematerial" ><Icon type="plus" /> 新建习题</Link></Menu.Item>
                :tabsVisible==5?
                <Menu.Item><Link style={{color:'#808080'}} to={"/resource/createLesson?type=5"} ><Icon type="plus" /> 新建优课</Link></Menu.Item>
                :<Menu.Item><Link style={{color:'#808080'}} to="/resource/creatematerial" ><Icon type="plus" /> 新建讨论</Link></Menu.Item>
            } */}
            {
                tabsVisible==1?
                <Menu.Item><Link style={{color:'#808080'}} to={"/resource/createLesson?type=1"} ><Icon type="plus" /> 新建微课</Link></Menu.Item>
                :tabsVisible==2?
                <Menu.Item><Link style={{color:'#808080'}} to="/resource/creatematerial"><Icon type="plus" /> 新建课件</Link></Menu.Item>
                :tabsVisible==3?
                <Menu.Item><a style={{color:'#808080'}} onClick={this.showBuilding} ><Icon type="plus" /> 新建试卷</a></Menu.Item>
                :tabsVisible==4?
                <Menu.Item><a style={{color:'#808080'}} onClick={this.showBuilding} ><Icon type="plus" /> 新建习题</a></Menu.Item>
                :tabsVisible==5?
                <Menu.Item><Link style={{color:'#808080'}} to={"/resource/createLesson?type=5"} ><Icon type="plus" /> 新建优课</Link></Menu.Item>
                :<Menu.Item><a style={{color:'#808080'}} onClick={this.showBuilding} ><Icon type="plus" /> 新建讨论</a></Menu.Item>
            }
            <Menu.Item><a style={{color:'#808080'}} onClick={this.toSearch}><Icon type="plus-circle" /> 添加资源</a></Menu.Item>
        </Menu>
    );
    return (
      <div>
        <Zheader addr={4}/>
        <div className={styles.moreCon}>
          <div className="container">
            <div className={styles.detailcleCon}>
              
              {/* 标题 */}
              <div className={styles.titleCon}>
                <div className={styles.clearCon}>
                    <ul className={styles.chapter}>
                        <li><span className={styles.courseType}>{courseInfo.type==1?'标准课程':'专题课程'}</span></li>
                        <li className={styles.courseName}>{courseInfo.name}</li>
                        { courseInfo.is_boutique==1? <li className={styles.tagStyle}><span className={styles.boutique}>精</span></li> :'' }
                        { courseInfo.is_ecommend==1? <li className={styles.tagStyle}><span className={styles.ecommend}>荐</span></li> :'' }
                    </ul>
                    { courseInfo.is_star?'':
                        <div className={styles.getStar}>
                            <div className="antd-globals">
                                <span className={styles.gotoRate}>快来评分吧！ </span>
                                <Rate allowHalf style={{width:'120px',fontSize: 18 }} defaultValue={0} onChange={this.getStar}/>
                            </div>
                        </div>
                    }
                </div>
                <div className={styles.verAndInfo}>
                    <div className={styles.version}>{courseInfo.book_name} > {courseInfo.knowledge_name}</div>
                    <div className={styles.other}>
                        <div className={styles.teacherInfo}>
                            <b className={styles.avatar} style={{backgroundImage: !!courseInfo.creator_img_url?'url('+courseInfo.creator_img_url+')':`url(${require('@/assets/avatar.jpg')})`}}></b>
                            <span>{courseInfo.creator_user_name}</span>
                        </div>
                        <a className={styles.collection} onClick={courseInfo.is_collection?'':this.collectShow}>{courseInfo.is_collection?"已收藏":"收藏"}（{courseInfo.collect_total}）</a>
                        <span className={styles.collection}>星评（{courseInfo.star_val?courseInfo.star_val:0}）</span>
                        {/* { courseInfo.is_star?'':<span className={styles.starTips}>快给课程打个分吧!</span> } */}
                    </div>
                </div>
              </div>
              
              {/* 内容 */}
              <div className={styles.contentCon}>
                <div className={styles.btnTabs}>
                    <Radio.Group defaultValue={1} buttonStyle="solid" onChange={this.onTypeChange}>
                    {
                        theResource.map((item,index)=> {
                            return index==2||index==3||index==5?<Radio.Button key={index} style={radioBtn} value={index+100} onClick={this.showBuilding}>{item.type_name}{'（'+item.count+'）'}</Radio.Button>
                            :<Radio.Button key={index} style={radioBtn} value={item.type} onClick={this.showList.bind(this,item.type)}>{item.type_name}{'（'+item.count+'）'}</Radio.Button>
                        })
                    }
                    </Radio.Group>
                    {
                        courseInfo.creator_id==user_id?
                        <Dropdown overlay={handFlag}>
                            <button className={styles.moreBtn} >更多操作<Icon type="down" /></button>
                        </Dropdown>:''
                    }
                </div>
                {/* **************************** 微课 ********************************/}
                <div style={{display:tabsVisible==1?'block':'none'}}>
                    {/* 微课列表 */}
                    <div style={{display:listVisible?'block':'none'}}>
                    {
                        courseInfo.creator_id==user_id?
                        <div className={styles.isSee} style={{marginTop:'20px'}}>
                            <a onClick={this.setUpIsSee.bind(this,true,1,false)} style={{marginLeft:'0'}}><i className={styles.iconSee}></i>一键可见</a>
                            <a onClick={this.setUpIsSee.bind(this,true,1,true)}><i className={styles.iconNotSee}></i>一键不可见</a>
                        </div>:''
                    }
                        <ul className={styles.detailListStyle}>
                            {
                                resourceList.data.map((item,index)=>{
                                    return <li key={index} style={{marginRight:(index+1)%5==0?0:''}}>
                                        <div className={styles.linkStyle} >
                                            <Link to={'/resource/resourcedetail?type=1&id='+item.id} >
                                                <div className={styles.img} style={{backgroundImage: item.cover_url?'url('+item.cover_url+')':`url(${require('@/assets/test1.jpg')})`}} >
                                                    <div className={styles.type}>{item.file_type}</div>
                                                </div>
                                            </Link>
                                            <div className={styles.btn}>
                                            {
                                                courseInfo.creator_id==user_id?
                                                <div className={styles.isSee}>
                                                    <a onClick={this.showBuilding}><Tooltip placement="bottom" title="发布"><i className={styles.iconRelease} ></i></Tooltip></a>
                                                    <a onClick={this.setUpIsSee.bind(this,false,item.course_res_id,item.is_so)}>
                                                    {
                                                        item.is_so?<Tooltip placement="bottom" title="设置不可见"><i className={styles.iconNotSee} ></i></Tooltip>
                                                        : <Tooltip placement="bottom" title="取消不可见"><i style={{backgroundPosition: '-34px -17px'}} ></i></Tooltip>
                                                    }
                                                    </a>
                                                    {
                                                        item.creator_id==user_id?
                                                        <Link to={`/resource/createlesson?type=1&id=${item.id}`} ><Tooltip placement="bottom" title="编辑"><i className={styles.iconEdit} ></i></Tooltip></Link>:""
                                                    }
                                                    <a onClick={this.showModal.bind(this,`${item.course_res_id}`)}><Tooltip placement="bottom" title="移除"><i className={styles.iconDelete} ></i></Tooltip></a>
                                                </div>
                                                : <div className={styles.isSee}>
                                                    <a onClick={this.showBuilding}><Tooltip placement="bottom" title="发布"><i className={styles.iconRelease} ></i></Tooltip></a>
                                                  </div>
                                            }
                                            </div>
                                        </div>
                                        <Link to={'/resource/resourcedetail?type=1&id='+item.id} >
                                            <div className={styles.word}>
                                                { item.is_boutique==1?<span>精</span>:'' }
                                                { item.is_ecommend==1?<span>荐</span>:'' }
                                                {item.title}
                                            </div>
                                        </Link>
                                        <div className={styles.userInfo}>
                                            <b className={styles.avatar} style={{backgroundImage: !!item.creator_img_url?'url('+item.creator_img_url+')':`url(${require('@/assets/avatar.jpg')})`}} ></b>
                                            <span className={styles.name}>{item.creator_user_name}</span>
                                            <span className={styles.other}><i className={styles.iconEye}></i>{item.pageviews?item.pageviews>=10000?item.pageviews/10000+"w":item.pageviews : 0}</span>
                                            <span className={styles.other}><i className={styles.iconHalfStar}></i>{item.star_val?item.star_val : 0}</span>
                                        </div>
                                    </li>
                                })
                            }
                            
                        </ul>
                    </div>
                    {/* 搜索微课 */}
                    {
                        courseInfo?
                        <div style={{display:searchVisible?'block':'none'}}>
                            <SearchMaterial type={1} courseId={courseInfo.id} onChange={this.refreshNum} changStatus={changStatus}/>
                        </div>:''
                    }
                </div>

                {/**************************** 课件素材 *****************************/}
                <div style={{display:tabsVisible==2?'block':'none'}}>
                    <div style={{display:listVisible?'block':'none'}}>
                    {
                        courseInfo.creator_id==user_id?
                        <div className={styles.isSee} style={{marginTop:'20px'}}>
                            <a onClick={this.setUpIsSee.bind(this,true,1,false)} style={{marginLeft:'0'}}><i className={styles.iconSee}></i>一键可见</a>
                            <a onClick={this.setUpIsSee.bind(this,true,1,true)}><i className={styles.iconNotSee}></i>一键不可见</a>
                        </div>:''
                    }
                        <ul className={styles.detailListStyle}>
                            {
                                resourceList.data.map((item,index)=>{
                                    return <li key={index} style={{marginRight:(index+1)%5==0?0:''}}>
                                        <div className={styles.linkStyle} >
                                            <Link to={'/resource/resourcedetail?type=2&id='+item.id} >
                                                <div className={styles.img} style={{backgroundImage: item.cover_url?'url('+item.cover_url+')':`url(${require('@/assets/test1.jpg')})`}} >
                                                    <div className={styles.type}>{item.file_type}</div>
                                                </div>
                                            </Link>
                                            <div className={styles.btn}>
                                            {
                                                courseInfo.creator_id==user_id?
                                                <div className={styles.isSee}>
                                                    <a onClick={this.showBuilding}><Tooltip placement="bottom" title="发布"><i className={styles.iconRelease} ></i></Tooltip></a>
                                                    <a onClick={this.setUpIsSee.bind(this,false,item.course_res_id,item.is_so)}>
                                                    {
                                                        item.is_so?<Tooltip placement="bottom" title="设置不可见"><i className={styles.iconNotSee} ></i></Tooltip>
                                                        : <Tooltip placement="bottom" title="取消不可见"><i style={{backgroundPosition: '-34px -17px'}} ></i></Tooltip>
                                                    }
                                                    </a>
                                                    {
                                                        item.creator_id==user_id?
                                                        <Link to={`/resource/createlesson?type=1&id=${item.id}`} ><Tooltip placement="bottom" title="编辑"><i className={styles.iconEdit} ></i></Tooltip></Link>:""
                                                    }
                                                    <a onClick={this.showModal.bind(this,`${item.course_res_id}`)}><Tooltip placement="bottom" title="移除"><i className={styles.iconDelete} ></i></Tooltip></a>
                                                </div>
                                                : <div className={styles.isSee}>
                                                    <a onClick={this.showBuilding}><Tooltip placement="bottom" title="发布"><i className={styles.iconRelease} ></i></Tooltip></a>
                                                  </div>
                                            }
                                            </div>
                                        </div>
                                        <Link to={'/resource/resourcedetail?type=2&id='+item.id} >
                                            <div className={styles.word}>
                                            { item.is_boutique==1?<span>精</span>:'' }
                                            { item.is_ecommend==1?<span>荐</span>:'' }
                                            {item.title}
                                            </div>
                                        </Link>
                                        <div className={styles.userInfo}>
                                            <b className={styles.avatar} style={{backgroundImage: 'url('+item.creator_img_url+')'}}></b>
                                            <span className={styles.name}>{item.creator_user_name}</span>
                                            <span className={styles.other}><i className={styles.iconEye}></i>{item.pageviews?item.pageviews>=10000?item.pageviews/10000+"w":item.pageviews : 0}</span>
                                            <span className={styles.other}><i className={styles.iconHalfStar}></i>{item.star_val?item.star_val : 0}</span>
                                        </div>
                                    </li>
                                })
                            }
                        </ul>
                    </div>
                    {/* 搜索课件 */}
                    <div style={{display:searchVisible?'block':'none'}}><SearchMaterial type={2} courseId={courseInfo.id} onChange={this.refreshNum} changStatus={changStatus}/></div>
                </div>
                
                {/************************* 试卷 *****************************/}
                <div style={{display:tabsVisible==3?'block':'none',marginTop:'20px'}}>
                    <div style={{display:listVisible?'block':'none'}}>
                    {
                        courseInfo.creator_id==user_id?
                        <div className={styles.isSee} style={{marginTop:'20px'}}>
                            <a><i className={styles.iconSee} style={{marginLeft:'0'}}></i>一键可见</a>
                            <a><i className={styles.iconNotSee}></i>一键不可见</a>
                        </div>:''
                    }
                        <ul className={styles.detailListStyle}>
                            <li>
                                <div className={styles.testPaper}>
                                    <span>2019-01-01数学期末考试模拟卷</span>
                                    {
                                        courseInfo.creator_id==user_id?
                                        <div className={styles.btn}>
                                            <div className={styles.isSee}>
                                                <a onClick={(e)=>this.handleClick(e)}><i className={styles.iconRelease} title="发布"></i></a>
                                                <a><i className={styles.iconNotSee} title="设置不可见"></i></a>
                                                
                                                    <a><i className={styles.iconEdit} title="编辑"></i></a>
                                                
                                                <a><i className={styles.iconDelete} title="移除"></i></a>
                                            </div>
                                        </div>:''
                                    }
                                </div>
                                <div className={styles.scores}>
                                    <span>主观题15</span>
                                    {/* <span>客观题15</span> */}
                                    <span>总分100</span>
                                </div>
                            </li>
                        </ul>
                    </div>
                    <div style={{display:searchVisible?'block':'none'}}><SearchPaper /></div>
                </div>
                
                {/**************************** 习题 ***********************************/}
                <div className="antd-globals" style={{display:tabsVisible==4?'block':'none'}}>
                    <div className="topicBtn"> 
                        <ul className={styles.topicChoose} >
                            <li><span>来源：</span>
                                <XRadioBtn
                                    option={fromData}
                                    initial="不限"
                                    onChange={this.onFromChange}
                                />
                            </li>
                            <li><span>题型：</span>
                                <XRadioBtn
                                    option={topicTypeData}
                                    initial="不限"
                                    onChange={this.onTopicChange}
                                />
                            </li>
                            <li><span>难度：</span>
                                <XRadioBtn
                                    option={difficultyData}
                                    initial="不限"
                                    onChange={this.onDifficultyChange}
                                />
                            </li>
                        </ul>
                    </div>
                </div>
                
                {/**************************** 优客 *******************************/}
                <div style={{display:tabsVisible==5?'block':'none',marginTop:'20px'}}>
                    <div style={{display:listVisible?'block':'none'}}>
                    {
                        courseInfo.creator_id==user_id?
                        <div className={styles.isSee} style={{marginTop:'20px'}}>
                            <a onClick={this.setUpIsSee.bind(this,true,1,false)} style={{marginLeft:'0'}}><i className={styles.iconSee}></i>一键可见</a>
                            <a onClick={this.setUpIsSee.bind(this,true,1,true)}><i className={styles.iconNotSee}></i>一键不可见</a>
                        </div>:''
                    }
                        <ul className={styles.detailListStyle}>
                            {
                                resourceList.data.map((item,index)=>{
                                    return <li key={index} style={{marginRight:(index+1)%5==0?0:''}}>
                                        <div className={styles.linkStyle} >
                                            <Link to={'/resource/resourcedetail?type=5&id='+item.id} >
                                                <div className={styles.img} style={{backgroundImage: item.cover_url?'url('+item.cover_url+')':`url(${require('@/assets/test1.jpg')})`}} >
                                                    <div className={styles.type}>{item.file_type}</div>
                                                </div>
                                            </Link>
                                            <div className={styles.btn}>
                                            {
                                                courseInfo.creator_id==user_id?
                                                <div className={styles.isSee}>
                                                    <a onClick={this.showBuilding}><Tooltip placement="bottom" title="发布"><i className={styles.iconRelease} ></i></Tooltip></a>
                                                    <a onClick={this.setUpIsSee.bind(this,false,item.course_res_id,item.is_so)}>
                                                    {
                                                        item.is_so?<Tooltip placement="bottom" title="设置不可见"><i className={styles.iconNotSee} ></i></Tooltip>
                                                        : <Tooltip placement="bottom" title="取消不可见"><i style={{backgroundPosition: '-34px -17px'}} ></i></Tooltip>
                                                    }
                                                    </a>
                                                    {
                                                        item.creator_id==user_id?
                                                        <Link to={`/resource/createlesson?type=1&id=${item.id}`} ><Tooltip placement="bottom" title="编辑"><i className={styles.iconEdit} ></i></Tooltip></Link>:""
                                                    }
                                                    <a onClick={this.showModal.bind(this,`${item.course_res_id}`)}><Tooltip placement="bottom" title="移除"><i className={styles.iconDelete} ></i></Tooltip></a>
                                                </div>
                                                : <div className={styles.isSee}>
                                                    <a onClick={this.showBuilding}><Tooltip placement="bottom" title="发布"><i className={styles.iconRelease} ></i></Tooltip></a>
                                                  </div>
                                            }
                                            </div>
                                        </div>
                                        <Link to={'/resource/resourcedetail?type=5&id='+item.id} >
                                            <div className={styles.word}>
                                            { item.is_boutique==1?<span>精</span>:'' }
                                            { item.is_ecommend==1?<span>荐</span>:'' }
                                            {item.title}
                                            </div>
                                        </Link>
                                        <div className={styles.userInfo}>
                                            <b className={styles.avatar} style={{backgroundImage: 'url('+item.creator_img_url+')'}}></b>
                                            <span className={styles.name}>{item.creator_user_name}</span>
                                            <span className={styles.other}><i className={styles.iconEye}></i>{item.pageviews?item.pageviews>=10000?item.pageviews/10000+"w":item.pageviews : 0}</span>
                                            <span className={styles.other}><i className={styles.iconHalfStar}></i>{item.star_val?item.star_val : 0}</span>
                                        </div>
                                    </li>
                                })
                            }
                        </ul>
                    </div>
                    {/* 搜索优课 */}
                    <div style={{display:searchVisible?'block':'none'}}><SearchMaterial type={5} courseId={courseInfo.id} onChange={this.refreshNum} changStatus={changStatus}/></div>
                </div>
                
                {/**************************** 讨论 ********************************/}
                <div style={{display:tabsVisible==6?'block':'none',marginTop:'20px'}}>
                    {
                        courseInfo.creator_id==user_id?
                        <div className={styles.isSee} style={{marginTop:'20px'}}>
                            <a><i className={styles.iconSee} style={{marginLeft:'0'}}></i>一键可见</a>
                            <a><i className={styles.iconNotSee}></i>一键不可见</a>
                        </div>:''
                    }
                    <ul className={styles.detailListStyle}>
                        <li>
                            <div className={styles.testPaper}>
                                <div className={styles.discussTitle}>在《家》描述的是怎样的一个社会现象？</div>
                                <div className={styles.btn}>
                                    <div className={styles.isSee}>
                                        <a><i className={styles.iconRelease} title="发布"></i></a>
                                        {/* <a><i className={styles.iconSee} title="设置可见"></i></a> */}
                                        <a><i className={styles.iconNotSee} title="设置不可见"></i></a>
                                        <a><i className={styles.iconEdit} title="编辑"></i></a>
                                        <a><i className={styles.iconDelete} title="删除"></i></a>
                                    </div>
                                </div>
                            </div>
                            <div className={styles.userInfo}>
                                <b className={styles.avatar}></b>
                                <span className={styles.name}>黄老师</span>
                                {/* 时间信息待定 */}
                                {/* <span className={styles.discussTime}>2018-01-01 17:20</span> */}
                            </div>
                        </li>
                    </ul>
                </div>
              </div>
              
              {/* 习题列表，面板与contentCon同级*/}
              <div className={styles.topicCon} style={{display:tabsVisible==4?'block':'none'}}>
                <div className={styles.topicSearch}>
                    <div><Checkbox >显示答案</Checkbox></div>
                    <div><Checkbox >过滤使用过的试题</Checkbox></div>
                    <div>
                        <Search
                            placeholder="搜索习题"
                            onSearch={value => console.log(value)}
                            style={{ width: 200 }}
                        />
                    </div>
                    <div>共<span>85</span>个结果</div>
                </div>
                <ul className={styles.topics}>
                    <li>
                        <div className={styles.handleTopic}>
                            <div className={styles.num}>201901010001</div>
                            <div className={styles.handle}>
                                <a href="">纠错</a>
                                <a href="">查看答案</a>
                                <a href="">加入试卷</a>
                                <a href="">取消收藏</a>
                            </div>
                        </div>
                        <div className={styles.topicText}>
                            <p>1."小草偷偷从地里冒出来"，下面哪一句描述最接近？（）</p>
                            <div className={styles.answers}>
                                <p>A.春风又绿江南岸</p>
                                <p>B.草色遥看近却无</p>
                                <p>C.浅草才能没马蹄</p>
                                <p>D.风吹草地见牛羊</p>
                            </div>
                        </div>
                        <div className={styles.rightAnswer}>【正确答案】：<span>B</span></div>
                        <div className={styles.parsing}>
                            <p>【解析】："小草偷偷从地里冒出来"描述的是春天的小草似露非露的景象，
                                而B项诗句"草色遥看近却无"描述与其非常形象贴切，嗯对，就是这样。
                                "小草偷偷从地里冒出来"描述的是春天的小草似露非露的景象，
                                而B项诗句"草色遥看近却无"描述与其非常形象贴切，嗯对，就是这样。
                                "小草偷偷从地里冒出来"描述的是春天的小草似露非露的景象，
                                而B项诗句"草色遥看近却无"描述与其非常形象贴切，嗯对，就是这样。
                                "小草偷偷从地里冒出来"描述的是春天的小草似露非露的景象，
                                而B项诗句"草色遥看近却无"描述与其非常形象贴切，嗯对，就是这样。
                            </p>
                        </div>
                        <div className={styles.labels}>
                            <a href="">《春》</a>
                            <a href="">东莞名师推荐</a>
                            <a href="">2019最新</a>
                        </div>
                        <div className={styles.otherInfo}>
                            <span>难度：容易</span>
                            <span>查看（60）</span>
                            <span>做题（60）</span>
                            <span>选题（20）</span>
                            <span>答对率 45%</span>
                        </div>
                    </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        {/* 收藏弹窗 */}
        <Modal
            visible={collectVisible}
            onOk={this.collectOk}
            onCancel={this.handleCancel}
            okText="收藏"
            cancelText="取消"
            style={{textAlign:'center'}}
        >
          <div style={{textAlign:'center'}}>
            <div style={{width:'155px',height:'155px',margin:'0 auto', backgroundImage: `url(${require('@/assets/collect.png')})`}}></div>
            <p>你确定收藏该课程吗？</p>
          </div>
        </Modal>
        {/* 移除资源弹窗 */}
        <Modal
          onCancel={this.handleCancel}
          onOk={this.onRemove}
          visible={removeShow}
          okText="移除"
          cancelText="取消"
        >
          <div style={{textAlign:'center'}}>
            <div style={{width:'155px',height:'155px',margin:'0 auto', backgroundImage: `url(${require('@/assets/remove.png')})`}}></div>
            <p>你确定移除该资源吗？</p>
          </div>
        </Modal>
        {/* 评分弹窗 */}
        <Modal
          onCancel={this.handleCancel}
          onOk={this.starModal}
          visible={starVisiable}
          okText="确定评分"
          cancelText="取消"
          bodyStyle={{height:'200px'}}
        >
          <div style={{textAlign:'center', paddingTop:'50px'}}>
            <div className="antd-globals"><Rate allowHalf style={{width:'150px',fontSize: 22}} value={starVal/2} onChange={this.getStar}/></div>
            <p style={{marginTop:'10px'}}>您选择的评分为{starVal}分，确定评分此课程吗？</p>
          </div>
        </Modal>
        <ZFooter />
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

export default CourseDetail;
