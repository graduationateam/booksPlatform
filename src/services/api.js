import request from '@/utils/request';
import ajaxReq from '@/utils/ajaxReq';
//分页列表请求
export async function listReq(params) {
    if(!params || !params.count) {
      params = {
        ...params,
        count: 10,
        currpage: 1
      }
    }else{
      params = {
        ...params,
      }
    }
    return request(params.method, {
      body: {
        ...params,
      },
    });
  }
  // 通用请求
  export async function Req(params) {
    // console.log(params)
    return request(params.method, {
      body: {
        ...params,
      },
    });
  }

   // 二手书接口请求
   export async function Req2(params) {
    // console.log(params)
    return ajaxReq(params.method, {
      body: {
        ...params,
      },
    });
  }