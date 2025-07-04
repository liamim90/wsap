import React, { useState, forwardRef, ButtonHTMLAttributes, InputHTMLAttributes, TextareaHTMLAttributes, SelectHTMLAttributes } from 'react';

// =============================================================================
// Types & Interfaces
// =============================================================================

interface BaseProps {
  className?: string;
}

// Button Types
type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'success' | 'warning' | 'error';
type ButtonSize = 'xs' | 'sm' | 'base' | 'lg' | 'xl';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, BaseProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children: React.ReactNode;
}

// Input Types
interface InputProps extends InputHTMLAttributes<HTMLInputElement>, BaseProps {
  label?: string;
  error?: string;
  helperText?: string;
}

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement>, BaseProps {
  label?: string;
  error?: string;
  helperText?: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement>, BaseProps {
  label?: string;
  error?: string;
  helperText?: string;
  children: React.ReactNode;
}

// Badge Types
type BadgeVariant = 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'workflow';

interface BadgeProps extends BaseProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
}

// Alert Types
type AlertVariant = 'info' | 'success' | 'warning' | 'error';

interface AlertProps extends BaseProps {
  variant?: AlertVariant;
  title?: string;
  children: React.ReactNode;
  onClose?: () => void;
}

// Card Types
interface CardProps extends BaseProps {
  children: React.ReactNode;
}

interface CardHeaderProps extends BaseProps {
  children: React.ReactNode;
}

interface CardBodyProps extends BaseProps {
  children: React.ReactNode;
}

interface CardFooterProps extends BaseProps {
  children: React.ReactNode;
}

// Status Indicator Types
type StatusType = 'working' | 'complete' | 'error' | 'waiting';

interface StatusIndicatorProps extends BaseProps {
  status: StatusType;
  label?: string;
  animate?: boolean;
}

// Chat Message Types
interface ChatMessageProps extends BaseProps {
  type: 'user' | 'assistant';
  avatar?: string;
  children: React.ReactNode;
  status?: React.ReactNode;
}

// Workflow Card Types
interface WorkflowCardProps extends BaseProps {
  icon: string;
  title: string;
  description: string;
  badge?: string;
  rating?: number;
  usageCount?: number;
  isSelected?: boolean;
  onClick?: () => void;
}

// =============================================================================
// Utility Functions
// =============================================================================

const cn = (...classes: (string | undefined | false)[]) => {
  return classes.filter(Boolean).join(' ');
};

// =============================================================================
// Components
// =============================================================================

// Button Component
const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'base', isLoading, leftIcon, rightIcon, children, className, disabled, ...props }, ref) => {
    const baseClasses = 'inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
    
    const variantClasses = {
      primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 shadow-sm hover:shadow-md',
      secondary: 'bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200 hover:border-gray-400 focus:ring-gray-500',
      ghost: 'bg-transparent text-gray-600 hover:bg-gray-100 hover:text-gray-800 focus:ring-gray-500',
      success: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500',
      warning: 'bg-yellow-500 text-white hover:bg-yellow-600 focus:ring-yellow-500',
      error: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500'
    };
    
    const sizeClasses = {
      xs: 'px-2 py-1 text-xs rounded',
      sm: 'px-3 py-2 text-sm rounded-md',
      base: 'px-4 py-2.5 text-sm rounded-lg',
      lg: 'px-6 py-3 text-base rounded-lg',
      xl: 'px-8 py-4 text-lg rounded-xl'
    };
    
    return (
      <button
        ref={ref}
        className={cn(baseClasses, variantClasses[variant], sizeClasses[size], className)}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        ) : (
          leftIcon
        )}
        {children}
        {!isLoading && rightIcon}
      </button>
    );
  }
);

Button.displayName = 'Button';

