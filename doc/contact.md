# Contact API Spec

## Create Contact

Endpoint : **POST** `/api/contacts`

Headers :

- `Authorization : token`

Request body :

```json
{
  "first_name": "Anif",
  "last_name": "Yuliansyah",
  "email": "anifyuli@mymail.com",
  "phone": "+6281000123000"
}
```

Response body :

```json
{
  "data": {
    "id": 1,
    "first_name": "Anif",
    "last_name": "Yuliansyah",
    "email": "anifyuli@mymail.com",
    "phone": "+6281000123000"
  }
}
```

## Get Contact

Endpoint : **GET** `/api/contacts/:contactId`

Headers :

- `Authorization : token`

Response body :

```json
{
  "data": {
    "id": 1,
    "first_name": "Anif",
    "last_name": "Yuliansyah",
    "email": "anifyuli@mymail.com",
    "phone": "+6281000123000"
  }
}
```

## Update Contact

Endpoint : **PUT** `/api/contacts/:contactId`

Headers :

- `Authorization : token`

Request body :

```json
{
  "first_name": "Anif",
  "last_name": "Yuliansyah",
  "email": "anifyuli@mymail.com",
  "phone": "+6281000123000"
}
```

Response body :

```json
{
  "data": {
    "id": 1,
    "first_name": "Anif",
    "last_name": "Yuliansyah",
    "email": "anifyuli@mymail.com",
    "phone": "+6281000123000"
  }
}
```

## Remove Contact

Endpoint : **DELETE** `/api/contacts`

Headers :

- `Authorization : token`

Response body :

```json
{
  "data": true
}
```

## Search Contact

Endpoint : **GET** `/api/contacts`

Headers :

- `Authorization : token`

Query parameters :

- `name: string // contact first name or last name, optional`
- `phone: string // contact phone, optional`
- `email: string // contact email, optional`
- `page: number // 1 by default`
- `size: number // 10 by default`

Response body :

```json
{
  "data": [
    {
      "id": 1,
      "first_name": "Anif",
      "last_name": "Yuliansyah",
      "email": "anifyuli@mymail.com",
      "phone": "+6281000123000"
    },
    {
      "id": 2,
      "first_name": "Bondan",
      "last_name": "Suratpraja",
      "email": "bond4nsurt@mymail.com",
      "phone": "+6285700456098"
    }
  ],
  "paging": {
    "current_page": 1,
    "total_page": 10,
    "size": 10
  }
}
```
