import {getBranchID, getUserID} from '@/utils/auths'
import {message} from 'antd'
import {request} from '@/utils/request'

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
    const options: any = {
        body: params,
        method: 'POST',
        headers: {Lang: 'en_EN', BranchID: getBranchID(), UserID: getUserID()},
    };
    const result: API.Result = await request(url, options);
    if (result.success) {
        // TODO: 返回结果
        return result.data?.map((item: any) => {
            // let labelValue = item[resLabel];
            // if (resLabel.length === 2 && isShowSecondLabel) {
            //     const firstLabel = item[resLabel[0]];
            //     const secondLabel = item[resLabel[1]];
            //     labelValue = firstLabel + "(" + secondLabel + ")"
            // }
            return {value: item[resValue], label: item[resLabel], data: item}
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
