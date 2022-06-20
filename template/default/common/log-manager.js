// 从基础库2.7.1开始，小程序端即可使用实时日志，小游戏端则从基础库2.14.4开始支持。

// 1、调用相关接口。打日志的接口是wx.getRealtimeLogManager，为了兼容旧的版本，建议使用如下代码封装一下，例如封装在log.js文件里面：

let log = wx.getRealtimeLogManager ? wx.getRealtimeLogManager() : null

export default {
  debug() {
    if (!log) return
    log.debug.apply(log, arguments)
  },
  info() {
    if (!log) return
    log.info.apply(log, arguments)
  },
  warn() {
    if (!log) return
    log.warn.apply(log, arguments)
  },
  error() {
    if (!log) return
    log.error.apply(log, arguments)
  },
  setFilterMsg(msg) { // 从基础库2.7.3开始支持
    if (!log || !log.setFilterMsg) return
    if (typeof msg !== 'string') return
    log.setFilterMsg(msg)
  },
  addFilterMsg(msg) { // 从基础库2.8.1开始支持
    if (!log || !log.addFilterMsg) return
    if (typeof msg !== 'string') return
    log.addFilterMsg(msg)
  }
}
