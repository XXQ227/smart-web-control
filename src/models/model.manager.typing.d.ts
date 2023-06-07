
declare namespace APIManager {
    //region TODO:  结算对象
    // TODO: 结算对象搜索参数
    type CVSearchParams = {
        current?: number | null,
        PageNum?: 1 | number | null,
        OracleID?: string,
        OracleIDSupplier?: string,
        CustomerUBSID?: string,
        SupplierUBSID?: string,
        TaxNum?: string,
        CTName?: string,
        NameFull?: string,
        PageSize?: 15 | number | null,
        CTType?: 1 | number | string | null,
        UserID?: number | null,
    }
    type CVResultInfo = {
        data: CVInfo[];
        /** 列表的内容总数 */
        total: number | null;
        success: boolean;
    };

    type GetCVInfoParams = {
        UserID: number | null,
        CTPID: number | null,
    };
    type GetCVInfoResult = {
        CTDetailDto: CVInfo,
        CTTypeOpts: CTTypeOpts[],
        Industrys: Industrys[],
        CustomerPropertyList: CustomerProperty[],
        BusinessLine: BusinessLine[],
    };
    type CVInfo = {
        ID: number | null,
        CTPID: number | null,
        CTTypeItem?: string,
        BranchName?: string,
        CustSupCode: string,
        Freezen: number | null,
        NameFull: string,
        NameFullEN: string,
        Address: string,
        OracleID: string,
        OracleIDSupplier: string,
        Settlement: number | null,
        TaxCode: string,
        BusinessLine?: any,
        BusinessLineList?: any[],
        CustomerPropertyID?: number | null,
        CTTypeItemClient?: number | null,
        CTTypeItemIDClient?: number | null,
        CTTypeItemListSupplier?: number | null,
        CTList?: any[],
        SCAC?: string,
        cityId?: number,
        cityName?: string,
        parentCompanyId?: number,
        parentCompanyName?: string,
    }
    // TODO: 行业
    type Industrys = {
        BizPlateType: number,
        Name: string,
        NameEN: string,
        PrimaryID: number,
        industrys: industrys[]
    }
    type industrys = {
        IndustryID: number,
        Name: string,
        NameEN: string,
        Remark: string,
        RemarkEN: string,
    }
    type IndustrysTreeSelect = {
        title: string,
        value: string,
        key: string,
        disabled: true,
        children: industrysTreeSelect[],
    }
    type industrysTreeSelect = {
        title: string,
        value: number,
        key: number,
        remark: string,
    }
    // TODO: 客户、供应商属性
    type CTTypeOpts = {
        ID: number,
        Name: string,
        CTTypeItemList: CTTypeItemList[],
    }
    // TODO: 客户、供应商属性
    type CTTypeItemList = {
        ID: number,
        NameCN: string,
        NameEN: string,
        CTTypeID: number,
        CTTypeName: string,
    }
    // TODO: 客户属性
    type CustomerProperty = {
        Key: number,
        Value: string,
        NameEN: string,
    }
    // TODO: 业务线
    type BusinessLine = {
        ID: number,
        Name: string,
        NameEN: string,
    }
    //endregion

    //region TODO: 港口
    type SearchPortParams = {
        current?: number;
        name?: string,
        currentPage?: number,
        pageSize?: number,
        // total: number;
    }

