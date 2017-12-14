// util.js

const $on = (target, event, handler) => {
  return target.addEventListener(event, handler);
};

export { $on };