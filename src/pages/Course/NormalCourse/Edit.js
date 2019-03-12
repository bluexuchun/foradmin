import React, { Component, Suspense } from 'react';
import router from 'umi/router';
import { connect } from 'dva';
import { Input, Button, Row, Col, Avatar, Form } from 'antd';
import PageLoading from '@/components/PageLoading';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import IntroCommon from '@/components/IntroCommon';
import styles from './Edit.less';
// 引入编辑器组件
import BraftEditor from 'braft-editor';
// 引入编辑器样式
import 'braft-editor/dist/index.css';

const FormItem = Form.Item;
const { TextArea } = Input;
@connect()
class CourseEdit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // 创建一个空的editorState作为初始值
      editorState: BraftEditor.createEditorState(null),
    };
  }

  componentWillMount = () => {
    const htmlContent = '<p>123123</p>';
    // 使用BraftEditor.createEditorState将html字符串转换为编辑器需要的editorStat
    this.setState({
      editorState: BraftEditor.createEditorState(htmlContent),
    });
  };

  submitContent = async () => {
    // 在编辑器获得焦点时按下ctrl+s会执行此方法
    // 编辑器内容提交到服务端之前，可直接调用editorState.toHTML()来获取HTML格式的内容
    const htmlContent = this.state.editorState.toHTML();
    console.log(htmlContent);
    // const result = await saveEditorContent(htmlContent)
  };

  handleEditorChange = editorState => {
    this.setState({ editorState });
  };

  render() {
    const { match, children, location } = this.props;

    const { editorState } = this.state;

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

    let controls = ['font-size', 'text-color', 'bold'];

    const defaultNums = [
      {
        id: 'appointClass',
        title: '已预约课程',
        num: 10,
        backgroundColor: '#36DF97',
        icon: 'icon-appoint',
      },
      {
        id: 'correcthomework',
        title: '待批改作业',
        num: 10,
        backgroundColor: '#F6883D',
        icon: 'icon-book',
      },
      {
        id: 'teachernums',
        title: '老师数量',
        num: 20,
        backgroundColor: '#41AFEE',
        icon: 'icon-people',
      },
      {
        id: 'allmoneys',
        title: '总金额',
        num: 3500,
        backgroundColor: '#7E4EEC',
        icon: 'icon-money',
      },
    ];

    return (
      <GridContent>
        <Suspense fallback={<PageLoading />}>
          {/* 统计 */}
          <IntroCommon defaultNums={defaultNums} />

          <div className={styles.tit}>待批改作业>作业编辑</div>
          <Row
            type="flex"
            justify="space-between"
            style={{ padding: '0px 0px', background: '#FBFBFB' }}
          >
            <Col
              span={11}
              style={{ textAlign: 'center', boxSizing: 'border-box', padding: '10px' }}
            >
              <TextArea rows={19} />
            </Col>
            <Col
              span={11}
              style={{
                textAlign: 'center',
                boxSizing: 'border-box',
                padding: '10px 10px 60px 10px',
              }}
            >
              <BraftEditor
                value={editorState}
                onChange={this.handleEditorChange}
                onSave={this.submitContent}
                controls={controls}
                contentStyle={{ height: '300px' }}
                style={{
                  background: '#fff',
                  boxSizing: 'border-box',
                  padding: '6px 8px',
                  borderRadius: '8px',
                  border: '1px solid #eaeaea',
                }}
              />
              <div
                style={{
                  width: '100%',
                  marginTop: '10px',
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'flex-end',
                }}
              >
                <Button className={styles.addbtn} htmlType="submit">
                  提交
                </Button>
              </div>
            </Col>
          </Row>
        </Suspense>
      </GridContent>
    );
  }
}

const newCourseEdit = Form.create()(CourseEdit);

export default newCourseEdit;
