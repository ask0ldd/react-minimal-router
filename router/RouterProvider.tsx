/* eslint-disable @typescript-eslint/no-unused-vars */
import { ReactNode, useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import React from "react";
import Route from './Route';
import { RouterContext } from "./RouterContext";

export function RouterProvider({ children, base = '', checkAuthCallback = () => true }: { children: ReactNode, base? : string, checkAuthCallback? : () => boolean }){

    // the element that needs to be displayed according to the active path
    const [activeChild, setActiveChild] = useState<ReactNode>(<></>)
    const params = useRef<Record<string, string>>({})

    // convert all the <Route> child components of the context provider into a {path, pathMatchingRegex, paramsKeys, element} object
    // !!! add try catch
    const routing = useMemo(() => {
        try{
            return React.Children.map(children, (child) => {
                if (React.isValidElement<React.ComponentProps<typeof Route>>(child) && child.type === Route) {

                    // fallback route
                    if(child.props.path == "*") return ({
                        path : '*',
                        pathMatchingRegex : new RegExp('(?s:.*)'),
                        paramsKeys : [],
                        element: child
                    })

                    // getting rid of trailing "/""
                    const path = base + child.props.path.replace(/\/$/, "")
                    const paramsKeys = URLUtils.extractParams(path)
                    const pathMatchingRegex = paramsKeys.length == 0 ? 
                        new RegExp(`^${path}$`) : 
                            // replace /: with the same number of /[^/]+ so it can be compared to the active url
                            new RegExp(`^${path}`.replace(/\/:[^/]+(?=\/|$)/g, (match) => match.endsWith('/') ? `(/[^/]+)` + '/' : `(/[^/]+)`) + '$')
                    return ({ 
                        path,
                        pathMatchingRegex,
                        paramsKeys,
                        element: child
                    })

                }
                throw new RouterChildNotRouteError()
            })
        }catch(error){
            console.error(error)
        }
    }, [children])

    /*
    // history.pushState now sends a pushstate event
    */
    const pushStateReplaced = useRef<boolean>(false)
    useEffect(() => {
        if(pushStateReplaced.current) return
        const originalPushState = history.pushState
        history.pushState = function(...args) {
            originalPushState.apply(this, args)
            window.dispatchEvent(new Event('pushstate'))
        }
        pushStateReplaced.current = true
    }, [])

    const getHistorySnapshot = useCallback(() => {
        return window.location.href.replace(/\/$/, "")
    }, [])

    const subscribe = useCallback((callback : () => void) => {
        window.addEventListener('popstate', callback)
        window.addEventListener('pushstate', callback)
        return () => {
          window.removeEventListener('popstate', callback)
          window.removeEventListener('pushstate', callback)
        }
    }, [])

    const historyState = useSyncExternalStore(
        subscribe, 
        getHistorySnapshot
    )

    const handleMatchingRoute = useCallback((route: IRoute, historyState: string) => {
        const nExpectedParams = route.paramsKeys.length
        if(nExpectedParams > 0) {
            const extractedParams = historyState.split('/').slice(-nExpectedParams)
            if(extractedParams.length != nExpectedParams) throw new Error(`Expected ${nExpectedParams} params, but got ${extractedParams.length}`)
            params.current = Object.fromEntries(route.paramsKeys.map((key, index) => [key, extractedParams[index]]))
        }
        if(!Object.is(activeChild, route.element)) setActiveChild(route.element)
    }, [activeChild, setActiveChild]);

    /*
    // React to any url change
    */
    useEffect(() => {
        try{
            // look for a route matching the navbar url
            const activeRoute = routing?.find(route => {
                // if no base defined, won't use the full url for comparison, only the post host segment of the navbar url
                const historyRelevantSegment = base ? historyState : URLUtils.extractPostHostUrlSegment(historyState)
                return historyRelevantSegment.match(route.pathMatchingRegex)
            })
            if(activeRoute) return handleMatchingRoute(activeRoute, historyState)

            // fallback route
            const defaultRoute = routing?.find(route => route.path == '*')
            if(defaultRoute) handleMatchingRoute(defaultRoute, historyState)

            throw new NoRouteMatchingError()
        } catch(error){
            console.error(error)
        }
    }, [historyState])

    // Allows for programmatical navigation
    const navigate = useCallback((path : string) =>{
        history.pushState(null, '', path)
    }, [])

    // Allow for url params retrieval
    const getParams = useCallback(() => {
        return params.current
    }, [params.current])

    return (
        <RouterContext value={{navigate, getParams, checkAuthCallback}}>
            {activeChild}
        </RouterContext>
    )
}


class URLUtils{
    static extractParams(url : string) {
        const regex = /\/:([\w-]+)/g;
        const matches = url.match(regex);
        
        if (!matches) {
          return [];
        }
        
        return matches.map(match => match.slice(2));
    }

    static extractPostHostUrlSegment(link : string){
        const url = new URL(link)
        return link.split(url.host)[1]
    }
}

interface IRoute{
    path: string
    pathMatchingRegex: RegExp
    paramsKeys: string[]
    element: ReactNode
}

export class NoRouteMatchingError extends Error {
    constructor(message?: string) {
      super(message || 'No route matching this url.');
      this.name = 'NoRouteMatchingError';
      
      Object.setPrototypeOf(this, NoRouteMatchingError.prototype);
    }
}

export class RouterChildNotRouteError extends Error {
    constructor(message?: string) {
      super(message || 'All children of Router must be Route components.');
      this.name = 'RouterChildNotRouteError';
      
      Object.setPrototypeOf(this, RouterChildNotRouteError.prototype);
    }
}

/*
    const router = createBrowserRouter([
    {
        path: "/",
        element: <Root />,
        children: [
        {
            path: "home",
            element: <Home />,
        },
        {
            path: "about",
            element: <About />,
        },
        ],
    },
    ]);
    <RouterProvider router={router} />
*/