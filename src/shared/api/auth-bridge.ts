type TokenProvider = () => string | null
type UnauthorizedHandler = () => void

let tokenProvider: TokenProvider = () => null
let unauthorizedHandler: UnauthorizedHandler = () => undefined

export function setAuthTokenProvider(provider: TokenProvider) {
  tokenProvider = provider
}

export function setUnauthorizedHandler(handler: UnauthorizedHandler) {
  unauthorizedHandler = handler
}

export function getAuthToken(): string | null {
  return tokenProvider()
}

export function handleUnauthorized() {
  unauthorizedHandler()
}
