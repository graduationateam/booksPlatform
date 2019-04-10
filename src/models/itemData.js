/**
 * 数据字典
 */
import { Req } from '@/services/api';
import {  message } from 'antd';

const numToKey = (num) => {
  let key = '';
  switch (num) {
    // 角色组别
    case '1001':
      key = 'roleGroup';
      break;
    // 架构类型
    case '1002':
      key = 'orgType';
      break;
    // 用户组别
    case '1003':
      key = 'userGroup';
      break;
    // 用户组别
    case '1004':
      key = 'nationData';
      break;
    // 教师职务
    case '1005':
      key = 'dutieData';
      break;
    // 教师职称
    case '1006':
      key = 'titleData';
      break;
    // 学科
    case '1009':
      key = 'subjectData';
      break;
    // 活动类型
    case '1010':
      key = 'actTypeData';
      break;
    // 活动性质
    case '1012':
      key = 'actNatureData';
      break;
    //打卡频次
    case '1013':
      key = 'actNoteFrequencyData';
      break;
    //评分标准
    case '1014':
      key = 'standardData';
      break;
    // 能力素质目标
    case '1015':
      key= 'abilityTargetData';
      break;
    //积分类型
    case '1016':
      key='integralTypeData';
      break;
    //题型
    case '1017':
      key='exericseTypeData';
      break;
    //难易程度
    case '1018':
      key='difficultyData';
      break;
    //认知能力目标
    case '1019':
      key='coreLiteracyData';
      break;
    //教材版本
    case 'BB00001':
      key = 'editionData';
      break;
    // 文件类型
    case 'fileType':
      key = 'fileTypeData';
      break;
    default:
      break;
  }
  return key;
}

export default {
  namespace: 'itemData',

  state: {
    roleGroup: [], // 角色组别
    orgType: [], // 架构类型
    userGroup: [], // 用户组别
    nationData: [],//民族
    dutieData: [], //职务
    titleData: [], //职称
    subjectData: [], //学科
    editionData: [], //版本
    actTypeData: [],//活动类型
    actNatureData: [],//活动性质
    actNoteFrequencyData: [],//打卡频次
    standardData: [],//活动评分标准
    fileTypeData: [], //文件类型
    abilityTargetData:[],//能力素质目标
    integralTypeData:[],//积分类型
    exericseTypeData:[],//题型
    difficultyData:[],//难易程度
    coreLiteracyData:[],//认知能力目标
  },

  effects: {
    // 获取数据字典
    *get({ num, callback,payload }, { call, put, select }) {
      const key = numToKey(num);
      const data = yield select(state => state.itemData[key]);
      if(data.length > 0) return; // 该字典已存在，不需要调用了
      const res = yield call(Req, { typeNumber: num ,...payload});
      if(res.status != '0') {
        if(res.status == '1') {
          message.error(res.msg);
          return
        }
        return
      }
      yield put({
        type: '_update',
        payload: {
          data: res.data,
          num
        },
      });

      if (callback) callback(res.data);
    },

  },

  reducers: {
    // 清楚数据字典（用于修改了字典）
    _remove(state) {
      const fdata = {};
      for (let key in state) {
        fdata[key] = [];
      }
      return fdata;
    },
    // 更新
    _update(state, action) {
      const key = numToKey(action.payload.num);
      return {
        ...state,
        [key]: action.payload.data,
      };
    },

  },
};
