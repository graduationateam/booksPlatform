import { Component, Fragment } from 'react';
import Link from 'umi/link';
import * as PropTypes from 'prop-types';
import styles from './index.less';

class ZBadge extends Component{
  static propTypes = {
    count: PropTypes.number,
  }
  static defaultProps = {
    count: 0,
  }
  constructor(props){
    super(props);
    this.state={
    }
  }

  render(){
    const { count } = this.props;

    return (
      <span className={styles.badgeBox}>
        {this.props.children}
        {count ? <b className="badge">{count}</b> : null}
      </span>
    );
  }
}
export default ZBadge;