    type Port = {
        id: number | string | null,      // TODO:
        alias: string,                   // TODO: 港口别名
        cityId?: number,                  // TODO: 城市id
        cityName?: string,                // TODO: 城市名称
        code: string,                    // TODO: 港口的五字编码
        name: string,                    // TODO: 港口名世界通用
        tradePlaceCod: string,           // TODO: 主数据代码
        enableFlag?: number,             // TODO: 启用标识
        deleteFlag?: number,             // TODO: 删除标识
        createUserId?: number,           // TODO: 创建人ID
        createUserName?: string,         // TODO: 创建人名称
        createTime?: string,             // TODO: 创建时间
        updateUserId?: number,           // TODO: 修改人ID
        updateUserName?: string,         // TODO: 修改人名称
        updateTime?: string,             // TODO: 修改时间
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
        name?: string,
        code?: string,
        currentPage?: number | null,
        pageSize?: number | 15 | null,
    }
    type StandardCGItem = {
        id: string,
        branchId?: string,              // TODO: 公司ID
        code?: string,                  // TODO: 费目名称编码
        name?: string,                  // TODO: 费目名称
        chargeStandardName?: string,    // TODO: 标准费目ID
        subjectCodeAr?: string,         // TODO: 科目代码-收
        subjectCodeAp?: string,         // TODO: 科目代码-付
        subjectCodeAd?: string,         // TODO: 科目代码-代收代付
        enableFlag?: number,            // TODO: 启用标识 0＝停用，1＝啟用
        deleteFlag?: number,            // TODO: 删除标识
        createUserId?: string,          // TODO: 创建人ID
        createUserName?: string,        // TODO: 创建人名称
        createTime?: string,            // TODO: 创建时间
        updateUserId?: string,          // TODO: 修改人ID
        updateUserName?: string,        // TODO: 修改人名称
        updateTime?: string,            // TODO: 修改时间
        isChange?: boolean,              // TODO: 编辑状态
    }
    // TODO: 费目
    type SearchCGItemParams = {
        name?: string,
        code?: string,
        currentPage?: number | null,
        pageSize?: number | 15 | null,
    }

    type CGItem = {
        id: string,
        branchId?: string,              // TODO: 公司ID
        code?: string,                  // TODO: 费目名称编码
        name?: string,                  // TODO: 费目名称
        chargeStandardId?: string,      // TODO: 标准费目ID
        chargeStandardName?: string,    // TODO: 标准费目ID
        subjectCodeAr?: string,         // TODO: 科目代码-收
        subjectCodeAp?: string,         // TODO: 科目代码-付
        subjectCodeAd?: string,         // TODO: 科目代码-代收代付
        enableFlag?: number,            // TODO: 启用标识 0＝停用，1＝啟用
        deleteFlag?: number,            // TODO: 删除标识
        createUserId?: string,          // TODO: 创建人ID
        createUserName?: string,        // TODO: 创建人名称
        createTime?: string,            // TODO: 创建时间
        updateUserId?: string,          // TODO: 修改人ID
        updateUserName?: string,        // TODO: 修改人名称
        updateTime?: string,            // TODO: 修改时间
        isChange?: boolean,              // TODO: 编辑状态
    }
    //endregion

    //region TODO: 费用模板
    type SearchCGTempParams = {
        UserID: number,
        Name: string,
    }

    type CGTempResult = {
        data: CGTemp[];
        /** 列表的内容总数 */
        total: number | null;
        /** 返回结果 */
        success?: boolean;
    };

    type CGTemp = {
        ID: number | string,
        Name: string,
        BizType1Name: string,
        BizType1NameEN: string,
        CreateDate: string,
        CreatorName: string,
    }

    type CGTempByIDParams = {
        UserID: number,
        ID: number | string,
    }

    type CGTempByIDResult = {
        UserID: number,
        Name: string,
    }


    type SaveCGItem = {
        Name: string,
        APUSDRate: string,
        ARUSDRate: string,
        ServicesID?: number | null,
        PurposeofCallID?: number | null,
        ID: number | string,
        CGTempItems?: CGTempItems[],
        BizType1ID?: number | null,
    }

    type CGTempItems = {
        ID: number | string,
        SettlementID: number | null,
        SettlementName?: string,
        SettlementNameEN?: string,
        CTName: string,
        CGUnitID: number | null,
        CGUnitName: string | null,
        CGItemID: number | null,
        CGItemName?: string,
        SettlementType?: string,
        SettlementTypeName?: string,
        CGTypeID: number,
        UnitPrice: number | null,
        CurrencyID: number | null,
        InvoTypeID: number | null,

        PayMethodID: number | null,
        ctCheck?: boolean,
        TaxFree?: boolean,
    }

