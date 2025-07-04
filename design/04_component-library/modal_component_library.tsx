import React, { useState, useEffect, useRef, Fragment } from 'react';

// =============================================================================
// Types & Interfaces
// =============================================================================

interface BaseProps {
  className?: string;
}

// Modal Types
interface ModalProps extends BaseProps {
  isOpen: boolean;
  onClose: () => void;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  showCloseButton?: boolean;
  children: React.ReactNode;
}

interface ModalHeaderProps extends BaseProps {
  children: React.ReactNode;
  onClose?: () => void;
}

interface ModalBodyProps extends BaseProps {
  children: React.ReactNode;
}

interface ModalFooterProps extends BaseProps {
  children: React.ReactNode;
}

// Workflow Selection Modal Types
interface WorkflowOption {
  id: string;
  icon: string;
  title: string;
  description: string;
  badge?: string;
  category?: string;
  isPopular?: boolean;
  isNew?: boolean;
}

interface WorkflowSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (workflow: WorkflowOption) => void;
  workflows: WorkflowOption[];
}

// File Upload Modal Types
interface FileUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFilesUploaded: (files: File[]) => void;
  acceptedTypes?: string[];
  maxFileSize?: number; // in MB
  maxFiles?: number;
}

interface UploadedFile {
  file: File;
  id: string;
  status: 'uploading' | 'completed' | 'error';
  progress: number;
  error?: string;
}

// Confirmation Modal Types
interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
}

// =============================================================================
// Utility Functions
// =============================================================================

const cn = (...classes: (string | undefined | false)[]) => {
  return classes.filter(Boolean).join(' ');
};

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// =============================================================================
// Portal Component (for rendering modals outside of main DOM tree)
// =============================================================================

const Portal: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!mounted) return null;

  // In a real implementation, you would use ReactDOM.createPortal
  // For this demo, we'll render directly
  return <Fragment>{children}</Fragment>;
};

