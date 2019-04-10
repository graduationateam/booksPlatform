import React, { Component } from 'react';
import styles from '../resource.less';
import { connect } from 'dva';
import { saveDto, getDto } from '@/utils/dto';
import { Form, Radio, Button, Tree } from 'antd';
import ViewUtils from '@/utils/utilsView';
const FormItem = Form.Item;

// 教材选择
// const ChooseBooks = Form.create()(props => {
//   const { form, chapterData, onTreeSelect } = props;
//   return(
    
//   )
// });

@Form.create()
@connect(({ itemData,knowledgetree }) => ({
  itemData,
  knowledgetree
}))
class ChooseKnow extends Component {
  constructor(props){
    super(props);
    this.state = {
      chooseVisiable: false, //教材选择面板
      change: false,
      hasVisible: false,
      treeSelect: '',
      knowledgeName: '',
    }
  }
  handleMouseEnter = ()=> {
    this.setState({
      chooseVisiable: true,
    })
  }
  handleMouseLeave = (e)=> {
    this.setState({
      chooseVisiable: false,
    });
  }
  onTreeSelect = (ids, e) => {
    const { onChange } = this.props; 
    let name = e.node.props.dataRef.name;
    if(ids.length<=0) {
      name = ''
    }
    this.setState({
      treeSelect: ids[0],
      knowledgeName: name
    })
    if( onChange ) {
        onChange(ids[0],name)
    }
    this.handleMouseLeave();
  }
  render() {
    const { chooseVisiable } = this.state;
    const { chapterData, Name } = this.props; 
    // 给教材选择传递参数方法
    const chooseMethods = {
      chapterData,
      onTreeSelect: this.onTreeSelect,
    }
    
    return (
        <div>
            <div className={styles.chooseBook} onMouseEnter={this.handleMouseEnter.bind(this)} onMouseLeave={this.handleMouseLeave.bind(this)}>
                <a>{Name}</a>
                <div 
                    className={chooseVisiable?styles.bookChooseCon:styles.bookChooseHidden} 
                    onMouseEnter={this.handleMouseEnter.bind(this)}
                    onMouseLeave={this.handleMouseLeave.bind(this)}
                    style={{width:'300px'}}
                >
                    <div className={styles.booksCon} >
                      <Tree
                        showLine
                        defaultExpandAll={true}
                        onSelect={this.onTreeSelect}
                      >
                        {ViewUtils.renderTree(chapterData, 'name')}
                      </Tree>
                    </div>
                </div>
            </div>
        </div>

    );
  }
}
export default ChooseKnow;
