import React, { Component, Suspense } from 'react';
import router from 'umi/router';
import { connect } from 'dva';
import { Input, Button, Row, Col, Calendar, TimePicker,message } from 'antd';
import PageLoading from '@/components/PageLoading';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import IntroCommon from '@/components/IntroCommon';
import styles from './index.less';
import moment from 'moment';
import { deflateRawSync } from 'zlib';
import ApiClient from '@/utils/api';

@connect()
class ArrangeIndex extends Component {
  constructor(props) {
    super(props);
    this.state = {
      timelist:[]
    };
  }

  componentWillMount = () => {
    /**
     * 获取传来的老师id
     */

    let ids = this.props.location.state.id
    ids = JSON.parse(ids)
    this.setState({
      ids
    })
    this.getTime()
  }

  /**
   * 获取初始时间
   */
  getTime = () => {
    let date = new Date()
    let year = date.getFullYear()
    let month = (date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1)
    let day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
    let defaultDay = year + '-' + month + '-' + day
    let hourTime = date.getHours()
    let minutesTime = date.getMinutes()
    this.setState({
      starth:hourTime,
      endh:hourTime,
      startm:minutesTime,
      endm:minutesTime,
      defaultDay
    })
  }

  /**
   * 日历得改变
   */
  onPanelChange = (value) => {
    let date = value.format('YYYY-MM-DD')
    this.setState({
      defaultDay:date
    })
  }

  /**
   * 开始时间结束时间得计算
   */
  onTimeChange = (time,type) => {
    let _this = this
    let timeValue
    if(type == 'starth'){
      timeValue = time.format('HH')
      _this.setState({
        starth:timeValue
      })
    }else if(type == 'startm'){
      timeValue = time.format('mm')
      _this.setState({
        startm:timeValue
      })
    }else if(type == 'endh'){
      timeValue = time.format('HH')
      _this.setState({
        endh:timeValue
      })
    }else if(type == 'endm'){
      timeValue = time.format('mm')
      _this.setState({
        endm:timeValue
      })
    }
  }

  /**
   * 添加日历
   */
  addCalender = () => {
    let { defaultDay,starth,startm,endh,endm,timelist } = this.state
    timelist.push({
      start:defaultDay + ' ' + starth+':'+startm,
      end:defaultDay + ' ' + endh+':'+endm
    })

    this.setState({
      timelist
    })
  }

  /**
   * 删除日历
   */
  deleteCalender = id => {
    let { timelist } = this.state
    timelist.splice(id,1)
    this.setState({
      timelist
    })
  }

  /**
   * 确认提交
   */
  submit = () => {
    let { ids,timelist } = this.state
    let _this = this
    ApiClient.post('/api.php?entry=sys&c=teacher&a=teacherTime&do=teacher_times', {
      tid:ids,
      time:timelist
    }).then(res => {
      let result = res.data
      if(result.status == 1){
        message.success(result.message);
        setTimeout(() => {
          _this.props.history.push('/teacher_list');
        }, 1000);
      }else{
        message.success(result.message);
      }
    });
  }

  /**
   * 取消按钮
   */
  cancel = () => {
    let _this = this
    _this.props.history.push('/teacher_list')
  }

  render() {
    const { match, children, location } = this.props;
    let { timelist,starth,startm,endh,endm } = this.state

    const hour = 'HH';
    const minutes = 'mm';

    return (
      <GridContent>
        <Suspense fallback={<PageLoading />}>
          <div className={styles.tit}>开放时间</div>
          <Row gutter={12} style={{ padding: '20px 0px', position: 'relative' }}>
            <div className={styles.line} />

            <Col span={10} className={styles.mainCol}>
              <div
                style={{
                  width: '75%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Calendar
                  style={{ width: '100%' }}
                  fullscreen={false}
                  onSelect={this.onPanelChange}
                />
              </div>
            </Col>

            <Col span={14}>
              {/* 时间的选择 */}
              <div className={styles.timemain}>
                <Row className={styles.timegroup}>
                  <Col span={10} className={styles.timeitem}>
                    <TimePicker defaultValue={moment(starth, hour)} format={hour} onChange={time => this.onTimeChange(time,'starth')}/>
                    <span>:</span>
                    <TimePicker defaultValue={moment(startm, minutes)} format={minutes} onChange={time => this.onTimeChange(time,'startm')}/>
                  </Col>
                  <Col span={4} className={styles.timecenter}>
                    <div className={styles.itemline} />
                  </Col>
                  <Col span={10} className={styles.timeitem}>
                    <TimePicker defaultValue={moment(endh, hour)} format={hour} onChange={time => this.onTimeChange(time,'endh')}/>
                    <span>:</span>
                    <TimePicker defaultValue={moment(endm, minutes)} format={minutes} onChange={time => this.onTimeChange(time,'endm')}/>
                  </Col>
                </Row>
              </div>

              {/* 时间的列表 */}
              <div className={styles.timemain} style={{display:(timelist.length > 0 ? 'block' : 'none')}}>
                <div className={styles.box}>
                  {timelist ? timelist.map((v,i) => (
                    <div className={styles.boxGroup} key={i}>
                      <div className={styles.boxItemFirst}>{v.start}</div>
                      <div className={styles.boxItemFirst}>{v.end}</div>
                      <div className={styles.boxItemBtn}>
                        <Button type="danger" size="small" onClick={() => this.deleteCalender(i)}>删除</Button>
                      </div>
                    </div>
                  )) : null}
                </div>
              </div>

              {/* 添加 */}
              <div className={styles.timemainSpe}>
                <div className={styles.boxSpe}>
                  <div className={styles.boxGroupSpe}>
                    <Button type="primary" size="small" onClick={() => this.addCalender()}>添加日程+</Button>
                  </div>
                </div>
              </div>

              {/* 添加 */}
              <div className={styles.timemainSpe}>
                <div className={styles.boxSpe}>
                  <div className={styles.btnGroup}>
                    <Button className={styles.btnRight} type="primary" onClick={()=>this.submit()}>确认</Button>
                    <Button onClick={() => this.cancel()}>取消</Button>
                  </div>
                </div>
              </div>

            </Col>
          </Row>
        </Suspense>
      </GridContent>
    );
  }
}

export default ArrangeIndex;
