"use client";

import { useHasMounted } from "@/utils/customHook";
import { AppProgressBar as ProgressBar } from "next-nprogress-bar";

const NProgressBar = ({ children }: { children: React.ReactNode }) => {
  const hasMounted = useHasMounted();

  if (!hasMounted) return <></>;

  return (
    <>
      {children}
      <ProgressBar
        height="4px"
        color="#fffd00"
        options={{ showSpinner: false }}
        shallowRouting
      />
    </>
  );
};

export default NProgressBar;
