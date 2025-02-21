<?php

/**
 * Plugin Name:       Spacer Image
 * Description:       A spacer block with a background image.
 * Version:           0.1.0
 * Requires at least: 6.7
 * Requires PHP:      7.4
 * Author:            Jacob Lodes
 * Author URI:        https://jlodes.com/
 * Plugin URI:        https://github.com/Silver0034/jl-spacer-image
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       jl-spacer-image
 *
 * @package CreateBlock
 */

if (! defined('ABSPATH')) {
	exit; // Exit if accessed directly.
}

/**
 * Registers the block using the metadata loaded from the `block.json` file.
 * Behind the scenes, it registers also all assets so they can be enqueued
 * through the block editor in the corresponding context.
 *
 * @see https://developer.wordpress.org/reference/functions/register_block_type/
 */
function create_block_jl_spacer_image_block_init()
{
	register_block_type(__DIR__ . '/build/jl-spacer-image');
}
add_action('init', 'create_block_jl_spacer_image_block_init');
