<?php
namespace yii\xupload\actions\php;

// Include the AWS SDK using the Composer autoloader
require(\Yii::$app->basePath . '/../vendor/aws/vendor/autoload.php');

use Yii;
use yii\base\Action;
use yii\web\UploadedFile;
use yii\web\HttpException;
use yii\helpers\Json;
use \frontend\modules\albums\models\Albums;
use \frontend\modules\profile\models\Profile;
use \frontend\modules\agent\models\Agent;
use Aws\S3\S3Client;
use Aws\Common\Enum\Region;
use Aws\Common\Aws;
use Aws\S3\Enum\CannedAcl;
use Aws\S3\Exception\S3Exception;
use Guzzle\Http\EntityBody;

/**
 * XUploadAction
 * =============
 * Basic upload functionality for an action used by the xupload extension.
 *
 * XUploadAction is used together with XUpload and XUploadForm to provide file upload funcionality to any application
 *
 * You must configure properties of XUploadAction to customize the folders of the uploaded files.
 *
 * Using XUploadAction involves the following steps:
 *
 * 1. Override Controller::actions() and register an action of class XUploadAction with ID 'upload', and configure its
 * properties:
 * ~~~
 * [php]
 * class MyController extends Controller
 * {
 *     public function actions()
 *	{
 *		return [
 *		//	'action1' => 'app\components\Action1',
 *		//  'property1' => 'value1',
 *		//  'property2' => 'value2',
 *	      'upload' => [
 *	          'class' => 'yii\xupload\actions\php\XUploadAction',
 *	          'path' => \Yii::$app -> getBasePath() . DIRECTORY_SEPARATOR.'albums'.DIRECTORY_SEPARATOR.'images',
 *	          'publicPath' => \Yii::$app->getHomeUrl().DIRECTORY_SEPARATOR.'albums'.DIRECTORY_SEPARATOR.'images',
 *	          'subfolderVar' => "parent_id",
 *	      ],
 *	  ];
 *	}
 *  public function actionCreate()
 *	{
 *		$model = new Albums;
 *		$model = new \yii\xupload\models\XUploadForm;
 *		$model->profile_id = '000';//vk todo testing
 *		return $this->render('create', [
 *				'model' => $model,
 *				]);
 *	}
 * }
 * 
 *
 * 2. In the form model, declare an attribute to store the uploaded file data, and declare the attribute to be validated
 * 	  by the 'file' validator.
 * 3. In the controller 'view', insert a XUpload widget.
 *		<?php $form = ActiveForm::begin([
 *		'options' => ['id' => 'fileupload', 'enctype' => 'multipart/form-data']	
 *	//	'fieldConfig' => ['class' => ActiveField::className()],
 *	]); ?>
 *	$upload = new yii\xupload\models\XUploadForm;
 *			 echo yii\xupload\XUpload::widget([
 *							'url' => \Yii::$app->getUrlManager()->createUrl("albums/albums/upload"),
 *							'model' => $upload,
 *							'attribute' => 'file',
 *	 						'multiple' => true,
 *							'clientOptions'=> [
 *									'maxNumberOfFiles' => 4,
 *									'maxFileSize'=>2000000,
 * 									'acceptFileTypes' =>  new yii\web\JsExpression('/(\.|\/)(gif|jpe?g|png)$/i'),
 *							//		'beforeSend' => 'js:function(event, files, index, xhr, handler, callBack) {
 *							//		handler.uploadRow.find(".upload_start button").click(callBack);
 *							//		}',
 *									'onComplete' => new yii\web\JsExpression('function (event, files, index, xhr, handler, callBack) {
 *									$("#photo").hide().html(\'<img src="../../images/profiles/\'+handler.response.name +\'?\'+ d.getTime() +\'"/>\' ).fadeIn(\'fast\');
 *									}')],
 *				]);
 * ###Resources
 * - [xupload](http://www.yiiframework.com/extension/xupload)
 *
 * @version 0.3
 * @author Asgaroth (http://www.yiiframework.com/user/1883/)
 */
class XUploadAction extends Action {

    /**
     * XUploadForm (or subclass of it) to be used.  Defaults to XUploadForm
     * @see XUploadAction::init()
     * @var string
     * @since 0.5
     */
    public $formClass = 'yii\xupload\models\XUploadForm'; //'xupload.models.XUploadForm';

