//字符串拼接
function strFormat(str) {
	return str < 10 ? `0${str}` : str
}
// 获取当前时间
export function currentTime() {
	const myDate = new Date();
	const y = myDate.getFullYear()
	const m = myDate.getMonth() + 1;
	const d = myDate.getDate();
	const date = y + '-' + strFormat(m) + '-' + strFormat(d);

	const hour = myDate.getHours()
	const min = myDate.getMinutes()
	const secon = myDate.getSeconds()
	const time = strFormat(hour) + ':' + strFormat(min) + ':' + strFormat(secon);
	return {
		date,
		time
	}
}

//时间戳转日期
export function timeStamp(time, useSS = true) {
	const dates = new Date(time)
	const year = dates.getFullYear()
	const month = dates.getMonth() + 1
	const date = dates.getDate()
	const day = dates.getDay()
	const hour = dates.getHours()
	const min = dates.getMinutes()
	const days = ['日', '一', '二', '三', '四', '五', '六']
	return {
		allDate: `${year}/${strFormat(month)}/${strFormat(date)}`,
		date: `${strFormat(year)}-${strFormat(month)}-${strFormat(date)}`, //返回的日期 07-01
		day: `星期${days[day]}`, //返回的礼拜天数  星期一
		hour: strFormat(hour) + ':' + strFormat(min) + (useSS ? ':00' : '') //返回的时钟 08:00
	}
}

//获取最近7天的日期和礼拜天数
export function initData() {
	const time = []
	const date = new Date()

	const now = date.getTime() //获取当前日期的时间戳
	let timeStr = 3600 * 24 * 1000 //一天的时间戳
	let obj = {
		0: "今天",
		1: "明天",
		2: "后天"
	}
	for (let i = 0;i < 7;i++) {
		const timeObj = {}
		timeObj.date = timeStamp(now + timeStr * i).date //保存日期
		timeObj.timeStamp = now + timeStr * i //保存时间戳
		timeObj.week = obj[i] ?? timeStamp(now + timeStr * i).day
		time.push(timeObj)
	}
	return time
}

//时间数组
export function initTime(workList, timeInterval = 1) {
	const time = []
	/* 工作时间 */
	workList.forEach((item, index) => {
		const startTimeStamp = new Date(item.startTime.replace(/-/g, "/")).getTime()
		const endTimeStamp = new Date(item.endTime.replace(/-/g, "/")).getTime()
		const timeStr = 3600 * 1000 * timeInterval
		for (let i = startTimeStamp;i < endTimeStamp;i = i + timeStr) {
			const timeObj = {}
			timeObj.time = timeStamp(i, false).hour
			timeObj.disable = false
			time.push(timeObj)
		}
	});
	return time
}

export function isInRange(a, b) {
	// 11:15~11:30
	// 11:15~11:30
	if (!a.startTime || !a.endTime || !b.startTime || !b.endTime) return false;
	if (a.startTime > b.startTime && a.startTime < b.endTime) {
		//起点包含在范围内
		return true;
	}
	if (a.endTime > b.startTime && a.endTime <= b.endTime) {
		//终点包含在范围内
		console.log(timeStamp(a.endTime).hour, '1111');

		return true;

	}
	if (a.startTime <= b.startTime && a.endTime > b.endTime) {
		console.log(timeStamp(a.endTime).hour, '2222');

		//b包含在a里面
		return true;


	}
	if (a.startTime >= b.startTime && a.endTime < b.endTime) {
		console.log(timeStamp(a.endTime).hour, '3333');
		//a包含在b里面
		return true;


	}

	return false;

}