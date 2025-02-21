import { PropsWithChildren, useEffect, useRef } from "react"

export default function Link({children, href} : PropsWithChildren<{href : string}>){
    const anchorRef = useRef<HTMLAnchorElement | null>(null)

    useEffect(() => {
        function pushState(event: MouseEvent) {
            event.preventDefault()
            history.pushState(null, '', href)
        }

        const currentAnchor = anchorRef.current;
        if (currentAnchor) {
            currentAnchor.addEventListener('click', pushState)
        }

        return () => {
            if (currentAnchor) {
                currentAnchor.removeEventListener('click', pushState)
            }
        }
    }, [])
    
    return (<a ref={anchorRef} href={href}>{children}</a>)
}