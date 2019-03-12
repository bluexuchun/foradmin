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
class TeacherList extends Component {
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
          title: '姓名',
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
          title:'开放时间',
          width: 250,
          align: 'center',
          render:(text,record) => {
            let id = [record.id]
            return (
              <Button type="primary" onClick={() => this.arrange(id)}>添加开放时间</Button>
            )
          }
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
                  onClick={() => this.editTeacher(record.id)}
                  style={{ color: '#8856FD', marginRight: '40px' }}
                >
                  编辑
                </a>
                <a
                  href="javascript:void(0);"
                  onClick={() => this.deleteTeacher(record.id)}
                  style={{ color: '#F67066' }}
                >
                  删除
                </a>
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
    ApiClient.post('/api.php?entry=sys&c=teacher&a=teacherList&do=teacherList', {}).then(res => {
      let result = res.data;
      if (result.status == 1) {
        if (result.data.length > 0) {
          result.data.map((v, i) => {
            let dataItem = {
              id: v.id,
              name: v.teacherName,
              age: v.age,
            };
            data.push(dataItem);
          });
        }
        this.setState({
          data,
          loading:false
        });
      }
    });
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

  addTeacher = () => {
    this.props.history.push('teacher_edit/0');
  };

  editTeacher = id => {
    this.props.history.push('teacher_edit/' + id);
  };

  deleteTeacher = id => {
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

  onSelectChange = (selectedRowKeys) => {
    let _this = this
    let ids = []
    selectedRowKeys.map((v,i) => {
      ids.push(_this.state.data[v].id)
    })
    this.setState({
      ids,
      selectedRowKeys 
    });

  }

  render() {
    const { match, children, location } = this.props;

    const { loading, selectedRowKeys } = this.state

    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    }

    return (
      <GridContent>
        <Suspense fallback={<PageLoading />}>
          {/* 统计 */}
          <IntroCommon />

          {/* 新增按钮 */}
          <div className={styles.btngroup}>
            <Button className={styles.addbtn} onClick={() => this.addTeacher()} style={{marginRight:'15px'}}>
              +新增老师
            </Button>
            <Button className={styles.addbtn} onClick={() => this.arrange(this.state.ids)}>
              批量开放时间
            </Button>
          </div>
          

          {/* 表格 */}
          <Table rowSelection={rowSelection} columns={this.state.columns} dataSource={this.state.data} loading={loading} />
        </Suspense>
      </GridContent>
    );
  }
}

export default TeacherList;
