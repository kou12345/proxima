import { useCallback, useState } from "react";

export const useBoolean = (initial: boolean) => {
  const [state, setState] = useState(initial);

  return {
    state,
    setToTrue: useCallback(() => setState(true), []),
    setToFalse: useCallback(() => setState(false), []),
    toggle: useCallback(() => setState((prev) => !prev), []),
  };
};
