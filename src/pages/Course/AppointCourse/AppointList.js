import React, { Component, Suspense } from 'react';
import router from 'umi/router';
import { connect } from 'dva';
import { Input, Button, Table, message, Modal } from 'antd';
import PageLoading from '@/components/PageLoading';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import IntroCommon from '@/components/IntroCommon';
import styles from './AppointList.less';
import ApiClient from '@/utils/api';
import Finish from '@/assets/finish.png';
import Absence from '@/assets/absence.png';

const confirm = Modal.confirm;
@connect()
class AppointList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isClicked: 'appoint',
    };
  }

  componentWillMount = () => {
    this.changeData(this.state.isClicked);
  };

  editAppoint = id => {
    this.props.history.push('/course/appointedit/' + id);
  };

  changeType = type => {
    this.setState({
      isClicked: type,
    });
    this.changeData(type);
  };

  /**
   * 统一方法 分为已预约课程 or 已结束课程
   */
  changeData = type => {
    let columns, data;
    if (type == 'appoint') {
      // 已预约课程
      (columns = [
        {
          title: '序号',
          dataIndex: 'id',
          key: 'id',
          width: 180,
        },
        {
          title: '交易号',
          dataIndex: 'orderid',
          key: 'orderid',
          width: 200,
        },
        {
          title: '姓名',
          dataIndex: 'name',
          key: 'name',
        },
        {
          title: '开课时间',
          dataIndex: 'starttime',
          key: 'starttime',
        },
        {
          title: '时间',
          dataIndex: 'time',
          key: 'time',
        },
        {
          title: '时长',
          dataIndex: 'duration',
          key: 'duration',
        },
        {
          title: '课程进度',
          dataIndex: 'classStatus',
          key: 'classStatus',
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
                  onClick={() => this.editAppoint(record.id)}
                  style={{ color: '#8856FD' }}
                >
                  查看
                </a>
              </span>
            );
          },
        },
      ]),
        (data = [
          {
            id: 1,
            orderid: 'KJ20181218201812W7QE',
            name: 'XINGING',
            starttime: '2019-2-24',
            time: '13:00',
            duration: '120',
            classStatus: 'Page7',
          },
          {
            id: 2,
            orderid: 'KJ20181218201812W7QE',
            name: 'XINGING',
            starttime: '2019-2-24',
            time: '13:00',
            duration: '120',
            classStatus: 'Page7',
          },
        ]);

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
      // 已结束课程
      (columns = [
        {
          title: '序号',
          dataIndex: 'id',
          key: 'id',
          width: 180,
        },
        {
          title: '交易号',
          dataIndex: 'orderid',
          key: 'orderid',
          width: 200,
        },
        {
          title: '姓名',
          dataIndex: 'name',
          key: 'name',
        },
        {
          title: '开课时间',
          dataIndex: 'starttime',
          key: 'starttime',
        },
        {
          title: '时间',
          dataIndex: 'time',
          key: 'time',
        },
        {
          title: '时长',
          dataIndex: 'duration',
          key: 'duration',
        },
        {
          title: '课程进度',
          dataIndex: 'classStatus',
          key: 'classStatus',
        },
        {
          title: '缺勤/完成',
          key: 'action',
          width: 250,
          align: 'center',
          render: (text, record) => {
            console.log(record);
            return (
              <span>
                {record.status == 1 ? (
                  <img className={styles.icon} src={Finish} />
                ) : (
                  <img className={styles.icon} src={Absence} />
                )}
              </span>
            );
          },
        },
      ]),
        (data = [
          {
            id: 1,
            orderid: 'KJ20181218201812W7QE',
            name: 'XINGING',
            starttime: '2019-2-24',
            time: '13:00',
            duration: '120',
            classStatus: '结课',
            status: 1,
          },
          {
            id: 2,
            orderid: 'KJ20181218201812W7QE',
            name: 'XINGING',
            starttime: '2019-2-24',
            time: '13:00',
            duration: '120',
            classStatus: '结课',
            status: 2,
          },
        ]);

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

    return (
      <GridContent>
        <Suspense fallback={<PageLoading />}>
          {/* 统计 */}
          <IntroCommon />

          {/* 新增按钮 */}
          <div className="btnGroup">
            <Button
              className={`${
                this.state.isClicked == 'appoint' ? styles.addbtnactive : styles.addbtn
              }`}
              onClick={() => this.changeType('appoint')}
            >
              已预约课程
            </Button>
            <Button
              className={`${this.state.isClicked == 'end' ? styles.addbtnactive : styles.addbtn}`}
              style={{ marginLeft: '15px' }}
              onClick={() => this.changeType('end')}
            >
              已结束课程
            </Button>
          </div>

          {/* 表格 */}
          <Table columns={this.state.columns} dataSource={this.state.data} />
        </Suspense>
      </GridContent>
    );
  }
}

export default AppointList;
