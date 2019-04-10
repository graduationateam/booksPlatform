import React, { Component } from 'react';
import Zheader from '@/components/Zheader';
import ZFooter from '@/components/ZFooter';
import { connect } from 'dva';
import Link from 'umi/link';
import ZUpload from '@/components/ZUpload';
import styles from './resource.less';
import { Input, Button, Form, Row, Col, Select, Radio, Icon, message  } from 'antd';
import { getDto } from '@/utils/dto';
import creatHistory from 'history/createBrowserHistory';
const history = creatHistory();
const { TextArea } = Input;
const FormItem = Form.Item;
const Option = Select.Option;
message.config({
  top: 200,
});
@connect(({ book }) => ({
  book
}))
class CreateSell extends Component {
  constructor(props){
    super(props);
    this.state = {
        tipsVisible: false,
        visible: false,
        isModify: false,  //是否修改
        chapterData: [],
        isPrevent: false,
				bookType: [{itemValue:''}],
				bookOldState: [{itemValue:''}],
				cover_url: '',
    }
	}
	componentDidMount() {
    const { location:{query:{id}} } = this.props;
    if(id) {
      this.setState({
        isModify: true
      })
			// this.getMaterialInfo(id);			
		}
		this.getBookType();
		this.getBookOldState();
	}
	getMaterialInfo = (id)=> {
		const { dispatch } = this.props;
    dispatch({
      type: 'material/getMaterialInfo',
      payload: {
          method: '/res/resLesson/get',
					id: id,
      },
      callback:(data)=>{
        this.setState({
          lessonInfo: data,
					prefaceData: data.preface,
					cover_url: data.cover_url,
					resourceData: { file_name:data.file_name, file_type:data.file_type, pdf_url:data.pdf_url, resource_url:data.resource_url, file_size:data.size },
        })
      }
    });
	}
	// 获取书籍类型
	getBookType = ()=> {
		const { dispatch } = this.props;
		dispatch({
      type: 'book/getBookType',
      payload: {
          method: '/dictionary/getDictionaryItemByDictCode',
					dictCode: 'classification',
      },
      callback:(data)=>{
				this.setState({
					bookType: data,
				})
      }
    });
	}
	// 获取新旧程度
	getBookOldState = ()=> {
		const { dispatch } = this.props;
		dispatch({
      type: 'book/getBookType',
      payload: {
          method: '/dictionary/getDictionaryItemByDictCode',
					dictCode: 'bookOldState',
      },
      callback:(data)=>{
				this.setState({
					bookOldState: data,
				})
      }
    });
	}
	// 图片操作
  handleUploadChange = (info) => {
    if (info.file.status === 'uploading') {
      this.setState({ uploadLoading: true });
      return;
    }
    if (info.file.status === 'done') {
			console.log("执行")
      const res = info.file.response;
      if(res.status != '0') {
        message.error(res.msg);
        this.setState({ uploadLoading: false });
        return
			}
			console.log(info);
      this.setState({
        cover_url: res.data.path,
        uploadLoading: false,
      })
    }
	}
	// 提交表单
	handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
			if (err) return;
      this.addNew(values);
    });	
	}
	putPic =()=> {
		console.log("zhixing1")
		const { dispatch } = this.props;
		dispatch({
			type: 'book/putPic',
			payload: {
				method: '/testUpload',
				fileKey: 'fileKey',
			},
			callback: ()=> {

			}
		})
	}
	addNew = (values)=> {
    let userId = getDto("user_id");
		const { name, author, isbn, publishHouse, classification, bookOldState, price,
			originalPrice, quantity, description, remark, isDrop } = values;
		const { cover_url } = this.state;
		const { dispatch, location:{query:{id,type}}  } = this.props;
		console.log(values)
		// if(!cover_url) { message.warning("请上传封面！",1);return; }
    dispatch({
      type: 'book/addNewSell',
      payload: {
				id:id?id:'',
        method: id?'/book/modify':'/book/addBook',
				name: name, // 课件名称
				isbn: isbn,
				author: author,
				publishHouse: publishHouse,
				classification: classification,
				bookOldState: bookOldState,
				price: price,
				originalPrice: originalPrice,
				quantity: type=="2"?1:quantity,
				description: description,
				cover_url: cover_url,
				remark: remark,
				isDrop: type=="2"?0:isDrop, // 0上架， 1下架
				userId: userId,
				publishType: type, //发布类型 1.求购、2出售、3竞拍
      },
      callback:()=>{
        // setTimeout(() => {
        //   this.setState({
        //     isPrevent: false 
        //   });
        // }, 2000);
      }
    });
    // this.setState({
    //   isPrevent: true
    // })
	}
	putImg = (value)=> {
		console.log(value)
	}
	
  render() {
		const { form, location:{query:{id,type}} } = this.props;
    const { cover_url, uploadLoading, isPrevent, lessonInfo, bookType, bookOldState } = this.state;
		const radioBtn = {height:'28px', lineHeight:'28px', marginRight:'10px', borderRadius:'3px', border:'0'};
		let isModify = false;
		if(id) { isModify = true }
		return (
      <div>
        <Zheader addr={type==1?3:2}/>
        <div className="container">
          <div className={styles.releaseCon}>
						<Form onSubmit={this.handleSubmit} >
							<FormItem labelCol={{ span: 2 }} wrapperCol={{ span: 17 }} label="发布类型">
								{form.getFieldDecorator('publicType', {
									initialValue: 1,
									})(
										<Radio.Group buttonStyle="solid" style={{marginLeft:'20px'}}>
											<Radio.Button value={1} style={radioBtn} >{type=="1"?"发布求购":"发布出售"}</Radio.Button>
										</Radio.Group>
									)}
              </FormItem>
							<FormItem labelCol={{ span: 2 }} wrapperCol={{ span: 17 }} label="书籍名称">
								{form.getFieldDecorator('name', {
									initialValue: isModify? lessonInfo.name:'',
									rules: [{ required: true, message: '请填写书籍名称' }],
								})(
									<Input style={{width:'60%',marginLeft:'20px'}} placeholder="请输入书籍名称"/>
								)}
							</FormItem>
							<FormItem labelCol={{ span: 2 }} wrapperCol={{ span: 17 }} label="ISBN">
								{form.getFieldDecorator('isbn', {
									initialValue: isModify? lessonInfo.isbn:'',
									rules: [{ required: true, message: '请填写书籍ISBN' }],
								})(
									<Input style={{width:'60%',marginLeft:'20px'}} placeholder="请填写书籍ISBN"/>
								)}
							</FormItem>
							<FormItem labelCol={{ span: 2 }} wrapperCol={{ span: 17 }} label="书籍作者">
								{form.getFieldDecorator('author', {
									initialValue: isModify? lessonInfo.author:'',
									rules: [{ required: true, message: '请填写书籍作者' }],
								})(
									<Input style={{width:'60%',marginLeft:'20px'}} placeholder="请填写书籍作者"/>
								)}
							</FormItem>
							<FormItem labelCol={{ span: 2 }} wrapperCol={{ span: 17 }} label="出版社">
								{form.getFieldDecorator('publishHouse', {
									initialValue: isModify? lessonInfo.publishHouse:'',
									rules: [{ required: true, message: '请填写书籍出版社' }],
								})(
									<Input style={{width:'60%',marginLeft:'20px'}} placeholder="请填写书籍出版社"/>
								)}
							</FormItem>
							<FormItem labelCol={{ span: 2 }} wrapperCol={{ span: 17 }} label="书籍类型">
									{form.getFieldDecorator('classification', {
										initialValue: isModify? lessonInfo.classification:bookType[0].itemValue,
									})(
										<Radio.Group buttonStyle="solid" style={{marginLeft:'20px'}}>
										{
											bookType.map((item,index)=> {
												return <Radio.Button key={index} value={item.itemValue} style={radioBtn}>{item.itemName}</Radio.Button>
											})
										}
										</Radio.Group>)}
							</FormItem>
							<FormItem labelCol={{ span: 2 }} wrapperCol={{ span: 17 }} label="新旧程度">
								{form.getFieldDecorator('bookOldState', {
									initialValue: isModify? lessonInfo.bookOldState:bookOldState[0].itemValue,
								})(
									<Radio.Group buttonStyle="solid" style={{marginLeft:'20px'}}>
									{
										bookOldState.map((item,index)=>{
											return <Radio.Button key={index} value={item.itemValue} style={radioBtn}>{item.itemName}</Radio.Button>
										})
									}
									</Radio.Group>)}
							</FormItem>
							<FormItem labelCol={{ span: 2 }} wrapperCol={{ span: 17 }} label={type=="1"?"求购价格":"出售价格"}>
								{form.getFieldDecorator('price', {
									initialValue: isModify? lessonInfo.price:'',
									rules: [{ required: true, message: '请填写价格' }],
								})(
									<Input style={{width:'15%',marginLeft:'20px'}} placeholder="￥价格"/>
								)}
							</FormItem>
							<FormItem labelCol={{ span: 2 }} wrapperCol={{ span: 17 }} label="书籍原价">
								{form.getFieldDecorator('originalPrice', {
									initialValue: isModify? lessonInfo.originalPrice:'',
									rules: [{ required: true, message: '请填写书籍原价' }],
								})(
									<Input style={{width:'15%',marginLeft:'20px'}} placeholder="￥原价"/>
								)}
							</FormItem>
							{
								type=="2"?
								<FormItem labelCol={{ span: 2 }} wrapperCol={{ span: 17 }} label="书籍数量">
									{form.getFieldDecorator('quantity', {
										initialValue: isModify? lessonInfo.quantity:'',
										rules: [{ required: true, message: '请填写书籍数量' }],
									})(
										<Input type="number" style={{width:'15%',marginLeft:'20px'}} placeholder="数量(本)"/>
									)}
								</FormItem>:''
							}
							<FormItem labelCol={{ span: 2 }} wrapperCol={{ span: 17 }} label="描述">
									{form.getFieldDecorator('description',{
										initialValue: isModify? lessonInfo.description:'',
									})( 
										<TextArea style={{width:'60%',marginLeft:'20px'}} rows={3} placeholder="请输入描述" />
									)}
							</FormItem>
							<FormItem labelCol={{ span: 2 }} wrapperCol={{ span: 17 }} label="封面图">
									{form.getFieldDecorator('cover_url',{
									})(
										<div style={{marginLeft:'20px',marginTop:'15px'}}>
											<ZUpload
												onChange={this.handleUploadChange}
												loading={uploadLoading}
												className='avatar-uploader'
												listType='picture-card'
											>
												{cover_url?
													<img src={cover_url} style={{width: 100}} /> :
													<div>
														<Icon type={uploadLoading ? 'loading' : 'plus'} />
														<div className="ant-upload-text">上传</div>
													</div>
												}
											</ZUpload>
											{/* <input type="file" name="fileKey" onChang={this.putImg}/> */}
											<div className={styles.littleTips}><span>*</span>建议图片宽高比例3:4，大小在120*160px以上</div>
										</div>
									)}
							</FormItem>
							<FormItem labelCol={{ span: 2 }} wrapperCol={{ span: 17 }} label="备注">
									{form.getFieldDecorator('remark',{
										initialValue: isModify? lessonInfo.remark:'',
									})( 
										<TextArea style={{width:'60%',marginLeft:'20px'}} rows={3} placeholder="请输入备注" />
									)}
							</FormItem>
							{
								type=="2"?
								<FormItem labelCol={{ span: 2 }} wrapperCol={{ span: 17 }} label="是否上架">
									{form.getFieldDecorator('isDrop',{
										initialValue: isModify? lessonInfo.isDrop:0,
									})( 
										<Select style={{ width: '120px',marginLeft:'20px' }}>
											<Option value={0}>是</Option>
											<Option value={1}>否</Option>
										</Select>
									)}
								</FormItem>:''

							}
							<Form.Item>
								<Row className={styles.resultBtn}>
										<Col offset={1} className={styles.courseTips}>
											{
												isPrevent?
												<Button>发布</Button>
												:  <Button htmlType="submit" >{isModify?"修改":"发布"}</Button>
											}
											<Button className={styles.backBtn} onClick={()=>{history.goBack()}}>返回</Button>
										</Col>
								</Row>
							</Form.Item>
						</Form>
					</div>
				</div>
				<ZFooter />
      </div>
    );
  }
}
CreateSell = Form.create()(CreateSell);
export default CreateSell;
