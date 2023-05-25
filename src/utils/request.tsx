import {getBranchID, getUserID, getAccess_Token} from '@/utils/auths'
import { notification } from 'antd';
import {history} from 'umi';


const codeMessage = {
    200: '服务器成功返回请求的数据',
    201: '新建或修改数据成功。',
    202: '一个请求已经进入后台排队（异步任务）',
    204: '删除数据成功。',
    400: '发出的请求有错误，服务器没有进行新建或修改数据,的操作。',
    401: '用户没有权限（令牌、用户名、密码错误）。',
    403: '用户得到授权，但是访问是被禁止的。',
    404: '发出的请求针对的是不存在的记录，服务器没有进行操作',
    406: '请求的格式不可得。',
    410: '请求的资源被永久删除，且不会再得到的。',
    422: '当创建一个对象时，发生一个验证错误。',
    500: '服务器发生错误，请检查服务器',
    502: '网关错误',
    503: '服务不可用，服务器暂时过载或维护',
    504: '网关超时'
};

function checkStatus(response: any) {
    if (response.status >= 200 && response.status < 300) {
        return response;
    }
    const errorText = codeMessage[response.status] || response.statusText;
    notification.error({ message: `请求错误 ${response.status}: ${response.url}`, description: errorText });
    const error = new Error(errorText);
    error.name = response.status;
    // error.response = response;
    throw error;
}

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
export function request(url: string, options: any) {
    // url = getUrlHost() + url;
    // //正式发布的需要用到改参数，用于调用后台接口-------------开发时请注释掉改行
    const defaultOptions = {
        credentials: 'include'
    };
    const newOptions = {
        ...defaultOptions,
        ...options
    };
    newOptions.headers = {
        Accept: '*/*',
        'Content-Type': 'application/json; charset=utf-8',
        Authorization: getAccess_Token(),
        Lang: 'zh-CN',
        UserID: getUserID(),
        BranchID: getBranchID(),
        ...newOptions.headers
    };
    if (newOptions.method === 'POST' || newOptions.method === 'PUT') {
        newOptions.body = JSON.stringify(newOptions.body);
    }
    return fetch(url, newOptions)
        .then(checkStatus)
        .then(async (response) => {
            if (response.status === 204) {
                return response.text();
            }
            const result: any = await response.json();
            return setAPIResponse(result);
        })
        .catch((e) => {
            const status = e.name;
            if (status === 401) {
                history.push('/user/login');
                return;
            }
            if (status === 403) {
                history.push('/exception/403');
                return;
            }
            if (status <= 504 && status >= 500) {
                history.push('/exception/500');
                return;
            }
            if (status >= 404 && status < 422) {
                history.push('/exception/404');
            }
        });
}

/**
 * @Description: TODO: 对接口返回的数据进行格式化，转成前台要用的数据结构
 * @author XXQ
 * @date 2023/5/25
 * @param response  接口返回的数据
 * @returns
 */
function setAPIResponse(response: any) {
    let result: API.Result = {
        code: '',
        current: 0,
        data: undefined,
        message: '',
        page: 0,
        size: 0,
        success: false,
        total: 0
    };
    if (response) {
        result = {
            // TODO: 返回结果状态
            code: response.code,
            success: response.success,
            message: response.message,
            // TODO: 返回结果分页信息
            current: response?.data?.current,
            page: response?.data?.pages,
            size: response?.data?.size,
            total: response?.data?.total,
            // TODO: 后台返回的结果数据
            data: response?.data?.records,
        }
    }
    return result;
}
