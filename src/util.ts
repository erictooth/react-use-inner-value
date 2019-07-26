import * as React from "react";

export const extractRefValue = <T>(x: React.MutableRefObject<T>) => x.current;

export function useWillMount(cb: () => void) {
    const mounted = React.useRef(false);
    if (!mounted.current) {
        cb();
        mounted.current = true;
    }
}
