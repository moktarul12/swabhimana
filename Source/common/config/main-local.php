<?php
return [
    'components' => [
        'db' => [
            'class' => 'yii\db\Connection',
            'dsn' => 'mysql:host=localhost;dbname=airfinch_v3.3', 
            'username' => 'root',
            'password' => 'HitaPro@20',
            'tablePrefix' => 'hts_',
            'charset' => 'utf8',
        ],
        'user' => [
        'identityClass' => 'frontend\models\User',//or Users2
        'enableAutoLogin' => true,
        ],
        'mailer' => [
            'class' => 'yii\swiftmailer\Mailer',
            'viewPath' => '@common/mail',
            // send all mails to a file by default. You have to set
            // 'useFileTransport' to false and configure a transport
            // for the mailer to send real emails.
            'transport' => [
                'class' => 'Swift_SmtpTransport',
                'host' => 'smtp.gmail.com',
                'username' => 'skalidass@hitasoft.com',
                'password' => 'welcome@123',
                'port' => '465',
                'encryption' => 'ssl',
                ],//'useFileTransport' => true,
        ],
    ],
];
