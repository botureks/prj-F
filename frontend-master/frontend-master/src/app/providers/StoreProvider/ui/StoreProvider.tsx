import { ReactNode, useRef } from "react";
import { Provider } from "react-redux";

import { createReduxStore } from "../config/store";
import { StateSchema } from "../config/StateSchema";

interface StoreProviderProps {
  children?: ReactNode;
  initialState?: Partial<StateSchema>;
}

export const StoreProvider = (props: StoreProviderProps) => {
  const { children, initialState } = props;

  const storeRef = useRef<ReturnType<typeof createReduxStore>>();
  if (!storeRef.current) {
    storeRef.current = createReduxStore(initialState as StateSchema);
  }

  return <Provider store={storeRef.current}>{children}</Provider>;
};
