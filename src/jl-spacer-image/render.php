<?php

/**
 * Renders the `create-block/jl-spacer-image` block on the server.
 */
$height = isset($attributes['height']) ? $attributes['height'] : '100px';
$width = isset($attributes['width']) ? $attributes['width'] : '';
$background_image_url = isset($attributes['backgroundImageURL']) ? $attributes['backgroundImageURL'] : '';
$background_size = isset($attributes['backgroundSize']) ? $attributes['backgroundSize'] : 'cover';
$background_repeating = isset($attributes['backgroundRepeating']) ? $attributes['backgroundRepeating'] : false;
$focal_point = isset($attributes['focalPoint']) ? $attributes['focalPoint'] : array('x' => 0.5, 'y' => 0.5);

$styles = array();

if ($height) {
	$styles[] = sprintf('height: %s;', esc_attr($height));
}

if ($width) {
	$styles[] = sprintf('width: %s;', esc_attr($width));
}

if ($background_image_url) {
	$styles[] = sprintf('background-image: url(%s);', esc_url($background_image_url));
}

if ($background_size) {
	$styles[] = sprintf('background-size: %s;', esc_attr($background_size));
}

$styles[] = sprintf('background-repeat: %s;', $background_repeating ? 'repeat' : 'no-repeat');

if ($focal_point) {
	$styles[] = sprintf('background-position: %s %s;', esc_attr($focal_point['x'] * 100 . '%'), esc_attr($focal_point['y'] * 100 . '%'));
}

$style = implode(' ', $styles);

echo sprintf(
	'<div %s></div>',
	get_block_wrapper_attributes(array('style' => $style))
);
