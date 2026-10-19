# Документация по методам API

- [Вызов методов](#вызоз-методов)

Методы:
- [Auth](#auth_path)
    - [signIn](#signIn)
    - [signUp](#signUp)
    - [refreshAccess](#refreshAccess)
    - [userLogout](#userLogout)
- [User](#user_path)
    - [profile](#profile)
    - [uploadAvatar](#uploadAvatar)
- [Post](#post_path)
    - [posts](#posts)
    - [post](#post)
    - [createPost](#createPost)
    - [updatePost](#updatePost)
    - [deletePost](#deletePost)
- [Comment](#comment_path)
    - [comments](#comments)
    - [comment](#comment)
    - [createComment](#createComment)
    - [updateComment](#updateComment)
    - [deleteComment](#deleteComment)

## Auth

### signIn

Авторизирует пользователя по логину и паролю

#### Параметры
```
{
    username: string
    password: string
}
```

#### Результат
```
{
    message
    user {
        id
        username
        picture
    }
}
```

### signUp

Создает нового пользователя

#### Параметры
```
{
    username: string
    password: string
}
```

#### Результат
```
{
    message
    user {
        id
        username
        picture
    }
}
```

### refreshAccess

Генерирует новый access токен, благодаря refresh токену.

#### Результат
```
{
    accessToken
    user {
       id
       username
    }
}
```

### userLogout

Происходит выход из аккаунта, токены очищаются из кук.

#### Результат
```
{
    accessToken
    message {
       id
       username
    }
}
```

## User

### profile

Получает данные пользователя

#### Результат
```
{
    id
    username
    picture
}
```

### uploadAvatar

Загружает аватарку пользователя на S3 хранилище

#### Параметры
```
{
    file: Upload!
}
```

#### Результат
```
{
        id
        username
        picture
}
```

## Post

### posts

Получает все посты

#### Результат
```
{
        id
        title
        topic
        content
        createdAt
        updatedAt
        author {
            id
            username
            picture
        }
}
```

### post

Получает пост по ID

#### Параметры
```
{
    id: string
}
```

#### Результат
```
{
        id
        title
        topic
        content
        createdAt
        updatedAt
        author {
            id
            username
            picture
        }
}
```

### createPost

Создает пост

#### Параметры
```
{
    title: string
    topic: string
    content: string
}
```

#### Результат
```
{
        id
        title
        topic
        content
        createdAt
        updatedAt
        author {
            id
            username
            picture
        }
}
```

### updatePost

Обновляет пост

#### Параметры
```
{
    id: string
    title: string
    content: string
}
```

#### Результат
```
{
        id
        title
        topic
        content
        createdAt
        updatedAt
        author {
            id
            username
            picture
        }
}
```

### deletePost

Удаляет пост

#### Параметры
```
{
    id: string
}
```

## Comment

### comments

Получает все комментарии поста

#### Параметры
```
{
    postId: string
}
```

#### Результат
```
{
        id
        postId
        replyTo
        content
        createdAt
        updatedAt
        author {
            id
            username
            picture
        }
}
```

### comment

Получает комментарий по ID

#### Параметры
```
{
    id: string
}
```

#### Результат
```
{
        id
        postId
        replyTo
        content
        createdAt
        updatedAt
        author {
            id
            username
            picture
        }
}
```

### createComment

Создает пост

#### Параметры
```
{
    postId: string
    content: string
    replyTo?: string
}
```

#### Результат
```
{
        id
        postId
        replyTo
        content
        createdAt
        updatedAt
        author {
            id
            username
            picture
        }
}
```

### updateComment

Обновляет комментарий

#### Параметры
```
{
    id: string
    content: string
}
```

#### Результат
```
{
        id
        postId
        replyTo
        content
        createdAt
        updatedAt
        author {
            id
            username
            picture
        }
}
```

### deleteComment

Удаляет комментарий

#### Параметры
```
{
    id: string
}
```