// Input Component
const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className, ...props }, ref) => {
    const inputClasses = cn(
      'block w-full px-3 py-2.5 text-sm border rounded-lg transition-colors duration-200',
      'placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-1',
      error 
        ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' 
        : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500/20',
      'disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed',
      className
    );
    
    return (
      <div className="space-y-1">
        {label && (
          <label className="block text-sm font-medium text-gray-700">
            {label}
          </label>
        )}
        <input ref={ref} className={inputClasses} {...props} />
        {(error || helperText) && (
          <p className={cn('text-xs', error ? 'text-red-600' : 'text-gray-500')}>
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

// Textarea Component
const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, helperText, className, ...props }, ref) => {
    const textareaClasses = cn(
      'block w-full px-3 py-2.5 text-sm border rounded-lg transition-colors duration-200 resize-none',
      'placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-1',
      error 
        ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' 
        : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500/20',
      'disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed',
      className
    );
    
    return (
      <div className="space-y-1">
        {label && (
          <label className="block text-sm font-medium text-gray-700">
            {label}
          </label>
        )}
        <textarea ref={ref} className={textareaClasses} {...props} />
        {(error || helperText) && (
          <p className={cn('text-xs', error ? 'text-red-600' : 'text-gray-500')}>
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

// Select Component
const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, helperText, children, className, ...props }, ref) => {
    const selectClasses = cn(
      'block w-full px-3 py-2.5 text-sm border rounded-lg transition-colors duration-200',
      'bg-white focus:outline-none focus:ring-2 focus:ring-offset-1',
      error 
        ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' 
        : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500/20',
      'disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed',
      className
    );
    
    return (
      <div className="space-y-1">
        {label && (
          <label className="block text-sm font-medium text-gray-700">
            {label}
          </label>
        )}
        <select ref={ref} className={selectClasses} {...props}>
          {children}
        </select>
        {(error || helperText) && (
          <p className={cn('text-xs', error ? 'text-red-600' : 'text-gray-500')}>
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';

// Badge Component
const Badge: React.FC<BadgeProps> = ({ variant = 'primary', children, className }) => {
  const variantClasses = {
    primary: 'bg-blue-100 text-blue-800',
    secondary: 'bg-gray-100 text-gray-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    error: 'bg-red-100 text-red-800',
    workflow: 'bg-orange-500 text-white'
  };
  
  return (
    <span className={cn(
      'inline-flex items-center px-2 py-1 text-xs font-medium rounded-full',
      variantClasses[variant],
      className
    )}>
      {children}
    </span>
  );
};

// Alert Component
const Alert: React.FC<AlertProps> = ({ variant = 'info', title, children, onClose, className }) => {
  const variantClasses = {
    info: 'bg-blue-50 border-blue-200 text-blue-800',
    success: 'bg-green-50 border-green-200 text-green-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    error: 'bg-red-50 border-red-200 text-red-800'
  };
  
  const iconMap = {
    info: '💡',
    success: '✅',
    warning: '⚠️',
    error: '❌'
  };
  
  return (
    <div className={cn(
      'p-4 border rounded-lg',
      variantClasses[variant],
      className
    )}>
      <div className="flex items-start justify-between">
        <div className="flex gap-3">
          <span className="text-lg">{iconMap[variant]}</span>
          <div>
            {title && (
              <h4 className="font-medium mb-1">{title}</h4>
            )}
            <div className="text-sm">{children}</div>
          </div>
        </div>
        {onClose && (
          <button 
            onClick={onClose}
            className="ml-4 text-lg hover:opacity-70 transition-opacity"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
};

// Card Components
const Card: React.FC<CardProps> = ({ children, className }) => (
  <div className={cn(
    'bg-white border border-gray-200 rounded-xl shadow-sm',
    className
  )}>
    {children}
  </div>
);

const CardHeader: React.FC<CardHeaderProps> = ({ children, className }) => (
  <div className={cn('px-6 py-4 border-b border-gray-200', className)}>
    {children}
  </div>
);

const CardBody: React.FC<CardBodyProps> = ({ children, className }) => (
  <div className={cn('px-6 py-6', className)}>
    {children}
  </div>
);

const CardFooter: React.FC<CardFooterProps> = ({ children, className }) => (
  <div className={cn('px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-xl', className)}>
    {children}
  </div>
);

// Status Indicator Component
const StatusIndicator: React.FC<StatusIndicatorProps> = ({ 
  status, 
  label, 
  animate = true, 
  className 
}) => {
  const statusClasses = {
    working: 'bg-blue-500',
    complete: 'bg-green-500',
    error: 'bg-red-500',
    waiting: 'bg-yellow-500'
  };
  
  const shouldAnimate = animate && status === 'working';
  
  return (
    <div className={cn('inline-flex items-center gap-2', className)}>
      <div className={cn(
        'w-2 h-2 rounded-full',
        statusClasses[status],
        shouldAnimate && 'animate-pulse'
      )} />
      {label && <span className="text-sm text-gray-600">{label}</span>}
    </div>
  );
};

// Chat Message Component
const ChatMessage: React.FC<ChatMessageProps> = ({ 
  type, 
  avatar, 
  children, 
  status, 
  className 
}) => {
  const isUser = type === 'user';
  
  return (
    <div className={cn(
      'flex gap-3 mb-4',
      isUser && 'flex-row-reverse',
      className
    )}>
      <div className={cn(
        'w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0',
        isUser 
          ? 'bg-blue-600 text-white' 
          : 'bg-gray-500 text-white'
      )}>
        {avatar || (isUser ? 'U' : '🤖')}
      </div>
      <div className={cn('max-w-[70%]', isUser && 'flex flex-col items-end')}>
        <div className={cn(
          'px-4 py-3 rounded-xl text-sm leading-relaxed',
          isUser 
            ? 'bg-blue-600 text-white rounded-br-md' 
            : 'bg-gray-100 text-gray-900 rounded-bl-md'
        )}>
          {children}
        </div>
        {status && (
          <div className="mt-2">
            {status}
          </div>
        )}
      </div>
    </div>
  );
};

// Workflow Card Component
const WorkflowCard: React.FC<WorkflowCardProps> = ({
  icon,
  title,
  description,
  badge,
  rating,
  usageCount,
  isSelected,
  onClick,
  className
}) => {
  return (
    <div 
      className={cn(
        'p-4 border border-gray-200 rounded-xl cursor-pointer transition-all duration-200',
        'hover:border-blue-300 hover:shadow-md',
        isSelected && 'border-blue-500 bg-blue-50',
        className
      )}
      onClick={onClick}
    >
      <div className="flex items-start gap-3 mb-3">
        <div className="text-2xl">{icon}</div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className={cn(
              'font-semibold',
              isSelected ? 'text-blue-900' : 'text-gray-900'
            )}>
              {title}
            </h3>
            {badge && <Badge variant="workflow">{badge}</Badge>}
          </div>
          <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
        </div>
      </div>
      
      {(rating !== undefined || usageCount !== undefined) && (
        <div className="flex items-center justify-between text-xs text-gray-500">
          {rating !== undefined && (
            <span>⭐ {rating.toFixed(1)}</span>
          )}
          {usageCount !== undefined && (
            <span>{usageCount}회 사용</span>
          )}
        </div>
      )}
    </div>
  );
};

// =============================================================================
// Demo Component
// =============================================================================

const ComponentLibraryDemo: React.FC = () => {
  const [selectedWorkflow, setSelectedWorkflow] = useState<string>('');
  const [inputValue, setInputValue] = useState('');
  const [textareaValue, setTextareaValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(true);

  const handleLoadingDemo = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl mx-auto mb-4 flex items-center justify-center text-3xl">
          🤖
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Agentic AI Component Library
        </h1>
        <p className="text-lg text-gray-600">
          React + TypeScript + Tailwind CSS 기반 컴포넌트 라이브러리
        </p>
      </div>

      {/* Buttons */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold">🔘 Button Components</h2>
        </CardHeader>
        <CardBody className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-3">Button Variants</h3>
            <div className="flex flex-wrap gap-3">
              <Button variant="primary">Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="success">Success</Button>
              <Button variant="warning">Warning</Button>
              <Button variant="error">Error</Button>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-3">Button Sizes</h3>
            <div className="flex flex-wrap items-center gap-3">
              <Button size="xs">Extra Small</Button>
              <Button size="sm">Small</Button>
              <Button size="base">Base</Button>
              <Button size="lg">Large</Button>
              <Button size="xl">Extra Large</Button>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-3">Button States</h3>
            <div className="flex flex-wrap gap-3">
              <Button leftIcon="📁">With Left Icon</Button>
              <Button rightIcon="→">With Right Icon</Button>
              <Button isLoading={isLoading} onClick={handleLoadingDemo}>
                {isLoading ? 'Loading...' : 'Test Loading'}
              </Button>
              <Button disabled>Disabled</Button>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Form Components */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold">📝 Form Components</h2>
        </CardHeader>
        <CardBody className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <Input 
                label="기본 입력"
                placeholder="텍스트를 입력하세요"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
              <Input 
                label="에러 상태"
                placeholder="잘못된 입력"
                error="올바른 형식으로 입력해주세요"
                value="invalid@"
              />
              <Input 
                label="비활성화"
                placeholder="비활성화된 입력"
                disabled
              />
            </div>
            
            <div className="space-y-4">
              <Select label="워크플로우 선택">
                <option value="">워크플로우를 선택하세요</option>
                <option value="hr">HR 채용 프로세스</option>
                <option value="data">데이터 분석</option>
                <option value="email">이메일 작성</option>
              </Select>
              
              <Textarea 
                label="메시지"
                placeholder="메시지를 입력하세요..."
                rows={4}
                value={textareaValue}
                onChange={(e) => setTextareaValue(e.target.value)}
                helperText="최대 1000자까지 입력 가능합니다"
              />
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Badges & Status */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold">🏷️ Badge & Status Components</h2>
        </CardHeader>
        <CardBody className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-3">Badges</h3>
            <div className="flex flex-wrap gap-3">
              <Badge variant="primary">Primary</Badge>
              <Badge variant="secondary">Secondary</Badge>
              <Badge variant="success">Success</Badge>
              <Badge variant="warning">Warning</Badge>
              <Badge variant="error">Error</Badge>
              <Badge variant="workflow">Workflow</Badge>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-3">Status Indicators</h3>
            <div className="space-y-3">
              <StatusIndicator status="working" label="작업 중..." />
              <StatusIndicator status="complete" label="완료됨" animate={false} />
              <StatusIndicator status="error" label="오류 발생" animate={false} />
              <StatusIndicator status="waiting" label="대기 중" animate={false} />
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Alerts */}
      {showAlert && (
        <Alert 
          variant="info" 
          title="컴포넌트 라이브러리 데모"
          onClose={() => setShowAlert(false)}
        >
          이 페이지에서 모든 컴포넌트의 동작을 테스트할 수 있습니다. 각 컴포넌트는 완전히 기능하며 실제 프로젝트에서 사용할 수 있습니다.
        </Alert>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Alert variant="success" title="성공">
          컴포넌트가 성공적으로 로드되었습니다.
        </Alert>
        <Alert variant="warning" title="주의">
          일부 기능은 백엔드 연동이 필요합니다.
        </Alert>
      </div>

      {/* Chat Messages */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold">💬 Chat Components</h2>
        </CardHeader>
        <CardBody>
          <div className="max-w-2xl">
            <ChatMessage type="user">
              안녕하세요! HR 채용 프로세스를 시작해주세요.
            </ChatMessage>
            
            <ChatMessage 
              type="assistant"
              status={
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-2">
                  <StatusIndicator status="working" label="단계 1/5: 채용 정보 수집 중..." />
                </div>
              }
            >
              네, HR 채용 프로세스를 시작하겠습니다. 어떤 포지션에 대한 채용인가요?
            </ChatMessage>
            
            <ChatMessage type="user">
              시니어 프론트엔드 개발자 채용입니다.
            </ChatMessage>
          </div>
        </CardBody>
      </Card>

      {/* Workflow Cards */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold">⚡ Workflow Cards</h2>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <WorkflowCard
              icon="⚡"
              title="HR 채용 프로세스"
              description="채용 공고부터 최종 합격까지 전체 프로세스를 자동화합니다."
              badge="인기"
              rating={4.8}
              usageCount={124}
              isSelected={selectedWorkflow === 'hr'}
              onClick={() => setSelectedWorkflow('hr')}
            />
            
            <WorkflowCard
              icon="📊"
              title="데이터 분석 워크플로우"
              description="CSV 데이터를 분석하고 인사이트를 도출합니다."
              rating={4.6}
              usageCount={89}
              isSelected={selectedWorkflow === 'data'}
              onClick={() => setSelectedWorkflow('data')}
            />
            
            <WorkflowCard
              icon="📧"
              title="이메일 작성 워크플로우"
              description="비즈니스 이메일을 자동으로 작성합니다."
              badge="신규"
              rating={4.7}
              usageCount={56}
              isSelected={selectedWorkflow === 'email'}
              onClick={() => setSelectedWorkflow('email')}
            />
          </div>
          
          {selectedWorkflow && (
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                선택된 워크플로우: <strong>{selectedWorkflow}</strong>
              </p>
            </div>
          )}
        </CardBody>
      </Card>

      {/* Usage Example */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold">💻 사용 예시</h2>
        </CardHeader>
        <CardBody>
          <div className="bg-gray-100 rounded-lg p-4 font-mono text-sm overflow-x-auto">
            <pre className="text-gray-800">{`// Button 사용 예시
<Button 
  variant="primary" 
  size="lg" 
  leftIcon="🚀"
  onClick={() => console.log('clicked')}
>
  워크플로우 실행
</Button>

// Input 사용 예시
<Input 
  label="이메일"
  placeholder="이메일을 입력하세요"
  error={errors.email}
  onChange={(e) => setEmail(e.target.value)}
/>

// ChatMessage 사용 예시
<ChatMessage 
  type="assistant"
  status={<StatusIndicator status="working" label="처리 중..." />}
>
  작업을 진행하고 있습니다...
</ChatMessage>`}</pre>
          </div>
        </CardBody>
      </Card>

      {/* Footer */}
      <div className="text-center py-8">
        <div className="flex justify-center gap-4 mb-4">
          <Badge variant="primary">React 18</Badge>
          <Badge variant="secondary">TypeScript</Badge>
          <Badge variant="success">Tailwind CSS</Badge>
        </div>
        <p className="text-gray-600">
          모든 컴포넌트는 완전히 타입 안전하며 접근성을 고려하여 개발되었습니다.
        </p>
      </div>
    </div>
  );
};

export default ComponentLibraryDemo;