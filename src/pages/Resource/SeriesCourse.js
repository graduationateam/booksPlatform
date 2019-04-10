import React, { Component } from 'react';
import Link from 'umi/link';
import { Modal, Rate, Icon, Menu, Dropdown, Tooltip, Button } from 'antd';
import { connect } from 'dva';
import { getDto } from '@/utils/dto';
import Zheader from '@/components/Zheader';
import ZFooter from '@/components/ZFooter';
import styles from './resource.less';
@connect(({ course, resource }) => ({
    course, resource
}))
class SeriesCourse extends Component {
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
            courseInfo: {},
            catalogData: [
                {
                  level: 1,
                  name: '第一章:《春晓》意境剖析',
                  preface:'本节要素，做功的两个重要因素 1.作用在物体的的力 2.物体在力的方向...',
                  sort: 0,
                  micro: [
                    {id:1,title:'微课《春晓》意境剖析'}
                  ],
                  paper: [
                    {id:1,title:'试卷《春晓》诗词解析套题'}
                  ],
                  material: [
                    {id:1,title:'素材《春晓》意境剖析'}
                  ],
                  children:[
                      {
                        level: 2,
                        name: '第一节: 重点1，xxxxx',
                        preface:'本节要素，做功的两个重要因素 1.作用在物体的的力 2.物体在力的方向...',
                        sort: 0,
                        micro: [
                            {id:1,title:'微课《春晓》意境剖析'}
                          ],
                          paper: [
                            {id:1,title:'试卷《春晓》诗词解析套题'}
                          ],
                          material: [
                            {id:1,title:'素材《春晓》意境剖析'}
                          ],
                        children:[
                            {
                                level: 3,
                                name: '第一点: 重点1，xxxxx',
                                preface:'本节要素，做功的两个重要因素 1.作用在物体的的力 2.物体在力的方向...',
                                sort: 0,
                                micro: [
                                    {id:1,title:'微课《春晓》意境剖析'}
                                ],
                                paper: [
                                    {id:1,title:'试卷《春晓》诗词解析套题'}
                                ],
                                material: [
                                    {id:1,title:'素材《春晓》意境剖析'}
                                ],
                            }
                        ]
                      }
                  ]
                },
            ],
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
            },
            callback:(data)=>{
                this.setState({
                    catalogData: data.catalogData,
                    courseInfo: data,
                })
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
    onFromChange = (value)=> {
        console.log(value)
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
        const { remove_id } = this.state;
        dispatch({
        type: 'resource/removeResource',
        payload:{
            method: "/res/resSourseExtend/delete" ,
            id: remove_id
        },
        callback:()=>{
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
    showBuilding = ()=> {
        this.setState({
          buildVisible: true,
        })
      }
  render() {
    const user_id = getDto('user_id');
    const { tabsVisible, collectVisible, removeShow, 
        starVisiable, starVal, buildVisible, catalogData, courseInfo } = this.state;
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
    console.log(courseInfo)
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
                        <li><span className={styles.courseType}>专题课程</span></li>
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
                    </div>
                </div>
              </div>
              
              {/* 内容 */}
              <div className={styles.contentCon}>
                {/* {
                    courseInfo.creator_id==user_id?
                    <Dropdown overlay={handFlag}>
                        <button className={styles.moreBtn} >更多操作<Icon type="down" /></button>
                    </Dropdown>:''
                } */}
                <div><span className={styles.courseType}>章节目录</span></div>
                <div className={styles.catalogCon}>
                    {
                        catalogData.map((firstItem,firstIndex)=> {
                        return <div key={firstIndex} className={styles.firstCatalog}>
                            <span className={styles.fName} >{firstItem.name}</span>
                            {/* 一级目录下资源位置 */}
                            {
                                !!firstItem.preface?
                                <div className={styles.catalogResource}>
                                    <span className={styles.catalogSpan} ><div className={styles.preText} dangerouslySetInnerHTML={{ __html: firstItem.preface }}></div></span>
                                </div>:''
                            }
                            {
                                // 微课
                                firstItem.micro?
                                firstItem.micro.map((firstMaItem,firstMaIndex)=>{
                                    return <div key={firstMaIndex} className={styles.catalogResource}>
                                        <div className={styles.catalogSpan} >
                                            <span className={styles.reBlock}>微课</span>
                                            <span className={styles.reName}>{firstMaItem.title}</span>
                                        </div>
                                    </div>
                                }):""
                            }
                            { 
                                // 试卷
                                firstItem.paper?
                                firstItem.paper.map((firstMaItem,firstMaIndex)=>{
                                    return <div key={firstMaIndex} className={styles.catalogResource}>
                                        <div className={styles.catalogSpan} >
                                            <span className={styles.reBlock}>试卷</span>
                                            <span className={styles.reName}>{firstMaItem.title}</span>
                                        </div>
                                    </div>
                                }):""
                            }
                            {
                                firstItem.material?
                                firstItem.material.map((firstMaItem,firstMaIndex)=>{
                                    return <div key={firstMaIndex} className={styles.catalogResource}>
                                        <div className={styles.catalogSpan} >
                                            <span className={styles.reBlock}>课件素材</span>
                                            <span className={styles.reName}>{firstMaItem.title}</span>
                                        </div>
                                    </div>
                                }):""
                            }
                            {/* 二级目录位置 */}
                            {
                            firstItem.children?firstItem.children.map((secondItem,secondIndex)=> {
                                return <div key={secondIndex} className={styles.secondCatalog}>
                                <span>{secondItem.name}</span>
                                {/* 二级目录下资源位置 */}
                                {
                                    !!secondItem.preface?
                                    <div className={styles.catalogResource}>
                                    <span className={styles.catalogSpan} ><div className={styles.preText} dangerouslySetInnerHTML={{ __html: secondItem.preface }}></div></span>
                                    </div>:''
                                }
                                {
                                    // 微课
                                    secondItem.micro?
                                    secondItem.micro.map((secondMaItem,secondMaIndex)=>{
                                    return <div key={secondMaIndex} className={styles.catalogResource}>
                                        <div className={styles.catalogSpan} >
                                            <span className={styles.reBlock}>试卷</span>
                                            <span className={styles.reName}>{secondMaItem.title}</span>
                                        </div>
                                    </div>
                                    }):""
                                }
                                { 
                                    // 试卷
                                    secondItem.paper?
                                    secondItem.paper.map((secondMaItem,secondMaIndex)=>{
                                    return <div key={secondMaIndex} className={styles.catalogResource}>
                                        <div className={styles.catalogSpan} >
                                            <span className={styles.reBlock}>试卷</span>
                                            <span className={styles.reName}>{secondMaItem.title}</span>
                                        </div>
                                    </div>
                                    }):""
                                }
                                {
                                    secondItem.material?
                                    secondItem.material.map((secondMaItem,secondMaIndex)=>{
                                    return <div key={secondMaIndex} className={styles.catalogResource}>
                                        <div className={styles.catalogSpan} >
                                            <span className={styles.reBlock}>课件素材</span>
                                            <span className={styles.reName}>{secondMaItem.title}</span>
                                        </div>
                                    </div>
                                    }):""
                                }
                                {/* 三级目录位置 */}
                                {
                                    secondItem.children?secondItem.children.map((thirdItem,thirdIndex)=>{
                                    return <div key={thirdIndex} className={styles.thirdCatalog}>
                                        <span>{thirdItem.name}</span>
                                        {/* 三级目录下资源位置 */}
                                        {
                                            !!thirdItem.preface?
                                            <div className={styles.catalogResource}>
                                                <span className={styles.catalogSpan} ><div className={styles.preText} dangerouslySetInnerHTML={{ __html: thirdItem.preface }}></div></span>
                                            </div>:''   
                                        }
                                        {
                                            // 微课
                                            thirdItem.micro?
                                            thirdItem.micro.map((thirdMaItem,thirdMaIndex)=>{
                                                return <div key={thirdMaIndex} className={styles.catalogResource}>
                                                    <div className={styles.catalogSpan} >
                                                        <span className={styles.reBlock}>微课</span>
                                                        <span className={styles.reName}>{thirdMaItem.title}</span>
                                                    </div>
                                                </div>
                                            }):""
                                        }
                                        { 
                                            // 试卷
                                            thirdItem.paper?
                                            thirdItem.paper.map((thirdMaItem,thirdMaIndex)=>{
                                                return <div key={thirdMaIndex} className={styles.catalogResource}>
                                                    <div className={styles.catalogSpan} >
                                                        <span className={styles.reBlock}>试卷</span>
                                                        <span className={styles.reName}>{thirdMaItem.title}</span>
                                                    </div>
                                                </div>
                                            }):""
                                        }
                                        {
                                            thirdItem.material?
                                            thirdItem.material.map((thirdMaItem,thirdMaIndex)=>{
                                                return <div key={thirdMaIndex} className={styles.catalogResource}>
                                                    <div className={styles.catalogSpan} >
                                                        <span className={styles.reBlock}>课件素材</span>
                                                        <span className={styles.reName}>{thirdMaItem.title}</span>
                                                    </div>
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
                </div>
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

export default SeriesCourse;
