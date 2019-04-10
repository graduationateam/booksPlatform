import React, { Component } from 'react';
import Link from 'umi/link';
import styles from './Login.less';
import { connect } from 'dva';
import { Upload, Icon, Modal, Tree, Menu, Form, Radio } from 'antd';
import "../../../node_modules/video-react/dist/video-react.css";
import {Player} from 'video-react';
import { saveDto, getDto } from '@/utils/dto';
import ZUeditor from '@/components/ZUeditor';
// import Zwebupload from '@/components/Zwebupload';
@connect(({ login}) => ({
  login
}))

class Test extends Component {
  constructor(props){
    super(props);
    this.state = {
    }
  }
  componentDidMount(){
    console.log("执行1")
    this.getTest()
  }
  getTest = ()=> {
    console.log("执行2")
    const { dispatch } = this.props;
    dispatch({
      type: 'login/test',
      payload: {
        method:"/dictionary/toList",
      }
    })
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
