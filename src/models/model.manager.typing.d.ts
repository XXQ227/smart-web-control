
declare namespace APIModel {
    //region TODO:  结算对象
    // TODO: 结算对象搜索参数
    import PageParams = API.PageParams
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

    //region TODO:
    //endregion

    //region TODO:
    //endregion
}