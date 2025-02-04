# Address API Spec

## Create Address

Endpoint : **POST** `/api/contacts/:contactId/addresses`

Headers :

- `Authorization: token`

Request body :

```json
{
  "street": "Example street", // optional
  "city": "City", // optional
  "province": "Province", // optional
  "country": "Country",
  "postal_code": "12345"
}
```

Response body :

```json
{
  "data": {
    "id": 1,
    "street": "Example street", // optional
    "city": "City", // optional
    "province": "Province", // optional
    "country": "Country",
    "postal_code": "12345"
  }
}
```

## Get Address

Endpoint : **GET** `/api/contacts/:addressId

Headers :

- `Authorization: token`

Response body :

```json
{
  "data": {
    "id": 1,
    "street": "Example street",
    "city": "City",
    "province": "Province",
    "country": "Country",
    "postal_code": "12345"
  }
}
```

## Update Address

Endpoint : **PUT** `/api/contacts/:addressId`

Headers :

- `Authorization: token`

Request body :

```json
{
  "street": "Example street",
  "city": "City",
  "province": "Province",
  "country": "Country",
  "postal_code": "12345"
}
```

Response body :

```json
{
  "data": {
    "id": 1,
    "street": "Example street",
    "city": "City",
    "province": "Province",
    "country": "Country",
    "postal_code": "12345"
  }
}
```

## Remove Address

Endpoint : **DELETE** `/api/contacts/:addressId`

Headers :

- `Authorization: token`

Response body :

```json
{
  "data": true
}
```

## List Address

Endpoint : **GET** `/api/contacts/:contactId/addresses`

Headers :

- `Authorization: token`

Response body :

```json
{
  "data": [
    {
      "id": 1,
      "street": "Example street",
      "city": "City",
      "province": "Province",
      "country": "Country",
      "postal_code": "12345"
    },
    {
      "id": 2,
      "street": "Dummy street",
      "city": "Town",
      "province": "Province",
      "country": "Country",
      "postal_code": "45678"
    }
  ]
}
```
