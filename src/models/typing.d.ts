
declare namespace API {
    type responseObj = {
        Content: string | object | any,
        Page: object,
        Result: boolean
    };
    type responseAny = object | any;

    //region TODO: 单票详情页面
    // TODO: 单票详情搜索参数
    type GetCJobByID = {
        CJobID: number,
        UserID: number,
    }

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

    //region TODO: 单票详情返回结果
    type NJobDetailDto = {
        ID: number,
        NBasicInfo: NBasicInfo,
    }

    type NBasicInfo = {
        Code: string,
        Principal: Principal,

    }
    type Principal = {
        SalesManID: ID,
        SalesManName: string,

    }
    //endregion TODO: 单票详情返回结果
    //endregion TODO: 单票查询页面
}