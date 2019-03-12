import React, { Component, Suspense } from 'react';
import router from 'umi/router';
import { connect } from 'dva';
import { Input, Button, Row, Col, Avatar, Form, Upload, message } from 'antd';
import PageLoading from '@/components/PageLoading';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import IntroCommon from '@/components/IntroCommon';
import styles from './Edit.less';
import uploadImg from '@/utils/upload';
import ApiClient from '@/utils/api';

const FormItem = Form.Item;
const { TextArea } = Input;
@connect()
class TextbookEdit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      icon: '',
      addUrl: '/api.php?entry=sys&c=material&a=material&do=material',
      editUrl: '/api.php?entry=sys&c=material&a=material&do=material_edit',
    };
  }
  componentWillMount = () => {
    let _this = this;
    let id = this.props.match.params.id;
    if (id != 0) {
      ApiClient.post(this.state.editUrl, { id: id }).then(res => {
        let result = res.data;
        if (result.status == 1) {
          _this.setState({
            ...result.data,
            icon: result.data.icon,
          });
        }
      });
    }
  };

  // 保存信息
  submit = e => {
    let _this = this;
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        if (!this.state.icon) {
          message.error('请上传封面图');
        } else {
          let data;
          if (this.props.match.params.id != 0) {
            data = { icon: this.state.icon, ...values, id: this.state.id };
          } else {
            data = { icon: this.state.icon, ...values };
          }
          ApiClient.post(this.state.addUrl, data).then(res => {
            let result = res.data;
            if (result.status == 1) {
              message.success(result.message);
              setTimeout(() => {
                _this.props.history.push('/textbook_list');
              }, 1000);
            } else {
              message.error(result.message);
            }
          });
        }
      }
    });
  };

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
          icon: url,
        });
      } else {
        message.error(result.message);
      }
    }
  };

  render() {
    const { match, children, location } = this.props;
    const formItemSmallLayout = {
      labelCol: {
        xs: { span: 6 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 6 },
        sm: { span: 6 },
      },
    };
    const formDefaultLayout = {
      labelCol: {
        xs: {
          span: 6,
        },
        sm: {
          span: 6,
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
          span: 6,
          offset: 0,
        },
        sm: {
          span: 6,
          offset: 6,
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
                {this.state.icon ? (
                  <img className={styles.finishImg} src={this.state.icon} />
                ) : (
                  <div className={styles.uploadImg}>+</div>
                )}
              </Upload>
            </Col>
            <Col span={14}>
              <div className={styles.tabTitle}>教科书添加</div>
              <Form onSubmit={this.submit}>
                <FormItem {...formItemSmallLayout} label="名称：">
                  {getFieldDecorator('title', {
                    rules: [{ required: true, message: '请输入名称!' }],
                    initialValue: this.state.title,
                  })(<Input placeholder="请输入名称" />)}
                </FormItem>
                <FormItem {...formItemSmallLayout} label="适用年级：">
                  {getFieldDecorator('grade', {
                    rules: [{ required: true, message: '请输入适用年级!' }],
                    initialValue: this.state.grade,
                  })(<Input placeholder="请输入适用年级" />)}
                </FormItem>
                <FormItem {...formItemSmallLayout} label="适应人群：">
                  {getFieldDecorator('adapt', {
                    rules: [{ required: true, message: '请输入适应人群!' }],
                    initialValue: this.state.adapt,
                  })(<Input placeholder="请输入适应人群" />)}
                </FormItem>
                <FormItem {...formItemSmallLayout} label="学习时长：">
                  {getFieldDecorator('study', {
                    rules: [{ required: true, message: '请输入学习时长!' }],
                    initialValue: this.state.study,
                  })(<Input placeholder="请输入学习时长" />)}
                </FormItem>
                <FormItem {...formItemSmallLayout} label="标签：">
                  {getFieldDecorator('tab', {
                    rules: [{ required: false, message: '请输入标签!' }],
                    initialValue: this.state.tab,
                  })(<Input placeholder="请输入标签" />)}
                </FormItem>
                <FormItem {...formDefaultLayout} label="简介：">
                  {getFieldDecorator('abstract', {
                    rules: [{ required: false, message: '请输入简介!' }],
                    initialValue: this.state.abstract,
                  })(<TextArea placeholder="请输入简介" autosize={true} />)}
                </FormItem>
                <FormItem {...formDefaultLayout} label="课程内容和特色：">
                  {getFieldDecorator('content', {
                    rules: [{ required: true, message: '请输入课程内容和特色!' }],
                    initialValue: this.state.abstract,
                  })(<TextArea placeholder="content" autosize={true} />)}
                </FormItem>
                <FormItem {...formDefaultLayout} label="教学目标：">
                  {getFieldDecorator('target', {
                    rules: [{ required: true, message: '请输入教学目标!' }],
                    initialValue: this.state.target,
                  })(<TextArea placeholder="请输入教学目标" autosize={true} />)}
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

const newTextbookEdit = Form.create()(TextbookEdit);

export default newTextbookEdit;
