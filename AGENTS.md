<!-- BEGIN:nextjs-agent-rules -->
# Project Overview

A web-based photo gallery application.

# Commenting Guidelines

- Every method must include a brief comment explaining its purpose.
- In backend files, include a module description right after the `import` statements (separated by a blank line).
- Add inline comments for complex logic blocks.

# General Coding Conventions

- Keep variable and component names concise yet expressive. Avoid excessive length, over-abstraction/over-engineering, or unnecessary defensive checks that clutter the code.

# Backend Conventions

- Adhere to the MVC architecture. Explicitly specify return types for all Service methods.
- If required, retrieve the current user ID from `context.js` in the API layer and pass it to the Service layer as the **last** parameter.
- Place input parameter types in `entity/bo` and return/response types in `entity/vo`.

# Frontend Conventions

- Import and reuse backend type definitions for API requests and responses.
- Avoid unnecessary component abstraction—only extract components when truly needed.
- Document the purpose of every state, ref, and key variable inside components.

# Database Location

`data/pixtale.sqlite`

<!-- END:nextjs-agent-rules -->