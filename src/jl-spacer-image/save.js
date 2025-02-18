import { useBlockProps } from "@wordpress/block-editor";

export default function save({ attributes }) {
	const {
		height,
		width,
		backgroundImageURL,
		backgroundSize,
		backgroundRepeating,
		focalPoint,
	} = attributes;

	const blockProps = useBlockProps.save({
		style: {
			height,
			width,
			backgroundImage: backgroundImageURL
				? `url(${backgroundImageURL})`
				: undefined,
			backgroundSize: backgroundSize,
			backgroundRepeat: backgroundRepeating ? "repeat" : "no-repeat",
			backgroundPosition: focalPoint
				? `${focalPoint.x * 100}% ${focalPoint.y * 100}%`
				: undefined,
		},
	});

	return <div {...blockProps}></div>;
}
