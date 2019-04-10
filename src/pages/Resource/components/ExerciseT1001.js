//选择题模块 编号T1001
import React, { Component } from 'react';
import styles from '../resource.less';
import { connect } from 'dva';
import { Form,Radio } from 'antd';
import ZUeditor from '@/components/ZUeditor';
const RadioGroup = Radio.Group;
const auxCode=[{value:"A",label:"A"},{value:"B",label:"B"},{value:"C",label:"C"},{value:"D",label:"D"}];//默认单选题答案选项ABCD
@connect(({ itemData, exercise }) => ({
    itemData,
    exercise
}))
@Form.create()
class ExerciseT1001 extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    //题干值改变事件
	ueditorChange=(e)=>{
		console.log(e)
	}
    render() {
        const { form} = this.props;
        const { getFieldDecorator } = form;

        return (
            <div className={styles.NewExercises}>
            <ul>
                <li>
                    <span className={styles.title}>题干:</span>
                    {/* <TextArea rows={4} style={{width:'400px',height:'100px'}} placeholder="输入题干内容"/> */}
                    {getFieldDecorator('stem', {
                    })(
                        <ZUeditor id="stem" onchange={(e) => { this.ueditorChange(e) }} />
                    )}
                </li>
                <li>
                    <span className={styles.title}>答案:</span>
                    <RadioGroup onChange={this.onChange} options={auxCode}/>
                </li>
                <li>
                    <span className={styles.title}>解析:</span>
                    {getFieldDecorator('analysis', {
                    })(
                        <ZUeditor id="analysis" onchange={(e) => { this.ueditorChange(e) }} />
                    )}
                </li>
            </ul>
            </div>
        )
    }
}
export default ExerciseT1001;


