import React from "react";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center px-4 py-8">
      {children}
    </main>
  );
};

export default AuthLayout;
