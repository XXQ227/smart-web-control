
declare namespace APIModel {

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


    //region TODO: 单票列表页
    type responseAny = object | any;

    type GetCJobListInfo = {
        Key: string,
        AuthorityType: number,
        TimeLimitType?: number,
        TabID: number,
        UserID: number,
        IsClickSearch: boolean,
        PageNum: number,
        PageSize: number,
    };

    type CJobListItem  = {
        ID: number,
        Code: string,
        PrincipalNameEN: string,
        POLETA: string,
        ETD: string,
        ATD: string,
        ETA: string,
        MBOLNum: string,
        HBOLNum: string,
        FreighterEN: string,
        state: string,
    }

    type ResCJob = {
        CJobList: CJobListItem[] | [];

    }

    // TODO: 单票列表结果集
    type APIGetCJobListResult = {
        Divisions?: any;
        FinanceDates?: any;
        JobDto?: {
            Result?: boolean;
            Page?: APIPage;
            Content?: {
                CJobList?: CJobListItem[],
                AllFinishQty: number,
                BizFinishQty: number,
                FinishQty: number,
                OnWayNewQty: number,
                OnWayQty: number,
                PendingQty: number,
                SetFinishQty: number,
                ShutoutQty: number,
            };
        };
    };

    type RuleCJobList = {
        data?: CJobListItem[] | [];
        /** 列表的内容总数 */
        total?: number;
        success?: boolean;
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
            FinanceDates?: any,
            Division: API.APIKey$Value[],
            SalesMan?: API.APIKey$Value[],
            PayMethodOpts?: API.APIKey$Value[],
            PayInvoTypeList?: InvoiceType[],
            ResInvoTypeList?: InvoiceType[],
            UserInfo: LoginUserInfo,
            NJobDetailDto?: NJobDetailDto,
            AccountPeriodInfo?: AccountPeriodInfo,
        }
    }

    type CommonBasicInfo = {
        SalesManList?: API.APIValue$Label[],
        FinanceDates?: string[],
    }

    type NJobDetailDto = {
        ID: number,
        LockDate: string,
        FinanceDate: string,
        NBasicInfo?: NBasicInfo,
        CargoInfo?: CargoInfo,
        PayCGList?: PRCGInfo[],
        ReceiveCGList?: PRCGInfo[],
        CTNPlanList?: ContainerList[],
        CTNActualList?: CTNActualList[],
        HouseBill?: HouseBill,
    }

    type AccountPeriodInfo = {
        CurrencyOpts?: CurrencyOpts[],
        FinanceDates?: [],
    }

    //region TODO: 单票业务详情返回结果
    type NBasicInfo = {
        ID: number,
        Code: string,
        LastEditor: string,
        LastEditDate: string,
        BizType1ID: number,
        BusinessLineID: number,
        BizTypeEN: string,
        CreateDate: string,
        Operator: string,
        OceanTransportTypeID: number,
        BizRemark: string,
        Principal?: Principal,
        Carrier?: Carrier,
        Port?: Port,
        Terms?: Terms,
        MBSCN?: MBSCN,
        HBSCN?: HBSCN,
    }
    type CargoInfo = {
        HSCode?: string,
        Description?: string,
        DescriptionCN?: string,
        Mark?: string,
        GrossWeight?: number,
        Pieces?: number,
        Measurement?: number,
    }
    type Principal = {
        ClientInvoNum?: string,
        SalesManID: number,
        SalesManName: string,
        PrincipalXID: number,
        PrincipalXName: string,
        PrincipalXNameEN: string,
        PayerID?: number,
        PayerName?: string,
        PayerNameEN?: string,
        CargoOwnerID?: number,
        CargoOwnerName?: string,
        CargoOwnerNameEN?: string,
        BookingUserID?: number,
        BookingUserName?: string,
        PONum?: string,
        POLID?: number,
        POLName?: string,
    }
    type Carrier = {
        MBOLNum?: string,
        HBOLNum?: string,
        BookingAgentID?: number,
        BookingAgentName?: string,
        PODAgentID?: number,
        PODAgentName?: string,
        FreighterID?: number,
        FreighterName?: string,
        VesselName?: string,
        VoyageNum?: string,
        ContactNum?: string,
        Terminal?: string,
        ETD?: string,
        ATD?: string,
        ETAPOD?: string,
        CutCustoms?: string,
        CutVGM?: string,
        CutSingle?: string,
        PackAddress?: string,
        DeliveryAddress?: string,
        PODTerminalPickupDate?: string,
        POLTerminalReceiptDate?: string,
        PackDate?: string,
    }
    type Port = {
        POLName?: string,
        POLBill?: string,
        PODName?: string,
        PODBill?: string,
        PlaceOfReceiptName?: string,
        PlaceOfReceiptBill?: string,
        PlaceOfDeliveryName?: string,
        Destination?: string,
        TranshipmentPortList?: TranshipmentPortList[],
    }
    type TranshipmentPortList = {
        ID?: any,
        PortName?: string,
    }
    type Terms = {
        IncotermsID: number,
        ServiceTypeID: number,
        ServiceTypeName: string,
        PayableAtID: number,
        PayableAtName: string,
    }
    type MBSCN = {
        Shipper?: string,
        Consignee?: string,
        NotifyParty?: string,
        NotifyParty2?: string,
    }
    type HBSCN = {
        PODAgent?: string,
    }
    type BatchData = {
        shipmentNo: string;
        truckingCompany: string;
        grossWeight: number;
        measurement: number;
        pieces: number;
        vehicleType: string;
        plateNo: string;
        driverName: string;
        receivingContac: string;
        phone: string;
        containerList?: ContainerList[],
    }
    type ContainerList = {
        ID: any,
        CTNModelID?: number,
        CTNModelName?: string,
        QTY?: number,
        IsSOC?: boolean,
        IsFCL?: boolean,
        Owner?: string,
        Remark?: string,
    }
    type CTNActualList = {
        ID: any,
        CTNModelID?: number,
        CTNModelName?: string,
        CTNNum?: string,
        SealNum?: string,
        Pieces?: number,
        VGM?: number,
        GrossWeight?: number,
        Measurement?: number,
        PKGTypeID?: number,
        PKGTypeNmae?: string,
    }
    type HouseBill = {
        SignMethodID?: number,
        SignBillQTY?: number,
        IssuePlaceID?: number,
        IssuePlaceName?: string,
        IssueDate?: string,
    }
    type PhotoRemarkList = {
        ID: any,
        Description: string,
        Time: string,
        // photo:
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
        CTID?: number | null,
        CTName?: string,
        CGItemID?: number | null,
        CGItemName?: string,
        CGUnitID?: number | null,
        CGUnitName?: string,
        QTY?: any,
        QTYStr?: string,
        UnitPrice?: any,
        UnitPriceStr?: string,
        Amount?: any,
        AmountStr?: string,
        AmountABill?: number | null,
        AmountFunc?: number | null,
        AmountFuncNoTax?: number | null,
        IsOperatorConfirm?: boolean | null,
        IsManagerConfirm?: boolean | null,
        IsSecondConfirm?: boolean | null,
        CurrencyID?: number,
        CurrencyName?: string,
        ABillCurrencyTempID?: number,
        ABillCurrencyTempName?: string,
        ExRate?: number,
        ExRateStr?: string,
        CreatorID?: number | null,
        CreatorName?: string,
        InvoTypeID?: number,
        InvoTypeName?: string,
        Remark?: string,
        CreateTime?: string,
        isChange?: boolean | null,
        InvoNum?: string | null,
        State?: string,
        CGType?: number,
    }
    //endregion TODO: 单票查询页面

    //endregion TODO: 单票查询页面


}