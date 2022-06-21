

const install = (Vue, vm) => {
	const calculateTime = (val = '',endTime = '') => {
		let stime = val;
		console.log(111)
		let etime = new Date();
		// 两个时间戳相差的毫秒数
		let usedTime = etime - stime;
		// 计算相差的天数
		let days = Math.floor(usedTime / (24 * 3600 * 1000));
		// 计算天数后剩余的毫秒数
		let leave1 = usedTime % (24 * 3600 * 1000);
		// 计算出小时数
		let hours = Math.floor(leave1 / (3600 * 1000));
		// 计算小时数后剩余的毫秒数
		let leave2 = leave1 % (3600 * 1000);
		// 计算相差分钟数
		let minutes = Math.floor(leave2 / (60 * 1000));
		let time = '';
		if (days === 0) {
			if (hours === 0) {
				time = minutes + "分钟前";
			} else {
				time = hours + "小时前";
			}
		} else {
			time = days + "天前";
		}
		return time
	}
    const formatTime = (time) => {
	  let newTime 
	  let val = time.split(' ')[0].split('-')
	  val[0] = val[0] + '年'
	  val[1] = val[1] + '月'
	  val[2] = val[2] + '日'
	  newTime = val.join('')
	  return newTime
    }
	const getTime = (time) =>{
	  let year = time.getFullYear()
	  let month = time.getMonth() + 1
	  let day = time.getDate()
	  const parseTime = year+'/'+ month + '/' + day
	  return parseTime
	}
	// 大写转换
    const numbertoUpperCase = (money) =>{
		function moneyToCapital(num) {
		  var fuhao = "";
		  var text = num + "";
  
		  if (text.indexOf("-") > -1) {
			num = text.replace("-", "");
			fuhao = "负";
		  }
  
		  var money1 = new Number(num);
		  var monee = Math.round(money1 * 100).toString(10);
		  var leng = monee.length;
		  var monval = "";
  
		  for (var i = 0; i < leng; i++) {
			monval = monval + to_upper(monee.charAt(i)) + to_mon(leng - i - 1);
		  }
  
		  return fuhao + repace_acc(monval);
		} // 将数字转为大写的中文字
  
  
		function to_upper(a) {
		  switch (a) {
			case "0":
			  return "零";
  
			case "1":
			  return "壹";
  
			case "2":
			  return "贰";
  
			case "3":
			  return "叁";
  
			case "4":
			  return "肆";
  
			case "5":
			  return "伍";
  
			case "6":
			  return "陆";
  
			case "7":
			  return "柒";
  
			case "8":
			  return "捌";
  
			case "9":
			  return "玖";
  
			default:
			  return "";
		  }
		}
  
		function to_mon(a) {
		  if (a > 10) {
			a = a - 8;
			return to_mon(a);
		  }
  
		  switch (a) {
			case 0:
			  return "分";
  
			case 1:
			  return "角";
  
			case 2:
			  return "元";
  
			case 3:
			  return "拾";
  
			case 4:
			  return "佰";
  
			case 5:
			  return "仟";
  
			case 6:
			  return "万";
  
			case 7:
			  return "拾";
  
			case 8:
			  return "佰";
  
			case 9:
			  return "仟";
  
			case 10:
			  return "亿";
		  }
		}
  
		function repace_acc(Money) {
		  Money = Money.replace("零分", "");
		  Money = Money.replace("零角", "零");
		  var yy;
		  var outmoney;
		  outmoney = Money;
		  yy = 0;
  
		  while (true) {
			var lett = outmoney.length;
			outmoney = outmoney.replace("零元", "元");
			outmoney = outmoney.replace("零万", "万");
			outmoney = outmoney.replace("零亿", "亿");
			outmoney = outmoney.replace("零仟", "零");
			outmoney = outmoney.replace("零佰", "零");
			outmoney = outmoney.replace("零零", "零");
			outmoney = outmoney.replace("零拾", "零");
			outmoney = outmoney.replace("亿万", "亿零");
			outmoney = outmoney.replace("万仟", "万零");
			outmoney = outmoney.replace("仟佰", "仟零");
			yy = outmoney.length;
  
			if (yy == lett) {
			  break;
			}
		  }
  
		  yy = outmoney.length;
  
		  if (outmoney.charAt(yy - 1) == "零") {
			outmoney = outmoney.substring(0, yy - 1);
		  }
  
		  yy = outmoney.length;
  
		  if (outmoney.charAt(yy - 1) == "元") {
			outmoney = outmoney + "整";
		  }
  
		  return outmoney;
		}
  
		return moneyToCapital(money);
	  }
	vm.$u.utils = {
		calculateTime,
		formatTime,
		getTime,
		numbertoUpperCase
	}
}

export const ORDER_TYPE = {
	 LEGAL_COUNSEL: '企业法律顾问',
	 WRITE_WRIT: '文书撰写',
	 CREATE_WRIT: '文书生成',
	 IMG_TEXT_CONSULT: '图文咨询',
	 AUDIO_CONSULT: '语音咨询',
	 VIDEO_CONSULT: '视频咨询'
}

export const getOrderType = (name) => {
	switch (name) {
		case ORDER_TYPE.LEGAL_COUNSEL:
			return 1
		case ORDER_TYPE.WRITE_WRIT:
		  return 7
		case ORDER_TYPE.CREATE_WRIT:
			return 8
		case ORDER_TYPE.IMG_TEXT_CONSULT:
			return 4
		case ORDER_TYPE.AUDIO_CONSULT:
			return 5
		case ORDER_TYPE.VIDEO_CONSULT:
			return 6
		default:
			break;
	}
}

export default {
	install
}
