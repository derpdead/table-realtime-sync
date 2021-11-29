<?php
/**
 * Plugin Name: Exclusive Widget
 * Plugin URI: https://www.exclusive.tradesmarty.com/
 * Description: Exclusive widget depth plugin for WordPress
 * Version: 0.1
 * Text Domain: exclusive-widget
 * Author: Igor Veličković
 * Author URI: https://www.linkedin.com/in/igor-velickovic/
 */

// First register resources with init 
function exclusive_widget_init() {
    $path = "/frontend/build/static";
    if(getenv('WP_ENV')=="development") {
        $path = "/frontend/build/static";
    }
    wp_register_script("exclusive_widget_js", plugins_url($path."/js/main.js", __FILE__), array(), "1.0", false);
    wp_register_style("exclusive_widget_css", plugins_url($path."/css/main.css", __FILE__), array(), "1.0", "all");
}

add_action( 'init', 'exclusive_widget_init' );

// Function for the short code that call React app
function exclusive_widget() {
    wp_enqueue_script("exclusive_widget_js", '1.0', true);
    wp_enqueue_style("exclusive_widget_css");
    return "<div id=\"exclusive_widget\"></div>";
}

add_shortcode('exclusive_widget', 'exclusive_widget');