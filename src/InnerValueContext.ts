import * as React from "react";

export type InnerValueContextType<T> = {
    handleMount: (ref: React.MutableRefObject<T>) => void;
    handleUpdate: () => void;
    handleUnmount: (ref: React.MutableRefObject<T>) => void;
    innerValue: T | void
};
