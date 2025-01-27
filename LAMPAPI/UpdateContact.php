<?php
$inData = getRequestInfo();

$contactId = $inData["contactId"];
$userId = $inData["userId"];
$firstName = $inData["firstName"];
$lastName = $inData["lastName"];
$phone = $inData["phone"];
$email = $inData["email"];

// Check for required contactId
if (null === $contactId) {
    http_response_code(400);
    returnWithError("missing parameter contactId");
    return;
}

// Check for at least one update field
if (null === $userId && null === $firstName && null === $lastName && 
    null === $phone && null === $email) {
    http_response_code(400);
    returnWithError("at least one update field is required");
    return;
}

$conn = new mysqli("localhost", "WebApp", "WebBackend1", "COP4331");
if ($conn->connect_error) {
    http_response_code(500);
    returnWithError($conn->connect_error);
    return;
}

try {
    // Build dynamic UPDATE query based on provided fields
    $updateFields = array();
    $types = "";
    $params = array();
    
    if (null !== $userId) {
        $updateFields[] = "UserId=?";
        $types .= "s";
        $params[] = $userId;
    }
    if (null !== $firstName) {
        $updateFields[] = "FirstName=?";
        $types .= "s";
        $params[] = $firstName;
    }
    if (null !== $lastName) {
        $updateFields[] = "LastName=?";
        $types .= "s";
        $params[] = $lastName;
    }
    if (null !== $phone) {
        $updateFields[] = "Phone=?";
        $types .= "s";
        $params[] = $phone;
    }
    if (null !== $email) {
        $updateFields[] = "Email=?";
        $types .= "s";
        $params[] = $email;
    }

    $query = "UPDATE Contacts SET " . implode(", ", $updateFields) . " WHERE ID=?";
    $types .= "i";  // for contactId
    $params[] = $contactId;

    $stmt = $conn->prepare($query);
    $stmt->bind_param($types, ...$params);
    $stmt->execute();

    if ($stmt->affected_rows > 0) {
        http_response_code(200);
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