    /**
     * Name of the model attribute referring to the uploaded file.
     * Defaults to 'file', the default value in XUploadForm
     * @var string
     * @since 0.5
     */
    public $fileAttribute = 'file';

    /**
     * Name of the model attribute used to store mimeType information.
     * Defaults to 'mime_type', the default value in XUploadForm
     * @var string
     * @since 0.5
     */
    public $mimeTypeAttribute = 'mime_type';

    /**
     * Name of the model attribute used to store file size.
     * Defaults to 'size', the default value in XUploadForm
     * @var string
     * @since 0.5
     */
    public $sizeAttribute = 'size';

    /**
     * Name of the model attribute used to store the file's display name.
     * Defaults to 'name', the default value in XUploadForm
     * @var string
     * @since 0.5
     */
    public $displayNameAttribute = 'name';

    /**
     * Name of the model attribute used to store the file filesystem name.
     * Defaults to 'filename', the default value in XUploadForm
     * @var string
     * @since 0.5
     */
    public $fileNameAttribute = 'filename';

    /**
     * The query string variable name where the subfolder name will be taken from.
     * If false, no subfolder will be used.
     * Defaults to null meaning the subfolder to be used will be the result of date("mdY").
     *
     * @see XUploadAction::init().
     * @var string
     * @since 0.2
     */
    public $subfolderVar;

    /**
     * Path of the main uploading folder.
     * @see XUploadAction::init()
     * @var string
     * @since 0.1
     */
    public $path;

    /**
     * Public path of the main uploading folder.
     * @see XUploadAction::init()
     * @var string
     * @since 0.1
     */
    public $publicPath;

    /**
     * @var boolean dictates whether to use sha1 to hash the file names
     * along with time and the user id to make it much harder for malicious users
     * to attempt to delete another user's file
     */
    public $secureFileNames = false;

    /**
     * Name of the state variable the file array is stored in
     * @see XUploadAction::init()
     * @var string
     * @since 0.5
     */
    public $stateVariable = 'xuploadFiles';

    /**
     * The resolved subfolder to upload the file to
     * @var string
     * @since 0.2
     */
    private $_subfolder = "";

    /**
     * The form model we'll be saving our files to
     * @var CModel (or subclass)
     * @since 0.5
     */
    private $_formModel;
    public $folder_name = 'folder_name';
    private $_defaultImage = "";
    private $_defaultImageId = "";
    
    private $_profileId;
    private $_userId;
    private $_isAgent;
    /**
     * Initialize the propeties of pthis action, if they are not set.
     *
     * @since 0.1
     */
    
    public function init( ) {
    	if( !isset( $this->path ) ) {
            $this->path = realpath( Yii::$app->getBasePath( )."/../uploads" );
        }
        if( !is_dir( $this->path ) ) {
        	mkdir( $this->path, 0777, true );
            chmod ( $this->path , 0777 );
            //throw new CHttpException(500, "{$this->path} does not exists.");
        } else if( !is_writable( $this->path ) ) {
            chmod( $this->path, 0777 );
            //throw new CHttpException(500, "{$this->path} is not writable.");
        }
        if( $this->subfolderVar === null ) {
            $this->_subfolder = Yii::$app->request->get( $this->subfolderVar, date( "mdY" ) );
        } else if($this->subfolderVar !== false ) {
            $this->_subfolder = date( "mdY" );
        }
        if( !isset($this->_formModel)) {
            $this->formModel = Yii::createObject(['class'=>$this->formClass]);
        }
        if($this->secureFileNames) {
            $this->formModel->secureFileNames = true;
        }
    }

