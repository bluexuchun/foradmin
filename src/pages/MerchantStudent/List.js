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
class MerchantStudentList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedRowKeys: [],
      loading: true,
      columns: [
        {
          title: '序号',
          dataIndex: 'id',
          key: 'id',
          width: 180,
        },
        {
          title: '头像',
          dataIndex: 'icon',
          key: 'icon',
          width: 200,
          render: (text,record) => {
            return (
              <img src={record.icon} style={{width:'50px',height:'50px',borderRadius:'50%'}}/>
            )
          }
        },
        {
          title: '学生姓名',
          dataIndex: 'name',
          key: 'name',
          width: 200,
        },
        {
          title: '年龄',
          dataIndex: 'age',
          key: 'age',
        },
        {
          title: '性别',
          dataIndex: 'sex',
          key: 'sex',
        },
        {
          title: '所属机构',
          dataIndex: 'merchant',
          key: 'merchant',
        },
        {
          title: '所在地',
          dataIndex: 'location',
          key: 'location',
        },
        {
          title: '操作',
          key: 'action',
          width: 250,
          align: 'center',
          render: (text, record) => {
            return(
              <span>
                <a
                  href="javascript:void(0);"
                  onClick={() => this.editMerchant(record.id)}
                  style={{ color: '#8856FD', marginRight: '40px' }}
                >
                  查看详情
                </a>
                {/* <a
                  href="javascript:void(0);"
                  onClick={() => this.deleteMerchant(record.id)}
                  style={{ color: '#F67066' }}
                >
                  删除
                </a> */}
            </span>
            )
          },
        },
      ],
    };
  }

  componentWillMount = () => {
    this.init();
  };

  init = () => {
    let data = [];
    // ApiClient.post('/api.php?entry=sys&c=teacher&a=teacherList&do=teacherList', {}).then(res => {
    //   let result = res.data;
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
    //       loading:false
    //     });
    //   }
    // });
  };

  arrange = id => {
    let item = id
    const { history } = this.props
    history.push({
      pathname:'arrange/',
      state:{
        id:JSON.stringify(item)
      }
    })
    // this.props.history.push('arrange/' + JSON.stringify(item));
  }

  addMerchant = () => {
    this.props.history.push('/merchant/merchant_edit/0');
  };

  editMerchant = id => {
    this.props.history.push('/merchant/merchant_edit/' + id);
  };

  deleteMerchant = id => {
    let _this = this;
    confirm({
      title: '警告',
      content: '你确认删除该教师？',
      onOk() {
        ApiClient.post('/api.php?entry=sys&c=teacher&a=teacher&do=teacher_del', { id: id }).then(
          res => {
            let result = res.data;
            if (result.status == 1) {
              message.success(result.message);
              _this.init();
            }
          }
        );
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  };

  render() {
    const { match, children, location } = this.props;

    const { loading,columns,data } = this.state

    return (
      <GridContent>
        <Suspense fallback={<PageLoading />}>
          {/* 表格 */}
          <Table columns={columns} dataSource={data} loading={loading} />
        </Suspense>
      </GridContent>
    );
  }
}

export default MerchantStudentList;
