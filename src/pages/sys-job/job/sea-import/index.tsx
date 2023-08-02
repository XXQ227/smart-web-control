import React, {Fragment, useEffect} from 'react';
import Basic from "./basic";
import Ports from "./port";
import Remark from "@/pages/sys-job/job/sea-export/remark";
import Containers from "@/pages/sys-job/job/sea-export/containers";
import {RouteChildrenProps} from 'react-router'

interface Props {
    Carrier?: APIModel.Carrier,
    HouseBill?: APIModel.HouseBill,
    Port?: APIModel.Port,
    NBasicInfo: APIModel.NBasicInfo,
    CTNPlanList?: APIModel.ContainerList[],
    CTNActualList?: APIModel.CTNActualList[],
}

const SeaImport: React.FC<RouteChildrenProps> = (props) => {
    const  {
    } = props;

    useEffect(() => {

    }, [])
    //endregion

    return (
       <Fragment>
           <Basic
               title={'Basic'}
           />

           {/* 港口信息 */}
           <Ports
               title={'Port'}
           />

           <Containers type={'import'}/>

           <Remark type={'import'} title={'Remark'}/>
       </Fragment>
    )
}
export default SeaImport;