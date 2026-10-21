import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

import { buttonClasses, type ButtonVariant } from "@/lib/styles";

type ButtonLinkProps = ComponentProps<typeof Link> & {
  variant?: ButtonVariant;
  children: ReactNode;
};

export function ButtonLink({
  variant = "primary",
  className,
  children,
  ...props
}: ButtonLinkProps) {
  return (
    <Link
      className={buttonClasses(variant, typeof className === "string" ? className : "")}
      {...props}
    >
      {children}
    </Link>
  );
}
