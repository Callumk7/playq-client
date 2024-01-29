import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { createServerClient, getSession } from "@/features/auth/supabase/supabase.server";
import { Container } from "@/features/layout";
import { zodResolver } from "@hookform/resolvers/zod";
import { ActionFunctionArgs, LoaderFunctionArgs, json, redirect } from "@remix-run/node";
import { useLoaderData, useSubmit } from "@remix-run/react";
import { createBrowserClient } from "@supabase/ssr";
import { db } from "db";
import { users } from "db/schema/users";
import { useRef } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zx } from "zodix";

// Used with react-hook-form, and zodix
const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(5),
});

///
/// ACTION
///
export const action = async ({ request }: ActionFunctionArgs) => {
  const result = await zx.parseFormSafe(request, signupSchema);

  const { supabase, headers } = createServerClient(request);
  if (result.success) {
    const res = await supabase.auth.signUp({
      email: result.data.email,
      password: result.data.password,
    });

    if (res.error) {
      return json({ failure: res.error });
    }

    await db.insert(users).values({
      username: result.data.email,
      email: result.data.email,
      password: result.data.password,
      id: res.data.user!.id, // this is from supabase
    });

    return redirect("/sign-up-confirmation", { headers });
  } else return json({ failure: result.error });
};

export default function SignUpPage() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<z.infer<typeof signupSchema>>({ resolver: zodResolver(signupSchema) });

  const submit = useSubmit();

  const onSubmit = (values: z.infer<typeof signupSchema>) => {
    submit(
      {
        email: values.email,
        password: values.password,
      },
      { method: "POST" },
    );
  };

  console.log(watch("email"));

  return (
    <Container className="mt-10 flex h-[80vh] flex-col items-center justify-center">
      <form className="flex w-2/3 flex-col gap-9" onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            type="text"
            id="email"
            placeholder="enter your email"
            {...register("email")}
          />
          <p className="min-h-4 text-sm font-medium leading-none text-destructive">
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
          <p className="min-h-4 text-sm font-medium leading-none text-destructive">
            {errors.password?.message}
          </p>
        </div>
        <Button>Sign Up</Button>
      </form>
    </Container>
  );
}
