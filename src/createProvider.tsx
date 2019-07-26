import * as React from "react";
import { extractRefValue } from "./util";

import { InnerValueContextType } from "./InnerValueContext";

type MountedValue<T> = React.MutableRefObject<T>;

type Props<T> = {
    children: React.ReactNode;
    onChange: (value: T) => void;
    reducePropsToState: (values: T[]) => T;
};

const DEFAULT_REDUCE_PROPS_TO_STATE = <T extends {}>(values: T[]) => values[values.length - 1];

export function createProvider<T>({
    context,
}: {
    context: React.Context<InnerValueContextType<T> | null>;
}) {
    return function InnerValueProvider(props: Props<T>) {
        const { children, onChange, reducePropsToState = DEFAULT_REDUCE_PROPS_TO_STATE } = props;
        /**
         * Store the children components' valueRefs in order of first -> last rendered.
         * If there are siblings in the tree, then whichever is rendered most recently
         * is considered to have the innermost value. See a related issue on react-side-effect:
         * https://github.com/gaearon/react-side-effect/issues/19
         */
        const mountedValues = React.useRef<MountedValue<T>[]>([]);

        /**
         * Track the current innermost value in a useState to re-render the context
         * listeners when it gets updated.
         */
        const [innerValue, setInnerValue] = React.useState<T | void>(undefined);

        /**
         * Call the onChange prop if it's defined whenever the innerValue changes.
         * This makes it easier to apply side effects outside of the rendering tree.
         */
        React.useEffect(() => {
            if (onChange && innerValue) {
                onChange(innerValue);
            }
        }, [innerValue, onChange]);

        /**
         * Whenever a child hook re-renders, check if we need to update the
         * state with a new value.
         */
        const emitChange = React.useCallback(() => {
            const value = reducePropsToState(mountedValues.current.map(extractRefValue));

            if (value) {
                setInnerValue(value);
            }
        }, [reducePropsToState, setInnerValue]);

        const contextValue: InnerValueContextType<T> = React.useMemo(
            () => ({
                handleMount: (ref) => {
                    mountedValues.current.push(ref);
                    emitChange();
                },
                handleUpdate: () => {
                    emitChange();
                },
                handleUnmount: (ref) => {
                    const index = mountedValues.current.indexOf(ref);
                    mountedValues.current.splice(index, 1);
                    emitChange();
                }
            }),
            [emitChange]
        );

        return React.createElement(context.Provider, { value: contextValue }, children);
    };
}
