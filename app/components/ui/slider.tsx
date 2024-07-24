import { cn } from "callum-util";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { forwardRef } from "react";

const Slider = forwardRef<
	React.ElementRef<typeof SliderPrimitive.Root>,
	React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => (
	<SliderPrimitive.Root
		ref={ref}
		className={cn("relative flex w-full touch-none select-none items-center", className)}
		{...props}
	>
		<SliderPrimitive.Track className="overflow-hidden relative w-full h-1.5 rounded-full grow bg-primary/10">
			<SliderPrimitive.Range className="absolute h-full bg-primary" />
		</SliderPrimitive.Track>
		<SliderPrimitive.Thumb className="block w-4 h-4 rounded-full border shadow transition-colors focus-visible:ring-1 focus-visible:outline-none disabled:opacity-50 disabled:pointer-events-none border-primary/50 bg-background focus-visible:ring-ring" />
	</SliderPrimitive.Root>
));
Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider };
