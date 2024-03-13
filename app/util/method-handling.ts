import { json } from "@remix-run/node";

type AllowedMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

type MethodFunction = {
	method: AllowedMethod;
	function: (request: Request, ...args: any[]) => Promise<Response>;
};

export const methodHandler = async (
	request: Request,
	methods: MethodFunction[],
	...args: any[]
): Promise<Response> => {
	for (const method of methods) {
		if (request.method === method.method) {
			return method.function(request, ...args);
		}
	}

	return json("Incorrect Method", { status: 405 });
};
