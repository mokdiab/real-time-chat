import Image from "next/image";
import logoImage from "@/public/logo.svg";
type Props = {
  size?: number;
};

function LoadingLogo({ size = 150 }: Props) {
  return (
    <div className="flex items-center justify-center h-full w-full">
      <Image
        src={logoImage}
        alt="loadingLogo"
        width={size}
        height={size}
        className="animate-pulse duration-600"
      />
    </div>
  );
}

export default LoadingLogo;
