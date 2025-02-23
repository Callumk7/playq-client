import { ReactNode } from "react";

export type AuthErrorType = "auth" | "validation" | "database";

export interface AuthError {
  type: AuthErrorType;
  message: string;
}

const errorStyles: Record<AuthErrorType, string> = {
  auth: "bg-red-950/50 border-red-400 text-red-400",
  validation: "bg-yellow-950/50 border-yellow-400 text-yellow-400",
  database: "bg-orange-950/50 border-orange-400 text-orange-400",
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
      className={`p-4 border-l-4 w-4/5 mx-auto absolute top-10 rounded-md mb-4 ${
        errorStyles[error.type]
      }`}
    >
      <p className="font-medium">{error.message}</p>
      {children}
    </div>
  );
}
