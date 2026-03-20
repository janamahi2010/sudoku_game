import type { PropsWithChildren } from "react";

export const ScreenShell = ({ children }: PropsWithChildren) => {
  return (
    <div
      className="mx-auto flex min-h-screen w-full max-w-md flex-col px-4 sm:max-w-lg"
      style={{
        paddingTop: "max(env(safe-area-inset-top), 0.75rem)",
        paddingBottom: "max(env(safe-area-inset-bottom), 0.75rem)",
      }}
    >
      {children}
    </div>
  );
};
