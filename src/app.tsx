import Footer from '@/components/Footer';
import RightContent from '@/components/RightContent';
import {BookOutlined, LinkOutlined, PlusOutlined} from '@ant-design/icons';
import type {Settings as LayoutSettings} from '@ant-design/pro-components';
import {PageLoading, SettingDrawer} from '@ant-design/pro-components';
import type { RunTimeLayoutConfig} from 'umi';
import {Link} from 'umi';
import {history,} from 'umi';
import defaultSettings from '../config/defaultSettings';
import {getUserID, getUserInfo} from "@/utils/auths";
import {icon_font_url} from '@/utils/units';
import RightHeaderTags from '@/components/RightHeaderTags';
import ls from 'lodash';


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
    userInfo?: API.LoginUserInfo;
    loading?: boolean;
    collapsed?: boolean;    // TODO：是否展开左侧菜单栏
    groupInfo?: any;        // TODO: 分组信息
    fetchUserInfo?: () => Promise<API.LoginUserInfo | undefined>;
}> {
    const fetchUserInfo = async () => {
        try {
            return getUserInfo();
        } catch (error) {
            history.push(loginPath);
        }
        return undefined;
    };
    const userInfo = await fetchUserInfo();
    // 如果不是登录页面，执行
    // if (history.location.pathname !== loginPath) {
    //     return {
    //         userInfo,
    //         fetchUserInfo,
    //         settings: defaultSettings,
    //     };
    // }
    return {
        userInfo,
        fetchUserInfo,
        settings: defaultSettings,
    };
}

// ProLayout 支持的api https://procomponents.ant.design/components/layout
export const layout: RunTimeLayoutConfig = ({initialState, setInitialState}) => {
    const groupInfo: any = initialState?.groupInfo || {};
    /**
     * @Description: TODO 选中分组后，重新获取 <单票列表> 的数据
     * @author XXQ
     * @date 2023/3/30
     * @param selectedRows  选中的分组的行
     * @returns
     */
    const onChangeGroup = (selectedRows: object) => {
        // eslint-disable-next-line prefer-const
        let initInfo: any = ls.cloneDeep(initialState);
        // 把分组信息存到初始化数据中
        initInfo.groupInfo = selectedRows;
        setInitialState(initInfo);
    }
    return {
        title: 'Smart',
        // TODO: 顶部右侧
        rightContentRender: () => <RightContent/>,
        disableContentMargin: false,
        // TODO: 水印
        waterMarkProps: {
            content: initialState?.userInfo?.DisplayName,
        },
        onCollapse: (e) => {
            // console.log(e);
        },
        iconfontUrl: icon_font_url,
        // collapsed: true,
        footerRender: () => !!initialState?.userInfo?.ID && <Footer/>,
        enableDarkTheme: true,
        onPageChange: () => {
            const {location} = history;
            // 如果没有登录【!getUserID()】，重定向到登录页面【/user/login】
            if (!getUserID() && location.pathname !== loginPath) {
                history.push(loginPath);
            }
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
        menuHeaderRender: () => <RightHeaderTags onChangeGroup={onChangeGroup} groupInfo={groupInfo} />,
        // menuDataRender: (menuData)=> menuData,
        // 自定义 403 页面
        // unAccessible: <div>unAccessible</div>,
        // 增加一个 loading 的状态
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

