import moment from 'moment';
import _ from 'lodash';
import {createFromIconfontCN} from '@ant-design/icons';
import {Descriptions} from "antd";

export const icon_font_url = '//at.alicdn.com/t/c/font_3886045_cd6utaiz83i.js';

// TODO: 系统五字码
export const SYSTEM_ID = 99003;
export const SYSTEM_KEY_TEST = '2e6a8552-1a36-4d02-bd9f-8d83f2d528a9';

// TODO: 自定义图标使用 【For Example: <IconFont type={'icon-create'} />】
export const IconFont = createFromIconfontCN({scriptUrl: icon_font_url,});
//检测浏览器语言   navigator.language;   //判断除IE外其他浏览器使用语言
export const LOCAL_LANGUAGE = false;
// export const LOCAL_LANGUAGE = navigator.language === 'en-US';

// TODO: 定义字符串 id <时间戳字符串>
export const ID_STRING = () => 'ID_' + Date.now().toString();

// TODO: 获取时区
export const CURRENT_TIMEZONE = Intl.DateTimeFormat().resolvedOptions().timeZone;
// export const local_timezone = pytz.timezone(CURRENT_TIMEZONE);


// TODO: 栅格布局
export const rowGrid = { xs: 8, sm: 16, md: 24, lg: 32 };
export const colGrid = { span: 6, xs: 8, md: 8, lg: 6, xl: 6, xxl: 4 };

/**
 * @Description: TODO: 获取当前所在时区数
 * @author XXQ
 * @date 2023/9/26
 * @returns
 */
export function LOCAL_TIME_ZONE() {
    // TODO: 使用getTimezoneOffset()方法来获取当前时区。这个方法返回当前时区与 UTC 相差的分钟数(比如：在东8区，返回-480。)
    const localTimeZone = new Date().getTimezoneOffset();
    // TODO: 转成小时数并返回
    return keepDecimal(localTimeZone / 60, 0);
}


/**
 * 用于并排显示
 * @param label {number}
 * @param wrapper {number}
 * @returns {{wrapperCol: {sm: {span: *}}, labelCol: {sm: {span: *}}}}
 * @constructor
 */
export function ItemLayout(label: number, wrapper: number) {
    return {
        labelCol: {sm: {span: label}},
        wrapperCol: {sm: {span: wrapper}},
    };
}

/**
 * @Description: TODO: 整理后台返回的数据，重组，用于 PorTable 数据结构
 * @author XXQ
 * @date 2023/5/15
 * @param response  接口返回结果
 * @returns
 */
export function getTableDataFormat (response: any = {}) {
    return {
        success: response.Result,
        total: response.Page?.ItemTotal,
        data: response.Content,
    }
}

/**
 * 金额中文大写
 * @param money
 * @returns {*}
 */
