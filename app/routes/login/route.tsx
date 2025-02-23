import {
  LoaderFunctionArgs,
  redirect,
  ActionFunctionArgs,
} from "@remix-run/node";
import { useLoaderData, useNavigate, useFetcher } from "@remix-run/react";
import { createBrowserClient } from "@supabase/ssr";
import { useState, useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UpdateIcon } from "@radix-ui/react-icons";
import { Input, Button, Label, Container } from "@/components";
import { createServerClient, getSession } from "@/services";
import { AuthError, AuthErrorMessage } from "@/components/auth/auth-error";
import { zx } from "zodix";

///
/// LOADER
///
export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { supabase, headers } = createServerClient(request);
  const session = await getSession(supabase);

  const ENV = {
    SUPABASE_URL: process.env.SUPABASE_URL!,
    SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY!,
  };

  if (session) {
    return redirect("/", { headers });
  }

  return ENV;
};

// Used with react-hook-form
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(5),
});

type ActionData =
  | {
      error: AuthError;
    }
  | undefined;

export const action = async ({ request }: ActionFunctionArgs) => {
  const result = await zx.parseFormSafe(request, loginSchema);
  const { supabase, headers } = createServerClient(request);

  if (!result.success) {
    return {
      error: {
        type: "validation",
        message: "Please check your input and try again",
      },
    };
  }

  try {
    const { error } = await supabase.auth.signInWithPassword({
      email: result.data.email,
      password: result.data.password,
    });

    if (error) {
      // Handle specific auth error cases
      const errorMessage =
        error.message === "Invalid login credentials"
          ? "Incorrect email or password. Please try again."
          : error.message;

      return {
        error: {
          type: "auth",
          message: errorMessage,
        },
      };
    }

    return redirect("/", { headers });
  } catch (error) {
    return {
      error: {
        type: "auth",
        message: "An unexpected error occurred. Please try again.",
      },
    };
  }
};

///
/// UI ROUTE
///
export default function LoginPage() {
  const ENV = useLoaderData<typeof loader>();
  const supabase = createBrowserClient(ENV.SUPABASE_URL, ENV.SUPABASE_ANON_KEY);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
  });

  const navigate = useNavigate();
  const fetcher = useFetcher<ActionData>();
  const isSubmitting = fetcher.state !== "idle";
  const serverError = fetcher.data?.error;

  // Reset form error when user starts typing after an error
  useEffect(() => {
    if (serverError && fetcher.state === "submitting") {
      fetcher.data = undefined;
    }
  }, [fetcher.state, serverError, fetcher]);

  const onSubmit = (values: z.infer<typeof loginSchema>) => {
    fetcher.submit(values, { method: "POST" });
  };

  // OAuth login handlers
  const handleOAuthLogin = async (provider: "github" | "google") => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${location.origin}/callback`,
      },
    });

    if (error) {
      fetcher.data = {
        error: {
          type: "auth",
          message: `Failed to login with ${provider}. Please try again.`,
        },
      };
    }
  };

  return (
    <Container className="flex flex-col justify-center items-center mt-10 h-[80vh]">
      {serverError && <AuthErrorMessage error={serverError} />}

      <form
        className="flex flex-col gap-4 mx-auto w-11/12 md:w-2/3 border rounded-md p-4"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="flex flex-col gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            type="text"
            id="email"
            placeholder="enter your email"
            {...register("email")}
          />
          <p className="text-sm font-medium leading-none min-h-4 text-destructive">
            {errors.email?.message}
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="password">Password</Label>
          <Input
            type="password"
            id="password"
            placeholder="enter your password"
            {...register("password")}
          />
          <p className="text-sm font-medium leading-none min-h-4 text-destructive">
            {errors.password?.message}
          </p>
        </div>
        <Button disabled={isSubmitting}>
          {isSubmitting ? (
            <div className="flex items-center gap-2">
              <UpdateIcon className="animate-spin" />
              <span>Signing In...</span>
            </div>
          ) : (
            "Sign In"
          )}
        </Button>
      </form>

      <div className="flex flex-col gap-4 justify-between mx-auto mt-9 w-11/12 md:w-2/3">
        <Button
          variant={"secondary"}
          className="w-full"
          onClick={() => handleOAuthLogin("github")}
          disabled={isSubmitting}
        >
          Sign In With Github
        </Button>
        <Button
          variant={"secondary"}
          className="w-full"
          onClick={() => handleOAuthLogin("google")}
          disabled={isSubmitting}
        >
          Sign In With Google
        </Button>
        <Button
          variant={"outline"}
          className="w-full"
          onClick={() => navigate("/sign-up")}
        >
          Need an account? Sign Up!
        </Button>
      </div>
    </Container>
  );
}
