import axios from 'axios';

/**
 * http://teacher.centralsofts.cn/api.php?entry=app&c=wxapp&a=userinfo&do=display
 **/
axios.defaults.baseURL = 'http://teacher.centralsofts.cn';
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

// 常用工具集合
const ApiClient = {
  /**
   * 请求接口get
   */
  async get(url, paramsData) {
    console.log(paramsData);
    let axiosReturn = await axios.get(url, { params: paramsData });
    return axiosReturn;
  },

  /**
   * 请求接口post
   */
  async post(url, paramsData) {
    let axiosReturn = await axios({
      method: 'post',
      url: url,
      data: { ...paramsData },
    });
    return axiosReturn;
  },

  /**
   * 获取code 解析url
   */
  reduceUrl(url) {
    let urlTxt = url.replace('?', '');
    if (urlTxt.includes('&')) {
      let urlAry = urlTxt.split('&');
      let code = urlAry[0].split('=')[1];
      return code;
    } else {
      return false;
    }
  },
  /**
   * 根据路由修改title
   */
  setTitle(title) {
    document.title = title;
  },

  /**
   * 选择月 日
   */
  setDay(month) {
    let daylists = [];
    if (month == '2') {
      for (var i = 1; i <= 28; i++) {
        daylists.push({
          label: i + '日',
          value: i,
        });
      }
    } else if (month == '4' || month == '6' || month == '9' || month == '11') {
      for (var i = 1; i <= 30; i++) {
        daylists.push({
          label: i + '日',
          value: i,
        });
      }
    } else {
      for (var i = 1; i <= 31; i++) {
        daylists.push({
          label: i + '日',
          value: i,
        });
      }
    }
    return daylists;
  },
};

export default ApiClient;
