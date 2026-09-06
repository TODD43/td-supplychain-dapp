# Contributing

This is a personal portfolio project. However, suggestions and feedback are welcome!

## Reporting Issues

If you find a bug or have a suggestion:

1. Check existing [GitHub Issues](https://github.com/TODD43/td-supplychain-dapp/issues)
2. Create a new issue with clear description
3. Include steps to reproduce (if applicable)
4. Mention your environment (OS, Node version, etc.)

## Security Issues

**⚠️ Do NOT open public issues for security vulnerabilities.**

Please report privately to ensure timely patching. See [SECURITY.md](./SECURITY.md).

## Code Style

- TypeScript for type safety
- Solidity 0.8.20+
- Prettier for formatting
- ESLint for linting

## Running Tests

```bash
npm run test              # Run all tests
npm run test:coverage     # Generate coverage report
npm run test:watch        # Watch mode
```

## Testing Requirements

All pull requests should include:
- Unit tests for smart contracts
- Manual testing confirmation
- No breaking changes without justification

## Development Workflow

1. Fork the repository
2. Create feature branch: `git checkout -b feature/your-feature`
3. Make changes
4. Add/update tests
5. Verify: `npm run test && npm run lint`
6. Commit with clear messages
7. Push and create pull request

## License

By contributing, you agree your work will be licensed under MIT License.

---

Thanks for your interest in this project!
