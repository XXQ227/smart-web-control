import Footer from '@/components/Footer';
import RightContent from '@/components/RightContent';
import {BookOutlined, LinkOutlined, PlusOutlined} from '@ant-design/icons';
import type {Settings as LayoutSettings} from '@ant-design/pro-components';
import {PageLoading, SettingDrawer} from '@ant-design/pro-components';
import type { RunTimeLayoutConfig} from 'umi';
import {Link, history} from 'umi';
import defaultSettings from '../config/defaultSettings';
import {USER_INFO, setSystemMes} from "@/utils/auths";
import {icon_font_url} from '@/utils/units';
import ls from 'lodash';
import Exception403 from '@/pages/exception/403';
import {iamUserLogInAPI} from '@/services/smart/iam'
import {message} from 'antd'
import {ROUTES_EXCEPTION} from '@/utils/common-data'


const isDev = process.env.NODE_ENV === 'development';
const loginPath = '/user/login';

/** 获取用户信息比较慢的时候会展示一个 loading */
export const initialStateConfig = {
    loading: <PageLoading/>,
};

/**
 * @see  https://umijs.org/zh-CN/plugins/plugin-initial-state
 * */
export async function getInitialState(): Promise<{
    settings?: Partial<LayoutSettings>;
    userInfo?: any;
    loading?: boolean;
    collapsed?: boolean;    // TODO：是否展开左侧菜单栏
    groupInfo?: any;        // TODO: 分组信息
    isJobEditPage?: boolean;// TODO: 是否是编辑页面
    fetchUserInfo?: () => Promise<APIModel.LoginUserInfo | undefined>;
}> {
    const {location: {search, pathname, query}} = history;
    const fetchUserInfo = async () => {
        try {
            // TODO: 拿到 code 的值
            if (search) {
                // TODO: 从地址栏拿到 IAM 返回的 code 请求后台 API, 获取当前用户信息
                const result: any = await iamUserLogInAPI({code: query?.code});
                if (result.success) {
                    // TODO: 设置到 session 中
                    setSystemMes(result.data?.tokenResult);
                    return result.data;
                } else {
                    if (result.message) message.error(result.message);
                    // TODO: 登录验证不成功时，关闭系统页面窗口
                    setTimeout(()=> window.close(), 2000);
                }
            }
            return USER_INFO();
        } catch (error) {
            console.log(error);
            // message.error(error);
            // TODO: 登录验证不成功时，关闭系统页面窗口
            // setTimeout(()=> window.close(), 2000);
        }
        return undefined;
    };
    const userInfo = await fetchUserInfo();
    // initialState 的返回结果
    const result: any = {userInfo, fetchUserInfo, settings: defaultSettings,};
    // 如果不是登录页面，执行
    if (pathname !== loginPath) {
        result.groupInfo = {id: 1, title: 'Bayer Project'};
        return result;
    }
    return result;
}

async function fetchMenuData(params: any, defaultMenuData: any) {
    const isSuperAdmin = true;
    let menuData: any = [];
    if (isSuperAdmin) {
        menuData = [
            {path: '/', redirect: '/welcome',},
            {path: '/welcome', name: 'welcome', icon: 'icon-dashboard', component: './Welcome',},
            {
                name: 'manager',
                icon: 'icon-menu-settlement',
                path: '/manager',
                routes: [
                    {path: '/manager', redirect: '/manager',},
                    // TODO: 经营单位<Branch>数据
                    {
                        name: 'branch_list', icon: 'icon-branch',
                        path: '/manager/branch', component: './sys-manager/branch',
                    },
                    {
                        name: 'branch_info', icon: 'icon-branch', hideInMenu: true,   // 隐藏不显示
                        path: '/manager/branch/form/:id', component: './sys-manager/branch/form',
                    },
                    // TODO: 字典表数据维护
                    {name: 'dict', icon: 'icon-dictionary', path: '/manager/dict', component: './sys-manager/dict',},
                    {
                        name: 'dict_type', hideInMenu: true,   // 隐藏不显示
                        path: '/manager/dict/form/:id', component: './sys-manager/dict/form',
                    },
                    // TODO: 港口数据
                    {name: 'port_list', icon: 'icon-port', path: '/manager/port', component: './sys-manager/port',},
                    // TODO: 用户
                    {
                        name: 'user', icon: 'icon-user-manager',
                        path: '/manager/user', component: './sys-manager/user/user-list',
                    },
                ],
            },
        ];
    }
    // TODO: 调用接口, 获取菜单数据
    else {
        menuData = defaultMenuData || [];
    }
    menuData.push(ROUTES_EXCEPTION);
    console.log(menuData, defaultMenuData);
    return menuData;
}

