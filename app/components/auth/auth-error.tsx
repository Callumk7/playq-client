import { ReactNode } from "react";

export type AuthErrorType = "auth" | "validation" | "database";

export interface AuthError {
  type: AuthErrorType;
  message: string;
}

const errorStyles: Record<AuthErrorType, string> = {
  auth: "bg-red-50 border-red-500 text-red-700",
  validation: "bg-yellow-50 border-yellow-500 text-yellow-700",
  database: "bg-orange-50 border-orange-500 text-orange-700",
};

export function AuthErrorMessage({
  error,
  children,
}: {
  error: AuthError;
  children?: ReactNode;
}) {
  return (
    <div
      className={`p-4 border-l-4 rounded-md mb-4 ${errorStyles[error.type]}`}
    >
      <p className="font-medium">{error.message}</p>
      {children}
    </div>
  );
}
