/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: [
    '@mui/material',
    '@mui/icons-material',
    '@mui/system',
    '@mui/styled-engine',
    '@emotion/react',
    '@emotion/styled'
  ],
  // Füge diese Option hinzu, um sicherzustellen, dass Next.js die Module korrekt verarbeitet
  modularizeImports: {
    '@mui/icons-material': {
      transform: '@mui/icons-material/{{member}}'
    }
  }
}

module.exports = nextConfig 