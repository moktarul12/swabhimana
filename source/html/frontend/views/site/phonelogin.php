<?php
use yii\helpers\Html;
use yii\authclient\widgets\AuthChoice;
use conquer\toastr\ToastrWidget;
use frontend\models\Sitesettings;
use common\models\User;
use frontend\components\MyClass;


$this->title = 'Login';
// $this->params['breadcrumbs'][] = $this->title;
$siteSettings = Sitesettings::find()->orderBy(['id' => SORT_DESC])->one();
$socialid = $siteSettings->socialid;
$firebaseKey = $siteSettings->googleapikey;

if (isset($user) && $pageid == "signup") {
  $user = json_decode(base64_decode($user)); 
} 

if (isset($pageid)) {
  $pageindexid = $pageid;  
}
//echo "<pre>"; print_r($user);die;
 ?>
 <?php $lineMaring = "no-margin";

 ?>
<link type="text/css" rel="stylesheet" href="https://www.gstatic.com/firebasejs/ui/4.2.0/firebase-ui-auth.css" />
            <script src="http://www.gstatic.com/firebasejs/5.0.4/firebase.js"></script>
              <script>
               
              </script>
              <script src="https://cdn.firebase.com/libs/firebaseui/2.3.0/firebaseui.js"></script>
              <link type="text/css" rel="stylesheet" href="https://cdn.firebase.com/libs/firebaseui/2.3.0/firebaseui.css" />           

              <div class="login-line col-xs-12 col-sm-12 col-md-12 col-lg-12 no-hor-padding "></div>

                <div class="login-content col-xs-12 col-sm-12 col-md-12 col-lg-12 no-hor-padding">
                  <div class="login-box col-xs-12 col-sm-12 col-md-12 col-lg-12 no-hor-padding">
                <?php if(isset($user)) { ?> 
                  <input type="hidden" id="ajax-email" value="<?php echo $user->email;?>">
                  <input type="hidden" id="ajax-name" name="ajax-name" value="<?php echo $user->firstname;?>">
                  <input type="hidden" id="ajax-username" name="ajax-username" value="<?php echo $user->lastname;?>">
                  <?php if($pageindexid == "signup") { ?>
                    <input type="hidden" id="ajax-password" name="ajax-password" value="<?php echo $user->password;?>">
                    <input type="hidden" id="ajax-month" name="ajax-month" value="<?php echo $user->month;?>">  

                    <input type="hidden" id="ajax-day" name="ajax-day" value="<?php echo $user->day;?>"> 
                    <input type="hidden" id="ajax-year" name="ajax-year" value="<?php echo $user->year;?>"> 
                  <?php } else { ?>
                    <input type="hidden" id="ajax-password" name="ajax-password" value=""> 
                    <input type="hidden" id="ajax-month" name="ajax-month" value="">  

                    <input type="hidden" id="ajax-day" name="ajax-day" value=""> 
                    <input type="hidden" id="ajax-year" name="ajax-year" value=""> 
                  <?php } ?>

                   
                <?php } else { ?>
                  <input type="hidden" id="ajax-email" value="">
                  <input type="hidden" id="ajax-name" name="ajax-name" value="">
                  <input type="hidden" id="ajax-username" name="ajax-username" value="">
                  <input type="hidden" id="ajax-password" name="ajax-password" value="">

                  <input type="hidden" id="ajax-month" name="ajax-month" value="">  

                  <input type="hidden" id="ajax-day" name="ajax-day" value=""> 
                  <input type="hidden" id="ajax-year" name="ajax-year" value=""> 
                <?php } ?> 

                  <input type="hidden" id="ajax-phone" name="ajax-phone" value="">
               
                  <div id="firebaseui-auth-container" style=" display: block; margin-left: auto; margin-right: auto; height: 360px; width: 391px;" class="margin_top20"></div>
                

<div class="login-line-2 col-xs-12 col-sm-12 col-md-12 col-lg-12 no-hor-padding margin_bottom20"></div>
<div class="new-signup col-xs-12 col-sm-12 col-md-12 col-lg-12 no-hor-padding margin_bottom20">

<!--  <span><?php echo Yii::t('app','Not a member yet ?'); ?></span>
 <?=Html::a(Yii::t('app','click here'), ['site/signup'], ['class' => 'signup-link txt-pink-color'])?></li> -->
 
 
