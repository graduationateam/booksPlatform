import { Component } from 'react';
import { connect } from 'dva';
import DocumentTitle from 'react-document-title';
import styles from './BasicLayout';

@connect(({ global }) => ({
  global
}))
class BasicLayout extends Component {
  constructor(props){
    super(props);
    this.state={
    }
  }

  componentDidMount() {
    this.getSysParam();
  }

  // 系统参数
  getSysParam = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'global/getSysParam',
      payload: {},
      callback: () => {
      }
    });
  }

  getPageTitle = () => {
    let title = '233书屋';
    return title;
  }

  render(){
    const { children } = this.props;

    return (
      <DocumentTitle title={this.getPageTitle()}>
        {children}
      </DocumentTitle>
    );
  }
}
export default BasicLayout;
