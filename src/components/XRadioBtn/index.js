import React, { Component } from 'react';
import Link from 'umi/link';
import { Radio } from 'antd';
import styles from './index.less';
import ViewUtils from '@/utils/utilsView';
import * as PropTypes from 'prop-types';


class XRadioBtn extends Component {
    constructor(props){
        super(props);
        this.state = {
        }
    }
    static propTypes = {
        option: PropTypes.array,
        data: PropTypes.array,
        style: PropTypes.object,
        initial: PropTypes.string,
        isCount: PropTypes.bool,
    }
    static defaultProps = {
        option: [], 
        data: [], // 数据
        style: {},  //默认修改样式
        initial: "", //默认初始选项名称
        isCount: false, //数量统计
        dValue:''
    }
    onChange = (e)=> {
        const { onChange,data} = this.props; //接收到的方法
        if(onChange) {
            for(let i=0;i<data.length;i++){
                if(data[i].id==e.target.value){
                    e.target.name=data[i].name;
                }
            }
            onChange(e.target.value,e); 
        }
    }

    render() {
        /**
         * data为后台数据
         * option为自定义数据
         * style为自定义样式
         * initial为默认按钮，即类似 “不限”，“全部” 等
         * dValue为传过来的默认值
         * isCount是否开启数量统计
         */
        const {data, option, style, initial, isCount, dValue} = this.props;
        // console.log(dValue)
        let initValue;
        // 初始按钮样式
        const radioBtn = {height:'28px', lineHeight:'28px', marginRight:'10px', borderRadius:'3px', border:'0',...style};
        // 按钮选项
        let optionNode = [];
        if(option.length > 0) {
            option.forEach(item => {
              if(item.value==='disabled'){
                optionNode.push(
                  <Radio.Button style={radioBtn} key={item.value} value={item.value} disabled>{item.name}{isCount? '（'+item.count+'）':''}</Radio.Button>
                )
              }else{
                optionNode.push(
                    <Radio.Button style={radioBtn} key={item.value} value={item.value}>{item.name}{isCount? '（'+item.count+'）':''}</Radio.Button>
                )
              }
            });
            // initValue = dValue||!!dValue? dValue: option.length>0? option[0].value:'';
            // initValue = dValue||!!dValue? dValue: data.length>0? data[0].id:'';
        }
          
        return (
            <Radio.Group defaultValue={!!initial?0:dValue} buttonStyle="solid" onChange={this.onChange}>
                {
                    !!initial?<Radio.Button style={radioBtn} value={0}>{initial}</Radio.Button>:''
                } 
                {
                    optionNode.length > 0 ?
                    optionNode : ViewUtils.renderRadioOption(data, radioBtn, isCount)
                }
            </Radio.Group>
        );
    }
}
export default XRadioBtn;