    //endregion

    //region TODO: Branch
    type SearchBranchParams = {
        name: string,
    }
    type BranchResult = {
        data: Branch[];
        /** 列表的内容总数 */
        total: number | null;
        /** 返回结果 */
        success?: boolean;
    };
    type Branch = {
        /** 列表的内容总数 */
        id: string;                  // TODO: 主键 ID
        contactName?: string;              // TODO: 联系人
        phone?: string;                     // TODO: 电话
        address?: string;                   // TODO: 公司地址
        cityName?: string;                 // TODO: 公司所在城市
        code?: string;                      // TODO: 分公司编码
        defaultPortId?: number | null;    // TODO: 公司所在区域的默认港口
        funcCurrencyName?: string;        // TODO: 本位币
        nameFullEn?: string;              // TODO: 公司全称(英文)
        nameFullLocal?: string;           // TODO: 公司全称(当地)
        nameShortEn?: string;             // TODO: 公司简称(英文)
        nameShortLocal?: string;          // TODO: 公司简称(当地)
        orgId?: string;                    // TODO: 公司 oracle id
        orgCreateId?: string;             // TODO: AUC组织识别码
        taxNum?: string;                   // TODO: 统一社会信用码，或税号
        bankAccountIds?: string;           // TODO: 公司银行id集合
        enableFlag?: number | null;         // TODO: 启用标识
        deleteFlag?: number | null;         // TODO: 删除标识
        createUserId?: string;              // TODO: 创建人ID
        createUserName?: string;            // TODO: 创建人名称
        createTime?: string;               // TODO: 创建时间
        updateUserId?: string;              // TODO: 修改人ID
        updateUserName?: string;            // TODO: 修改人名称
        updateTime?: string;               // TODO: 修改时间
    };
    //endregion

    //region TODO: Department 部门
    type SearchDeptParams = {
        UserID: number,
        Name: string,
    }
    type DepartmentResult = {
        data: Department[];     // TODO: 部门数据 <Array>
        /** 列表的内容总数 */
        total: number | null;
        /** 返回结果 */
        success?: boolean;
    };
    type Department = {
        id: number | string | null,     // TODO: 主键 ID
        name: string,                   // TODO: 组织名称
        email: string,                  // TODO: 邮箱
        parentId: number | null,       // TODO: 父类组织ID
        level: number | null,           // TODO: 级别
        sort: number | null,            // TODO: 排序号
        chargePerson: string,          // TODO: 负责人
        contactPhone: string,          // TODO: 联系电话
        parentIds: string,             // TODO: 父ID集合
        enableFlag: number,           // TODO: 启用状态:0-不启用、1-启用
        deleteFlag: boolean,           // TODO: 删除标识
        createUserId: number | null,  // TODO: 创建人ID
        createUserName?: string,      // TODO: 创建人名称
        createTime?: string,           // TODO: 创建时间
        updateUserId: number | null,  // TODO: 修改人ID
        updateUserName?: string,      // TODO: 修改人名称
        updateTime?: string,           // TODO: 修改人时间
        isChange?: boolean,              // TODO: 编辑状态
    }

    type SaveDepartment = {
        id: number,
        success?: boolean;
    }
    //endregion

    //region TODO: User 信息
    type SearchUserParams = {
        name: string,
    }

    type User = {
        id: number | string | null,         // TODO:
        nameDisplay: string,               // TODO: 用户名
        nameLogin: string,                 // TODO: 用户登录名
        leaderId: string,                   // TODO: 用户领导 id
        leaderName: string,                 // TODO: 用户领导 name
        branchId: number | null,           // TODO: 用户公司 id
        departmentId: number | null,       // TODO: 部门 id
        oracleId: string,                  // TODO: oracle id
        password: string,                   // TODO: 密码
        salesFlag: number | null,           // TODO: 销售标识：1-是0-不是
        codeSino: string,                  // TODO: 中外运编号
        codeF8: string,                    // TODO: F8唯一编码
        enableFlag: number | null,         // TODO: 启用标识
        deleteFlag: number | null,         // TODO: 删除标识
        createUserId: number | null,      // TODO: 创建人ID
        createUserName?: string,          // TODO: 创建人名称
        createTime?: string,               // TODO: 创建时间
        updateUserId: number | null,      // TODO: 修改人ID
        updateUserName?: string,          // TODO: 修改人名称
        updateTime?: string,               // TODO: 修改时间
    }
    //endregion

