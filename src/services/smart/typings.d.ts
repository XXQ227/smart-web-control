
declare namespace API {
  // TODO: 所有接口的返回结果需要转成的数据结构
  type Result = {
    success: boolean;
    code: string;
    message: string,
    page: number,
    current: number,
    total: number,
    size: number,
    data: any,
  };

  type CurrentUser = {
    name?: string;
    avatar?: string;
    userid?: string;
    email?: string;
    signature?: string;
    title?: string;
    group?: string;
    tags?: { key?: string; label?: string }[];
    notifyCount?: number;
    unreadCount?: number;
    country?: string;
    access?: string;
    geographic?: {
      province?: { label?: string; key?: string };
      city?: { label?: string; key?: string };
    };
    address?: string;
    phone?: string;
  };

  type ErrorResponse = {
    /** 业务约定的错误码 */
    errorCode: string;
    /** 业务上的错误信息 */
    errorMessage?: string;
    /** 业务上的请求是否成功 */
    success?: boolean;
  };

  type FakeCaptcha = {
    code?: number;
    status?: string;
  };

  type getFakeCaptchaParams = {
    /** 手机号 */
    phone?: string;
  };

  type LoginResult = {
    status?: string;
    type?: string;
    currentAuthority?: string;
    Result?: boolean;
    Page?: object;
    Content?: unknown;
  };

  type NoticeIconItem = {
    id?: string;
    extra?: string;
    key?: string;
    read?: boolean;
    avatar?: string;
    title?: string;
    status?: string;
    datetime?: string;
    description?: string;
    type?: NoticeIconItemType;
  };

  type NoticeIconItemType = 'notification' | 'message' | 'event';

  type NoticeIconList = {
    data?: NoticeIconItem[];
    /** 列表的内容总数 */
    total?: number;
    success?: boolean;
  };

  type PageParams = {
    current?: number;
    pageSize?: number;
  };

  type RuleList = {
    data?: RuleListItem[];
    /** 列表的内容总数 */
    total?: number;
    success?: boolean;
  };

  type RuleListItem = {
    key?: number;
    disabled?: boolean;
    href?: string;
    avatar?: string;
    name?: string;
    owner?: string;
    desc?: string;
    callNo?: number;
    status?: number;
    updatedAt?: string;
    createdAt?: string;
    progress?: number;
  };

  type ruleParams = {
    /** 当前的页码 */
    current?: number;
    /** 页面的容量 */
    pageSize?: number;
  };

  // TODO: 用户登录参数
  type LoginParams = {
    username?: string;
    password?: string;
    autoLogin?: boolean;
    type?: string;
    LoginName?: string;
    Password?: string;
    SystemID?: number;
  };

  // TODO: 接口返回结果
  type APILoginResult = {
    status?: string;
    type?: string;
    currentAuthority?: string;
    Result?: boolean;
    Page?: object;
    Content?: any;
  };



  // TODO: 分页返回结果
  type APIPage = {
    ItemTotal: number,
    PageCurr: number,
    PageSize: number,
    PageTotal: number,
  }

  // TODO: 【Key-Value】键值对的返回结果
  type APIKey$Value = {
    Key?: any,
    Value?: any
  }

  // TODO: SearchInput、SearchModal 组件的返回结果的数据结构
  type APIValue$Label = {
    value: any,
    label: any,
    data?: any
  }

}
