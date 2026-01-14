<?php

namespace frontend\controllers;

/*
 * This controller controls all the user related actions like signup, login, profile, social logins, forget password
 * and delete account. Any user account related funcitons should be carried outin this controller.
 *
 * @Company: Hitasoft Technology Solutions Private Limited
 * @Framework : Yii
 * @Version: 2.0
 */
use frontend\models\Listingproperties;

use Yii;
use frontend\models\LoginForm;
use frontend\models\PasswordResetRequestForm;
use frontend\models\ResetPasswordForm;
use frontend\models\SignupForm;
use frontend\models\ContactForm;
use frontend\models\Country;
use frontend\models\Currency; 
use frontend\models\Profile;
use frontend\models\Userinvites;
use frontend\models\Shippingaddress;
use frontend\models\Reservations;
use frontend\models\Sitesettings;
use frontend\models\Homepagesettings;
use frontend\models\Homecountries;
use frontend\models\Buttonsliders;
use frontend\models\Textsliders;
use frontend\models\Timezone;
use frontend\models\Listing;
use frontend\models\Languages;
use frontend\models\Reviews;
use frontend\models\Users;
use frontend\models\Logs; 
use frontend\models\Photos; 
use frontend\models\Userdevices; 
use frontend\models\Roomtype;
use backend\models\Profilereports;
use backend\models\Userreports;
use frontend\components\MyClass;
use yii\base\InvalidParamException;
use yii\web\BadRequestHttpException;
use yii\web\Controller;
use yii\filters\VerbFilter;
use yii\filters\AccessControl;
use yii\web\UploadedFile;
use yii\web\Cookie;
use common\models\User;
use yii\data\Pagination;
use yii\authclient\OpenId;
use  yii\web\Session;


//use yii\translatemanager\helpers\Language;

/**
 * User controller
 * - User relates functions
 * Database Tables used in this controller:
 * _user, _lists, _userinvites, _userinvitecredits,_countr
 */
class UsersController extends Controller {
	public $successUrl = 'index';
	/**
	 * @inheritdoc
	 * Yii Frame work default functions
	 */
	public function behaviors() {
		return [ 
				'access' => [ 
						'class' => AccessControl::className (),
						'only' => [ 
								'logout',
						],
						'rules' => [ 
								[ 
										'actions' => [ 
												'signup' 
										],
										'allow' => true,
										'roles' => [ 
												'?' 
										] 
								],
								[ 
										'actions' => [ 
												'auth' 
										],
										'allow' => true,
										'roles' => [ 
												'@' 
										] 
								],
								[ 
										'actions' => [ 
												'logout' 
										],
										'allow' => true,
										'roles' => [ 
												'@' 
										] 
								] 
						] 
				]/* ,
				'verbs' => [ 
						'class' => VerbFilter::className (),
						'actions' => [ 
								'logout' => [ 
										'post' 
								] 
						] 
				]  */
		];
	}


	
	public function beforeAction($action) {
		$this->enableCsrfValidation = false; 
		if(isset($_COOKIE['email']))
		{
			$model = new SignupForm ();
			$email = base64_decode($_COOKIE['email']); 
			$userdata = $model->findByEmail ( $email );	 		
			Yii::$app->user->login ( $userdata );
		}
		if (!(Yii::$app->user->isGuest)) {
         $loguserid = \Yii::$app->user->identity->id;
         $logUserDetails = User::find()->where(['id' => $loguserid])->One();
		 if(isset($logUserDetails->userstatus)) {
             if($logUserDetails->userstatus == 0 || $logUserDetails->userstatus == 4) {
                 Yii::$app->user->logout(); 
                 setcookie ("email", '');
                 setcookie ("user_id", '');
				 if($logUserDetails->userstatus == 4)
                 	Yii::$app->session->setFlash ( 'error', 'Your account was successfully deleted. Please contact admin' );
				 if($logUserDetails->userstatus == 0)
				 	Yii::$app->session->setFlash ( 'error', 'Your account was blocked. Please contact admin' );
                 return $this->redirect(['/']);  
             }
         } else {
             return $this->redirect(['/']); 
         }  
     	}   
		return parent::beforeAction($action);
	}	
	
	/**
	 * @inheritdoc
	 * Yii Frame work default functions
	 */
	public function actions() {
		return [ 
				'error' => [ 
						'class' => 'yii\web\ErrorAction' 
				],
				'captcha' => [ 
						'class' => 'yii\captcha\CaptchaAction',
						'fixedVerifyCode' => YII_ENV_TEST ? 'testme' : null 
				],
				'auth' => [ 
						'class' => 'yii\authclient\AuthAction',
						'successCallback' => [ 
								$this,
								'successCallback' 
						] 
				],
				'upload' => [ 
						'class' => 'yii\xupload\actions\php\XUploadAction',
						'path' => \Yii::$app->getBasePath () . DIRECTORY_SEPARATOR . 'albums' . DIRECTORY_SEPARATOR . 'images',
						'publicPath' => \Yii::$app->getHomeUrl () . DIRECTORY_SEPARATOR . 'albums' . DIRECTORY_SEPARATOR . 'images',
						'subfolderVar' => "parent_id" 
				] 
		];
	}
	public function actionCreate() {
		$model = new SignupForm ();
		$model = new \yii\xupload\models\XUploadForm ();
		$model->profile_id = '000'; // vk todo testing
		return $this->render ( 'create', [ 
				'model' => $model 
		] );
	}
	
	/**
	 * CallBack Functions for Social Logins
	 *
	 * @param unknown $client        	
	 */
	public function successCallback($client) {
		$model = new SignupForm ();
		$attributes = $client->getUserAttributes ();
		// user login or signup comes here
	//die(print_r($attributes));
	if(isset($attributes['email']) && $attributes['email']!="")
	{
		$email = $attributes['email'];
	}
	else if(isset($attributes['emails'][0]['value']))
	{
		$email = $attributes['emails'][0]['value'];
	}
	else
	{
		Yii::$app->getSession ()->setFlash ( 'success', 'Can not get email address' );
		//return $this->goHome ();
		$email = "";
	}
	if($email!="")
	{
			
			$user = \common\models\User::find ()->where ( [ 
					'email' => $email
			] )->one ();
			if (! empty ( $user )) {
				Yii::$app->user->login ( $user );
			} else {
				// Save session attribute user from FB
				$session = Yii::$app->session;
				$session ['attributes'] = $attributes;
				if(isset($attributes['name']) && !is_array($attributes['name']) && !empty($attributes['name']))
				$model->firstname = $attributes['name'];
				else
				$model->firstname = $attributes ['displayName'];
				$model->email = $email;
				$model->facebookid = $attributes ['id'];
				$model->emailverify = 1;	 
				$model->signup ();
				$link = Yii::$app->urlManager->createAbsoluteUrl ( '/verify/' . base64_encode ( $email ) );

				$models = $model->findByEmail ( $email );
				$imagelink = "https://graph.facebook.com/" . $attributes ['id'] . "/picture?width=150&height=150";
				$header_response = get_headers($imagelink, 1);
				if ( strpos( $header_response[0], "404" ) !== false )
				{

				} 
				else 
				{
					$filename = time().rand(0, 9);
					$newname = $models->id.'_'.$filename.'.'."jpg";
					$path = realpath ( Yii::$app->basePath . "/web/albums/images/users/" ) . "/";
					$contents=file_get_contents($imagelink);
					if($contents==false)
					{
						$ch = curl_init($imagelink);
						$fp = fopen($path.$newname, 'wb');
						curl_setopt($ch, CURLOPT_FILE, $fp);
						curl_setopt($ch, CURLOPT_HEADER, 0);
						curl_exec($ch);
						curl_close($ch);
						fclose($fp);						
					}
					else
					{
						file_put_contents($path.$newname,$contents);
					}
					$models->profile_image = $newname;
					$models->save(false);
				}

				// redirect to form signup, variabel global set to successUrl
				// $this->successUrl = \yii\helpers\Url::to(['signup']);
				$sitesetting = Sitesettings::find()->where(['id'=>'1'])->one();
				$siteName = $sitesetting->sitename;
				if($sitesetting->welcomeemail=="yes")
				{
					Yii::$app->mailer->compose ( 'welcome', [
							'name' => $model->firstname,
							'link' => $link,
							'siteName' => $siteName,
							'sitesetting' => $sitesetting,						
							] )->setFrom ( $sitesetting->noreplyemail )->setTo ( $email )->setSubject ( 'Welcome mail' )->send ();
				}
				Yii::$app->mailer->compose ( 'verifyemail', [
						'name' => $model->firstname,
						'link' => $link,
						'siteName' => $siteName,
						'sitesetting' => $sitesetting,					
						] )->setFrom ( $sitesetting->noreplyemail )->setTo ( $email )->setSubject ( 'Verify Email' )->send ();			
				Yii::$app->user->login ( $models );
			}
		}
	}
	


	public function actionSocial($details) { 
		if($details == "error") {  
				Yii::$app->getSession ()->setFlash ( 'success', 'Error Occur, Try again later');
				return $this->goHome (); 
		} else if($details!="") { 
			$details = json_decode(base64_decode($details),true);

			if(count($details) >= 7 && isset($details['type']) && isset($details['id'])) {  

				$email = (isset($details['email']) && $details['email']!="") ? $details['email']:"";

				if($details['type'] == "google" && $email!="") { 
					$user = \common\models\User::find()->where(['email' => $email])->one();
					if ($user != null) { 
						if($user->userstatus == 4){
							Yii::$app->getSession ()->setFlash ( 'success', 'Your account has been deleted, Kindly contact admin to restore the account.' );
							return $this->goHome ();die;
						}					
						Yii::$app->user->login( $user );
						return $this->goHome(); 
					} 
					else {
						$model = new SignupForm ();

						if(isset($details['first_name']) && !empty($details['first_name']))
							$model->firstname =  str_replace(' ', '', $details['first_name']); 
						else
							$model->firstname = str_replace(' ', '', $details['name']['givenName']);

						$model->email = trim($email);
						$model->googleid = $details['id'];
						$model->emailverify = 1;

						$model->signup ();
						$link = Yii::$app->urlManager->createAbsoluteUrl('/verify/'.base64_encode($email));

						$models = $model->findByEmail($email);
						$imagelink = $details['image']['url'];
						$header_response = get_headers($imagelink, 1);
						if(strpos( $header_response[0], "404" ) !== false )
						{	}  
						else 
						{
							$filename = time().rand(0, 9);
							$newname = $models->id.'_'.$filename.'.'."jpg";
							$path = realpath ( Yii::$app->basePath . "/web/albums/images/users/" ) . "/";
							$contents=file_get_contents($imagelink);
							if($contents==false)
							{
								$ch = curl_init($imagelink);
								$fp = fopen($path.$newname, 'wb');
								curl_setopt($ch, CURLOPT_FILE, $fp);
								curl_setopt($ch, CURLOPT_HEADER, 0);
								curl_exec($ch);
								curl_close($ch);
								fclose($fp);						
							} else { 
								file_put_contents($path.$newname,$contents);
							}
							$models->profile_image = $newname;
							$models->save(false);
						}

						$sitesetting = Sitesettings::find()->where(['id'=>'1'])->one();
						$siteName = $sitesetting->sitename;
						if($sitesetting->welcomeemail=="yes")
						{
							Yii::$app->mailer->compose ( 'welcome', [
									'name' => $model->firstname,
									'link' => $link,
									'siteName' => $siteName,
									'sitesetting' => $sitesetting,						
									] )->setFrom ( $sitesetting->noreplyemail )->setTo ( $email )->setSubject ( 'Welcome mail' )->send ();
						}
						Yii::$app->mailer->compose ( 'verifyemail', [
								'name' => $model->firstname,
								'link' => $link,
								'siteName' => $siteName,
								'sitesetting' => $sitesetting,					
								] )->setFrom ( $sitesetting->noreplyemail )->setTo ( $email )->setSubject ( 'Verify Email' )->send ();	 		 
						Yii::$app->user->login($models); 	
						return $this->goHome(); 
					} 
				} else {
					Yii::$app->getSession ()->setFlash ( 'success', 'Page not found');
					return $this->goHome ();
				}
			} else { 
				Yii::$app->getSession ()->setFlash ( 'success', 'Page not found');
				return $this->goHome ();
			}
		} else {
			Yii::$app->getSession ()->setFlash ( 'success', 'Page not found');
			return $this->goHome ();
		}
	}
	/**
	 * This function Display the Home Page & Used for User Registration
	 * On successful registration sends email and redirects to home page
	 */
	public function actionIndex() {

		if (!(Yii::$app->user->isGuest)) { 
	    	$loguserid = \Yii::$app->user->identity->id;
	    	$logUserDetails = User::find()->where(['id' => $loguserid])->One(); 
	    	if($logUserDetails->userstatus != '1') {  
        		Yii::$app->getSession ()->setFlash ( 'success', 'Sorry user access blocked by admin.' );
        		Yii::$app->user->logout ();
        		return $this->goHome ();     
      	}
    	}

		$homesettings = Homepagesettings::find()->where(['id'=>'1'])->one();
		$buttonsliders = Buttonsliders::find('all')->all();
		$textsliders = Textsliders::find('all')->all();
		$sitesettings = Sitesettings::find()->where(['id'=>'1'])->one();

		//Get Most reservation listings.
		$Reservations = new Reservations();
		$Listing = new Listing();
		$traverselist = $Reservations->getMaxreservations();
		// echo '<pre>'; print_r($traverselist); die;
		$featuredlist = $Listing->getListing(); 
		
		$this->layout = "home";
		$model = new SignupForm ( [ 
				'scenario' => 'register' 
		] );
		
		$models = new PasswordResetRequestForm ();
		
		$listings = Listing::find()->where(['liststatus'=>1])
		->andWhere([
					'or', 
				   ['>','nightlyprice','0'],
				   ['>','hourlyprice','0']  
				]) ->orderBy('id desc')->all();  
		
		//$homecountries = Homecountries::find()->limit('7')->all();
		$Homecountries =new Homecountries();
		$Roomtype = new Roomtype();
		$homecountries = $Homecountries->getHomecountries();
		$getRoomtype = $Roomtype->findallidentity();

		//To add rating..
		$c=0;
		foreach($traverselist as $getrating)
		{			
			$Reviews = new Reviews();
			$getreviews = $Reviews->getRatingbylisting($getrating['listid']);
			$traverselist[$c]['ratings'] = $getreviews['rating'];
			$traverselist[$c]['n_rating'] =  $getreviews['n_rating'];
			$getReservePhotos = Photos::find()->where(['listid'=>$getrating['listid']])->orderBy('id asc')->one();
			if(isset($getReservePhotos) > 0)
				$traverselist[$c]['image_name'] = $getReservePhotos['image_name'];
			$c++;
		}
		
		$listingproperties = Listingproperties::find()->where(['id'=>'1'])->one();
		
		if (Yii::$app->user->isGuest) {
			$userid = "";
			$recentview = "";
		}
		else if (! Yii::$app->user->isGuest) {
			$userid = \Yii::$app->user->identity->id;
			$userdata = User::find()->where(['id'=>$userid])->one();
			if(!empty($userdata->listids) && $userdata->listids != ""){
				$listids = $userdata->listids;
				$list_ids = json_decode($listids, true);
				foreach($list_ids as $list){
					$listid[] = $list;
				}	
				for($i=0;$i<4;$i++)
				{
					if(isset($listid[$i]))
					$recentlistid[] = $listid[$i];
				}
				
				foreach($recentlistid as $key => $list_id){
					$recentview[] = Listing::find()->where(['id'=>$list_id, 'liststatus'=>1])->one(); 
				}

				if(empty($recentview))
				{
					$recentview = "";
				}
			}
			else
			{
				$recentview = "";
			}
		}

		//echo '<pre>'; print_r($recentview); exit;
		
		if(isset($_SESSION['currency_code']) && isset($_SESSION['currency_symbol'])) {
			$_SESSION['currency_code'] = trim($_SESSION['currency_code']);
			$_SESSION['currency_symbol'] = trim($_SESSION['currency_symbol']);
		} else {
			$currencydata = Currency::find()->where(['defaultcurrency'=>1])->one();
			if(count(array($currencydata))) {
				$_SESSION['currency_code'] = $currencydata->currencycode; 
				$_SESSION['currency_symbol'] = $currencydata->currencysymbol; 				
			}
			else {
				$currencydata = Currency::find()->where(['price'>0])->one();
				$_SESSION['currency_code'] = $currencydata->currencycode; 
				$_SESSION['currency_symbol'] = $currencydata->currencysymbol;  
			}
		}

		return $this->render ( 'index', [ 
				'model' => $model,
				'models' => $models,
				'homesettings' => $homesettings,
				'buttonsliders' => $buttonsliders,
				'textsliders' => $textsliders,
				'sitesettings' => $sitesettings,
				'roomtypes' => $getRoomtype,
				'featuredlist' => $featuredlist,
				'traverselistings'=>$traverselist,
				'listings' => $listings,
				'listingproperties' => $listingproperties,
				'recentview' => $recentview,
				'homecountries' => $homecountries
		] );
	}
	
