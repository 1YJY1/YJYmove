// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database();
const order = db.collection('orders')

const MAX_LIMIT = 100;
// 云函数入口函数
exports.main = async (event, context) => {
  //获取集合中记录总数
  const countResult = await order.count();
  const total = countResult.total;
  //计算分几次取
  const batchTimes = Math.ceil(total / MAX_LIMIT);
  const tasks = [];
  for (let i = 0; i < batchTimes; i++) {
    const promise = order.where({_openid:event.openid}).orderBy('time', 'desc').skip(i * MAX_LIMIT).limit(MAX_LIMIT).get();
    tasks.push(promise)
  }
  // 等待所有
  return (await Promise.all(tasks)).reduce((acc, cur) => {
    return {
      data: acc.data.concat(cur.data),
      errMsg: acc.errMsg,
    }
  })
}