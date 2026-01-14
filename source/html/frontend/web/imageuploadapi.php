<?php
@$ftmp = $_FILES['images']['tmp_name'];
@$oname = $_FILES['images']['name'];
@$fname = $_FILES['images']['name'];
@$fsize = $_FILES['images']['size'];
@$ftype = $_FILES['images']['type'];
$userid = $_REQUEST['user_id'];
$type = $_REQUEST['type'];
$stripedoc = $_REQUEST['doctype']; 
// idfrontfile || idbackfile || addrfrontfile || addrbackfile
$siteurl = $_REQUEST['sitename'];


$ext = strrchr($oname, '.');
$appImageValues = getimagesize($ftmp); 

$extensionarray = array('.jpg', '.png', '.jpeg');
$stripeextensionarray = array('.jpg', '.png');

$imageSize = ($fsize / 1024) / 1024;


if($appImageValues[0] > 0 && $appImageValues[1] > 0 && !empty($appImageValues) >= 6) { 
			
	$uploadFlag = 0;

	if($type=="user" && in_array($ext, $extensionarray) && (end($appImageValues) == "image/jpeg" || end($appImageValues) == "image/png") && $imageSize < 2) {
		$user_image_path = "albums/images/users/";
		$imagename = productSlug($oname);
		$newname = time().$userid.'_'.$imagename.$ext;
		$resultarray['name'] = $newname;
		$resultarray['image'] = $siteurl.'/albums/images/users/'.$newname;
		$uploadFlag = 1;
	}else if($type=="stripe" && in_array($ext, $stripeextensionarray) && (end($appImageValues) == "image/jpeg" || end($appImageValues) == "image/png") && $imageSize < 5) { 
		$user_image_path = "albums/images/stripe/";
		$imagename = trim($stripedoc); 
		$newname = time().$userid.'_'.$imagename.$ext;
		$resultarray['name'] = $newname;
		$resultarray['image'] = $siteurl.'/albums/images/stripe/'.$newname;
		$filePath = $user_image_path.$newname;
		if(file_exists($filePath)) {
			unlink($filePath);   	
		} 
		$uploadFlag = 1;
	} else if($type=="listing" && $imageSize < 2) {
		$imagecount = $_REQUEST['imagecount'];
		$user_image_path = "albums/images/listings/";
		$newname = time().'_'.$userid.'_'.$imagecount.$ext;
		$resultarray['name'] = $newname;
		$resultarray['image'] = $siteurl.'/albums/images/listings/'.$newname;
		$uploadFlag = 1;
	} 
	if($uploadFlag == 1) {
		$resultarr = json_encode($resultarray);
		$result = move_uploaded_file($ftmp,$user_image_path.$newname);
		chmod ( $filePath, 0777 );   
		$uploadFlag = 0; //optional

		if($result) {
			echo '{"status":"true","result":'.$resultarr.'}';
		} else {
			echo '{"status":"false","message":"Sorry, Something went to be wrong"}';  
		}
	} else {
		echo '{"status":"false","message":"Sorry, Something went to be wrong"}';
	}
} else {
	echo '{"status":"false","message":"Sorry, Something went to be wrong"}';
} 

function productSlug($str) {
	$old = $str;
	$str = strtolower(trim($str));
	$str = preg_replace('/[^a-z0-9-]/', '', $str);
	$str = preg_replace('/-+/', "", $str);
	$str = substr($str, 0, 10);
	if(!empty($str))
	return $str;
	else return trim($old);
}
?> 