# Papdaew API Gateway

## Overview

API Gateway service for Papdaew microservices architecture. This service handles routing, authentication, authorization, and rate limiting for all incoming requests to the microservices ecosystem.

## Table of Contents

- [Papdaew API Gateway](#papdaew-api-gateway)
  - [Overview](#overview)
  - [Table of Contents](#table-of-contents)
  - [Features](#features)
  - [Tech Stack](#tech-stack)
  - [Project Structure](#project-structure)
  - [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Setup](#setup)

## Features

- **Routing & Proxy**

  - Dynamic service routing
  - Load balancing
  - Service discovery
  - Request/Response transformation

- **Security**

  - JWT authentication
  - Role-Based Access Control (RBAC)
  - Permission-based authorization
  - Rate limiting
  - Request validation

- **Monitoring & Logging**

  - Request logging
  - Error tracking
  - Performance metrics
  - Health checks

- **Traffic Management**
  - Circuit breaking
  - Retry policies
  - Timeout handling
  - Rate limiting

## Tech Stack

- Node.js

## Project Structure

```
services/papdaew-gateway/
├── src/
│   ├── configs/
│   ├── middleware/
│   ├── proxy/
│   ├── utils/
│   ├── server.js
│   └── app.js
├── tests/
├── .editorconfig
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher)

### Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Set up environment variables:

   ```bash
   cp .env.example .env
   ```

3. Start the service:

   ```bash
   # Development
   npm run dev

   # Production
   npm start
   ```
