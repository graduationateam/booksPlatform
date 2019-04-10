import React, { Component } from 'react';
import Link from 'umi/link';
import { connect } from 'dva';
import Zheader from '@/components/Zheader';
import ZFooter from '@/components/ZFooter';
import styles from './resource.less';
import { Input, Button, Form, Row, Col, Modal, Tree, Radio, message } from 'antd';
import ZUeditor from '@/components/ZUeditor';
import ResourceMenu from './components/ResourceMenu';
import creatHistory from 'history/createBrowserHistory' 
import ViewUtils from '@/utils/utilsView';
import { getDto } from '@/utils/dto';
import moment from 'moment';
import 'moment/locale/zh-cn';
const history = creatHistory();
moment.locale('zh-cn');
const FormItem = Form.Item;
message.config({
  top: 200,
});
@connect(({ course }) => ({
  course
}))
class Test extends Component {
  constructor(props){
    super(props);
    this.state = {
      chapterData: [],
      visible: false,
      treeSelect: '',
      knowledgeName: '',
      isPrevent: false, //防止多次点击提交
      isModify: false, //是否为修改
      courseInfo: '', //存放课程信息
      prefaceData: '' //富文本框的值
    }
  }
  render() {
    return (
      <div>
          111
      </div>
    );
  }
}
export default Test;
