<?php 
class final_rest
{



/**
 * @api  /api/v1/setTemp/
 * @apiName setTemp
 * @apiDescription Add remote temperature measurement
 *
 * @apiParam {string} location
 * @apiParam {String} sensor
 * @apiParam {double} value
 *
 * @apiSuccess {Integer} status
 * @apiSuccess {string} message
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *              "status":0,
 *              "message": ""
 *     }
 *
 * @apiError Invalid data types
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 200 OK
 *     {
 *              "status":1,
 *              "message":"Error Message"
 *     }
 *
 */
	public static function setTemp ($location, $sensor, $value) {
		if (!is_numeric($value)) {
			$retData["status"]=1;
			$retData["message"]="'$value' is not numeric";
		}
		else {
			try {
				EXEC_SQL("insert into temperature (location, sensor, value, date) values (?,?,?,CURRENT_TIMESTAMP)",$location, $sensor, $value);
				$retData["status"]=0;
				$retData["message"]="insert of '$value' for location: '$location' and sensor '$sensor' accepted";
			}
			catch  (Exception $e) {
				$retData["status"]=1;
				$retData["message"]=$e->getMessage();
			}
		}

		return json_encode ($retData);
	}


	public static function signUp($name, $username, $password) {
		try {
			$EXIST=GET_SQL("select * from user where username=?",$username);
			if (count($EXIST) > 0) {
				$retData["status"]=1;
				$retData["message"]= "User $username exists";
			} else {
				EXEC_SQL("insert into user (name,username,password) values (?,?,?)",$name,$username, password_hash($password, PASSWORD_DEFAULT));
				$retData["status"]=0;
				$retData["message"]= "User $username Inserted";
			}


		} catch  (Exception $e) {
			$retData["status"]=1;
			$retData["message"]=$e->getMessage();
		}

	return json_encode ($retData);
	}

	public static function login($username, $password) {
		try {
			$USER=GET_SQL("select * from user where username=?",$username);
			// GET_SQL returns a list of returned records
			// Each array element is an array of selected fields with column names as key
			if (count($USER) == 1) { // Check if record returned
				if (password_verify($password, $USER[0]["password"])) {
			    		$id = session_create_id();
			    		EXEC_SQL("update user set session=?, expiration= DATETIME(CURRENT_TIMESTAMP, '+30 minutes') where username=?",
			        		$id, $username);
					$retData["status"]=0;
					$retData["session"]=$id;
					$retData["message"]= "User '$username' logged in";
				}  else {
			        	$retData["status"]=1;
			        	$retData["message"]= "User/Password Not Found";

				}
			} else {
			    $retData["status"]=1;
			    $retData["message"]= "User/Password Not Found";
			}
		} catch (Exception $e) {
			$retData["status"]=1;
                        $retData["message"]=$e->getMessage();
		}

		return json_encode($retData);
	}

	public static function logout($username, $session) {
		try {
			$USER=GET_SQL("select * from user where username=? and session=? ",$username,$session);
			// GET_SQL returns a list of returned records
			// Each array element is an array of selected fields with column names as key
			if (count($USER) == 1) {
				EXEC_SQL("update user set session=null, expiration= null where username=?",
		        	$username);
		    		$retData["status"]=0;
		    		$retData["message"]= "User '$username' logged out";
		 	} else {
		        	$retData["status"]=1;
		        	$retData["message"]= "User Not Found";
		      	}
		} catch (Exception $e) {
			$retData["Status"]=1;
			$retData["message"]=$e->getMessage();
		}
		return json_encode($retData);
	}

	public static function addFavorite($username, $stock, $ticker) {
		try {
			$EXIST=GET_SQL("select * from userFavs where username=? AND stock=?",$username, $stock);
			if (count($EXIST) > 0) {
				$retData["status"]=1;
				$retData["message"]= "Stock $stock already a favorite";
			} else {
				EXEC_SQL("insert into userFavs (username,stock, ticker) values (?,?, ?)",$username,$stock, $ticker);
				$retData["status"]=0;
				$retData["message"]= "Stock $stock favorited";
			}
		} catch (Exception $e) {
			$retData["Status"]=1;
			$retData["message"]=$e->getMessage();
		}
		return json_encode($retData);
	}

	public static function logAction($username, $stock, $ticker, $action) {
		try {
			EXEC_SQL("insert into favoritesHistory (username, stock, ticker, action) values (?, ?, ?,?)", $username, $stock, $ticker, $action);
			$retData["status"]=0;
			$retData["message"]= "Added action $username $action $stock to history";
		} catch (Exception $e) {
			$retData["Status"]=1;
			$retData["message"]=$e->getMessage();
		}
		return json_encode($retData);
	}

	public static function getHistory($username, $date1, $date2, $sort) {
		try {
			
			if($sort == "asc") {
				$data = GET_SQL("select * from favoritesHistory where username=? and date between ? and ? order by date asc", $username, $date1, $date2);
			} else {
				$data = GET_SQL("select * from favoritesHistory where username=? and date between ? and ? order by date desc", $username, $date1, $date2);
			}
			$retData["status"]=0;
			$retData["message"]="Returned entries for $username between $date1 and $date2";
			$retData["data"]=$data;
		} catch (Exception $e) {
			$retData["Status"]=1;
			$retData["message"]=$e->getMessage();
		}
		return json_encode($retData);
	}

	public static function getFavorites($username) {
		try {
			$data = GET_SQL("select * from userFavs where username=?", $username);
			$retData["status"]=0;
			$retData["message"]="Favorites for user $username";
			$retData["data"]=$data;
		} catch (Exception $e) {
			$retData["Status"]=1;
			$retData["message"]=$e->getMessage();
		}
		return json_encode($retData);
	}

	public static function removeFavorite($username, $ticker) {
		try {
			$EXIST=GET_SQL("select * from userFavs where username=? and ticker=?", $username, $ticker);
			if(count($EXIST)> 0) {
				EXEC_SQL("delete from userFavs where username=? and ticker=?", $username, $ticker);
				$retData["status"]=0;
				$retData["message"]="Removed $ticker from $username favorites";
				$retData["data"]=$EXIST;
			} else {
				$retData["status"]=1;
				$retData["message"]="User or stock not found";
			}
		} catch (Exception $e) {
			$retData["Status"]=1;
			$retData["message"]=$e->getMessage();
		}
		return json_encode($retData);
	}
}