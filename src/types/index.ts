// 진료과 타입
export interface Department {
  id: string;
  name: string;
  code: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

// 기구 카테고리 타입
export interface EquipmentCategory {
  id: string;
  name: string;
  description?: string;
  departmentId: string;
  createdAt: string;
  updatedAt: string;
}

// 기구 타입
export interface Equipment {
  id: string;
  name: string;
  serialNumber?: string;
  model?: string;
  manufacturer?: string;
  categoryId: string;
  departmentId: string;
  status: EquipmentStatus;
  location?: string;
  purchaseDate?: string;
  warrantyExpiry?: string;
  lastMaintenanceDate?: string;
  nextMaintenanceDate?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}

// 기구 상태 타입
export type EquipmentStatus = 
  | 'available'      // 사용 가능
  | 'in_use'         // 사용 중
  | 'maintenance'    // 정비 중
  | 'repair'         // 수리 중
  | 'retired'        // 폐기
  | 'lost'           // 분실
  | 'damaged';       // 손상

// 기구 사용 기록 타입
export interface EquipmentUsage {
  id: string;
  equipmentId: string;
  userId: string;
  userName: string;
  departmentId: string;
  startTime: string;
  endTime?: string;
  purpose: string;
  notes?: string;
  status: 'active' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

// 사용자 타입 (기존 AuthContext 확장)
export interface User {
  id: string;
  username: string;
  email?: string;
  name: string;
  role: UserRole;
  departmentId?: string;
  permissions: string[];
  loginTime: string;
  createdAt: string;
  updatedAt: string;
}

// 사용자 역할 타입
export type UserRole = 
  | 'admin'          // 시스템 관리자
  | 'department_head' // 진료과장
  | 'nurse'          // 간호사
  | 'technician'     // 기술자
  | 'viewer';        // 조회자

// 알림 타입
export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  isRead: boolean;
  relatedId?: string;
  relatedType?: 'equipment' | 'maintenance' | 'usage';
  createdAt: string;
}

// 통계 타입
export interface EquipmentStats {
  total: number;
  available: number;
  inUse: number;
  maintenance: number;
  repair: number;
  retired: number;
  lost: number;
  damaged: number;
}

export interface DepartmentStats {
  departmentId: string;
  departmentName: string;
  equipmentCount: number;
  availableCount: number;
  inUseCount: number;
  maintenanceCount: number;
  utilizationRate: number;
}

// API 응답 타입
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// 페이지네이션 타입
export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
