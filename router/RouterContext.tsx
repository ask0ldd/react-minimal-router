import { createContext } from "react"

export const RouterContext = createContext<RouterContextValue | undefined>(undefined)

interface RouterContextValue {
    getParams : () => Record<string, string>
    navigate : (path : string) => void
    checkAuthCallback : () => boolean
}