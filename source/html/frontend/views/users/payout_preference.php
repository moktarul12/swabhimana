<?php
/*
 * This is for the user to save and edit their information
 *
 * @author: Muthumareeswari
 * @package: Views
 * @PHPVersion: 5.4
 */
/* @var $this yii\web\View */
use yii\helpers\Html;
use yii\bootstrap\ActiveForm;
use frontend\models\Listing;

$this->title = 'Payout Preference';
?>
<?php
$baseUrl = Yii::$app->request->baseUrl;
$stripe_clientId = trim($sitesetting->stripeid);
if(isset($connectUrl)){
    $express_URL = $connectUrl;
}

//str_pad(rand(0, pow(10, $digits)-1), $digits, '0', STR_PAD_LEFT);
?>
<div class="profile_head">
    <div class="container">
        <ul class="profile_head_menu list-unstyled">
            <?php
            echo '<li><a href="' . $baseUrl . '/dashboard">' . Yii::t('app', 'Dashboard') . '</a></li> 
        <li><a href="' . $baseUrl . '/user/messages/inbox/traveling">' . Yii::t('app', 'Inbox') . '</a></li>
        <li><a href="' . $baseUrl . '/user/listing/mylistings">' . Yii::t('app', 'Listing') . '</a></li>
        <li><a href="' . $baseUrl . '/user/listing/trips">' . Yii::t('app', 'Trips') . '</a></li>
        <li class="active"><a href="' . $baseUrl . '/editprofile">' . Yii::t('app', 'Profile') . '</a></li>
        <li><a href="' . $baseUrl . '/user/listing/notifications">' . Yii::t('app', 'Account') . '</a></li>';
            if (!Yii::$app->user->isGuest) {
                $loguserid = Yii::$app->user->identity->id;
                $userHostStatus = Yii::$app->user->identity->hoststatus;
                $userListings = Listing::find()->where(['userid' => $loguserid])->all();

                if ($userHostStatus == 1 && count($userListings) > 0) {
                    echo '<li><a href="' . $baseUrl . '/user/listing/calendar">' . Yii::t('app', 'Calender') . '</a></li>';
                }
            }
            ?>
        </ul>
    </div> <!--container end -->
</div> <!--profile_head end -->


<div class="bg_gray1">
    <div class="container">
        <?php $sitesetting = Yii::$app->mycomponent->getLogo(); ?>
        <div class="col-xs-12 col-sm-3 col-md-3 col-lg-3 margin_top20">
            <ul class="profile_left list-unstyled">
                <?php
                echo '<li ><a href="' . $baseUrl . '/editprofile" >' . Yii::t('app', 'Edit Profile') . '</a></li> 
            <li class="active"><a href="' . $baseUrl . '/payoutpreference" >' . Yii::t('app', 'Payout Preferences') . '</a></li> 
            <li><a href="' . $baseUrl . '/trust" >' . Yii::t('app', 'Trust and Verification') . '</a></li>
			<li><a href="' . $baseUrl . '/user/listing/reviewsbyyou" >' . Yii::t('app', 'Reviews') . '</a></li>
            ';
                ?>
            </ul>
            
        </div> <!--col-sm-3 end -->

        <div class="col-xs-12 col-sm-9 col-md-9 col-lg-9 margin_top20">
            <div class="airfcfx-panel panel panel-default">
                <div class="airfcfx-panel airfcfx-panel-padding panel-heading profile_menu1">
                    <h3 class="airfcfx-panel-title panel-title">
                        <?php echo Yii::t('app', 'Payout preference'); ?>
                    </h3>
                </div>
                <div class="airfcfx-panel-padding panel-body ">
                    <?php
                    if (!empty($userdata->stripe_account_id)) {
                        echo '<div><p class="fontMedium textClr fontSizemedium text-center availability">Account has been verified successfully</p></div>';
                    } else {
                        echo '<div><p class="fontMedium textClr fontSizemedium text-center availability">Please create a new payout account with Airfinch.</p></div>';
                    }
                    ?>
                <h3 class="airfcfx-panel-title panel-title">&nbsp;&nbsp;&nbsp;</h3>
                <div class="text-center">
                  <a href="<?php echo $express_URL; ?>">
                    <button class="airfcfx-panel btn btn_email"><?php echo (empty($userdata->stripe_account_id)) ? "Create" : "Change"; ?> Account</button>
                </a>
                </div>
                </div>
            </div>
        </div>
    </div>
</div>