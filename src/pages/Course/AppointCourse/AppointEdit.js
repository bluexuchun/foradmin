import React, { Component, Suspense } from 'react';
import router from 'umi/router';
import { connect } from 'dva';
import { Input, Button, Row, Col, Avatar, Form } from 'antd';
import PageLoading from '@/components/PageLoading';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import IntroCommon from '@/components/IntroCommon';
import styles from './AppointEdit.less';

const FormItem = Form.Item;
const { TextArea } = Input;
@connect()
class AppointEdit extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentWillMount = () => {};

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
    return (
      <GridContent>
        <Suspense fallback={<PageLoading />}>
          <Row gutter={12} style={{ padding: '20px 0px' }}>
            <Col span={6} style={{ textAlign: 'center' }}>
              <Avatar size={120} icon="user" />
            </Col>
            <Col span={6}>
              <div className={styles.tabTitle}>个人基本信息</div>
              <div className={styles.inputGroup}>
                <div className={styles.inputItem}>
                  <div className={styles.itemLabel}>姓名：</div>
                  <div className={styles.itemInput}>我是姓名</div>
                </div>
                <div className={styles.inputItem}>
                  <div className={styles.itemLabel}>年龄：</div>
                  <div className={styles.itemInput}>12</div>
                </div>
                <div className={styles.inputItem}>
                  <div className={styles.itemLabel}>课程进度：</div>
                  <div className={styles.itemInput}>Page7</div>
                </div>
                <div className={styles.inputItem}>
                  <div className={styles.itemLabel}>课程时间：</div>
                  <div className={styles.itemInput}>2018-12-19 8:30</div>
                </div>
                <div className={styles.inputItem}>
                  <div className={styles.itemLabel}>教材名称：</div>
                  <div className={styles.itemInput}>
                    <Button type="primary">下载材料</Button>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
          <div className={styles.line} />
          <Row gutter={12} style={{ padding: '20px 0px' }}>
            <Col span={6} style={{ textAlign: 'center' }} />
            <Col span={6}>
              <div className={styles.tabTitle}>个人习惯</div>
              <div className={styles.inputGroup}>
                <div className={styles.inputItem}>
                  <div className={styles.itemLabel}>需要加强部分：</div>
                  <div className={styles.itemInput}>口语</div>
                </div>
                <div className={styles.inputItem}>
                  <div className={styles.itemLabel}>课前闲聊12：</div>
                  <div className={styles.itemInput}>是</div>
                </div>
                <div className={styles.inputItem}>
                  <div className={styles.itemLabel}>纠错方式：</div>
                  <div className={styles.itemInput}>立即纠错</div>
                </div>
                <div className={styles.inputItem}>
                  <div className={styles.itemLabel}>每日话题：</div>
                  <div className={styles.itemInput}>需要</div>
                </div>
              </div>
            </Col>
          </Row>
        </Suspense>
      </GridContent>
    );
  }
}

const newAppointEdit = Form.create()(AppointEdit);

export default newAppointEdit;
