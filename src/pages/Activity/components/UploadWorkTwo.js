//作品上传 第二步 上传主作品
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
class UploadWorkTwo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            workBool: false,//记录是否有修改
        }
    }
    render() {
        return (
            <ul>
                <li>
                    <span>微课：</span>
                    <div>
                        <div style={{ display: 'flex', marginBottom: "20px" }}>
                            <div style={{ display: 'flex', color: '#a7a7a7', fontSize: '12px' }}><b style={{ color: 'red' }}>*</b>微课文件支持格式：MP4等、仅限上传一个。</div>
                        </div>
                        <div style={{ width: '250px' }} className="ZwebuploadStyle">
                            <Zwebupload
                                    id='works_url'
                                    onchange={(d) => { this.webuploaderOnchange(d, 1) }}
                                    //initData={worksFileMain}
                                />
                        </div>
                    </div>
                </li>
            </ul>
        )
    }
}
export default UploadWorkTwo;