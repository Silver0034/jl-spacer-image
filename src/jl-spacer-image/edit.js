/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-i18n/
 */
import { __ } from "@wordpress/i18n";

/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
 */
import {
	InspectorControls,
	useBlockProps,
	useSettings,
	SpacingSizesControl,
	isValueSpacingPreset,
	useSpacingSizes,
} from "@wordpress/block-editor";

/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * Those files can contain any CSS code that gets applied to the editor.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */
import "./editor.scss";

/**
 * Import Core components to add to the control functionality
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-components/
 */
import {
	PanelBody,
	TextControl,
	ToggleControl,
	useCustomUnits,
	UnitControl,
	parseQuantityAndUnitFromRawValue,
	ToolsPanel,
	__experimentalToolsPanelItem as ToolsPanelItem,
} from "@wordpress/components";

import { View } from "@wordpress/primitives";
import { useSelect } from "@wordpress/data";
import { store as coreStore } from "@wordpress/core-data";
import { useEffect } from "@wordpress/element";
import { useInstanceId } from "@wordpress/compose";
import SpacerControls from "./controls";

/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#edit
 *
 * @return {Element} Element to render.
 */

function DimensionInput({ label, onChange, isResizing, value = "" }) {
	const inputId = useInstanceId(UnitControl, "block-spacer-height-input");
	const spacingSizes = useSpacingSizes();
	const [spacingUnits] = useSettings("spacing.units");
	// In most contexts the spacer size cannot meaningfully be set to a
	// percentage, since this is relative to the parent container. This
	// unit is disabled from the UI.
	const availableUnits = spacingUnits
		? spacingUnits.filter((unit) => unit !== "%")
		: ["px", "em", "rem", "vw", "vh"];

	const units = useCustomUnits({
		availableUnits,
		defaultValues: { px: 100, em: 10, rem: 10, vw: 10, vh: 25 },
	});

	// Force the unit to update to `px` when the Spacer is being resized.
	const [parsedQuantity, parsedUnit] = parseQuantityAndUnitFromRawValue(value);
	const computedValue = isValueSpacingPreset(value)
		? value
		: [parsedQuantity, isResizing ? "px" : parsedUnit].join("");

	return (
		<>
			{spacingSizes?.length < 2 ? (
				<UnitControl
					id={inputId}
					isResetValueOnUnitChange
					min={MIN_SPACER_SIZE}
					onChange={onChange}
					value={computedValue}
					units={units}
					label={label}
					__next40pxDefaultSize
				/>
			) : (
				<View className="tools-panel-item-spacing">
					<SpacingSizesControl
						values={{ all: computedValue }}
						onChange={({ all }) => {
							onChange(all);
						}}
						label={label}
						sides={["all"]}
						units={units}
						allowReset={false}
						splitOnAxis={false}
						showSideInLabel={false}
					/>
				</View>
			)}
		</>
	);
}

export default function Edit({ attributes, setAttributes }) {
	const {
		backgroundImageID,
		backgroundRepeating,
		backgroundSize,
		focalPoint,
		height,
		inheritedOrientation,
		isResizing,
		temporaryHeight,
		temporaryWidth,
		width,
	} = attributes;

	const image = useSelect(
		(select) =>
			backgroundImageID && select(coreStore).getMedia(backgroundImageID),
		[backgroundImageID],
	);

	useEffect(() => {
		if (image) {
			setAttributes({ backgroundImageURL: image.source_url });
		}
	}, [image]);

	const blockProps = useBlockProps({
		style: {
			height: temporaryHeight || height,
			backgroundImage: attributes.backgroundImageURL
				? `url(${attributes.backgroundImageURL})`
				: undefined,
			backgroundSize: backgroundSize,
			backgroundRepeat: backgroundRepeating ? "repeat" : "no-repeat",
			backgroundPosition: focalPoint
				? `${focalPoint.x * 100}% ${focalPoint.y * 100}%`
				: undefined,
		},
	});

	return (
		<>
			<SpacerControls
				setAttributes={setAttributes}
				backgroundImageURL={attributes.backgroundImageURL}
				backgroundRepeating={backgroundRepeating}
				backgroundSize={backgroundSize}
				focalPoint={focalPoint}
				height={temporaryHeight || height}
				isResizing={isResizing}
				orientation={inheritedOrientation}
				width={temporaryWidth || width}
			/>
			<div {...blockProps}></div>
		</>
	);
}