// =============================================================================
// Base Modal Components
// =============================================================================

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  size = 'md',
  closeOnOverlayClick = true,
  closeOnEscape = true,
  showCloseButton = true,
  children,
  className
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  // Handle escape key
  useEffect(() => {
    if (!closeOnEscape) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose, closeOnEscape]);

  // Handle body scroll lock
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Handle overlay click
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-[95vw] max-h-[95vh]'
  };

  return (
    <Portal>
      <div className="fixed inset-0 z-50 overflow-y-auto">
        {/* Backdrop */}
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
          onClick={handleOverlayClick}
        />
        
        {/* Modal */}
        <div className="flex min-h-full items-center justify-center p-4">
          <div
            ref={modalRef}
            className={cn(
              'relative w-full transform overflow-hidden rounded-xl bg-white shadow-2xl transition-all',
              sizeClasses[size],
              className
            )}
          >
            {children}
            
            {/* Close button */}
            {showCloseButton && (
              <button
                onClick={onClose}
                className="absolute right-4 top-4 rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>
    </Portal>
  );
};

const ModalHeader: React.FC<ModalHeaderProps> = ({ children, onClose, className }) => (
  <div className={cn('px-6 py-4 border-b border-gray-200', className)}>
    <div className="flex items-center justify-between">
      <div className="text-lg font-semibold text-gray-900">
        {children}
      </div>
    </div>
  </div>
);

const ModalBody: React.FC<ModalBodyProps> = ({ children, className }) => (
  <div className={cn('px-6 py-6', className)}>
    {children}
  </div>
);

const ModalFooter: React.FC<ModalFooterProps> = ({ children, className }) => (
  <div className={cn('px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-3', className)}>
    {children}
  </div>
);

// =============================================================================
// Specialized Modal Components
// =============================================================================

// Workflow Selection Modal
const WorkflowSelectionModal: React.FC<WorkflowSelectionModalProps> = ({
  isOpen,
  onClose,
  onSelect,
  workflows
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = ['all', ...Array.from(new Set(workflows.map(w => w.category).filter(Boolean)))];
  
  const filteredWorkflows = workflows.filter(workflow => {
    const matchesSearch = workflow.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         workflow.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || workflow.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleSelect = (workflow: WorkflowOption) => {
    onSelect(workflow);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalHeader onClose={onClose}>
        ⚡ 워크플로우 선택
      </ModalHeader>
      
      <ModalBody>
        {/* Search and Filter */}
        <div className="space-y-4 mb-6">
          <div className="relative">
            <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="워크플로우 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div className="flex gap-2 flex-wrap">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={cn(
                  'px-3 py-1 text-sm rounded-full transition-colors',
                  selectedCategory === category
                    ? 'bg-blue-100 text-blue-800 border border-blue-200'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                )}
              >
                {category === 'all' ? '전체' : category}
              </button>
            ))}
          </div>
        </div>

        {/* Workflow Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
          {filteredWorkflows.map(workflow => (
            <div
              key={workflow.id}
              onClick={() => handleSelect(workflow)}
              className="p-4 border border-gray-200 rounded-lg cursor-pointer hover:border-blue-300 hover:shadow-md transition-all"
            >
              <div className="flex items-start gap-3">
                <div className="text-2xl">{workflow.icon}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-gray-900">{workflow.title}</h3>
                    {workflow.isPopular && (
                      <span className="px-2 py-0.5 bg-orange-500 text-white text-xs rounded-full">인기</span>
                    )}
                    {workflow.isNew && (
                      <span className="px-2 py-0.5 bg-green-500 text-white text-xs rounded-full">신규</span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">{workflow.description}</p>
                  {workflow.category && (
                    <span className="inline-block mt-2 text-xs text-gray-500">
                      📁 {workflow.category}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredWorkflows.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <div className="text-4xl mb-2">🔍</div>
            <p>검색 결과가 없습니다.</p>
          </div>
        )}
      </ModalBody>
    </Modal>
  );
};

// File Upload Modal
const FileUploadModal: React.FC<FileUploadModalProps> = ({
  isOpen,
  onClose,
  onFilesUploaded,
  acceptedTypes = ['.pdf', '.docx', '.txt', '.md', '.csv'],
  maxFileSize = 10,
  maxFiles = 5
}) => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;

    const fileArray = Array.from(files);
    const validFiles = fileArray.filter(file => {
      const isValidType = acceptedTypes.some(type => file.name.toLowerCase().endsWith(type.toLowerCase()));
      const isValidSize = file.size <= maxFileSize * 1024 * 1024;
      return isValidType && isValidSize;
    });

    if (uploadedFiles.length + validFiles.length > maxFiles) {
      alert(`최대 ${maxFiles}개의 파일만 업로드할 수 있습니다.`);
      return;
    }

    const newUploadedFiles: UploadedFile[] = validFiles.map(file => ({
      file,
      id: Math.random().toString(36).substr(2, 9),
      status: 'uploading',
      progress: 0
    }));

    setUploadedFiles(prev => [...prev, ...newUploadedFiles]);

    // Simulate upload progress
    newUploadedFiles.forEach(uploadedFile => {
      const interval = setInterval(() => {
        setUploadedFiles(prev => prev.map(f => {
          if (f.id === uploadedFile.id) {
            const newProgress = Math.min(f.progress + Math.random() * 30, 100);
            if (newProgress === 100) {
              clearInterval(interval);
              return { ...f, progress: 100, status: 'completed' as const };
            }
            return { ...f, progress: newProgress };
          }
          return f;
        }));
      }, 200);
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const removeFile = (id: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== id));
  };

  const handleUpload = () => {
    const completedFiles = uploadedFiles.filter(f => f.status === 'completed').map(f => f.file);
    onFilesUploaded(completedFiles);
    setUploadedFiles([]);
    onClose();
  };

  const completedCount = uploadedFiles.filter(f => f.status === 'completed').length;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalHeader>
        📎 파일 업로드
      </ModalHeader>
      
      <ModalBody>
        {/* Upload Area */}
        <div
          className={cn(
            'border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer',
            isDragOver 
              ? 'border-blue-500 bg-blue-50' 
              : 'border-gray-300 hover:border-gray-400'
          )}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="text-4xl mb-4">📁</div>
          <h3 className="text-lg font-medium mb-2">파일을 드래그하여 업로드</h3>
          <p className="text-gray-600 mb-4">또는 클릭하여 파일 선택</p>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            파일 선택
          </button>
          <p className="text-xs text-gray-500 mt-4">
            지원 형식: {acceptedTypes.join(', ')} (최대 {maxFileSize}MB, {maxFiles}개)
          </p>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={acceptedTypes.join(',')}
          onChange={(e) => handleFileSelect(e.target.files)}
          className="hidden"
        />

        {/* Uploaded Files List */}
        {uploadedFiles.length > 0 && (
          <div className="mt-6">
            <h4 className="font-medium mb-3">업로드된 파일 ({uploadedFiles.length})</h4>
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {uploadedFiles.map(uploadedFile => (
                <div key={uploadedFile.id} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg">
                  <div className="text-lg">
                    {uploadedFile.file.name.endsWith('.pdf') ? '📄' :
                     uploadedFile.file.name.endsWith('.docx') ? '📝' :
                     uploadedFile.file.name.endsWith('.csv') ? '📊' : '📄'}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">{uploadedFile.file.name}</span>
                      <button
                        onClick={() => removeFile(uploadedFile.id)}
                        className="text-gray-400 hover:text-red-600 transition-colors"
                      >
                        ✕
                      </button>
                    </div>
                    <div className="text-xs text-gray-500 mb-2">
                      {formatFileSize(uploadedFile.file.size)}
                    </div>
                    
                    {uploadedFile.status === 'uploading' && (
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${uploadedFile.progress}%` }}
                        />
                      </div>
                    )}
                    
                    {uploadedFile.status === 'completed' && (
                      <div className="flex items-center gap-1 text-green-600 text-xs">
                        <span>✓</span>
                        <span>업로드 완료</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </ModalBody>
      
      <ModalFooter>
        <button
          onClick={onClose}
          className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
        >
          취소
        </button>
        <button
          onClick={handleUpload}
          disabled={completedCount === 0}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          업로드 ({completedCount})
        </button>
      </ModalFooter>
    </Modal>
  );
};

// Confirmation Modal
const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = '확인',
  cancelText = '취소',
  variant = 'info'
}) => {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  const variantStyles = {
    danger: {
      icon: '🚨',
      confirmButton: 'bg-red-600 hover:bg-red-700 text-white',
      iconColor: 'text-red-600'
    },
    warning: {
      icon: '⚠️',
      confirmButton: 'bg-yellow-600 hover:bg-yellow-700 text-white',
      iconColor: 'text-yellow-600'
    },
    info: {
      icon: '💡',
      confirmButton: 'bg-blue-600 hover:bg-blue-700 text-white',
      iconColor: 'text-blue-600'
    }
  };

  const styles = variantStyles[variant];

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm">
      <ModalBody>
        <div className="text-center">
          <div className={cn('text-4xl mb-4', styles.iconColor)}>
            {styles.icon}
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {title}
          </h3>
          <p className="text-gray-600 mb-6">
            {message}
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              {cancelText}
            </button>
            <button
              onClick={handleConfirm}
              className={cn('px-4 py-2 rounded-lg transition-colors', styles.confirmButton)}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </ModalBody>
    </Modal>
  );
};

// =============================================================================
// Demo Component
// =============================================================================

const ModalDemo: React.FC = () => {
  const [basicModalOpen, setBasicModalOpen] = useState(false);
  const [workflowModalOpen, setWorkflowModalOpen] = useState(false);
  const [fileUploadModalOpen, setFileUploadModalOpen] = useState(false);
  const [confirmationModalOpen, setConfirmationModalOpen] = useState(false);
  const [selectedWorkflow, setSelectedWorkflow] = useState<WorkflowOption | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const sampleWorkflows: WorkflowOption[] = [
    {
      id: 'hr-hiring',
      icon: '⚡',
      title: 'HR 채용 프로세스',
      description: '채용 공고부터 최종 합격까지 전체 프로세스를 자동화합니다.',
      category: '인사관리',
      isPopular: true
    },
    {
      id: 'data-analysis',
      icon: '📊',
      title: '데이터 분석 워크플로우',
      description: 'CSV 데이터를 분석하고 인사이트를 도출합니다.',
      category: '데이터 분석'
    },
    {
      id: 'email-writing',
      icon: '📧',
      title: '이메일 작성',
      description: '비즈니스 이메일을 자동으로 작성합니다.',
      category: '커뮤니케이션',
      isNew: true
    },
    {
      id: 'market-research',
      icon: '🔍',
      title: '시장 조사',
      description: '시장 동향과 경쟁사 분석을 수행합니다.',
      category: '리서치'
    },
    {
      id: 'content-creation',
      icon: '📝',
      title: '콘텐츠 제작',
      description: '블로그 포스트와 마케팅 콘텐츠를 생성합니다.',
      category: '마케팅'
    }
  ];

  const handleWorkflowSelect = (workflow: WorkflowOption) => {
    setSelectedWorkflow(workflow);
  };

  const handleFilesUploaded = (files: File[]) => {
    setUploadedFiles(prev => [...prev, ...files]);
  };

  const handleDeleteFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl mx-auto mb-4 flex items-center justify-center text-3xl">
          🪟
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Modal Component Library
        </h1>
        <p className="text-lg text-gray-600">
          다양한 용도의 모달 컴포넌트 데모
        </p>
      </div>

      {/* Modal Triggers */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h2 className="text-xl font-semibold mb-4">🎮 Modal 데모</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            onClick={() => setBasicModalOpen(true)}
            className="p-4 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors text-left"
          >
            <div className="text-2xl mb-2">📝</div>
            <h3 className="font-medium">기본 모달</h3>
            <p className="text-sm text-gray-600">헤더, 바디, 푸터가 있는 기본 모달</p>
          </button>

          <button
            onClick={() => setWorkflowModalOpen(true)}
            className="p-4 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors text-left"
          >
            <div className="text-2xl mb-2">⚡</div>
            <h3 className="font-medium">워크플로우 선택</h3>
            <p className="text-sm text-gray-600">검색과 필터가 있는 선택 모달</p>
          </button>

          <button
            onClick={() => setFileUploadModalOpen(true)}
            className="p-4 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 transition-colors text-left"
          >
            <div className="text-2xl mb-2">📎</div>
            <h3 className="font-medium">파일 업로드</h3>
            <p className="text-sm text-gray-600">드래그앤드롭 파일 업로드</p>
          </button>

          <button
            onClick={() => setConfirmationModalOpen(true)}
            className="p-4 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors text-left"
          >
            <div className="text-2xl mb-2">🚨</div>
            <h3 className="font-medium">확인 모달</h3>
            <p className="text-sm text-gray-600">중요한 액션 확인용</p>
          </button>
        </div>
      </div>

      {/* Status Display */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Selected Workflow */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold mb-4">선택된 워크플로우</h3>
          {selectedWorkflow ? (
            <div className="p-4 border border-blue-200 rounded-lg bg-blue-50">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">{selectedWorkflow.icon}</span>
                <div>
                  <h4 className="font-medium text-blue-900">{selectedWorkflow.title}</h4>
                  <p className="text-sm text-blue-700">{selectedWorkflow.description}</p>
                </div>
              </div>
              <span className="inline-block px-2 py-1 bg-blue-200 text-blue-800 text-xs rounded-full">
                {selectedWorkflow.category}
              </span>
            </div>
          ) : (
            <div className="p-4 border border-gray-200 rounded-lg text-center text-gray-500">
              워크플로우를 선택해주세요
            </div>
          )}
        </div>

        {/* Uploaded Files */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold mb-4">업로드된 파일 ({uploadedFiles.length})</h3>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {uploadedFiles.length > 0 ? (
              uploadedFiles.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-2 border border-gray-200 rounded">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">📄</span>
                    <span className="text-sm font-medium">{file.name}</span>
                    <span className="text-xs text-gray-500">({formatFileSize(file.size)})</span>
                  </div>
                  <button
                    onClick={() => handleDeleteFile(index)}
                    className="text-red-500 hover:text-red-700 text-sm"
                  >
                    ✕
                  </button>
                </div>
              ))
            ) : (
              <div className="p-4 border border-gray-200 rounded-lg text-center text-gray-500">
                업로드된 파일이 없습니다
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Usage Examples */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h2 className="text-xl font-semibold mb-4">💻 사용 예시</h2>
        <div className="bg-gray-100 rounded-lg p-4 font-mono text-sm overflow-x-auto">
          <pre className="text-gray-800">{`// 기본 Modal 사용
<Modal isOpen={isOpen} onClose={onClose} size="md">
  <ModalHeader>제목</ModalHeader>
  <ModalBody>내용</ModalBody>
  <ModalFooter>
    <Button onClick={onClose}>취소</Button>
    <Button variant="primary">확인</Button>
  </ModalFooter>
</Modal>

// 워크플로우 선택 Modal
<WorkflowSelectionModal
  isOpen={isOpen}
  onClose={onClose}
  workflows={workflows}
  onSelect={(workflow) => console.log(workflow)}
/>

// 파일 업로드 Modal
<FileUploadModal
  isOpen={isOpen}
  onClose={onClose}
  acceptedTypes={['.pdf', '.docx']}
  maxFileSize={10}
  onFilesUploaded={(files) => console.log(files)}
/>

// 확인 Modal
<ConfirmationModal
  isOpen={isOpen}
  onClose={onClose}
  title="정말 삭제하시겠습니까?"
  message="이 작업은 되돌릴 수 없습니다."
  variant="danger"
  onConfirm={() => console.log('confirmed')}
/>`}</pre>
        </div>
      </div>

      {/* Features List */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h2 className="text-xl font-semibold mb-4">✨ 주요 기능</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <span className="text-green-500 text-lg">✓</span>
              <div>
                <h4 className="font-medium">Portal 렌더링</h4>
                <p className="text-sm text-gray-600">DOM 트리 최상단에 렌더링하여 z-index 충돌 방지</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-green-500 text-lg">✓</span>
              <div>
                <h4 className="font-medium">키보드 네비게이션</h4>
                <p className="text-sm text-gray-600">ESC 키로 닫기, 탭 키로 포커스 이동</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-green-500 text-lg">✓</span>
              <div>
                <h4 className="font-medium">스크롤 잠금</h4>
                <p className="text-sm text-gray-600">모달 열릴 때 배경 스크롤 방지</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-green-500 text-lg">✓</span>
              <div>
                <h4 className="font-medium">반응형 디자인</h4>
                <p className="text-sm text-gray-600">모든 디바이스 크기에서 최적화</p>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <span className="text-green-500 text-lg">✓</span>
              <div>
                <h4 className="font-medium">커스터마이징</h4>
                <p className="text-sm text-gray-600">크기, 닫기 옵션, 애니메이션 커스터마이징</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-green-500 text-lg">✓</span>
              <div>
                <h4 className="font-medium">드래그앤드롭</h4>
                <p className="text-sm text-gray-600">파일 업로드에서 직관적인 드래그앤드롭</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-green-500 text-lg">✓</span>
              <div>
                <h4 className="font-medium">검색 & 필터</h4>
                <p className="text-sm text-gray-600">워크플로우 선택에서 실시간 검색</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-green-500 text-lg">✓</span>
              <div>
                <h4 className="font-medium">TypeScript 지원</h4>
                <p className="text-sm text-gray-600">완전한 타입 안전성과 IntelliSense</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Components */}
      
      {/* Basic Modal */}
      <Modal 
        isOpen={basicModalOpen} 
        onClose={() => setBasicModalOpen(false)}
        size="md"
      >
        <ModalHeader>
          📝 기본 모달 예시
        </ModalHeader>
        <ModalBody>
          <p className="text-gray-700 leading-relaxed mb-4">
            이것은 기본 모달의 예시입니다. 헤더, 바디, 푸터로 구성되어 있으며 
            다양한 크기와 옵션을 설정할 수 있습니다.
          </p>
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h4 className="font-medium text-blue-900 mb-2">모달 특징:</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• ESC 키로 닫기</li>
              <li>• 오버레이 클릭으로 닫기</li>
              <li>• 배경 스크롤 방지</li>
              <li>• 반응형 디자인</li>
            </ul>
          </div>
        </ModalBody>
        <ModalFooter>
          <button
            onClick={() => setBasicModalOpen(false)}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            취소
          </button>
          <button
            onClick={() => setBasicModalOpen(false)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            확인
          </button>
        </ModalFooter>
      </Modal>

      {/* Workflow Selection Modal */}
      <WorkflowSelectionModal
        isOpen={workflowModalOpen}
        onClose={() => setWorkflowModalOpen(false)}
        workflows={sampleWorkflows}
        onSelect={handleWorkflowSelect}
      />

      {/* File Upload Modal */}
      <FileUploadModal
        isOpen={fileUploadModalOpen}
        onClose={() => setFileUploadModalOpen(false)}
        onFilesUploaded={handleFilesUploaded}
        acceptedTypes={['.pdf', '.docx', '.txt', '.md', '.csv', '.xlsx']}
        maxFileSize={10}
        maxFiles={5}
      />

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={confirmationModalOpen}
        onClose={() => setConfirmationModalOpen(false)}
        title="정말 삭제하시겠습니까?"
        message="이 워크플로우를 삭제하면 되돌릴 수 없습니다. 계속 진행하시겠습니까?"
        variant="danger"
        confirmText="삭제"
        cancelText="취소"
        onConfirm={() => {
          console.log('Confirmed deletion');
          // 실제 삭제 로직
        }}
      />

      {/* Footer */}
      <div className="text-center py-8">
        <div className="flex justify-center gap-4 mb-4">
          <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">Portal</span>
          <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">Keyboard</span>
          <span className="px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full">Drag & Drop</span>
          <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm rounded-full">TypeScript</span>
        </div>
        <p className="text-gray-600">
          완전한 기능을 갖춘 모달 컴포넌트 라이브러리
        </p>
      </div>
    </div>
  );
};

export default ModalDemo;