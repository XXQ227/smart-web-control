import React, {Fragment} from 'react';
import Basic from "./basic";
import Pickup from "./pickup";
import Ports from "./port";
import Containers from "./containers";
import BillOfLoading from "./bill-of-loading";
import Remark from "./remark";

// const FormItem = Form.Item;
interface Props {
    Carrier?: APIModel.Carrier,
    HouseBill?: APIModel.HouseBill,
    Port?: APIModel.Port,
    NBasicInfo: APIModel.NBasicInfo,
    CTNPlanList?: APIModel.ContainerList[],
    CTNActualList?: APIModel.CTNActualList[],
}

const SeaExport: React.FC<Props> = (props) => {
    const  {
        Carrier, HouseBill,
        Port, NBasicInfo,
        CTNPlanList, CTNActualList
    } = props;
    //endregion

    return (
       <Fragment>
           <Basic
               title={'Basic'}
               Carrier={Carrier}
               HouseBill={HouseBill}
           />

           {/* 提货信息 */}
           <Pickup
               title={'Pickup'}
               Carrier={Carrier}
           />

           {/* 港口信息 */}
           <Ports
               title={'Port'}
               Port={Port}
               NBasicInfo={NBasicInfo}
           />

           <Containers
               CTNPlanList={CTNPlanList}
               CTNActualList={CTNActualList}
               NBasicInfo={NBasicInfo}
           />

           {/* 收发通信息 */}
           <BillOfLoading
               title={'Bill Of Loading'}
               Port={Port}
               NBasicInfo={NBasicInfo}
           />

           <Remark
               title={'Remark'}
               Port={Port}
               NBasicInfo={NBasicInfo}
           />
       </Fragment>
    )
}
export default SeaExport;