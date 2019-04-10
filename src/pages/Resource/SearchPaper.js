import React, { Component } from 'react';
import Link from 'umi/link';
import ZSelect from '@/components/ZSelect';
import styles from './resource.less';
import ViewUtils from '@/utils/utilsView';
import Utils from '@/utils/utils';
import XRadioBtn from '@/components/XRadioBtn';
import { Radio, Cascader, Tree, Input, Checkbox } from 'antd';
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');
const Search = Input.Search;
const options = [{
    value: '1',
    label: '初中',
    children: [{
        value: '2',
        label: '二年级',
        children: [{
        value: '3',
        label: '语文',
        }],
    }],
}];
const fromData = [
    {value:1,name:'期末'},
    {value:2,name:'期中'},
    {value:3,name:'月考'},
];
const topicTypeData = [
    {value:1,name:'2014'},
    {value:2,name:'2015'},
    {value:3,name:'2016'},
    {value:4,name:'2017'},
];
const difficultyData = [
    {value:1,name:'容易'},
    {value:2,name:'一般'},
    {value:3,name:'困难'},
]
const selectData = [{name:'是',value: 1}, {name:'否',value: 0}]
// 树形控件测试数据
const chapterData = [
    {
        "id": "02960787-c109-43fd-9b5a-65964521c22c",
        "name": "第一节",
        "book_id": "f843dd24-5e85-4ced-94f3-e09720fc22f7",
        "parent_id": "2ecd6082-6dc2-479c-9bed-3ad8ac385be6",
    },
    {
        "id": "2ecd6082-6dc2-479c-9bed-3ad8ac385be6",
        "name": "第一章",
        "book_id": "f843dd24-5e85-4ced-94f3-e09720fc22f7",
        "parent_id": "f843dd24-5e85-4ced-94f3-e09720fc22f7",
    },
];
// 树形数据整理
const testData = Utils.convertArr(chapterData,"f843dd24-5e85-4ced-94f3-e09720fc22f7");
class SearchPaper extends Component {
  constructor(props){
    super(props);
    this.state = {
    }
  }
  onchange= (value)=> {
    console.log(value);
  }
  // 选择树形
  onTreeSelect = (ids, e) => {
    console.log(ids);
  }
  render() {
    return (
    <div className="container" style={{margin:'-20px 0 0 -20px',backgroundColor:'#fff'}}>
      <div className={styles.clearFixCon}>
        <div className={styles.leftCon}>
            <div className={styles.synchronousTabs}>
                <Radio.Group className="antd-globals" style={{width:"100%"}} defaultValue="1" buttonStyle="solid">
                    <Radio.Button style={{width:"50%"}} value="1">同步</Radio.Button>
                    <Radio.Button style={{width:"50%"}} value="2">非同步</Radio.Button>
                </Radio.Group>
            </div>
            <Cascader options={options} style={{width:"100%"}} placeholder="请选择教材" />
            <div className={styles.catalogCon}>
                <div className={styles.courseNum}>全部课程（215）</div>
                <Tree
                    showLine
                    defaultExpandAll={true}
                    onSelect={this.onTreeSelect}
                >
                    {ViewUtils.renderTree(testData, 'name')}
                </Tree>
            </div>
        </div>
        <div className={styles.courseCon} style={{width: '920px',marginLeft:'0'}}>
            <ul className={styles.topicChoose}>
                <li><span>类型：</span>
                    <XRadioBtn
                        option={fromData}
                        initial="不限"
                        onChange={this.onFromChange}
                    />
                </li>
                <li><span>年份：</span>
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
            <ul className={styles.ListStyle}>
                <li>
                    <div className={styles.testPaper}>
                        <span>2019-01-01数学期末考试模拟卷</span>
                        <div className={styles.btn}>
                            <div className={styles.isSee}>
                                <a><i className={styles.iconRelease} title="发布"></i>添加至课程</a>
                            </div>
                        </div>
                    </div>
                    <div className={styles.scores}>
                        <span>主观题15</span>
                        {/* <span>客观题15</span> */}
                        <span>总分100</span>
                    </div>
                </li>
            </ul>
        </div>
      </div>
    </div>
    );
  }
}
export default SearchPaper;
