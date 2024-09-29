# Minimal RAG NextJS

<div align="center"><img src="./docs/usage.gif" height="599px" /></div>

## Overview

Minimal RAG NextJS is a proof-of-concept demonstrating that you can implement Retrieval-Augmented Generation (RAG) without relying on expensive vector database subscriptions. This project leverages the power of pgvector, a simple PostgreSQL extension, combined with OpenAI embeddings to create a cost-effective, local vector search solution.

## Features

- Uses pgvector extension for PostgreSQL
- Integrates OpenAI embeddings for vector creation
- Implements a NextJS web application for file upload and search
- Chunks and stores vectors in a local database
- Provides a simple, intuitive user interface

## Prerequisites

- Node.js (v14 or later)
- Docker and Docker Compose
- OpenAI API key

## Installation

1. Clone the repository:

   ```
   git clone https://github.com/MartinKondor/minimal-rag-nextjs.git
   cd minimal-rag-nextjs
   ```

2. Install dependencies:

   ```
   npm install
   ```

3. Set up the database:

   ```
   docker-compose up -d
   npx prisma generate
   npx prisma db push --force-reset
   ```

4. Modify the given `.env` file in the root directory (if you wish):
   ```
   SKIP_ENV_VALIDATION=0
   NODE_ENV="development"
   POSTGRES_URL="postgres://postgresuser:postgrespassword@localhost:54322"
   POSTGRES_URL_NON_POOLING="postgres://postgresuser:postgrespassword@localhost:54322?pool=false"
   ```

## Usage

1. Start the development server:

   ```
   npm run dev
   ```

2. Open your browser and navigate to `http://localhost:3000`.

3. Follow the on-screen instructions:
   - Enter your OpenAI API key (this is used client-side and not stored)
   - Upload a text file (max 20,000 characters)
   - Enter a search query
   - View the most relevant chunks from your uploaded file

## How It Works

1. **File Upload**: The app chunks your uploaded text file and creates embeddings using OpenAI's API.
2. **Vector Storage**: These embeddings are stored in the local PostgreSQL database using pgvector.
3. **Search**: When you enter a query, it's converted to an embedding and compared against the stored vectors.
4. **Results**: The most similar text chunks are retrieved and displayed, ranked by relevance.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Future Improvements

- Implement user authentication
- Add support for multiple file types
- Optimize vector search for larger datasets
- Implement more advanced RAG techniques


## Acknowledgements

- [OpenAI](https://openai.com/) for their embedding API
- [pgvector](https://github.com/pgvector/pgvector) for enabling vector operations in PostgreSQL
- [Next.js](https://nextjs.org/) for the React framework

## Contact

Martin Kondor - [https://martinkondor.github.io/](https://martinkondor.github.io/)

Project Link: [https://github.com/MartinKondor/minimal-rag-nextjs](https://github.com/MartinKondor/minimal-rag-nextjs)

## License

Copyright © Martin Kondor

MIT License. See the [LICENSE](./LICENSE) file for more details.
