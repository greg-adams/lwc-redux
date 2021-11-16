export const clearDOM = () => {
    while (document.body.firstChild) {
        document.body.removeChild(document.body.firstChild);
    }
};

export async function flushPromises() {
    await Promise.resolve();
    await Promise.resolve();

    return Promise.resolve();
}
