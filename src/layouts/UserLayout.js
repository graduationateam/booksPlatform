import react, { Component } from 'react';
import { connect } from 'dva';
import DocumentTitle from 'react-document-title';
import styles from './UserLayout';

@connect(({ global }) => ({
  global
}))
class UserLayout extends Component {
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
    const { global: { sysParam } } = this.props;
    if(!(sysParam && sysParam.SYS_NAME)) {
      dispatch({
        type: 'global/getSysParam',
        payload: {}
      });
    }
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
export default UserLayout;
