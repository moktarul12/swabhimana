<?php

namespace yii\xupload;

use yii\helpers\Html;
use yii\helpers\Json;
use yii\jui\InputWidget;


class XUpload extends InputWidget
{

	/**
	 * the url to the upload handler
	 * @var string
	 */
	public $url;
	
	/**
	 * set to true to use multiple file upload
	 * @var boolean
	 */
	public $multiple = false;
	
	/**
	 * The upload template id to display files available for upload
	 * defaults to null, meaning using the built-in template
	 */
	public $uploadTemplate;
	
	/**
	 * The template id to display files available for download
	 * defaults to null, meaning using the built-in template
	 */
	public $downloadTemplate;
	
	/**
	 * Wheter or not to preview image files before upload
	 */
	public $previewImages = true;
	
	/**
	 * Wheter or not to add the image processing pluing
	 */
	public $imageProcessing = true;
	
	/**
	 * set to true to auto Uploading Files
	 * @var boolean
	 */
	public $autoUpload = false;
	
	/**
	 * @var string name of the form view to be rendered
	 */
	public $formView = 'form';
	
	/**
	 * @var string name of the upload view to be rendered
	 */
	public $uploadView = 'upload';
	
	/**
	 * @var string name of the download view to be rendered
	 */
	public $downloadView = 'download';
	
	/**
	 * @var bool whether form tag should be used at widget
	 */
	public $showForm = true;
	

	/**
	 * Publishes the required assets
	 */
    public function init()
    {
    	parent::init();
    }
    
    public function run()
    {
    	
    	$model = $this -> model;

    	if ($this -> uploadTemplate === null) {
    		$this -> uploadTemplate = "#template-upload";
    	}
    	if ($this -> downloadTemplate === null) {
    		$this -> downloadTemplate = "#template-download";
    	}
    	
    	if (!isset($this -> clientOptions['enctype'])) {
    		$this -> clientOptions['enctype'] = 'multipart/form-data';
    	}
    	
    	if (!isset($this -> clientOptions['id'])) {
    		$this -> clientOptions['id'] = get_class($model) . "-form";
    	}
    	
    	$this->options['url'] = $this->url;
    	$this->options['autoUpload'] = $this -> autoUpload;
    	
    	if (!$this->multiple) {
    		$this->options['maxNumberOfFiles'] = 1;
    	}
    	

    	
    	$htmlOptions = array();
    	if ($this -> multiple) {
    		$this -> options['multiple'] = true;
    		/* if($this->hasModel()){
    		 $this -> attribute = "[]" . $this -> attribute;
    		}else{
    		$this -> attribute = "[]" . $this -> name;
    		}*/
    	}
    	
    	$this->registerWidget('fileupload', XUploadAsset::className());
    	$this -> options = \yii\helpers\ArrayHelper::merge($this -> options, $this -> clientOptions);
    	$options = Json::encode($this -> options);
    	echo \Yii::trace(\yii\helpers\VarDumper::dumpAsString($this -> options),'aaaaaaa');
    	echo $this->render($this->formView,['model' => $this->model, 'attribute' => $this->attribute, 'options'=>$this->options]);
    	echo $this -> render($this->uploadView);
    	echo $this -> render($this->downloadView);
    	

    	 
    	$this->getView()->registerJs("jQuery('#fileupload').fileupload({$options});");
 //   	$this->getView()->registerJs("jQuery('.fileupload-{$this->attribute}').fileupload({$options})");
    	
   // 	echo $this->renderWidget() . "\n";
    }

    /**
     * Renders the XUpload widget.
     * @return string the rendering result.
     */
    public function renderWidget()
    {
    	$contents = [];
		if ($this->hasModel()) {
			$contents[] =  Html::activeTextInput($this->model, $this->attribute, $this->options);
		} else {
			$contents[] = Html::textInput($this->name, $this->value, $this->options);
		}
		return implode("\n", $contents);
	}
}



