import * as React from "react";
import { createHook } from "./createHook";
import { createProvider } from "./createProvider";
import { InnerValueContextType } from "./InnerValueContext";

const createContextHook = <T>(context: React.Context<T>) => () => {
    const val = React.useContext<T>(context);
    if (!val) {
        throw new Error("useInnerValueContext must be a child of an InnerValueProvider");
    }
    return val as NonNullable<T>;
};

export function createScopedInnerValueContext<T>() {
    const context = React.createContext<InnerValueContextType<T> | null>(null);
    const valContext = React.createContext<T | void>(undefined);

    return [
        createProvider({ context, valContext }),
        createHook({ useInnerValueContext: createContextHook<InnerValueContextType<T> | null>(context) }),
        () => React.useContext(valContext),
    ];
}