// ProLayout 支持的api https://procomponents.ant.design/components/layout
export const layout: RunTimeLayoutConfig = ({initialState, setInitialState}) => {
    // eslint-disable-next-line prefer-const
    let initInfo: any = ls.cloneDeep(initialState) || {};

    const {location: {search}} = history;
    return {
        iconfontUrl: icon_font_url,
        // route: routes,
        // TODO: 顶部右侧
        disableContentMargin: false,
        title: 'EHK',
        // TODO: 水印
        waterMarkProps: {
            content: initialState?.userInfo?.DisplayName,
        },
        // menu: routes,
        // TODO: 历史上工具
        rightContentRender: () => <RightContent/>,
        // TODO: 是否站台
        // collapsed: true,
        footerRender: () => !!initialState?.userInfo?.id && <Footer/>,
        enableDarkTheme: true,
        // TODO: 菜单的折叠收起事件
        onCollapse: (e) => {
            // console.log(e);
        },
        // TODO: 侧边菜单宽度
        siderWidth: 130,
        // TODO: 页面切换时触发
        onPageChange: () => {
            // 当前页面的路径 <history>
            const {location: {pathname}} = history;
            // TODO: 加上 IAM 跳转过来的 access_token
            history.push(pathname + search);
        },
        // TODO: 左侧菜单拦的点击设置
        // collapsedButtonRender: ()=> 222,
        links: isDev
            ? [
                <Link key="openapi" to="/umi/plugin/openapi" target="_blank">
                    <PlusOutlined />
                    <span>创建</span>
                </Link>,
                <Link key="openapi" to="/umi/plugin/openapi" target="_blank">
                    <LinkOutlined/>
                    <span>OpenAPI 文档</span>
                </Link>,
                <Link to="/~docs" key="docs">
                    <BookOutlined/>
                    <span>业务组件文档</span>
                </Link>,
                null
            ]
            : [],
        // TODO: 工作空间（暂时不启用）
        // menuHeaderRender: () =>
        //     location?.pathname?.indexOf('/job') > -1 ?
        //         <WorkSpace onChangeGroup={onChangeGroup} groupInfo={initInfo.groupInfo} /> : null,
        // menu: {
        //     // 每当 initialState?.currentUser?.userid 发生修改时重新执行 request
        //     params: {userId: '1658001055903371265',},
        //     request: async (params, defaultMenuData) => {
        //         // initialState.currentUser 中包含了所有用户信息
        //         const menuData = await fetchMenuData(params, defaultMenuData);
        //         return menuData || [];
        //     },
        // },
        // menuDataRender: (menuData)=> menuData,
        // 自定义 403 页面
        childrenRender: (children, props) => {
            // if (initialState?.loading) return <PageLoading />;
            return (
                <>
                    {children}
                    {!props.location?.pathname?.includes('/login') && (
                        // 右边的设置项
                        <SettingDrawer
                            disableUrlParams
                            enableDarkTheme
                            settings={initialState?.settings}
                            onSettingChange={(settings) => {
                                setInitialState((preInitialState: any) => ({
                                    ...preInitialState,
                                    settings,
                                }));
                            }}
                        />
                    )}
                </>
            );
        },
        // 增加一个 loading 的状态
        unAccessible: initInfo.isJobEditPage ? <div/> : <Exception403/>,
        ...initialState?.settings,
    };
};

/**
 * @Description: TODO qiankun 主子应用
 * @author XXQ
 * @date 2023/2/17
 * @returns
export const qiankun = fetch('/config').then(() => ({
    ...qiankunApp,
    jsSandbox: true, // 是否启用 js 沙箱，默认为 false
    prefetch: true, // 是否启用 prefetch 特性，默认为 true
    // 完整生命周期钩子请看 https://qiankun.umijs.org/zh/api/#registermicroapps-apps-lifecycles
    lifeCycles: {
        afterMount: (props: any) => {
            console.log(props);
        },
    },
    // 支持更多的其他配置，详细看这里 https://qiankun.umijs.org/zh/api/#start-opts
}));
 */

