<?php
namespace frontend\controllers;

use Yii;
use common\models\LoginForm;
use common\models\User;
use frontend\models\PasswordResetRequestForm;
use frontend\models\ResetPasswordForm;
use frontend\models\SignupForm;
use frontend\models\ContactForm;
use yii\base\InvalidParamException;
use yii\web\BadRequestHttpException;
use yii\web\Controller;
use yii\filters\VerbFilter;
use yii\filters\AccessControl;
use frontend\models\Sitesettings;
use common\components\JWTAuth;

/**
 * Site controller
 */
class SiteController extends Controller
{
    /**
     * @inheritdoc
     */
    public function behaviors()
    {
        return [
            'access' => [
                'class' => AccessControl::className(),
                'only' => ['logout', 'signup'],
                'rules' => [
                    [
                        'actions' => ['signup'],
                        'allow' => true,
                        'roles' => ['?'],
                    ],
                    [
                        'actions' => ['logout'],
                        'allow' => true,
                        'roles' => ['@'],
                    ],
                ],
            ],
            'verbs' => [
                'class' => VerbFilter::className(),
                'actions' => [
                    'logout' => ['post'],
                ],
            ],
        ];
    }

    /**
     * @inheritdoc
     */
    public function actions()
    {
        return [
            'error' => [
                'class' => 'yii\web\ErrorAction',
            ],
            'captcha' => [
                'class' => 'yii\captcha\CaptchaAction',
                'fixedVerifyCode' => YII_ENV_TEST ? 'testme' : null,
            ],
				'auth' => [ 
						'class' => 'yii\authclient\AuthAction',
						'successCallback' => [ 
								$this,
								'successCallback' 
						] 
				] 			
        ];
    }
	public function successCallback($client) {
		$attributes = $client->getUserAttributes ();
		// user login or signup comes here
		die(print_r($attributes));
	}	

    /**
     * Displays homepage.
     *
     * @return mixed
     */
    public function actionIndex()
    {
    echo Yii::$app->user->id;
    die;
    	$model = new SignupForm();
    	if ($model->load(Yii::$app->request->post())) {
    		if ($user = $model->signup()) {
    			if (Yii::$app->getUser()->login($user)) {
    				return $this->goHome();
    			}
    		}
    	}
    	
        return $this->render('index',[
        		'model' => $model,
        ]);
    }

    /**
     * Logs in a user.
     *
     * @return mixed
     */
    

    /**
     * Logs out the current user.
     *
     * @return mixed
     */
    public function actionLogout()
    {
       
        Yii::$app->user->logout();

        return $this->goHome();
    }

    /**
     * Displays contact page.
     *
     * @return mixed
     */
    public function actionContact()
    {
        $model = new ContactForm();
        if ($model->load(Yii::$app->request->post()) && $model->validate()) {
            if ($model->sendEmail(Yii::$app->params['adminEmail'])) {
                Yii::$app->session->setFlash('success', 'Thank you for contacting us. We will respond to you as soon as possible.');
            } else {
                Yii::$app->session->setFlash('error', 'There was an error sending email.');
            }

            return $this->refresh();
        } else {
            return $this->render('contact', [
                'model' => $model,
            ]);
        }
    }

    /**
     * Displays about page.
     *
     * @return mixed
     */
    public function actionAbout()
    {
        return $this->render('about');
    }

    /**
     * Signs user up.
     *
     * @return mixed
     */
   

    public function actionPhoneupdate()
    { 
      if (! Yii::$app->user->isGuest) {
         $models = new SignupForm(); 
        $loguserid = \Yii::$app->user->identity->id;
        $user =$models->findIdentity ( $loguserid );
        return $this->render('phonelogin', ['user' => $user, 'pageid' => "update"]); 
      } else { 
        Yii::$app->session->setFlash('error', Yii::t('app','Mobile Number Already Used'));
        $homeUrl = Yii::$app->getUrlManager()->getBaseUrl().'/';
        return $this->redirect($homeUrl);
      }
    }

    public function actionPhonelogin()
    {

       return $this->render('phonelogin', ['pageid' => "login"]); 
    }

    public function actionAjaxsignup()
    {
        $model = new SignupForm(['scenario' => 'signup']);
        if (Yii::$app->request->isAjax && $model->load(Yii::$app->request->post())) {
                Yii::$app->response->format = Response::FORMAT_JSON;
                return $err = ActiveForm::validate($model);
        } else {
            if(Yii::$app->request->post()) {
                $user = base64_encode(json_encode($_POST['SignupForm'])); 
                //return $this->redirect(array('site/phonelogin', 'user' => $user));
                return $this->render('phonelogin', ['user' => $user, 'pageid' => "signup"]); 
            }
       } 
    }

    // public function actionAjaxsignup()
    // {
    //     $model = new SignupForm(['scenario' => 'signup']);
    //     if (Yii::$app->request->isAjax && $model->load(Yii::$app->request->post())) {
    //             Yii::$app->response->format = Response::FORMAT_JSON;
    //             return $err = ActiveForm::validate($model);
    //     } else {
    //         if(Yii::$app->request->post()) {
    //             $user = base64_encode(json_encode($_POST['SignupForm'])); 
    //             //return $this->redirect(array('site/phonelogin', 'user' => $user));
    //             return $this->render('phonelogin', ['user' => $user, 'pageid' => "signup"]); 
    //         }
    //    } 
    // }

