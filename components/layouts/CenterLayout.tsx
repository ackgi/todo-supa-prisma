// src/components/layouts/CenterLayout.tsx
import React from "react";

interface CenterLayoutProps {
  children: React.ReactNode;
}

export function CenterLayout({ children }: CenterLayoutProps) {
  return (
    <div className="flex items-center justify-center min-h-screen">
      {children}
    </div>
  );
}
