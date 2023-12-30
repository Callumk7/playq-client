import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { authenticator } from "@/features/auth";
import { Container } from "@/features/layout";
import { ActionFunctionArgs } from "@remix-run/node";

export const action = async ({ request }: ActionFunctionArgs) => {
  return await authenticator.authenticate("user-pass", request, {
    successRedirect: "/",
    failureRedirect: "/sign-in",
  });
};

export default function SignInPage() {
  return (
    <Container className="mt-10 flex flex-col items-center h-[80vh] justify-center">
      <form method="POST" className="flex flex-col gap-9 w-2/3">
        <div className="flex flex-col gap-2">
          <Label htmlFor="email">Email</Label>
          <Input name="email" type="text" id="email" placeholder="enter your email" />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="password">Password</Label>
          <Input name="password" type="password" id="password" placeholder="enter your password" />
        </div>
        <Button>Sign In</Button>
      </form>
    </Container>
  );
}
