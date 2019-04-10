import React, { Component } from 'react';
import Link from 'umi/link';
import Zheader from '@/components/Zheader';
import ZFooter from '@/components/ZFooter';
import ZBadge from '@/components/ZBadge';
import styles from './index.less';
import utilsView from '@/utils/utilsView';
import { connect } from 'dva';
import { getDto } from '@/utils/dto';
import util from '@/utils/utils';
import router from 'umi/router';

@connect(({ home }) => ({
  home
}))
class HomeDetail extends Component {

  state = {
    infoData:[],//资讯信息
    informationInfoData:[],//相关栏目
  }
  
  componentDidMount() {
    const { dispatch ,location: { query: { id,typeId } }} = this.props;

    //当前资讯 浏览量+1
    dispatch({
      type: 'home/request',
      payload:{
        method:'/sys/information/addBrowseVolume',
        id:id,
        user_id:getDto("user_id")
      }
    });

    //查询当前资讯
    this.getInfo();
    //查询相关资讯
    dispatch({
      type: 'home/listRequest',
      payload:{
        method:'/sys/information/list',
        school_id:getDto("school_id"),
        type_id:typeId
      },
      callback:(d)=>{
        if(d.status!=0){
          return;
        }
        this.setState({
          informationInfoData:d.data
        });
      }
    });
  }
  getInfo=()=>{
    const { dispatch ,location: { query: { id } }} = this.props;
    dispatch({
      type: 'home/request',
      payload:{
        method:'/sys/information/get',
        id:id
      },
      callback:(d)=>{
        if(d.status!=0){
          return;
        }
        this.setState({
          infoData:d.data
        });
        this.getThumbsUP();
      }
    });
  }

  getThumbsUP=()=>{
    const { dispatch ,location: { query: { id } }} = this.props;
    //查询是否已点赞
    dispatch({
      type: 'home/request',
      payload:{
        method:'/sys/information/getThumbsUp',
        user_id:getDto("user_id"),
        information_id:id
      },
      callback:(d)=>{
        if(d.status!=0){
          return;
        }
        var bool=0;
        if(d.data.length>0){
          bool=1;
        }
        var data=this.state.infoData;
        data.is_thumbs_up=bool;
        this.setState({
          infoData:data
        });
      }
    });
  }

  //点赞 
  thumbsUp=()=>{
    const { dispatch ,location: { query: { id } }} = this.props;
    dispatch({
      type: 'home/request',
      payload:{
        method:'/sys/information/thumbsUp',
        information_id:id,
        user_id:getDto("user_id")
      },
      callback:(d)=>{
        if(d.status!=0){
          return;
        }

        this.getInfo();
      }
      //   var data=this.state.infoData;
      //   data.thumbs_up_qty=data.thumbs_up_qty*1+1;
      //   data.is_thumbs_up=1;
      //   this.setState({
      //     infoData:data
      //   });
      // }
    });
  }

  //取消点赞
  thumbsUpRemove=()=>{
    const { dispatch ,location: { query: { id } }} = this.props;
    dispatch({
      type: 'home/request',
      payload:{
        method:'/sys/information/thumbsUpRemove',
        information_id:id,
        user_id:getDto("user_id")
      },
      callback:(d)=>{
        if(d.status!=0){
          return;
        }
        this.getInfo();
        // var data=this.state.infoData;
        // data.thumbs_up_qty=data.thumbs_up_qty*1-1;
        // data.is_thumbs_up=0;
        // this.setState({
        //   infoData:data
        // });
      }
    });
  }

  //跳转详情页
  infoClick=(id,typeId)=>{
    const {location} = this.props;
    router.push("/home/detail?id="+id+"&typeId="+typeId);
  }

