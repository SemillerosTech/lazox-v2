import Image from "next/image";

export function Logo({
  className = "h-10 w-auto",
  priority = false,
}: {
  className?: string;
  priority?: boolean;
}) {
  return (
    <Image
      src="/logo.svg"
      alt="LAZOX"
      width={800}
      height={248}
      className={className}
      priority={priority}
    />
  );
}
