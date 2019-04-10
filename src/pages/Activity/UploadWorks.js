import React, { Component } from 'react';
import Link from 'umi/link';
import XRadioBtn from '@/components/XRadioBtn';
import Zheader from '@/components/Zheader';
import ZFooter from '@/components/ZFooter';
import ZSelect from '@/components/ZSelect';
import ZUpload from '@/components/ZUpload';
import Zwebupload from '@/components/Zwebupload';
import Zwebuploader from '@/components/Zwebuploader';
import ChooseBook from '@/pages/Resource/components/ChooseBook';
import ChooseKnow from '@/pages/Resource/components/ChooseKnow';
import styles from './activity.less';
import { Form, DatePicker, Steps, Input, Button, Icon, Select, Modal, Radio, Tree, message, Table } from 'antd';
import locale from 'antd/lib/date-picker/locale/zh_CN';
import moment from 'moment';
import { connect } from 'dva';
import router from 'umi/router';
import 'moment/locale/zh-cn';
import ViewUtils from '@/utils/utilsView';
import { getDto } from '@/utils/dto';
import Utils from '@/utils/utils';
moment.locale('zh-cn');

const { RangePicker } = DatePicker;
const Step = Steps.Step;
const { TextArea } = Input;
const Option = Select.Option;
const RadioGroup = Radio.Group;
const FormItem = Form.Item;
const Data1 = [{ name: '已保存', value: 1 }, { name: '进行中', value: 2 }, { name: '已结束', value: 3 }]
const Data2 = [{ name: '教研交流', value: 1 }]
//选项按钮
const courseTypeData = [
  { value: 1, name: '仅自己' },
  { value: 2, name: '本校' },
  { value: 3, name: '公开' },
  { value: 4, name: '区域' },
  { value: 5, name: '仅自己' },
  { value: 6, name: '本校' },
  { value: 7, name: '公开' },
  { value: 8, name: '区域' },
  { value: 5, name: '仅自己' },
  { value: 6, name: '本校' },
  { value: 7, name: '公开' },
  { value: 8, name: '区域' },
]

@connect(({ activity }) => ({
  activity
}))
@Form.create()
class UploadWorks extends Component {
  constructor(props) {
    super(props);
    this.state = {
      current: 0,//当前显示的位置 页签
      workBool: false,//记录是否有修改
      bool: false,
      uploadLoading: false,//上传图片 load
      workData: [],//作品主表信息
      worksFileMain:null,//主作品信息
      worksFileNoMain:null,//作品附件信息
      knowledgeName: '',
      chapterData: [],

      columns: [{
        title: '题号',
        dataIndex: 'name',
        align: "center",
        width: '25%',
        fontWeight: 'bold',
        render: text => <a href="javascript:;">{text}</a>
      }, {
        title: '类型',
        width: '60%',
        align: "center",
        fontWeight: 'bold',
        dataIndex: 'age',
      }, {
        width: '15%',
        title: '操作',
        align: "center"
      }],
      data: []

    }
  }
  onchange = (value) => {
    console.log(value);
  }
  //下一步
  toStep = (value) => {
    this.setState({
      current: value
    })
  }
  //上一步
  backStep = (value) => {
    this.setState({
      current: value
    })
  }
  //新建习题弹窗
  newBuild = () => {
    this.setState({ bool: true })
  }
  onChange = (e) => {
    console.log('radiochecked', e.target.value);
    this.setState({
      value: e.target.value,
      val: 1,
      style: { height: "28px", padding: '0 12px', lineHeight: "28px", textAlign: "center" }
    });
  }
  //取消弹窗按钮
  cancelModal = () => {
    this.setState({ bool: false })
  }
  /************************通用**************************/
  componentDidMount() {
    const { dispatch, location: { query: { actID,id } } } = this.props;
    document.title = "作品上传"
    if(id){
      this.getworkInfo();
      this.getWorkDtl();
    }
    
  }

