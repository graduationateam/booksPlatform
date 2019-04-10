import { Upload, Icon, Modal } from 'antd';
import React, { Component } from 'react';
import { getDto } from '@/utils/dto';
import config from '@/config';
import * as PropTypes from 'prop-types';

class ZPicturesWall extends Component {

    static propTypes = {
        url: PropTypes.string,
        loading: PropTypes.bool,
        fileList:PropTypes.any,
        previewImage:PropTypes.string
      }
      static defaultProps = {
        loading: false,
        url: '/sys/file/upload', // 上传接口地址，默认是上传文件的接口
        fileList: [],
        previewImage: '',
    }
    render() {
    const {
        loading,
        fileList,
        onChange,
        data,
        url,
      } = this.props;

    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">上传</div>
      </div>
    );
    return (
        <Upload
        headers={getDto('obj')}
        disabled={loading}
        action={`${config.api}${url}`}
        data={{org_id:getDto('org_id'),user_id:getDto('id'),...data}}
        listType="picture-card"
        fileList={fileList}
        onChange={onChange}
      >
        {fileList.length >= 3 ? null : uploadButton}
      </Upload>
    );
  }
}

export default ZPicturesWall;