	/**
	 * Function for Login including validations
	 *
	 * @return mixed
	 */
	public function actionLogin() {
		Yii::$app->controller->enableCsrfValidation = false;
		if (! Yii::$app->user->isGuest) {
			//return $this->goHome ();
		}
		Yii::$app->controller->enableCsrfValidation = false;
		
		$model = new SignupForm ([ 
				'scenario' => 'register' 
		]);
		
		if (!(Yii::$app->user->isGuest)) {
	    	$loguserid = \Yii::$app->user->identity->id;
	    	$logUserDetails = User::find()->where([
            		'id' => $loguserid
            ])->One();
    	}
    	$userEmail = Yii::$app->request->post();
    	$data = "";
    	if(count($userEmail) > 0) {
	    	$userEmail = $userEmail['SignupForm']['email'];
	    	$data = $model->findByEmail ( $userEmail );
	   }

		if ($model->load ( Yii::$app->request->post () ) && $model->login ()) {
			
			if(isset($_SESSION['RedirectCategory']) && isset($_SESSION['RedirectUrl'])) {
	        if(trim($_SESSION['RedirectCategory']) == "Listing") {
	        		$randno = $_SESSION['RedirectUrl'];
	        		$_SESSION['RedirectCategory'] = "";
	        		$_SESSION['RedirectUrl'] = "";  
	            return $this->redirect(['/user/listing/view/'.$randno]);
	        }
	      }
			return $this->goHome (); 		
		}  else if(!empty($data)) {
			if($data->userstatus == 0){
				Yii::$app->getSession ()->setFlash ( 'success', 'Your account was blocked. Please contact admin' );
				return $this->goHome (); 

			} else if($data->userstatus == 2){
				Yii::$app->getSession ()->setFlash ( 'success', 'Moderator cannot use this login' );
				return $this->goHome ();
			} elseif($data->userstatus == 4){
				Yii::$app->getSession ()->setFlash ( 'success', 'Your account has been deleted, Kindly contact admin to restore the account.' );
				return $this->goHome ();
			}
		} elseif(empty($data)) {
			$this->redirect ('signin');  
		} else {  
			return $this->goHome ();
		}
		
	}
	
	/*
	Displays login page
	*/
	public function actionSignin()
	{
		Yii::$app->controller->enableCsrfValidation = false;

		if (!(Yii::$app->user->isGuest)) {
	    	$loguserid = \Yii::$app->user->identity->id;
	    	$logUserDetails = User::find()->where([
            		'id' => $loguserid
            ])->One();
			return $this->goHome (); 
    	}


		$model = new SignupForm ( [
				'scenario' => 'register'
				] );
		$sitesetting = Sitesettings::find()->where(['id'=>'1'])->one();
		$models = new PasswordResetRequestForm ();		
		return $this->render('login',[
				'model' => $model,
				'models' => $models,
				'sitesetting' => $sitesetting
				]);		
	}
	
	/**
	 * Logout the current user.
	 *
	 * @return mixed
	 */
	public function actionLogout() {
		
		$lang = $_SESSION['language'];
		Yii::$app->user->logout ();
		setcookie ("email", '');
		setcookie ("user_id", '');
		//setcookie ("password", ''); 

		Yii::$app->session->setFlash ( 'success', Yii::t('app','Thanks, Welcome Back.') );
		$_SESSION['language'] = $lang;
		return $this->goHome ();
	}
	/**
	 * Displays contact page.
	 *
	 * @return mixed
	 */
	public function actionContact() {
		$model = new ContactForm ();
		if ($model->load ( Yii::$app->request->post () ) && $model->validate ()) {
			if ($model->sendEmail ( Yii::$app->params ['adminEmail'] )) {
				Yii::$app->session->setFlash ( 'success', 'Thank you for contacting us. We will respond to you as soon as possible.' );
			} else {
				Yii::$app->session->setFlash ( 'error', 'There was an error sending email.' );
			}
			
			return $this->refresh ();
		} else {
			return $this->render ( 'contact', [ 
					'model' => $model 
			] );
		}
	}
	
	/**
	 * Displays about page.
	 *
	 * @return mixed
	 */
	public function actionAbout() {
		return $this->render ( 'about' );
	}
	
	/**
	 * Signs user up.
	 *
	 * @return mixed
	 */
	public function actionSignup() {
		Yii::$app->controller->enableCsrfValidation = false;
		if (!Yii::$app->user->isGuest) {
			Yii::$app->getSession ()->setFlash ( 'success', 'Already Logged in. Logout to Signup' );
			return $this->goHome();  		
		}

		$model = new SignupForm([ 
				'scenario' => 'register' 
		]);

		$sitesetting = Sitesettings::find()->where(['id'=>'1'])->one();
		
		if(isset($_GET['referrer']) && $_GET['referrer']!="") {
			$referrer = $_GET ['referrer'];
			$referrer = base64_decode($referrer);
			$referrer_id = explode("-",$referrer);
			$referrerid = $referrer_id [0];
			
			if($referrerid  > 0) {
				$model->referrer_id = $referrerid;
				return $this->render ( 'signup', [ 
						'model' => $model,
						'reff_id' => $referrerid,
						'sitesetting' => $sitesetting
				]);
			} else {
				$this->redirect ('register'); 
			}
		} else if (count(Yii::$app->request->post()) > 0) {
			if($model->load(Yii::$app->request->post())) {

				if($user = $model->signup()) {
					$email = $model->email;
					$referrermodel = $model->findByEmail ( $email );
					$link = Yii::$app->urlManager->createAbsoluteUrl ( '/verify/' . base64_encode ( $email ) );
					$userreferrer = $referrermodel->referrer_id;
					$userreferrer = json_decode ($userreferrer, true); 
					
					if(!empty($userreferrer))
						$referid = $userreferrer['reffid']; 

					if (isset($referid)) {
						$userinvitemodel = Userinvites::find ()->where ( [ 
								'userid' => $referid,
								'invitedemail' => $email 
						])->One();
						if($userinvitemodel != null) {
							$userinvitemodel->id = $userinvitemodel->id;
							$userinvitemodel->status = "Joined";
							$userinvitemodel->save(); 
						}  
					}

					$sitesetting = Sitesettings::find()->where(['id'=>'1'])->one();
					$siteName = $sitesetting->sitename;
					if($sitesetting->welcomeemail=="yes") {
						Yii::$app->mailer->compose ( 'welcome', [ 
							'name' => $model->firstname,
							'link' => $link,
							'siteName' => $siteName,
							'sitesetting' => $sitesetting,
						] )->setFrom ( $sitesetting->noreplyemail )->setTo ( $email )->setSubject ( 'Welcome mail' )->send ();
					}
					Yii::$app->mailer->compose ( 'verifyemail', [
							'name' => $model->firstname,
							'link' => $link,
							'siteName' => $siteName,
							'sitesetting' => $sitesetting,
							] )->setFrom ( $sitesetting->noreplyemail )->setTo ( $email )->setSubject ( 'Verify Email' )->send ();

					// echo "<pre>"; print_r($user); die;
					if (Yii::$app->user->login($user)) {
						$session = Yii::$app->session;
						$session->open ();
						$session ['welcomepop'] = "1";
						$_SESSION['welcomepop'] = "1";
						$redirecturl = Yii::$app->urlManager->createAbsoluteUrl ( '/');
						return $this->goHome();
					}
				}  
			}
		} else {
			$this->redirect ('register');
		}
		
		
	}
	
	/*
	Displays sign up page
	*/
	public function actionRegister()
	{
		if (!(Yii::$app->user->isGuest)) {
			return $this->goHome (); 
    	} else {
			$model = new SignupForm ( [
					'scenario' => 'register'
					] );
				$sitesetting = Sitesettings::find()->where(['id'=>'1'])->one();
			return $this->render ( 'signup', [
			'model' => $model,
			'sitesetting' => $sitesetting
			]);	 
		}
	}
	
	/**
	 * Function to let the user to reset his/her passsword.
	 *
	 * It will send the link to reset the password through email.
	 * If you click on the link you can create a new password for your account.
	 */
	public function actionForgotpassword() {
		$model = new SignupForm ();
		$sitesetting = Sitesettings::find()->where(['id'=>'1'])->one();
		$models = new PasswordResetRequestForm ( [ 
				'scenario' => 'passwordrequest' 
		] );
		if ($models->load ( Yii::$app->request->post () ) && $models->validate ()) {
			$email = $models->email;
			$createdDate = time ();
			$userdata = $model->findByEmail ( $email );

			if($userdata->userstatus == '0'){
				Yii::$app->getSession ()->setFlash ( 'success', 'Your account was blocked. Please contact admin' );
				return $this->goHome (); 
			} else if($userdata->userstatus == '2'){
				Yii::$app->getSession ()->setFlash ( 'success', 'Moderator cannot use this option' );
				return $this->goHome ();
			} elseif($userdata->userstatus == '4'){
				Yii::$app->getSession ()->setFlash ( 'success', 'Your account has been deleted, Kindly contact admin to restore the account.' );
				return $this->goHome ();
			}

			$userid = $userdata->id;
			$userdata->id = $userid;
			$userdata->verify_pass = '0';
			$userdata->verify_passcode = $createdDate;
			$sitesetting = Sitesettings::find()->where(['id'=>'1'])->one();
			$siteName = $sitesetting->sitename;
			$userdata->save ();
			
			$randomValue = rand ( 10000, 100000 );
			$resetPasswordData = base64_encode ( $userid . "-" . $createdDate . "-" . $randomValue );
			$link = Yii::$app->urlManager->createAbsoluteUrl ( '/resetpassword?resetLink=' . $resetPasswordData );
			Yii::$app->mailer->compose ( 'forgotpassword', [ 
					'name' => $models->firstname,
					'link' => $link,
					'siteName' => $siteName
			] )->setFrom ( $sitesetting->noreplyemail )->setTo ( $email )->setSubject ( 'Password reset mail' )->send ();
			Yii::$app->getSession ()->setFlash ( 'success', 'Mail sent to your mail id' );
			return $this->goHome ();			
		}
		Yii::$app->response->redirect ( array (
				'' 
		) );
	}
	
	/**
	 * Resets password.
	 *
	 * @param string $token        	
	 * @return mixed
	 * @throws BadRequestHttpException
	 */
	public function actionResetpassword() {
		Yii::$app->user->logout ();
		$model = new ResetPasswordForm ( [ 
				'scenario' => 'resetpass' 
		] );
		$signupmodel = new SignupForm ();
		if (isset ( $_GET ['resetLink'] ) && ! isset ( $_POST ['ResetPasswordForm'] ['password'] )) {
			$resetData = base64_decode ( $_GET ['resetLink'] );
			$resetData = explode ( '-', $resetData );
			$userId = $resetData [0];
			$createddate = $resetData [1];
			$resetPasswordModel = $signupmodel->findIdentity ( $userId ); // print_r($resetPasswordModel);
			if (! empty ( $resetPasswordModel ) && $resetPasswordModel->verify_pass != "1" && $resetPasswordModel->verify_passcode == $createddate) {
				return $this->render ( 'resetpassword', array (
						'model' => $model,
						'id' => $userId 
				) );
			} else {
				Yii::$app->session->setFlash ( 'success', 'Access denied!' ); 
				$this->redirect ( 'signin' );
			}
			// Yii::$app->session->setFlash ( 'success', 'New password was saved.' );
		} elseif (isset ( $_POST ['ResetPasswordForm'] ['password'] )) {
			$userId = $_POST ['ResetPasswordForm'] ['id'];
			$password = base64_encode ( $_POST ['ResetPasswordForm'] ['password'] );
			$resetPasswordModel = $signupmodel->findIdentity ( $userId );
			$verify_pass = $resetPasswordModel->verify_pass;
			$resetPasswordModel->password = $password;
			$resetPasswordModel->verify_pass = "1";
			if ($verify_pass != "1") {
				if ($resetPasswordModel->save ()) {
					Yii::$app->session->setFlash ( 'success', 'Password Reset Successfully' );
					$this->redirect ( 'signin' ); 
				} else {
					Yii::$app->session->setFlash ( 'success', 'Something went wrong' );
					$this->redirect ( 'signin' ); 
				}
			}
		} else {
			Yii::$app->session->setFlash ( 'success', 'Access denied!..' );
			return $this->goHome ();
		}

	}
	