    /**
     * The main action that handles the file upload request.
     * @since 0.1
     * @author Asgaroth
     */
    public function run( ) {
	    	$this->_profileId = Yii::$app->session->get('profileId');
    		$this->_userId = Yii::$app->user->id;
    		$this->_isAgent = Yii::$app->session->get('isAgent');
        $this->sendHeaders();
        $this->handleDeleting() or $this->handleUploading();
    }
    protected function setProfileImage($albmsmodel){
    	$userModel = '';
    	$sqlActivate = '';
    	if($this->_isAgent){
    		$userModel = \frontend\modules\agent\models\Agent::find(['_id' =>new \MongoId( $albmsmodel->profile_id)]);
    	}else {
    		$userModel =  \frontend\modules\profile\models\Profile::find(['_id' => new \MongoId($albmsmodel->profile_id)]);
    	}
    	if(empty($userModel->profile_image)){
    		$userModel->profile_image = $this->_defaultImage;
    		$userModel->save(false);
	    		$albmsmodel->profile_image =1;
	    		$albmsmodel->save();
    	}
    }

    protected function sendHeaders()
    {
        header('Vary: Accept');
        if (isset($_SERVER['HTTP_ACCEPT']) && (strpos($_SERVER['HTTP_ACCEPT'], 'application/json') !== false)) {
            header('Content-type: application/json');
        } else {
            header('Content-type: text/plain');
        }
    }
    /**
     * Removes temporary file from its directory and from the session
     *
     * @return bool Whether deleting was meant by request
     */
    protected function handleDeleting()
    {
        if (isset($_GET["_method"]) && $_GET["_method"] == "delete") {
            $success = false;
            if ($_GET["file"][0] !== '.' && Yii::$app->session->has($this->stateVariable)) {
                // pull our userFiles array out of state and only allow them to delete
                // files from within that array
                //bug here - fix is - put  sequentialUploads: true, in jquery.fileupload.js
                
                $userFiles = Yii::$app->session->get($this->stateVariable, []);
                if ($this->fileExists($userFiles[$_GET["file"]])) {
							
                	$tempVariable = $userFiles[$_GET["file"]];
                	$success = $this->deleteFile($userFiles[$_GET["file"]]);
                    if ($success) {
                    	unset($userFiles[$_GET["file"]]); // remove it from our session and save that info
                    	Yii::$app->session->remove($this->stateVariable);
                        Yii::$app->session->set($this->stateVariable, $userFiles);
     		       		$deldbimage= Albums::find(array('image_name' => $tempVariable["filename"]));  
     		       		$deldbimage->delete();
	                }
                }
            }
            $this->deleteFromAWSS3($tempVariable["fldrname"] , $tempVariable["filename"]);
            echo Json::encode($success);
            return true;
        }
        return false;
    }
    
