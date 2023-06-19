import React, {Fragment, useEffect} from 'react';
import Basic from "./basic";
import Ports from "./port";
import Remark from "@/pages/sys-job/job/basic-info-form/sea-export/remark";
import Containers from "@/pages/sys-job/job/basic-info-form/sea-export/containers";

interface Props {
    Carrier?: APIModel.Carrier,
    HouseBill?: APIModel.HouseBill,
    Port?: APIModel.Port,
    NBasicInfo: APIModel.NBasicInfo,
    CTNPlanList?: APIModel.ContainerList[],
    CTNActualList?: APIModel.CTNActualList[],
}

const SeaImport: React.FC<Props> = (props) => {
    const  {
        Carrier, HouseBill,
        Port, NBasicInfo,
        CTNPlanList, CTNActualList
    } = props;

    useEffect(() => {

    }, [])
    //endregion

    return (
       <Fragment>
           <Basic
               title={'Basic'}
               Carrier={Carrier}
               HouseBill={HouseBill}
           />

           {/* 港口信息 */}
           <Ports
               title={'Port'}
               Port={Port}
               NBasicInfo={NBasicInfo}
               Carrier={Carrier}
           />

           <Containers
               type={'import'}
               CTNPlanList={CTNPlanList}
               CTNActualList={CTNActualList}
               NBasicInfo={NBasicInfo}
           />

           <Remark
               type={'import'}
               title={'Remark'}
               Port={Port}
               NBasicInfo={NBasicInfo}
           />
       </Fragment>
    )
}
export default SeaImport;