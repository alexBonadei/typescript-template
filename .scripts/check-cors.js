const fs = require('fs')
const path = require('path')

// Files to check
const FILES_TO_CHECK = ['index.ts']

// CORS patterns to detect
const CORS_PATTERNS = [
  'Access-Control-Allow-Origin',
  'Access-Control-Allow-Methods',
  'Access-Control-Allow-Headers',
  'fastify.options',
  'fastify.addHook',
]

let foundCors = false

FILES_TO_CHECK.forEach((file) => {
  const filePath = path.join(__dirname, '..', file)
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf-8')
    if (CORS_PATTERNS.some((pattern) => content.includes(pattern))) {
      console.log(`❌ The file ${file} contains CORS configurations that should not be committed!`)
      foundCors = true
    }
  }
})

if (foundCors) {
  process.exit(1) // Block the commit
} else {
  process.exit(0)
}
