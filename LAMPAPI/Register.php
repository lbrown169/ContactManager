
<?php

$inData = getRequestInfo();

$firstName = $inData["firstName"];
$lastName = $inData["lastName"];
$login = $inData["login"];
$password = $inData["password"];

switch (null) {
	case $firstName:
		http_response_code(400);
		returnWithError("missing parameter firstName");
		return;
	case $lastName:
		http_response_code(400);
		returnWithError("missing parameter lastName");
		return;
	case $login:
		http_response_code(400);
		returnWithError("missing parameter login");
		return;
	case $password:
		http_response_code(400);
		returnWithError("missing parameter password");
		return;
}

$conn = new mysqli("localhost", "WebApp", "WebBackend1", "COP4331");
if ($conn->connect_error) {
	http_response_code(500);
	returnWithError($conn->connect_error);
} else {
	// First check if user exists
	$stmt = $conn->prepare("SELECT ID FROM Users WHERE Login=?");
	$stmt->bind_param("s", $inData["login"]);
	$stmt->execute();
	$result = $stmt->get_result();

	if ($row = $result->fetch_assoc()) {
		http_response_code(409);
		returnWithError("username is taken");
		return;
	}

	$stmt = $conn->prepare("INSERT into Users (FirstName,LastName,Login,Password) VALUES(?,?,?,?)");
	$stmt->bind_param("ssss", $firstName, $lastName, $login, $password);
	$stmt->execute();
	$stmt->close();
	$conn->close();

	http_response_code(201);
	returnWithError("");
}

function getRequestInfo()
{
	return json_decode(file_get_contents('php://input'), true);
}

function sendResultInfoAsJson($obj)
{
	header('Content-type: application/json');
	echo $obj;
}

function returnWithError($err)
{
	$retValue = '{"error":"' . $err . '"}';
	sendResultInfoAsJson($retValue);
}
?>
