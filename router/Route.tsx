/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";
import { ReactNode } from "react";
import { useRouter } from "./useRouter";

const Route = React.memo(function Route({ element, fallbackElement, protect }: RouteProps) {

    const { checkAuthCallback } = useRouter()

    if(protect && checkAuthCallback() == false) return (<>{fallbackElement}</>)

    return <>{element}</>
})
  
export default Route

type RouteProps = {
    path: string;
    element: ReactNode;
} & (
    | { protect: true; fallbackElement: ReactNode }
    | { protect?: false | undefined; fallbackElement?: never }
);