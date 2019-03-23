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
class MerchantEdit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imageUrl: '',
      addUrl: '/api.php?entry=sys&c=business&a=register&do=register',
      sex:1
    };
  }

  componentWillMount = () => {
    let _this = this;
    let id = this.props.match.params.id;
    if (id != 0) {
      ApiClient.post('/api.php?entry=sys&c=business&a=register&do=edit', { id: id }).then(
        res => {
          let result = res.data;
          if (result.status == 1) {
            _this.setState({
              ...result.data,
              imageUrl: result.data.Filedata,
              addUrl: '/api.php?entry=sys&c=business&a=register&do=update',
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
        if (!this.state.cover) {
          message.error('请上传封面图');
        } else {
          let data;
          if (this.props.match.params.id != 0) {
            data = { cover: this.state.cover, ...values, id: this.state.id };
          } else {
            data = { cover: this.state.cover, ...values };
          }
          ApiClient.post(this.state.addUrl, data).then(res => {
            let result = res.data;
            if (result.status == 1) {
              message.success(result.message);
              setTimeout(() => {
                _this.props.history.push('/merchant/merchant_list');
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
          cover: url,
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
                {this.state.cover ? (
                  <Avatar size={120} src={this.state.cover} />
                ) : (
                  <Avatar size={120} icon="user" />
                )}
              </Upload>
            </Col>
            <Col span={14}>
              <div className={styles.tabTitle}>机构信息</div>
              <Form onSubmit={this.submit}>
                <FormItem {...formItemSmallLayout} label="机构名称：">
                  {getFieldDecorator('title', {
                    rules: [{ required: true, message: '请输入机构名称!' }],
                    initialValue: this.state.title,
                  })(<Input placeholder="请输入机构名称" />)}
                </FormItem>
                <FormItem {...formItemSmallLayout} label="账号：">
                  {getFieldDecorator('username', {
                    rules: [{ required: true, message: '请输入账号!' }],
                    initialValue: this.state.username,
                  })(<Input placeholder="请输入账号" />)}
                </FormItem>
                <FormItem {...formItemSmallLayout} label="密码：">
                  {getFieldDecorator('password', {
                    rules: [{ required: true, message: '请输入密码!' }],
                    initialValue: this.state.password,
                  })(<Input.Password placeholder="请输入密码" password />)}
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
                <FormItem {...formItemSmallLayout} label="商家余额：">
                  {getFieldDecorator('balance', {
                    rules: [{ required: false, message: '' }],
                    initialValue: this.state.balance,
                  })(<Input disabled />)}
                </FormItem>
              </Form>
            </Col>
          </Row>
          <div className={styles.line} />
          <Row gutter={12} style={{ padding: '20px 0px' }}>
            <Col span={6} style={{ textAlign: 'center' }} />
            <Col span={14}>
              <div className={styles.tabTitle}>商家支付信息</div>
              <Form onSubmit={this.submit}>
                <FormItem {...formItemSmallLayout} label="appid：">
                  {getFieldDecorator('appid', {
                    rules: [{ required: true, message: '请输入appid!' }],
                    initialValue: this.state.appid,
                  })(<Input placeholder="请输入appid" />)}
                </FormItem>

                <FormItem {...formItemSmallLayout} label="appsecret：">
                  {getFieldDecorator('appsecret', {
                    rules: [{ required: true, message: '请输入appsecret!' }],
                    initialValue: this.state.appsecret,
                  })(<Input placeholder="请输入appsecret" />)}
                </FormItem>

                <FormItem {...formItemSmallLayout} label="商家号：">
                  {getFieldDecorator('mchid', {
                    rules: [{ required: true, message: '请输入商家号!' }],
                    initialValue: this.state.mchid,
                  })(<Input placeholder="请输入商家号" />)}
                </FormItem>

                <FormItem {...formItemSmallLayout} label="apikey：">
                  {getFieldDecorator('signkey', {
                    rules: [{ required: true, message: '请输入apikey!' }],
                    initialValue: this.state.signkey,
                  })(<Input placeholder="请输入apikey" />)}
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

const newMerchantEdit = Form.create()(MerchantEdit);

export default newMerchantEdit;
