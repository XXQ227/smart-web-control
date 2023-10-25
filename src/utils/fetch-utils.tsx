import {message} from 'antd'
import {request} from '@/utils/request'
import {stringify} from 'querystring'

/**
 * @Description: TODO: 远程获得数据。并重组后台返回的数据参数结构
 * @author XXQ
 * @date 2023/4/17
 * @param searchVal 搜索参数
 * @param url       后台接口地址
 * @param query     查询参数
 * @param qty       查询数量
 * @param resValue  返回结果的 【Key】 值
 * @param resLabel  返回结果的 【Value】 值
 * @param isShowSecondLabel     是否显示第二个值
 * @returns
 */
export async function fetchData(
    searchVal: any, url: string, query: any = {}, qty: number = 5,
    resValue: string, resLabel: string, isShowSecondLabel?: boolean
) {
    const params = {name: searchVal, pageSize: qty, currentPage: 1, ...query, };

    // TODO: 判断是用 GET or POST 方法
    const method = url.indexOf('/apiLocal') > -1 ? 'GET' : 'POST';

    const options: any = {method, headers: {Lang: 'en_EN', BranchID: 2, UserID: 263}};

    // TODO: 重新组合 URL 地址
    let realUrl: string = url;
    if (method === 'GET') {
        realUrl += '?' + stringify(params);
    } else {
        options.body  = params;
    }

    // let result: API.Result = await request(realUrl, options);
    let result: any = await request(realUrl, options);

    if (url.indexOf('/apiLocal') > -1) {
        // TODO: 查老系统时返回的结果
        if (result.length > 0) {
            result = result.map((item: any) => ({value: item.Key, label: item.Value}));
        }
        return result;
    } else if (result.success) {
        // TODO: 返回结果
        return result?.data?.map((item: any) => {
            // let labelValue = item[resLabel];
            // if (resLabel.length === 2 && isShowSecondLabel) {
            //     const firstLabel = item[resLabel[0]];
            //     const secondLabel = item[resLabel[1]];
            //     labelValue = firstLabel + "(" + secondLabel + ")"
            // }
            return {value: item[resValue], label: item[resLabel], data: item, ...item}
        });
    } else {
        message.error(result.message);
        return {};
    }
    // return fetch(`${url}?${stringify(params)}`, options)
    //     .then(response => response.json())
    //     .then((result: API.Result) => {
    //         if (result.success) {
    //             // TODO: 返回结果
    //             return result.data?.map((item: any) => {
    //                 let labelValue = item[resLabel];
    //                 if (resLabel.length === 2 && isShowSecondLabel) {
    //                     const firstLabel = item[resLabel[0]];
    //                     const secondLabel = item[resLabel[1]];
    //                     labelValue = firstLabel + "(" + secondLabel + ")"
    //                 }
    //                 return {value: item[resValue], label: labelValue, data: item}
    //             });
    //         }else {
    //             message.error(result.message);
    //         }
    //     })
    //     .catch(e => {
    //         console.log(e);
    //     });
}
