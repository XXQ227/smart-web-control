declare namespace APIManager {
  //region TODO:  结算对象
  // TODO: 结算对象搜索参数
  type CVSearchParams = {
    current?: number | null;
    PageNum?: 1 | number | null;
    OracleID?: string;
    OracleIDSupplier?: string;
    CustomerUBSID?: string;
    SupplierUBSID?: string;
    TaxNum?: string;
    CTName?: string;
    NameFull?: string;
    PageSize?: 15 | number | null;
    CTType?: 1 | number | string | null;
    UserID?: number | null;
  };
  type CVResultInfo = {
    data: CVInfo[];
    /** 列表的内容总数 */
    total: number | null;
    success: boolean;
  };

  type GetCVInfoParams = {
    UserID: number | null;
    CTPID: number | null;
  };
  type GetCVInfoResult = {
    CTDetailDto: CVInfo;
    CTTypeOpts: CTTypeOpts[];
    Industrys: Industrys[];
    CustomerPropertyList: CustomerProperty[];
    BusinessLine: BusinessLine[];
  };
  type CVInfo = {
    ID: number | null;
    CTPID: number | null;
    CTTypeItem?: string;
    BranchName?: string;
    CustSupCode: string;
    Freezen: number | null;
    NameFull: string;
    NameFullEN: string;
    Address: string;
    OracleID: string;
    OracleIDSupplier: string;
    Settlement: number | null;
    TaxCode: string;
    BusinessLine?: any;
    BusinessLineList?: any[];
    CustomerPropertyID?: number | null;
    CTTypeItemClient?: number | null;
    CTTypeItemIDClient?: number | null;
    CTTypeItemListSupplier?: number | null;
    CTList?: any[];
    SCAC?: string;
    cityId?: number;
    cityName?: string;
    parentCompanyId?: number;
    parentCompanyName?: string;
  };
  // TODO: 行业
  type Industrys = {
    BizPlateType: number;
    Name: string;
    NameEN: string;
    PrimaryID: number;
    industrys: industrys[];
  };
  type industrys = {
    IndustryID: number;
    Name: string;
    NameEN: string;
    Remark: string;
    RemarkEN: string;
  };
  type IndustrysTreeSelect = {
    title: string;
    value: string;
    key: string;
    disabled: true;
    children: industrysTreeSelect[];
  };
  type industrysTreeSelect = {
    title: string;
    value: number;
    key: number;
    remark: string;
  };
  // TODO: 客户、供应商属性
  type CTTypeOpts = {
    ID: number;
    Name: string;
    CTTypeItemList: CTTypeItemList[];
  };
  // TODO: 客户、供应商属性
  type CTTypeItemList = {
    ID: number;
    NameCN: string;
    NameEN: string;
    CTTypeID: number;
    CTTypeName: string;
  };
  // TODO: 客户属性
  type CustomerProperty = {
    Key: number;
    Value: string;
    NameEN: string;
  };
  // TODO: 业务线
  type BusinessLine = {
    ID: number;
    Name: string;
    NameEN: string;
  };
  //endregion

  //region TODO: 港口
  type SearchPortParams = {
    name?: string;
    currentPage?: number;
    pageSize?: number;
    // total: number;
  };

  type Port = {
    id: number | string | null; // TODO:
    alias: string; // TODO: 港口别名
    cityId?: number; // TODO: 城市id
    cityName?: string; // TODO: 城市名称
    code: string; // TODO: 港口的五字编码
    name: string; // TODO: 港口名世界通用
    tradePlaceCod: string; // TODO: 主数据代码
    enableFlag?: number; // TODO: 启用标识
    deleteFlag?: number; // TODO: 删除标识
    createUserId?: number; // TODO: 创建人ID
    createUserName?: string; // TODO: 创建人名称
    createTime?: string; // TODO: 创建时间
    updateUserId?: number; // TODO: 修改人ID
    updateUserName?: string; // TODO: 修改人名称
    updateTime?: string; // TODO: 修改时间
  };
  //endregion

  //region TODO: 账期
  type SearchAccountParams = {
    UserID: number;
    Year: string | undefined;
  };
  type AccountList = {
    AccountState: number;
    DFStatus: number | null;
    DFStatusName: string;
    ESStatus: number | null;
    ESStatusName: string;
    EndDate: string;
    ErrorMes: string;
    FinaMonth: string;
    FinaYear: string;
    ID: number;
    IsDisplayCloseBtn: boolean;
    IsDisplayDFBtn: boolean;
    IsDisplayESBtn: boolean;
    IsPrepareClose: boolean;
    PeriodCode: string;
    StartDate: string;
    StateName: string;
    TypeName: string;
  };
  type AccountPeriodResult = {
    AccountPeriod: AccountPeriod;
    // Currencys: APCurrency[],
  };
  type AccountPeriod = {
    AccountMouth: string;
    BranchID: number | null;
    CNYRate: number | null;
    EndDate: string;
    ErrorMes: string;
    ExRates: APExRate[];
    ID: number | string | null;
    PeriodCode: string;
    StartDate: string;
    State: number | null;
    StateName: string;
    Type: number | null;
  };
  type APExRate = {
    RateValue: number;
    CurrencyID: number;
  };
  type APCurrency = {
    ID: number;
    Name: string;
  };
  //endregion


  // region TODO: 船代
  type SearchShippingParams = {
      name?: string,
      currentPage?: number,
      pageSize?: number,
  }

  type Voyage = {
      id: string,                       // TODO:
      name?: string,                    // TODO: 名称
      etd?: string,                     // TODO: 预计离港日
      type?: number,                    // TODO: 类型 1-出境 2-入境
      lineId?: number,                  // TODO: 航线ID
      lineName?: string,                // TODO: 航线名称
      vesselId?: number,                // TODO: 船ID
      vesselName?: string,              // TODO: 船名称
      branchId?: number,                // TODO: 公司ID
      remark?: string,                  // TODO: 备注
      enableFlag?: number,              // TODO: 启用标识
      deleteFlag?: number,              // TODO: 删除标识
  }

  type Vessel = {
      id: string,                       // TODO:
      name?: string,                    // TODO: 名称
      code?: string,                    // TODO: 编码
      callSign?: string,                // TODO: 船舶呼号
      imoNum?: string,                  // TODO: 国际海事组织编号
      branchId?: number,                // TODO: 公司ID
      carrierId?: number,               // TODO: 承运人（BU中类型为客户&船公司类型才可被选到）
      carrierName?: string,             // TODO: 承运人（BU中类型为客户&船公司类型才可被选到）
      enableFlag?: number,              // TODO: 启用标识
      deleteFlag?: number,              // TODO: 删除标识
      isChange?: boolean;               // TODO: 是否编辑过
  }

  type Line = {
      id: string,                       // TODO:
      name?: string,                    // TODO: 名称
      areaCode?: string,                // TODO: 船公司区域编码 例如：KVT-1
      serverId?: string,                // TODO: 股份公司Oracle系统所需的统计维度，每一个航线，需要在Oracle中申请此编号后填入
      branchId?: number,                // TODO: 公司ID
      carrierId?: number,               // TODO: 承运人（BU中类型为客户&船公司类型才可被选到）
      enableFlag?: number,              // TODO: 启用标识
      deleteFlag?: number,              // TODO: 删除标识
      isChange?: boolean;               // TODO: 是否编辑过
  }
  //endregion

  //region TODO: 账期
  type SearchAccountParams = {
      UserID: number,
      Year: string | undefined,
  }
  type AccountList = {
      AccountState: number,
      DFStatus: number | null,
      DFStatusName: string,
      ESStatus: number | null,
      ESStatusName: string,
      EndDate: string,
      ErrorMes: string,
      FinaMonth: string,
      FinaYear: string,
      ID: number,
      IsDisplayCloseBtn: boolean,
      IsDisplayDFBtn: boolean,
      IsDisplayESBtn: boolean,
      IsPrepareClose: boolean,
      PeriodCode: string,
      StartDate: string,
      StateName: string,
      TypeName: string,
  };
  type AccountPeriodResult = {
      AccountPeriod: AccountPeriod,
      // Currencys: APCurrency[],
  }
  type AccountPeriod = {
      AccountMouth: string,
      BranchID: number | null,
      CNYRate: number | null,
      EndDate: string,
      ErrorMes: string,
      ExRates: APExRate[],
      ID: number | string | null,
      PeriodCode: string,
      StartDate: string,
      State: number | null,
      StateName: string,
      Type: number | null,
  }
  type APExRate = {
      RateValue: number,
      CurrencyID: number,
  }
  type APCurrency = {
      ID: number,
      Name: string,
  }
  //endregion

  //region TODO: 费目管理
  // TODO: 标准费目
  type SearchStandardCGItemParams = {
    name?: string;
    code?: string;
    currentPage?: number | null;
    pageSize?: number | 15 | null;
  };
  type StandardCGItem = {
    id: string;
    branchId?: string; // TODO: 公司ID
    code?: string; // TODO: 费目名称编码
    name?: string; // TODO: 费目名称
    chargeStandardName?: string; // TODO: 标准费目ID
    subjectCodeAr?: string; // TODO: 科目代码-收
    subjectCodeAp?: string; // TODO: 科目代码-付
    subjectCodeAd?: string; // TODO: 科目代码-代收代付
    enableFlag?: number; // TODO: 启用标识 0＝停用，1＝啟用
    deleteFlag?: number; // TODO: 删除标识
    createUserId?: string; // TODO: 创建人ID
    createUserName?: string; // TODO: 创建人名称
    createTime?: string; // TODO: 创建时间
    updateUserId?: string; // TODO: 修改人ID
    updateUserName?: string; // TODO: 修改人名称
    updateTime?: string; // TODO: 修改时间
    isChange?: boolean; // TODO: 编辑状态
  };
  // TODO: 费目
  type SearchCGItemParams = {
    name?: string;
    code?: string;
    currentPage?: number | null;
    pageSize?: number | 15 | null;
  };

  type CGItem = {
    id: string;
    branchId?: string; // TODO: 公司ID
    code?: string; // TODO: 费目名称编码
    name?: string; // TODO: 费目名称
    chargeStandardId?: string; // TODO: 标准费目ID
    chargeStandardName?: string; // TODO: 标准费目ID
    subjectCodeAr?: string; // TODO: 科目代码-收
    subjectCodeAp?: string; // TODO: 科目代码-付
    subjectCodeAd?: string; // TODO: 科目代码-代收代付
    enableFlag?: number; // TODO: 启用标识 0＝停用，1＝啟用
    deleteFlag?: number; // TODO: 删除标识
    createUserId?: string; // TODO: 创建人ID
    createUserName?: string; // TODO: 创建人名称
    createTime?: string; // TODO: 创建时间
    updateUserId?: string; // TODO: 修改人ID
    updateUserName?: string; // TODO: 修改人名称
    updateTime?: string; // TODO: 修改时间
    isChange?: boolean; // TODO: 编辑状态
  };
  //endregion

  //region TODO: 费用模板
  type SearchCGTempParams = {
    name: string;
    branchId: string | number;
    servicesType: string;
    currentPage: number;
    pageSize: number;
  };

  type CGTemp = {
    id: string; // TODO:
    name?: string; // TODO:名称
    branchId?: string; // TODO:公司ID
    servicesType?: string; // TODO:服务类型
    purposeOfCallType?: string; // TODO:调用类型的目的
    enableFlag?: string; // TODO:启用状态:0-不启用、1-启用
    deleteFlag?: string; // TODO:删除标识
    createUserId?: string; // TODO:创建人ID
    createUserName?: string; // TODO:创建人名称
    createTime?: string; // TODO:创建时间
    updateUserId?: string; // TODO:修改人ID
    updateUserName?: string; // TODO:修改人名称
    updateTime?: string; // TODO:修改人时间
    isChange?: boolean; // TODO: 编辑状态
  };


  type CGTempItems = {
    id?: string; // TODO: 主键
    chargeTemplateId?: string; // TODO: 费目模版ID
    chargeItemId?: string; // TODO:费目ID
    unitType?: string; // TODO:单位类型id
    unitTypeName?: string; // TODO:单位类型
    type?: number; // TODO:费用类型:1-收2-付
    unitPrice?: string; // TODO:单价
    branchId?: string; // TODO:公司ID
    payMethod?: string; // TODO:付款方式
    currencyName?: string; // TODO:币种名称
    currencyType?: string; // TODO:币种id
    enableFlag?: string; // TODO:启用状态:0-不启用、1-启用
    deleteFlag?: string; // TODO:删除标识
    createUserId?: string; // TODO:创建人ID
    createUserName?: string; // TODO:创建人名称
    createTime?: string; // TODO:创建时间
    updateUserId?: string; // TODO:修改人ID
    updateUserName?: string; // TODO:修改人名称
    updateTime?: string; // TODO:修改人时间
  };

  //endregion

  //region TODO: Branch
  type SearchBranchParams = {
    name: string;
  };
  type Branch = {
    /** 列表的内容总数 */
    id: string; // TODO: 主键 ID
    contactName?: string; // TODO: 联系人
    phone?: string; // TODO: 电话
    address?: string; // TODO: 公司地址
    cityName?: string; // TODO: 公司所在城市
    code?: string; // TODO: 分公司编码
    defaultPortId?: number | null; // TODO: 公司所在区域的默认港口
    funcCurrencyName?: string; // TODO: 本位币
    nameFullEn?: string; // TODO: 公司全称(英文)
    nameFullLocal?: string; // TODO: 公司全称(当地)
    nameShortEn?: string; // TODO: 公司简称(英文)
    nameShortLocal?: string; // TODO: 公司简称(当地)
    orgId?: string; // TODO: 公司 oracle id
    orgCreateId?: string; // TODO: AUC组织识别码
    taxNum?: string; // TODO: 统一社会信用码，或税号
    bankAccountIds?: string; // TODO: 公司银行id集合
    enableFlag?: number | null; // TODO: 启用标识
    deleteFlag?: number | null; // TODO: 删除标识
    createUserId?: string; // TODO: 创建人ID
    createUserName?: string; // TODO: 创建人名称
    createTime?: string; // TODO: 创建时间
    updateUserId?: string; // TODO: 修改人ID
    updateUserName?: string; // TODO: 修改人名称
    updateTime?: string; // TODO: 修改时间
  };
  //endregion

  //region TODO: Department 部门
  type SearchDeptParams = {
    name: string;
  };
  type DepartmentResult = {
    data: Department[]; // TODO: 部门数据 <Array>
    /** 列表的内容总数 */
    total: number | null;
    /** 返回结果 */
    success?: boolean;
  };
  type Department = {
    id: string; // TODO: 主键 ID
    name?: string; // TODO: 组织名称
    email?: string; // TODO: 邮箱
    parentId?: number | null; // TODO?: 父ID集合
    level?: number | null; // TODO?: 级别
    sort?: number | null; // TODO?: 排序号
    chargePerson?: string; // TODO?: 负责人
    contactPhone?: string; // TODO?: 联系电话
    parentIds?: string; // TODO?: 父类组织ID
    enableFlag?: number; // TODO?: 启用状态?:0-不启用、1-启用
    deleteFlag?: boolean; // TODO?: 删除标识
    createUserId?: number | null; // TODO?: 创建人ID
    createUserName?: string; // TODO?: 创建人名称
    createTime?: string; // TODO?: 创建时间
    updateUserId?: number | null; // TODO?: 修改人ID
    updateUserName?: string; // TODO?: 修改人名称
    updateTime?: string; // TODO?: 修改人时间
    isChange?: boolean; // TODO?: 编辑状态
  };

  type SaveDepartment = {
    id: number;
    success?: boolean;
  };
  //endregion

  //region TODO: User 信息
  type SearchUserParams = {
    name: string;
  };

  type User = {
    id: number | string | null; // TODO:
    nameDisplay: string; // TODO: 用户名
    nameLogin: string; // TODO: 用户登录名
    leaderId: string; // TODO: 用户领导 id
    leaderName: string; // TODO: 用户领导 name
    branchId: number | null; // TODO: 用户公司 id
    departmentId: number | null; // TODO: 部门 id
    oracleId: string; // TODO: oracle id
    password: string; // TODO: 密码
    salesFlag: number | null; // TODO: 销售标识：1-是0-不是
    codeSino: string; // TODO: 中外运编号
    codeF8: string; // TODO: F8唯一编码
    enableFlag: number | null; // TODO: 启用标识
    deleteFlag: number | null; // TODO: 删除标识
    createUserId: number | null; // TODO: 创建人ID
    createUserName?: string; // TODO: 创建人名称
    createTime?: string; // TODO: 创建时间
    updateUserId: number | null; // TODO: 修改人ID
    updateUserName?: string; // TODO: 修改人名称
    updateTime?: string; // TODO: 修改时间
  };
  //endregion

  //region TODO: 项目
  type SearchProjectParams = {
      code?: string,
      currentPage?: number,
      pageSize?: number,
  }

  type Project = {
      id: string,                          // TODO: 主键ID
      code?: string,                       // TODO: 编号
      nameFull?: string,                   // TODO: 项目全称
      nameShort?: string,                  // TODO: 项目简称
      managerId?: number,                  // TODO: 项目经理
      oracleId?: string,                   // TODO: oracleID
      branchId?: number,                   // TODO: 公司ID
      industryType?: number,               // TODO: 行业类型
      contractId?: number,                 // TODO: 合同方（业务单位）
      pmsCode?: string,                    // TODO: 项目管理代码
      portionAFlag?: number,               // TODO: 业务段A标识 0-未开启 1-已开启
      portionBFlag?: number,               // TODO: 业务段B标识 0-未开启 1-已开启
      portionCFlag?: number,               // TODO: 业务段C标识 0-未开启 1-已开启
      portion?: string[],                  // TODO: 业务段
      startDate?: string,                  // TODO: 项目开始时间
      endDate?: string,                    // TODO: 项目结束时间
      remark?: string,                     // TODO: 备注
      enableFlag?: number,                 // TODO: 启用标识
      deleteFlag?: number,                 // TODO: 删除标识
  }
  //endregion

  //region TODO: 权限
  type SearchAuthResourceParams = {
    id: any;
  };
  type AuthResource = {
    id: string;// TODO:主键ID
    name?: string;// TODO:资源名称
    type?: string;// TODO:资源类型
    icon?: string;// TODO:图标
    url?: string;// TODO:路由
    level?: string;// TODO:级别
    parentId?: string;// TODO:父级ID
    sort?: string;// TODO:排序
    parentIds?: string;// TODO:父ID集合
    enableFlag?: string;// TODO:启用状态:0-启用、1-禁用
    deleteFlag?: string;// TODO:删除标识
    createUserId?: string;// TODO:创建人ID
    createUserName?: string;// TODO:创建人名称
    createTime?: string;// TODO:创建时间
    updateUserId?: string;// TODO:修改人ID
    updateUserName?: string;// TODO:修改人名称
    updateTime?: string;// TODO:修改人时间
    children?: any[],// TODO:子集信息
    isChange?: boolean,// TODO:编辑状态
  };
  //endregion

  //region TODO: 角色
  type SearchRoleParams = {
    keyword: string;
    currentPage: number;
    pageSize: number;
  };
  type Role = {
    id: string; // TODO: 主键ID
    roleName?: string; // TODO: 角色名称
    roleCode?: string; // TODO: 角色编码
    remark?: string; // TODO: 备注信息
    enableFlag?: string; // TODO: 启用标识
    readOnly?: number; // TODO: 只读标识
    deleteFlag?: string; // TODO: 删除标识
    createUserId?: string; // TODO: 创建人ID
    createUserName?: string; // TODO: 创建人名称
    createTime?: string; // TODO: 创建时间
    updateUserId?: string; // TODO: 修改人ID
    updateUserName?: string; // TODO: 修改人名称
    updateTime?: string; // TODO: 修改时间
    isChange?: boolean; // TODO:编辑状态
  };
  //endregion

  //region TODO: 字典
  type SearchDictParams = {
    name: string; // TODO: 字典类型对应的名称
    code: string; // TODO: 字典类型对应的code码
  };
  type Dict = {
    id: string;
    name: string; // TODO: 字典类型对应的名称
    code: string; // TODO: 字典类型对应的code码
    remark: string; // TODO: 备注信息
    deleteFlag?: number; // TODO: 删除标识:0不删除、1删除
    enableFlag?: number; // TODO: 启用标识:0不启用、1启用
    createUserId?: number | null; // TODO: 创建人
    createUserName?: string;
    createTime?: string; // TODO: 创建时间
    updateUserId?: number | null; // TODO: 更新人
    updateUserName?: string;
    updateTime?: string; // TODO: 更新时间
    isChange?: boolean; // TODO: 是否编辑过
  };
  //endregion

  //region TODO: 字典详情
  type SearchDictDetailParams = {
    dictId?: number | string; // TODO: 字典类型
    name?: string; // TODO: 字典的名称
    currentPage?: number; // TODO: 当前页数
    pageSize?: number; // TODO: 每页数
  };
  type DictDetail = {
    id: string; // TODO: 主键
    dictId: string; // TODO: 字典ID
    dictCode?: string; // TODO: 字典代码
    name?: string; // TODO: 字典的名称
    relatedCode?: string; // TODO: 字典代码
    sort?: number | string; // TODO: 排序
    remark?: string; // TODO: 备注
    deleteFlag?: number; // TODO: 删除标识:0不删除、1删除
    enableFlag?: number; // TODO: 启用标识:0不启用、1启用
    createUserId?: string; // TODO: 创建人ID
    createUserName?: string; // TODO: 创建人名称
    createTime?: string; // TODO: 创建时间
    updateUserId?: string; // TODO: 更新人ID
    updateUserName?: string; // TODO: 更新人名称
    updateTime?: string; // TODO: 更新时间
    isChange?: boolean; // TODO: 是否编辑过
  };
  //endregion

  //region TODO: EDI 配置
  type SearchEDIParams = {
    name: string;
    branchId?: string;
    currentPage: number;
    pageSize: number;
  }

  type EDI = {
    id: string; // TODO: 主键
    name?: string; // TODO:名称
    senderCode?: string; // TODO:发送方代码
    receiverCode?: string; // TODO:接受方代码
    signerCode?: string; // TODO:签单人代码
    bookingNoPrefixes?: string; // TODO:bookingNo前缀
    cutNum?: number; // TODO:切割长度，用于箱管切割铅封号多少位字符川，各个船公司不一样
    branchId?: string; // TODO:公司ID
    receiverId?: string; // TODO:接受方（数据源BU表）
    ctnModelMapper?: string; // TODO:箱型规则映射{["20GP","22G1"]}
    pkgTypeMapper?: string; // TODO:包装方式映射{["BAG","BG"]}
    serviceTypeMapper?: string; // TODO:服务类型映射{["CY/CY","CY"]}
    portMapper?: string; // TODO:港口映射{["HKHKG","HKHIT"]}
    enableFlag?: number; // TODO:启用状态:0-不启用、1-启用
    deleteFlag?: number; // TODO:删除标识
    createUserId?: string; // TODO:创建人ID
    createUserName?: string; // TODO:创建人名称
    createTime?: string; // TODO:创建时间
    updateUserId?: string; // TODO:修改人ID
    updateUserName?: string; // TODO:修改人名称
    updateTime?: string; // TODO:修改人时间
  }
  //endregion


  //region TODO: 信控
  type SearchCreditParams = {
    type: string;
    currentPage: number;
    pageSize: number;
    ownershipEntityType: string;
  };
  type Credit = {
    id: string;// TODO:
    corporation?: string;// TODO:法人或者董事
    establishedTime?: string;// TODO:成立日期
    registeredCapital?: string;// TODO:注册资金
    earning?: string;// TODO:年收入
    ownershipEntityType?: string;// TODO:所有制性质1-合营企业2-个人独资企业3-国有企业4-私营企业5-全民所有制企业6-集体所有制企业7-股份有限公司8-有限责任企业9-外商投资企业10-有限合伙企业
    creditRatingType?: string;// TODO:信用记录类型1-已发生坏账2-无经验3-款能收回并且经常拖欠4-款能收回并且偶尔拖欠5-及时付款
    cooperationMonth?: string;// TODO:合作月份
    cooperationRemark?: string;// TODO:合作影响
    lastYearReceive?: string;// TODO:上年收入(月/万)
    lastYearProfit?: string;// TODO:上年毛利(月/万)
    lastYearProfitRate?: string;// TODO:上年毛利率
    lastYearCargoInfo?: string;// TODO:上年货物信息
    creditDays?: string;// TODO:授信天数
    creditLine?: string;// TODO:授信额度(/万)
    expiryStartTime?: string;// TODO:有限期开始日
    expiryEndTime?: string;// TODO:有限期结束日
    grade1?: string;// TODO:评分项目1-注册资本(20%权重，满分5分)
    grade2?: string;// TODO:评分项目2-成立年限(10%权重，满分5分)
    grade3?: string;// TODO:评分项目3-行业类型(10%权重，满分5分)
    grade4?: string;// TODO:评分项目4-信用记录(20%权重，满分5分)
    grade5?: string;// TODO:评分项目5-预计交易规模(20%权重，满分5分)
    grade6?: string;// TODO:评分项目6-预计交易毛利(20%权重，满分5分)
    creditLevel?: string;// TODO:信用等级-根据评分结算1-AAA (4<=x<5)2-AA (3<=x<4)3-A (2<=x<3)4-B (1<=x<2)5-C (0<=x<1)
    settlementPartyId?: string;// TODO:客户id(settlementPartyDetail主键)
    settlementPartyName?: string;// TODO:客户名称
    receive?: string;// TODO:今年收入
    profit?: string;// TODO:今年毛利
    profitRate?: string;// TODO:今年毛利率
    cargoInfo?: string;// TODO:今年货物信息
    bizTypeList?: string;// TODO:信控业务的主要类型1-集装箱整箱2-拼箱3-散货4-空运5-公路6-铁路
    customerLevel?: string;// TODO:客户等级1-极好2-好3-中等4-偏低5-差
    remark?: string;// TODO:备注信息
    totalGrade?: string;// TODO:总评分(根据权重算总分，满分5分)
    cooperation?: string;// TODO:合作影响
    lastYearCreditDays?: string;// TODO:上年授信天数
    lastYearCreditLine?: string;// TODO:上年授信额度(/万)
    naturalPayDays?: string;// TODO:习惯付款天数
    bizApproveDept?: string;// TODO:业务审批部门1-事业部-多式联运2-事业部-集装箱3-事业部-大宗商品4-事业部-合同物流5-事业部-工程物流6-事业部-电商物流7-事业部-空运
    creditBusinessList?: string;// TODO:授信业务1-水运货代2-航空货代3-公路货代4-铁路货代5-专业报关6-多式联运7-合同物流8-项目物流9-船舶代理10-船舶承运11-船代订舱12-仓库码头13-汽车运输14-快件15-维修16-电商物流17-其他
    enableFlag?: string;// TODO:启用标识 0＝停用，1＝啟用
    deleteFlag?: string;// TODO:删除标识
    createUserId?: string;// TODO:创建人ID
    createUserName?: string;// TODO:创建人名称
    createTime?: string;// TODO:创建时间
    updateUserId?: string;// TODO:修改人ID
    updateUserName?: string;// TODO:修改人名称
    updateTime?: string;// TODO:修改时间
  };
  //endregion

  //region TODO:
  //endregion

  //region TODO:
  //endregion

  //region TODO:
  //endregion

  //region TODO:
  //endregion

  //region TODO:
  //endregion

  //region TODO:
  //endregion

  //region TODO:
  //endregion
}