    /**
     * Uploads file to temporary directory
     *
     * @throws CHttpException
     */
    protected function handleUploading()
    {
        $this->init();
        $model = $this->formModel;
        
        $model->{$this->fileAttribute} = UploadedFile::getInstance($model, $this->fileAttribute);
        if ($model->{$this->fileAttribute} !== null) {
        	$model->{$this->mimeTypeAttribute} = $model->{$this->fileAttribute}->type;
            $model->{$this->sizeAttribute} = $model->{$this->fileAttribute}->size;
            $model->{$this->displayNameAttribute} = $model->{$this->fileAttribute}->name;
            echo Yii::trace(\yii\helpers\VarDumper::dumpAsString($model->{$this->fileAttribute}->name),'xxxxxxxxxx');
            $model->{$this->fileNameAttribute} = $model->{$this->displayNameAttribute};

            if ($model->validate()) {

                $path = $this->getPath();

                if (!is_dir($path)) {
                    mkdir($path, 0777, true);
                    chmod($path, 0777);
                }

             //   $model->{$this->fileAttribute}->saveAs($path . $model->{$this->fileNameAttribute});
           //     chmod($path . $model->{$this->fileNameAttribute}, 0777);

     // /* ******************* Custom code to update Albums model and save files with required name to the project path *******************
                   $albmsmodel = new Albums();
			       
			       $pathinfo=$model->{$this->fileNameAttribute};
			       
			       if(($pos=strrpos($pathinfo,'.'))!==false)
			       	$fileextension=substr($pathinfo,$pos+1);
			       
			       $fileextension = strtolower($fileextension);
			       
			//       $imagename = $this->_userId.'_'.$this->_profileId ."_image.".$fileextension;
			       $imagename = "image.".$fileextension;
			       
			       $albmsmodel->user_id = $this->_userId;
			       $albmsmodel->profile_id = $this->_profileId;
			       $albmsmodel->image_name = $imagename;
				   $albmsmodel->image_folder= $this->_subfolder;
				   $albmsmodel->profile_image= 0;
			       $albmsmodel->save();
			       
			       $imagename = $albmsmodel->_id.'_'. $imagename;
			       
			       $albmsmodel->image_name = $imagename;
			       $albmsmodel->save();

			       $this->_defaultImage = $albmsmodel->image_folder.$imagename;
			       $this->_defaultImageId = $albmsmodel->_id;
			       
			      // $model->{$this->fileAttribute}->saveAs($path .$imagename);
			       //chmod($path . $imagename, 0777);
			       $model->{$this->fileNameAttribute} = $imagename;
			      // $model->{$this->displayNameAttribute} = $albmsmodel->id;
			       
	// Below resize code is causing error (firebug)
			   //    $image = Yii::$app->image->load($path .$imagename);
			   //	$image->resize(500, 500)->rotate(45)->quality(75)->sharpen(20);
			  //     $image->resize(1000, 1000);
			  //     $image->save($path .$imagename);
			       
			       $this->uploadToAWSS3($model->{$this->fileAttribute}->tempName , $this->_subfolder,$imagename);
			       //$this->uploadToAWSS3($path.$imagename , $this->_subfolder,$imagename);

			       $thumbName = 'thumb_'.$imagename;

			       $thumb=Yii::$app->image->load($model->{$this->fileAttribute}->tempName);
			       
//			       $thumb=\yii\phpthumb\PhpThumb::create($model->{$this->fileAttribute}->tempName);
			       $thumb->resize(100,100);
			       $thumb->save($path.$thumbName);
			       chmod($path . $thumbName, 0777);
    
			       $this->uploadToAWSS3($path.$thumbName , $this->_subfolder,$thumbName);
			       
			    $returnValue = $this->beforeReturn();
                if ($returnValue === true) {
                    echo Json::encode(['files' =>[[
                       "name" => $model->{$this->displayNameAttribute},
                        "type" => $model->{$this->mimeTypeAttribute},
                        "size" => $model->{$this->sizeAttribute},
                    	"url" => $this->getFileUrl("http://albums.matchlink.in/images/".$this->_subfolder.'/'.$imagename),
               	        "thumbnailUrl" => $this->getFileUrl("http://albums.matchlink.in/images/".$this->_subfolder.'/thumb_'.$imagename),
                        "deleteUrl" => \Yii::$app->getUrlManager()->createUrl($this->getUniqueId(), array(
                            "_method" => "delete",
                            "file" => $model->{$this->fileNameAttribute},
                        )),
                        "deleteType" => "POST"
    	                ]]]);
                } else {
                    echo Json::encode([["error" => $returnValue,]]);
                   // Yii::log("XUploadAction: " . $returnValue, Logger::LEVEL_ERROR, "xupload.actions.XUploadAction");
                }
                //set profile image
                $this->setProfileImage($albmsmodel);
            } else {
                echo Json::encode([["error" => $model->getErrors($this->fileAttribute),]]);
              //  Yii::log("XUploadAction: " . CVarDumper::dumpAsString($model->getErrors()), CLogger::LEVEL_ERROR, "xupload.actions.XUploadAction");
            }
        } else {
            throw new HttpException(500, "Could not upload file");
        }
    }

    /**
     * We store info in session to make sure we only delete files we intended to
     * Other code can override this though to do other things with state, thumbnail generation, etc.
     * @since 0.5
     * @author acorncom
     * @return boolean|string Returns a boolean unless there is an error, in which case it returns the error message
     */
    protected function beforeReturn() {
        $path = $this->getPath();

        // Now we need to save our file info to the user's session
        $userFiles = Yii::$app->session->get( $this->stateVariable);

        $userFiles[$this->formModel->{$this->fileNameAttribute}] = [
            "path" => $path.$this->formModel->{$this->fileNameAttribute},
            //the same file or a thumb version that you generated
            "thumb" => $path."thumb_".$this->formModel->{$this->fileNameAttribute},
            "filename" => $this->formModel->{$this->fileNameAttribute},
            'size' => $this->formModel->{$this->sizeAttribute},
            'mime' => $this->formModel->{$this->mimeTypeAttribute},
            'name' => $this->formModel->{$this->displayNameAttribute},
            "fldrname" => $this->_subfolder,
        ];
        
        Yii::$app->session->set( $this->stateVariable, $userFiles );

        return true;
    }