export function digitUppercase(money: any) {
    //汉字的数字
    const cnNums = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'];
    //基本单位
    const cnIntRadiance = ['', '拾', '佰', '仟'];
    //对应整数部分扩展单位
    const cnIntUnits = ['', '万', '亿', '兆'];
    //对应小数部分单位
    const cnDecUnits = ['角', '分', '毫', '厘'];
    //整数金额时后面跟的字符
    const cnInteger = '整';
    //整型完以后的单位
    const cnIntLast = '元';
    //最大处理的数字
    const maxNum = 999999999999999.9999;
    //输出的中文金额字符串
    let chineseStr = '';
    //分离金额后用的数组，预定义
    if (money == '') {
        return '';
    }
    const num = Number(money);
    if (num >= maxNum) {
        //超出最大处理数字
        return '';
    }
    if (num == 0) {
        chineseStr = cnNums[0] + cnIntLast + cnInteger;
        return chineseStr;
    }
    //转换为字符串
    const numDealStr = _.cloneDeep(money).toString();
    const parts = numDealStr.split('.');
    //金额整数部分
    const integerNumStr = parts[0];
    //金额小数部分
    const decimalNumStr = parts[1]?.substring(0, 4) || '';
    //获取整型部分转换
    if (parseInt(integerNumStr, 10) > 0) {
        let zeroCount = 0;
        const IntLen = integerNumStr.length;
        for (let i = 0; i < IntLen; i++) {
            const n = integerNumStr.substring(i, 1);
            const p = IntLen - i - 1;
            const q = p / 4;
            const m = p % 4;
            if (n == '0') {
                zeroCount++;
            } else {
                if (zeroCount > 0) {
                    chineseStr += cnNums[0];
                }
                //归零
                zeroCount = 0;
                chineseStr += cnNums[parseInt(n)] + cnIntRadiance[m];
            }
            if (m == 0 && zeroCount < 4) {
                chineseStr += cnIntUnits[q];
            }
        }
        chineseStr += cnIntLast;
    }
    //小数部分
    if (decimalNumStr != '') {
        const decLen = decimalNumStr.length;
        for (let i = 0; i < decLen; i++) {
            const n = decimalNumStr.substring(i, 1);
            if (n != '0') {
                chineseStr += cnNums[Number(n)] + cnDecUnits[i];
            }
        }
    }
    if (chineseStr == '') {
        chineseStr += cnNums[0] + cnIntLast + cnInteger;
    } else if (decimalNumStr == '') {
        chineseStr += cnInteger;
    }
    return chineseStr;
}

