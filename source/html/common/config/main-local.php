<?php

use yii\symfonymailer\Mailer;

return [
    'components' => [
        'db' => [
            'class' => 'yii\db\Connection',
            'dsn' => 'mysql:host=localhost;dbname=airfinch',
            'username' => 'root',
            'password' => 'Ai@$12%&R*96315Fi4onCh',
            'tablePrefix' => 'hts_',
            'charset' => 'utf8',
        ],

        'user' => [
            'identityClass' => 'frontend\models\User',
            'enableAutoLogin' => true,
        ],
 'mailer' => [
        'class' => 'yii\symfonymailer\Mailer',
        'viewPath' => '@common/mail',
        'useFileTransport' => false,
        'transport' => [
            'dsn' => 'smtp://vjpavimuthuvel9719@gmail.com:frzczdeetcyrqzhk@smtp.example.com:587',
        ],
    ],

    ],
];
