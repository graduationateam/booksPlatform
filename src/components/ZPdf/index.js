import React from 'react';

class ZPdf extends React.Component {
  constructor() {
    super();
    this.state = {
    }
  }
    render() {
      const {path}=this.props;
      return (
        <iframe 
                  ref="iframe" 
                  allowfullscreen="true"
                  src={"http://193.112.3.203:8880/pdf/web/viewer.html?file="+path}
                  width="100%" 
                  height="100%"
                  scrolling="auto" 
                  frameBorder="0"
              />
      );
    }
  }
  export default ZPdf;