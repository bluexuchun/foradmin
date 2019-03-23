import React, { Component, Suspense } from 'react';
import router from 'umi/router';
import { connect } from 'dva';
import { Input, Button, Table, message, Modal,Icon,Tag } from 'antd';
import PageLoading from '@/components/PageLoading';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import IntroCommon from '@/components/IntroCommon';
import styles from './List.less';
import ApiClient from '@/utils/api';

const confirm = Modal.confirm;
@connect()
class ChargeRecordList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedRowKeys: [],
      loading: true,
      chargeVisible:false,
      errorVisible:false,
      columns: [
        {
          title: '机构ID',
          dataIndex: 'id',
          key: 'id',
          width: 180,
        },
        {
          title: '机构名称',
          dataIndex: 'title',
          key: 'title',
          width: 200,
        },
        {
          title: '充值金额',
          dataIndex: 'price',
          key: 'price',
        },
        {
          title: '创建时间',
          dataIndex: 'createtime',
          key: 'createtime',
        },
        {
          title: '审核状态',
          dataIndex: 'status',
          render: (text,record) => {
            return (
              <div>
                {record.status == '1' ? 
                  <Tag color="#87d068">未审核</Tag> 
                  : 
                  record.status == '2' ? 
                    <Tag color="#2db7f5">审核通过</Tag> 
                    :
                    <Tag color="#f50">审核失败</Tag> 
                }
              </div>
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
              <div style={{display:'flex',flexDirection:'row',justifyContent:'center'}}>
                {record.status == '1' ? 
                  <div>
                    <Button
                      type="primary"
                      onClick={() => this.recordSuccess(record.id,record.title,record.price)}
                      style={{ marginRight: '40px' }}
                    >
                      审核通过
                    </Button>
                    <Button
                      type="danger"
                      onClick={() => this.recordError(record.id)}
                    >
                      审核失败
                    </Button>
                  </div> 
                  : record.status == '2' ? 
                    <div>
                      <Button
                        type="primary"
                        disabled
                        style={{ marginRight: '40px' }}
                      >
                        已通过
                      </Button>
                    </div> 
                    :
                    <div>
                      <Button
                        type="danger"
                        disabled
                      >
                        审核失败
                      </Button> 
                    </div> 

                }
                
            </div>
            )
          },
        },
      ],
    };
  }

  componentWillMount = () => {
    this.init();
  }

  recordSuccess = (id,title,price) => {
    this.setState({
      chargeVisible:true,
      currentTitle:title,
      currentPrice:price,
      currentBid:id
    })
  }

  recordError = (id) => {
    this.setState({
      errorVisible:true
    })
  }

  handleOk = (type,id) => {
    let _this = this
    /**
     * 审核通过的逻辑
     */
    if(type == 'charge'){
      ApiClient.post('/api.php?entry=sys&c=business&a=examine&do=adopt',{
        bid:id
      }).then((res) => {
        let result = res.data
        if(result.status == 1){
          message.success(result.message);
          _this.init()
        }else{
          message.error(result.message);
        }
      })
    }else if(type == 'error'){
      ApiClient.post('/api.php?entry=sys&c=business&a=examine&do=refuse',{
        bid:id
      }).then((res) => {
        let result = res.data
        if(result.status == 1){
          message.success(result.message);
          _this.init()
        }else{
          message.error(result.message);
        }
      })
    }
  }

  handleCancel = (type) => {
    let name = type + 'Visible'
    this.setState({
      [name]:false
    })
  }

  init = () => {
    let data = [];
    ApiClient.post('/api.php?entry=sys&c=business&a=examine&do=rechargeList', {}).then(res => {
      let result = res.data;
      console.log(result)
      if (result.status == 1) {
        if (result.data.length > 0) {
          result.data.map((v, i) => {
            let dataItem = {
              id: v.bid,
              title: v.business.title,
              createtime:v.createtime,
              status:v.status,
              price:v.price
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

  render() {
    const { match, children, location } = this.props;

    const { loading,columns,data,errorVisible,chargeVisible,currentTitle,currentPrice,currentBid} = this.state

    return (
      <GridContent>
        <Suspense fallback={<PageLoading />}>
          {/* 充值弹窗 */}
          <Modal
            title="确认充值"
            visible={chargeVisible}
            onOk={() => this.handleOk('charge',currentBid)}
            onCancel={() => this.handleCancel('charge')}
          >
            <p>商家:{currentTitle}</p>
            <p>充值金额:{currentPrice}</p>
            <p>确认给该商家充值吗，此操作不可逆！</p>
          </Modal>
          {/* 审核失败弹窗 */}
          <Modal
            title="确认审核失败"
            visible={errorVisible}
            onOk={() => this.handleOk('error',currentBid)}
            onCancel={() => this.handleCancel('error')}
          >
            <p>确认审核失败？</p>
          </Modal>
          {/* 表格 */}
          <Table columns={columns} dataSource={data} loading={loading} />
        </Suspense>
      </GridContent>
    );
  }
}

export default ChargeRecordList;