  render() {
    const { infoData,informationInfoData } = this.state;
    return (
      <div>
        <Zheader />
        <div className={styles.moreCon}>
          <div className="container">
            <div className={styles.relatedCon}>
              {utilsView.renderLineTitle('相关资讯')}
              <ul className={styles.photoList}>
                {
                  informationInfoData.map((item,index)=>{
                    return (
                      <li key={index} onClick={()=>{this.infoClick(item.id,item.type_id)}} style={{backgroundImage: `url(${item.cover_url||require('@/assets/test1.jpg')})`}}>
                        <div className={styles.word}>{item.title}</div>
                      </li>
                    )
                  })
                }
              </ul>
            </div>
            <div className={styles.articleCon}>
              <div className={styles.article}>
                <div className={styles.title}>{infoData.title}</div>
                <ul className={styles.artInfo}>
                  <li>
                    <div className={styles.userInfo}>
                      <b className={styles.avatar} style={{backgroundImage:`url(${infoData.img_url||require('@/assets/avatar.jpg')})`}}></b>
                      <span className={styles.name}>{infoData.creator_name}</span>
                      <span className={styles.follow}>+关注</span>
                    </div>
                  </li>
                  <li>栏目：{infoData.type_name}</li>
                  <li>浏览：{infoData.browse_volume}</li>
                  <li>发布时间：{util.dateDeal(infoData.create_date)}</li>
                </ul>
                <div className={styles.artText}>
                <div dangerouslySetInnerHTML={{ __html: infoData.content }}></div>
                </div>
                <div className={styles.other}>
                <Link to=''>分享</Link>
                  {infoData.is_thumbs_up==1?
                    <div className={styles.good} style={{backgroundColor:"#6FC400"}} onClick={()=>{this.thumbsUpRemove()}}>
                    <span><i className={styles.hasGood}></i>{infoData.thumbs_up_qty||0}</span>
                    </div>
                    :
                    <div className={styles.good} onClick={()=>{this.thumbsUp()}}>
                    <span><i className={styles.iconGood}></i>{infoData.thumbs_up_qty||0}</span>
                    </div>
                  }
                  
                </div>
              </div>
              <div className={styles.comment}>
                <div>
                  <div className={styles.commentNum}>评论<span> ( 2条 )</span></div>
                  <textarea className={styles.inputText} rows="3" placeholder="请输入评论内容" />
                  <button type="button">发表</button>
                </div>
                <ul className={styles.commentMsg}>
                  <li>
                    <b className={styles.avatar}></b>
                    <div className={styles.msgInfo}>
                      <div>黄老师<span>8-19 13:21</span></div>
                      <div><p>新中国成立后，收回了教育主权，对旧中国遗留下来的各类教育问题进行了彻底的改造。</p></div>
                      <div className={styles.otherIcon}>
                        <span><i className={styles.iconMessage}></i>回复</span>
                        <span><i className={styles.iconGood}></i>195</span>
                      </div>
                    </div>
                  </li>
                  <li>
                    <b className={styles.avatar}></b>
                    <div className={styles.msgInfo}>
                      <div>黄老师<span>8-19 13:21</span></div>
                      <div><p>新中国成立后，收回了教育主权，对旧中国遗留下来的各类教育问题进行了彻底的改造。</p></div>
                      <div className={styles.otherIcon}>
                        <span><i className={styles.iconMessage}></i>回复</span>
                        <span><i className={styles.iconGood}></i>195</span>
                      </div>
                    </div>
                  </li>
                  <li>
                    <b className={styles.avatar}></b>
                    <div className={styles.msgInfo}>
                      <div>黄老师<span>8-19 13:21</span></div>
                      <p>新中国成立后，收回了教育主权，对旧中国遗留下来的各类教育问题进行了彻底的改造。新中国成立后，收回了教育主权，对旧中国遗留下来的各类教育问题进行了彻底的改造。新中国成立后，收回了教育主权，对旧中国遗留下来的各类教育问题进行了彻底的改造。新中国成立后，收回了教育主权，对旧中国遗留下来的各类教育问题进行了彻底的改造。新中国成立后，收回了教育主权，对旧中国遗留下来的各类教育问题进行了彻底的改造。</p>
                      <div className={styles.otherIcon}>
                        <span><i className={styles.iconMessage}></i>回复</span>
                        <span><i className={styles.iconGood}></i>195</span>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <ZFooter />
      </div>
    );
  }
}

export default HomeDetail;
