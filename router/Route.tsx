/* eslint-disable @typescript-eslint/no-unused-vars */
import { ReactNode } from "react";

export default function Route({path, element} : {path: string, element : ReactNode}){
    return(<>{element}</>)
}