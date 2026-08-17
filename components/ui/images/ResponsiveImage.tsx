// src/components/ui/images/ResponsiveImage.tsx
import Image from "next/image";

export default function ResponsiveImage({ photoUrl, altText, className, width, height }: { 
	photoUrl: string; 
	altText: string; 
	className?: string 
	width?: number;
	height?: number;
}) {
	return (
		<div className="relative">
			<div className="overflow-hidden">
				<Image
					src={photoUrl}
					alt={altText}
					className={className}
					width={width ?? 1054}
					height={height ?? 600}
				/>
			</div>
		</div>
	);
}