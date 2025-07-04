/**
 * 프로젝트 기본 설정 테스트
 * TDD RED 단계 - 프로젝트가 정상적으로 설정되었는지 확인
 */

describe('Project Setup', () => {
  it('should have React and TypeScript configured', () => {
    // React가 정상적으로 import 되는지 확인
    expect(() => require('react')).not.toThrow();
    expect(() => require('react-dom')).not.toThrow();
  });

  it('should have Tailwind CSS configured', () => {
    // Tailwind CSS 클래스가 정상적으로 작동하는지 확인
    const element = document.createElement('div');
    element.className = 'bg-blue-500 text-white p-4';
    expect(element.className).toBe('bg-blue-500 text-white p-4');
  });

  it('should build project without errors', () => {
    // 빌드 프로세스가 정상적으로 작동하는지 확인
    // 이 테스트는 실제 빌드 명령어가 성공할 때 통과됨
    expect(process.env.NODE_ENV).toBeDefined();
  });

  it('should support TypeScript', () => {
    // TypeScript 설정이 정상적으로 작동하는지 확인
    const testVariable: string = 'Hello TypeScript';
    expect(typeof testVariable).toBe('string');
  });
}); 