// src/components/ui/AuthCard.tsx
// src/components/ui/AuthCard.tsx
import React from "react";

interface AuthCardProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
}

export function AuthCard({ title, description, children }: AuthCardProps) {
  return (
    <div className="max-w-md w-full p-6 rounded-xl shadow-lg bg-white">
      {title && <h1 className="text-xl font-semibold mb-2">{title}</h1>}
      {description && (
        <p className="text-sm text-gray-600 mb-4">{description}</p>
      )}
      {children}
    </div>
  );
}
