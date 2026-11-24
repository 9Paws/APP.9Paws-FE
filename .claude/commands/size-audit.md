Audit the codebase for bundle size and asset bloat:
1. Check `package.json` for unnecessarily heavy dependencies or duplicates.
2. Scan `./assets/` for any image file exceeding 150 KB.
3. Search for banned wildcard icon imports (`import * as ... from 'lucide-react-native'`).
4. Check for dead code or obsolete components.
5. Report findings and suggest actionable size-reduction optimizations.