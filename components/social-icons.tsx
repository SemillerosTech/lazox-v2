import type { SVGProps } from "react";

import { facebookPath, instagramPath, whatsappPath, youtubePath } from "@/lib/icons/simple-icons";

type IconProps = SVGProps<SVGSVGElement>;

function BrandIcon({ path, ...props }: IconProps & { path: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="1em"
      height="1em"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <path d={path} />
    </svg>
  );
}

export function WhatsAppIcon(props: IconProps) {
  return <BrandIcon path={whatsappPath} {...props} />;
}

export function InstagramIcon(props: IconProps) {
  return <BrandIcon path={instagramPath} {...props} />;
}

export function FacebookIcon(props: IconProps) {
  return <BrandIcon path={facebookPath} {...props} />;
}

export function YoutubeIcon(props: IconProps) {
  return <BrandIcon path={youtubePath} {...props} />;
}
