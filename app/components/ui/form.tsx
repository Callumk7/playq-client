import clsx from "clsx";
import { InputHTMLAttributes } from "react";

const Input = ({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) => {
  return (
    <input
      className={clsx(
        className,
        "w-full rounded-md border bg-inherit px-4 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
      )}
      {...props}
    />
  );
};

const TextArea = ({ className, ...props }: InputHTMLAttributes<HTMLTextAreaElement>) => {
  return (
    <textarea
      className={clsx(
        className,
        "w-full rounded-md border bg-inherit px-4 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
      )}
      {...props}
    />
  );
};

export { Input, TextArea };
