<?php

namespace backend\models;

use Yii;
use common\models\User;
use yii\base\Model;


/**
 * This is the model class for table "hts_users".
 *
 * @property integer $id
 * @property string $firstname
 * @property string $lastname
 * @property string $username
 * @property string $email
 * @property string $password
 * @property string $birthday
 * @property string $userstatus
 * @property string $hoststatus
 * @property integer $verify_pass
 * @property integer $verify_passcode
 * @property string $profile_image
 * @property string $address1
 * @property string $address2
 * @property string $city
 * @property string $state
 * @property integer $country
 * @property integer $created_at
 * @property integer $modified_at
 * @property integer $last_login
 * @property string $login_type
 * @property string $facebookid
 * @property string $googleid
 * @property string $referrer_id
 * @property string $credit_total
 * @property string $gender
 * @property integer $activation
 * @property string $user_level
 * @property string $phoneno
 * @property string $about
 * @property string $school
 * @property string $work
 * @property string $timezone
 * @property string $language
 * @property string $emergencyno
 * @property string $emergencyname
 * @property string $emergencyemail
 * @property string $emergencyrelation
 * @property integer $shippingid
 * @property string $workemail
 * @property string $pushnotification
 * @property string $notifications
 * @property string $emailsettings
 * @property string $socialconnections
 * @property string $findability
 * @property integer $loginnotify
 * @property integer $mobileverify
 * @property string $verifyno
 * @property integer $emailverify
 * @property string $verifycode
 * @property integer $reservationrequirement
 *
 * @property Listing[] $listings
 * @property Lists[] $lists
 * @property Messages[] $messages
 * @property Paymentmethods[] $paymentmethods
 * @property Payoutmethods[] $payoutmethods
 * @property Reservations[] $reservations
 * @property Reviews[] $reviews
 * @property Shippingaddress[] $shippingaddresses
 * @property Userinvitecredits[] $userinvitecredits
 * @property Userinvites[] $userinvites
 * @property Country $country0
 */
class Users extends \yii\db\ActiveRecord
{