  //查询 作品主表信息
  getworkInfo = () => {
    const { dispatch, location: { query: { actID,id } } } = this.props;
    dispatch({
      type: 'activity/request',
      payload: {
        method: '/act/actWork/get',
        id: id,
      },
      callback: (d) => {
        if (d.status != 0) {
          message.error(d.msg);
          return;
        }
        this.setState({
          workData: d.data || {},
        });
      }
    })
  }

  //查询 作品素材表信息
  getWorkDtl = () => {
    const { dispatch,location: { query: { actID,id } }} = this.props;
    dispatch({
      type: 'activity/request',
      payload: {
        method: '/act/actWork/getAllDtl',
        work_id: id,
      },
      callback: (d) => {
        if (d.status != 0) {
          message.error(d.msg);
          return;
        }
        var data = d.data;
        var worksFileMainT = {};
        var worksFileNoMainT = [];
        data.map((item, index) => {
          if (item.is_main == 1) {
            worksFileMainT = item;
          }
          if (item.type == 2) {
            worksFileNoMainT.push(item);
          }
        });

        this.setState({
          worksFileMain: worksFileMainT,
          worksFileNoMain: worksFileNoMainT
        });
      }
    });

  }

  //通用 onchange事件 用于把 页面的填入的值
  toolsOnChange = (key, value, type) => {
    var data = this.state.workData;
    if (!type) {
      data[key] = value;
    }
    this.setState({
      workData: data,
      workBool: true
    });
  }
  //关闭弹窗
  hiddenModal = (key) => {
    this.setState({
      [key]: false
    });
  }

  //退出
  toExit = () => {
    const { location: { query: { actID } } } = this.props;
    router.push("/activity/actdetail?id=" + actID);
  }

  //图片上传
  handleUploadChange = (info) => {
    if (info.file.status === 'uploading') {
      this.setState({ uploadLoading: true });
      return;
    }
    if (info.file.status === 'done') {
      const res = info.file.response;
      if (res.status != '0') {
        message.error(res.msg);
        this.setState({ uploadLoading: false });
        return
      }

      var temData = this.state.workData;
      temData.cover_url = res.data.path;
      this.setState({
        workData: temData,
        uploadLoading: false,
        workBool: true
      })
    }
  }

  //上传文件
  webuploaderOnchange = (d, is_main) => {
    console.log(d)
    console.log(is_main)
    const { dispatch } = this.props;
    if (is_main == 1) {
      var worksFileMainT = this.state.worksFileMain;
      worksFileMainT.resource_url = d.resource_url || '';
      worksFileMainT.pdf_url = d.pdf_url || '';
      worksFileMainT.file_size = d.file_size || '';
      worksFileMainT.file_name = d.file_name || '';
      worksFileMainT.file_type = d.file_type || '';
      this.setState({
        worksFileMain: worksFileMainT,
        workBool: true
      });
    }
    if (is_main == 0) {
      var worksFileNoMainT = this.state.worksFileNoMain;
      if (d.type == "del") {
        worksFileNoMainT[d.index].resource_url = "";
      } else {
        worksFileNoMainT.push({
          resource_url: d.resource_url || '',
          pdf_url: d.pdf_url || '',
          file_size: d.file_size || '',
          file_name: d.file_name || '',
          file_type: d.file_type || '',
        });
      }
      this.setState({
        worksFileNoMain: worksFileNoMainT,
        workBool: true
      });
    }
  }

  //保存作品主表
  toSavewor = (status, _index) => {
    const { dispatch, location: { query: { actID } } } = this.props;
    const { workData, workBool } = this.state;

    //判断 值是否有改变
    if (!workBool) {//值没有改变 
      //判断是否有作品名称
      if (!workData.works_name) {
        message.info("请填写作品名称!");
        return;
      }
      if (!_index) {
        return;
      }
      this.setState({
        current: _index
      });
    } else {//值有改变
      //判断是否有作品名称
      if (!workData.works_name) {
        message.info("请填写作品名称!");
        return;
      }
      dispatch({
        type: 'activity/request',
        payload: {
          method: '/act/actWork/save',
          status: status,
          activity_id: actID,
          creator_id: getDto("user_id"),
          ...workData
        },
        callback: (d) => {
          if (d.status != 0) {
            message.error(d.msg);
            return;
          }
          this.getworkInfo();
          message.success("保存成功!");
          this.setState({
            workBool: false
          });
          if (_index) {
            this.setState({
              current: _index
            });
          }
        }
      })
    }
  }