     public function actionPhonesignup() 
    {
        $phone_no = explode('+', $_POST['phone']); 
        if (count($phone_no) && trim($_POST['pageindexid']) == "signup")  {     
          $phone = trim($phone_no[1]); 
          $email = isset($_POST['email']) ? trim($_POST['email']) : "";
          $firstname = isset($_POST['firstname']) ? trim($_POST['firstname']) : "";
          $lastname = isset($_POST['lastname']) ? trim($_POST['lastname']) : "";
          $password = isset($_POST['password']) ? trim($_POST['password']) : "";
          $day = isset($_POST['day']) ? trim($_POST['day']) : ""; 
          $month = isset($_POST['month']) ? trim($_POST['month']) : ""; 
          $year = isset($_POST['year']) ? trim($_POST['year']) : "";   

          $userdetails = User::find()->where(['phoneno' => $phone])->one();

          if(!empty($userdetails)) { 
              Yii::$app->session->setFlash('error', Yii::t('app','Mobile number already exists'));
              return "false..."; 
          } else {   
            $user = new User();
            $user->firstname = $firstname;
            $user->lastname = $lastname;
            $user->email = $email;
            $user->password = base64_encode($password);
            $user->birthday = $month."-".$day."-".$year; 


            $user->userstatus = "1";
            $user->user_level = "normal";
            $user->hoststatus = "1";

            if(isset($phone)) {   
                /*phone login*/
                $user->phoneno = $phone;
                $user->verifyno = trim($_POST['phone']);  
                $user->mobileverify = 1;   
                /*phone login*/
            }
            
            $user->pushnotification = "1";

            $notifications = array();
            $notifications['mobilenotify'] = "0";
            $notifications['messagenotify'] = "1";
            $notifications['reservationnotify'] = "1";
            $notifications['accountnotify'] = "0";
            $emails = array();
            $emails['generalemail'] = "0";
            $emails['reservationemail'] = "1";   

            $user->notifications = json_encode($notifications);
            $user->emailsettings = json_encode($emails);  
            
            if ($user->save()) { 
                // JWT Token Process
                $user->access_token = JWTAuth::getToken($user->id);
                $user->save(); 
                // JWT Token Process
                $link = Yii::$app->urlManager->createAbsoluteUrl ( '/verify/' . base64_encode ( $email ) );
                $sitesetting = Sitesettings::find()->where(['id'=>'1'])->one();
                $siteName = $sitesetting->sitename;
                if($sitesetting->welcomeemail=="yes")
                {
                  Yii::$app->mailer->compose ( 'welcome', [
                      'name' => $firstname,
                      'link' => $link,
                      'siteName' => $siteName,
                      'sitesetting' => $sitesetting,            
                      ] )->setFrom ( $sitesetting->noreplyemail )->setTo ( $email )->setSubject ( 'Welcome mail' )->send ();
                }
                Yii::$app->mailer->compose ( 'verifyemail', [
                    'name' => $firstname,
                    'link' => $link,
                    'siteName' => $siteName,
                    'sitesetting' => $sitesetting,
                    ] )->setFrom ( $sitesetting->noreplyemail )->setTo ( $email )->setSubject ( 'Verify Email' )->send ();

                if (Yii::$app->getUser()->login($user)) {
                  $session = Yii::$app->session;
                  $session->open ();
                  $session ['welcomepop'] = "1";
                  $_SESSION['welcomepop'] = "1";
                  return "true" ;  
                } else {
                  Yii::$app->session->setFlash('error', Yii::t('app','Sorry, something went to be wrong'));
                  return "false";
                }
            }
          }   
        } elseif (count($phone_no) && trim($_POST['pageindexid']) == "login")  { 
          $phone = trim($phone_no[1]);
          $user = User::find()->where(['phoneno' => $phone])->one(); 
          if($user['userstatus'] == 4 )
          {
            Yii::$app->session->setFlash('error', Yii::t('app','Your account has been deleted. Kindly contact admin to restore the account.'));
            return "signin"; 
          }
          //print_r($user);die;
          if(!empty($user)) {
            if (Yii::$app->getUser()->login($user)) { 
               Yii::$app->session->setFlash('success', Yii::t('app','Welcome'));
              return "true" ;  
            } else { 
              Yii::$app->session->setFlash('error', Yii::t('app','Sorry, something went to be wrong'));
              return "false";
            }
          } else {
            Yii::$app->session->setFlash('error', Yii::t('app','Unregistered Mobile Number'));
              return "signup"; 
          }
        } elseif (count($phone_no) && trim($_POST['pageindexid']) == "update")  { 
          $phone = trim($phone_no[1]);
          $email = isset($_POST['email']) ? trim($_POST['email']) : "";

          if(!empty($email)) {
            $user = User::find()->where(['email' => $email])->one(); 
            if(!empty($user) && !empty($phone)) {    
              $userExist = User::find()->where(['phoneno' => $phone])->one(); 
              if(empty($userExist) && !empty($phone)) {    
                /*phone login*/
                $user->phoneno = $phone;   
                $user->verifyno = trim($_POST['phone']);  
                $user->save(false);   
                /*phone login*/
                Yii::$app->session->setFlash('success', Yii::t('app','Profile updated successfully'));    
                return "true" ;   
              } else { 
                Yii::$app->session->setFlash('error', Yii::t('app','Sorry, Mobile Number Already Used'));  
                return "false";
              }
            } else {
                Yii::$app->session->setFlash('error', Yii::t('app','Sorry, something went to be wrong')); 
                return "false";
            }
          } else {
            Yii::$app->session->setFlash('error', Yii::t('app','Sorry, something went to be wrong')); 
                return "false";
          }
        } else {
          return "out"; 
        }
    }

