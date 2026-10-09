import React from "react";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="flex flex-col items-center justify-center h-screen">
      {children}
    </main>
  );
};

export default AuthLayout;
