import * as React from "react";
import { createHook } from "./createHook";
import { createProvider } from "./createProvider";
import { InnerValueContextType } from "./InnerValueContext";

export function createScopedInnerValueContext<T>() {
    const context = React.createContext<InnerValueContextType<T> | null>(null);
    const useInnerValueContext = () => {
        const val = React.useContext(context);
        if (!val) {
            throw new Error("useInnerValueContext must be a child of an InnerValueProvider");
        }
        return val;
    };
    return [createProvider({ context }), createHook({ useInnerValueContext })];
}
