import { run } from "@banjoanton/spa-runner";
// @ts-ignore isolatedModules

const urls = ["https://github.com/*/settings"];

run(main, {
    urls,
    isDebug: true,
});

function main() {
    const renameButton = document.querySelector("li > details > summary")
        ?.parentElement?.parentElement?.parentElement?.lastElementChild;

    renameButton?.addEventListener("click", onClickHandler);
}

function onClickHandler() {
    const name = document.querySelector(
        "#options_bucket p > strong"
    )?.textContent;

    if (!name) return;

    const form = document.querySelector<HTMLFormElement>("[action*='/delete']");
    const input = form?.querySelector<HTMLInputElement>("input[name='verify']");
    const button = form?.querySelector<HTMLButtonElement>("button");

    if (!form || !input || !button) return;

    input.value = name;
    button.disabled = false;
}
