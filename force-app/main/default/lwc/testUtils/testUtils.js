export const clearDOM = () => {
  while (document.body.firstChild) {
    document.body.removeChild(document.body.firstChild);
  }
}

export const flushPromises = () => {
  return new Promise(resolve => setImmediate(resolve));
}