export function isUrl(path: string) {
    const reg = /^(?:([A-Za-z]+):)?(\/{0,3})([0-9.\-A-Za-z]+)(?::(\d+))?(?:\/([^?#]*))?(?:\?([^#]*))?(?:#(.*))?$/;
    // const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/g;
    return reg.test(path);
}

/**
 * 日期格式化
 * @param value
 * @returns {*}
 */
export function dateFormat(value: any) {
    let result = null;
    if (value) {
        result = moment(value, 'YYYY-MM-DD')
    }
    return result;
}


/**
 * 各币种币别中英文全称
 * @param currency
 * @returns {string}
 */
function currencyUnit(currency: string) {
    let currCountryName = 'Dollars',
        currUnit = 'DOLLAR',
        currDecimal = 'CENTS';
    switch (currency) {
        case 'CNY':
            currCountryName = 'Chinese Yuan';
            currUnit = 'YUAN';
            currDecimal = 'FEN';
            break;
        case 'GBP':
            currCountryName = 'GreatBritain Pound';
            break;
        case 'HKD':
            currCountryName = 'HK Dollars';
            break;
        case 'USD':
            currCountryName = 'US Dollars';
            break;
        case 'SGD':
            currCountryName = 'Singapore Dollars';
            break;
        case 'JPY':
            currCountryName = 'Japanese Yen';
            break;
        case 'CAD':
            currCountryName = 'Canadian Dollars';
            break;
        case 'AUD':
            currCountryName = 'Australian Dollars';
            break;
        case 'EUR':
            currCountryName = 'Euro';
            break;
        case 'NZD':
            currCountryName = 'New Zealand Dollars';
            break;
        default:
            break;
    }
    return {
        currCountryName: currCountryName.toUpperCase(),
        currUnit,
        currDecimal,
    };
}

//region 金额英文大写
/**
 *  金额英文大写
 * @param amount    需要转换的数据
 * @param currency  转换的币种单位
 * @returns {string}
 */
export function SayTotal(amount: number, currency: string) {
    if (!amount || typeof (amount) == 'undefined' || amount == 0) return;
    // 获得币种的单位信息
    const currUnit = currencyUnit(currency);
    // 把币种转成
    const str = _.cloneDeep(amount).toString();
    // 整数位
    const intNumStr = str.split('.')[0];
    let result = `SAY TOTAL ${currUnit.currCountryName} ${transToEnglish(intNumStr)} ${currUnit.currUnit}`;
    // 小数位
    const decimalNumStr = str.split('.')[1] || '';
    // 当有小数位时，转成英文且添加到单位
    if (decimalNumStr && Number(decimalNumStr) > 0) {
        result += ` ${transToEnglish(decimalNumStr)} ${currUnit.currDecimal}`;
    }
    return result;
}

const arr1 = ['hundred', ' thousand', ' million', ' billion'],
    arr2 = ['zero', 'ten', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'],
    arr3 = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'],
    arr4 = ['ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen']

function transToEnglish(num: any) {
    const b = num.length,
        e = Math.ceil(b / 3),
        k = b - e * 3;
    let f, h = 0, g = "";
    for (f = k; f < b; f += 3) {
        ++h;
        const num3 = f >= 0 ? num.substring(f, f + 3) : num.substring(0, k + 3);
        const strEng = toEnglish(num3);
        if (strEng != "") {
            if (g != "") g += ' ';
            g += toEnglish(num3) + arr1[e - h];
        }
    }
    return g.toUpperCase();
}

function toEnglish(num: any) {
    let numStr = _.cloneDeep(num), strRet = "";
    if (numStr.length == 3 && numStr.substring(0, 3) != '000') {
        if (numStr.substring(0, 1) != '0') {
            strRet += arr3[numStr.substring(0, 1)] + ' hundred';
            if (numStr.substring(1, 2) != '00') strRet += ' and ';
        }
        numStr = numStr.substring(1);
    }
    if (numStr.length == 2) if (numStr.substring(0, 1) == '0') numStr = numStr.substring(1);
    else if (numStr.substring(0, 1) == '1') strRet += arr4[numStr.substring(1, 2)];
    else {
        strRet += arr2[numStr.substring(0, 1)];
        if (numStr.substring(1, 1) != '0') strRet += ' ';
        numStr = numStr.substring(1);
    }
    if (numStr.length == 1 && numStr.substring(0, 1) != '0') strRet += arr3[numStr.substring(0, 1)];
    return strRet;
}

//endregion


// 货代  工程
/**
 * @Description: 货物类型
 * @author XXQ
 * @date 2022/12/15
 * @param text
 * @returns
 */
export function getCTNMode(text: string) {
    const Lang = LOCAL_LANGUAGE;
    let result = null;
    switch (text) {
        case "整箱":
            return result = Lang ? "整箱" : "FCL";
        case "散货":
            return result = Lang ? "散货" : "BB";
        case "拼箱":
            return result = Lang ? "拼箱" : "LCL";
        default:
            break;
    }
    return result;
}

/**
 * @Description: 费用状态
 * @author XXQ
 * @date 2022/12/15
 * @param text
 * @returns
 */
export function getStatus(text: string) {
    const Lang = LOCAL_LANGUAGE;
    let result = null;
    const isWY = false;
    switch (text) {
        case "初始录入":
            result = Lang ? "初始录入" : "Draft";
            break;
        case "提交主管":
            result = Lang ? "提交主管" : "Submitted";
            break;
        case "提交销售":
            if (isWY) {
                result = Lang ? "提交销售" : "Submit Sales";
            } else {
                result = Lang ? "提交总经理" : "Submit GM";
            }
            break;
        case "销售确认":
            result = Lang ? "销售确认" : "Sales Confirmation";
            break;
        case "主管确认":
            result = Lang ? "待做账单" : "Approved";
            break;
        case "财务对账":
            result = Lang ? "财务对账" : "Bill Issued";
            break;
        case "财务开票":
            result = Lang ? "财务开票" : "Invoice Issued";
            break;
        case "财务审核":
            result = Lang ? "财务审核" : "Financial Confirmed";
            break;
        case "部分核销":
            result = Lang ? "部分核销" : "Partial Settled";
            break;
        case "全部核销":
            result = Lang ? "全部核销" : "Completed";
            break;
        default:
            break;
    }
    return result;
}

/**
 * @Description: 数值加上千分符号，返回字符串
 * @author XXQ
 * @date 2022/12/15
 * @param amount
 * @returns {string}
 */
export function formatNumToMoney(amount: any) {
    if (amount) {
        const strArr = amount?.toString()?.split('.') || [];
        let result = String(strArr[0]).replace(/(\d)(?=(\d{3})+(?:\.\d+)?$)/g, "$1,");
        // TODO: 小数位不用分号
        if (strArr?.length > 1 && strArr[1]) {
            result += '.' + String(strArr[1]);
        }
        return result;
    } else {
        // return amount;
        return '0';
    }
}

/**
 * @Description: 替换数值输入框内的千分符号,返回数字
 * @author XXQ
 * @date 2022/12/15
 * @param numberStr
 * @returns {number}
 */
export function parseMoneyToNum(numberStr: string) {
    // 去除空格
    const number = numberStr.replace(/ /g, "");
    return parseFloat(number.replace(/,/g, ''));
}

/**
 * @Description: 保留固定小数位；默认保留两位
 * @author XXQ
 * @date 2022/12/15
 * @param num   原始数值
 * @param len   保留长度
 * @returns {Number} 保留之后在数字
 */
export function keepDecimal(num: number, len = 2) {
    //先对参数进行绝对值处理（因为四舍五入的规则不满足负数），然后再转为负数
    let finalNum = Math.abs(num);
    // //解决前台计算精度丢失问题
    // let str, pos, floatLen, times;
    // str = finalNum + '';
    // pos = str.indexOf('.');
    // floatLen = str.substring(pos+1).length;
    // times = Math.pow(10, floatLen);
    // finalNum = _.round(finalNum*times)/times;

    finalNum = _.round(finalNum, len);
    finalNum = num < 0 ? finalNum * -1 : finalNum;
    return finalNum;
}

//region 【加、减、乘、除】四个方法
/**
 * @Description: 将一个浮点数转成整数，返回整数和倍数。如 3.14 >> 314，倍数是 100
 * @author XXQ
 * @date 2022/12/15
 * @param floatNum
 * @returns {object} {times:100, num: 314}
 */
export function toInteger(floatNum: number) {
    const ret = {times: 1, num: 0}
    const isNegative = floatNum < 0;
    // 判断是不是一个整数
    if (floatNum % 1 === 0) {
        ret.num = floatNum
        return ret
    }
    const strFloat = floatNum.toString();
    const dotPos = strFloat.indexOf('.')
    const times = Math.pow(10, strFloat.substring(dotPos + 1).length)
    let intNum = parseInt(String(Math.abs(floatNum) * times + 0.5), 10)
    ret.times = times
    if (isNegative) {
        intNum = -intNum
    }
    ret.num = intNum
    return ret
}

/**
 * @Description: 核心方法，实现加减乘除运算，确保不丢失精度
 *  思路：把小数放大为整数（乘），进行算术运算，再缩小为小数（除）
 * @author XXQ
 * @date 2022/12/15
 * @param a {number} 运算数1
 * @param b {number} 运算数2
 * @param op {string} 运算类型，有加减乘除（add/subtract/multiply/divide）
 * @returns
 */
export function operation(a: number, b: number, op: string) {
    const o1 = toInteger(a)
    const o2 = toInteger(b)
    const n1 = o1.num
    const n2 = o2.num
    const t1 = o1.times
    const t2 = o2.times
    const max = t1 > t2 ? t1 : t2
    let result = null;
    switch (op) {
        case 'add':
            if (t1 === t2) { // 两个小数位数相同
                result = n1 + n2
            } else if (t1 > t2) { // o1 小数位 大于 o2
                result = n1 + n2 * (t1 / t2)
            } else { // o1 小数位 小于 o2
                result = n1 * (t2 / t1) + n2
            }
            result = result / max;
            break;
        case 'subtract':
            if (t1 === t2) {
                result = n1 - n2
            } else if (t1 > t2) {
                result = n1 - n2 * (t1 / t2)
            } else {
                result = n1 * (t2 / t1) - n2
            }
            result = result / max;
            break;
        case 'multiply':
            result = (n1 * n2) / (t1 * t2);
            break;
        case 'divide':
            result = (n1 / n2) * (t2 / t1);
            break;
        default:
            break;
    }
    return result;
}

/**
 * @Description: 加减乘除的四个接口：add()、subtract()、multiply()、divide()
 * @author XXQ
 * @date 2022/12/15
 * @param a
 * @param b
 * @returns
 */
export function add(a: number, b: number) {
    return operation(a, b, 'add')
}

export function subtract(a: number, b: number) {
    return operation(a, b, 'subtract')
}

export function multiply(a: number, b: number) {
    return operation(a, b, 'multiply')
}

export function divide(a: number, b: number) {
    return operation(a, b, 'divide')
}

//endregion

/**
 * @Description: 向下取整（直接取整数）
 * @author XXQ
 * @date 2022/12/15
 * @param num
 * @param state up: 向上取整数;  down：向下取整数
 * @param needDecimal   是否保留小数位
 * @returns
 */
export function getFormatIDToNum(num: number, state = 'up', needDecimal = false) {
    let number = num;
    if (number && !isNaN(num)) {
        if (state === 'up') {
            // Math.ceil()  “向上取整”， 即小数部分直接舍去，并向正数部分进1
            if (needDecimal) {
                number = Math.ceil(num * 100) / 100;
            } else {
                number = Math.floor(num);
            }
        } else {
            //  Math.floor()  “向下取整” ，即小数部分直接舍去
            number = Math.floor(num);
        }
    }
    return number;
}

/**
 * @Description: TODO 显示 label
 * @author XXQ
 * @date 2023/2/9
 * @param code  提示信息的值
 * @param intl  显示方法
 * @param defaultMessage   默认显示值
 * @returns
 */
export function getTitleInfo(code: string, intl: any, defaultMessage: string) {
    const str = 'pages.sys.';
    return intl?.formatMessage({id: str + code, defaultMessage});
}

/**
 * @Description: TODO 选择账期月
 * @author XXQ
 * @date 2023/5/3
 * @returns
 * @param FinanceDates
 */
export function selectBillingMonth(FinanceDates: string[]) {
    /*return FinanceDates.map((dateString) => {
        const date1 = new Date(dateString + "-01");
        return date1.toLocaleString("default", {year: "numeric", month: "long"});
    });*/
    const billingMonth = {}

    /*const FinanceDate = FinanceDates.map((dateString) => {
        const date1 = new Date(dateString + "-01");
        return date1.toLocaleString("default", {year: "numeric", month: "long"});
    })
    console.log(FinanceDate)*/


    for (const date of FinanceDates) {
        const dateObj = new Date(date);
        billingMonth[date] = `${dateObj.toLocaleString('en-US', {month: 'long'})} ${dateObj.getFullYear()}`;
    }
    console.log(FinanceDates)
    console.log(billingMonth)

    return billingMonth;
}

/**
 * @Description: TODO:
 * @author XXQ
 * @date 2023/5/5
 * @param data          需要转的数据
 * @param fieldKey      转的数据的 id 值
 * @param fieldValue    转的数据的 name 值
 * @returns
 */
export function getLabel$Value (data: any = [], fieldKey = 'Key', fieldValue = 'Value') {
    let result = data;
    if (data?.length > 0) {
        result = data.map((x: any)=> ({...x, value: x[fieldKey], label: x[fieldValue]}))
    }
    return result;
}

/**
 * @Description: TODO:
 * @author XXQ
 * @date 2023/5/6
 * @param data              要处理的数据
 * @param fieldKey          id
 * @param fieldValue        name
 * @param childrenName      子数据名
 * @param childFieldKey     子数据 id
 * @param childFieldValue   子数据 name
 * @returns
 */
export function getTreeSelectTitle$Value (
    data: any = [], fieldKey = 'Key', fieldValue = 'Value',
    childrenName = 'children', childFieldKey = 'Key', childFieldValue = 'Value',
) {
    let result: any[] = [];
    if (data?.length > 0) {
        result = data.map((item: any)=> ({
            key: item[fieldKey],
            value: item[fieldKey],
            title: item[fieldValue],
            children: item[childrenName]?.map((child: any)=> ({
                key: child[childFieldKey],
                value: child[childFieldKey],
                title: child[childFieldValue]
            }))
        }));
    }
    return result;
}


/**
 * 将后台返回的行业数据转换成 TreeSelect 可以识别的形式
 * 3级行业
 * @param Arr
 * @param LineID
 * @returns {[{disabled: boolean, title: (string), value: string, key: string}]}
 * @constructor
 */
/**
 * @Description: TODO: 行业类型处理
 * @author XXQ
 * @date 2023/5/6
 * @param data      行业数据
 * @param LineID    业务线
 * @returns
 */
export function getTransIndustryListToLine(data: any[] = [], LineID: number) {
    const IndustryList: any[] = []
    let IndustryListTOLine: any[] = [];
    if (data?.length > 0) {
        data.map((x: any) => {
            const ChildrenList: any[] = [];
            if (x.industrys?.length > 0) {
                x.industrys.map((y: any) => {
                    ChildrenList.push({
                        title: y.NameEN,
                        value: y.IndustryID,
                        key: y.IndustryID,
                        remark: y.RemarkEN,
                    });
                });
            }
            IndustryList.push({
                title: x.NameEN,
                value: `I-${x.PrimaryID}`,
                key: `I-${x.PrimaryID}`,
                disabled: true,
                children: ChildrenList,
            });
        });
    }
    // Other 不用嵌套三层
    if (LineID === 5) {
        IndustryListTOLine = [
            {
                title: 'Other',
                value: 75,
                key: 75,
            }
        ];
    } else {
        IndustryListTOLine = IndustryList;
    }
    return IndustryListTOLine;
}

/**
 * @Description: TODO: Form 表单错误信息解析
 * @author XXQ
 * @date 2023/5/10
 * @param errorInfo     Form 表单提交时错误信息
 * @returns
 */
export function getFormErrorMsg(errorInfo: any = []) {
    /** 错误信息 */
    let errInfo = '';
    // TODO: 提交失败。弹出错误提示
    const {errorFields} = errorInfo;
    if (errorFields?.length > 0) {
        const errList = errorFields.map((x: any) => x.errors[0]);
        // TODO: 去重
        const errArr: any = Array.from(new Set(errList));
        errInfo = errArr.toString().replace(/,/g, '  /  ');
        // errInfo += '  is required!';
    }
    return errInfo;
}

export function HeaderInfo(NBasicInfo: any) {
    return (
        <Descriptions className={'headerList'} size="small" column={{xs: 1, sm: 1, md: 2, lg: 3, xl: 3, xxl: 7}}>
            <Descriptions.Item
                label="Business Line">{NBasicInfo?.businessLine}</Descriptions.Item>
            <Descriptions.Item label="Job No.">{NBasicInfo?.jobNo}</Descriptions.Item>
            <Descriptions.Item label="Shipment Type">{NBasicInfo?.shipmentType}</Descriptions.Item>
            <Descriptions.Item label="Sales">{NBasicInfo?.sales}</Descriptions.Item>
            <Descriptions.Item label="Creator">{NBasicInfo?.creator}</Descriptions.Item>
            <Descriptions.Item
                label="Taking Date">{NBasicInfo?.takingDate}</Descriptions.Item>
            <Descriptions.Item
                label="Last Modified">{NBasicInfo?.lastEditor}{NBasicInfo?.lastModified ? ' / ' : ''}{NBasicInfo?.lastModified}</Descriptions.Item>
        </Descriptions>
    )
}

/**
 * @Description: TODO: 计算从特定日期到现在的年数
 * @author XXQ
 * @date 2023/6/27
 * @param data  指定的具体日期
 * @returns
 */
export function getDiffYears(data: string) {
    const specifiedDate = new Date(data);
    // 当前日期
    const currentDate = new Date();
    // 计算年份差异
    let diffYears: number = currentDate.getFullYear() - specifiedDate.getFullYear();
    // 考虑月份和日期的差异
    if (currentDate.getMonth() < specifiedDate.getMonth() ||
        (currentDate.getMonth() === specifiedDate.getMonth() &&
            currentDate.getDate() < specifiedDate.getDate())
    ) {
        diffYears--;
    }
    // 返回从指定日期到现在的年数
    return diffYears;
}

/**
 * @Description: TODO: 信控分数计算方法
 * @author XXQ
 * @date 2023/6/28
 * @param target    信控分数行
 * @param op_node   操作的节点
 * @param op_value  节点判断的值
 * @returns
 */
export function getCreditScore (target: any, op_node: number, op_value: any) {
    let score: number = 0, percentage: number = 0.1;
    switch (op_node) {
        case 1: // TODO: 注册资金
            percentage = 0.2;
            if (op_value <= 100000) {
                score = 1;
            } else if (100000 < op_value && op_value <= 500000) {
                score = 2;
            } else if (500000 < op_value && op_value <= 2000000) {
                score = 3;
            } else if (2000000 < op_value && op_value <= 5000000) {
                score = 4;
            } else if (5000000 < op_value) {
                score = 5;
            }
            break;
        case 2: // TODO: 注册时间（年限）
            percentage = 0.1;
            const estimated_monthly: number = getDiffYears(op_value);
            if (estimated_monthly <= 1) {
                score = 1;
            } else if (1 < estimated_monthly && estimated_monthly <= 3) {
                score = 2;
            } else if (4 <= estimated_monthly && estimated_monthly <= 5) {
                score = 3;
            } else if (6 <= estimated_monthly && estimated_monthly <= 7) {
                score = 4;
            } else if (7 < estimated_monthly) {
                score = 5;
            }
            break;
        case 3: // TODO: 行业地位
            percentage = 0.1;
            score = op_value;
            break;
        case 4: // TODO: 信用状态
            percentage = 0.2;
            score = op_value;
            break;
        case 5: // TODO: 月营收
            percentage = 0.2;
            if (op_value <= 100000) {
                score = 1;
            } else if (100000 < op_value && op_value <= 300000) {
                score = 2;
            } else if (300000 < op_value && op_value <= 500000) {
                score = 3;
            } else if (500000 < op_value && op_value <= 1000000) {
                score = 4;
            } else if (1000000 < op_value) {
                score = 5;
            }
            break;
        case 6: // TODO: 利润率
            percentage = 0.2;
            if (op_value <= 0) {
                score = 1;
            } else if (0 < op_value && op_value <= 2) {
                score = 2;
            } else if (2 < op_value && op_value <= 5) {
                score = 3;
            } else if (5 < op_value && op_value <= 8) {
                score = 4;
            } else if (8 < op_value) {
                score = 5;
            }
            break;
        default:
            break;
    }
    target.score = score;
    target.totalScore = score * percentage;
    return target;
}

/**
 * @Description: TODO: Nature of a Company 根据后台传回来的natureOfCompany参数，找到对应的enterpriseType的值
 * @author LLS
 * @date 2023/7/25
 * @param data    数据集合
 * @param natureOfCompany   natureOfCompany参数
 * @returns
 */
export function getValue (data: any[], natureOfCompany?: string): any {
    const value = Number(natureOfCompany);
    if (natureOfCompany) {
        for (const item of data) {
            if (item.value === value) {
                return item.label;
            }
            if (item.children) {
                const label = getLabelByValue(item.children, natureOfCompany);
                if (label) {
                    return {enterpriseType: item.value};
                }
            }
        }
    }
    return null;
}

/**
 * @Description: TODO: Nature of a Company 根据后台传回来的natureOfCompany参数，找到对应的label名称
 * @author LLS
 * @date 2023/7/25
 * @param data    数据集合
 * @param natureOfCompany   natureOfCompany参数
 * @returns
 */
export function getLabelByValue (data: any[], natureOfCompany?: string): any {
    const value = Number(natureOfCompany);
    if (natureOfCompany) {
        for (const item of data) {
            if (item.value === value) {
                return item.label;
            }
            if (item.children) {
                const label = getLabelByValue(item.children, natureOfCompany);
                if (label) {
                    return {enterpriseType: item.label, natureOfCompany: label};
                }
            }
        }
    }
    return null;
}


/**
 * @Description: TODO: 把 把 【2023 8】 转成 【2023 August】 显示
 * @author XXQ
 * @date 2023/8/9
 * @param dataString    日期参数
 * @returns
 */
export function getTransferDate (dataString: string) {
    let result: string = '';
    if (dataString) {
        // 创建一个 Date 对象，表示指定日期
        const currentDate = new Date(dataString);
        // 获取年份和月份
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth(); // 月份是从 0 开始计数的
        // 数组存储英文月份名称
        const monthNames = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];
        // 获取对应的英文月份名称
        const monthName = monthNames[month];
        // 构造日期字符串
        result = `${year} ${monthName}`;
    }
    return result;
}

/**
 * @Description: TODO: 获取服务类型名称
 * @author LLS
 * @date 2023/9/19
 * @param checkedValue
 * @returns
 */
export function getServiceTypeName (checkedValue: string) {
    if (checkedValue) {
        switch (checkedValue) {
            case 'job':
                return 'Job';
            case 'charge':
                return 'Charge';
            case 'refund-charge':
                return 'Refund-Charge';
            case 'sea-import':
                return 'Sea (Import)';
            case 'sea-export':
                return 'Sea (Export)';
            case 'foreignVehicle':
                return 'ForeignVehicle';
            case 'land-forwarder':
                return 'Land Forwarder';
            case 'air-import':
                return 'Air (Import)';
            case 'air-export':
                return 'Air (Export)';
            case 'local-delivery':
                return 'Local Delivery';
            case 'warehouse':
                return 'Warehouse';
            case 'vas':
                return 'VAS';
            case 'cfs':
                return 'CFS';
            case 'supply-chain-finance':
                return 'Supply Chain Finance';
            case 'Container Leasing':
                return 'container-leasing';
            default:
                break;
        }
    }
    return '';
}


// TODO: 处理数据里的 children 子集，如果 children 没有数据时，则删除 children
export function getChildrenListData (data: any[]) {
    let result: any[] = [];
    if (data?.length > 0) {
        result = data.map((x: any)=> {
            x.type = x.type === 2;
            if (x.children?.length > 0) {
                x.children = getChildrenListData(x.children);
            } else {
                delete x.children;
            }
            return x;
        })
    }
    return result;
}


export function funcTransferTreeData (data: any[]) {
    let result: any[] = [];
    if (data?.length > 0) {
        result = data.map((x: any)=> {
            // TODO: Tree 组件需要用的字段
            x.key = x.identityCode;
            // x.key = x.id;
            x.title = x.name;
            x.disableCheckbox = x.type === 1;
            if (x.children?.length > 0) {
                x.children = funcTransferTreeData(x.children);
            } else {
                delete x.children;
            }
            return x;
        })
    }
    return result;
}