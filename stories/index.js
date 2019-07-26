import * as React from "react";
import { storiesOf } from "@storybook/react";
import { createScopedInnerValueContext } from "../src/index.ts";

const stories = storiesOf("default", /*eslint-disable-line no-undef*/ module);

const [PageTitleProvider, usePageTitle] = createScopedInnerValueContext();

function PageSample() {
    const [currentPage, setCurrentPage] = React.useState(1);
    usePageTitle(`Page ${currentPage}`);
    return (
        <div>
            <button onClick={() => setCurrentPage(1)}>Page 1</button>
            <button onClick={() => setCurrentPage(2)}>Page 2</button>
            <button onClick={() => setCurrentPage(3)}>Page 3</button>
            <p>Page {currentPage}</p>
        </div>
    );
}

stories.add("basic", () => {
    return (
        <PageTitleProvider onChange={val => console.log(val)}>
            <PageSample />
        </PageTitleProvider>
    );
});
