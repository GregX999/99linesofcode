export const insertScript = (src, id, parentElement) => {
  const script = window.document.createElement("script");
  script.async = true;
  script.src = src;
  script.id = id;
  parentElement.appendChild(script);

  return script;
};

export const removeScript = (id, parentElement) => {
  const script = window.document.getElementById(id);
  if (script) parentElement.removeChild(script);
};

export const debounce = (func, wait, runOnFirstCall) => {
  let timeout;
  return () => {
    const context = this; // eslint-disable-line consistent-this
    const args = arguments;

    const deferredExecution = () => {
      timeout = null;
      if (!runOnFirstCall) func.apply(context, args);
    };

    const callNow = runOnFirstCall && !timeout;

    window.clearTimeout(timeout);
    timeout = setTimeout(deferredExecution, wait);

    if (callNow) func.apply(context, args);
  };
};
