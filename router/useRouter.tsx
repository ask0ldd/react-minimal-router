import { use } from "react";
import { RouterContext } from "./RouterContext";

export function useRouter(){
    const context = use(RouterContext);
    if (context === undefined) {
      throw new Error('useRouter must be used within a RouterProvider')
    }
    return context
}