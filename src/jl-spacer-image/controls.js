/**
 * WordPress dependencies
 * from https://github.com/WordPress/gutenberg/blob/trunk/packages/block-library/src/spacer/controls.js
 */
import { __ } from "@wordpress/i18n";
import {
	InspectorControls,
	useSettings,
	__experimentalSpacingSizesControl as SpacingSizesControl,
	isValueSpacingPreset,
	privateApis as blockEditorPrivateApis,
} from "@wordpress/block-editor";
import {
	__experimentalParseQuantityAndUnitFromRawValue as parseQuantityAndUnitFromRawValue,
	__experimentalToolsPanel as ToolsPanel,
	__experimentalToolsPanelItem as ToolsPanelItem,
	__experimentalUnitControl as UnitControl,
	__experimentalUseCustomUnits as useCustomUnits,
	FocalPointPicker,
	SelectControl,
	ToggleControl,
} from "@wordpress/components";
import { useInstanceId } from "@wordpress/compose";
import { View } from "@wordpress/primitives";
import { MediaUpload, MediaUploadCheck } from "@wordpress/block-editor";
import { Button } from "@wordpress/components";
import { useSelect } from "@wordpress/data";
import { store as coreStore } from "@wordpress/core-data";

/**
 * Internal dependencies
 */
import { MIN_SPACER_SIZE } from "./constants";
import { useToolsPanelDropdownMenuProps } from "../utils/hooks";

function DimensionInput({ label, onChange, isResizing, value = "" }) {
	const inputId = useInstanceId(UnitControl, "block-spacer-height-input");
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
		</>
	);
}

export default function SpacerControls({
	backgroundImageURL,
	backgroundRepeating,
	backgroundSize,
	height,
	orientation,
	setAttributes,
	width,
	focalPoint,
	isResizing,
}) {
	const dropdownMenuProps = useToolsPanelDropdownMenuProps();

	const imperativeFocalPointPreview = (value) => {
		const { x, y } = value;
		setAttributes({
			focalPoint: {
				x,
				y,
			},
		});
	};

	return (
		<InspectorControls>
			<ToolsPanel
				label={__("Settings")}
				resetAll={() => {
					setAttributes({
						width: undefined,
						height: "100px",
						backgroundImageURL: undefined,
						backgroundSize: undefined,
						backgroundRepeating: false,
					});
				}}
				dropdownMenuProps={dropdownMenuProps}
			>
				{orientation === "horizontal" && (
					<ToolsPanelItem
						label={__("Width")}
						isShownByDefault
						hasValue={() => width !== undefined}
						onDeselect={() => setAttributes({ width: undefined })}
					>
						<DimensionInput
							label={__("Width")}
							value={width}
							onChange={(nextWidth) => setAttributes({ width: nextWidth })}
							isResizing={isResizing}
						/>
					</ToolsPanelItem>
				)}
				{orientation !== "horizontal" && (
					<ToolsPanelItem
						label={__("Height")}
						isShownByDefault
						hasValue={() => height !== "100px"}
						onDeselect={() => setAttributes({ height: "100px" })}
					>
						<DimensionInput
							label={__("Height")}
							value={height}
							onChange={(nextHeight) => setAttributes({ height: nextHeight })}
							isResizing={isResizing}
						/>
					</ToolsPanelItem>
				)}
				<ToolsPanelItem
					label={__("Background Image")}
					isShownByDefault
					hasValue={() => backgroundImageURL !== undefined}
					onDeselect={() => setAttributes({ backgroundImageURL: undefined })}
				>
					<p>Background Image</p>
					<MediaUploadCheck>
						<MediaUpload
							onSelect={(media) =>
								setAttributes({ backgroundImageURL: media.url })
							}
							allowedTypes={["image"]}
							value={backgroundImageURL}
							render={({ open }) => (
								<>
									<Button onClick={open} isSecondary>
										{backgroundImageURL
											? __("Replace Image")
											: __("Select Image")}
									</Button>
									{backgroundImageURL && (
										<img
											src={backgroundImageURL}
											alt={__("Selected background image", "jl-spacer-image")}
											style={{ marginTop: "10px", maxWidth: "100%" }}
										/>
									)}
								</>
							)}
						/>
					</MediaUploadCheck>
				</ToolsPanelItem>
				<ToolsPanelItem
					label={__("Focal point")}
					isShownByDefault
					hasValue={() => !!focalPoint}
					onDeselect={() =>
						setAttributes({
							focalPoint: undefined,
						})
					}
				>
					<FocalPointPicker
						__nextHasNoMarginBottom
						label={__("Focal point")}
						url={backgroundImageURL}
						value={focalPoint}
						onDragStart={imperativeFocalPointPreview}
						onDrag={imperativeFocalPointPreview}
						onChange={(newFocalPoint) =>
							setAttributes({
								focalPoint: newFocalPoint,
							})
						}
					/>
				</ToolsPanelItem>
				<ToolsPanelItem
					label={__("Background Size")}
					isShownByDefault
					hasValue={() => backgroundSize !== undefined}
					onDeselect={() => setAttributes({ backgroundSize: undefined })}
				>
					<SelectControl
						label={__("Background Size")}
						value={backgroundSize}
						options={[
							{ label: __("Cover"), value: "cover" },
							{ label: __("Contain"), value: "contain" },
						]}
						onChange={(nextBackgroundSize) =>
							setAttributes({ backgroundSize: nextBackgroundSize })
						}
						__nextHasNoMarginBottom
					/>
				</ToolsPanelItem>
				<ToolsPanelItem
					label={__("Repeating Background")}
					isShownByDefault
					hasValue={() => backgroundRepeating !== false}
					onDeselect={() => setAttributes({ backgroundRepeating: false })}
				>
					<ToggleControl
						label={__("Repeating Background")}
						checked={backgroundRepeating}
						onChange={(nextRepeating) =>
							setAttributes({ backgroundRepeating: nextRepeating })
						}
						__nextHasNoMarginBottom
					/>
				</ToolsPanelItem>
			</ToolsPanel>
		</InspectorControls>
	);
}
