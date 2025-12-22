<?php
namespace common\components;
use Yii;
use yii\base\Component;
require_once Yii::$app->basePath.'/../vendor/firebase/php-jwt/src/Key.php';
require_once Yii::$app->basePath.'/../vendor/firebase/php-jwt/src/JWT.php';
require_once Yii::$app->basePath.'/../vendor/firebase/php-jwt/src/ExpiredException.php';
require_once Yii::$app->basePath.'/../vendor/firebase/php-jwt/src/SignatureInvalidException.php';
require_once Yii::$app->basePath.'/../vendor/firebase/php-jwt/src/BeforeValidException.php';
use \Firebase\JWT\JWT;
use \Firebase\JWT\Key;
use \Firebase\JWT\ExpiredException;
use \Firebase\JWT\SignatureInvalidException;
use \Firebase\JWT\BeforeValidException;
use common\models\User;
use frontend\models\Sitesettings;
use DomainException;
class JWTAuth extends Component {
	public static function getToken($userId) {
		$user = User::findOne($userId);
		// echo '<pre>'; print_r($user); die;
		$siteSettings = Sitesettings::find()->orderBy(['id' => SORT_DESC])->one();
		$key = (string)$siteSettings->jwt_key;
		$url = Yii::$app->urlManager->createAbsoluteUrl('');
		$now = time();
		$jwtConfig = array(
			"iss" => $url,
			"aud" => $url,
			"iat" => $now,
			"nbf" => $now,
			//"exp" => $now + (60*1), // 1 mint time to expiry
		);
		$token = JWT::encode($jwtConfig, $key, 'HS256');
		// echo $token; die;
		$user->access_token = $token;
		$user->save(false);
		return $token;
	}
	public static function getTokenStatus($userId = "1") {
		// return true; die;
		$headers = apache_request_headers();
        $token = !empty($headers['Authorization']) ? $headers['Authorization'] : "";
		// echo 'token - '.$token; die;
		if(empty($token))
		{
			return false;
		}
		$userdetail = User::find()->where(['id' => $userId,'access_token' => $token])->one();
		$siteSettings = Sitesettings::find()->orderBy(['id' => SORT_DESC])->one();
		$key = (string)$siteSettings->jwt_key;
		if(!empty($userdetail)) {
			try{
				$decoded = JWT::decode($token, new Key($key, 'HS256'));
				$decoded_array = (array) $decoded;
				if(!empty($decoded_array)) {
					return true;
				} else {
					return false;
				}
			} catch (ExpiredException $e) {
				return false;
			} catch (DomainException $e) {
				return false;
			} catch (SignatureInvalidException $e) {
				return false;
			} catch (BeforeValidException $e) {
				return false;
			}
		} else {
			return false;
		}
	}
}
?>
