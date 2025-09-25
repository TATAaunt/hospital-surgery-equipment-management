'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { 
  Equipment, 
  Department, 
  EquipmentCategory, 
  EquipmentUsage, 
  EquipmentStats,
  DepartmentStats,
  Notification,
  User
} from '@/types';

interface EquipmentContextType {
  // 데이터 상태
  departments: Department[];
  categories: EquipmentCategory[];
  equipment: Equipment[];
  usage: EquipmentUsage[];
  notifications: Notification[];
  stats: EquipmentStats | null;
  departmentStats: DepartmentStats[];
  
  // 로딩 상태
  loading: {
    departments: boolean;
    categories: boolean;
    equipment: boolean;
    usage: boolean;
    notifications: boolean;
    stats: boolean;
  };
  
  // CRUD 작업
  // 진료과 관리
  addDepartment: (department: Omit<Department, 'id' | 'createdAt' | 'updatedAt'>) => Promise<boolean>;
  updateDepartment: (id: string, department: Partial<Department>) => Promise<boolean>;
  deleteDepartment: (id: string) => Promise<boolean>;
  
  // 카테고리 관리
  addCategory: (category: Omit<EquipmentCategory, 'id' | 'createdAt' | 'updatedAt'>) => Promise<boolean>;
  updateCategory: (id: string, category: Partial<EquipmentCategory>) => Promise<boolean>;
  deleteCategory: (id: string) => Promise<boolean>;
  
  // 기구 관리
  addEquipment: (equipment: Omit<Equipment, 'id' | 'createdAt' | 'updatedAt'>) => Promise<boolean>;
  updateEquipment: (id: string, equipment: Partial<Equipment>) => Promise<boolean>;
  deleteEquipment: (id: string) => Promise<boolean>;
  changeEquipmentStatus: (id: string, status: Equipment['status']) => Promise<boolean>;
  
  // 사용 기록 관리
  startUsage: (equipmentId: string, purpose: string, notes?: string) => Promise<boolean>;
  endUsage: (usageId: string, notes?: string) => Promise<boolean>;
  
  // 알림 관리
  markNotificationAsRead: (id: string) => Promise<boolean>;
  markAllNotificationsAsRead: () => Promise<boolean>;
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt'>) => Promise<boolean>;
  
  // 데이터 새로고침
  refreshData: () => Promise<void>;
  refreshStats: () => Promise<void>;
}

const EquipmentContext = createContext<EquipmentContextType | undefined>(undefined);