  //保存作品素材表
  toSaveworFile = (is_main, _index) => {
    const { dispatch } = this.props;
    const { workData, workBool, worksFileMain, worksFileNoMain } = this.state;
    if (!workBool) {//值没有改变 
      //判断是否有作品名称
      if (!worksFileMain.resource_url) {
        message.info("请上传作品!");
        return;
      }
      if (!_index) {
        return;
      }
      this.setState({
        current: _index
      });
    } else {
      var data = [];
      if (is_main) {//主作品保存/下一步 按钮
        //如果不存在作品且 非删除 则提示先上传作品
        if (!worksFileMain.id && !worksFileMain.resource_url) {
          message.info("未检测到作品,请先上传.");
          return;
        }
        data.push(worksFileMain);
      } else {
        if (worksFileNoMain.length > 0) {
          worksFileNoMain.map((item, index) => {
            if (item.id || item.resource_url) {
              data.push(item);
            }
          });
        } else {
          if (_index) {
            this.setState({
              current: _index
            });
          }
          return;
        }
      }
      //提交数据
      dispatch({
        type: 'activity/request',
        payload: {
          method: '/act/actWork/saveDtl',
          work_id: workData.id,
          is_main: is_main,
          type: is_main == 1 ? 1 : 2,
          data: data
        },
        callback: (d) => {
          if (d.status != 0) {
            message.error(d.msg);
            return;
          }
          message.success("保存成功!");
          this.getWorkDtl();
          this.setState({
            workBool: false
          });
          if (_index) {
            this.setState({
              current: _index
            });
          }
        }
      });
    }
  }

  //提交作品
  submitWork = () => {
    const { dispatch } = this.props;
    const { workData } = this.state;

    dispatch({
      type: 'activity/request',
      payload: {
        method: '/act/actWork/submitWork',
        id: workData.id
      },
      callback: (d) => {
        if (d.status != 0) {
          message.error(d.msg);
          return;
        }
        this.setState({
          current: 4
        });
      }
    });
  }

  getBookData = (bookData, chapterData) => {
    const knowledge_id = getDto('knowledge_id');
    const knowledgeName = getDto('knowledgeName');
    this.setState({
      chapterData: chapterData,
      treeSelect: knowledge_id ? knowledge_id : '',
      knowledgeName: knowledgeName ? knowledgeName : '',
    })
  }
  theKnowledge = (value, name) => {
    this.setState({
      treeSelect: value,
      knowledgeName: name
    })
  }

