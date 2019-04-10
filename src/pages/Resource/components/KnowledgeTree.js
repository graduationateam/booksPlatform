import React, { Component } from 'react';
import styles from '../resource.less';
import ViewUtils from '@/utils/utilsView';
import { connect } from 'dva';
import { saveDto, getDto } from '@/utils/dto';
import { Radio, Tree, Modal, Form } from 'antd';
import ChooseBook from './ChooseBook';
import XRadioBtn from '@/components/XRadioBtn';
const bookId = getDto('book_id');
const sync_type = getDto('sync_type');
const bookTypeData = [
  {value:1,name:'文学'},
  {value:2,name:'人文'},
  {value:3,name:'经济'},
  {value:4,name:'生活'},
  {value:5,name:'外语'},
  {value:6,name:'科学'},
  {value:7,name:'教育'},
  {value:8,name:'电脑'},
  {value:9,name:'医学'},
  {value:10,name:'儿童'},
];
@connect(({ knowledgetree }) => ({
  knowledgetree
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
      bookType: [],
    }
  }
  static defaultProps = {
    haveBoxShadow: true,
  }
  componentDidMount() {
    this.getBookType()
  }
  // 获取书籍类型
	getBookType = ()=> {
		const { dispatch } = this.props;
		dispatch({
      type: 'book/getBookType',
      payload: {
          method: '/dictionary/getDictionaryItemByDictCode',
					dictCode: 'classification',
      },
      callback:(data)=>{
				this.setState({
					bookType: data,
				})
      }
    });
	}
  ontypeChange = (value)=> {
    const { onChange } = this.props;
    if( onChange ) {
      onChange(value.target.value)
    }
  }
  render() {
    const { haveBoxShadow } = this.props;
    const { bookType } = this.state;
    const radioBtn = {height:'28px', lineHeight:'28px', marginRight:'10px', marginTop:"10px", borderRadius:'3px', border:'0'};
    return (
        <div className={styles.leftCon} style={{boxShadow:haveBoxShadow?'':'0 0 0 #fff'}}>
          {
            <Radio.Group buttonStyle="solid" onChange={this.getTabs} defaultValue="a" onChange={this.ontypeChange}>
              <Radio.Button value="a" style={radioBtn}>不限</Radio.Button>
            {
              bookType.map((item,index)=> {
                return <Radio.Button key={index} value={item.itemValue} style={radioBtn}>{item.itemName}</Radio.Button>
              })
            }
            </Radio.Group>
          }
        </div>
    );
  }
}
export default KnowledgeTree;
