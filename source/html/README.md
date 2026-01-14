<p align="center">
    <a href="https://github.com/yiisoft" target="_blank">
        <img src="https://avatars0.githubusercontent.com/u/993323" height="100px">
    </a>
    <h1 align="center">Yii 2 Advanced Project Template</h1>
    <br>
</p>

Yii 2 Advanced Project Template is a skeleton [Yii 2](http://www.yiiframework.com/) application best for
developing complex Web applications with multiple tiers.

The template includes three tiers: front end, back end, and console, each of which
is a separate Yii application.

The template is designed to work in a team development environment. It supports
deploying the application in different environments.

Documentation is at [docs/guide/README.md](docs/guide/README.md).

[![Latest Stable Version](https://img.shields.io/packagist/v/yiisoft/yii2-app-advanced.svg)](https://packagist.org/packages/yiisoft/yii2-app-advanced)
[![Total Downloads](https://img.shields.io/packagist/dt/yiisoft/yii2-app-advanced.svg)](https://packagist.org/packages/yiisoft/yii2-app-advanced)
[![build](https://github.com/yiisoft/yii2-app-advanced/workflows/build/badge.svg)](https://github.com/yiisoft/yii2-app-advanced/actions?query=workflow%3Abuild)

DIRECTORY STRUCTURE
-------------------

```
common
    config/              contains shared configurations
    mail/                contains view files for e-mails
    models/              contains model classes used in both backend and frontend
    tests/               contains tests for common classes    
console
    config/              contains console configurations
    controllers/         contains console controllers (commands)
    migrations/          contains database migrations
    models/              contains console-specific model classes
    runtime/             contains files generated during runtime
backend
    assets/              contains application assets such as JavaScript and CSS
    config/              contains backend configurations
    controllers/         contains Web controller classes
    models/              contains backend-specific model classes
    runtime/             contains files generated during runtime
    tests/               contains tests for backend application    
    views/               contains view files for the Web application
    web/                 contains the entry script and Web resources
frontend
    assets/              contains application assets such as JavaScript and CSS
    config/              contains frontend configurations
    controllers/         contains Web controller classes
    models/              contains frontend-specific model classes
    runtime/             contains files generated during runtime
    tests/               contains tests for frontend application
    views/               contains view files for the Web application
    web/                 contains the entry script and Web resources
    widgets/             contains frontend widgets
vendor/                  contains dependent 3rd-party packages
environments/            contains environment-based overrides
```

-----------------------------------------------------------------------------------------------
Add-Ons included in this Package.
================================

Image Moderation Add-on: 
-----------------------
In Frontend Folder,
    1. Replace file frontend/controller/usercontroller.php
    2. Replace file frontend/modules/controller/listingcontroller.php


Google Captcha Verification Add-on:
----------------------------------
In Frontend Folder,
    1. Replace file frontend/models/signupform.php
    2. Replace file frontend/views/users/signup.php
    3. Replace file frontend/views/users/index.php

Login with PhoneNumber Add-on:
------------------------------
In Frontend Folder,
    1. Replace file frontend/views/users/login.php
    2. Replace file frontend/views/users/index.php
    3. Replace file frontend/controllers/sitecontroller.php
    4. Replace file frontend/controllers/UserController.php
    5. Add file frontend/views/site/phonelogin.php

Need to Add the phonelogin page details in frontend/config/main.php 

Watermark Add-on:
----------------
In Backend Folder,
    1. Replace the sitemanagement.php file in backend/views/admins/
    2. Replace the adminscontroller.php file in backend/controllers/
    3. Replace the admin.js backend/web/js/

In Frontend Folder,
    1. Replace the listingcontroller.php file in frontend/modules/user/controllers/

Amazon S3 Add-on:
-----------------
Amazon AWS S3 files are Included.

Pages are Mentioned Below. 

In Frontend Folder, (Need to Replace the files)
    1.modules/user/views/listing/managelist.php
    2.modules/user/controllers/ListingController.php
    3.modules/user/views/listing/view.php
    4.views/users/Dashboard.php
    5.views/users/index.php
    6.views/users/profile.php
    7.modules/user/views/messages/inbox.php
    8.modules/user/views/listing/mylistings.php
    9.modules/user/views/listing/futurereservations.php
    10.modules/user/views/listing/pastreservations.php
    11.modules/user/views/listing/reviewsbyyou.php
    12.modules/user/views/listing/reviewsaboutyou.php
    13.modules/user/views/listing/search.php
    14.modules/user/views/listing/usernotifications.php
    15.controllers/UsersController.php
    16.modules/user/views/layouts/search.php
    17.views/layout/main.php
    18.modules/user/views/listing/editwishlist.php
    19.modules/user/views/listing/getsearchupdate.php
    20.modules/user/views/listing/mywishlists.php
    21.modules/user/views/listing/popularwishlists.php
    22.modules/user/views/listing/wishlist.php
    23.modules/user/views/messages/viewmessage.php
    24.views/users/invitefriends.php

Need to add the AWS SDK for PHP includes a ZIP file in Vendor folder, it contains the classes and dependencies you need to run the SDK.

Need to add the aws-sdk-php in Composer.json file.
--------------------------------------------------------------------------------------------------