</div>

</div>
</div>
</div>
<!-- end Bottom to top-->
<?php  $baseUrl = Yii::$app->getUrlManager()->getBaseUrl(); 
?>
<input type="hidden" id="baseUrl" value="<?php echo $baseUrl; ?>">
<input type="hidden" id="firebase_appid" value="<?php echo $socialid;?>">
<script src="https://www.gstatic.com/firebasejs/4.1.3/firebase.js"></script>

<script src="<?=Yii::$app->getUrlManager()->getBaseUrl()?>/frontend/web/js/firebaseui.js"></script>
<link type="text/css" rel="stylesheet" href="<?=Yii::$app->getUrlManager()->getBaseUrl()?>/frontend/web/css/firebaseui.css" />
 <script type="text/javascript" src="//ajax.googleapis.com/ajax/libs/jquery/2.0.0/jquery.min.js"></script>

<script>
var appid = 'AIzaSyBTg5ARHD01O0izWTxgCw2ZVVlu4tq2-II';
// var appid = '<?php echo $firebaseKey; ?>';
var baseUrl = document.getElementById("baseUrl").value;
var firstname = document.getElementById("ajax-name").value;
var email = document.getElementById("ajax-email").value; 
var lastname = document.getElementById("ajax-username").value;
var password = document.getElementById("ajax-password").value;
var day = document.getElementById("ajax-day").value;  
var month = document.getElementById("ajax-month").value; 
var year = document.getElementById("ajax-year").value; 
var pageindexid = '<?php echo $pageindexid; ?>'; 

  var firebaseConfig = {
    apiKey: appid,
  };
  firebase.initializeApp(firebaseConfig);
  
  var ui = new firebaseui.auth.AuthUI(firebase.auth());

  var uiConfig = {
    callbacks: {
      signInSuccessWithAuthResult: function(authResult, redirectUrl) {
        var phone_no = authResult['user']['phoneNumber']; 
        if(pageindexid == "signup") {
          $.ajax({
            type : 'POST',
            url : '<?=Yii::$app->getUrlManager()->getBaseUrl()?>/site/phonesignup',
            data : {'phone': phone_no, 'firstname': firstname, 'lastname': lastname, 'email': email, 'password': password, 'day': day, 'month': month, 'year': year, "pageindexid": pageindexid},    
            success : function(data) {
                if(data)
                 {
                    console.log(" success innn " + data);  
                    window.location.href = baseUrl + '/';
                 }
                  
               } 
            
            }); 
        } else if(pageindexid == "login") {
           $.ajax({
            type : 'POST',
            url : '<?=Yii::$app->getUrlManager()->getBaseUrl()?>/site/phonesignup',
            data : {'phone': phone_no, "pageindexid": pageindexid},     
            success : function(data) {
                if(data.trim() == "signup") { 
                  window.location.href = baseUrl + '/register';
                } else 
                 {
                    console.log(" success innn " + data);  
                    window.location.href = baseUrl + '/';
                 }
                  
               } 
            
            });  
        } else if(pageindexid == "update") { 
           $.ajax({
            type : 'POST', 
            url : '<?=Yii::$app->getUrlManager()->getBaseUrl()?>/site/phonesignup',
            data : {'email' : email, 'phone': phone_no, "pageindexid": pageindexid},     
            success : function(data) {
                if(data)
                 {
                    console.log(" success innn " + data);  
                    window.location.href = baseUrl + '/';
                 }
                  
               } 
            
            });  
        }
     
      },
      uiShown: function() {
        console.log('shown');
        document.getElementById('loader').style.display = 'none';
      }
    },
    signInFlow: 'popup',
    signInSuccessUrl: "<?=Yii::$app->getUrlManager()->getBaseUrl()?>/",
    signInOptions: [
      firebase.auth.PhoneAuthProvider.PROVIDER_ID
    ],
    tosUrl: "<?=Yii::$app->getUrlManager()->getBaseUrl()?>/",
    privacyPolicyUrl: "<?=Yii::$app->getUrlManager()->getBaseUrl()?>/",
  };  

  ui.start('#firebaseui-auth-container', uiConfig);

</script>