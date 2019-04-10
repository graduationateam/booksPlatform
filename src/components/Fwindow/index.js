import React, { Component } from 'react';
import styles from './index.less';
import 'moment/locale/zh-cn';
import Link from 'umi/link';
import { Carousel } from 'antd';
class Fwindow extends Component {
  constructor(props){
    super(props);
    this.state={
      rightWidth:null,
    }
  }
  // componentWillReceiveProps
  componentWillReceiveProps () {
    var displayWidth = document.body.offsetWidth
    
    var rightWidth = displayWidth < 1200 ? 0 : (displayWidth-1200)/5
    this.setState({rightWidth:rightWidth})
  }
  // toCancelFwindow(){
   
  // }
    render(){
      const { rightWidth  } = this.state;
        return (
          <div>
               {/* 广告 */}
          <div className={styles.Fwindow} style={{right:rightWidth + 'px'}}>
               <div className={styles.container}>
                  <Carousel autoplay className={styles.link} dots={true}>
                    <Link to="/"><img src={require('@/assets/activitybg.jpg')} alt="" className={styles.img}/></Link>
                    <Link to="/"><img src={require('@/assets/test1.jpg')} alt="" className={styles.img}/></Link>
                    <Link to="/"><img src={require('@/assets/activitybg.jpg')} alt="" className={styles.img}/></Link>
                  </Carousel>
                  {/* <img src={require('@/assets/cancel.png')} alt=""  className={styles.cancel} onClick={ this.props.changeBool }/> */}
              </div>
          </div>
          </div>
        );
    };

}
export default Fwindow;

