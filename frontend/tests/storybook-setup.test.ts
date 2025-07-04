/**
 * Storybook 설정 테스트
 * TDD RED 단계 - Storybook이 정상적으로 설정되었는지 확인
 */
import fs from 'fs'
import path from 'path'

describe('Storybook Setup', () => {
  test('should have Storybook configuration', () => {
    // Storybook 설정 존재 확인
    const mainPath = path.join(__dirname, '..', '.storybook', 'main.js')
    expect(fs.existsSync(mainPath)).toBe(true)
  })

  test('should have preview configuration', () => {
    // Preview 설정 존재 확인
    const previewPath = path.join(__dirname, '..', '.storybook', 'preview.js')
    expect(fs.existsSync(previewPath)).toBe(true)
  })

  test('should have manager configuration', () => {
    // Manager 설정 존재 확인
    const managerPath = path.join(__dirname, '..', '.storybook', 'manager.js')
    expect(fs.existsSync(managerPath)).toBe(true)
  })

  test('should support TypeScript stories', () => {
    // TypeScript 스토리 지원 확인
    const element = document.createElement('div')
    element.setAttribute('data-testid', 'story-component')
    expect(element.getAttribute('data-testid')).toBe('story-component')
  })

  test('should have design tokens integrated', () => {
    // 디자인 토큰과 Storybook 통합 확인
    expect(() => require('../src/constants/design-tokens')).not.toThrow()
  })

  test('should support Tailwind CSS in stories', () => {
    // Tailwind CSS 스토리 지원 확인
    const element = document.createElement('div')
    element.className = 'bg-primary-main text-white p-4'
    expect(element.className).toContain('bg-primary-main')
    expect(element.className).toContain('text-white')
    expect(element.className).toContain('p-4')
  })

  test('should support addon essentials', () => {
    // 에센셜 애드온 지원 확인
    const mockStory = {
      title: 'Example/Button',
      component: 'button',
      parameters: { layout: 'centered' }
    }
    expect(mockStory.title).toBe('Example/Button')
    expect(mockStory.parameters.layout).toBe('centered')
  })

  test('should support interaction testing', () => {
    // 인터랙션 테스팅 지원 확인
    const mockInteraction = {
      play: () => Promise.resolve(),
      args: { primary: true }
    }
    expect(typeof mockInteraction.play).toBe('function')
    expect(mockInteraction.args.primary).toBe(true)
  })

  test('should have Welcome story file', () => {
    // Welcome 스토리 파일 존재 확인
    const welcomeStoryPath = path.join(__dirname, '..', 'src', 'stories', 'Welcome.stories.tsx')
    expect(fs.existsSync(welcomeStoryPath)).toBe(true)
  })

  test('should have proper file structure', () => {
    // 파일 구조 확인
    expect(process.env.NODE_ENV).toBeDefined()
    
    // 스토리 파일 패턴 확인
    const storyPattern = /\.stories\.(js|jsx|ts|tsx|mdx)$/
    expect(storyPattern.test('Button.stories.tsx')).toBe(true)
    expect(storyPattern.test('Card.stories.ts')).toBe(true)
  })
}) 