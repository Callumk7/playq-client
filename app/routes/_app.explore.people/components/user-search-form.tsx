import { Button, Input, Label } from "@/components";
import { Form } from "@remix-run/react";

export function UserSearchForm() {
	return (
		<Form className="flex gap-2 items-end w-full justify-stretch">
      <div className="flex-grow space-y-1">
        <Label htmlFor="search">User Search</Label>
        <Input id="search" name="query" />
      </div>
			<Button variant={"secondary"} type="submit">Search</Button>
		</Form>
	);
}