    private $_user;
       
    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return 'hts_users';
    }

    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['verify_pass', 'verify_passcode', 'country', 'modified_at', 'last_login', 'facebookid', 'activation', 'phoneno', 'emergencyno', 'shippingid', 'loginnotify', 'mobileverify', 'emailverify','privilige_id', 'reservationrequirement'], 'integer'],
            [['firstname', 'lastname', 'email', 'password'],'required'],
            [['email'],'unique'],
            [['email'],'email'],
            [['notifications', 'emailsettings'], 'string'],
            [['firstname', 'lastname', 'city', 'state'], 'string', 'max' => 40],
            [['username'], 'string', 'max' => 15],
            [['emergencyemail', 'workemail'], 'string', 'max' => 150],
            [['password', 'profile_image', 'googleid', 'verifycode'], 'string', 'max' => 50],
            [['birthday', 'login_type', 'gender', 'verifyno'], 'string', 'max' => 10],
            [['user_level'],'string','max' => 40],
            [['userstatus', 'hoststatus'], 'string', 'max' => 1],
            [['address1', 'address2', 'emergencyname', 'emergencyrelation'], 'string', 'max' => 60],
            [['referrer_id', 'school', 'work', 'timezone', 'language'], 'string', 'max' => 100],
            [['credit_total'], 'string', 'max' => 45],
            [['paypalid'], 'string', 'max' => 150],
            [['about'], 'string', 'max' => 180],
            [['pushnotification', 'socialconnections', 'findability'], 'string', 'max' => 3]
        ];
    }

    /**
     * @inheritdoc
     */
    public function attributeLabels()
    {
        return [
            'id' => 'ID',
            'firstname' => 'Firstname',
            'lastname' => 'Lastname',
            'username' => 'Username',
            'email' => 'Email',
            'password' => 'Password',
            'birthday' => 'Birthday',
            'userstatus' => 'Userstatus',
            'hoststatus' => 'Hoststatus',
            'verify_pass' => 'Verify Pass',
            'verify_passcode' => 'Verify Passcode',
            'profile_image' => 'Profile Image',
            'address1' => 'Address1',
            'address2' => 'Address2',
            'city' => 'City',
            'state' => 'State',
            'country' => 'Country',
            'created_at' => 'Created At',
            'modified_at' => 'Modified At',
            'last_login' => 'Last Login',
            'login_type' => 'Login Type',
            'facebookid' => 'Facebookid',
            'googleid' => 'Googleid',
            'referrer_id' => 'Referrer ID',
            'credit_total' => 'Credit Total',
            'gender' => 'Gender',
            'activation' => 'Activation',
            'user_level' => 'User Level',
            'phoneno' => 'Phoneno',
            'privilige_id' => 'Roles and Priviliges',
            'about' => 'About',
            'school' => 'School',
            'work' => 'Work',
            'timezone' => 'Timezone',
            'language' => 'Language',
            'emergencyno' => 'Emergencyno',
            'emergencyname' => 'Emergencyname',
            'emergencyemail' => 'Emergencyemail',
            'emergencyrelation' => 'Emergencyrelation',
            'shippingid' => 'Shippingid',
            'workemail' => 'Workemail',
            'pushnotification' => 'Pushnotification',
            'notifications' => 'Notifications',
            'emailsettings' => 'Emailsettings',
            'socialconnections' => 'Socialconnections',
            'findability' => 'Findability',
            'loginnotify' => 'Loginnotify',
            'mobileverify' => 'Mobileverify',
            'verifyno' => 'Verifyno',
            'emailverify' => 'Emailverify',
            'verifycode' => 'Verifycode',
            'reservationrequirement' => 'Reservationrequirement',
            'paypalid' => 'Paypalid'
        ];
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getListings()
    {
        return $this->hasMany(Listing::className(), ['userid' => 'id']);
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getLists()
    {
        return $this->hasMany(Lists::className(), ['userid' => 'id']);
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getMessages()
    {
        return $this->hasMany(Messages::className(), ['senderid' => 'id']);
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getPaymentmethods()
    {
        return $this->hasMany(Paymentmethods::className(), ['userid' => 'id']);
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getPayoutmethods()
    {
        return $this->hasMany(Payoutmethods::className(), ['userid' => 'id']);
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getReservations()
    {
        return $this->hasMany(Reservations::className(), ['userid' => 'id']);
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getReviews()
    {
        return $this->hasMany(Reviews::className(), ['userid' => 'id']);
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getShippingaddresses()
    {
        return $this->hasMany(Shippingaddress::className(), ['userid' => 'id']);
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getUserinvitecredits()
    {
        return $this->hasMany(Userinvitecredits::className(), ['userid' => 'id']);
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getUserinvites($id)
    {
        return Userinvites::find()->where(['userid' => $id])->all();
    }
    
    public function getUserinvite($id)
    {
        $userinvite = Userinvites::find()->where(['userid' => $id])->all();
        return count($userinvite);
    }    

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getCountry0()
    {
        return $this->hasOne(Country::className(), ['id' => 'country']);
    }
    
    public function login()
    {
       //if ($this->validate()) {

       if($this->getUser())
            return Yii::$app->user->login($this->getUser());
         else {
           return false;
        }
    }
    
    public static function findByEmail($email)
    {
         $user = User::find()->where(['email' => $email])
                    ->andWhere(['!=', 'user_level', 'normal'])
                    ->one();
		 return $user;
    }
	
    public static function findIdentity($id)
    {
         $user = User::find()->where(['id' => $id])->one();
		 return $user;
    }	
	
	public static function findblockusers()
	{
		$user = User::find()->where(['userstatus'=>'1'])
							->andWhere(['!=', 'user_level', 'god'])->all();
		return $user;
	}

    /*
        List moderators
    */
    public function findmoderators()
    {
        $user = User::find()->where(['userstatus'=>'1'])
                            ->andWhere(['=', 'user_level', 'moderator'])->all();
        return $user;   
    }
	
	public static function findunblockusers()
	{
		$user = User::find()->where(['userstatus'=>'0'])
							->andWhere(['!=', 'user_level', 'god'])->all();
		return $user;
	}	
    /**
     * Finds user by [[username]]
     *
     * @return User|null
     */
    protected function getUser()
    {
        if ($this->_user === null) {
            /*
            $this->_user = User::find()->where([
                'email' => $this->email,
                'user_level' => 'god',
                'username' => 'admin'
                ])
                ->orWhere(['and', [
                    'user_level' => 'moderator',
                    ]])
                ->One();
                */
                $this->_user = User::find()->where(['or',
                    ['user_level' => 'god'],
                    ['user_level' => 'moderator'],
                ])
                ->andWhere(['and', [
                    'email' => $this->email
                    ]])
                ->One();
        }
        return $this->_user;
    }    

    public function validatePassword($password) {
        return $this->password === static::hashPassword($password); //Check the hashed password with the password entered by user
    }

    public static function hashPassword($password) {// Function to create password hash
        return base64_encode( $password );
    }    
}
