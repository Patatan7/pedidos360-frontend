export const environment = {
  clientId: (window as any).__env?.CLIENT_ID || 'd58f7e12-14df-458c-b966-507316adb29c',
  tenantId: (window as any).__env?.TENANT_ID || '4ecc8427-8a7b-46cc-aab9-4f000ea95b2e',
  redirectUri: window.location.origin,
  apiUrl: (window as any).__env?.API_URL || 'https://bdmbgxdi95.execute-api.us-east-1.amazonaws.com',
}