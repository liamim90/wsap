/**
 * 코드 품질 도구 테스트
 * TDD RED 단계 - ESLint, Prettier, Husky가 올바르게 설정되었는지 확인
 */

import { existsSync, readFileSync } from 'fs'
import path from 'path'

describe('Code Quality Tools', () => {
  const projectRoot = process.cwd()

  describe('ESLint Configuration', () => {
    it('should have ESLint config file', () => {
      const eslintConfig = path.join(projectRoot, '.eslintrc.cjs')
      expect(existsSync(eslintConfig)).toBe(true)
    })

    it('should have proper ESLint rules configured', () => {
      const eslintConfig = path.join(projectRoot, '.eslintrc.cjs')
      const configContent = readFileSync(eslintConfig, 'utf-8')
      
      // 기본 규칙들이 포함되어 있는지 확인
      expect(configContent).toContain('@typescript-eslint/recommended')
      expect(configContent).toContain('react-hooks/recommended')
      expect(configContent).toContain('react-refresh/only-export-components')
    })
  })

  describe('Prettier Configuration', () => {
    it('should have Prettier config file', () => {
      const prettierConfig = path.join(projectRoot, '.prettierrc')
      expect(existsSync(prettierConfig)).toBe(true)
    })

    it('should have proper Prettier settings', () => {
      const prettierConfig = path.join(projectRoot, '.prettierrc')
      const configContent = JSON.parse(readFileSync(prettierConfig, 'utf-8'))
      
      expect(configContent.semi).toBe(false)
      expect(configContent.singleQuote).toBe(true)
      expect(configContent.tabWidth).toBe(2)
    })

    it('should have Prettier ignore file', () => {
      const prettierIgnore = path.join(projectRoot, '.prettierignore')
      expect(existsSync(prettierIgnore)).toBe(true)
    })
  })

  describe('Husky Configuration', () => {
    it('should have Husky directory', () => {
      const huskyDir = path.join(projectRoot, '.husky')
      expect(existsSync(huskyDir)).toBe(true)
    })

    it('should have pre-commit hook', () => {
      const preCommitHook = path.join(projectRoot, '.husky', 'pre-commit')
      expect(existsSync(preCommitHook)).toBe(true)
    })

    it('should have lint-staged configuration in package.json', () => {
      const packageJson = path.join(projectRoot, 'package.json')
      const packageContent = JSON.parse(readFileSync(packageJson, 'utf-8'))
      
      expect(packageContent['lint-staged']).toBeDefined()
      expect(packageContent['lint-staged']['*.{ts,tsx}']).toBeDefined()
    })
  })

  describe('EditorConfig', () => {
    it('should have EditorConfig file', () => {
      const editorConfig = path.join(projectRoot, '.editorconfig')
      expect(existsSync(editorConfig)).toBe(true)
    })
  })

  describe('Package.json Scripts', () => {
    it('should have quality check scripts', () => {
      const packageJson = path.join(projectRoot, 'package.json')
      const packageContent = JSON.parse(readFileSync(packageJson, 'utf-8'))
      
      expect(packageContent.scripts.lint).toBeDefined()
      expect(packageContent.scripts['lint:fix']).toBeDefined()
      expect(packageContent.scripts.format).toBeDefined()
      expect(packageContent.scripts['format:check']).toBeDefined()
      expect(packageContent.scripts.prepare).toBeDefined()
    })
  })
}) 