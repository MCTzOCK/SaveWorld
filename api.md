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

## Account

#### Create an account

**Method**: `POST`
**Path**: `/account/register`

**Request**:

```json
{
  "username": "username",
  "password": "password",
  "email": "email",
  "firstName": "firstName",
  "lastName": "lastName"
}
```

**Response**

```json
{
  "status": 200,
  "message": "Please check your email to verify your account."
}
```

#### Login to an account

**Method**: `POST`
**Path**: `/account/login`

**Request (without 2fa enabled)**

```json
{
  "email": "email",
  "password": "password"
}
```
**Request (with 2fa enabled)**

```json
{
  "email": "email",
  "password": "password",
  "totpCode": "code"
}
```

**Response**:

```json
{
  "status": 200,
  "message": "Login successful",
  "token": "jsonwebtoken"
}
```

#### Update an account

> Needs authentication

**Method**: `POST`
**Path**: `/account/update`

**Request**
You can update any of the following fields: `firstName`, `lastName`, `password`, `totpActive`
```json
{
  "update": {
    "firstName": "firstName",
    "lastName": "lastName",
    "password": "password",
    "totpActive": true
  },
  "totpCode": "totpCode_if_totp_should_be_deactivated"
}
```

**Response**

```json
{
  "status": 200,
  "message": "Account updated successfully",
  "totpSecret": "totpSecret_if_totp_was_activated"
}
```

#### Activate an account

**Method**: `GET`
**Path**: `/account/activate?token=ActivationToken`

**Response**

```json
{
  "status": 200,
  "message": "Account activated successfully"
}
```

#### Verify a JWT / Retrieve account information

> Needs authentication

**Method**: `GET`
**Path**: `/account/verify-token`

**Response**

```json
{
  "status": 200,
  "user": {
    "id": "id",
    "username": "username",
    "email": "email",
    "firstName": "firstName",
    "lastName": "lastName",
    "totpActive": true,
    "admin": false
  }
}
```

#### Delete an account

> Needs authentication

**Method**: `DELETE`
**Path**: `/account/delete`

**Response**

```json
{
  "status": 200,
  "message": "Account deleted successfully"
}
```