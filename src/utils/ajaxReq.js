
/**
 * 网络请求
 */
import fetch from 'dva/fetch';
import router from 'umi/router';
import { getDto } from './dto';
import $ from  'jquery'
import config from '@/config'

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
export default function request3(url, options, method='POST') {
  const token = getDto('TOKEN_VALUE');
  let req_url = config.books + url;
  delete options.body.method;
  return $.ajax({
    headers: {
        "token":token?token:''//此处放置请求到的用户token
    },
    type: method,
    url: req_url,
    data: options.body,
    cache : false,
    dataType : 'json',
    contentType: "application/x-www-form-urlencoded",
    //请求的返回成功的方法
    success: (result)=> {
        return result;
    },
    error: function(err) {
        return err;
    }
  })
  
}