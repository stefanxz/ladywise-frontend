const back = jest.fn();
const replace = jest.fn();
const push = jest.fn();
let canGoBack = true;

export const __setCanGoBack = (v: boolean) => (canGoBack = v);
export const __getMocks = () => ({ back, replace, push });

export const useRouter = () => ({
  back,
  replace,
  push,
  canGoBack: () => canGoBack,
});
