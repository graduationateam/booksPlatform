import React, { Component } from 'react';

class Zwebuploadermany extends  Component {

    constructor(props){
        super(props);
        this.state={
        }
    }


    render(){
        return (
            <div id="uploader">
                <div className="queueList">
                    <div id="dndArea" className="placeholder">
                        <div id="filePicker"></div>
                    </div>
                </div>
                <div className="statusBar" style={{display:"none"}}>
                    <div className="progress">
                            <span className="text">0%</span>
                            <span className="percentage"></span>
                    </div><div className="info"></div>
                    <div className="btns">
                        <div id="filePicker2"></div>
                        <div className="uploadBtn">开始上传</div>
                    </div>
                </div>
            </div>
        );
    }
}
export default Zwebuploadermany;








