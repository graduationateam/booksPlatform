//上传作品第四步 配套微课习题
//作品上传 第一步 作品主表信息
import React, { Component } from 'react';
import Zwebupload from '@/components/Zwebupload';
import styles from '../activity.less';
import { Form, DatePicker, Steps, Input, Button, Icon, Select, Modal, Radio, Tree, message, Table } from 'antd';
import { connect } from 'dva';
import { getDto } from '@/utils/dto';

@connect(({ activity }) => ({
    activity
}))
@Form.create()
class UploadWorkFour extends Component {
    constructor(props) {
        super(props);
        this.state = {
            workBool: false,//记录是否有修改
            data:[],
            columns:[{
                title: '题号',
                dataIndex: 'name',
                align:"center",
                width:'25%',
                fontWeight:'bold',
                render: text => <a href="javascript:;">{text}</a>
              }, {
                title: '类型',
                width:'60%',
                align:"center",
                fontWeight:'bold',
                dataIndex: 'age',
              }, {
                width:'15%',
                title: '操作',
                align:"center"}],
        }
    }
    render() {
        return (
            <ul>
                <li>
                    <span className={styles.title}><b style={{ color: 'red' }}>*</b>配套练习名称：</span>
                    <Input placeholder="输入练习名称" className={styles.name} />
                </li>
                <li>
                    <span className={styles.title}><b style={{ color: 'red' }}>*</b>习题明细：</span>
                    <div>
                        <div style={{ color: '#8cd234', cursor: 'pointer' }} onClick={() => { this.newBuild() }}>+新建习题</div>
                        <div className={styles.table} style={{ width: "1010px" }}>
                            <Table columns={this.state.columns} dataSource={this.state.data} pagination={false} />
                        </div>

                    </div>
                </li>
            </ul>
        )
    }
}
export default UploadWorkFour;



