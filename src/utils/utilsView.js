import {
  Tree,
  Select,
  Icon,
  Popover,
  Input,
  Button,
  Radio,
} from 'antd';
import styles from './utilsView.less';
import { Divider } from 'antd';
const TreeNode = Tree.TreeNode;
const { Option } = Select;
export default class ViewUtils {
  /**
   * 渲染树形 通用
   * @param {Array} data
   * @param {String} name 显示的名称
   * @param {String} childsKey 子集的关键字
   * @param {String} key 索引
   */
  static renderTree(data, name='name', childsKey='childs', key='id', isKnowledge='is_knowledge') {
    return data.map((item) => {
      if (item[childsKey]) {
        return (
          <TreeNode title={item[name]} value={item[key]} key={item[key]} dataRef={item} disabled={item[isKnowledge]==1?false:true}>
            {ViewUtils.renderTree(item[childsKey], name, childsKey, key)}
          </TreeNode>
        );
      }
      return <TreeNode title={item[name]} value={item[key]} key={item[key]} dataRef={item} disabled={item[isKnowledge]==1?false:true}/>;
    });
  }

  static renderTree1(data, name='name', childsKey='childs', key='id') {
    return data.map((item) => {
      if (item[childsKey]) {
        return (
          <TreeNode title={item[name]} value={item[key]} key={item[key]} dataRef={item} >
            {ViewUtils.renderTree1(item[childsKey], name, childsKey, key)}
          </TreeNode>
        );
      }
      return <TreeNode title={item[name]} value={item[key]} key={item[key]} dataRef={item}/>;
    });
  }
  static renderLineTitle = (title) => {
    return (
      <div className={styles.lineTitle}>{title}</div>
    )
  }

  /**
   * 渲染下拉选择项
   * @param {Array} data
   * @param {String} name 显示的名称
   * @param {String} val 值
   * @param {String} key 索引
   */
  static renderSelectOption(data, name='name', val='id', key='id') {
    let datas = !!data? data:[];
    return datas.map((item) => {
      return <Option value={item[val]} key={item[key]} data={item}>{item[name]}</Option>
    })
  }

  /**
   * 渲染单选按钮选择项
   * @param {Array} data
   * @param {String} name 显示的名称
   * @param {String} val 值
   */
  static renderRadioOption(data, style, isCount, name='name', val='id', num='count' ) {
    let datas = !!data? data:[];
    return datas.map((item,index) => {
      return <Radio.Button key={index} style={style} value={item[val]}>{item[name]}{isCount? '（'+item[num]+'）':''}</Radio.Button>
    })
  }


  /**
   * 底部错误数量
   * @param {Object} form
   */
  static getErrorInfo = (form) => {
    const { getFieldsError } = form;
    const errors = getFieldsError();
    const errorCount = Object.keys(errors).filter(key => errors[key]).length;
    if (!errors || errorCount === 0) {
      return null;
    }
    const scrollToField = fieldKey => {
      const labelNode = document.querySelector(`label[for="${fieldKey}"]`);
      if (labelNode) {
        labelNode.scrollIntoView(true);
      }
    };
    const errorList = Object.keys(errors).map(key => {
      if (!errors[key]) {
        return null;
      }
      return (
        <li key={key} className="errorListItem" onClick={() => scrollToField(key)}>
          <Icon type="cross-circle-o" className="errorIcon" />
          <div className="errorMessage">{errors[key][0]}</div>
        </li>
      );
    });
    return (
      <span className="errorListIcon">
        <Popover
          title="表单校验信息"
          content={errorList}
          overlayClassName="errorListPopover"
          trigger="click"
          getPopupContainer={trigger => trigger.parentNode}
        >
          <Icon type="exclamation-circle" />
          {errorCount}
        </Popover>
      </span>
    );
  };
}

