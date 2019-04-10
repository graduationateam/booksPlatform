//新增习题的头部模块
import React, { Component } from 'react';
import styles from '../resource.less';
import { connect } from 'dva';
import { Form } from 'antd';
import XRadioBtn from '@/components/XRadioBtn';

const eType = [{ id: 1, name: "手工录入" }, { id: 2, name: "拍照上传" }];//录入方式
const roolData = [{ id: 1, name: "仅自己" }, { id: 2, name: "学校" }, { id: 3, name: "区域" }, { id: 4, name: "公开" }];
@connect(({ itemData, exercise }) => ({
    itemData,
    exercise
}))
@Form.create()
class ExerciseTop extends Component {
    constructor(props){
        super(props);
        this.state = {
            style:{height:"28px",padding:'0 12px',lineHeight:"28px",textAlign:"center",fontSize:"14px"}   
        }
    }
    componentDidMount() {
        const { dispatch } = this.props;
        //获取题型数据
        dispatch({
            type: 'itemData/get',
            num: '1017',
            payload: { method: '/sys/item/getInfo' }
        });
        //难易程度
        dispatch({
            type: 'itemData/get',
            num: '1018',
            payload: { method: '/sys/item/getInfo' }
        });
    }

    typeChange=(e,option)=>{
    }
    render() {
        const { form, itemData: { exericseTypeData, difficultyData } } = this.props;
        const { getFieldDecorator } = form;

        return (
            <div className={styles.NewExercises}>
            <ul>
                <li>
                    <span className={styles.title}>录入方式:</span>
                    {getFieldDecorator('mark_type', {
                        initialValue: 1
                    })(
                        <XRadioBtn
                            data={eType}
                            style={this.state.style}
                        />
                    )}
                </li>
                <li>
                    <span className={styles.title}>题型:</span>
                    {getFieldDecorator('type_id', {
                    })(
                        <XRadioBtn
                            data={exericseTypeData}
                            style={this.state.style}
                            onChange={(e,option)=>{this.typeChange(e,option)}}
                        />
                    )}
                </li>
                <li>
                    <span className={styles.title}>权限:</span>
                    {getFieldDecorator('rool', {
                    })(
                        <XRadioBtn
                            data={roolData}
                            style={this.state.style}
                        />
                    )}
                </li>
                <li>
                    <span className={styles.title}>难度:</span>
                    {getFieldDecorator('difficulty_id', {
                    })(
                        <XRadioBtn
                            data={difficultyData}
                            style={this.state.style}
                        />
                    )}
                </li>
            </ul>
            </div>
        )
    }
}
export default ExerciseTop;