    public function actionLoginwithotp()
    {
  
        // print_r($_POST);die;
        $phone = $_POST['phone_no'];
        $phoneno = preg_replace("/[^0-9]/", "", $phone);
        $user = User::find()->where(['phoneno' => $phoneno])->one();
        $login = array();
        
        if(!empty($user))
        {
            $login['username'] = $user->email;
            $login['password'] = base64_decode($user->password_encrypt);
            $model = new LoginForm(['scenario' => 'login']);
            //if ($model->load($login)) {
            $model->attributes = $login;
              if ($model->validate()) {
                        $rem=0;

              if($user['activationStatus']==1 && $user['userstatus']==1) {
                $model->login($rem);

                Yii::$app->session->setFlash('success', Yii::t('app','Welcome').' '.$user['username']);

                return $this->redirect(Yii::$app->user->returnUrl);
               if (Yii::$app->user->returnUrl == Yii::$app->urlManager->createAbsoluteUrl('site/signup')) {
                return $this->redirect(Yii::$app->getUrlManager()->getBaseUrl().'/');
                
               }
               else  if (Yii::$app->user->returnUrl == Yii::$app->urlManager->createAbsoluteUrl('site/login')) {
                return $this->redirect(Yii::$app->getUrlManager()->getBaseUrl().'/');
                
               }
               else  if (Yii::$app->user->returnUrl == Yii::$app->urlManager->createAbsoluteUrl('login')) {
                return $this->redirect(Yii::$app->getUrlManager()->getBaseUrl().'/');
                
               }
               else
               {
                return $this->redirect(Yii::$app->user->returnUrl);
               }

              }
              else if($user['userstatus'] == 4 )
              {
                Yii::$app->session->setFlash('error', Yii::t('app','Your account has been deleted. Kindly contact admin to restore the account.'));
                return "signin"; 
              }
              else if($user['activationStatus'] == 0 && $user['userstatus'] == 0 )
              {
                Yii::$app->session->setFlash('error', Yii::t('app','Please verify your account by given mail id'));
                return $this->redirect(['site/login']);
              }
              else if($user['activationStatus'] == 0 && $user['userstatus'] == 1 )
              {
                Yii::$app->session->setFlash('error', Yii::t('app','Please verify your account by given mail id'));
                return $this->redirect(['site/login']);
              }

              else if($user['activationStatus'] == 1 && $user['userstatus'] == 0 )
              {
                Yii::$app->session->setFlash('error', Yii::t('app','Your account has been disabled by the Administrator')); 
                return $this->redirect(['site/login']);
              }
              return $this->render('loginn', [
            'model' => $model,
        ]); 
           }
        
       //} 
                 
        return $this->render('loginn', [
            'model' => $model,
        ]); 
      }
      else
      {//echo "comes";
        Yii::$app->session->setFlash('error', Yii::t('app','Phone number not registered.')); die;
        return $this->redirect(['site/login']);
      }
        
    }

    /**
     * Requests password reset.
     *
     * @return mixed
     */
    public function actionRequestPasswordReset()
    {
        $model = new PasswordResetRequestForm();
        if ($model->load(Yii::$app->request->post()) && $model->validate()) {
            if ($model->sendEmail()) {
                Yii::$app->session->setFlash('success', 'Check your email for further instructions.');

                return $this->goHome();
            } else {
                Yii::$app->session->setFlash('error', 'Sorry, we are unable to reset password for email provided.');
            }
        }

        return $this->render('requestPasswordResetToken', [
            'model' => $model,
        ]);
    }

    /**
     * Resets password.
     *
     * @param string $token
     * @return mixed
     * @throws BadRequestHttpException
     */
    public function actionResetPassword($token)
    {
        try {
            $model = new ResetPasswordForm($token);
        } catch (InvalidParamException $e) {
            throw new BadRequestHttpException($e->getMessage());
        }

        if ($model->load(Yii::$app->request->post()) && $model->validate() && $model->resetPassword()) {
            Yii::$app->session->setFlash('success', 'New password was saved.');

            return $this->goHome();
        }

        return $this->render('resetPassword', [
            'model' => $model,
        ]);
    }
}
