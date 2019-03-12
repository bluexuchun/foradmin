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
class MerchantStudentEdit extends Component {
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
              <div className={styles.tabTitle}>学院信息</div>
              <Form onSubmit={this.submit}>
                <FormItem {...formItemSmallLayout} label="机构名称：">
                  {getFieldDecorator('name', {
                    rules: [{ required: true, message: '请输入机构名称!' }],
                    initialValue: this.state.name,
                  })(<Input placeholder="请输入机构名称" />)}
                </FormItem>
                <FormItem {...formItemSmallLayout} label="联系人：">
                  {getFieldDecorator('user', {
                    rules: [{ required: true, message: '请输入联系人!' }],
                    initialValue: this.state.user,
                  })(<Input placeholder="请输入联系人" />)}
                </FormItem>
                <FormItem {...formItemSmallLayout} label="手机号：">
                  {getFieldDecorator('mobile', {
                    rules: [{ required: true, message: '请输入手机号!' }],
                    initialValue: this.state.mobile,
                  })(<Input placeholder="请输入手机号" />)}
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

const newMerchantStudentEdit = Form.create()(MerchantStudentEdit);

export default newMerchantStudentEdit;
