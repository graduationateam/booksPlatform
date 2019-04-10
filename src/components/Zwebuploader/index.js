/*eslint-disable*/

import React, { Component } from 'react';
import $ from  'jquery'
class Zwebuploader extends  Component {
    constructor(props){
        super(props);
        console.log(props)
        this.state={
          id:this.props.id?this.props.id:'upload1',              //初始化的webuploader组件ID
          initData:this.props.initData?this.props.initData:[],  //初始化的文件对象 id、resource_url、file_name、file_size、file_type
          many:true,                                            //是否支持多文件上传 默认不支持
          auto:this.props.auto?this.props.auto:true,            //是否开启自动上传   默认开启
          serverUrl:'http://193.112.3.203:8080/sys/ueditor/webuploader', //文件上传的服务器地址  //'http://193.112.3.203:8080/sys/ueditor/webuploader'
          uploader1:this.props.uploader1?this.props.uploader1:null,
        }
      }
    
    //监听 文件上传成功、删除文件事件 
    //返回 文件数据
    onchange = (d) => {
        const { onchange } = this.props;
        if(onchange) {
            onchange(d);
        }
    }
    componentDidMount(){
        if (this.timer) {
            clearTimeout(this.timer);
        }
        var T=this;
        this.timer = setTimeout(() => {
            T.createUploader()
          }, 200);
        
    }
    createUploader=()=>{
        const {id,serverUrl,auto,initData}=this.state;
        let {uploader1}=this.state;
        const {onchange}=this.props;
        var $wrap = $('#'+id),
            // 预览容器
            $queue = $('#filelist1'),
            // 状态栏，包括进度和控制按钮
            $statusBar = $wrap.find( '.statusBar' ),
            // 文件总体选择信息。
            $info = $statusBar.find( '.info' ),
            // 上传按钮
            $upload = $wrap.find( '.uploadBtn' ),
            // 没选择文件之前的内容。
            $placeHolder = $wrap.find( '.placeholder' ),
            $progress = $statusBar.find( '.progress' ).hide(),
            // 添加的文件数量
            fileCount = 0,
            // 添加的文件总大小
            fileSize = 0,
            // 优化retina, 在retina下这个值是2
            ratio = window.devicePixelRatio || 1,
            // 缩略图大小
            thumbnailWidth = 110 * ratio,
            thumbnailHeight = 110 * ratio,

            // 可能有pedding, ready, uploading, confirm, done.
            state = 'pedding',
            // 所有文件的进度信息，key为file id
            percentages = {},
            // 判断浏览器是否支持图片的base64
            isSupportBase64 = ( function() {
                var data = new Image();
                var support = true;
                data.onload = data.onerror = function() {
                    if( this.width != 1 || this.height != 1 ) {
                        support = false;
                    }
                }
                data.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";
                return support;
            } )();

        // 实例化
        uploader1 = WebUploader.create({
            auto: auto,
            pick: {
                id: '#filePicker1',
                label: '上传'
            },
            formData: {
                guid: WebUploader.guid()
            },
            dnd: '#dndArea1',
            paste: '#'+id,
            swf: '../../../public/webuploader/Uploader.swf',
            chunked: true,
            chunkSize: 5 * 1024 * 1024, //每片5M
            threads:1,//上传并发数。允许同时最大上传进程数
            server: serverUrl,
            method:'POST',
            // runtimeOrder: 'flash',

            // accept: {
            //     title: 'Images',
            //     extensions: 'gif,jpg,jpeg,bmp,png',
            //     mimeTypes: 'image/*'
            // },

            // 禁掉全局的拖拽功能。这样不会出现图片拖进页面的时候，把图片打开。
            disableGlobalDnd: true,
            fileNumLimit: 300,
            fileSizeLimit: 5 * 1024 * 1024 * 1024,    // 200 M 
            fileSingleSizeLimit: 5 * 1024 * 1024 * 1024    // 50 M
        });

        // 拖拽时不接受 js, txt 文件。
        uploader1.on( 'dndAccept', function( items ) {
            var denied = false,
                len = items.length,
                i = 0,
                // 修改js类型
                unAllowed = 'text/plain;application/javascript ';

            for ( ; i < len; i++ ) {
                // 如果在列表里面
                if ( ~unAllowed.indexOf( items[ i ].type ) ) {
                    denied = true;
                    break;
                }
            }

            return !denied;
        });

        // 添加“添加文件”的按钮，
        // if(many){
        //     uploader1.addButton({
        //         id: '#filePicker2',
        //         label: '继续添加'
        //     });
        // }
        
        // 添加“添加下一个”模型的按钮，
        /*uploader.addButton({
            id: '#addModel',
            label: '添加下一个'
        });*/
        uploader1.on('ready', function() {
            window.uploader1 = uploader1;
        });

        // 当有文件添加进来时执行，负责view的创建
        function addFile( file ) {
            var $li = $( '<li id="' + file.id + '">' +
                    '<p class="title">' + file.name + '</p>' +
                    '<p class="imgWrap"></p>'+
                    '<p class="progress"><span></span></p>' +
                    '</li>' ),

                $btns = $('<div class="file-panel">' +
                    '<span class="cancel">删除</span>' +
                    '<span class="rotateRight">向右旋转</span>' +
                    '<span class="rotateLeft">向左旋转</span></div>').appendTo( $li ),
                $prgress = $li.find('p.progress span'),
                $wrap = $li.find( 'p.imgWrap' ),
                $info = $('<p class="error"></p>'),

                showError = function( code ) {
                    var text='';
                    switch( code ) {
                        case 'exceed_size':
                            text = '文件大小超出';
                            break;

                        case 'interrupt':
                            text = '上传暂停';
                            break;

                        default:
                            text = '上传失败，请重试';
                            break;
                    }

                    $info.text( text ).appendTo( $li );
                };

            if ( file.getStatus() === 'invalid' ) {
                showError( file.statusText );
            } else {
                // @todo lazyload
                $wrap.text( '预览中' );
                uploader1.makeThumb( file, function( error, src ) {
                    var img;

                    if ( error ) {
                        $wrap.text( '不能预览' );
                        return;
                    }

                    if( isSupportBase64 ) {
                        img = $('<img src="'+src+'">');
                        $wrap.empty().append( img );
                    } 
                }, thumbnailWidth, thumbnailHeight );

                percentages[ file.id ] = [ file.size, 0 ];
                file.rotation = 0;
            }

            file.on('statuschange', function( cur, prev ) {
                if ( prev === 'progress' ) {
                    $prgress.hide().width(0);
                } else if ( prev === 'queued' ) {
                    //$li.off( 'mouseenter mouseleave' );
                    //$btns.remove();
                }

                // 成功
                if ( cur === 'error' || cur === 'invalid' ) {
                    console.log( file.statusText );
                    showError( file.statusText );
                    percentages[ file.id ][ 1 ] = 1;
                } else if ( cur === 'interrupt' ) {
                    showError( 'interrupt' );
                } else if ( cur === 'queued' ) {
                    percentages[ file.id ][ 1 ] = 0;
                } else if ( cur === 'progress' ) {
                    //$info.remove();
                    //$prgress.css('display', 'block');
                } else if ( cur === 'complete' ) {
                    $li.append( '<span class="success"></span>' );
                }

                $li.removeClass( 'state-' + prev ).addClass( 'state-' + cur );
            });

            $li.on( 'mouseenter', function() {
                $btns.stop().animate({height: 30});
            });

            $li.on( 'mouseleave', function() {
                $btns.stop().animate({height: 0});
            });

            $btns.on( 'click', 'span', function() {
                var index = $(this).index(),
                    deg;

                switch ( index ) {
                    case 0:
                    uploader1.removeFile( file );
                        onchange({
                            type:'del',
                            index:index
                        });
                        return;

                    case 1:
                        file.rotation += 90;
                        break;

                    case 2:
                        file.rotation -= 90;
                        break;
                }

                if ( supportTransition ) {
                    deg = 'rotate(' + file.rotation + 'deg)';
                    $wrap.css({
                        '-webkit-transform': deg,
                        '-mos-transform': deg,
                        '-o-transform': deg,
                        'transform': deg
                    });
                } else {
                    $wrap.css( 'filter', 'progid:DXImageTransform.Microsoft.BasicImage(rotation='+ (~~((file.rotation/90)%4 + 4)%4) +')');
                }


            });

            $li.appendTo( $queue );
        }

        // 负责view的销毁
        function removeFile( file ) {
            var $li = $('#'+file.id);

            delete percentages[ file.id ];
            updateTotalProgress();
            $li.off().find('.file-panel').off().end().remove();
        }

        function updateTotalProgress() {
            var loaded = 0,
                total = 0,
                spans = $progress.children(),
                percent;

            $.each( percentages, function( k, v ) {
                total += v[ 0 ];
                loaded += v[ 0 ] * v[ 1 ];
            } );

            percent = total ? loaded / total : 0;


            spans.eq( 0 ).text( Math.round( percent * 100 ) + '%' );
            spans.eq( 1 ).css( 'width', Math.round( percent * 100 ) + '%' );
            updateStatus();
        }

        function updateStatus() {
            var text = '', stats;

            if ( state === 'ready' ) {
                text = '选中' + fileCount + '文件，共' +
                        WebUploader.formatSize( fileSize ) + '。';
            } else if ( state === 'confirm' ) {
                stats = uploader1.getStats();
                if ( stats.uploadFailNum ) {
                    text = '<a class="retry" href="#">重新上传</a>'
                }

            } else {
                stats = uploader1.getStats();
                text="";
                // text = '共' + fileCount + '个（' +
                //         WebUploader.formatSize( fileSize )  +
                //         '），已上传' + stats.successNum + '个';

                // if ( stats.uploadFailNum ) {
                //     text += '，失败' + stats.uploadFailNum + '个';
                // }
            }

            $info.html( text );
        }

        function setState( val ) {
            var file, stats;

            if ( val === state ) {
                return;
            }

            $upload.removeClass( 'state-' + state );
            $upload.addClass( 'state-' + val );
            state = val;

            switch ( state ) {
                case 'pedding':
                    $placeHolder.removeClass( 'element-invisible-many' );
                    $queue.hide();
                    $statusBar.addClass( 'element-invisible' );
                    uploader1.refresh();
                    break;

                case 'ready':
                    $placeHolder.addClass( 'element-invisible-many' );
                    $( '.filePicker2' ).removeClass( 'element-invisible');
                    $queue.show();
                    $statusBar.removeClass('element-invisible');
                    uploader1.refresh();
                    break;

                case 'uploading':
                    $( '.filePicker2' ).addClass( 'element-invisible' );
                    $progress.show();
                    $upload.text( '暂停上传' );
                    break;

                case 'paused':
                    $progress.show();
                    $upload.text( '继续上传' );
                    break;

                case 'confirm':
                    $progress.hide();
                    $( '.filePicker2' ).removeClass( 'element-invisible' );
                    $upload.text( '开始上传' );
                    /*$('#filePicker2 + .uploadBtn').click(function () {
                        window.location.reload();
                    });*/
                    stats = uploader1.getStats();
                    if ( stats.successNum && !stats.uploadFailNum ) {
                        setState( 'finish' );
                        return;
                    } 
                    break;
                case 'finish':
                    stats = uploader1.getStats();
                    if ( stats.successNum ) {
                        console.log();
                        //document.getElementById("shareUrl").style.visibility = 'visible';
                        //createQrcode();
                    } else {
                        // 没有成功的图片，重设
                        state = 'done';
                        location.reload();
                    }
                    break;
            }

            updateStatus();
        }

        uploader1.onUploadProgress = function( file, percentage ) {
            var $li = $('#'+file.id),
                $percent = $li.find('.progress span');

            $percent.css( 'width', percentage * 100 + '%' );
            percentages[ file.id ][ 1 ] = percentage;
            updateTotalProgress();
        };

        uploader1.onFileQueued = function( file ) {
            fileCount++;
            fileSize += file.size;

            if ( fileCount === 1 ) {
                $placeHolder.addClass( 'element-invisible-many' );
                $statusBar.show();
            }

            addFile( file );
            setState( 'ready' );
            updateTotalProgress();
        };

        uploader1.onFileDequeued = function( file ) {
            fileCount--;
            fileSize -= file.size;

            if ( !fileCount ) {
                setState( 'pedding' );
            }

            removeFile( file );
            updateTotalProgress();

        };

        uploader1.on( 'all', function( type ) {
            var stats;
            switch( type ) {
                case 'uploadFinished':
                    setState( 'confirm' );
                    break;

                case 'startUpload':
                    setState( 'uploading' );
                    break;

                case 'stopUpload':
                    setState( 'paused' );
                    break;

            }
        });

        //上传成功的监听
        uploader1.on('uploadSuccess', function (file, response) {
            var img = response; //上传图片的路径
            console.log(img);
            var data={};
            data.resource_url=img.url;
            data.file_type=img.type;
            data.file_size=img.size;
            data.file_name=img.original;
            data.pdf_url=img.pdf_url;

            onchange(data);
        });

        uploader1.onError = function( code ) {
            alert( 'Eroor: ' + code );
        };

        //点击上传按钮
        $upload.on('click', function() {
            if ( $(this).hasClass( 'disabled' ) ) {
                return false;
            }

            if ( state === 'ready' ) {
                uploader1.upload();
            } else if ( state === 'paused' ) {
                uploader1.upload();
            } else if ( state === 'uploading' ) {
                uploader1.stop();
            }
        });

        $info.on( 'click', '.retry', function() {
            uploader1.retry();
        } );

        $info.on( 'click', '.ignore', function() {
           return;
        } );

        $upload.addClass( 'state-' + state );
        updateTotalProgress();

        this.uploader1=uploader1;

        //初始化预览数据
        if(initData.length>0){
            initData.map((item)=>{
                var obj ={};
            obj.name = item.file_name;
            obj.size = item.file_size;
            obj.id = item.id;
            obj.ext = item.file_type;
            var file = new WebUploader.File(obj);
            this.uploader1.addFile(file);
            file.setStatus('complete');
            })
            
        }
    }
    render(){
        let {id} = this.state;
        return (
            <div id={id} className="uploader">
                <div className="queueList">
                    <div id="dndArea1" className="placeholder">
                        <div className="filePicker" id="filePicker1"></div>
                    </div>
                    <ul id="filelist1" className="filelist"></ul>
                </div>
                <div className="statusBar">
                    <div className="progress">
                        <span className="text">0%</span>
                        <span className="percentage"></span>
                    </div><div className="info"></div>
                    {/* <div className="btns">
                        <div className="filePicker2" id="filePicker2"></div>
                        <div className="uploadBtn">开始上传</div>
                    </div> */}
                </div>
            </div>
        );
    }
}
export default Zwebuploader;