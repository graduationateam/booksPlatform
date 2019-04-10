/**
 * utils
 */

export default class Utils {
  /**
   * 日期处理 （年月日）
   * @param {String} date 日期
   */
  static dateDeal = (date) => {
    if(!date) return '';
    if(typeof(date) === 'string') {
      return date.split(' ')[0]
    }else {
      return date.format('YYYY-MM-DD');
    }
  }

  /**
   * 处理金额
   * @param {Number} price 金额
   * @returns {String} 金额（保留两位小数）
   */
  static priceDeal = (price) => {
    const fPrice = price * 1;
    if(!fPrice) {
      return 0;
    }
    return fPrice.toFixed(2);
  }


  /**
   * 转换成有层级的数组，一般用于树形
   * @param {Array} list
   * @param {String} parm
   * @param {String} fparm
   * @param {String} pval 顶级的值
   */
  static convertArr(list, pval, parm='id', fparm='parent_id') {
    let arr = [];
    for (let i = 0; i < list.length; i++) {
      if(list[i][fparm] == pval) {
        let obj = list[i];
        obj.childs = Utils.convertArr(list, list[i][parm], parm, fparm)
        arr.push(obj)
      }
    }
    return arr;
  }

  static converCheck(list,keyId='id',keyName='name'){
    let arr=[];
    for(let i=0;i<list.length;i++){
      let obj=list[i];
      obj.value=obj[keyId];
      obj.label=obj[keyName];
      arr.push(obj);
    }
    return arr;
  }

}