	/**
	 * Function for displaying profile information
	 */

	public function actionDashboard()
{
    $model = new SignupForm();

    if (Yii::$app->user->isGuest) {
        return $this->goHome();
    }

    $userid = Yii::$app->user->identity->id;
    $userdata = $model->findIdentity($userid);

    if ($userdata->userstatus != '1') {
        Yii::$app->session->setFlash('success', 'Sorry user access blocked by admin.');
        Yii::$app->user->logout();
        return $this->goHome();
    }

    $sitesettings = Sitesettings::find()->where(['id' => '1'])->one();

    if (Yii::$app->request->isPost) {

        $path = Yii::getAlias('@frontend/web/albums/images/users/');
        if (!is_dir($path)) {
            mkdir($path, 0777, true);
        }

        // Get uploaded file directly (NO XUploadForm)
        $file = UploadedFile::getInstanceByName('file');

        if ($file !== null) {
            $allowed = ['jpg','jpeg','png'];
            $ext = strtolower($file->extension);

            if (in_array($ext, $allowed)) {
                $imgname = Yii::$app->mycomponent->productSlug($file->baseName);
                $filename = $userid . '_' . $imgname . '.' . $ext;

                if ($file->saveAs($path . $filename)) {
                    // Save filename in DB
                    $userdata->profile_image = $filename;
                    $userdata->save(false);
                }
            } else {
                Yii::$app->session->setFlash('error', 'Only JPG, JPEG, PNG files are allowed.');
            }
        }

        return $this->redirect(['dashboard']);
    }

    return $this->render('dashboard', [
        'model' => $model,
        'userdata' => $userdata,
        'sitesettings' => $sitesettings
    ]);
}
	// public function actionDashboard() {
		
	// 	$model = new SignupForm ();
	// 	if (Yii::$app->user->isGuest) {
	// 		return $this->goHome ();
	// 	} else if (! Yii::$app->user->isGuest) {
	// 		$userid = \Yii::$app->user->identity->id;
	// 		$userdata = $model->findIdentity ( $userid );
	//     	if($userdata->userstatus != '1') {   
    //     		Yii::$app->getSession ()->setFlash ( 'success', 'Sorry user access blocked by admin.' );
    //     		Yii::$app->user->logout ();
    //     		return $this->goHome ();     
    //   	}
	// 	}
	// 	$sitesettings = Sitesettings::find()->where(['id'=>'1'])->one();
	// 	$uploadmodel = new \yii\xupload\models\XUploadForm ();
	// 	if (Yii::$app->request->post ()) {
	// 		$path = realpath ( Yii::$app->basePath . "/web/albums/images/users/" ) . "/";
	// 		$model = new \yii\xupload\models\XUploadForm ();
	// 		$model->file = UploadedFile::getInstance ( $model, 'file' );
			
	// 		if ($model->file !== null) {
	// 			// Grab some data
	// 			/*
	// 			 * $model->mime_type = $model->file->getType( );
	// 			 * $model->size = $model->file->getSize( );
	// 			 */
	// 			$model->name = $model->file->getBaseName ();
	// 			$userid = \Yii::$app->user->identity->id;
	// 			$imgname = Yii::$app->mycomponent->productSlug ( $model->name );
	// 			$filename = $userid . "_" . $imgname;
	// 			$filename .= "." . $model->file->getExtension ();
	// 			// echo $path.$filename;die;
	// 			if ($model->validate ()) {
	// 				// Move our file to our temporary dir
	// 				$model->file->saveAs ( $path . $filename );
	// 				// chmod ( $path . $filename, 0777 );
	// 				$userdata->id = $userid;
	// 				$userdata->profile_image = $filename;
	// 				$userdata->save ();
	// 			}
	// 		}
		
	// 		return $this->redirect ( array('dashboard', [
	// 			'model' => $model,
	// 			'userdata' => $userdata,
	// 			// 'uploadmodel' => $uploadmodel
	// 	] ));			
	// 	}
		
	// 	return $this->render ( 'dashboard', [ 
	// 			'model' => $model,
	// 			'userdata' => $userdata,
	// 			// 'uploadmodel' => $uploadmodel,
	// 			'sitesettings' => $sitesettings
	// 	] );
	// }
	
	/**
	 * Validates if the email is already exists or not while signup
	 */
	public function actionValidatedata() {
		$model = new SignupForm ();
		$email = $_POST ['email'];
		$models = $model->findByEmail ( $email );
		if ($email == "") {
			echo "empty";
		} else if (count (array( $models ['email'] )) > 0) {
			echo "exists";
		} else {
			echo "success";
		}
	}
	
	/**
	 * Validate the login form.
	 * Validate the email and password
	 */
	public function actionLoginvalidate() {
		$model = new SignupForm ();
		$email = $_POST ['email'];
		$password = $_POST ['password'];
		$models = $model->findByEmail ( $email );
		
		if ($email == "") {
			echo "empty";
		} elseif ( $models != null) {
			if($models['id'] == "1" ){
				echo "error";
			} else {
				$userpassword = base64_decode ( $models->password );
				if ($password != $userpassword) {
					echo "passerr";
				} elseif ($password == $userpassword)
					echo "success";
			}
		} else {
			echo "error";
		}
	}
	/**
	 * Validate email on forgot password
	 */
	public function actionValidateforgot() {
		$model = new PasswordResetRequestForm ();
		$signupmodel = new SignupForm ();
		$email = $_POST ['email'];
		$models = $signupmodel->findByEmail ( $email );
		if ($email == "") {
			echo "empty";
		} else if (count ( $models ['email'] ) > 0) {
			echo "success";
		} else {
			echo "error";
		}
	}
	
	/**
	 * Function to let the user to verify their email address for booking
	 *
	 * @param verifylink $details        	
	 */
	public function actionVerify($details) {
		$model = new SignupForm ();
		$email = base64_decode ( $details );
		$models = $model->findByEmail ( $email );
		$table = $model->tableName ();
		if ($details != "" && $models->emailverify != "1") {
			
			Yii::$app->db->createCommand ( 'UPDATE ' . $table . ' set emailverify="1" WHERE email="' . $email . '"' )->execute ();
			Yii::$app->getSession ()->setFlash ( 'success', 'Email verified' );
		} else if ($models->emailverify == "1") {
			Yii::$app->getSession ()->setFlash ( 'success', 'Email already verified' );
		}
		
		Yii::$app->response->redirect ( array (
				'/dashboard' 
		) );
	}
	
	/**
	 * Function to let the user to edit their profile and to save their profile information.
	 */
	public function actionEditprofile() {
		$model = new Profile ();

		$country = new Country ();
		$shippingmodel = new Shippingaddress ();
		$this->layout = "main";
		if (Yii::$app->user->isGuest) {
			return $this->goHome ();
		} else if (! Yii::$app->user->isGuest) {
			
			$userid = \Yii::$app->user->identity->id;
			$userdata = $model->findIdentity ( $userid );
			$shipping = Shippingaddress::find ()->where ( [ 
					'userid' => $userid 
			] )->One ();

	    	if($userdata->userstatus != '1') {   
        		Yii::$app->getSession ()->setFlash ( 'success', 'Sorry user access blocked by admin.' );
        		Yii::$app->user->logout ();
        		return $this->goHome ();     
      	}
		}

		$timezones = Timezone::find()->all();
		$countries = Country::find ()->all ();
		$languages = Languages::find()->all();
		$sitesettings = Sitesettings::find()->where(['id'=>'1'])->one();
		
		if (Yii::$app->request->post ()) {
			$model->load ( $_POST );
			$userid = \Yii::$app->user->identity->id;
			$profilemodel = $model->findIdentity ( $userid );
			$profilemodel->id = $userid;
			$profilemodel->firstname = $_POST ['SignupForm'] ['firstname'];
			$profilemodel->lastname = $_POST ['SignupForm'] ['lastname'];
			$profilemodel->gender = $_POST ['SignupForm'] ['gender'];
			$profilemodel->firstname = $_POST ['SignupForm'] ['firstname'];
			$profilemodel->birthday = $_POST ['SignupForm'] ['month'] . "-" . $_POST ['SignupForm'] ['day'] . "-" . $_POST ['SignupForm'] ['year'];
			//$profilemodel->phoneno = $_POST ['SignupForm'] ['phoneno'];
			$profilemodel->state = $_POST ['SignupForm'] ['state'];
			$profilemodel->about = $_POST ['SignupForm'] ['about'];
			//$profilemodel->paypalid = $_POST ['SignupForm'] ['paypalid'];
			
			if(isset($_POST ['SignupForm'] ['school'])){
			$profilemodel->school = $_POST ['SignupForm'] ['school'];
			}
			if(isset($_POST ['SignupForm'] ['work'])){
			$profilemodel->work = $_POST ['SignupForm'] ['work'];
			}
			if(isset($_POST ['SignupForm'] ['timezone'])){
			$profilemodel->timezone = $_POST ['SignupForm'] ['timezone'];
			}
			if(isset($_POST ['SignupForm'] ['emergencyno'])){
			$profilemodel->emergencyno = $_POST ['SignupForm'] ['emergencyno'];
			}
			if(isset($_POST ['SignupForm'] ['emergencyname'])){
			$profilemodel->emergencyname = $_POST ['SignupForm'] ['emergencyname'];
			}
			if(isset($_POST ['SignupForm'] ['emergencyemail'])){
			$profilemodel->emergencyemail = $_POST ['SignupForm'] ['emergencyemail'];
			}
			if(isset($_POST ['SignupForm'] ['emergencyrelation'])){
			$profilemodel->emergencyrelation = $_POST ['SignupForm'] ['emergencyrelation'];
			}
			$profilemodel->firstname = $_POST ['SignupForm'] ['firstname'];


			if(isset($_POST['SignupForm']['userlanguages']) && !empty($_POST['SignupForm']['userlanguages']))
			{
				$langaugearr = $_POST['SignupForm']['userlanguages'];
				for($i=0;$i<count(array($langaugearr));$i++)
				{
					$userlanguages[$i]['name'] = $langaugearr[$i];
				}
				$profilemodel->language = json_encode($userlanguages);
			}else{
				$profilemodel->language = '';
			}

			$profilemodel->save ();
			// print_r($profilemodel);die;
			if (isset($shipping) && !empty ( $shipping )) {
				$shipping->id = $shipping->id;
			}
			else 
			

				$shipping = new Shippingaddress();
				$shipping->userid = $userid;
				$shipping->country = $_POST ['Shippingaddress'] ['country'];
				$shipping->address1 = $_POST ['Shippingaddress'] ['address1'];
				$shipping->address2 = $_POST ['Shippingaddress'] ['address2'];
				$shipping->city = $_POST ['Shippingaddress'] ['city'];
				$shipping->state = $_POST ['Shippingaddress'] ['state'];
				$shipping->zipcode = $_POST ['Shippingaddress'] ['zipcode'];
				$shipping->save ();
				Yii::$app->getSession ()->setFlash ( 'success', 'Profile Updated' );
				$username = base64_encode($userid."-".rand(0,999));
				//print_R($model);exit;
				return Yii::$app->response->redirect(array('profile/'.$username));
			
		}
		if(empty($shipping))
		{
			$shipping = new Shippingaddress();
		}
		return $this->render ( 'editprofile', [ 
				'model' => $model,
				'userdata' => $userdata,
				'countries' => $countries,
				'shipping' => $shipping,
				'timezones' => $timezones,
				'languages' => $languages,
				'site_settings' => $sitesettings
		] );
	}
	/**
	 * Function to view the user profile
	 *
	 * @param string $id        	
	 */
	public function actionProfile($details) {
		$model = new SignupForm ();
		$this->layout = "main";
		if (! empty ( $details )) {
			$userdata = base64_decode ( $details );
			$userids = explode ( "-", $userdata );
			$userid = $userids [0];
		}
		/*if (Yii::$app->user->isGuest) {
			return $this->goHome ();
		} else*/
		if (!Yii::$app->user->isGuest) {
	    	$loguserid = \Yii::$app->user->identity->id;
	    	$logUserDetails = User::find()->where(['id' => $loguserid])->One(); 
	    	if($logUserDetails->userstatus != '1') {  
        		Yii::$app->getSession ()->setFlash ( 'success', 'Sorry user access blocked by admin.' );
        		Yii::$app->user->logout ();
        		return $this->goHome ();     
      	} 
		}
		else
			$loguserid = "";
		$userdata = $model->findIdentity ( $userid );
		$listdatas = Listing::find()->where(['userid'=>$userid, 'liststatus'=>'1'])->all();


		$getReports = Profilereports::find()->where(['report_type'=>'profile'])->all();

		if(!empty($listdatas))
		{
		foreach($listdatas as $lists)
		{
			$listids[] = $lists['id'];
		}
		}
		else
		{
			$listids[] = "";
		}
		 

		$reportcount = Userreports::find()->where(['userid'=>$loguserid, 'reporterid'=>$userid])->one();


		$query = Reviews::find()->where(['listid'=>$listids]);
    	$countQuery = clone $query;
    	$pages = new Pagination(['totalCount' => $countQuery->count(),'pageSize'=>20]);
    	$reviews = $query->orderBy('id desc')->all(); 
		if(!empty($userdata))
		{	
			if($userdata->userstatus=="1")
			{
				return $this->render ( 'profile', [ 
						'userdata' => $userdata,
						'loguserid' => $loguserid,
						'listdatas' => $listdatas,
						'reportcount'=>$reportcount,
						'getReports' => $getReports,
						'reviews' => $reviews,
						'pages' => $pages
				] );
			}
			else
			{
				Yii::$app->getSession ()->setFlash ( 'success', 'User blocked' );
				Yii::$app->response->redirect ( array (
						'' 
				) );
			}
		}
		else
		{
			Yii::$app->getSession ()->setFlash ( 'success', 'User not found' );
			Yii::$app->response->redirect ( array (
					'' 
			) );
		}
	}

