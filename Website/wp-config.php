<?php
/**
 * The base configuration for WordPress
 *
 * The wp-config.php creation script uses this file during the
 * installation. You don't have to use the web site, you can
 * copy this file to "wp-config.php" and fill in the values.
 *
 * This file contains the following configurations:
 *
 * * MySQL settings
 * * Secret keys
 * * Database table prefix
 * * ABSPATH
 *
 * @link https://codex.wordpress.org/Editing_wp-config.php
 *
 * @package WordPress
 */

// ** MySQL settings - You can get this info from your web host ** //
/** The name of the database for WordPress */
define('DB_NAME', 'wordpress');

/** MySQL database username */
define('DB_USER', 'wordpress');

/** MySQL database password */
define('DB_PASSWORD', 'WordPressUserPassword');

/** MySQL hostname */
define('DB_HOST', 'localhost');

/** Database Charset to use in creating database tables. */
define('DB_CHARSET', 'utf8mb4');

/** The Database Collate type. Don't change this if in doubt. */
define('DB_COLLATE', '');

/**#@+
 * Authentication Unique Keys and Salts.
 *
 * Change these to different unique phrases!
 * You can generate these using the {@link https://api.wordpress.org/secret-key/1.1/salt/ WordPress.org secret-key service}
 * You can change these at any point in time to invalidate all existing cookies. This will force all users to have to log in again.
 *
 * @since 2.6.0
 */
define('AUTH_KEY',         '(,+Ah[8Y0hOUufAm@5<>bV`_pb_an1 W$a*QN870I!VBG%{FoNH;?qUI>[9{d0UR');
define('SECURE_AUTH_KEY',  'Xk=Xh~PTTx**mayDh=87bQB z?{T:+VG,*&Prl<?IE.Q& .UvKC]GPTa?en WxQN');
define('LOGGED_IN_KEY',    'd12C,)2swoM$4bZs1y(=TOcAP-Q)ls8|YFfGSKTy3rPB}$.!mV!F.G+gsHRbWZ^0');
define('NONCE_KEY',        '2W%=gO&2AJ)Z.K.+~$kIHnMSLbZ+Xt9Gr DvEOL:2m*d%$$`U=H`kvi@g=6H??Dk');
define('AUTH_SALT',        'yG$}i`/WmBI_FErJ|X![1_;EwQaNXihb<f6g0whJU2/t^h^-I>#N|=ZFB_:3/!z#');
define('SECURE_AUTH_SALT', 'uu%+.~{A^C~]8@DZ>G4(fv8e1>i_@C;-j:fga[6jL$TR[*H-pnb y/B>k*!Zw;Y}');
define('LOGGED_IN_SALT',   'ep.yOTLDo001V$J`-AmFG47I9JuK?wU!l&8a*w&>N1gJAua}01L7Ur*]~l{GWi1Q');
define('NONCE_SALT',       's{o|M)+NAi_FbD>Q9.9|LiQ1K&UVVu/r`&:Qz*H|P-m}[#DJIKOSZA?mr^*V<mjm');

/**#@-*/

/**
 * WordPress Database Table prefix.
 *
 * You can have multiple installations in one database if you give each
 * a unique prefix. Only numbers, letters, and underscores please!
 */
$table_prefix  = 'wp_';

/**
 * For developers: WordPress debugging mode.
 *
 * Change this to true to enable the display of notices during development.
 * It is strongly recommended that plugin and theme developers use WP_DEBUG
 * in their development environments.
 *
 * For information on other constants that can be used for debugging,
 * visit the Codex.
 *
 * @link https://codex.wordpress.org/Debugging_in_WordPress
 */
define('WP_DEBUG', false);

/* That's all, stop editing! Happy blogging. */

/** Absolute path to the WordPress directory. */
if ( !defined('ABSPATH') )
	define('ABSPATH', dirname(__FILE__) . '/');

/** Sets up WordPress vars and included files. */
require_once(ABSPATH . 'wp-settings.php');

