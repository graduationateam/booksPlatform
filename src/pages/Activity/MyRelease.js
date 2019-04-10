import React, { Component } from 'react';
import Link from 'umi/link';
import Zheader from '@/components/Zheader';
import ZFooter from '@/components/ZFooter';
import ZSelect from '@/components/ZSelect';
import styles from './activity.less';
import { Form,DatePicker,Tooltip } from 'antd';
import locale from 'antd/lib/date-picker/locale/zh_CN';
import moment from 'moment';
import 'moment/locale/zh-cn';
import router from 'umi/router';
import { connect } from 'dva';
import util from '@/utils/utils';
moment.locale('zh-cn');
const { RangePicker } = DatePicker;
let queryData={};
const statusData = [{name:'已保存',id:0}, {name:'进行中',id: 1}, {name:'已结束',id: 2}]
@connect(({ activity,itemData }) => ({
  activity,
  itemData
}))
@Form.create()
class MyRelease extends Component {
  constructor(props){
    super(props);
  }
  state = {
    star_date:'',
    end_date:'',
    listData:[]
  }

  componentDidMount() {
    const { dispatch } = this.props;
    this.refreshList();

    //获取数据字段 活动类型
    dispatch({
      type: 'itemData/get',//活动类型
      num: '1010',
      payload:{method:'/sys/item/getInfo'}
    });

  }

  //绑定 活动列表
  refreshList=()=>{
    const { dispatch } = this.props;
    dispatch({
      type:'activity/listRequest',
      payload:{
        method:'/act/actActivity/getListPage',
        star_date:queryData.star_date,
        end_date:queryData.end_date,
        type:queryData.type,
        status:queryData.status
      },
      callback:(d)=>{
        if(d.status!=0){
         return;
        }
        this.setState({
          listData:d.data
        });
      }
    });
  }

  //类型类型 改变事件
  typeChange=(e)=>{
    queryData.type=e;
    this.refreshList();
  }
  //活动状态改变事件
  statusChange=(e)=>{
    queryData.status=e;
    this.refreshList();
  }
  //时间改变事件
  timeChange=(e)=>{
    if(e.length>0){
      queryData.star_date=e[0].format('YYYY-MM-DD');
      queryData.end_date=e[1].format('YYYY-MM-DD');
    }
    this.refreshList();
  }

  //修改
  toEditActivity=(e)=>{
    router.push("/activity/actdesign?id="+e);
  }

  //活动详情页
  actClick=(e)=>{
    router.push("/activity/actdetail?id="+e);
  }

  render() {
    const {form,itemData: { actTypeData }} = this.props;
    const { getFieldDecorator } = form;
    return (
      <div>
        <Zheader addr={3}/>
        <div className={styles.palceCon}>
          <div className="container">
            <Link to=''>扩展活动</Link> / <span>我的活动</span>
          </div>
        </div>
        <div className={styles.moreCon}>
          <div className="container">
            <div className={styles.chooseCon}>
              <ul className={styles.btnList}>
                <li><Link to='/activity/release' style={{color:"#6fc400"}}>我发布的活动</Link></li>
                <li><Link to='/activity/participation'>我参与的活动</Link></li>
                <li><Link to='/activity/myscore'>我参与的评分</Link></li>
              </ul>
            </div>
            <div className={styles.activityCon}>
              <div className={styles.btnCon}>
                {getFieldDecorator('status', {
                  initialValue:queryData.status
                })(
                  <ZSelect
                  placeholder="活动状态"
                  style={{width:'120px',marginRight:'10px'}}
                  data={statusData}
                  onChange={(e)=>this.statusChange(e)}
                  /> 
                )}

                {getFieldDecorator('type', {
                  initialValue:queryData.type
                })(
                  <ZSelect
                  placeholder="活动类型"
                  style={{width:'120px',marginRight:'10px'}}
                  data={actTypeData}
                  onChange={(e)=>this.typeChange(e)}
                  /> 
                )}
                <RangePicker locale={locale} onChange={(e)=>this.timeChange(e)} style={{width:"250px"}} />
                <Link to="/activity/actdesign">发布活动</Link>
              </div>
              <ul className={styles.ListStyle} style={{paddingTop:'0'}}>

                {
                  this.state.listData.map((item,index)=>{
                    return (
                      <li key={item.id}>
                      <div className={styles.linkStyle}>
                        <div onClick={()=>this.actClick(item.id)} className={styles.img} style={{backgroundImage: `url(${item.cover_url||require('@/assets/test1.jpg')})`}}>
                          <div className={styles.type}>
                            { item.status==0? '已保存'
                              :
                              item.status==1? '进行中'
                              :
                              item.status==2? '已完成'
                              :
                              item.status==3? '已终止'
                              :''
                            }
                          </div>
                        </div>
                        <div className={styles.btn}>
                          <div className={styles.isSee}>
                              {
                                item.status==0?
                                <Link to={`/activity/actdesign?id=${item.id}`} ><Tooltip placement="bottom" title="编辑"><i style={{backgroundImage: `url(${require('@/assets/edit.png')})`}}></i></Tooltip></Link>
                                :''
                              }
                              <Link to={`/activity/activitydata?id=${item.id}`} ><Tooltip placement="bottom" title="数据"><i style={{backgroundImage: `url(${require('@/assets/actdata.png')})`}}></i></Tooltip></Link>
                              {/* <a onClick={this.showModal.bind(this,`${item.id}`)}><Tooltip placement="bottom" title="删除"><i className={styles.iconDelete}></i></Tooltip></a> */}
                          </div>
                        </div>
                      </div>
                      <div className={styles.word}>
                        {util.dateDeal(item.act_star_date)} 至 {util.dateDeal(item.act_end_date)}
                      </div>
                      <div className={styles.word}>{item.name}</div>
                      </li>
                    )
                  })
                }
              </ul>
            </div>
          </div>
        </div>
        <ZFooter />
      </div>
    );
  }
}

export default MyRelease;
