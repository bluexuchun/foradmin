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
class TextbookList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      columns: [
        {
          title: '序号',
          dataIndex: 'id',
          key: 'id',
          width: 180,
        },
        {
          title: '名称',
          dataIndex: 'title',
          key: 'title',
          width: 200,
        },
        {
          title: '课时',
          width: 200,
          render: (text, record) => {
            return <span>{record.study}课时</span>;
          },
        },
        {
          title: '封面图',
          width: 200,
          render: (text, record) => {
            return (
              <img
                style={{ width: '80px', height: '100px', objectFit: 'cover' }}
                src={record.icon}
              />
            );
          },
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
                  onClick={() => this.editTextbook(record.id)}
                  style={{ color: '#8856FD', marginRight: '40px' }}
                >
                  编辑
                </a>
                <a
                  href="javascript:void(0);"
                  onClick={() => this.deleteTextbook(record.id)}
                  style={{ color: '#F67066' }}
                >
                  删除
                </a>
              </span>
            );
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
    ApiClient.post('api.php?entry=sys&c=material&a=material&do=material_display', {}).then(res => {
      let result = res.data;

      if (result.status == 1) {
        if (result.data.length > 0) {
          result.data.map((v, i) => {
            let dataItem = {
              id: v.id,
              title: v.title,
              study: v.study,
              icon: v.icon,
            };
            data.push(dataItem);
          });
        }
        this.setState({
          data,
        });
      }
    });
  };

  editTextbook = id => {
    this.props.history.push('textbook_edit/' + id);
  };

  deleteTextbook = id => {
    let _this = this;
    confirm({
      title: '警告',
      content: '你确认删除该教科书？',
      onOk() {
        ApiClient.post('/api.php?entry=sys&c=material&a=material&do=material_del', { id: id }).then(
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

  addTextbook = () => {
    this.props.history.push('textbook_edit/0');
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
          <Button className={styles.addbtn} onClick={() => this.addTextbook()}>
            +教科书
          </Button>

          {/* 表格 */}
          <Table columns={this.state.columns} dataSource={this.state.data} />
        </Suspense>
      </GridContent>
    );
  }
}

export default TextbookList;
