
declare namespace API {
    type responseObj = {
        Content: string | object | any,
        Page: object,
        Result: boolean
    };
    type responseAny = object | any;

    //region TODO: 用户登录后返回信息
    type LoginUserInfo = {
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
        UserID: number,
    }

    //region TODO: 单票详情返回结果
    //endregion TODO: 单票详情返回结果

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
        }
    }
    type NJobDetailDto = {
        ID: number,
        NBasicInfo: NBasicInfo,
    }
    type NBasicInfo = {
        Code: string,
        Principal: Principal,
    }
    type Principal = {
        SalesManID: number,
        SalesManName: string,
    }
    //endregion TODO: 单票查询页面
}