<?php
$inData = getRequestInfo();

$userId = $inData["userId"];
$firstName = $inData["firstName"];
$lastName = $inData["lastName"];
$phone = $inData["phone"];
$email = $inData["email"];

switch (null) {
    case $userId:
        http_response_code(401);
        returnWithError("missing parameter userId");
        return;
    case $firstName:
        http_response_code(400);
        returnWithError("missing parameter firstName");
        return;
    case $lastName:
        http_response_code(400);
        returnWithError("missing parameter lastName");
        return;
    case $phone:
        http_response_code(400);
        returnWithError("missing parameter phone");
        return;
    case $email:
        http_response_code(400);
        returnWithError("missing parameter email");
        return;
}

$conn = new mysqli("localhost", "WebApp", "WebBackend1", "COP4331");
if ($conn->connect_error) {
    http_response_code(500);
    returnWithError($conn->connect_error);
} else {
    $stmt = $conn->prepare("INSERT into Contacts (UserId,FirstName,LastName,Phone,Email) VALUES(?,?,?,?,?)");
    $stmt->bind_param("sssss", $userId, $firstName, $lastName, $phone, $email);
    $stmt->execute();
    $stmt->close();
    $conn->close();
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