  render() {
    const { current, uploadLoading, workData, worksFileMain, worksFileNoMain, knowledgeName, chapterData } = this.state
    
    const { form,location: { query: { actID,id } } } = this.props
    const fileList = [];
    const radioStyle = {
      display: 'block',
      height: '30px',
      lineHeight: '30px',
    };
    const props2 = {
      action: '//jsonplaceholder.typicode.com/posts/',
      listType: 'picture',
      defaultFileList: [...fileList],
      className: 'upload-list-inline',
    };
    function handleChange(value) {
      console.log(`selected ${value}`);
    }
    //回车标签tagsChange
    const children = [];

    for (let i = 10; i < 36; i++) {
      children.push(<Option key={i.toString(36) + i}>{i.toString(36) + i}</Option>);
    }
    return (
      <div>
        <Zheader addr={3} />
        <div className={"container"}>
          <div className={styles.UploadWorks}>
            <div className={styles.stepContainer}>
              <Steps current={current} className={styles.steps} labelPlacement='vertical'>
                <Step description="填写作品信息" />
                <Step description="上传微课" />
                <Step description="上传课件/素材" />
                <Step description="添加配套练习" />
                <Step description="上传作品成功" />
              </Steps>
            </div>
            {/* {step1} */}
            <div style={{ display: current == 0 ? 'block' : 'none' }} className={styles.step1}>
              <Form>
                <FormItem labelCol={{ span: 2 }} wrapperCol={{ span: 17 }} label="作品名称">
                  {form.getFieldDecorator('works_name', {
                    initialValue: workData.works_name || ''
                  })(
                    <Input placeholder="输入作品名称" style={{ width: "500px" }} onChange={(e) => { this.toolsOnChange('works_name', e.target.value) }} />
                  )}
                </FormItem>
                <FormItem labelCol={{ span: 2 }} wrapperCol={{ span: 17 }} label="作品简介">
                  {form.getFieldDecorator('remark', {
                    initialValue: workData.remark || ''
                  })(
                    <TextArea placeholder="输入作品简介" style={{ width: "500px" }} onChange={(e) => { this.toolsOnChange('remark', e.target.value) }} />
                  )}
                </FormItem>
                <FormItem labelCol={{ span: 2 }} wrapperCol={{ span: 17 }} label="封面图">
                  {form.getFieldDecorator('cover_url', {
                    initialValue: workData.cover_url || ''
                  })(
                    <div>
                      <div className={styles.attention} style={{color:"#B3B3B3"}}><b style={{ color: 'red' }}>*</b>建议图片大小：200*150px</div>
                      <ZUpload
                        onChange={(e) => this.handleUploadChange(e)}
                        loading={uploadLoading}
                        className='avatar-uploader'
                        listType='picture-card'
                      >
                        {workData.cover_url ?
                          <img src={workData.cover_url} style={{ width: 100 }} /> :
                          <div>
                            <Icon type={uploadLoading ? 'loading' : 'plus'} />
                            <div className="ant-upload-text">上传</div>
                          </div>
                        }
                      </ZUpload>
                    </div>
                  )}
                </FormItem>
                <FormItem labelCol={{ span: 2 }} wrapperCol={{ span: 17 }} label="教材">
                  {form.getFieldDecorator('book_id', {
                  })(
                    <ChooseBook onChange={this.getBookData} isChooseSync={true} />
                  )}
                </FormItem>
                <FormItem labelCol={{ span: 2 }} wrapperCol={{ span: 17 }} label="知识点">
                  {form.getFieldDecorator('knowledge_id', {
                  })(
                    <div>
                      <ChooseKnow  chapterData={chapterData} onChange={this.theKnowledge} Name={knowledgeName? knowledgeName+' >>' : '请选择知识节点 >>'}/>
                      <div className={styles.attention} style={{color:"#B3B3B3"}}><b style={{ color: 'red' }}>*</b>微课、习题、课件/素材上传到该知识点下</div>
                    </div>
                  )}
                </FormItem>

                <div style={{marginLeft:"95px"}}>
                  <Button className={styles.toSave}>保存</Button>
                  <Button className={styles.nextStep} onClick={() => { this.toSavewor(1, 1) }}>下一步</Button>
                  <Button className={styles.comeBack}>返回</Button>
                </div>
                
              </Form>
            </div>
            {/* {step2} */}
            <div style={{ display: current == 1 ? 'block' : 'none' }} className={styles.step2}>
            <Form>
              <FormItem labelCol={{ span: 2 }} wrapperCol={{ span: 17 }} label="微课上传">
                  {form.getFieldDecorator('works_urls', {
                  })(
                    <div>
                      <div style={{ display: 'flex', color: '#B3B3B3', fontSize: '12px' }}><b style={{ color: 'red' }}>*</b>微课文件支持格式：MP4等、仅限上传一个</div>
                      {
                        id?
                        worksFileMain!=null?
                        <Zwebupload
                        id='works_url'
                        onchange={(d) => { this.webuploaderOnchange(d, 1) }}
                        initData={worksFileMain}
                        />
                        :''
                        :<Zwebupload
                        id='works_url'
                        onchange={(d) => { this.webuploaderOnchange(d, 1) }}
                        />
                      }
                      
                    </div>
                  )}
              </FormItem>
              <div style={{marginLeft:"95px"}}>
                  <Button className={styles.toSave} onClick={() => { this.toSaveworFile(1) }}>保存</Button>
                  <Button className={styles.nextStep} onClick={() => { this.toSaveworFile(1, 2) }}>下一步</Button>
                  <Button className={styles.comeBack} onClick={this.backStep.bind(this, 0)}>上一步</Button>
              </div>
            </Form>
            </div>

            {/* {step3} */}
            <div style={{ display: current == 2 ? 'block' : 'none' }} className={styles.step3}>
              <Form>
                <FormItem labelCol={{ span: 2 }} wrapperCol={{ span: 17 }} label="课件/素材上传">
                  {form.getFieldDecorator('work_files', {
                  })(
                    <div>
                      <div style={{ display: 'flex', color: '#B3B3B3', fontSize: '12px' }}><b style={{ color: 'red' }}>*(非必须)</b>课件/素材支持格式：pdf、doc、ppt等,可上传多个</div>
                      {
                        id?
                        worksFileNoMain!=null?
                        <Zwebuploader
                        id='works_filel'
                        onchange={(d) => { this.webuploaderOnchange(d, 0) }}
                        initData={worksFileNoMain}
                        />
                        :''
                        :<Zwebuploader
                        id='works_filel'
                        onchange={(d) => { this.webuploaderOnchange(d, 0) }}
                        />
                      }
                    </div>
                  )}
                </FormItem>
                <div style={{marginLeft:"95px"}}>
                  <Button className={styles.toSave} onClick={() => { this.toSaveworFile(0) }}>保存</Button>
                  <Button className={styles.nextStep} onClick={() => { this.toSaveworFile(0, 3) }}>下一步</Button>
                  <Button className={styles.comeBack} onClick={this.backStep.bind(this, 1)}>上一步</Button>
                </div>
              </Form>
            </div>

            {/* {step4} */}
            <div style={{ display: current == 3 ? 'block' : 'none' }} className={styles.step4}>
            <Form>
              <FormItem labelCol={{ span: 2 }} wrapperCol={{ span: 17 }} label="练习名称">
                {form.getFieldDecorator('file_name', {
                  initialValue: workData.file_name || ''
                })(
                  <Input placeholder="输入练习名称" className={styles.name} />
                )}
              </FormItem>
              <FormItem labelCol={{ span: 2 }} wrapperCol={{ span: 17 }} label="习题明细">
                {form.getFieldDecorator('files', {
                })(
                  <div>
                    <div style={{ color: '#8cd234', cursor: 'pointer' }} onClick={() => { this.newBuild() }}>+新建习题</div>
                    <div className={styles.table} style={{ width: "1010px" }}>
                      <Table columns={this.state.columns} dataSource={this.state.data} pagination={false} />
                    </div>
                  </div>
                )}
              </FormItem>
              <div style={{marginLeft:"95px"}}>
                <Button className={styles.toSave}>保存</Button>
                <Button className={styles.nextStep} onClick={() => { this.submitWork() }}>提交作品</Button>
                <Button className={styles.comeBack} onClick={this.backStep.bind(this, 2)}>上一步</Button>
              </div>
            </Form>
            </div>

            {/* {step5} */}
            <div style={{ display: current == 4 ? 'block' : 'none' }} className={styles.step5}>
              <div>
                <img src={require('@/assets/success.png')} alt="上传成功" />
                <div className={styles.success}>上传成功!</div>
                <Button className={styles.toExit} onClick={() => { this.toExit() }}>退出</Button>
              </div>
            </div>
          </div>


          {/* 弹窗下载答题卡 */}
          <Modal
            title="新建习题"
            visible={this.state.bool}
            closable={false}
            footer={null}
            width={800}
          >
            <div className={styles.UploadWorksModal}>
              <ul>
                <li>
                  <span className={styles.title}>录入方式:</span>
                  <div className={styles.XRadioBtn}>
                    <XRadioBtn
                      option={courseTypeData}
                      style={this.state.style}
                    ></XRadioBtn>
                  </div>
                </li>
                <li>
                  <span className={styles.title}>题型:</span>
                  <div className={styles.XRadioBtn}>
                    <XRadioBtn
                      option={courseTypeData}
                      style={this.state.style}
                    ></XRadioBtn>
                  </div>
                </li>
                <li>
                  <span className={styles.title}><b style={{ color: "red" }}>*</b>权限:</span>
                  <div className={styles.XRadioBtn}>
                    <XRadioBtn
                      option={courseTypeData}
                      style={this.state.style}
                    ></XRadioBtn>
                  </div>
                </li>
                <li>
                  <span className={styles.title}>题干:</span>
                  <TextArea placeholder="输入题干内容" style={{ width: "438px", height: '150px' }} />
                </li>
                <li>
                  <span className={styles.title}>答案:</span>
                  <RadioGroup onChange={this.onChange} value={this.state.val}>
                    <Radio style={radioStyle} value={1}>A</Radio>
                    <Radio style={radioStyle} value={2}>B</Radio>
                    <Radio style={radioStyle} value={3}>C</Radio>
                    <Radio style={radioStyle} value={4}>D</Radio>
                    <Radio style={radioStyle} value={5}>
                      选项
								{this.state.value === 5 ? <Input style={{ width: 100, marginLeft: 10 }} /> : null}
                    </Radio>
                  </RadioGroup>
                </li>
                <li>
                  <span className={styles.title}>解析:</span>
                  <TextArea placeholder="编辑题目解析" style={{ width: "438px", height: '150px' }} />
                </li>
                <li>
                  <span className={styles.title}>难度:</span>
                  <div className={styles.XRadioBtn}>
                    <XRadioBtn
                      option={courseTypeData}
                      style={this.state.style}
                    ></XRadioBtn>
                  </div>
                </li>
                <li>
                  <span className={styles.title}>标签 : </span>
                  <Select
                    mode="tags"
                    style={{ width: '546px', height: '40px', maxHeight: '40px' }}
                    onChange={handleChange}
                    tokenSeparators={[',']}
                    placeholder="输入标签内容（按回车添加）"
                  >
                    {children}
                  </Select>
                </li>
                <li>
                  <span className={styles.title}>认知能力目标:</span>
                  <Select style={{ width: '102px', height: '30px', fontSize: '12px' }} defaultValue="Home">
                    <Option value="Home">认知</Option>
                    <Option value="Company">数字抽象</Option>
                  </Select>
                </li>
                <li>
                  <span className={styles.title}>学科核改素养:</span>
                  <Select style={{ width: '102px', height: '30px', fontSize: '12px' }} defaultValue="Home">
                    <Option value="Home">数字抽象</Option>
                    <Option value="Company">Company</Option>
                  </Select>
                </li>
                <li>
                  <span className={styles.title}>知识点:</span>
                  <span>初中二年级语文</span>
                </li>
                <li>
                  <span className={styles.title}>解答提示:</span>
                  <Input placeholder="输入解答提示内容" style={{ width: '180px', height: '40px', fontSize: '12px' }} />
                </li>
                <li>
                  <span className={styles.title}>解答微课:</span>
                  <Button style={{ width: '104px', height: '32px', borderRadius: '20px', fontSize: '12px' }}>点击选择微课</Button>
                </li>
                <li>
                  <span className={styles.title}>举一反三:</span>
                  <Button style={{ width: '104px', height: '32px', borderRadius: '20px', fontSize: '12px' }}>点击选择微课</Button>
                </li>
                <li className={styles.bottomButton}>
                  <Button className={styles.toSave}>保存并继续新建</Button>
                  <Button className={styles.toSure}>确定</Button>
                  <Button className={styles.toExit} onClick={() => { this.cancelModal() }}>取消</Button>
                </li>
              </ul>
            </div>
          </Modal>
        </div>
        <ZFooter />
      </div>
    );
  }
}

export default UploadWorks;
