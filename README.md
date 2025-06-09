# Typescript Template

## Summary
Template with Typescript

## Purpose

This template provides a clean and scalable project structure for building TypeScript applications.  
It follows a layered architecture, separating concerns into controllers, services, and repositories:

- **Controllers**: Handle HTTP requests, route them to the appropriate service, and return responses.
- **Services**: Contain business logic and orchestrate data flow between controllers and repositories.
- **Repositories**: Manage data access, such as database queries or external API calls.

This structure encourages maintainability, testability, and clear separation of concerns.

## Project Structure Example

```
src/
  controllers/
    books/
      get-books/
        handler.ts
  services/
    libraryService.ts
  repositories/
    bookRepository.ts
```

## Setup & Run

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Build the project**
   ```bash
   npm run build
   ```

3. **Run the application**
   ```bash
   npm start
   ```

4. **Run tests**
   ```bash
   npm test
   ```

## Contributing

Please use `npm run commit` to add and commit your changes keeping the messages format consistent.

## 
```
````
