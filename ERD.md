# Entity Relationship Diagram (ERD)
<!-- https://www.mermaidchart.com/raw/418dd0f9-2cce-4a6c-a16d-066fffb09f27?theme=light&version=v0.1&format=svg -->
```mermaid
erDiagram
  USER {
    STRING id PK
    STRING email UNIQUE
    STRING name
    STRING passwordHash
    STRING avatarUrl
    STRING refreshToken
    INT tokenVersion
    DATETIME createdAt
    DATETIME updatedAt
  }
  
  ROLE {
    STRING id PK
    STRING name UNIQUE
    STRING description
    DATETIME createdAt
    DATETIME updatedAt
  }

  PERMISSION {
    STRING id PK
    STRING name UNIQUE
    STRING description
    STRING resource
    STRING action
    DATETIME createdAt
    DATETIME updatedAt
  }

  CATEGORY {
    STRING id PK
    STRING name UNIQUE
    STRING description
    DATETIME createdAt
    DATETIME updatedAt
  }

  POST {
    STRING id PK
    STRING title
    STRING content
    BOOLEAN isPublic
    STRING authorId FK
    STRING categoryId FK
    DATETIME createdAt
    DATETIME updatedAt
  }

  COMMENT {
    STRING id PK
    STRING content
    STRING postId FK
    STRING authorId FK
    DATETIME createdAt
    DATETIME updatedAt
  }

  USER_ROLE {
    STRING id PK
    STRING userId FK
    STRING roleId FK
    DATETIME createdAt
    DATETIME updatedAt
  }

  ROLE_PERMISSION {
    STRING id PK
    STRING roleId FK
    STRING permissionId FK
    DATETIME createdAt
    DATETIME updatedAt
  }

  USER ||--o{ POST : "author"
  USER ||--o{ COMMENT : "writes"
  USER ||--o{ USER_ROLE : "has"
  ROLE ||--o{ USER_ROLE : "assigned"
  ROLE ||--o{ ROLE_PERMISSION : "grants"
  PERMISSION ||--o{ ROLE_PERMISSION : "belongs to"
  POST ||--o{ COMMENT : "has"
  CATEGORY ||--o{ POST : "includes"
