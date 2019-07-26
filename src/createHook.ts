import * as React from "react";
import { useWillMount } from "./util";
import { InnerValueContextType } from "./InnerValueContext";

export function createHook<T>({
    useInnerValueContext,
}: {
    useInnerValueContext: () => InnerValueContextType<T>;
}) {
    return (value: T) => {
        /**
         * Use a ref so that we can track the instance of the value
         * by reference between renders.
         */
        const valueRef = React.useRef<T>(value);

        // Always keep the ref up to date
        valueRef.current = value;

        const { handleMount, handleUpdate, handleUnmount } = useInnerValueContext();

        /**
         * Initialize the value in the parent context when the hook will mount.
         */
        useWillMount(() => handleMount(valueRef));

        /**
         * Tell the parent context to re-check if anything has changed whenever the
         * value prop changes.
         */
        React.useEffect(() => {
            handleUpdate();
        }, [value, handleUpdate]);

        /**
         * Remove the value in the parent context when the hook will unmount.
         */
        React.useEffect(
            () => () => {
                handleUnmount(valueRef);
            },
            [handleUnmount]
        );
    };
}