    /**
     * Returns the file URL for our file
     * @param $fileName
     * @return string
     */
    protected function getFileUrl($fileName) {
        //return $this->getPublicPath().$fileName;
        //Calling action to render image, so adjusting path to send only required parameters - matchlink
        return $fileName;
    }

    /**
     * Returns the file's path on the filesystem
     * @return string
     */
    protected function getPath() {
    	$path = ($this->_subfolder != "") ? "{$this->path}/{$this->_subfolder}/" : "{$this->path}/";
        return $path;
    }

    /**
     * Returns the file's relative URL path
     * @return string
     */
    protected function getPublicPath() {
        return ($this->_subfolder != "") ? "{$this->publicPath}/{$this->_subfolder}/" : "{$this->publicPath}/";
    }

    /**
     * Deletes our file.
     * @param $file
     * @since 0.5
     * @return bool
     */
    protected function deleteFile($file) {
    //	unlink($file['thumb']);
        return unlink($file['thumb']);
    }

    /**
     * Our form model setter.  Allows us to pass in a instantiated form model with options set
     * @param $model
     */
    public function setFormModel($model) {
        $this->_formModel = $model;
    }

    public function getFormModel() {
        return $this->_formModel;
    }

    /**
     * Allows file existence checking prior to deleting
     * @param $file
     * @return bool
     */
    protected function fileExists($file) {
       // return is_file( $file['path'] );
    	return is_file( $file['thumb'] );
    }
    /**
     * $localFilePath - Full path of local file name
     *  $s3FolderName - Folder to create in S3 bucket
     *  $s3fileName - File Name to create in S3 bucket
     */
    protected function uploadToAWSS3($localFilePath, $s3FolderName, $s3fileName){
    
    	// Instantiate an S3 client
    	$aws = Aws::factory(\Yii::$app->basePath.'/config/aws-config.php');
    	$s3Client = $aws->get('s3');
    	 
    	try {
    		$bucketname = 'albums.matchlink.in';  //must be all lowercase
    		$s3filePath = 'images/'.$s3FolderName.DIRECTORY_SEPARATOR.$s3fileName;
    		$s3Client->putObject(array(
    				'Bucket' => $bucketname,
    				'Key'    => $s3filePath,
    				'Body'   => EntityBody::factory(fopen($localFilePath, 'r')),
    				'ACL'    => CannedAcl::PUBLIC_READ_WRITE,
    				'ContentType' => 'image/jpeg'
    		));
    		 
    	} catch (S3Exception $e) {
    		echo $e;
    	}
    }
    
    /**
     *
     *  $s3FolderName - Folder Name in S3 bucket
     *  $s3fileName - File Name in S3 bucket
     */
    protected function deleteFromAWSS3($s3FolderName, $s3fileName){
    	// Instantiate an S3 client
    	$aws = Aws::factory(\Yii::$app->basePath.'/config/aws-config.php');
    	$s3Client = $aws->get('s3');
    
    	try {
    		$bucketname = 'albums.matchlink.in';  //must be all lowercase
    
    		$s3filePath = 'images/'.$s3FolderName.DIRECTORY_SEPARATOR.$s3fileName;
    		$s3ThumbPath = 'images/'.$s3FolderName.DIRECTORY_SEPARATOR.'thumb_'.$s3fileName;
    
    		echo Yii::trace(\yii\helpers\VarDumper::dumpAsString($s3filePath),'vardump');
    		echo Yii::trace(\yii\helpers\VarDumper::dumpAsString($s3ThumbPath),'vardump');
    		
    		$response = $s3Client->deleteObjects(array(
    				'Bucket' => $bucketname,
    				'Quiet' => true,
    				'Objects' => array(
    						array('Key'=>$s3filePath),
    						array('Key'=>$s3ThumbPath),
    				)
    		)
    		);
    		echo Yii::trace(\yii\helpers\VarDumper::dumpAsString($response),'vardump');
    		
    	} catch (S3Exception $e) {
    		echo $e;
    	}
    }
    
}
