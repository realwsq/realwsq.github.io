var result = [];
var cnt = 0;
var selected = [];
var default_value = {}
default_value['gpa'] = 3.6;
default_value['credit'] = 2;
default_value['prob'] = 0.8;
default_value['score'] = 5;
function conflict(cls) {
	// console.log(cls);
	for (i in selected) {
		if (cls['name'] == selected[i]['name']) return true;
		var t1 = cls.pos;
		var t2 = selected[i].pos;
		for (i in t1) {
			for (j in t2) {
				if(t1[i].semester != t2[j].semester) continue;
				if(t1[i].id == t2[j].id && (t1[i].type ^ t2[j].type != 1)) return true;
			}
		}
		// EXAM TIME NEED!!!!!!!!!!!!!!!!!!!!!!
	}
	return false;
}
function calc(Wcs, cls) {
	// if(cnt < 2) {
	// 	console.log(Wcs);
	// 	console.log(cls);
	// }
	var ret = 0;
	for (key in Wcs) {
		ret += Wcs[key] * (isNaN(parseFloat(cls[key])) ? default_value[key] : parseFloat(cls[key]));
		// if(cnt < 2) {
		// 	console.log(Wcs[key] + ' ' + cls[key] + ' ' + parseFloat(cls[key]) + ' '+ isNaN(parseFloat(cls[key])));
		// 	console.log(ret);
		// }
	}
	return ret;
}
function search(total, W, score, x) {
	if (x == total.length) {
		cnt += 1;
		// console.log(selected.length);
		result.push({ 'score': score, 'selected': selected.slice() });
		// console.log(result[result.length-1]);
		result.sort(function (a, b) {
			var keyA = -a['score'],
				keyB = -b['score'];
			// Compare the 2 dates
			if (keyA < keyB) return -1;
			if (keyA > keyB) return 1;
			return 0;
		});
		if (result.length > 3) {
			result.pop();
		}
		return;
	}
	// console.log(total[x]['list']);
	
	cls = total[x];
	if (conflict(cls) == false) {
		if(cnt < 2) {
			// console.log(score);
			
		}
		selected.push(cls);
		search(total, W, score + calc(W['Must have'], cls), x + 1);
		selected.pop();
	}

	search(total, W, score, x + 1);
}


const dayCN = ['一', '二', '三', '四', '五', '六', '日'];
const semesterCN = ['春', '夏', '秋', '冬', ' '];

function getSpecialTime(raw) {
	if (raw.indexOf('-') == -1) {
		return [parseInt(raw.split('{')[1].split('第')[1].split('周')[0])];
	}
	else {
		const timeArray = raw.split('{')[1].split('第')[1].split('周')[0].split('-').map(x => parseInt(x));
		return Array.from(new Array(timeArray[1] - timeArray[0]).keys()).map(x => x + timeArray[0]); // = range(timeArray[0], timeArray[1])
	}
}

function parseTime(data) {
	data = Array.from(data).filter(x => semesterCN.indexOf(x) == -1).join("");
	if (!data || data == "") return [];
	return data.split(';').reduce((prev, raw) => {
		if (!raw || raw[0] != '周') return prev;
		const infoArray = raw.split('{');
		const timeArray = infoArray[0].split('第')[1].split('节')[0].split(',').map(x => parseInt(x));
		const day = dayCN.indexOf(infoArray[0][1]) + 1;
		const type = !infoArray[1] ? 2 : infoArray[1][0] == '单' ? 1 : infoArray[1][0] == '双' ? 0 : -1;
		const interval = type == 'discrete' ? getSpecialTime(infoArray[1]) : [];
		return prev.concat([{
			day: day,
			time: timeArray,
			ignoreAdjustment: false,
			week: {
				type: type,
				weeks: interval
			}
		}]);
	}, []);
}

function course2TablePos(course) {
	var times = parseTime(course.time.slice());
	// console.log(times);
	var pos = [];
	semesterCN.forEach( semesterCN_ele => {
		if(course.semester.indexOf(semesterCN_ele) != -1) {
			// console.log(semesterCN_ele);
			// console.log(times);
			// console.log('index' + semesterCN.indexOf(semesterCN_ele) % 2);
			times.forEach(day => {
				day.time.forEach( cls => {
					pos.push({
						semester: semesterCN.indexOf(semesterCN_ele) % 2,
						id: day.day + ' ' + cls,
						type: day.week.type
					});
				});
			})
		}
	});
	return pos;
}


function solve(total, W) {
	while (selected.length != 0) {
		selected.pop();
	}
	cnt = 0;
	while (result.length != 0) {
		result.pop();
	}
	for (j in total) {
		total[j]['pos'] = course2TablePos(total[j]);
	}
	// console.log(total[0]);
	search(total, W, 0, 0);

	for (k_num in result) {
		var k = result[k_num];
		var credit = 0;
		var gpa = 0;
		for (j_num in k['selected']) {
			j = k['selected'][j_num];
			credit += Number(j['credit']);
			gpa += Number(j['credit']) * Number(j['gpa']);
		}
		gpa /= credit;
		result[k_num]['credit'] = credit;
		result[k_num]['gpa'] = gpa;
	}	
	return result;
}

// var total = [{ 'course': 'Chinese', 'list': [{ 'teacher': 'yi', 'time': 1, 'exam': 1, 'gpa': 4.00, 'prob': 0.5 }, { 'teacher': 'er', 'time': 2, 'exam': 2, 'gpa': 3.00, 'prob': 0.5 }] },
// { 'course': 'Math', 'list': [{ 'teacher': 'yi', 'time': 1, 'exam': 1, 'gpa': 5.00, 'prob': 0.2 }, { 'teacher': 'er', 'time': 3, 'exam': 3, 'gpa': 5.00, 'prob': 0.7 }] }];
// var total = [{"id":"1","college":"\u5916\u56fd\u8bed\u8a00\u6587\u5316\u4e0e\u56fd\u9645\u4ea4\u6d41\u5b66\u9662","semester":"\u6625\u590f","credit":"1","cid":"05120931","name":"\u9ad8\u7ea7\u82f1\u8bed\u89c6\u542c\u2160","teacher":"Aaron Kalman","time":"\u5468\u4e8c\u7b2c7,8\u8282","location":"\u7d2b\u91d1\u6e2f\u4e1c6-417(\u7f51\u7edc\u4e94\u8fb9\u8bed\u97f3)","type":"\u5fc5\u4fee\u8bfe","gpa":"4.47","total":"79","score":"9.78"},{"id":"3","college":"\u5916\u56fd\u8bed\u8a00\u6587\u5316\u4e0e\u56fd\u9645\u4ea4\u6d41\u5b66\u9662","semester":"\u6625\u590f","credit":"1","cid":"05120941","name":"\u9ad8\u7ea7\u82f1\u8bed\u89c6\u542c\u2161","teacher":"Aaron Kalman","time":"\u5468\u56db\u7b2c11,12\u8282","location":"\u7d2b\u91d1\u6e2f\u4e1c1A-204(\u591a)","type":"\u8f85\u4fee\u8bfe","gpa":"4.86","total":"67","score":"9.78"}];
// console.log('fuck');
// for (k in total) {
// console.log(total[k]['course']);
// }

// /solve(total, W)
// for (k in result) {
// 	console.log(k['score'] + '   ' + len(k['selected']));
// 	for (j in k['selected']) {
// 		console.log('{0: <10}'.format(j['course']), j['attr']['teacher'], j['attr']['time']);
// 	}
// }




