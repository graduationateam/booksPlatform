import React, { Component, Fragment } from 'react';
import { Upload } from 'antd';
import * as PropTypes from 'prop-types';
import { getDto } from '@/utils/dto';
import config from '@/config';

class ZUpload extends Component {
  static propTypes = {
    url: PropTypes.string,
    type: PropTypes.string,
    loading: PropTypes.bool,
    disabled:PropTypes.bool,
  }
  static defaultProps = {
    type: 'image', // 默认上传图片类型， 没有限制传 "any"
    loading: false,
    url: '/testUpload', // 上传接口地址，默认是上传文件的接口
    listType: 'picture',
    showUploadList: false,
    disabled:true
  }

  render() {
    const {
      url,
      type,
      loading,
      onChange,
      data,
      className,
      listType,
      onPreview,
      fileList,
      showUploadList,
    } = this.props;

    // 为了处理没有fileList时，上传异常的情况
    const fileListObj = {};
    if(fileList) {
      fileListObj.fileList = fileList;
    }
    return (
      <Upload
        listType={listType}
        showUploadList={showUploadList}
        headers={getDto('obj')}
        action={`${config.books}${url}`}
        data={{fileKey:'file'}}
        onChange={onChange}
        disabled={loading}
        className={className}
        onPreview={onPreview}
        {...fileListObj}
      >
        {this.props.children}
      </Upload>
    )
  }

}

export default ZUpload;