    //region TODO: 项目
    type SearchProjectParams = {
        current?: number;
        currentPage?: number,
        pageSize?: number,
    }

    type Project = {
        id: number | string | null,         // TODO: 主键ID
        code: string,                       // TODO: 编号
        nameFull: string,                   // TODO: 项目全称
        nameShort: string,                  // TODO: 项目简称
        managerId: number,                  // TODO: 项目经理
        oracleId: string,                   // TODO: oracleID
        branchId: number,                   // TODO: 公司ID
        industryType: number,               // TODO: 行业类型
        contractId: number,                 // TODO: 合同方（业务单位）
        pmsCode: string,                    // TODO: 项目管理代码
        portionAFlag: number,               // TODO: 业务段A标识 0-未开启 1-已开启
        portionBFlag: number,               // TODO: 业务段B标识 0-未开启 1-已开启
        portionCFlag: number,               // TODO: 业务段C标识 0-未开启 1-已开启
        startDate: string,                  // TODO: 项目开始时间
        endDate: string,                    // TODO: 项目结束时间
        remark: string,                     // TODO: 备注
        enableFlag: number,                 // TODO: 启用标识
        deleteFlag: number,                 // TODO: 删除标识
    }
    //endregion

    //region TODO: 字典
    type SearchDictParams = {
        dictName: string,                   // TODO: 字典类型对应的名称
        dictCode: string,                   // TODO: 字典类型对应的code码
    }
    type Dict = {
        id: string,
        dictName: string,               // TODO: 字典类型对应的名称
        dictCode: string,               // TODO: 字典类型对应的code码
        remark: string,                 // TODO: 备注信息
        deleteFlag?: number,            // TODO: 删除标识:0不删除、1删除
        enableFlag?: number,            // TODO: 启用标识:0不启用、1启用
        createUserId?: number | null,   // TODO: 创建人
        createUserName?: string,
        createTime?: string,            // TODO: 创建时间
        updateUserId?: number | null,   // TODO: 更新人
        updateUserName?: string,
        updateTime?: string,            // TODO: 更新时间
        isChange?: boolean              // TODO: 是否编辑过
    };
    //endregion

    //region TODO: 字典详情
    type SearchDictDetailParams = {
        dictId?: number | string,        // TODO: 字典类型
        dictLabel?: string,              // TODO: 字典的名称
        currentPage?: number,            // TODO: 当前页数
        pageSize?: number,               // TODO: 每页数
    }
    type DictDetail = {
        id: string                      // TODO: 主键
        dictId: string                 // TODO: 字典ID
        dictLabel: string              // TODO: 字典的名称
        dictCode: string               // TODO: 字典代码
        dictValue: string              // TODO: 字典的值
        sort?: number                    // TODO: 排序
        remark: string                  // TODO: 备注
        deleteFlag?: number             // TODO: 删除标识:0不删除、1删除
        enableFlag?: number             // TODO: 启用标识:0不启用、1启用
        createUserId?: string          // TODO: 创建人ID
        createUserName?: string        // TODO: 创建人名称
        createTime?: string             // TODO: 创建时间
        updateUserId?: string          // TODO: 更新人ID
        updateUserName?: string        // TODO: 更新人名称
        updateTime?: string             // TODO: 更新时间
        isChange?: boolean              // TODO: 是否编辑过
    };
    //endregion

    //region TODO:
    //endregion

    //region TODO:
    //endregion
}