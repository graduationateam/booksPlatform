import React, { Component, Fragment } from 'react';
import { Select } from 'antd';
import * as PropTypes from 'prop-types';
import ViewUtils from '@/utils/utilsView';

const SelectOption = Select.Option;

class ZSelect extends Component {
  static propTypes = {
    data: PropTypes.array,
    dataKey: PropTypes.string,
    option: PropTypes.array,
    allowClear: PropTypes.bool,
    extra: PropTypes.array,
    placeholder:PropTypes.string
  }
  static defaultProps = {
    option: [], // 下拉项
    placeholder: '请选择',
    dataKey: 'name', // data的key
    mode: '', // 多选
    allowClear: true, // 是否需要清除
    extra: [], // 额外项
  }

  render() {
    const {
      placeholder,
      data,
      option,
      dataKey,
      mode,
      onChange,
      style,
      value,
      allowClear,
      extra,
    } = this.props;
    // 下拉选项
    let optionNode = [];
    if(option.length > 0) {
      option.forEach(item => {
        if(item.value==='disabled'){
          optionNode.push(
            <SelectOption key={item.value} value={item.value} disabled>{item.name}</SelectOption>
          )
        }else{
          optionNode.push(
            <SelectOption key={item.value} value={item.value}>{item.name}</SelectOption>
          )
        }
      });
    }

    // 额外项
    let extraNode = [];
    if(extra.length > 0) {
      extra.forEach(item => {
        extraNode.push(
          <SelectOption key={item.value} value={item.value}>{item.name}</SelectOption>
        )
      });
    }

    return (
      <Select
        allowClear={allowClear}
        showSearch
        optionFilterProp="children"
        placeholder={placeholder}
        onChange={onChange}
        style={style}
        value={value}
        mode={mode === 'multi' ? 'multiple' : mode}
      >
        {extraNode.length > 0 && extraNode}
        {optionNode.length > 0 ?
          optionNode : ViewUtils.renderSelectOption(data, dataKey)
        }
      </Select>
    )
  }

}

export default ZSelect;
