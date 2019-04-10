//新建习题的底部模块
import React, { Component } from 'react';
import styles from '../resource.less';
import { connect } from 'dva';
import { Form,Button,Input } from 'antd';
import ZSelect from '@/components/ZSelect';

@connect(({ itemData, exercise }) => ({
    itemData,
    exercise
}))
@Form.create()
class ExerciseFooter extends Component {
    constructor(props) {
        super(props);
        this.state = {
            style: { height: "28px", padding: '0 12px', lineHeight: "28px", textAlign: "center", fontSize: "14px" }
        }
    }

    componentDidMount() {
        const { dispatch } = this.props;
        //学科核心素养
        dispatch({
            type: 'itemData/get',
            num: '1015',
            payload: { method: '/sys/item/getInfo' }
        });
        //认知能力目标
        dispatch({
            type: 'itemData/get',
            num: '1019',
            payload: { method: '/sys/item/getInfo' }
        });
    }

    render() {
        const { form, itemData: { coreLiteracyData, abilityTargetData } } = this.props;
        const { getFieldDecorator } = form;

        return (
            <div className={styles.NewExercises}>
            <ul>
                <li>
                    <span className={styles.title}>标签：</span>
                    {getFieldDecorator('tag', {
                    })(
                        <ZSelect
                            mode='tags'
                            //onChange={(e)=>this.toolsOnChange('tag',e)} 
                            placeholder="请输入活动标签"
                            style={{ width: '360px', height: "32px" }}
                        />
                    )}
                </li>
                <li>
                    <span className={styles.title}>学科核心素养：</span>
                    {getFieldDecorator('ability_target', {
                    })(
                        <ZSelect data={abilityTargetData}
                            mode='multiple'
                            //onChange={(e)=>this.toolsOnChange('ability_target',e)} 
                            style={{ width: '360px', height: "32px" }}
                        />
                    )}
                </li>
                <li>
                    <span className={styles.title}>认知能力目标：</span>
                    {getFieldDecorator('core_literacy', {
                    })(
                        <ZSelect data={coreLiteracyData}
                            //onChange={(e)=>this.toolsOnChange('ability_target',e)} 
                            style={{ width: '360px' }}
                        />
                    )}
                </li>
                <li>
                    <span className={styles.title}>教材:</span>
                    <span>初中二年级语文</span>
                </li>
                <li>
                    <span className={styles.title}>知识点:</span>
                    <span>初中二年级语文</span>
                </li>
                <li>
                    <span className={styles.title}>解答提示:</span>
                    {getFieldDecorator('answer_tips', {
                    })(
                        <Input placeholder="输入解答提示内容" style={{ width: '360px', height: '32px' }} />
                    )}
                </li>
                <li>
                    <span className={styles.title}>解答微课:</span>
                    <div className={styles.choice}>
                        <Button style={{ width: '120px', height: '32px', borderRadius: '20px' }}>点击选择微课</Button>
                        {/* <img src={require('@/assets/logo.png')} alt="logo" className={styles.choiceimg}/> */}
                    </div>
                </li>
                <li>
                    <span className={styles.title}>举一反三:</span>
                    <div className={styles.choice}>
                        <Button style={{ width: '120px', height: '32px', borderRadius: '20px' }}>点击选择题目</Button>
                        {/* <img src={require('@/assets/logo.png')} alt="logo" className={styles.choiceimg}/> */}
                    </div>
                </li>
            </ul>
            </div>
        )
    }
}
export default ExerciseFooter;