import {USER_ID, ACCESS_TOKEN, BRANCH_ID} from '@/utils/auths'
import {notification} from 'antd';
import {LOCAL_TIME_ZONE, SYSTEM_ID, SYSTEM_KEY_TEST} from '@/utils/units'


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
    // TODO: 处理 body 分页参数
    if (options?.body) {
        if (options.body?.current) {
            options.body.currentPage = options.body.current;
            delete options?.body.current;
        }
    }
    const newOptions = {
        ...defaultOptions,
        ...options
    };
    newOptions.headers = {
        Accept: '*/*',
        Lang: 'zh-CN',
        'Content-Type': 'application/json; charset=utf-8',
        UserID: USER_ID(),
        BranchID: BRANCH_ID(),
        auth: ACCESS_TOKEN() || 'c4b2b5a133cf428299115262b0120a28',
        zone: LOCAL_TIME_ZONE(),
        ...newOptions.headers
    };
    if (url.indexOf('/apiIAM') > -1) {
        newOptions.headers = {
            env: 'fat', // TODO: 可选值： prod(生产环境) / dev（开发环境）/ fat（测试环境）
            // keyid: SYSTEM_KEY_TEST_LAND,
            // clientId: SYSTEM_ID_LAND,
            keyid: SYSTEM_KEY_TEST,
            clientId: SYSTEM_ID,
            ...newOptions.headers
        };
    }
    if (ACCESS_TOKEN()) {
        newOptions.headers = {
            ...newOptions.headers,
            Cookie: `auth=${ACCESS_TOKEN()}`,
        };
    }
    if (newOptions.method === 'POST' || newOptions.method === 'PUT') {
        newOptions.body = JSON.stringify(newOptions.body);
    }
    return fetch(url, newOptions)
        .then(checkStatus)
        .then(async (response) => {
            if (response.status === 204) {
                return response.text();
            }
            if (url.indexOf('/apiLocal') > -1) {
                return response.json();  // TODO: old vision
            } else {
                return setAPIResponse(await response.json());
            }
        })
        .catch((e: any) => {
            const status = e.name;
            const result: any = {success: false, message: e.message || 'error'};
            if (status === 401) {
                // history.push('/user/login');
                return result;
            }
            if (status === 403) {
                // history.push('/exception/403');
                return result;
            }
            if (status <= 504 && status >= 500) {
                // history.push('/exception/500');
                return result;
            }
            if (status >= 404 && status < 422) {
                // history.push('/exception/404');
                return result;
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
export function setAPIResponse(response: any) {
    let result: API.Result = {
        code: '',
        current: 0,
        data: undefined,
        spacialData: undefined,
        message: '',
        exceptionTip: '',
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
            message: response.exceptionTip || response.message,
            // TODO: 异常
            exceptionTip: response.exceptionTip,
            // TODO: 返回结果分页信息
            current: response?.data?.current,
            page: response?.data?.pages,
            size: response?.data?.size,
            total: response?.data?.total,
            // TODO: 后台返回的结果数据
            data: response?.data?.records || response?.data,
            spacialData: response?.data,
        }
    }
    return result;
}
