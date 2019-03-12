import React, { Component, Suspense } from 'react';
import router from 'umi/router';
import { connect } from 'dva';
import { Input, Button, Row, Col, Avatar, Form, Upload, message,Radio } from 'antd';
import PageLoading from '@/components/PageLoading';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import IntroCommon from '@/components/IntroCommon';
import styles from './Edit.less';
import uploadImg from '@/utils/upload';
import ApiClient from '@/utils/api';

const FormItem = Form.Item;
const RadioGroup = Radio.Group
const { TextArea } = Input;
@connect()
class TeacherEdit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imageUrl: '',
      addUrl: '/api.php?entry=sys&c=teacher&a=teacher&do=teacher_add',
      sex:1
    };
  }

  componentWillMount = () => {
    let _this = this;
    let id = this.props.match.params.id;
    if (id != 0) {
      ApiClient.post('/api.php?entry=sys&c=teacher&a=teacher&do=teacher_edit', { id: id }).then(
        res => {
          let result = res.data;
          if (result.status == 1) {
            _this.setState({
              ...result.data,
              imageUrl: result.data.Filedata,
              addUrl: '/api.php?entry=sys&c=teacher&a=teacher&do=teacher_update',
            });
          }
        }
      );
    }
  }

  // 保存信息
  submit = e => {
    let _this = this;
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        if (!this.state.imageUrl) {
          message.error('请上传教师头像');
        } else {
          let data;
          if (this.props.match.params.id != 0) {
            data = { Filedata: this.state.imageUrl, ...values, id: this.state.id };
          } else {
            data = { Filedata: this.state.imageUrl, ...values };
          }
          ApiClient.post(this.state.addUrl, data).then(res => {
            let result = res.data;
            if (result.status == 1) {
              message.success(result.message);
              setTimeout(() => {
                _this.props.history.push('/teacher_list');
              }, 1000);
            } else {
              message.error(result.message);
            }
          });
        }
      }
    });
  }

  handleChange = info => {
    let _this = this;
    if (info.file.status === 'uploading') {
      this.setState({ loading: true });
      return;
    }
    if (info.file.status === 'done') {
      let result = info.file.response;
      if (result.status == 1) {
        message.success(result.message);
        let url = result.data.url;
        _this.setState({
          imageUrl: url,
        });
      } else {
        message.error(result.message);
      }
    }
  }

  onChangeSex = (e) => {
    this.setState({
      sex: e.target.value,
    });
  }

  render() {
    const { match, children, location } = this.props;
    const formItemSmallLayout = {
      labelCol: {
        xs: { span: 3 },
        sm: { span: 3 },
      },
      wrapperCol: {
        xs: { span: 6 },
        sm: { span: 6 },
      },
    };
    const formDefaultLayout = {
      labelCol: {
        xs: {
          span: 3,
        },
        sm: {
          span: 3,
        },
      },
      wrapperCol: {
        xs: {
          span: 10,
        },
        sm: {
          span: 10,
        },
      },
    };
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 3,
          offset: 0,
        },
        sm: {
          span: 3,
          offset: 3,
        },
      },
    };
    const { getFieldDecorator } = this.props.form;
    return (
      <GridContent>
        <Suspense fallback={<PageLoading />}>
          <Row gutter={12} style={{ padding: '20px 0px' }}>
            <Col span={6} style={{ textAlign: 'center' }}>
              <Upload
                name="file"
                listType="picture"
                className="avatar-uploader"
                showUploadList={false}
                action={uploadImg}
                onChange={this.handleChange}
              >
                {this.state.imageUrl ? (
                  <Avatar size={120} src={this.state.imageUrl} />
                ) : (
                  <Avatar size={120} icon="user" />
                )}
              </Upload>
            </Col>
            <Col span={14}>
              <div className={styles.tabTitle}>个人基本信息</div>
              <Form onSubmit={this.submit}>
                <FormItem {...formItemSmallLayout} label="姓名：">
                  {getFieldDecorator('username', {
                    rules: [{ required: true, message: '请输入教师姓名!' }],
                    initialValue: this.state.teacherName,
                  })(<Input placeholder="请输入教师姓名" />)}
                </FormItem>
                {this.props.match.params.id == 0 ? (
                  <FormItem {...formItemSmallLayout} label="昵称：">
                    {getFieldDecorator('nickname', {
                      rules: [{ required: true, message: '请输入昵称!' }],
                      initialValue: this.state.nickname,
                    })(<Input placeholder="请输入昵称" />)}
                  </FormItem>
                ) : null}
                <FormItem {...formItemSmallLayout} label="性别：">
                  {getFieldDecorator('sex', {
                    rules: [{ required: false, message: '请选择性别!' }],
                    initialValue: this.state.sex,
                  })(
                    <RadioGroup onChange={this.onChangeSex}>
                      <Radio value={1}>男</Radio>
                      <Radio value={2}>女</Radio>
                    </RadioGroup>
                  )}
                </FormItem>
                <FormItem {...formItemSmallLayout} label="年龄：">
                  {getFieldDecorator('age', {
                    rules: [{ required: true, message: '请输入教师年龄姓名!' }],
                    initialValue: this.state.age,
                  })(<Input placeholder="请输入教师年龄" />)}
                </FormItem>
                <FormItem {...formItemSmallLayout} label="学历：">
                  {getFieldDecorator('education', {
                    rules: [{ required: true, message: '请输入教师学历!' }],
                    initialValue: this.state.education,
                  })(<Input placeholder="请输入教师学历" />)}
                </FormItem>
                <FormItem {...formDefaultLayout} label="简介：">
                  {getFieldDecorator('abstract', {
                    rules: [{ required: false, message: '请输入教师学历!' }],
                    initialValue: this.state.abstract,
                  })(<TextArea placeholder="教师简介" />)}
                </FormItem>
              </Form>
            </Col>
          </Row>
          <div className={styles.line} />
          <Row gutter={12} style={{ padding: '20px 0px' }}>
            <Col span={6} style={{ textAlign: 'center' }} />
            <Col span={14}>
              <div className={styles.tabTitle}>联系方式</div>
              <Form onSubmit={this.submit}>
                <FormItem {...formItemSmallLayout} label="手机号：">
                  {getFieldDecorator('telephone', {
                    rules: [{ required: true, message: '请输入教师手机号!' }],
                    initialValue: this.state.teacherAccount,
                  })(<Input placeholder="请输入教师手机号" />)}
                </FormItem>
                {this.props.match.params.id == 0 ? (
                  <FormItem {...formItemSmallLayout} label="密码：">
                    {getFieldDecorator('password', {
                      rules: [{ required: true, message: '请输入密码!' }],
                    })(<Input placeholder="请输入密码" />)}
                  </FormItem>
                ) : null}

                <FormItem {...formItemSmallLayout} label="Facebook：">
                  {getFieldDecorator('facebook', {
                    rules: [{ required: false, message: '请输入教师facebook!' }],
                    initialValue: this.state.facebook,
                  })(<Input placeholder="请输入Facebook" />)}
                </FormItem>
                <FormItem {...formItemSmallLayout} label="Skype：">
                  {getFieldDecorator('skype', {
                    rules: [{ required: false, message: '请输入教师skype!' }],
                    initialValue: this.state.skype,
                  })(<Input placeholder="请输入Skype" />)}
                </FormItem>
                <FormItem {...tailFormItemLayout}>
                  <Button className={styles.addbtn} htmlType="submit">
                    提交
                  </Button>
                </FormItem>
              </Form>
            </Col>
          </Row>
        </Suspense>
      </GridContent>
    );
  }
}

const newTeacherEdit = Form.create()(TeacherEdit);

export default newTeacherEdit;
