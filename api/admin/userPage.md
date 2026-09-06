# User Management API Contract

This document outlines the API specifications required for the Admin User Page (`/admin/user` frontend route) to function properly when it is integrated with the Spring Boot backend.

## Endpoint: Get Users

Retrieves a paginated list of users, allowing for sorting and conditional filtering based on a specific search term.

**URL:** `/api/v1/admin/user`  
**Method:** `GET`  
**Authentication:** Required (Admin Role)

### Query Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `page` | `integer` | No | `0` | The zero-indexed page number to retrieve. |
| `size` | `integer` | No | `5` | The number of records per page. |
| `sortBy` | `string` | No | `firstName` | The field to sort the records by (e.g., `firstName`, `createdAt`). |
| `sortDir` | `string` | No | `asc` | The direction of the sort (`asc` or `desc`). |
| `searchType` | `string` | No | - | The specific field to search within (e.g., `userId`, `name`, `email`, `phone`). |
| `searchQuery`| `string` | No | - | The actual text to search for within the specified `searchType` field. |

### Expected Request Examples

- **Default Load:** `GET /api/v1/admin/user?page=0&size=5&sortBy=firstName&sortDir=asc`
- **Searching by Email:** `GET /api/v1/admin/user?page=0&size=5&sortBy=firstName&sortDir=asc&searchType=email&searchQuery=alexander`
- **Sorting Newest First:** `GET /api/v1/admin/user?page=0&size=5&sortBy=createdAt&sortDir=desc`

### Expected Response Structure (Spring Data `Page<T>`)

The frontend is programmed to expect a standard JSON response wrapper containing a Spring Data JPA `Page<User>` object under the `data` key. 

```json
{
  "status": "success",
  "message": "Users retrieved successfully",
  "data": {
    "content": [
      {
        "userId": 1,
        "firstName": "Alexander",
        "lastName": "Rivera",
        "email": "alexander.r@example.com",
        "phone": "9876543201",
        "gender": "MALE",
        "createdAt": "2026-01-01T10:00:00Z"
      },
      {
        "userId": 2,
        "firstName": "Prajwal",
        "lastName": "Reyar",
        "email": "prajwal.reyar@example.com",
        "phone": "9876543202",
        "gender": null,
        "createdAt": "2026-01-02T10:00:00Z"
      }
    ],
    "pageable": {
      "sort": {
        "sorted": true,
        "unsorted": false,
        "empty": false
      },
      "offset": 0,
      "pageNumber": 0,
      "pageSize": 5,
      "unpaged": false,
      "paged": true
    },
    "last": false,
    "totalElements": 25,
    "totalPages": 5,
    "size": 5,
    "number": 0,
    "sort": {
      "sorted": true,
      "unsorted": false,
      "empty": false
    },
    "first": true,
    "numberOfElements": 2,
    "empty": false
  }
}
```

### Notes for Backend Implementation

1. **Filtering Logic (`searchType` and `searchQuery`)**: 
   The backend controller should parse these parameters and pass them to a Service layer that uses a JPA Specification or custom `@Query`.
   - If `searchType == 'name'`, query `WHERE lower(firstName) LIKE %query% OR lower(lastName) LIKE %query%`.
   - If `searchType == 'userId'`, parse the query to an integer and filter by exact ID, or use `LIKE` if cast to a string.
2. **Pagination and Sorting**: 
   Construct a `PageRequest` object using the `page`, `size`, `sortBy`, and `sortDir` parameters:
   ```java
   Sort sort = sortDir.equalsIgnoreCase("desc") ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
   Pageable pageable = PageRequest.of(page, size, sort);
   ```
3. **Null Safety**: 
   If `searchQuery` is empty or null, the backend should return the default un-filtered list of users.
