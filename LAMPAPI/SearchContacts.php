<?php
$inData = getRequestInfo();

$userId = $inData["userId"];
$query = $inData["query"];
$page = $inData["page"];

// Validate required parameters
if (null === $userId) {
    http_response_code(401);
    returnWithError("missing parameter userId");
    return;
}

if (null === $query) {
    http_response_code(400);
    returnWithError("missing parameter query");
    return;
}

$offset = 0;
if (null === $page) {
    $page = 1;
} else {
    if (is_numeric($page)) {
        $page = (int) $page;
        if ($page <= 0) {
            http_response_code(400);
            returnWithError("page must be greater than 0");
            return;
        }
        $offset = (((int) $page) - 1) * 12;
    } else {
        http_response_code(400);
        returnWithError("non-numeric parameter page");
        return;
    }
}

$conn = new mysqli("localhost", "WebApp", "WebBackend1", "COP4331");
if ($conn->connect_error) {
    http_response_code(500);
    returnWithError($conn->connect_error);
    return;
}

try {
    // Create search query with LIKE for partial matches
    $stmt = $conn->prepare("SELECT * FROM Contacts 
                           WHERE UserId=? AND 
                           (? = ''  OR
                           FirstName LIKE ? OR 
                            LastName LIKE ? OR 
                            Email LIKE ? OR 
                            Phone LIKE ?)
                            ORDER BY FirstName, LastName, ID
                           LIMIT 12 OFFSET ?");

    $searchPattern = "%" . $query . "%";
    $stmt->bind_param("ssssssi", $userId, $query, $searchPattern, $searchPattern, $searchPattern, $searchPattern, $offset);
    $stmt->execute();

    $result = $stmt->get_result();
    $contacts = array();

    // create response array
    while ($row = $result->fetch_assoc()) {
        $contact = array(
            "id" => $row['ID'],
            "firstName" => $row['FirstName'],
            "lastName" => $row['LastName'],
            "phone" => $row['Phone'],
            "email" => $row['Email']
        );
        $contacts[] = $contact;
    }

    // Get for page count
    $stmt = $conn->prepare("SELECT COUNT(*) as total FROM Contacts 
                           WHERE UserId=? AND 
                           (? = '' OR
                            FirstName LIKE ? OR 
                            LastName LIKE ? OR 
                            Email LIKE ? OR 
                            Phone LIKE ?)
                            ORDER BY FirstName, LastName, ID");

    $stmt->bind_param("ssssss", $userId, $query, $searchPattern, $searchPattern, $searchPattern, $searchPattern);
    $stmt->execute();
    $result = $stmt->get_result();
    $pages = ceil($result->fetch_assoc()['total'] / 12);

    http_response_code(200);
    returnWithInfo($contacts, $page, $pages);

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
    $retValue = '{"error":"' . $err . '", "pages": 0, "page": 0, "results": []}';
    sendResultInfoAsJson($retValue);
}

function returnWithInfo($contacts, $page, $pages)
{
    $retValue = '{"error":"", "pages": ' . $pages . ', "page": ' . $page . ', "results":' . json_encode($contacts) . '}';
    sendResultInfoAsJson($retValue);
}
