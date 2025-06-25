const RuleTester = require("eslint").RuleTester;
const rule = require("../../lib/rules/no-insecure-comparison");

const tester = new RuleTester({
  parserOptions: { ecmaVersion: 2020 },
});

tester.run("no-insecure-comparison", rule, {
  valid: [
    "if (crypto.timingSafeEqual(a, b)) {}",
    "if (a === b) {} // non-crypto comparison"
  ],
  invalid: [
    {
      code: "if (userToken === expectedToken) {}",
      errors: [{ message: "Use crypto.timingSafeEqual" }],
      output: 
        "if (!crypto.timingSafeEqual(Buffer.from(userToken), Buffer.from(expectedToken)) {}"
    },
    {
      code: "if (Buffer.from(sig) === expectedSignature) {}",
      errors: [{ message: "Use crypto.timingSafeEqual" }],
      output: 
        "if (!crypto.timingSafeEqual(Buffer.from(Buffer.from(sig)), Buffer.from(expectedSignature)) {}"
    }
  ]
});
