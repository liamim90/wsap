/**
 * 프로젝트 폴더 구조 테스트
 * TDD RED 단계 - 필요한 폴더와 파일들이 존재하는지 확인
 */

import { existsSync } from 'fs'
import path from 'path'

describe('Project Folder Structure', () => {
  const srcDir = path.resolve(process.cwd(), 'src')

  it('should have required source directories', () => {
    const requiredDirs = [
      'components',
      'components/ui',
      'components/chat',
      'components/workflow',
      'components/layout',
      'constants',
      'hooks',
      'services',
      'stores',
      'pages',
      'utils',
      'types'
    ]

    requiredDirs.forEach(dir => {
      const dirPath = path.join(srcDir, dir)
      expect(existsSync(dirPath)).toBe(true)
    })
  })

  it('should have design tokens file', () => {
    const designTokensPath = path.join(srcDir, 'constants', 'design-tokens.ts')
    expect(existsSync(designTokensPath)).toBe(true)
  })

  it('should have base component index files', () => {
    const indexFiles = [
      'components/index.ts',
      'components/ui/index.ts',
      'components/chat/index.ts',
      'components/workflow/index.ts',
      'components/layout/index.ts',
      'constants/index.ts',
      'hooks/index.ts',
      'services/index.ts',
      'stores/index.ts',
      'utils/index.ts',
      'types/index.ts'
    ]

    indexFiles.forEach(file => {
      const filePath = path.join(srcDir, file)
      expect(existsSync(filePath)).toBe(true)
    })
  })

  it('should have proper TypeScript type definitions', () => {
    const typeFiles = [
      'types/common.ts',
      'types/api.ts',
      'types/workflow.ts',
      'types/chat.ts'
    ]

    typeFiles.forEach(file => {
      const filePath = path.join(srcDir, file)
      expect(existsSync(filePath)).toBe(true)
    })
  })

  it('should have base service files', () => {
    const serviceFiles = [
      'services/api.ts',
      'services/auth.ts',
      'services/workflow.ts',
      'services/chat.ts'
    ]

    serviceFiles.forEach(file => {
      const filePath = path.join(srcDir, file)
      expect(existsSync(filePath)).toBe(true)
    })
  })
}) 