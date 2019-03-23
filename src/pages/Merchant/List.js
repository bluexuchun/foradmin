import React, { Component, Suspense } from 'react';
import router from 'umi/router';
import { connect } from 'dva';
import { Input, Button, Table, message, Modal,Icon } from 'antd';
import PageLoading from '@/components/PageLoading';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import IntroCommon from '@/components/IntroCommon';
import styles from './List.less';
import ApiClient from '@/utils/api';

const confirm = Modal.confirm;
@connect()
class MerchantList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedRowKeys: [],
      loading: true,
      visible:false,
      columns: [
        {
          title: '序号',
          dataIndex: 'id',
          key: 'id',
          width: 180,
        },
        {
          title: '机构Icon',
          dataIndex: 'cover',
          key: 'cover',
          width: 200,
          render: (text,record) => {
            return (
              <img src={record.cover} style={{width:'50px',height:'50px',borderRadius:'50%'}}/>
            )
          }
        },
        {
          title: '机构名称',
          dataIndex: 'title',
          key: 'title',
          width: 200,
        },
        {
          title: '账号',
          dataIndex: 'username',
          key: 'username',
        },
        {
          title: '联系人',
          dataIndex: 'user',
          key: 'user',
        },
        {
          title: '手机号',
          dataIndex: 'mobile',
          key: 'mobile',
        },
        {
          title: '操作',
          key: 'action',
          width: 250,
          align: 'center',
          render: (text, record) => {
            return(
              <div style={{display:'flex',flexDirection:'row',justifyContent:'center'}}>
                <a
                  href="javascript:void(0);"
                  onClick={() => this.editMerchant(record.id)}
                  style={{ color: '#8856FD', marginRight: '40px' }}
                >
                  编辑
                </a>
                <div
                  onClick={() => this.chargeMerchant(record.id)}
                  style={{ color: '#8856FD', marginRight: '40px',cursor:'pointer' }}
                >
                  充值
                </div>
                <a
                  href="javascript:void(0);"
                  onClick={() => this.deleteMerchant(record.id)}
                  style={{ color: '#F67066' }}
                >
                  删除
                </a>
            </div>
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
    ApiClient.post('/api.php?entry=sys&c=business&a=list&do=display', {}).then(res => {
      let result = res.data;
      if (result.status == 1) {
        if (result.data.length > 0) {
          result.data.map((v, i) => {
            let dataItem = {
              id: v.id,
              cover: v.cover,
              title: v.title,
              mobile:v.mobile,
              username:v.username,
              user:v.user
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

  /**
   * 商家充值
   * id为商家id
   */
  chargeMerchant = (id) => {
    console.log(id)
    this.setState({
      merchantid:id,
      visible:true
    })
  }

  addMerchant = () => {
    this.props.history.push('/merchant/merchant_edit/0');
  }

  editMerchant = id => {
    this.props.history.push('/merchant/merchant_edit/' + id);
  }

  handleOk = (e) => {
    let { chargement,merchantid } = this.state
    ApiClient.post('/api.php?entry=sys&c=business&a=recharge&do=recharge',{
      bid:merchantid,
      price:chargement
    }).then((res) => {
      let result = res.data;
      if (result.status == 1) {
        message.success(result.message);
        this.setState({
          visible: false,
        });
      }else{
        message.error(result.message);
      }
    })
  }

  handleCancel = (e) => {
    console.log(e);
    this.setState({
      visible: false,
    });
  }

  onChangeCharge = (e) => {
    this.setState({
      chargement:e.target.value
    })
  }

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

    const { loading,columns,data,visible,chargement } = this.state

    return (
      <GridContent>
        <Suspense fallback={<PageLoading />}>
          {/* 充值弹窗 */}
          <Modal
            title="商家充值"
            visible={visible}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
          >
            <Input
              placeholder="输入充值的金钱"
              prefix={<Icon type="pay-circle" style={{ color: 'rgba(0,0,0,.25)' }} />}
              value={chargement}
              onChange={this.onChangeCharge}
              type="number"
            />
          </Modal>
          {/* 新增按钮 */}
          <div className={styles.btngroup}>
            <Button className={styles.addmerbtn} onClick={() => this.addMerchant()} style={{marginRight:'15px'}}>
              +新增机构
            </Button>
          </div>
          

          {/* 表格 */}
          <Table columns={columns} dataSource={data} loading={loading} />
        </Suspense>
      </GridContent>
    );
  }
}

export default MerchantList;
