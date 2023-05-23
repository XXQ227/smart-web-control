import {getBranchID, getUserID} from '@/utils/auths'
import {stringify} from 'qs'

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
 * @returns
 */
export async function fetchData(searchVal: any, url: string, query: any = {}, qty: number = 5, resValue: string, resLabel: string): Promise<API.APIValue$Label[]> {
    const params = Object.assign({}, query, {value: searchVal, PageSize: qty});
    const options: any = { headers: { Lang: 'en_EN', BranchID: getBranchID(), UserID: getUserID()} };
    return fetch(`${url}?${stringify(params)}`, options)
        .then(response => response.json())
        .then((result) => {
            // TODO: 返回结果
            return result.map((item: any) => ({value: item[resValue], label: item[resLabel], data: item}));
        })
        .catch(e => {
            console.log(e);
        });
}