	public function actionAddreport()
	{
		$model = new Userreports();
		if (Yii::$app->user->isGuest) {
		
			$key = 'false';
			return $key;
		}else{
			$model->reportid = $_POST['reportid'];
			$model->userid = Yii::$app->user->identity->id;
			$model->reporterid = $_POST['reporterid'];
			$model->createdtime = date('Y-m-d h:i:s');
			$model->report_type = 'profile';
			$model->report_status = 1;
			$model->status = 1;
			$model->save(false);
			$key = 'true';
			return $key;
		}
		
	}

	public function actionAddlistingreport()
	{
		$model = new Userreports();
		if (Yii::$app->user->isGuest) {
		
			$key = 'false';
			return $key;
		}else{
			$model->reportid = $_POST['reportid'];
			$model->userid = Yii::$app->user->identity->id;
			$model->listid = $_POST['listid'];
			$model->createdtime = date('Y-m-d h:i:s');
			$model->report_status = 1;
			$model->report_type = 'list';
			$model->status = 1;
			$model->save(false);
			$key = 'true';
			return $key;
		}
		
	}

	/*
		Delete Reports
	*/
	public function actionDeletereport()
	{
		$id = trim($_POST['profilereportid']);
		$model = Userreports::find()->where(['id'=>$id])->one();
      $model = $model->delete();
		return 'true';
	}
	
	/**
	 * Page to display the veritication information for the user
	 */
	public function actionTrust() {
		$model = new SignupForm ();
		$country = new Country ();
		if (Yii::$app->user->isGuest) {
			return $this->goHome ();
		} else{
			$userid = Yii::$app->user->identity->id;
			$userdata = $model->findIdentity ( $userid );
			$countries = Country::find ()->all ();
			return $this->render ( 'trust', [ 
					'userdata' => $userdata,
					'countries' => $countries 
			] );
			}
	}
	
	/**
	 * Function to the let the user to change their password
	 */
	public function actionChangepassword() {
		$model = new ResetPasswordForm ();
		$model->scenario = 'changepass';
		$signupmodel = new SignupForm ();
		if (Yii::$app->user->isGuest) {
			return $this->goHome ();
		} else {
			$userid = Yii::$app->user->identity->id;
			$userdata = $signupmodel->findIdentity ( $userid );
			if (Yii::$app->request->post ()) {
				if($userid > 2) {
 					$userdata->id = $userid;
					$userdata->password = base64_encode ( $_POST ['newpassword'] );
					$userdata->save ();
					Yii::$app->getSession ()->setFlash ( 'success', 'Password changed successfully' );
				} else {
					Yii::$app->getSession ()->setFlash ( 'success', "This option won't work for Demo account only" ); 
				}
			}
			return $this->render ( 'changepassword', [ 
					'userdata' => $userdata,
					'model' => $model 
			] );
		}
	}
	
	/**
	 * Display the invite friends page
	 */
	public function actionInvitefriends() {
		$sitesettings = Sitesettings::find()->where(['id'=>'1'])->one();
		$model = new SignupForm ();
		if (Yii::$app->user->isGuest) {
			return $this->goHome ();
		} else {
			$userid = Yii::$app->user->identity->id;
			$userdata = $model->findIdentity ( $userid );
			return $this->render ( 'invitefriends', [ 
					'userdata' => $userdata,
					'sitesettings' => $sitesettings
			] );
		}
	}
	
	/**
	 * Function to invite the friends by sending the email to the friends
	 */
	public function actionSendmail() {
		$user_id = Yii::$app->user->identity->id;
		$model = new SignupForm ();
		$invitemodel = new Userinvites ();
		$tablename = $invitemodel->tableName ();
		$emailids = $_POST ['emails'];
		$email = explode ( ',', $emailids ['emails'] );
		$sitesetting = Sitesettings::find()->where(['id'=>'1'])->one();
		
		$loguser = $model->findIdentity ( $user_id );
		
		
		$userinvitearray = array ();
		foreach ( $email as $key => $toemail ) {
			$userinviteModel = Userinvites::find ()->where ( [ 
					'userid' => $user_id,
					'invitedemail' => $toemail 
			])->one();
			if(count(array($userinviteModel)) == 0 || $userinviteModel == null  ) {
				$userinvitearray [] = [ 
					'userid' => $user_id,
					'invitedemail' => $toemail,
					'status' => 'Invited',
					'inviteddate' => time (),
					'cdate' => time () 
				];
			} 
			$emailarray[] = [
				'invitedemail' => $toemail
			];
		} 
		if (count ( $userinvitearray ) > 0) {
			
			$columnNameArray = [ 
					'userid',
					'invitedemail',
					'status',
					'inviteddate',
					'cdate' 
			];
			// below line insert all your record and return number of rows inserted
			$insertCount = Yii::$app->db->createCommand ()->batchInsert ( $tablename, $columnNameArray, $userinvitearray )->execute ();

			$sitesetting = Sitesettings::find()->where(['id'=>'1'])->one();
			$siteName = $sitesetting->sitename;
			foreach ( $emailarray as $invites ) { 
				echo $email = $invites['invitedemail'];
				Yii::$app->mailer->compose ( 'invitemail', [ 
						'loguser' => $loguser,
						'siteName' => $siteName,
				] )->setFrom ( $sitesetting->noreplyemail )->setTo ( $email )->setSubject ( 'Invite mail' )->send();
			}
		}   
		
	}
	public function afterSave() {
		$path = realpath ( Yii::app ()->getBasePath () . "/../media/item/" . $photosModel->productId . "/" ) . "/";
		$model = new XUploadForm ();
		$model->file = UploadedFile::getInstance ( $model, 'file' );
		echo "dsfD";
		die ();
		// We check that the file was successfully uploaded
		if ($model->file !== null) {
			// Grab some data
			$model->mime_type = $model->file->getType ();
			$model->size = $model->file->getSize ();
			$model->name = $model->file->getName ();
			// (optional) Generate a random name for our file
			$filename = md5 ( Yii::app ()->user->id . microtime () . $model->name );
			$filename .= "." . $model->file->getExtensionName ();
			if ($model->validate ()) {
				// Move our file to our temporary dir
				$model->file->saveAs ( $path . $filename );
				chmod ( $path . $filename, 0777 );
				// here you can also generate the image versions you need
				// using something like PHPThumb
				
				// Now we need to save this path to the user's session
				if (Yii::app ()->user->hasState ( 'images' )) {
					$userImages = Yii::app ()->user->getState ( 'images' );
				} else {
					$userImages = array ();
				}
				$userImages [] = array (
						"path" => $path . $filename,
						// the same file or a thumb version that you generated
						"thumb" => $path . $filename,
						"filename" => $filename,
						'size' => $model->size,
						'mime' => $model->mime_type,
						'name' => $model->name 
				);
				Yii::app ()->user->setState ( 'images', $userImages );
				
				// Now we need to tell our widget that the upload was succesfull
				// We do so, using the json structure defined in
				// https://github.com/blueimp/jQuery-File-Upload/wiki/Setup
				echo json_encode ( array (
						array (
								"name" => $model->name,
								"type" => $model->mime_type,
								"size" => $model->size,
								"url" => $publicPath . $filename,
								"thumbnail_url" => $publicPath . "/$filename",
								"delete_url" => $this->createUrl ( "upload", array (
										"_method" => "delete",
										"file" => $filename 
								) ),
								"delete_type" => "POST" 
						) 
				) );
			} else {
				// If the upload failed for some reason we log some data and let the widget know
				echo json_encode ( array (
						array (
								"error" => $model->getErrors ( 'file' ) 
						) 
				) );
				Yii::log ( "XUploadAction: " . CVarDumper::dumpAsString ( $model->getErrors () ), CLogger::LEVEL_ERROR, "xupload.actions.XUploadAction" );
			}
		} else {
			throw new CHttpException ( 500, "Could not upload file" );
		}
	}
	
	/*
	Function to set the language and to change the language
	*/
	public function actionLanguage()
	{
		$language = $_POST['language'];
		Yii::$app->language = $language;
		$session = Yii::$app->session;
		Yii::$app->session->set('language', $language);
		$session['language'] = $language;
		$_SESSION['language'] = $language;
		$languageCookie = new Cookie([
			'name' => 'language',
			'value' => $language,
			'expire' => time() + 60 * 60 * 24 * 30, // 30 days
		]);
		Yii::$app->response->cookies->add($languageCookie);
		//echo Yii::$app->request->getReferrer(); die;
	}

	/*
	Function to send verification mail to the user for booking
	*/
	public function actionSendtrustmail()
	{
			$email = $_POST['email'];
			$model = new SignupForm ();
			//$email = 'lakshmipriya@hitasoft.com';
			$link = Yii::$app->urlManager->createAbsoluteUrl ( '/verify/' . base64_encode ( $email ) );
			$sitesetting = Sitesettings::find()->where(['id'=>'1'])->one();
			$models = $model->findByEmail ( $email );
			Yii::$app->mailer->compose ( 'verifyemail', [
						'name' => $models->firstname,
						'link' => $link,
					    'sitesetting' => $sitesetting
						] )->setFrom ( $sitesetting->noreplyemail )->setTo ( $email )->setSubject ( 'Verify Email' )->send ();
			
					echo "success";
									
	}	

	public function actionMobileverificationstatus() {
		$sitedetails = Sitesettings::find()->orderBy(['id' => SORT_DESC])->one();
		$pno = $_POST["phone_no"];
		if(!empty($pno)) {
			$id = Yii::$app->user->id;
			$loguserdetails = Users::find()->where(['id'=>$id])->one(); 
			$loguserdetails->phoneno = $pno;
			$loguserdetails->mobileverify = '1';
			$loguserdetails->save(false);
			echo '1'; die;
		}
		else
		{
			echo '0'; die;
		}
	}

	public function actionPaysettings($details) {

		if (Yii::$app->user->isGuest) {
			return $this->goHome ();
		} else {
			$model = new SignupForm ();
			$userid = Yii::$app->user->identity->id;
			$userdata = $model->findIdentity($userid);
			$_SESSION['Stripe'] = array();   	
			// Site Settings
			$sitesetting = Sitesettings::find()->where(['id'=>'1'])->one();
			if($userdata['stripe_account_id'] != "") {
				$hostData = json_decode(trim($userdata['stripe_account_id']), true);
				$details = trim($hostData['base']);
				// Stripe Key
				\Stripe\Stripe::setApiKey($sitesetting['stripe_secretkey']);
				try {
			      $account = \Stripe\Account::retrieve(trim($hostData['accountid']));
			   	}
				catch(\Stripe\Exception\PermissionException $e) {
					Yii::$app->getSession()->setFlash('success','Error - '.$e->getMessage());
					return Yii::$app->response->redirect(array('dashboard'));
				} catch (\Stripe\Exception\RateLimitException $e) {
					Yii::$app->getSession()->setFlash('success','Error - '.$e->getMessage());
					return Yii::$app->response->redirect(array('dashboard'));
				} catch (\Stripe\Exception\InvalidRequestException $e) {
					Yii::$app->getSession()->setFlash('success','Error - '.$e->getMessage());
					return Yii::$app->response->redirect(array('dashboard'));
				} catch (\Stripe\Exception\AuthenticationException $e) {
					Yii::$app->getSession()->setFlash('success','Error - '.$e->getMessage());
					return Yii::$app->response->redirect(array('dashboard'));
				} catch (\Stripe\Exception\ApiConnectionException $e) {
					Yii::$app->getSession()->setFlash('success','Error - '.$e->getMessage());
					return Yii::$app->response->redirect(array('dashboard'));
				} catch (\Stripe\Exception\ApiErrorException $e) {
					Yii::$app->getSession()->setFlash('success','Error - '.$e->getMessage());
					return Yii::$app->response->redirect(array('dashboard'));
				} catch (Exception $e) {
					Yii::$app->getSession()->setFlash('success','Error - '.$e->getMessage());
					return Yii::$app->response->redirect(array('dashboard'));
				  }

			} else {
				if($details == "default") {
					$details = "US~USD~United States";
				} else {
					$details = $this->airUrlConvert($details);
					$details = Myclass::getDcode(base64_decode($details)); 
				}
				$_SESSION['Stripe']['hostcountry'] = $details; 
			}
			
			// Stripe connect custom account creation supported countries, please don't change until confirmed in STRIPE.
			$stripeHostCountry = json_decode($sitesetting->stripe_host_support_country, true);

			//Stripe European Currencies
			$europeanCurrencies = array("EUR", "CHF", "DKK", "NOK", "SEK", "CZK", "PLN"); 

			//Stripe Address Basis
			$excludeRoutingBasis = array("NZ"); 
			$excludeLineBasis = array();
			$excludeCityBasis = array("SG");
			$excludeCodeBasis = array("IE", "HK");
			$includeStateBasis = array("AU", "US", "IE", "CA", "MY"); 
			$includePersonalIdBasis = array("CA", "US", "HK", "SG", "MY");   

			//Canada Province Code
			$canadaStateCode = array('AB','BC','MB','NB','NL','NS','NT','NU','ON','PE','QC','SK','YT');

			if(in_array($details,$stripeHostCountry)) {
				return $this->render('paysettings', [ 
					'userdata' => $userdata,
					'sitesetting' => $sitesetting,
					'hostCountryOnLoad' => $details,
					'model' => $model,
					'canadaStateCode' => $canadaStateCode,
					'europeanCurrencies' => $europeanCurrencies,
					'excludeRoutingBasis' => $excludeRoutingBasis,    
					'excludeLineBasis' => $excludeLineBasis,
					'excludeCityBasis' => $excludeCityBasis,
					'excludeCodeBasis' => $excludeCodeBasis,
					'includeStateBasis' => $includeStateBasis,
					'includePersonalIdBasis' => $includePersonalIdBasis 
				]); 
        	} else {
        		return Yii::$app->response->redirect(array('dashboard'));
        	}
		}
	}
	 
