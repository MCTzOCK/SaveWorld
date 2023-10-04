# REST API

Every Request and Response is in JSON format and if fails responds with a 500 status code.

**Error Response Body**:

````json
{
  "error": "error message",
  "status": 500
}
````

For every request that needs authentication you need to add the following header:

```
X-AUTH: <jsonwebtoken>
```

## Admin

#### Get Stats

**Method**: `GET`
**Path**: `/admin/stats`

**Response**

```json
{
  "status": 200,
  "message": "Stats attached",
  "stats": {
    "users": {
      "count": 1,
      "inLastWeek": 1,
      "active": 1
    }
  }
}
```

#### Retrieve Users

**Method**: `GET`
**Path**: `/admin/users`

**Response**

```json
{
  "status": 200,
  "message": "Stats attached",
  "stats": {
    "users": {
      "id": "",
      "email": "",
      "username": "",
      "firstName": "",
      "lastName": "",
      "createdAt": "",
      "password": "password-hash",
      "updatedAt": "",
      "totpSecret": "",
      "active": true,
      "admin": false,
      "activationToken": ""
    }
  }
}
```