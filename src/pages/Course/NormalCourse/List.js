import React, { Component, Suspense } from 'react';
import router from 'umi/router';
import { connect } from 'dva';
import { Input, Button, Table, message, Modal } from 'antd';
import PageLoading from '@/components/PageLoading';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import IntroCommon from '@/components/IntroCommon';
import styles from './List.less';
import ApiClient from '@/utils/api';

const confirm = Modal.confirm;
@connect()
class CourseList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isClicked: 'appoint',
    };
  }

  componentWillMount = () => {
    this.changeData(this.state.isClicked);
  };

  /**
   * 查看作业
   */
  editHomework = id => {
    this.props.history.push('/course/edit/' + id);
  };

  /**
   * 更改类型
   */
  changeType = type => {
    this.setState({
      isClicked: type,
    });
    this.changeData(type);
  };

  /**
   * 统一方法 分为待批改作业 or 已批改作业
   */
  changeData = type => {
    let columns, data;
    if (type == 'appoint') {
      // 待批改作业
      columns = [
        {
          title: '序号',
          dataIndex: 'id',
          key: 'id',
          width: 180,
        },
        {
          title: '姓名',
          dataIndex: 'name',
          key: 'name',
          width: 200,
        },
        {
          title: '时间',
          dataIndex: 'time',
          key: 'time',
        },
        {
          title: '操作',
          key: 'action',
          width: 250,
          align: 'center',
          render: (text, record) => {
            return (
              <span>
                <a
                  href="javascript:void(0);"
                  onClick={() => this.editHomework(record.id)}
                  style={{ color: '#8856FD', marginRight: '40px' }}
                >
                  查看
                </a>
              </span>
            );
          },
        },
      ];

      data = [
        {
          id: 1,
          name: 'XINGMING',
          time: '2019-2-24',
        },
        {
          id: 2,
          name: 'XINGMING',
          time: '2019-2-24',
        },
      ];

      // ApiClient.post('/api.php?entry=sys&c=teacher&a=curriculum&do=subscribe', {}).then(res => {
      //   let result = res.data;
      //   console.log(result);
      //   if (result.status == 1) {
      //     if (result.data.length > 0) {
      //       result.data.map((v, i) => {
      //         let dataItem = {
      //           id: v.id,
      //           name: v.teacherName,
      //           age: v.age,
      //         };
      //         data.push(dataItem);
      //       });
      //     }
      //     this.setState({
      //       data,
      //     });
      //   }
      // });
    } else {
      // 已批改作业
      columns = [
        {
          title: '序号',
          dataIndex: 'id',
          key: 'id',
          width: 180,
        },
        {
          title: '姓名',
          dataIndex: 'name',
          key: 'name',
          width: 200,
        },
        {
          title: '时间',
          dataIndex: 'time',
          key: 'time',
        },
        {
          title: '操作',
          key: 'action',
          width: 250,
          align: 'center',
          render: (text, record) => {
            return (
              <span>
                <a
                  href="javascript:void(0);"
                  onClick={() => this.editHomework(record.id)}
                  style={{ color: '#8856FD', marginRight: '40px' }}
                >
                  查看
                </a>
              </span>
            );
          },
        },
      ];

      data = [
        {
          id: 1,
          name: 'XINGMING1',
          time: '2019-2-24',
        },
        {
          id: 2,
          name: 'XINGMING1',
          time: '2019-2-24',
        },
      ];

      // ApiClient.post('/api.php?entry=sys&c=teacher&a=curriculum&do=subscribe', {}).then(res => {
      //   let result = res.data;
      //   console.log(result);
      //   if (result.status == 1) {
      //     if (result.data.length > 0) {
      //       result.data.map((v, i) => {
      //         let dataItem = {
      //           id: v.id,
      //           name: v.teacherName,
      //           age: v.age,
      //         };
      //         data.push(dataItem);
      //       });
      //     }
      //     this.setState({
      //       data,
      //     });
      //   }
      // });
    }
    this.setState({
      columns,
      data,
    });
  };

  render() {
    const { match, children, location } = this.props;
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

          {/* 新增按钮 */}
          <div className="btnGroup">
            <Button
              className={`${
                this.state.isClicked == 'appoint' ? styles.addbtnactive : styles.addbtn
              }`}
              onClick={() => this.changeType('appoint')}
            >
              待批改作业
            </Button>
            <Button
              className={`${this.state.isClicked == 'end' ? styles.addbtnactive : styles.addbtn}`}
              style={{ marginLeft: '15px' }}
              onClick={() => this.changeType('end')}
            >
              已批改作业
            </Button>
          </div>

          {/* 表格 */}
          <Table columns={this.state.columns} dataSource={this.state.data} />
        </Suspense>
      </GridContent>
    );
  }
}

export default CourseList;