	public function actionPaysave() { 
		if (Yii::$app->user->isGuest) {
			return $this->goHome (); 
		} else {
			//User Identity 
			$userid = Yii::$app->user->identity->id;
			$userdata = User::find()->where(['id'=>$userid])->one();

			$hostCountry = ""; $entryFlag = 0; 

			// Site Settings
			$sitesetting = Sitesettings::find()->where(['id'=>'1'])->one();
			
			// Stripe Key
			\Stripe\Stripe::setApiKey($sitesetting['stripe_secretkey']);

			if($userdata['stripe_account_id'] == "") {
				if(isset($_POST['Stripe']['hostCountry']) && trim($_POST['Stripe']['hostCountry'])!="")
					$hostCountry = trim(Myclass::getDcode(trim($_POST['Stripe']['hostCountry']))); 
					$_SESSION['Stripe']['hostcountry'] = $hostCountry;  
					$hostCountryRedirect = base64_encode(trim($_POST['Stripe']['hostCountry'])); 
			} else {
				$hostCountry = json_decode(trim($userdata['stripe_account_id']), true);
				$account = \Stripe\Account::retrieve(trim($hostCountry['accountid']));
				$account = $account->jsonSerialize();

				if($account['payouts_enabled'] == 1 && count($account['requirements']['past_due']) == 0 && $account['charges_enabled'] == 1 && $account['individual']['verification']['status'] == "verified") {  
					$entryFlag = 1;
				}
				$hostCountry = $hostCountry['base'];
				$hostCountryRedirect = trim(Myclass::getEcode(trim($hostCountry))); 
			}

			$docPOST = "";
			$idNumberStatus = 0;
			$ssnStatus = 0;  

			if($userdata['stripe_account_info'] != "") {
				$dataUpdate = json_decode($userdata['stripe_account_info'], true); 
				if(strpos(json_encode($account['individual']['verification']), 'status') !== false && $dataUpdate['documentstatus'] != "verified") {   
	            $dataUpdate['documentstatus'] = ($account['individual']['verification']['status'] == "verified")? "verified":"pending";
	            $docPOST = ($account['individual']['verification']['status'] == "verified")? "verified":"";   
	            $userdata->stripe_account_info = json_encode($dataUpdate);  
      			$userdata->save();  
	         } elseif ($dataUpdate['documentstatus'] == "verified") {   
	         	$docPOST = $dataUpdate['documentstatus'];
	         } 

	         if((strpos(json_encode($account['individual']), 'id_number_provided') !== false)) {
		         if(trim($account['individual']['id_number_provided']) == 1 ) 
		            $idNumberStatus = 1;
		      }

		      if(strpos(json_encode($account['individual']), 'ssn_last_4_provided') !== false) { 
		         if(trim($account['individual']['ssn_last_4_provided']) == 1 ) 
		            $ssnStatus = 1;
		      }

			} 

			// Stripe supported countries in DB, please don't change until confirmed in STRIPE.
			$stripeHostCountry = json_decode($sitesetting->stripe_host_support_country, true);

			if(in_array($hostCountry,$stripeHostCountry) && $hostCountry != "" && $entryFlag == 0) {
				$cntry = explode('~', $hostCountry);
				$hostCountryName = $cntry[2];
				$hostCountryCode = $cntry[0];
				$hostCurrency = $cntry[1];

				//Declaration
				$exitFlag = 0; $accountnumber =""; $routingnumber ="";

				//Stripe European Currencies
				$europeanCurrencies = array("EUR", "CHF", "DKK", "NOK", "SEK", "CZK", "PLN"); 
				//Stripe Address Basis
				$excludeRoutingBasis = array("NZ");   
				$excludeLineBasis = array();
				$excludeCityBasis = array("SG");
				$excludeCodeBasis = array("IE", "HK");
				$includeStateBasis = array("AU", "US", "IE", "CA", "MY");
				$includePersonalIdBasis = array("CA", "US", "HK", "SG", "MY"); 

				$hostData = json_decode(trim($userdata['stripe_account_id']), true); 

				//Validation on Post Values
				if(!isset($_POST['Stripe']['accountnumber']) || trim($_POST['Stripe']['accountnumber'])=="") {
					$exitFlag = 1;
				} else {
					if($userdata['stripe_account_id'] == "")
						$accountnumber = $_SESSION['Stripe']['accountnumber'] = trim($_POST['Stripe']['accountnumber']);
					else
						$accountnumber = trim($hostData['accountnumber']);
				}

				// European Countries doesn't contain routing numbers
				if(!in_array($cntry[1],$europeanCurrencies) && !in_array($cntry[0],$excludeRoutingBasis)) { 
					if(!isset($_POST['Stripe']['routingnumber']) || trim($_POST['Stripe']['routingnumber'])=="") {
						$exitFlag = 1;
					} else {
						if($userdata['stripe_account_id'] == "")
							$routingnumber = $_SESSION['Stripe']['routingnumber'] = trim($_POST['Stripe']['routingnumber']); 
						else
							$routingnumber = trim($hostData['routingnumber']);
					}
				}

				if(in_array($cntry[0],$includePersonalIdBasis)) {
					if(!isset($_POST['Stripe']['personalidnumber']) || trim($_POST['Stripe']['personalidnumber'])=="") {
						$exitFlag = 1;
					} else {
						$_SESSION['Stripe']['personalidnumber'] = trim($_POST['Stripe']['personalidnumber']);	
					}
				}

				if($cntry[0] == "US") {
					if(!isset($_POST['Stripe']['ssn']) || trim($_POST['Stripe']['ssn'])=="" || strlen(trim($_POST['Stripe']['ssn'])) != 4 ) {
						$exitFlag = 1;
					} else {
						$_SESSION['Stripe']['ssn'] = trim($_POST['Stripe']['ssn']);
					}
				}

				if($docPOST != "verified") {
					$model = new \yii\xupload\models\XUploadForm ();
					$idFrontPost = UploadedFile::getInstance ( $model, 'idfrontfile');
					if ($idFrontPost === null) { 
						$exitFlag = 1;
					}

					$idBackPost = UploadedFile::getInstance ( $model, 'idbackfile');
					if ($idBackPost === null) { 
						$exitFlag = 1;
					}

					$addrFrontPost = UploadedFile::getInstance ( $model, 'addrfrontfile');
					if ($addrFrontPost === null) { 
						$exitFlag = 1;
					}

					$addrBackPost = UploadedFile::getInstance ( $model, 'addrbackfile');
					if ($addrBackPost === null) { 
						$exitFlag = 1;
					} 
				}  

				if(!isset($_POST['Stripe']['firstname']) || trim($_POST['Stripe']['firstname'])=="" || strlen(trim($_POST['Stripe']['firstname'])) < 3 ) {
					$exitFlag = 1;
				}

				if(!isset($_POST['Stripe']['lastname']) || trim($_POST['Stripe']['lastname'])=="" || strlen(trim($_POST['Stripe']['lastname'])) < 3) {
					$exitFlag = 1;
				}

				if(trim($_POST['Stripe']['year']) > 1900) {
					if(((int) checkdate(trim($_POST['Stripe']['month']), trim($_POST['Stripe']['day']), trim($_POST['Stripe']['year']))) != 1) {
						$exitFlag = 1;
					}
					$checkdob = trim($_POST['Stripe']['year'])."-".trim($_POST['Stripe']['month'])."-".trim($_POST['Stripe']['day']);

					if(date_diff(date_create($checkdob), date_create('today'))->y <= 13 ) {
						$exitFlag = 1;
					} 
				} else {
					$exitFlag = 1;
				}

				if(!isset($_POST['Stripe']['phonenumber']) || trim($_POST['Stripe']['phonenumber'])=="") {
					$exitFlag = 1;
				} else {
					$_SESSION['Stripe']['phonenumber'] = trim($_POST['Stripe']['phonenumber']);
				} 

				
				if(!in_array($cntry[0],$excludeLineBasis)) {
					if(!isset($_POST['Stripe']['line']) || trim($_POST['Stripe']['line'])=="") {
						$exitFlag = 1;
					} else {
						$_SESSION['Stripe']['line'] = trim($_POST['Stripe']['line']);
					} 
				}

				if(isset($_POST['Stripe']['lineoptional']) || trim($_POST['Stripe']['lineoptional'])!="") {
					$_SESSION['Stripe']['lineoptional'] = trim($_POST['Stripe']['lineoptional']);
				}  

				if(!in_array($cntry[0],$excludeCityBasis)) {
					if(!isset($_POST['Stripe']['city']) || trim($_POST['Stripe']['city'])=="") {
						$exitFlag = 1;
					} else {
						$_SESSION['Stripe']['city'] = trim($_POST['Stripe']['city']);
					} 
				}

				if(in_array($cntry[0],$includeStateBasis)) {
					if(!isset($_POST['Stripe']['state']) ||trim($_POST['Stripe']['state'])==""){
						$exitFlag = 1;
					} else {
						$_SESSION['Stripe']['state'] = trim($_POST['Stripe']['state']);
					} 
				}

				if(!in_array($cntry[0],$excludeCodeBasis)) {
					if(!isset($_POST['Stripe']['postalcode']) ||trim($_POST['Stripe']['postalcode'])=="") {
						$exitFlag = 1;
					} else {
						$_SESSION['Stripe']['postalcode'] = trim($_POST['Stripe']['postalcode']);
					} 
				} 


				if($exitFlag == 1) {
					Yii::$app->getSession()->setFlash ( 'success', 'Sorry! Insufficient Data Error.' );
					return Yii::$app->response->redirect(array('paysettings/'.$hostCountryRedirect)); 
				} else {

					if($userdata['stripe_account_id'] == "") {

						//Bank Token Creation
						$newAccount = array();
						$account_holder_name = trim($_POST['Stripe']['firstname'])." ".trim($_POST['Stripe']['lastname']);

						if(!in_array($cntry[1],$europeanCurrencies)) {
							if(in_array($cntry[0],$excludeRoutingBasis)) {
								$key = array(
								  	"bank_account" => array(
										"country" => $hostCountryCode,
										"currency" => strtolower($hostCurrency),
										"account_holder_type" => "individual",
										"account_holder_name" => strtolower($account_holder_name),
										"account_number" => $accountnumber
								  	)
								);  
								if($userdata['stripe_account_id'] == "") {
									$newAccount['accountnumber'] = $accountnumber;
									$newAccount['routingnumber'] = '';
								}
							} else {
								$key = array(
								  	"bank_account" => array(
										"country" => $hostCountryCode,
										"currency" => strtolower($hostCurrency),
										"account_holder_type" => "individual",
										"account_holder_name" => strtolower($account_holder_name),
										"routing_number" => $routingnumber,
										"account_number" => $accountnumber
								  	)
								);
								if($userdata['stripe_account_id'] == "") {
									$newAccount['accountnumber'] = $accountnumber;
									$newAccount['routingnumber'] = $routingnumber;
								}
							}
						} else {  
							$key = array(
							  	"bank_account" => array(
									"country" => $hostCountryCode,
									"currency" => strtolower($hostCurrency),
									"account_holder_type" => "individual",
									"account_holder_name" => strtolower($account_holder_name), 
									"account_number" => $accountnumber
							  	)
							);
							if($userdata['stripe_account_id'] == "") 
								$newAccount['accountnumber'] = $accountnumber; 
						} 

						$details = $this->stripeException($key, 'token', '');
						$details = explode('~HTS~', $details);

						if($details[1] == "success") {
							$accountToken = trim($details[0]);
							// Stripe Account Creation
		    				$key =  array([
						      "type" => "custom",
						      "country" => $hostCountryCode,
						      "email" => $userdata['email'],
						      "requested_capabilities" => ['card_payments','transfers'],
						   ]); 
					  		$details = $this->stripeException($key, 'account', ''); 
					  		$details = explode('~HTS~', $details);

					  		if($details[1] == "success") {
						  		$accountId = trim($details[0]);
						  		$newAccount['accountid'] = $accountId;
								$newAccount['base'] = $hostCountry;
								$userdata->stripe_account_id = json_encode($newAccount);
								$userdata->stripe_status = "initialised";
								$userdata->save ();
							} else {
								Yii::$app->getSession()->setFlash ( 'success', "Account - ". $details[0]." ".$details[1].": ".$details[2]);
								return Yii::$app->response->redirect(array('paysettings/'.$hostCountryRedirect));
							}
						} else {
							Yii::$app->getSession()->setFlash ( 'success', "Error - ".$details[0]." ".$details[1].": ".$details[2]); 
							return Yii::$app->response->redirect(array('paysettings/'.$hostCountryRedirect));   
						}
					} else {
						$accountId = $hostData['accountid'];
						$accountToken = "";
					}

					if($accountId != "") {
						// Account Update to stripe
						if($userdata['stripe_status'] == "initialised" ) { 
							//Custom Account Creation With Token
							if($accountToken!="") {
								$account = \Stripe\Account::retrieve($accountId);
								$account->external_accounts->create(array("external_account" => $accountToken));
								$account->save();
							}  

							$userDetails = array();
							$userDetails['business_type'] = 'individual';
							$userDetails['individual']['email'] =  $userdata['email']; 
			      		$userDetails['business_profile']['support_email'] =  $userdata['email']; 
			      		$userDetails['business_profile']['name'] = trim($_POST['Stripe']['firstname'])." ".$hostCountryCode." ".$hostCurrency;  
							$userDetails['business_profile']['product_description'] = "Online booking for arranging or offering lodging and homestays";  


							$userDetails['individual']['metadata']['title'] = trim($_POST['Stripe']['firstname'])." ".$hostCountryCode;
							$userDetails['individual']['metadata']['description'] = "Online booking for arranging or offering lodging and homestays";
							$userDetails['individual']['metadata']['country'] = trim($cntry[0]);

							$userDetails['tos_acceptance']['date'] = time();
							$userDetails['tos_acceptance']['ip'] = $_SERVER['REMOTE_ADDR'];

							$userDetails['business_profile']['url'] = 'https://airfinchscript.com';
							$userDetails['business_profile']['support_url'] = 'https://airfinchscript.com'; 
							$userDetails['business_profile']['mcc'] = '8999'; 
							$details = $this->stripeException($userDetails, 'update', $accountId);    
							$details = explode('~HTS~', $details); 

							if($details[1] == "success") {
								$userdata = User::find()->where(['id'=>$userid])->one();
    							$userdata->stripe_status = "processed"; 
								$userdata->save ();
							} else {
								Yii::$app->getSession()->setFlash ( 'success', "Account Created - ". $details[0]." ".$details[1].": ".$details[2]); 
								return Yii::$app->response->redirect(array('paysettings/'.$hostCountryRedirect));  
							}

						}  

						if($userdata['stripe_status'] == "processed" || $userdata['stripe_status'] == "pending") {          

							$userDetails = array();   

							if($docPOST != "verified") {  
								$userDetails['individual']['first_name'] = $_SESSION['Stripe']['firstname'] = trim($_POST['Stripe']['firstname']);
				      		$userDetails['individual']['last_name'] = $_SESSION['Stripe']['lastname'] = trim($_POST['Stripe']['lastname']);
				      		 
								$userDetails['individual']['dob']['day']= $_SESSION['Stripe']['day'] = trim($_POST['Stripe']['day']);
								$userDetails['individual']['dob']['month'] = $_SESSION['Stripe']['month'] = trim($_POST['Stripe']['month']);
								$userDetails['individual']['dob']['year'] = $_SESSION['Stripe']['year'] = trim($_POST['Stripe']['year']);
							}  

							$userDetails['individual']['phone'] = $_SESSION['Stripe']['phonenumber'] = trim($_POST['Stripe']['phonenumber']);
							$userDetails['business_profile']['support_phone'] = $_SESSION['Stripe']['phonenumber'] = trim($_POST['Stripe']['phonenumber']);			  

							if(in_array($cntry[0],$includePersonalIdBasis) && isset($_POST['Stripe']['personalidnumber'])  &&  trim($_POST['Stripe']['personalidnumber']) != "" && $idNumberStatus == 0) {
								$userDetails['individual']['id_number'] = $_SESSION['Stripe']['personalidnumber'] = trim($_POST['Stripe']['personalidnumber']);
							}

							if($cntry[0] == "US" && isset($_POST['Stripe']['ssn'])  &&  trim($_POST['Stripe']['ssn']) != "" && $ssnStatus == 0) {   
								$userDetails['individual']['ssn_last_4'] = $_SESSION['Stripe']['ssn'] = trim($_POST['Stripe']['ssn']); 
							} 

							// Stripe Address Update
							if(!in_array($cntry[0],$excludeLineBasis)) {
								$userDetails['individual']['address']['line1'] = $_SESSION['Stripe']['line'] = trim($_POST['Stripe']['line']);
							} 

							if(isset($_POST['Stripe']['lineoptional']) && trim($_POST['Stripe']['lineoptional']) != "") {
								$userDetails['individual']['address']['line2'] = $_SESSION['Stripe']['lineoptional'] = trim($_POST['Stripe']['lineoptional']);
							} else {
								$userDetails['individual']['address']['line2'] = NULL;
							}
														
							if(!in_array($cntry[0],$excludeCityBasis)) {
								$userDetails['individual']['address']['city'] = $_SESSION['Stripe']['city'] = trim($_POST['Stripe']['city']); 
							}

							if(in_array($cntry[0],$includeStateBasis)) {
								$userDetails['individual']['address']['state'] = $_SESSION['Stripe']['state'] = trim($_POST['Stripe']['state']);
							} else {
								$userDetails['individual']['address']['state'] = NULL;
							}  

							if(!in_array($cntry[0],$excludeCodeBasis)) {
								$userDetails['individual']['address']['postal_code'] = $_SESSION['Stripe']['postalcode'] = trim($_POST['Stripe']['postalcode']);
							} 
							$userDetails['individual']['address']['country'] = trim($cntry[0]); 
						
							//Stripe Document Update
							$errorImageFlag = 0;
							$errorImageMsg = ""; 

							if($docPOST != "verified") { 
								if($idFrontPost !== null) { 
									$idfrontfileRtn = $this->stripeUpload('idfrontfile');
									if($idfrontfileRtn) {
										$userDetails['individual']['verification']['document']['front'] = $idfrontfileRtn;
									} else {
										$errorImageFlag = 1;
										$errorImageMsg = "identity (front) proof";
									}

								}  

								if($idBackPost !== null) {
									$idbackfileRtn = $this->stripeUpload('idbackfile');
									if($idbackfileRtn){
										$userDetails['individual']['verification']['document']['back'] = $idbackfileRtn;
									} else {
										$errorImageFlag = 1;
										$errorImageMsg = "identity (back) proof";
									}
								} 

								if($addrFrontPost !== null) {
									$addrfrontfileRtn = $this->stripeUpload('addrfrontfile');
									if($addrfrontfileRtn) {
										$userDetails['individual']['verification']['additional_document']['front'] = $addrfrontfileRtn;
									} else {
										$errorImageFlag = 1;
										$errorImageMsg = "address (front) proof";
									}
								}

								if($addrBackPost !== null) {  
									$addrbackfileRtn = $this->stripeUpload('addrbackfile');
									if($addrbackfileRtn) { 
										$userDetails['individual']['verification']['additional_document']['back'] = $addrbackfileRtn;
									} else {
										$errorImageFlag = 1;
										$errorImageMsg = "address (back) proof";
									}
								}   
							}           

							if($errorImageFlag == 1) {
	    						Yii::$app->getSession()->setFlash ( 'success', "Invalid ". $errorImageMsg.", please check again");  
								return Yii::$app->response->redirect(array('paysettings/'.$hostCountryRedirect));
							} 
							// Account Save Process
							$details = $this->stripeException($userDetails, 'update', $accountId);    
							$details = explode('~HTS~', $details); 

							if($details[1] == "success") {
								// Retrieval
								$account = \Stripe\Account::retrieve($accountId);
	    						$details = $account->jsonSerialize();

	    						if(($userdata['stripe_status'] == "processed" || $userdata['stripe_status'] == "pending") && count($details['external_accounts']['data']) >= 1)       
	    						{
		    						$result = array();
		    						
		    						// Retrieve Personal Id Niumber
		    						if(strpos(json_encode($details['individual']), 'id_number_provided') !== false) {
							       	if(trim($details['individual']['id_number_provided']) == 1 ) {
							       		$result['personalidnumber'] = trim($_POST['Stripe']['personalidnumber']);
							       		$result['personalidnumber_status'] = trim($details['individual']['id_number_provided']); 
							       	}
							      }
							      // Retrieve SSN
							      if(strpos(json_encode($details['individual']), 'ssn_last_4_provided') !== false && $hostCountryCode == "US") {
							    		if(trim($details['individual']['ssn_last_4_provided']) == 1 ){
							       		$result['ssn_last_four'] = trim($_POST['Stripe']['ssn']);
							       		$result['ssn_status'] = trim($details['individual']['ssn_last_4_provided']);
							       	}
							      } 
							      // Retrieve First Name
							      if(strpos(json_encode($details['individual']), 'first_name') !== false) {
							        $result['firstname'] = trim($details['individual']['first_name']);
							      }
							      // Retrieve Last Name
							      if(strpos(json_encode($details['individual']), 'last_name') !== false) {
							        $result['lastname'] = trim($details['individual']['last_name']);
							      }
							      // Retrieve Day
							      if(strpos(json_encode($details['individual']['dob']), 'day') !== false) {
							        $result['birth_day'] = trim($details['individual']['dob']['day']);
							      }
							      // Retrieve Month
							      if(strpos(json_encode($details['individual']['dob']), 'month') !== false) {
							        $result['birth_month'] = trim($details['individual']['dob']['month']);
							      }
									// Retrieve Year
							      if(strpos(json_encode($details['individual']['dob']), 'year') !== false) {
							        $result['birth_year'] = trim($details['individual']['dob']['year']);
							      }
							      // Retrieve Type
									if(strpos(json_encode($details), 'business_type') !== false) {
										$result['type'] = trim($details['business_type']);
									}
							      // Retrieve Phone Number
							      if(strpos(json_encode($details['individual']), 'phone') !== false) {
							        $result['phonenumber'] = trim($details['individual']['phone']);
							      }
							      // Retrieve Line
							      if(strpos(json_encode($details['individual']['address']), 'line1') !== false) {
							        $result['line1'] = trim($details['individual']['address']['line1']);
							      }
							      // Retrieve Line optional
							      if(strpos(json_encode($details['individual']['address']), 'line2') !== false) {
							        $result['line2'] = trim($details['individual']['address']['line2']);
							      }
							      // Retrieve City
							      if(strpos(json_encode($details['individual']['address']), 'city') !== false) {
							        $result['city'] = trim($details['individual']['address']['city']);
							      }
							      // Retrieve State
							      if(strpos(json_encode($details['individual']['address']), 'state') !== false) {
							        $result['state'] = trim($details['individual']['address']['state']);
							      }
							      // Retrieve Postal Code
							      if(strpos(json_encode($details['individual']['address']), 'postal_code') !== false) {
							        $result['postalcode'] = trim($details['individual']['address']['postal_code']);
							      }
							      // Retrieve Postal Country
							      if(strpos(json_encode($details['individual']['address']), 'country') !== false) {
							        $result['country'] = trim($details['individual']['address']['country']);
							      }
							      // Retrieve Document Verification Status
									//	if(strpos(json_encode($details['individual']['verification']['document']), 'back') !="" && strpos(json_encode($details['individual']['verification']['document']), 'front') != "" && strpos(json_encode($details['individual']['verification']['additional_document']), 'back') !="" && strpos(json_encode($details['individual']['verification']['additional_document']), 'front') != "" && strpos(json_encode($details['individual']['verification']), 'status') !== false) { 

							      $result['documentstatus'] = "pending";
									if(strpos(json_encode($details['individual']['verification']), 'status') !== false) { 
									  $result['documentstatus'] = ($details['individual']['verification']['status'] == "verified")? "verified":"pending";  
									} 

		    						$result['charges_enabled'] = $details['charges_enabled'];
		    						$result['created'] = $details['created'];
		    						$result['default_currency'] = $details['default_currency'];
		    						$result['payouts_enabled'] = $details['payouts_enabled'];
		    						$result['payouts_day'] = $details['settings']['payouts']['schedule']['delay_days'];
		    						$result['payouts_interval'] = $details['settings']['payouts']['schedule']['interval']; 
		    						$result['account_id'] = $details['id'];   

	    							$userdata = User::find()->where(['id'=>$userid])->one();
	    							$userdata->stripe_status = "pending"; 
	    							
	    							$succTxt = ($userdata->stripe_account_info == "") ? "Host Account Created please refresh the page." : "Host Account Updated."; 
	    							$userdata->stripe_account_info = json_encode($result);
									$userdata->save ();

									$_SESSION['Stripe'] = ""; 

									Yii::$app->getSession()->setFlash ( 'success', $succTxt);   
									return Yii::$app->response->redirect(array('paysettings/'.$hostCountryRedirect));
	    						} else {
	    							$failTxt = ($userdata->stripe_account_info == "") ? "Host Creation Failed." : "Host Updation Failed."; 

	    							Yii::$app->getSession()->setFlash ( 'success', $failTxt);   
									return Yii::$app->response->redirect(array('paysettings/'.$hostCountryRedirect));
	    						}
	    					} else {
	    						Yii::$app->getSession()->setFlash ( 'success', "Account Update - ". $details[0]." ".$details[1].": ".$details[2]);
								return Yii::$app->response->redirect(array('paysettings/'.$hostCountryRedirect));
	    					}
	    				} else {
	    					Yii::$app->getSession()->setFlash ( 'success', "Account Processed - ". $details[0]." ".$details[1].": ".$details[2]); 
								return Yii::$app->response->redirect(array('paysettings/'.$hostCountryRedirect));
	    				}
					} else {
						Yii::$app->getSession()->setFlash ( 'success', 'Sorry! Something Went wrong.' );
						return Yii::$app->response->redirect(array('paysettings/'.$hostCountryRedirect));     
					}
				}
			} else {
				if($entryFlag == 1)
					Yii::$app->getSession()->setFlash('success','Host account already verified.');
				else
					Yii::$app->getSession()->setFlash('success','Sorry! Something Went wrong.');

				return Yii::$app->response->redirect(array('dashboard')); 
			}	
		}
	}   

