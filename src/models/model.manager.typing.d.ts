
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
        city_id?: number,
        city_name?: string,
        parent_company_id?: number,
        parent_company_name?: string,
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
        Key?: string,
        Type?: number | null,
        current?: number | null,
        pageSize?: number | 15 | null,
        PageSize?: number | 15 | null,
        PageNum?: number | 1 | null,
    }

    type PortResult = {
        data: Port[];
        /** 列表的内容总数 */
        total: number | null;
        success?: boolean;
    };

    type Port = {
        ID: number | string | null,
        Name: string,
        Code: string,
        CityID?: number | null,
        CityName?: string,
        CountryID?: number | null,
        CountryName?: string,
        Freezen: boolean,
        TransportTypeID?: number | null,
        TransportTypeName?: string,
    }
    //endregion

    //region TODO: 账期
    type SearchAccountParams = {
        UserID: number,
        Year: string | undefined,
    }
    type AccountResult = {
        data: AccountList[];
        /** 列表的内容总数 */
        total: number | null;
        success?: boolean;
    };
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
    type SearchCGItemParams = {
        value?: string,
        UserID: number,
        SystemID: number,
        current?: number | null,
        pageSize?: number | 15 | null,
        PageSize?: number | 15 | null,
        PageNum?: number | 1 | null,
    }

    type CGItemResult = {
        data: CGItem[];
        /** 列表的内容总数 */
        total: number | null;
        /** 返回结果 */
        success?: boolean;
    };

    type CGItem = {
        ID: number | string | null,
        CargoCGItemID: number | string | null,
        Code: string,
        Freezen: boolean,
        Biztype1ID: number | null,
        Name: string,
        CGItemName: string,
        CGUnitID?: number | null,
        CGUnitName?: string,
        StandardCGItemID?: number | null,
        StandardCGItemName?: string,
        UBSCode?: string,
        UBSCodeAPNoVat?: string,
        UBSCodeAPVat?: string,
        UBSCodeARNoVat?: string,
        UBSCodeARVat?: string,
        isChange?: boolean,
        UserID?: number,
    }
    type DeleteFreezenCGItem = {
        SystemID: number,
        UserID: number,
        CGItemID: number,
        CGItemName: string,
        IsFreezen?: boolean,
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
        UserID: number,
        Name: string,
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
        id: number | null;
        /** 返回结果 */
        contact_name?: string;
        phone?: string;
        address?: string;
        city_name?: string;
        code?: string;
        default_port_id?: number | null;
        func_currency_name?: string;
        name_full_en?: string;
        name_full_local?: string;
        name_short_en?: string;
        name_short_local?: string;
        org_id?: number | null;
        org_create_id?: number | null;
        tax_num?: string;
        bank_account_ids?: string;
        enable_flag?: string;
        delete_flag?: string;
        create_user_id?: number | null;
        create_user_name?: string;
        create_time?: string;
        update_user_id?: number | null;
        update_user_name?: string;
        update_time?: string;
    };

    type Department = {
        id: number | string | null,
        name: string,
        parent_id: number | null,
        level: number | null,
        sort: number | null,
        charge_person: string,
        contact_phone: string,
        address: string,
        parent_ids: string,
        delete_flag: boolean,
        enable_flag: boolean,
        create_user_id: number | null,
        create_user_name?: string,
        create_time?: string,
        update_user_id: number | null,
        update_user_name?: string,
        update_time?: string,
    }

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