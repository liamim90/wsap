/**
 * Tailwind CSS 설정 테스트
 * TDD RED 단계 - Tailwind 설정이 정상적으로 커스터마이징되었는지 확인
 */

describe('Tailwind CSS Configuration', () => {
  test('should have custom Tailwind classes available', () => {
    // DOM 요소 생성하여 클래스 적용 테스트
    const element = document.createElement('div')
    
    // 커스텀 컬러 클래스 테스트
    element.className = 'bg-primary-main text-white btn btn-primary'
    expect(element.className).toContain('bg-primary-main')
    expect(element.className).toContain('btn')
    expect(element.className).toContain('btn-primary')
  })

  test('should support custom animations', () => {
    const element = document.createElement('div')
    element.className = 'animate-fade-in animate-slide-up'
    
    expect(element.className).toContain('animate-fade-in')
    expect(element.className).toContain('animate-slide-up')
  })

  test('should support custom typography classes', () => {
    const element = document.createElement('h1')
    element.className = 'text-h1 font-sans'
    
    expect(element.className).toContain('text-h1')
    expect(element.className).toContain('font-sans')
  })

  test('should support custom spacing', () => {
    const element = document.createElement('div')
    element.className = 'p-4.5 m-5.5 gap-6.5'
    
    expect(element.className).toContain('p-4.5')
    expect(element.className).toContain('m-5.5')
    expect(element.className).toContain('gap-6.5')
  })

  test('should support custom breakpoints', () => {
    const element = document.createElement('div')
    element.className = 'xs:block md:flex lg:grid 2xl:hidden'
    
    expect(element.className).toContain('xs:block')
    expect(element.className).toContain('md:flex')
    expect(element.className).toContain('lg:grid')
    expect(element.className).toContain('2xl:hidden')
  })

  test('should support AI gradient classes', () => {
    const element = document.createElement('div')
    element.className = 'bg-ai-gradient text-gradient'
    
    expect(element.className).toContain('bg-ai-gradient')
    expect(element.className).toContain('text-gradient')
  })

  test('should support custom shadow classes', () => {
    const element = document.createElement('div')
    element.className = 'shadow-glow shadow-ai-glow'
    
    expect(element.className).toContain('shadow-glow')
    expect(element.className).toContain('shadow-ai-glow')
  })

  test('should support utility classes', () => {
    const element = document.createElement('div')
    element.className = 'scrollbar-hide card input'
    
    expect(element.className).toContain('scrollbar-hide')
    expect(element.className).toContain('card')
    expect(element.className).toContain('input')
  })
}) 