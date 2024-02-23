import { Tooltip, TooltipContent, TooltipTrigger } from "../tooltip";
import { Button, ButtonProps } from "../button";

interface IconButtonWithTooltipProps extends ButtonProps {
	tooltip: string;
}

export function IconButtonWithTooltip({
	children,
	tooltip,
  variant = "outline",
  size = "icon",
  ...props
}: IconButtonWithTooltipProps) {
  return (
    <Tooltip>
      <TooltipTrigger>
        <Button {...props} variant={variant} size={size}>
          {children}
        </Button>
      </TooltipTrigger>
      <TooltipContent>{tooltip}</TooltipContent>
    </Tooltip>
  )
}
