import '@testing-library/jest-dom'

declare global {
  namespace NodeJS {
    interface Global {
      IntersectionObserver: any
      ResizeObserver: any
    }
  }
  const jest: any
}

// Mock IntersectionObserver
;(global as any).IntersectionObserver = class IntersectionObserver {
  readonly root: Element | null = null
  readonly rootMargin: string = ''
  readonly thresholds: ReadonlyArray<number> = []

  constructor(_callback: any, _options?: any) {}
  
  observe(): void {
    return
  }
  
  disconnect(): void {
    return
  }
  
  unobserve(): void {
    return
  }
  
  takeRecords(): any[] {
    return []
  }
}

// Mock ResizeObserver
;(global as any).ResizeObserver = class ResizeObserver {
  constructor(_callback: any) {}
  
  observe(): void {
    return
  }
  
  disconnect(): void {
    return
  }
  
  unobserve(): void {
    return
  }
}

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {}, // deprecated
    removeListener: () => {}, // deprecated
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => {},
  }),
}) 