	public function airUrlConvert($string) {
		$entities = array('%21', '%2A', '%27', '%28', '%29', '%3B', '%3A', '%40', '%26', '%3D', '%2B', '%24', '%2C', '%2F', '%3F', '%25', '%23', '%5B', '%5D');
		$replacements = array('!', '*', "'", "(", ")", ";", ":", "@", "&", "=", "+", "$", ",", "/", "?", "%", "#", "[", "]");
		return str_replace($entities, $replacements, urlencode($string));
	}

	public function stripeException($data, $key, $accountId) { 
		$account = "";
		try {
			if($key == "token") {
				$account = \Stripe\Token::create($data);
			} elseif ($key == "account") {
				$account =  \Stripe\Account::create($data);
			} elseif ($key == "update") {
				$account = \Stripe\Account::update($accountId, $data);   
			}
		}
		catch(\Stripe\Exception\PermissionException $e) {
			Yii::$app->getSession()->setFlash('success','Error - '.$e->getMessage());
		} catch (\Stripe\Exception\RateLimitException $e) {
			Yii::$app->getSession()->setFlash('success','Error - '.$e->getMessage());
		} catch (\Stripe\Exception\InvalidRequestException $e) {
			Yii::$app->getSession()->setFlash('success','Error - '.$e->getMessage());
		} catch (\Stripe\Exception\AuthenticationException $e) {
			Yii::$app->getSession()->setFlash('success','Error - '.$e->getMessage());
		} catch (\Stripe\Exception\ApiConnectionException $e) {
			Yii::$app->getSession()->setFlash('success','Error - '.$e->getMessage());
		} catch (\Stripe\Exception\ApiErrorException $e) {
			Yii::$app->getSession()->setFlash('success','Error - '.$e->getMessage());
		} catch (Exception $e) {
			Yii::$app->getSession()->setFlash('success','Error - '.$e->getMessage());
			
		}

		if(!empty($account)) {
			if($key == "update") {
				return "Update~HTS~success~HTS~ ";
			} else {
				$account = $account->jsonSerialize();
				$token  = $account['id'];
				return $token."~HTS~success~HTS~ ";
			}
		} else {
			return "Account~HTS~error~HTS~ ";
		}
	}

