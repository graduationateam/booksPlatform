/**
 * 全局的接口
 */
import request from '@/utils/request';

// 系统参数
export async function sysParam(params) {
  return request('/sys/param/sysParamIndex', {
    body: {
      ...params,
    },
  });
}
