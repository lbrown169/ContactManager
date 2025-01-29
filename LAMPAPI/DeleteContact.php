<?php
$inData = getRequestInfo();

$contactId = $inData["contactId"];

// Check for required contactId
if (null === $contactId) {
    http_response_code(400);
    returnWithError("missing parameter contactId");
    return;
}

$conn = new mysqli("localhost", "WebApp", "WebBackend1", "COP4331");
if ($conn->connect_error) {
    http_response_code(500);
    returnWithError($conn->connect_error);
    return;
}

try {

    $query = "DELETE FROM Contacts WHERE ID=?";
    $types .= "i";  // for contactId
    $params[] = $contactId;

    $stmt = $conn->prepare($query);
    $stmt->bind_param($types, ...$params);
    $stmt->execute();

    if ($stmt->affected_rows > 0) {
        http_response_code(204);
        returnWithError("");
    } else {
        http_response_code(404);
        returnWithError("Contact not found");
    }

    $stmt->close();
} catch (Exception $e) {
    http_response_code(500);
    returnWithError($e->getMessage());
} finally {
    $conn->close();
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
