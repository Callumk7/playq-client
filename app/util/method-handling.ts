type AllowedMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

type MethodFunction<T = Record<string, string> | undefined> = {
	method: AllowedMethod;
	function: (request: Request, params: T) => Promise<Response>;
};

export const methodHandler = async <T = Record<string, string> | undefined>(
	request: Request,
	methods: MethodFunction<T>[],
	params?: T,
): Promise<Response> => {
	for (const method of methods) {
		if (request.method === method.method) {
			return method.function(request, params!);
		}
	}

	return new Response("Incorrect Method", { status: 405 });
};
