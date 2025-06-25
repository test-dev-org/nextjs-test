const cryptoIdentifiers = new Set(['Buffer', 'Uint8Array', 'Uint32Array', 'crypto', 'secret', 'token', 'signature']);
const sensitiveProperties = new Set(['secret', 'key', 'token', 'password', 'signature']);

module.exports = {
  meta: {
    type: "problem",
    docs: {
      description: "Prevent insecure comparisons of cryptographic values",
      category: "Security",
      recommended: "error",
    },
    fixable: "code",
    schema: [],
  },
  create(context) {
    return {
      BinaryExpression(node) {
        if (node.operator !== "===" && node.operator !== "==") return;
        
        const isSensitive = (identifier) => 
          cryptoIdentifiers.has(identifier.name) ||
          sensitiveProperties.has(identifier.name) ||
          (identifier.name && identifier.name.toLowerCase().includes('secret'));
          
        const leftIsSensitive = node.left.type === "Identifier" && isSensitive(node.left);
        const rightIsSensitive = node.right.type === "Identifier" && isSensitive(node.right);
        
        if (leftIsSensitive || rightIsSensitive) {
          context.report({
            node,
            message: "Use crypto.timingSafeEqual for cryptographic comparisons to prevent timing attacks",
            fix(fixer) {
              const [a, b] = [node.left, node.right];
              return fixer.replaceText(
                node,
                `!crypto.timingSafeEqual(Buffer.from(${context.getSourceCode().getText(a)}, ` +
                `Buffer.from(${context.getSourceCode().getText(b)}))`
              );
            }
          });
        }
      }
    };
  }
};
