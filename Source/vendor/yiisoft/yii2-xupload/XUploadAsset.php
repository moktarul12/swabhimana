<?php
/**
 * @link http://www.yiiframework.com/
 * @copyright Copyright (c) 2008 Yii Software LLC
 * @license http://www.yiiframework.com/license/
 */

namespace yii\xupload;
use yii\web\AssetBundle;

/**
 * @author Qiang Xue <qiang.xue@gmail.com>
 * @since 2.0
 */
class XUploadAsset extends AssetBundle
{
	public $sourcePath = '@yii/xupload/assets';
		public $js = [
				'js/vendor/jquery.ui.widget.js',
				'js/jquery.iframe-transport.js',
				'js/jquery.fileupload.js',
				'js/jquery.fileupload-process.js',
				'js/jquery.fileupload-image.js',
				'js/jquery.fileupload-audio.js',
				'js/jquery.fileupload-video.js',
				'js/jquery.fileupload-validate.js',
				'js/jquery.fileupload-ui.js',
		//		'js/main.js',
			];
	public $css = [
				'css/style.css',
				'css/jquery.fileupload.css',
				'css/jquery.fileupload-ui.css',
//				'css/jquery.fileupload-noscript.css',
//				'css/jquery.fileupload-ui-noscript.css',
				
	];
	public $depends = [
		'yii\jui\CoreAsset',
	//	'yii\jui\MenuAsset',
	];
}
