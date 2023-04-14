
declare namespace API {
    type KeyValue = {
        Key: number,
        Value: string,
    };
    type responseObj = {
        Content: string | object | any,
        Page: object,
        Result: boolean
    };
    type responseAny = object | any;

    //region TODO: 用户登录后返回信息
    type LoginUserInfo = {
        AuthIDList: any,
        AuthorityIDList: string,
        password: string,
        DisplayName: string,
        ID: number,
        BranchID: number,
        Token: string,
        CityID: number,
        CityName: string,
        CountryID: number,
        CountryName: string,
        FuncCurrency: string,
        IsOpenAccount: boolean,
        IsSalesMan: boolean,
        DivisionID: number,
        BranchCode: string,
        FinereportURL: string,
        PUAList: any,
        Email: string,
        geographic?: {
            province?: { label?: string; key?: string };
            city?: { label?: string; key?: string };
        };
    };
    //endregion


    //region TODO: 单票详情页面
    // TODO: 单票详情搜索参数
    type GetCJobByID = {
        CJobID: number,
        UserID?: number,
    }


    // TODO: 单票详情数据
    type GetCJobByIDResponse = {
        Result: boolean,
        Page: API.APIPage,
        Content: {
            APStartDate: string,
            BillingLimit: string,
            IsPrepareClose: boolean,
            CurrencyOpts: object,
            DefaultUnit: object,
            FinanceDates: any,
            Division: any,
            PayInvoTypeList: any,
            PayMethodOpts: any,
            ProjectOpts: any,
            ResInvoTypeList: any,
            SalesMan: any,
            UserInfo: object,
            NJobDetailDto: NJobDetailDto,
            AccountPeriodInfo?: AccountPeriodInfo,
        }
    }
    type NJobDetailDto = {
        ID: number,
        NBasicInfo?: NBasicInfo,
        PayCGList?: PRCGInfo[],
        ReceiveCGList?: PRCGInfo[],
    }

    type AccountPeriodInfo = {
        CurrencyOpts?: CurrencyOpts[],
    }

    //region TODO: 单票业务详情返回结果
    type NBasicInfo = {
        Code: string,
        Principal?: Principal,
    }
    type Principal = {
        SalesManID: number,
        SalesManName: string,
    }
    //endregion TODO: 单票业务详情返回结果

    //endregion TODO: 单票费用详情
    // TODO: 币种
    type CurrencyOpts = {
        RateValue: number,
        CurrencyID: number,
        Currency: string,
    }
    // TODO: 发票类型
    type InvoiceType = {
        Key: number,
        Value: string,
        Type: number,
    }
    type PRCGInfo = {
        CGID?: any,
        CTID?: number,
        CTName?: string,
        CGItemID?: number,
        CGItemName?: string,
        QTY?: any,
        QTYStr?: string,
        UnitPrice?: any,
        UnitPriceStr?: string,
        Amount?: any,
        AmountStr?: string,
        AmountABill?: number,
        AmountFunc?: number,
        AmountFuncNoTax?: number,
        IsOperatorConfirm?: boolean,
        IsManagerConfirm?: boolean,
        IsSecondConfirm?: boolean,
        CurrencyID?: number,
        CurrencyName?: string,
        ABillCurrencyTempID?: number,
        ABillCurrencyTempName?: string,
        ExRate?: number,
        ExRateStr?: string,
        CreatorID?: number,
        CreatorName?: string,
        InvoTypeID?: number,
        InvoTypeName?: string,
        Remark?: string,
        CreateTime?: string,
        isChange?: boolean,
        InvoNum?: number,
        State?: string,
        CGType?: number,
    }
    //endregion TODO: 单票查询页面

    //endregion TODO: 单票查询页面


}