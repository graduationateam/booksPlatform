import React, { Component } from 'react';

class ZUeditor extends  Component {
  constructor(props){
    super(props);
    this.state={
      id:this.props.id||null,
      ueditor :null,
      style:this.props.style||{}
    }
  }
  

  onchange=(d)=>{
    const { onchange } = this.props;
        if(onchange) {
            onchange(d);
        }
  }

  componentDidMount(){
    let UE = window.UE;
    let {id} = this.state;
    const {onchange,initialContent}=this.props;
    const toolbar=[
      'undo', 'bold', 'indent','italic', 'underline', 'strikethrough', 'subscript','superscript','fontborder',
      'formatmatch', 'selectall','preview','horizontal', 'removeformat', 'date','time', 'inserttitle',
      'fontsize', 'paragraph','insertimage','justifyleft', 'justifyright',
      'justifycenter','justifyjustify', 'forecolor', 'backcolor', 'fullscreen','rowspacingtop', 'rowspacingbottom',
      'imageleft', 'imageright','imagecenter','lineheight','touppercase','tolowercase','spechars'
    ];

    if(id){
      try {
        /*加载之前先执行删除操作，否则如果存在页面切换，
        再切回带编辑器页面重新加载时不刷新无法渲染出编辑器*/
        UE.delEditor(id);
        
      }catch (e) {}
      let  ueditor = UE.getEditor(id, {
        serverUrl: this.props.serverUrl?this.props.serverUrl:'http://193.112.3.203:8080/sys/ueditor/config',
        toolbars: [toolbar],
        initialContent: initialContent||'',
        autoHeightEnabled: false,
        autoFloatEnabled:false,
        elementPathEnabled:false,
        enableContextMenu: false,
        initialFrameWidth: this.props.width?this.props.width:'100%',
        initialFrameHeight: this.props.height?this.props.height:'100%'
      });
      this.setState({ueditor:ueditor});
      //监听 失去焦点事件 返回内容
      ueditor.addListener("blur",function(){
        ueditor.getKfContent(function(){
          var data=ueditor.getContent();
          onchange(data);
        });
      });
    }
  }

  render(){
    let {id,style} = this.state;
    return (
      <div style={style}>
        <textarea id={id} />
      </div>
    );
  }
}

export default ZUeditor;

