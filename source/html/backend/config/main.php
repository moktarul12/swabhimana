<?php
use \yii\web\Request;

$baseUrl = str_replace('/backend/web', '', (new Request)->getBaseUrl()) . '/admin';

$params = array_merge(
    require(__DIR__ . '/../../common/config/params.php'),
    require(__DIR__ . '/../../common/config/params-local.php'),
    require(__DIR__ . '/params.php'),
    require(__DIR__ . '/params-local.php')
);

return [
    'id' => 'app-backend',
    'basePath' => dirname(__DIR__),
    'controllerNamespace' => 'backend\controllers',
    'bootstrap' => [
        'log',
        [
            'class' => 'backend\components\LanguageSelector',
        ],
    ],
    'modules' => [
        'admin' => [
            'class' => 'backend\modules\admin\admin',
        ],
    ],
    'on beforeRequest' => function ($event) {
        \Yii::$app->language = Yii::$app->session->get('language');
    },
    'defaultRoute' => 'admins',
    'aliases' => [
        '@bower' => '@vendor/bower-asset', // Fix for bower asset path
        '@npm' => '@vendor/npm-asset',     // Fix for npm asset path
    ],
    'components' => [
        'request' => [
            'baseUrl' => $baseUrl,
        ],
        'i18n' => [
            'translations' => [
                'app*' => [
                    'class' => 'yii\i18n\PhpMessageSource',
                    'fileMap' => [
                        'app' => 'app.php',
                        'app/error' => 'error.php',
                    ],
                ],
            ],
        ],
        'assetManager' => [
            'bundles' => [
                'yii\web\JqueryAsset' => [
                    'sourcePath' => '@vendor/npm-asset/jquery/dist',
                    'js' => ['jquery.min.js'],
                ],
                'yii\bootstrap\BootstrapAsset' => [
                    'sourcePath' => '@vendor/bower-asset/bootstrap/dist',
                    'css' => ['css/bootstrap.min.css'],
                ],
                'yii\bootstrap\BootstrapPluginAsset' => [
                    'sourcePath' => '@vendor/bower-asset/bootstrap/dist',
                    'js' => ['js/bootstrap.bundle.min.js'],
                    'depends' => ['yii\web\JqueryAsset'],
                ],
                'yii\widgets\PjaxAsset' => [ // Optional override for PJAX
                    'sourcePath' => '@vendor/bower-asset/yii2-pjax',
                    'js' => ['jquery.pjax.js'],
                ],
            ],
        ],
        'user' => [
            'identityClass' => 'common\models\User',
            'enableAutoLogin' => true,
            'identityCookie' => [
                'name' => '_backendUser',
                'path' => '/backend/web',
            ],
        ],
        'session' => [
            'name' => 'PHPBACKSESSID',
            'savePath' => sys_get_temp_dir(),
        ],
        'log' => [
            'traceLevel' => YII_DEBUG ? 3 : 0,
            'targets' => [
                [
                    'class' => 'yii\log\FileTarget',
                    'levels' => ['error', 'warning'],
                ],
            ],
        ],
        'errorHandler' => [
            'errorAction' => 'admins/dashboard',
        ],
        'urlManager' => [
            'baseUrl' => $baseUrl,
            'class' => 'yii\web\UrlManager',
            'enablePrettyUrl' => true,
            'showScriptName' => false,
            'rules' => [
                '/' => 'admins/index',
                '<controller:\w+>/<id:\d+>' => '<controller>/view',
                '<controller:\w+>/<action:\w+>/<id:\d+>' => '<controller>/<action>',
                '<controller:\w+>/<action:\w+>' => '<controller>/<action>',
                '<module:\w+>/<controller:\w+>/<action:\w+>' => '<module>/<controller>/<action>',
                '<module:\w+><controller:\w+>/<action:update|delete>/<id:\d+>' => '<module>/<controller>/<action>',
                
                // Admin routes
                'login' => 'admins/login',
                'profile' => 'admins/profile',
                'loginvalidate' => 'admins/loginvalidate',
                'Autoupdatecurrency' => 'admins/autoupdatecurrency',
                'updatecurrencyprice' => 'admins/updatecurrencyprice',
                'getcurrencyvalue' => 'admins/getcurrencyvalue',
                'dashboard' => 'admins/dashboard',
                'logout' => 'admins/logout',
                'usermanagement' => 'admins/usermanagement',
                'userrolemanagement' => 'admins/userrolemanagement',
                'rolesmanagement' => 'admins/rolesmanagement',
                'reviewsmanagement' => 'admins/reviewsmanagement',
                'moderator' => 'admins/moderator',
                'blockedusermanagement' => 'admins/blockedusermanagement',
                'deletedusermanagement' => 'admins/deletedusermanagement',
                'deletedhostmanagement' => 'admins/deletedhostmanagement',
                'hostmanagement' => 'admins/hostmanagement',
                'blockedhostmanagement' => 'admins/blockedhostmanagement',
                'changeuserstatus' => 'admins/changeuserstatus',
                'changehoststatus' => 'admins/changehoststatus',
                'changeliststatus' => 'admins/changeliststatus',
                'getuserdetails' => 'admins/getuserdetails',
                'sendmessage' => 'admins/sendmessage',
                'sitemanagement' => 'admins/sitemanagement',
                'seomanagement' => 'admins/seomanagement',
                'emailmanagement' => 'admins/emailmanagement',
                'startfileupload' => 'admins/startfileupload',
                'startcountryfileupload' => 'admins/startcountryfileupload',
                'startadditionalfileupload' => 'admins/startadditionalfileupload',
                'startcommonfileupload' => 'admins/startcommonfileupload',
                'startspecialfileupload' => 'admins/startspecialfileupload',
                'homepagesettings' => 'admins/homepagesettings',
                'termsandconditions' => 'admins/termsandconditions',
                'listingproperties' => 'admins/listingproperties',
                'additionalamenities' => 'admins/additionalamenities',
                'cancellationpolicy' => 'admins/cancellationpolicy',
                'addadditionalamenity' => 'admins/addadditionalamenity',
                'commonamenities' => 'admins/commonamenities',
                'addcommonamenity' => 'admins/addcommonamenity',
                'safetycheck' => 'admins/safetycheck',
                'addsafetycheck' => 'admins/addsafetycheck',
                'specialfeatures' => 'admins/specialfeatures',
                'addspecialfeature' => 'admins/addspecialfeature',
                'emailmanage' => 'admins/emailmanage',
                'googlecodesettings' => 'admins/googlecodesettings',
                'language' => 'admins/language',
                'socialloginsettings' => 'admins/socialloginsettings',
                'mobilesmssettings' => 'admins/mobilesmssettings',
                '/admin/orders/vieworder/<id:\d+>' => '/admin/orders/vieworder',
                '/admin/security/viewconversation/<id:\d+>' => '/admin/security/viewconversation',
                '/admin/security/viewclaimconversation/<id:\d+>' => '/admin/security/viewclaimconversation',
                '/admin/listing/<id:\d+>' => '/admin/listing/index',
                '/admin/listing/blockedlisting/<id:\d+>' => '/admin/listing/blockedindex',
                'footersettings' => 'admins/footersettings',
                'paypalsettings' => 'admins/paypalsettings',
                'stripesettings' => 'admins/stripesettings',
                'addbuttonslider' => 'admins/addbuttonslider',
                'activelisting' => 'admins/activelisting',
                'blockedlisting' => 'admins/blockedlisting',
                'pendinglisting' => 'admins/pendinglisting',
                'alterliststatus' => 'admins/alterliststatus',
                'alterfeaturelist' => 'admins/alterfeaturelist',
            ],
        ],
    ],
    'params' => $params,
];
