<?php
/*
 * This is for the user to register their account with referral
 * @author: Muthumareeswari
 * @package: Views
 * @PHPVersion: 5.4
 */
/* @var $this yii\web\View */

use yii\helpers\Html;
use yii\bootstrap\ActiveForm;
$this->title = 'Login';
$baseUrl = Yii::$app->request->baseUrl;
$socialSettings = $sitesetting->socialid;
$socialSettingsDetails = json_decode($socialSettings, true);

$googleId = isset($socialSettingsDetails['google']['appid'])?$socialSettingsDetails['google']['appid']:''; 
?>
<script type="text/javascript" src="<?php echo $baseUrl.'/js/jwt-decode.js'; ?>"></script>
<script src="https://accounts.google.com/gsi/client" async defer></script>
<script>
  function googleSignin(element) {
    var payload = jwt_decode(element.credential);
    var id = payload['iat']
    var full_name=[];
    full_name.push({
    givenName:payload['name']
    })
    var last_name = payload['family_name'];
    var first_name = payload['given_name'];
    var image = [];
    image.push({
    url:payload['picture']
    })
    var email = payload['email'];
    var attributes = [];
    attributes.push({
    id:id,
    name:full_name[0],
    last_name:last_name,
    image:image[0],
    email:email,
    first_name:first_name,
    type:'google'
    });
    window.location = baseurl+'/social/'+btoa(JSON.stringify(attributes[0]));
    }
  </script>
  <style type="text/css">
    #customBtnLogin {
      display: inline-block;
      background: white;
      color: #444;
      width: 100%; 
      border-radius: 3px; 
      border: thin solid #888;
      white-space: nowrap;
      padding: 1px;
      margin-top:10px;
    }
    .modal-dialog{
      width:42% !important;
    }

    #customBtn:hover {
      cursor: pointer;
    }
    span.label {
      font-family: serif;
      font-weight: normal;
    }
    span.icon {
      background: url('https://google-developers.appspot.com/identity/sign-in/g-normal.png') transparent 5px 50% no-repeat;
      display: inline-block;  
      vertical-align: middle;
      width: 42px;
      height: 42px;
    }
    span.buttonText {
      display: inline-block;
      vertical-align: middle;
      padding-left: 0;
      padding-right: 0; 
      font-size: 18px;  
      font-weight: bold;
      /* Use the Roboto font that is loaded in the <head> */
      /*font-family: 'Roboto', sans-serif;*/
    }
  </style>
  
<div class="pos_rel bg_gray1">
	<div class="container">
  <div class="modal-dialog login_width" role="document">
    <div class="modal-content" style="box-shadow: none;">
      <div class="modal-body text-center">


                <div id="gSignInWrapper" style="display: inline-block;">  
                  <div class="customGPlusSignIn">
                    <div id="g_id_onload"
                    data-client_id="<?= $googleId; ?>"
                    data-context="signin"
                    data-ux_mode="popup"
                    data-auto_prompt="false"
                    data-callback="googleSignin"
                    data-auto_select="true">
                    </div>
                    <div class="g_id_signin"
                    data-type="standard"
                    data-width=400
                    data-theme= "filled_blue"
                    data-shape="rectangular"
                    data-theme="outline"
                    data-text="signin_with"
                    data-size="large">
                    </div>   
                  </div>
                </div>               

                <script>startApp();</script> 


          <div class="login_or border_bottom margin_top10"><span><?php echo Yii::t('app','or');?></span></div>

      <?php 
      if(isset($socialSettingsDetails['socialstatus']) && $socialSettingsDetails['socialstatus'] == "1") { ?>
      	 <!--<h2 class="login-popup-title">Log in to continue</h2>-->
        <a href="#" class="text-danger">
      	</a>

      <?php  } else {
      	echo Yii::t('app','Login');
      } ?>
            <?php $form = ActiveForm::begin(['id' => 'login-form','action' => 'login',
            ]); ?>

                <?= $form->field($model, 'email')->textInput(['id'=>'login-email', 'class' => 'form-control margin_top30 margin_bottom10','placeholder' => ''.Yii::t('app','Email').'',  'value'=>''])->label(false) ?>

                <?= $form->field($model, 'password')->passwordInput(['id'=>'login-password','class' => 'form-control margin_bottom10','placeholder' => ''.Yii::t('app','Password').'',  'value'=>''])->label(false) ?>   
 
				<div class="pull-left margin_bottom10">
				<input type="hidden" value="0" name="SignupForm[rememberMe]">
               <input id="login-rememberMe" type="checkbox" name="SignupForm[rememberMe]">
			   <div class="airfcfx-search-checkbox-text"><?php echo Yii::t('app','Remember me');?></div>
                </div>
                <input id="login-rememberMe" type="checkbox" name="SignupForm[rememberMe]">
                <p class="text-right text-danger margin_bottom10 show-paswrd">
                  <a href="javascript:void(0);" onclick="javascript:Toggle();"><?php echo Yii::t('app','Show password'); ?></a>   
              </p>


                <div class="form-group">
                    <?= Html::submitButton(''.Yii::t('app','Login').'', ['class' => 'btn btn_email margin_top10 width100', 'name' => 'login-button']) ?>
                </div>
				<?php
				$loadimgurl = Yii::$app->urlManager->createAbsoluteUrl ('/images/load.gif');
echo '<img id="loginloadimg" src="'.$loadimgurl.'" class="loading" style="margin-top:-1px;">';
?>
            <?php ActiveForm::end(); ?>

            <p class="text-center text-danger margin_bottom10 forgottextalgn">
              <a href="#" data-toggle="modal" data-target="#myModalpass" >
              <?php echo Yii::t('app','Forgot Password?');?>
              </a>
            </p>
            <p class="text-center"><?php echo Yii::t('app','New to');?> <?php echo $sitesetting->sitename;?>? <a href="<?php echo $baseUrl.'/register';?>" class="text-danger"><b><?php echo Yii::t('app','Sign up');?></b></a> </p>  

      </div>  

    </div>
  </div>
    </div> <!-- container end -->
</div> <!-- list_bg end -->

<div class="modal fade" id="myModalpass" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
  <div class="modal-dialog login_width" role="document">
    <div class="modal-content">
      <div class="modal-header no_border">
        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>        
      </div>
      <div class="modal-body text-center">
<?php echo Yii::t('app',"Enter the email address associated with your account, and we'll email you a link to reset your password. ");?>     
            <?php $form = ActiveForm::begin(['id' => 'password-form','action' => 'forgotpassword',
            ]); ?>

                <?= $form->field($models, 'email')->textInput(['class' => 'form-control margin_top30','placeholder' => ''.Yii::t('app','Email').''])->label(false) ?>

			<div class="login_or border_bottom margin_top10"></div>      
                <div class="form-group">
                    <?= Html::submitButton(''.Yii::t('app','Send Reset Link').'', ['class' => 'btn btn_email margin_top10 width100', 'name' => 'reset-button']) ?>
                </div>

            <?php ActiveForm::end(); ?>


            <!-- <p class="changeover">Don’t have an account? <a data-dismiss="modal" data-toggle="modal" href="#signupModal">Sign up</a></p>-->
            
            </div>
           
    </div>
  </div>
</div>

<script>
  function Toggle() { 
            var temp = document.getElementById("login-password"); 
            if (temp.type === "password") { 
                temp.type = "text"; 
            } 
            else { 
                temp.type = "password"; 
            } 
        }  
</script>
