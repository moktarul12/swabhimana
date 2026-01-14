<?php
namespace frontend\models;
use Yii;
use common\models\User;
use yii\base\Model;

class Storage extends Model
{

  private $aws;
  private $s3;

   function __construct() {
     $this->aws = Yii::$app->awssdk->getAwsSdk();
     $this->s3 = $this->aws->createS3();
  }

  public function upload($bucket,$keyname,$filepath) {
    $result = $this->s3->putObject(array(
    'Bucket'       => $bucket,
    'Key'          => $keyname,
    'SourceFile'   => $filepath,
    'ContentType'  => 'text/plain',
    'ACL'          => 'public-read',
    'StorageClass' => 'REDUCED_REDUNDANCY',
    'Metadata'     => array(
        'param1' => 'value 1',
        'param2' => 'value 2'
    )
));
return $result;
  }
  
}