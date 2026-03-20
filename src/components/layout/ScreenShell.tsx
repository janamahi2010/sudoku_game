import type { PropsWithChildren } from "react";

export const ScreenShell = ({ children }: PropsWithChildren) => {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md flex-col px-4 pb-safe pt-3 sm:max-w-lg">
      {children}
    </div>
  );
};