export function EquipmentProvider({ children }: { children: ReactNode }) {
  // 데이터 상태
  const [departments, setDepartments] = useState<Department[]>([]);
  const [categories, setCategories] = useState<EquipmentCategory[]>([]);
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [usage, setUsage] = useState<EquipmentUsage[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [stats, setStats] = useState<EquipmentStats | null>(null);
  const [departmentStats, setDepartmentStats] = useState<DepartmentStats[]>([]);
  
  // 로딩 상태
  const [loading, setLoading] = useState({
    departments: false,
    categories: false,
    equipment: false,
    usage: false,
    notifications: false,
    stats: false,
  });

  // 로컬 스토리지에서 데이터 로드
  const loadDataFromStorage = () => {
    try {
      const storedDepartments = localStorage.getItem('departments');
      const storedCategories = localStorage.getItem('categories');
      const storedEquipment = localStorage.getItem('equipment');
      const storedUsage = localStorage.getItem('equipment_usage');
      const storedNotifications = localStorage.getItem('notifications');
      const storedStats = localStorage.getItem('equipment_stats');
      const storedDepartmentStats = localStorage.getItem('department_stats');

      if (storedDepartments) setDepartments(JSON.parse(storedDepartments));
      if (storedCategories) setCategories(JSON.parse(storedCategories));
      if (storedEquipment) setEquipment(JSON.parse(storedEquipment));
      if (storedUsage) setUsage(JSON.parse(storedUsage));
      if (storedNotifications) setNotifications(JSON.parse(storedNotifications));
      if (storedStats) setStats(JSON.parse(storedStats));
      if (storedDepartmentStats) setDepartmentStats(JSON.parse(storedDepartmentStats));
    } catch (error) {
      console.error('데이터 로드 중 오류:', error);
    }
  };

  // 로컬 스토리지에 데이터 저장
  const saveDataToStorage = (key: string, data: any) => {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error('데이터 저장 중 오류:', error);
    }
  };

  // 초기 데이터 설정
  useEffect(() => {
    loadDataFromStorage();
    
    // 초기 데이터가 없으면 샘플 데이터 생성
    if (departments.length === 0) {
      initializeSampleData();
    }
  }, []);

  // 샘플 데이터 초기화
  const initializeSampleData = () => {
    const sampleDepartments: Department[] = [
      {
        id: 'dept-1',
        name: '외과',
        code: 'SURG',
        description: '일반외과 수술실',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'dept-2',
        name: '정형외과',
        code: 'ORTH',
        description: '정형외과 수술실',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'dept-3',
        name: '신경외과',
        code: 'NEURO',
        description: '신경외과 수술실',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    const sampleCategories: EquipmentCategory[] = [
      {
        id: 'cat-1',
        name: '메스',
        description: '수술용 메스',
        departmentId: 'dept-1',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'cat-2',
        name: '핀셋',
        description: '수술용 핀셋',
        departmentId: 'dept-1',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'cat-3',
        name: '드릴',
        description: '골 드릴',
        departmentId: 'dept-2',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    const sampleEquipment: Equipment[] = [
      {
        id: 'eq-1',
        name: '스칼펠 #11',
        serialNumber: 'SCAL-001',
        model: 'Bard-Parker',
        manufacturer: 'BD',
        categoryId: 'cat-1',
        departmentId: 'dept-1',
        status: 'available',
        location: '수술실 A',
        purchaseDate: '2023-01-15',
        warrantyExpiry: '2025-01-15',
        lastMaintenanceDate: '2024-01-15',
        nextMaintenanceDate: '2024-07-15',
        notes: '정기 점검 완료',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: 'admin',
        updatedBy: 'admin',
      },
      {
        id: 'eq-2',
        name: '핀셋 15cm',
        serialNumber: 'FORC-002',
        model: 'Adson',
        manufacturer: 'Medline',
        categoryId: 'cat-2',
        departmentId: 'dept-1',
        status: 'in_use',
        location: '수술실 B',
        purchaseDate: '2023-02-20',
        warrantyExpiry: '2025-02-20',
        lastMaintenanceDate: '2024-02-20',
        nextMaintenanceDate: '2024-08-20',
        notes: '현재 수술 중',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: 'admin',
        updatedBy: 'admin',
      },
    ];

    const sampleNotifications: Notification[] = [
      {
        id: 'notif-1',
        userId: 'current-user',
        title: '정비 알림',
        message: '스칼펠 #11의 정비 예정일이 다가왔습니다. (2024-07-15)',
        type: 'warning',
        isRead: false,
        relatedId: 'eq-1',
        relatedType: 'equipment',
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2시간 전
      },
      {
        id: 'notif-2',
        userId: 'current-user',
        title: '기구 사용 완료',
        message: '핀셋 15cm 사용이 완료되었습니다.',
        type: 'success',
        isRead: false,
        relatedId: 'eq-2',
        relatedType: 'equipment',
        createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4시간 전
      },
      {
        id: 'notif-3',
        userId: 'current-user',
        title: '새 기구 등록',
        message: '외과에 새로운 기구가 등록되었습니다.',
        type: 'info',
        isRead: true,
        relatedId: 'dept-1',
        relatedType: 'equipment',
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1일 전
      },
    ];

    setDepartments(sampleDepartments);
    setCategories(sampleCategories);
    setEquipment(sampleEquipment);
    setNotifications(sampleNotifications);
    
    saveDataToStorage('departments', sampleDepartments);
    saveDataToStorage('categories', sampleCategories);
    saveDataToStorage('equipment', sampleEquipment);
    saveDataToStorage('notifications', sampleNotifications);
    
    calculateStats();
  };

  // 통계 계산
  const calculateStats = () => {
    const equipmentStats: EquipmentStats = {
      total: equipment.length,
      available: equipment.filter(eq => eq.status === 'available').length,
      inUse: equipment.filter(eq => eq.status === 'in_use').length,
      maintenance: equipment.filter(eq => eq.status === 'maintenance').length,
      repair: equipment.filter(eq => eq.status === 'repair').length,
      retired: equipment.filter(eq => eq.status === 'retired').length,
      lost: equipment.filter(eq => eq.status === 'lost').length,
      damaged: equipment.filter(eq => eq.status === 'damaged').length,
    };

    const deptStats: DepartmentStats[] = departments.map(dept => {
      const deptEquipment = equipment.filter(eq => eq.departmentId === dept.id);
      const availableCount = deptEquipment.filter(eq => eq.status === 'available').length;
      const inUseCount = deptEquipment.filter(eq => eq.status === 'in_use').length;
      const maintenanceCount = deptEquipment.filter(eq => eq.status === 'maintenance').length;
      const utilizationRate = deptEquipment.length > 0 ? (inUseCount / deptEquipment.length) * 100 : 0;

      return {
        departmentId: dept.id,
        departmentName: dept.name,
        equipmentCount: deptEquipment.length,
        availableCount,
        inUseCount,
        maintenanceCount,
        utilizationRate,
      };
    });

    setStats(equipmentStats);
    setDepartmentStats(deptStats);
    
    saveDataToStorage('equipment_stats', equipmentStats);
    saveDataToStorage('department_stats', deptStats);
  };

  // 진료과 관리 함수들
  const addDepartment = async (departmentData: Omit<Department, 'id' | 'createdAt' | 'updatedAt'>): Promise<boolean> => {
    try {
      const newDepartment: Department = {
        ...departmentData,
        id: `dept-${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      const updatedDepartments = [...departments, newDepartment];
      setDepartments(updatedDepartments);
      saveDataToStorage('departments', updatedDepartments);
      
      return true;
    } catch (error) {
      console.error('진료과 추가 중 오류:', error);
      return false;
    }
  };

  const updateDepartment = async (id: string, departmentData: Partial<Department>): Promise<boolean> => {
    try {
      const updatedDepartments = departments.map(dept =>
        dept.id === id
          ? { ...dept, ...departmentData, updatedAt: new Date().toISOString() }
          : dept
      );
      
      setDepartments(updatedDepartments);
      saveDataToStorage('departments', updatedDepartments);
      
      return true;
    } catch (error) {
      console.error('진료과 수정 중 오류:', error);
      return false;
    }
  };

  const deleteDepartment = async (id: string): Promise<boolean> => {
    try {
      // 해당 진료과의 기구와 카테고리도 함께 삭제
      const updatedDepartments = departments.filter(dept => dept.id !== id);
      const updatedCategories = categories.filter(cat => cat.departmentId !== id);
      const updatedEquipment = equipment.filter(eq => eq.departmentId !== id);
      
      setDepartments(updatedDepartments);
      setCategories(updatedCategories);
      setEquipment(updatedEquipment);
      
      saveDataToStorage('departments', updatedDepartments);
      saveDataToStorage('categories', updatedCategories);
      saveDataToStorage('equipment', updatedEquipment);
      
      calculateStats();
      
      return true;
    } catch (error) {
      console.error('진료과 삭제 중 오류:', error);
      return false;
    }
  };

  // 카테고리 관리 함수들
  const addCategory = async (categoryData: Omit<EquipmentCategory, 'id' | 'createdAt' | 'updatedAt'>): Promise<boolean> => {
    try {
      const newCategory: EquipmentCategory = {
        ...categoryData,
        id: `cat-${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      const updatedCategories = [...categories, newCategory];
      setCategories(updatedCategories);
      saveDataToStorage('categories', updatedCategories);
      
      return true;
    } catch (error) {
      console.error('카테고리 추가 중 오류:', error);
      return false;
    }
  };

  const updateCategory = async (id: string, categoryData: Partial<EquipmentCategory>): Promise<boolean> => {
    try {
      const updatedCategories = categories.map(cat =>
        cat.id === id
          ? { ...cat, ...categoryData, updatedAt: new Date().toISOString() }
          : cat
      );
      
      setCategories(updatedCategories);
      saveDataToStorage('categories', updatedCategories);
      
      return true;
    } catch (error) {
      console.error('카테고리 수정 중 오류:', error);
      return false;
    }
  };

  const deleteCategory = async (id: string): Promise<boolean> => {
    try {
      const updatedCategories = categories.filter(cat => cat.id !== id);
      setCategories(updatedCategories);
      saveDataToStorage('categories', updatedCategories);
      
      return true;
    } catch (error) {
      console.error('카테고리 삭제 중 오류:', error);
      return false;
    }
  };

  // 기구 관리 함수들
  const addEquipment = async (equipmentData: Omit<Equipment, 'id' | 'createdAt' | 'updatedAt'>): Promise<boolean> => {
    try {
      const newEquipment: Equipment = {
        ...equipmentData,
        id: `eq-${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      const updatedEquipment = [...equipment, newEquipment];
      setEquipment(updatedEquipment);
      saveDataToStorage('equipment', updatedEquipment);
      
      calculateStats();
      
      return true;
    } catch (error) {
      console.error('기구 추가 중 오류:', error);
      return false;
    }
  };

  const updateEquipment = async (id: string, equipmentData: Partial<Equipment>): Promise<boolean> => {
    try {
      const updatedEquipment = equipment.map(eq =>
        eq.id === id
          ? { ...eq, ...equipmentData, updatedAt: new Date().toISOString() }
          : eq
      );
      
      setEquipment(updatedEquipment);
      saveDataToStorage('equipment', updatedEquipment);
      
      calculateStats();
      
      return true;
    } catch (error) {
      console.error('기구 수정 중 오류:', error);
      return false;
    }
  };

  const deleteEquipment = async (id: string): Promise<boolean> => {
    try {
      const updatedEquipment = equipment.filter(eq => eq.id !== id);
      setEquipment(updatedEquipment);
      saveDataToStorage('equipment', updatedEquipment);
      
      calculateStats();
      
      return true;
    } catch (error) {
      console.error('기구 삭제 중 오류:', error);
      return false;
    }
  };

  const changeEquipmentStatus = async (id: string, status: Equipment['status']): Promise<boolean> => {
    try {
      const updatedEquipment = equipment.map(eq =>
        eq.id === id
          ? { ...eq, status, updatedAt: new Date().toISOString() }
          : eq
      );
      
      setEquipment(updatedEquipment);
      saveDataToStorage('equipment', updatedEquipment);
      
      calculateStats();
      
      return true;
    } catch (error) {
      console.error('기구 상태 변경 중 오류:', error);
      return false;
    }
  };

  // 사용 기록 관리 함수들
  const startUsage = async (equipmentId: string, purpose: string, notes?: string): Promise<boolean> => {
    try {
      const newUsage: EquipmentUsage = {
        id: `usage-${Date.now()}`,
        equipmentId,
        userId: 'current-user', // 실제로는 현재 사용자 ID
        userName: '현재 사용자', // 실제로는 현재 사용자 이름
        departmentId: equipment.find(eq => eq.id === equipmentId)?.departmentId || '',
        startTime: new Date().toISOString(),
        purpose,
        notes,
        status: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      const updatedUsage = [...usage, newUsage];
      setUsage(updatedUsage);
      saveDataToStorage('equipment_usage', updatedUsage);
      
      // 기구 상태를 '사용 중'으로 변경
      await changeEquipmentStatus(equipmentId, 'in_use');
      
      return true;
    } catch (error) {
      console.error('사용 시작 중 오류:', error);
      return false;
    }
  };

  const endUsage = async (usageId: string, notes?: string): Promise<boolean> => {
    try {
      const updatedUsage = usage.map(u =>
        u.id === usageId
          ? { ...u, endTime: new Date().toISOString(), status: 'completed', notes, updatedAt: new Date().toISOString() }
          : u
      );
      
      setUsage(updatedUsage);
      saveDataToStorage('equipment_usage', updatedUsage);
      
      // 해당 기구의 상태를 '사용 가능'으로 변경
      const usageRecord = usage.find(u => u.id === usageId);
      if (usageRecord) {
        await changeEquipmentStatus(usageRecord.equipmentId, 'available');
      }
      
      return true;
    } catch (error) {
      console.error('사용 종료 중 오류:', error);
      return false;
    }
  };

  // 알림 관리 함수들
  const markNotificationAsRead = async (id: string): Promise<boolean> => {
    try {
      const updatedNotifications = notifications.map(notif =>
        notif.id === id
          ? { ...notif, isRead: true }
          : notif
      );
      
      setNotifications(updatedNotifications);
      saveDataToStorage('notifications', updatedNotifications);
      
      return true;
    } catch (error) {
      console.error('알림 읽음 처리 중 오류:', error);
      return false;
    }
  };

  const markAllNotificationsAsRead = async (): Promise<boolean> => {
    try {
      const updatedNotifications = notifications.map(notif => ({ ...notif, isRead: true }));
      setNotifications(updatedNotifications);
      saveDataToStorage('notifications', updatedNotifications);
      
      return true;
    } catch (error) {
      console.error('모든 알림 읽음 처리 중 오류:', error);
      return false;
    }
  };

  const addNotification = async (notificationData: Omit<Notification, 'id' | 'createdAt'>): Promise<boolean> => {
    try {
      const newNotification: Notification = {
        ...notificationData,
        id: `notif-${Date.now()}`,
        createdAt: new Date().toISOString(),
      };
      
      const updatedNotifications = [...notifications, newNotification];
      setNotifications(updatedNotifications);
      saveDataToStorage('notifications', updatedNotifications);
      
      return true;
    } catch (error) {
      console.error('알림 추가 중 오류:', error);
      return false;
    }
  };

  // 데이터 새로고침 함수들
  const refreshData = async (): Promise<void> => {
    loadDataFromStorage();
  };

  const refreshStats = async (): Promise<void> => {
    calculateStats();
  };

  return (
    <EquipmentContext.Provider value={{
      departments,
      categories,
      equipment,
      usage,
      notifications,
      stats,
      departmentStats,
      loading,
      addDepartment,
      updateDepartment,
      deleteDepartment,
      addCategory,
      updateCategory,
      deleteCategory,
      addEquipment,
      updateEquipment,
      deleteEquipment,
      changeEquipmentStatus,
      startUsage,
      endUsage,
      markNotificationAsRead,
      markAllNotificationsAsRead,
      addNotification,
      refreshData,
      refreshStats,
    }}>
      {children}
    </EquipmentContext.Provider>
  );
}

export function useEquipment() {
  const context = useContext(EquipmentContext);
  if (context === undefined) {
    throw new Error('useEquipment must be used within an EquipmentProvider');
  }
  return context;
}
