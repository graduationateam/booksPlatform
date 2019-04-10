import React, { Component } from 'react';
import styles from '../resource.less';
import ViewUtils from '@/utils/utilsView';
import { connect } from 'dva';
import { saveDto, getDto } from '@/utils/dto';
import { Radio, Tree, Modal, Form } from 'antd';
import ChooseBook from './ChooseBook';

const bookId = getDto('book_id');
const sync_type = getDto('sync_type');
@connect(({ global }) => ({
  global
}))

class KnowledgeTree extends Component {
  constructor(props){
    super(props);
    this.state = {
      visible: false,
      bookData:'',
      chapterData:'',
      test: sync_type,
      syncType: bookId&&sync_type?sync_type:"1",
      syncData: {}, //同步数据
      asyncData: {}, //异步数据
      syncChapterData: [], //同步树形数据
      asyncChapterData: [], //异步树形数据
      change: false,
    }
  }
  static defaultProps = {
    synchronous: true,
    haveBoxShadow: true,
  }
  getBookData = (bookData,chapterData,flag)=> {
    const { syncType } = this.state;
    // console.log(bookData)
    // console.log(syncType)
    // console.log(flag)
    if(bookData.type=="1") {
      this.setState({
        syncData:bookData,
        syncChapterData: chapterData,
        syncType: flag?syncType:'1',
      });
    }else if(bookData.type=="2") {
      this.setState({
        asyncData:bookData,
        asyncChapterData: chapterData,
        syncType: flag?syncType:'2',
      });
    }
    this.getAllCourse(bookData.id?bookData.id:"a");
  }
  getAllCourse = (bookId)=> {
    const { onChange } = this.props;
    if(!!bookId) {
      if(onChange) {
        onChange(bookId,false)
      }
    }
  }
  // 选择树形后获取课程
  onTreeSelect = (ids, e) => {
    const { onChange } = this.props;
    // saveDto("knowledgeName",ids[0],ids.expires_in);
    if(ids.length>0) {
      if(e.node.props.dataRef.is_knowledge==1) {
        saveDto("knowledge_id",ids[0],"2592000");
        saveDto("knowledgeName",e.node.props.dataRef.name,"2592000");
        if(onChange) {
          onChange(false,ids[0])
        }
      }
    }else {
      if(onChange) {
        onChange(e.node.props.dataRef.book_id,false)
      }
    }
  }
  changeSyncValue = (e)=> {
    this.setState({
      syncType: e.target.value,
      change: !this.state.change
    })
  }
  render() {
    const { synchronous, haveBoxShadow } = this.props;
    const { syncType, asyncChapterData, syncChapterData, change, test } = this.state;
    // console.log(syncType)
    return (
        <div className={styles.leftCon} style={{boxShadow:haveBoxShadow?'':'0 0 0 #fff'}}>
            <div className={styles.synchronousTabs}>
            {
                synchronous?
                <Radio.Group className="antd-globals" style={{width:"100%"}} value={syncType} buttonStyle="solid" onChange={this.changeSyncValue}>
                    <Radio.Button style={{width:"50%"}} value="1">同步</Radio.Button>
                    <Radio.Button style={{width:"50%"}} value="2">非同步</Radio.Button>
                </Radio.Group>
                :<Radio.Group className="antd-globals" style={{width:"100%"}} defaultValue="0" buttonStyle="solid">
                    <Radio.Button style={{width:"100%"}} value="2">非同步</Radio.Button>
                </Radio.Group>
            }
            </div>
            {/* 选择同步教材组件 */}
            {
              synchronous?
              <ChooseBook onChange={this.getBookData} syncType={syncType} change={change}/>
              :<ChooseBook onChange={this.getBookData} syncType="2"/>
            }
            {
              (syncType=="1"&&syncChapterData.length>0) || (syncType=="2"&&asyncChapterData.length>0)?
              <div className={styles.catalogCon}>
                {/* <div className={styles.courseNum} onClick={this.getAllCourse.bind(this,bookData.id)}>全部课程</div> */}
                <div className={styles.courseNum} >全部课程</div>
                <Tree
                  showLine
                  defaultExpandAll={true}
                  onSelect={this.onTreeSelect}
                >
                  {ViewUtils.renderTree(syncType=="1"?syncChapterData:asyncChapterData, 'name')}
                </Tree>
              </div>
              :''
            }
            
        </div>
    );
  }
}
export default KnowledgeTree;
