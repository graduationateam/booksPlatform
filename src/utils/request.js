/**
 * 网络请求
 */
import fetch from 'dva/fetch';
import router from 'umi/router';
import { getDto } from './dto';
import { notification, message, Modal } from 'antd';
import hash from 'hash.js';
import config from '@/config'

const isDev = process.env.NODE_ENV === 'development'; // 开发环境
const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};

function parseJSON(response) {
  return response.json();
}
function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }

  const error = new Error(response.statusText);
  error.response = response;
  throw error;
}

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
export default function request(url, options, method='POST') {
  const token = getDto('TOKEN_VALUE');
  let newoptions = {
    headers:{
      'Accept': 'application/json',
      'token':token? token : '',
    },
    method
  }
  newoptions.body = JSON.stringify(options.body);
  if(method === 'POST'){
    newoptions.headers = {
      'Content-Type': 'application/json; charset=utf-8',
      ...newoptions.headers
    }
  }
  let req_url = config.api + url;
  return fetch(`${req_url}`, newoptions)
    .then(checkStatus)
    .then(parseJSON)
    .then(result => {
      if(result.status === "400" || result.status === "401" || result.status === "403") {
        // token过期
        router.push('/user/login');
      }else if(result.status === "1") {
        // 错误，提示
        console.log('错误提示');
      }
      return result;
    })
    .catch(err => ({ err }));
}