	public function stripeUpload($file) {
		if (Yii::$app->user->isGuest) {
			return $this->goHome ();
		} else {
			$userid = Yii::$app->user->identity->id;
			$model = new \yii\xupload\models\XUploadForm ();
			$uploadFile = UploadedFile::getInstance ( $model, $file);
			$webImageValues = array();
      	$webImageValues = getimagesize($uploadFile->tempName);
      	$ext = "." . $uploadFile->getExtension();
      	$imageSize = ($uploadFile->size / 1024) / 1024;
      	$extensionarray = array('.jpg', '.png');   

      	if($webImageValues[0] > 0 && $webImageValues[1] > 0 && count($webImageValues) >= 6 && $imageSize < 5 && in_array($ext, $extensionarray) && (end($webImageValues) == "image/jpeg" || end($webImageValues) == "image/png")) { 

				$frontendurl = str_replace('backend','frontend', Yii::$app->basePath);
				$usrimgpath = realpath ( $frontendurl . "/web/albums/images/stripe/" ) . "/";
				$usrimg = $userid."_".$file.$ext;
				$filePath = $usrimgpath.$usrimg;
				if(file_exists($filePath)) {
					unlink($filePath);   	
				}
				$result = move_uploaded_file($uploadFile->tempName,$filePath);
				if($result) {  
					chmod ( $filePath, 0777 ); 
					$sitesetting = Sitesettings::find()->where(['id'=>'1'])->one();
					// Stripe Key
					\Stripe\Stripe::setApiKey($sitesetting['stripe_secretkey']);
					$fp = fopen($filePath, 'r'); 

					$file_obj = \Stripe\File::create([ //FileUpload
					  'file' => $fp,
					  'purpose' => 'identity_document',
					]);  
					return $file_obj->id; 
				} else {
					return false;  
				}
			} else {
				return false;
			}
		}
	}   

	public function dataReturn($key, $flag) {
		$userid = Yii::$app->user->identity->id;
		$userdata = User::find()->where(['id'=>$userid])->one();
		
		if($userdata->stripe_account_id != "" && $flag == "AC") {
			$data = json_decode($userdata->stripe_account_id, true);
			return base64_encode($data[$key]);
		} elseif ($userdata->stripe_account_info != "" && $flag == "IN") {
			$data = json_decode($userdata->stripe_account_info, true);
			return base64_encode($data[$key]);
		} else {
			return;
		}
	}


	// Stripe Auto Payment for host and guest. if, not cliamed by host.
	// CRON Job, please don't delete. 
public function actionPayupdate() {
		
		$todaydate = date('m/d/Y');
    	// $today = 1664755200;
    	$today = strtotime($todaydate);

		$reservations = Reservations::find()->where(['orderstatus'=>'pending'])
		->andWhere([
					'or', 
				   ['bookstatus'=>'accepted'],
				   ['bookstatus'=>'requested']
				]) 
		->andWhere(['other_transaction'=>NULL])
		->andWhere(['claim_transaction'=>NULL])    
		->andWhere(['!=','checkin','0000-00-00 00:00:00'])
		->andWhere(['!=','checkout','0000-00-00 00:00:00'])
		// ->andWhere(['<','todate', $today])  
		->orderBy(['id'=>SORT_DESC])
		->all();

		

		
		$sitesetting = Sitesettings::find()->where(['id'=>'1'])->one();  
		$cardDetails = json_decode($sitesetting->stripe_card_details, true);

		if(count($reservations) > 0 && count($cardDetails) > 0) { 
			foreach ($reservations as $key => $reservation) {
				// $currentTimezone = 1664755200;   
				$currentTimezone = strtotime(Myclass::getTime($reservation->timezone));
			
				if($reservation->bookstatus == "requested" && (strtotime($reservation->checkout) < $currentTimezone) && empty($reservation->other_transaction)) 
				{   
					$invoice = $reservation->getInvoices()->where(['orderid'=>$reservation->id])->one();
					
					if($invoice != null) {
						
						\Stripe\Stripe::setApiKey($sitesetting->stripe_secretkey);
						$refund = \Stripe\Refund::create([
							'payment_intent' => $invoice->stripe_transactionid
						]);
						
						$striperesult = $refund->jsonSerialize();
						
						if ($striperesult['status'] == 'succeeded' && !empty($striperesult['id']) && !empty($striperesult['balance_transaction'])) {
							$result['refund_id'] = $striperesult['id'];
							$result['status'] = $striperesult['status'];
							$result['amount'] = $striperesult['amount'];
							$result['type'] = $striperesult['object'];
							$result['payment_intent'] = $striperesult['payment_intent'];
							$result['currency'] = $reservation->convertedcurrencycode;
							$result['cdate'] = time();
							$reservation->orderstatus = 'paid';
							$reservation->sdstatus = 'paid';
							$reservation->other_transaction = json_encode($result);
							$reservation->bookstatus = "refunded";
							$reservation->cancelby = "Admin";
							$reservation->canceldate = time();
							$reservation->save();

							$userid = $reservation->userid;
							$hostid = $reservation->hostid;
							$userform = new SignupForm ();
							$userdata = $userform->findIdentity($userid);
							$hostdata = $userform->findIdentity($hostid);
							$usernotifications = json_decode($userdata->notifications,true);
							if (isset($usernotifications['reservationnotify'])) {
								if($usernotifications['reservationnotify']==1) {
									$listingid = $reservation->listid;
									$notifymessage = 'refunded on your trip request';
									$message = '';
									$logdatas = $this->addlog('refund',$hostid,$userid,$listingid,$notifymessage,$message);  
								} 
							}
							          

							$listingdata = Listing::find()->where(['id'=>$reservation->listid])->one();
							if($userdata->pushnotification == "1") {    
								$userdevicedet = Userdevices::find()->where(['user_id'=>$userid])->all();
								if(count($userdevicedet) > 0) {
									foreach($userdevicedet as  $userdevice) {
										$deviceToken = $userdevice->deviceToken;
										$badge = $userdevice->badge;
										$badge +=1;
										$userdevice->badge = $badge;
										$userdevice->deviceToken = $deviceToken;
										$userdevice->save(false);
										if(isset($deviceToken)){
											$messages = 'Your trip request has been refunded by Admin at '.$listingdata->listingname;
											// Yii::$app->mycomponent->pushnot($deviceToken,$messages,$badge);
										}
									}
								}
							} 

							Yii::$app->mailer->compose ( 'reservestatus', [
								'name' => $userdata->firstname,
								'sitesetting' => $sitesetting,
								'listingname' => $listingdata->listingname,
								'status' => 'refunded',
								'hostname' => $hostdata->firstname,
							] )->setFrom ( $sitesetting->noreplyemail )->setTo ( $userdata->email )->setSubject ( 'Your trip request has refunded' )->send (); 
						}
					} else {
							echo "No invoice exists for requested reservations.";  
					}
		            
				} else if($reservation->bookstatus == "accepted" &&  (strtotime($reservation->checkout) < $currentTimezone)) {
					echo '<pre>'; print_r(strtotime($reservation->checkout));
					echo '<pre>'; print_r("accept");
					$hostData = User::find()->where(['id'=>$reservation->hostid])->one();
					$checkoutDate = date("m/d/Y",$reservation->todate);
					$todayDate = date('m/d/Y');
			    	$payoutDue = json_decode($sitesetting->stripe_card_details, true);
					$payoutDue = (trim($payoutDue['stripe_hostpaydays']) > 2)?trim($payoutDue['stripe_hostpaydays']):'2';
					$payoutDue = "+".$payoutDue." days";
					
					if($hostData['stripe_status'] == "verified" && $hostData['stripe_account_id'] != NULL && $hostData['stripe_account_id'] != "" && $hostData['stripe_account_info'] != NULL && $hostData['stripe_account_info'] != "") {
						$dueDate = date("m/d/Y",strtotime($checkoutDate.$payoutDue));
						// echo '<pre>'; print_r(strtotime($checkoutDate)); die;
						// if((strtotime($checkoutDate) < $currentTimezone) && ($currentTimezone > strtotime($dueDate))) { 
						if( (strtotime($checkoutDate) < $currentTimezone) ) {
						// 	echo '<pre>'; print_r("dueDate");
						// die; 
							$host_amount = 0; $guest_amount = 0; $guest_pay=0;
							if($reservation->booking == 'perhour') {
								$total_listingprice = round((( $reservation->pricepernight * $reservation->totalhours)/$reservation->convertedprice),2);
								
							} else if($reservation->booking == 'pernight') {
								$total_listingprice = round((( $reservation->pricepernight * $reservation->totaldays)/$reservation->convertedprice),2);
							} else {
								$total_listingprice = round($reservation->pricepernight,2);
							}
				         	$other_amount = $reservation->taxfees + $reservation->cleaningfees + $reservation->servicefees;
		              		$total_amount = $total_listingprice + $other_amount;
	               			$guest_amount = $reservation->securityfees;
	               			$rate = $reservation->convertedprice;   
							$stripe_currency = ['BIF','CLP','DJF','GNF','JPY','KMF','KRW','MGA','PYG','RWF','UGX','VND','VUV','XAF','XOF','XPF'];
							$stripecurrency = $reservation->convertedcurrencycode;
							$stripeusercurrency = $reservation->convertedcurrencycode;
							$rate= Myclass::getcurrencyprice($reservation->convertedcurrencycode); //NGN 1
     						$rate2= Myclass::getcurrencyprice($reservation->currencycode); // EUR 0.00203

							if(in_array(strtoupper(trim($stripecurrency)),$stripe_currency) ||  in_array(strtoupper(trim($stripeusercurrency)),$stripe_currency)){
								$guest_pay = round(($guest_amount ));
								$host_amount = round(($rate2 * ($total_amount / $rate)));
							}
							else {
								$guest_pay = (round(($guest_amount),2)) * 100; 
								$host_amount = round(($rate2 * ($total_amount / $rate))); 
            					$host_amount = (round($host_amount,2)) * 100;
							}
							
							$inv_reservation = Reservations::find()->where(['id'=>$reservation->id])->one();
							$invoice = $inv_reservation->getInvoices()->where(['orderid'=>$reservation->id])->one();
							
							// if(!empty($hostData['stripe_account_id']))
							// {
								$host_account_id = json_decode($hostData['stripe_account_info'], true);
								
								if(!empty($invoice->stripe_transactionid) && $host_account_id['accountid']!="") { 
									if(!empty($guest_pay) && $guest_pay > 0 && $inv_reservation->other_transaction == NULL) { 
										// Refund to security deposit to Guest
										$sitesettings = Sitesettings::find()->where(['id'=>'1'])->one();
										\Stripe\Stripe::setApiKey($sitesettings->stripe_secretkey);
										$refund = \Stripe\Refund::create([
											'payment_intent' => $invoice->stripe_transactionid,
											'amount' => $guest_pay,
										]);
										$striperesult = $refund->jsonSerialize();
										$result = array();
										if ($striperesult['status'] == 'succeeded' && !empty($striperesult['id']) && !empty($striperesult['balance_transaction'])) {
											$result['refund_id'] = $striperesult['id'];
											$result['status'] = $striperesult['status'];
											$result['amount'] = $striperesult['amount'];
											$result['type'] = $striperesult['object'];
											$result['charge'] = $striperesult['charge'];
											$result['currency'] = $reservation->convertedcurrencycode;
											$result['paid'] = $guest_pay;
											$result['cdate'] = time();
											$inv_reservation->sdstatus = 'paid';
											$inv_reservation->other_transaction = json_encode($result);
											$inv_reservation->save();
										}
									}

								// echo '<pre>';
								// print_r($inv_reservation);
								// die;

								// echo $host_amount;
								// die;
									if(!empty($host_amount) && $host_amount > 0 && ($inv_reservation->claim_transaction == NULL || $inv_reservation->claim_transaction == ""))   
									{  
										if($reservation->currencycode == "JPY" || $reservation->currencycode == "jpy") {
											$host_amount = round(($rate2 * ($total_amount / $rate)));
										} else {
											$host_amount = round(($rate2 * ($total_amount / $rate))); 
											$host_amount = (round($host_amount,2)) * 100;
										} 
										// 109,605.90561576
										$cardDetails = json_decode($sitesetting->stripe_card_details, true);
										\Stripe\Stripe::setApiKey($sitesetting->stripe_secretkey); 
										if($sitesetting->paymenttype == 'sandbox') {
												$method = \Stripe\PaymentMethod::create([
													'type' => 'card',
													'card' => [
														'token' => 'tok_visa'
													],
												]);
											} else {
											$method = \Stripe\PaymentMethod::create([
												'type' => 'card',
												'card' => [
													"number" => trim($cardDetails['stripe_card']),
													"exp_month" => trim($cardDetails['stripe_month']),
													"exp_year" => trim($cardDetails['stripe_year']),
													"cvc" => trim($cardDetails['stripe_cvc'])
												],
											]);
										}
										// Code Kalidas
										// $method = \Stripe\PaymentMethod::create([
										// 	'type' => 'card',
										// 	'card' => [
										// 		"number" => trim($cardDetails['stripe_card']),
										// 		"exp_month" => trim($cardDetails['stripe_month']),
										// 		"exp_year" => trim($cardDetails['stripe_year']),
										// 		"cvc" => trim($cardDetails['stripe_cvc'])
										// 	],
										// ]); 

										$chargeJson = \Stripe\PaymentIntent::create([
											'payment_method_types' => ['card'],
											'payment_method' => $method->id,
											'amount' => $host_amount,
											'confirm' => true,
											'currency' => strtolower($reservation->currencycode),
											'transfer_data' => [
												'destination' => $host_account_id['accountid']
											],
										]);
										$striperesult = $chargeJson->jsonSerialize();
									
										$result = array();
										if ($striperesult['status'] == 'succeeded' && !empty($striperesult['id']) ) {
											$result['claim_id'] = $striperesult['id'];
											$result['status'] = $striperesult['status'];
											$result['amount'] = $striperesult['amount'];
											$result['type'] = $striperesult['object'];
											$result['currency'] = $reservation->currencycode;
											$result['paid'] = $host_amount;
											$result['cdate'] = time();
											$inv_reservation->orderstatus = 'paid';
											$inv_reservation->sdstatus = 'paid';
											$inv_reservation->claim_transaction = json_encode($result);
											$inv_reservation->save();
										}

									// echo '<pre>';
									// print_r($inv_reservation);
									// die;

									
									}
								}
							// }
							
						}	 
					}
				} else { 
					echo '<pre>'; echo "No Booked or Accepted reservations.";  
				}

			}
			date_default_timezone_set('UTC');
		} else {
			echo "No reservations found for settlement"; 
		}
	}


