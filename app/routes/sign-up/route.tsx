import { zodResolver } from "@hookform/resolvers/zod";
import { UpdateIcon } from "@radix-ui/react-icons";
import { ActionFunctionArgs, redirect } from "@remix-run/node";
import { useFetcher } from "@remix-run/react";
import { db } from "db";
import { users } from "db/schema/users";
import { FieldValues, UseFormRegister, useForm } from "react-hook-form";
import { z } from "zod";
import { zx } from "zodix";
import { Input, Button, Label, Container } from "@/components";
import { createServerClient } from "@/services";
import { useEffect } from "react";
import type { AuthError } from "@/components/auth/auth-error";

// Add specific error types
type SignUpError = {
  type: "auth" | "validation" | "database";
  message: string;
};

// Used with react-hook-form, and zodix
const signupSchema = z.object({
  username: z.string().min(4),
  email: z.string().email(),
  password: z.string().min(5),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
});

// Define the shape of the action response
type ActionData =
  | {
      error: AuthError;
    }
  | undefined;

///
/// ACTION
///
export const action = async ({ request }: ActionFunctionArgs) => {
  const result = await zx.parseFormSafe(request, signupSchema);
  const { supabase, headers } = createServerClient(request);

  if (!result.success) {
    return {
      error: {
        type: "validation",
        message: "Please check your input and try again",
      } as SignUpError,
    };
  }

  try {
    const res = await supabase.auth.signUp({
      email: result.data.email,
      password: result.data.password,
    });

    if (res.error) {
      // Handle specific Supabase error cases
      const errorMessage =
        res.error.message === "User already registered"
          ? "This email is already registered. Please try logging in instead."
          : res.error.message;

      return {
        error: {
          type: "auth",
          message: errorMessage,
        } as SignUpError,
      };
    }

    if (!res.data.user) {
      throw new Error("No user data returned from Supabase");
    }

    // Create user in our database
    try {
      await db.insert(users).values({
        username: result.data.username,
        email: result.data.email,
        password: result.data.password,
        firstName: result.data.firstName,
        lastName: result.data.lastName,
        id: res.data.user.id,
      });
    } catch (error) {
      // Handle database errors (e.g., duplicate username)
      return {
        error: {
          type: "database",
          message: "Username already taken. Please choose another.",
        } as SignUpError,
      };
    }

    return redirect("/explore", { headers });
  } catch (error) {
    return {
      error: {
        type: "auth",
        message: "An unexpected error occurred. Please try again.",
      } as SignUpError,
    };
  }
};

// Add error message component
function ErrorMessage({ error }: { error: SignUpError }) {
  const errorStyles = {
    auth: "bg-red-50 border-red-500 text-red-700",
    validation: "bg-yellow-50 border-yellow-500 text-yellow-700",
    database: "bg-orange-50 border-orange-500 text-orange-700",
  };

  return (
    <div
      className={`p-4 border-l-4 rounded-md mb-4 ${errorStyles[error.type]}`}
    >
      <p className="font-medium">{error.message}</p>
    </div>
  );
}

export default function SignUpPage() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
  });

  // Type the fetcher
  const fetcher = useFetcher<ActionData>();
  const isSubmitting = fetcher.state !== "idle";
  const serverError = fetcher.data?.error;

  // Reset form error when user starts typing after an error
  useEffect(() => {
    if (serverError && fetcher.state === "submitting") {
      // Create a new data object instead of mutating
      fetcher.data = undefined;
    }
  }, [fetcher.state, serverError, fetcher]);

  const onSubmit = (values: z.infer<typeof signupSchema>) => {
    fetcher.submit(values, { method: "POST" });
  };

  console.log(watch("email"));

  return (
    <Container className="flex flex-col justify-center items-center mt-10 h-[80vh]">
      {serverError && <ErrorMessage error={serverError} />}

      <form
        className="flex flex-col gap-2 w-2/3 border rounded-md p-4"
        onSubmit={handleSubmit(onSubmit)}
      >
        <FormInputField
          name="email"
          label="Email"
          placeholder="What email do you want to use?"
          register={register}
          error={errors.email?.message}
        />
        <FormInputField
          name="password"
          type="password"
          label="Password"
          placeholder="Choose a password, make it a good one"
          register={register}
          error={errors.password?.message}
        />
        <FormInputField
          name="username"
          label="Username"
          placeholder="Pick something awesome"
          register={register}
          error={errors.username?.message}
        />
        <FormInputField
          name="firstName"
          label="First Name"
          placeholder="This is not required"
          register={register}
          error={errors.firstName?.message}
        />
        <FormInputField
          name="lastName"
          label="Last Name"
          placeholder="This is not required"
          register={register}
          error={errors.lastName?.message}
        />
        <Button disabled={isSubmitting}>
          {isSubmitting ? (
            <div className="flex items-center gap-2">
              <UpdateIcon className="animate-spin" />
              <span>Creating Account...</span>
            </div>
          ) : (
            "Sign Up"
          )}
        </Button>
      </form>
    </Container>
  );
}

interface FormInputFieldProps<T extends FieldValues> {
  name: keyof T;
  type?: string;
  label: string;
  placeholder?: string;
  register: UseFormRegister<T>;
  error?: string;
}

function FormInputField({
  label,
  type = "text",
  placeholder,
  name,
  register,
  error,
}: FormInputFieldProps<z.infer<typeof signupSchema>>) {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={name as string}>{label}</Label>
      <Input
        type={type}
        id={name as string}
        placeholder={placeholder}
        {...register(name)}
      />
      <p className="text-sm font-medium leading-none min-h-4 text-destructive">
        {error && error}
      </p>
    </div>
  );
}
