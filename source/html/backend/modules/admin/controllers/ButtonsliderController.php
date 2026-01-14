<?php

namespace backend\modules\admin\controllers;

/*
 * @Company: Hitasoft Technology Solutions Private Limited
 * @Framework : Yii
 * @Version: 2.0
 */

use Yii;
use backend\models\Buttonsliders;
use backend\models\Buttonsliderssearch;
use backend\models\Users;
use yii\web\Controller;
use yii\web\NotFoundHttpException;
use yii\filters\VerbFilter;
use yii\web\UploadedFile;

/**
 * ButtonsliderController implements the CRUD actions for Buttonsliders model.
 */
class ButtonsliderController extends Controller
{
    public function behaviors()
    {
        return [
            /*'verbs' => [
                'class' => VerbFilter::className(),
                'actions' => [
                    'delete' => ['post'],
                ],
            ],*/
        ];
    }

    public function beforeAction($action) {
        $this->enableCsrfValidation = false;
        if (Yii::$app->user->isGuest) {
          return $this->goHome ();
        } 

        return parent::beforeAction($action);
    }
    /**
     * Lists all Buttonsliders models.
     * @return mixed
     */
    public function actionIndex()
    {
        $searchModel = new Buttonsliderssearch();
        $dataProvider = $searchModel->search(Yii::$app->request->queryParams);

        return $this->render('index', [
            'searchModel' => $searchModel,
            'dataProvider' => $dataProvider,
        ]);
    }

    /**
     * Displays a single Buttonsliders model.
     * @param integer $id
     * @return mixed
     */
    public function actionView($id)
    {
        return $this->render('view', [
            'model' => $this->findModel($id),
        ]);
    }

    /**
     * Creates a new Buttonsliders model.
     * If creation is successful, the browser will be redirected to the 'view' page.
     * @return mixed
     */

    public function actionCreate()
{
    $model = new Buttonsliders();

    if (Yii::$app->request->isPost) {

        $path = Yii::getAlias('@backend/web/images/buttonsliders/');
        if (!is_dir($path)) {
            mkdir($path, 0777, true);
        }

        // ✅ Get uploaded file directly (NO XUploadForm)
        $file = UploadedFile::getInstanceByName('XUploadForm[file][0]');

        if ($file) {

            $allowedExtensions = ['jpg', 'jpeg', 'png'];

            if (in_array(strtolower($file->extension), $allowedExtensions)) {

                $imageInfo = getimagesize($file->tempName);

                if ($imageInfo !== false) {

                    $filename = time() . '.' . $file->extension;
                    $file->saveAs($path . $filename);
                    chmod($path . $filename, 0777);

                    $model->sliderimage = $filename;
                }
            }
        }

        // Save other fields
        $model->title       = $_POST['Buttonsliders']['title'] ?? '';
        $model->description = $_POST['Buttonsliders']['description'] ?? '';
        $model->buttonname  = $_POST['Buttonsliders']['buttonname'] ?? '';
        $model->buttonlink  = $_POST['Buttonsliders']['buttonlink'] ?? '';

        if ($model->sliderimage && $model->save(false)) {
            Yii::$app->session->setFlash('success', 'Slider added successfully');
        } else {
            Yii::$app->session->setFlash('error', 'Upload only valid image files');
        }

        return $this->redirect(['index']);
    }

    return $this->render('create', [
        'model' => $model
    ]);
}
    // public function actionCreate()
    // {
    //     $model = new Buttonsliders();
    //     if (Yii::$app->request->post () ) {
    //         $path = realpath ( Yii::$app->basePath . "/web/images/buttonsliders/" ) . "/";
    //         $models = new \yii\xupload\models\XUploadForm ();
    //         $webImage = UploadedFile::getInstances ( $models, 'file' );

    //         if(!empty($webImage))
    //         {
    //             $ext = $webImage[0]->extension;
    //             $allowedExtensions = array("jpg","jpeg","png");

    //             $webImageValues = array();
    //             $webImageValues = getimagesize($webImage[0]->tempName);
            
    //             if ($webImageValues[0] > "0" && $webImageValues[1] > "0" && (end($webImageValues) == "image/jpeg" || end($webImageValues) == "image/png") && count($webImageValues) >= 6 && in_array($ext, $allowedExtensions)) { 
    //                 $filename0 = time().".". $webImage[0]->extension;
    //                 $webImage[0]->saveAs ( $path . $filename0 );
    //                 chmod ( $path . $filename0, 0777 );
    //             }   
    //         }
    //         if(isset($filename0) && $filename0!="")
    //         {
    //             $model->sliderimage = $filename0;
    //             $model->title = $_POST['Buttonsliders']['title'];
    //             $model->description = $_POST['Buttonsliders']['description'];
    //             $model->buttonname = $_POST['Buttonsliders']['buttonname'];
    //             $model->buttonlink = $_POST['Buttonsliders']['buttonlink'];
    //             $model->save();
    //             Yii::$app->getSession ()->setFlash ( 'success', 'Slider added successfully' );
    //         } else {
    //             Yii::$app->getSession ()->setFlash ( 'success', 'Upload only image files' ); 
    //         }
    //         return $this->redirect(['index']);
    //     }
    //     return $this->render('create',[
    //             'model' => $model
    //             ]); 
    // } 

    /**
     * Updates an existing Buttonsliders model.
     * If update is successful, the browser will be redirected to the 'view' page.
     * @param integer $id
     * @return mixed
     */
 public function actionUpdate($id)
{
    $model = $this->findModel($id);

    if ($model->load(Yii::$app->request->post())) {

        $path = Yii::getAlias('@backend/web/images/buttonsliders/');
        if (!is_dir($path)) {
            mkdir($path, 0777, true);
        }

        // ✅ Get single uploaded file
        $webImage = UploadedFile::getInstanceByName('XUploadForm[file][0]');

        if ($webImage !== null) {

            $allowedExtensions = ['jpg', 'jpeg', 'png'];
            $ext = strtolower($webImage->extension);

            if (in_array($ext, $allowedExtensions)) {

                $imageInfo = getimagesize($webImage->tempName);

                if ($imageInfo !== false) {

                    $filename = time() . '.' . $ext;
                    $webImage->saveAs($path . $filename);
                    chmod($path . $filename, 0777);

                    // ✅ Update only if new image uploaded
                    $model->sliderimage = $filename;
                }
            }
        }

        // Save other fields normally
        $model->save(false);

        return $this->redirect(['view', 'id' => $model->id]);
    }

    return $this->render('update', [
        'model' => $model,
    ]);
}
    /**
     * Deletes an existing Buttonsliders model.
     * If deletion is successful, the browser will be redirected to the 'index' page.
     * @param integer $id
     * @return mixed
     */
    public function actionDelete($id)
    {
        $this->findModel($id)->delete();

        return $this->redirect(['index']);
    }

    /**
     * Finds the Buttonsliders model based on its primary key value.
     * If the model is not found, a 404 HTTP exception will be thrown.
     * @param integer $id
     * @return Buttonsliders the loaded model
     * @throws NotFoundHttpException if the model cannot be found
     */
    protected function findModel($id)
    {
        if (($model = Buttonsliders::findOne($id)) !== null) {
            return $model;
        } else {
            throw new NotFoundHttpException('The requested page does not exist.');
        }
    }
}
