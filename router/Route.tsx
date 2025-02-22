/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";
import { ReactNode } from "react";

const Route = React.memo(function Route({ path, element }: { path: string, element: ReactNode }) {
    return <>{element}</>
})
  
export default Route