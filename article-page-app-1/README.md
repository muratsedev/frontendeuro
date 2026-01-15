# Article Page Application

This project is a simple article page application that displays articles based on a unique identifier (GUID). It is built using TypeScript and Express.js, providing a structured way to manage articles and their routing.

## Project Structure

```
article-page-app
├── src
│   ├── app.ts                  # Entry point of the application
│   ├── components
│   │   └── ArticleComponent.ts  # Component for rendering articles
│   ├── routes
│   │   └── articleRoutes.ts     # Routing for article pages
│   ├── services
│   │   └── articleService.ts     # Service for fetching articles
│   ├── models
│   │   └── Article.ts            # Model representing an article
│   └── types
│       └── index.ts              # Type definitions for articles
├── package.json                  # NPM package configuration
├── tsconfig.json                 # TypeScript configuration
└── README.md                     # Project documentation
```

## Features

- Fetch and display articles using a unique GUID.
- Modular structure with separate components for routing, services, and models.
- TypeScript for type safety and better development experience.

## Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```
   cd article-page-app
   ```
3. Install dependencies:
   ```
   npm install
   ```

## Usage

To start the application, run:
```
npm start
```

Visit `http://localhost:3000/articles/{guid}` to view an article by its GUID.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## License

This project is licensed under the MIT License.