	public function addlog($logtype,$userid,$notifyto,$listingid,$notifymessage,$message)
	{
		$log = new Logs();
		$log->type = $logtype;
		$log->userid = $userid;
		$log->notifyto = $notifyto;
		$log->listingid = $listingid;
		$log->notifymessage = $notifymessage;
		$log->messageread = '1';  
		$log->message = $message;
		$log->cdate = time();
		$log->save(false); 
	}

	

	// Stripe Auto Payment for host and guest. if, not cliamed by host.
	// CRON Job, please don't delete. 
	public function actionCurrencyupdate() { 
		// Developer - AK
		$Sitesettings = Sitesettings::find()->where(['id'=>'1'])->one();
		if($Sitesettings->autoupdate_currency==1)
     	{
			$defaultCur = Currency::find()->where(['defaultcurrency'=>'1'])->one();
			if(!empty($defaultCur))
			{
				$defaultcurrency=$defaultCur->currencycode;
				$model = Currency::find()->all();
				foreach ($model as $key => $models) {
					$staticCurrency=$models->currencycode;
					$curId=$models->id;
					$currencyTbl = Currency::find()->where(['id'=>$curId])->one();
					
					/*
						Code Start - KS
					*/
					$req_url = 'https://api.exchangerate.host/convert?from='.strtoupper($defaultcurrency).'&to='.strtoupper($staticCurrency);
					$response_json = file_get_contents($req_url);
					if(false !== $response_json) {
							$response = json_decode($response_json);
							$currencyTbl->price=$response->result;
							$currencyTbl->save(false); 
							echo $curId.' - '.$response->result.'<br/>';
					}else{
						$response = json_decode($response_json);
						$currencyTbl->price=0;
						$currencyTbl->save(false); 
					}
					/*
						Code END - KS
					*/

					
				} 
				return "updated";	 
			}
		} 
		die;

	}

	/*
		Account Delete Option User & Host.
		Delete User and Host Related Data.
		Develoepr - SK.
	*/
	public function actionDeleteaccount()
	{
		$userId = \Yii::$app->user->identity->id;
		if (empty($userId)) {
			Yii::$app->session->setFlash ( 'error', 'Something went wrong' );
            return $this->goHome ();
		}
		
		$userdata = User::find()->where(['id' => $userId])->one();
		
		$hostAcceptedReservationData = Reservations::find()->where(['bookstatus'=>'accepted'])
					->andWhere(['orderstatus'=>'pending'])->andWhere(['hostid' => $userdata->id])->count();
		$userAccepedReservationData = Reservations::find()->where(['bookstatus'=>'accepted'])
					->andWhere(['orderstatus'=>'pending'])->andWhere(['userid' => $userdata->id])->count();
		if( $hostAcceptedReservationData > 0 || $userAccepedReservationData > 0 )
		{
			Yii::$app->session->setFlash ( 'error', 'Unable to delete your account, your have an incomplete bookings.' );
        	return $this->goHome ();
			die;
		}
		else{
			$flag=1;
			$hostRequestedReservationData = Reservations::find()->where(['bookstatus'=>'requested'])
					->andWhere(['hostid' => $userdata->id])->all();
			$userRequestedReservationData = Reservations::find()->where(['bookstatus'=>'requested'])
					->andWhere(['userid' => $userdata->id])->all();
			if(!empty($hostRequestedReservationData)){
				foreach ($hostRequestedReservationData as $key => $value) {
					echo'<script>change_reserve(\'decline\',\''.$value->id.'\');</script>';
				}
			}
			else{
				foreach ($userRequestedReservationData as $key => $value) {
					echo'<script>change_reserve(\'cancel\',\''.$value->id.'\');</script>';
				}
			}
		}


		$todaydate = date('m/d/Y');
		$today = strtotime($todaydate);
		
		$gethostReservationData = Reservations::find()->where(['>=', 'todate', $today])
					->andWhere(['hostid' => $userdata->id])->andWhere([
						'or', 
					   ['bookstatus'=>'accepted'],
					   ['bookstatus'=>'requested']
					])->count();

		$getuserReservationData = Reservations::find()->where(['>=', 'todate', $today])
					->andWhere(['userid' => $userdata->id])->andWhere([
						'or', 
					   ['bookstatus'=>'accepted'],
					   ['bookstatus'=>'requested']
					])->count();
		
		if($gethostReservationData > 0 || $getuserReservationData > 0)
		{
			if($gethostReservationData > 0 && $getuserReservationData > 0)
			{
				Yii::$app->session->setFlash ( 'error', 'We cannot delete the account, because you have a reservation process and you have a booking process, Kindly check the process.' );
				die;
			}elseif($gethostReservationData > 0){
				Yii::$app->session->setFlash ( 'error', 'We cannot delete the account, because you have a reservation process, Kindly check the reservation process.' );
				return $this->redirect(['/user/listing/futurereservations']); 
				die;
			}elseif($getuserReservationData > 0){
				Yii::$app->session->setFlash ( 'error', 'We cannot delete the account, because you have a booking process, Kindly check the booking  process.' );
				return $this->redirect(['/user/listing/trips']); 
				die;
			}
		}
		$userdata->accountstatus = 'deleted';
		$userdata->userstatus = 4;
		if($userdata->save(false)){
			$recent = Listing::updateAll(['liststatus'=>3], ['=','userid' ,$userdata->id]);
		}
		Yii::$app->user->logout ();
		setcookie ("email", '');
		setcookie ("user_id", '');
		Yii::$app->session->setFlash ( 'success', 'Your Account Deleted Successfully.' );
        return $this->goHome ();
	}


		public function actionConnectionhostaccount()
	{
		// Avoid unwanted cookies try.
		// if (!isset($_GET['code'])) {
		// 	return $this->redirect(['/']);
		// }

		// Get Account id and connect with master account.
		$sitesetting = Sitesettings::find()->where(['id' => '1'])->one();
		// \Stripe\Stripe::setApiKey($sitesetting['stripe_secretkey']);
		// $response = \Stripe\OAuth::token([
		// 	'grant_type' => 'authorization_code',
		// 	'code' => trim($_GET['code']),
		// ]);


		$stripe_secret_key = $sitesetting->stripe_secretkey;
		$url = 'https://api.stripe.com/v1/accounts';

		$ch = curl_init();
		curl_setopt($ch, CURLOPT_URL, $url);
		curl_setopt($ch, CURLOPT_POST, true);
		curl_setopt($ch, CURLOPT_POSTFIELDS, 'country=US&type=express&capabilities[card_payments][requested]=true&capabilities[transfers][requested]=true');
		curl_setopt($ch, CURLOPT_HTTPHEADER, array(
			'Authorization: Bearer ' . $stripe_secret_key,
			'Content-Type: application/x-www-form-urlencoded'
		));
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
		$result1 = curl_exec($ch);
		curl_close($ch);
		$account_result = json_decode($result1, true);
		// print_r($account_result);die;
		$account_id = $account_result['id'];

		$url = 'https://api.stripe.com/v1/account_links';
		$data = array(
			'account' => $account_id,
			'type' => 'account_onboarding',
			'return_url' => Yii::$app->urlManager->createAbsoluteUrl("stripepayoutsettings").'?code='.$account_id,
			'refresh_url' => Yii::$app->urlManager->createAbsoluteUrl("stripepayoutsettings").'?code='.$account_id,
		);
		
		$ch = curl_init();
		curl_setopt($ch, CURLOPT_URL, $url);
		curl_setopt($ch, CURLOPT_POST, true);
		curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($data));
		curl_setopt($ch, CURLOPT_HTTPHEADER, array(
			'Authorization: Bearer ' . $stripe_secret_key,
			'Content-Type: application/x-www-form-urlencoded'
		));
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
		$result2 = curl_exec($ch);
		curl_close($ch);
		$account_links_details = json_decode($result2, true);
		$connectUrl = $account_links_details['url'];

		// return $connectUrl;
		$connected_account_id = $account_id;

		// For web Host Account Creations.
		if (!(Yii::$app->user->isGuest)) {
			$loguserid = \Yii::$app->user->identity->id;
			$userdata = User::find()->where(['id' => $loguserid])->one();
			$account = \Stripe\Account::retrieve($connected_account_id);
            $details = $account->jsonSerialize();
            $accData['accountid'] = $connected_account_id;
            $accData['base'] = $account;
            if(!empty($accData) && !empty($userdata)) {
                $userdata->stripe_account_info = json_encode($accData);
                $userdata->stripe_account_id = $connected_account_id;
                $userdata->stripe_status = "verified";
                if($userdata->save()) {
                    $status = Yii::t('app', "Host Account Created.");
					return $this->redirect(['/']);
                } else {
                    $status = Yii::t('app', "Error occured in account creation");
                    return $this->redirect(['/']);
                }
            }
		}else{
			$loguserid = trim($_POST['user_id']);
			$userdata = User::find()->where(['id' => $loguserid])->one();
			$account = \Stripe\Account::retrieve($connected_account_id);
            $details = $account->jsonSerialize();
            $accData['accountid'] = $connected_account_id;
            $accData['base'] = $account;
            if(!empty($accData) && !empty($userdata)) {
                $userdata->stripe_account_info = json_encode($accData);
                $userdata->stripe_account_id = $connected_account_id;
                $userdata->stripe_status = "verified";
                if($userdata->save()) {
                    echo '{"status":"true","message":"Host account created."}';
					die;
                } else {
                    echo '{"status":"true","message":"Host account not created."}';
					die;
                }
            }
		}
		// return $this->redirect(['/?code='.$connected_account_id]);  
	}


	// SK code.
	public function actionPayoutpreference() {
        if (empty(Yii::$app->user->identity->id)) {
            Yii::$app->getSession()->setFlash('error', Yii::t('app','Login your account.'));
			return $this->redirect(['hotelsignin']);
		}
        $this->layout = 'main';
        $userid = Yii::$app->user->identity->id;
        $userdata = User::find()->where(['id' => $userid])->one();
		if(empty($userdata)){
			echo 'processing.. Please wait do not refresh'; die;
		}
        $sitesetting = Sitesettings::find()->where(['id' => '1'])->one();
        \Stripe\Stripe::setApiKey($sitesetting['stripe_secretkey']);

		$stripe_secret_key = $sitesetting->stripe_secretkey;
		$url = 'https://api.stripe.com/v1/accounts';

		$ch = curl_init();
		curl_setopt($ch, CURLOPT_URL, $url);
		curl_setopt($ch, CURLOPT_POST, true);
		curl_setopt($ch, CURLOPT_POSTFIELDS, 'country=US&type=express&capabilities[card_payments][requested]=true&capabilities[transfers][requested]=true');
		curl_setopt($ch, CURLOPT_HTTPHEADER, array(
			'Authorization: Bearer ' . $stripe_secret_key,
			'Content-Type: application/x-www-form-urlencoded'
		));
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
		$result1 = curl_exec($ch);
		curl_close($ch);
		$account_result = json_decode($result1, true);
		// print_r($account_result);die;
		$account_id = $account_result['id'];

		$url = 'https://api.stripe.com/v1/account_links';
		$data = array(
			'account' => $account_id,
			'type' => 'account_onboarding',
			'return_url' => Yii::$app->urlManager->createAbsoluteUrl("payoutpreference").'?code='.$account_id,
			'refresh_url' => Yii::$app->urlManager->createAbsoluteUrl("payoutpreference").'?code='.$account_id,
		);
		
		$ch = curl_init();
		curl_setopt($ch, CURLOPT_URL, $url);
		curl_setopt($ch, CURLOPT_POST, true);
		curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($data));
		curl_setopt($ch, CURLOPT_HTTPHEADER, array(
			'Authorization: Bearer ' . $stripe_secret_key,
			'Content-Type: application/x-www-form-urlencoded'
		));
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
		$result2 = curl_exec($ch);
		curl_close($ch);
		$account_links_details = json_decode($result2, true);
		$connectUrl = $account_links_details['url'];

		// return $connectUrl;
		// $connected_account_id = $account_id;
		// print_r($_GET['code']);die;

		
        if(!empty($_GET['code'])) {
			
			\Stripe\Stripe::setApiKey($sitesetting['stripe_secretkey']);
			$connected_account_id = $_GET['code'];
        //     $response = \Stripe\OAuth::token([
        //         'grant_type' => 'authorization_code',
        //         'code' => $_GET['code'],
        //     ]);
        //     $connected_account_id = $response->stripe_user_id;
            if(!empty($connected_account_id)) {
                $account = \Stripe\Account::retrieve($connected_account_id);
                $details = $account->jsonSerialize();
                $accData['accountid'] = $connected_account_id;
                $accData['base'] = $account;
                if(!empty($accData) && !empty($userdata)&& !empty($details['charges_enabled']) && !empty($details['payouts_enabled'])) {
                    $userdata->stripe_account_info = json_encode($accData);
                    $userdata->stripe_account_id = $connected_account_id;
                    $userdata->stripe_status = "verified";
					//$userdata->stripe_status = "verified";
					$userdata->emailverify = 1;	
                    if($userdata->save()) {
                        Yii::$app->session->setFlash('success', Yii::t('app','Account has been made successfully'));
                        return $this->redirect(['/payoutpreference']); 
                    } else {
                        Yii::$app->session->setFlash('error', Yii::t('app','Something went wrong'));
                        return $this->redirect(['/payoutpreference']);
                    }
                }else{
					$userdata->stripe_account_info = json_encode($accData);
					$userdata->stripe_account_id = $connected_account_id;
					$userdata->stripe_status = "unverified";
                    if($userdata->save()) {
                        Yii::$app->getSession()->setFlash('error', 'The payout account owner needs to provide more information to Stripe to enable payments and payouts on this account. Kindly contact admin for more informations.');
                        return $this->redirect(['/payoutpreference']);
                    }
				}
            }
         
	}else{
            return $this->render('payout_preference', [
                'sitesetting' => $sitesetting,
                'userdata' => $userdata,
				'connectUrl' => $connectUrl
            ]);
        }
    }


}
?>

