# User API Spec

## Register User

Endpoint : **POST** `/api/users`

Request body :

```json
{
  "username": "Anif",
  "password": "YNTKTS123",
  "name": "Anifyuli"
}
```

Response body _success_ :

```json
{
  "data": {
    "username": "anif",
    "name": "Anifyuli"
  }
}
```

Response body _failed_ :

```json
{
  "errors": "Requested username already added or not found"
}
```

## Login User

Endpoint : **POST** `/api/users/login`

Request body :

```json
{
  "username": "Anif",
  "password": "YNTKTS123"
}
```

Response body _success_ :

```json
{
  "data": {
    "username": "anif",
    "name": "Anifyuli",
    "token": "session_id_generated"
  }
}
```

Response body _failed_ :

```json
{
  "errors": "Your username or password is wrong"
}
```

## Get User

Endpoint : **GET** `/api/users/current`

Headers :

- `Authorization: token`

Response body _success_ :

```json
{
  "data": {
    "username": "anif",
    "name": "Anifyuli"
  }
}
```

Response body _failed_ :

```json
{
  "errors": "Your requested is unathorized"
}
```

## Update User

Endpoint : **PATCH** `/api/users/current`

Headers :

- `Authorization: token`

Request body :

```json
{
  "password": "YNTKTS123", // if need to change password
  "name": "Anifyuli" // if need to change display name
}
```

Response body _success_ :

```json
{
  "data": {
    "username": "anif",
    "name": "Anifyuli"
  }
}
```

Response body _failed_ :

```json
{
  "errors": "Your requested is unathorized"
}
```

## Logout User

Endpoint : **DELETE** `/api/users/current`

Headers :

- `Authorization: token`

Response body _success_ :

```json
{
  "data": true
}
```
