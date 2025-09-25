'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useEquipment } from '@/contexts/EquipmentContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Users,
  Activity,
  TrendingUp
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Department } from '@/types';

export default function DepartmentsPage() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const { 
    departments, 
    equipment, 
    categories,
    departmentStats,
    addDepartment, 
    updateDepartment, 
    deleteDepartment 
  } = useEquipment();
  const router = useRouter();

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(null);
  const [newDepartment, setNewDepartment] = useState<Partial<Department>>({
    name: '',
    code: '',
    description: '',
  });

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, authLoading, router]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const handleAddDepartment = async () => {
    if (newDepartment.name && newDepartment.code) {
      const success = await addDepartment(newDepartment as Omit<Department, 'id' | 'createdAt' | 'updatedAt'>);
      if (success) {
        setNewDepartment({
          name: '',
          code: '',
          description: '',
        });
        setShowAddForm(false);
      }
    }
  };

  const handleUpdateDepartment = async () => {
    if (editingDepartment) {
      const success = await updateDepartment(editingDepartment.id, editingDepartment);
      if (success) {
        setEditingDepartment(null);
      }
    }
  };

  const handleDeleteDepartment = async (id: string) => {
    const department = departments.find(d => d.id === id);
    const equipmentCount = equipment.filter(eq => eq.departmentId === id).length;
    
    if (equipmentCount > 0) {
      alert(`이 진료과에는 ${equipmentCount}개의 기구가 등록되어 있습니다. 먼저 기구를 다른 진료과로 이동하거나 삭제해주세요.`);
      return;
    }

    if (confirm(`정말로 "${department?.name}" 진료과를 삭제하시겠습니까?`)) {
      await deleteDepartment(id);
    }
  };

  const getDepartmentStats = (departmentId: string) => {
    return departmentStats.find(stat => stat.departmentId === departmentId);
  };

  const getDepartmentEquipment = (departmentId: string) => {
    return equipment.filter(eq => eq.departmentId === departmentId);
  };

  const getDepartmentCategories = (departmentId: string) => {
    return categories.filter(cat => cat.departmentId === departmentId);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">진료과 관리</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button onClick={() => setShowAddForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                진료과 추가
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 진료과 목록 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {departments.map((department) => {
            const stats = getDepartmentStats(department.id);
            const departmentEquipment = getDepartmentEquipment(department.id);
            const departmentCategories = getDepartmentCategories(department.id);
            
            return (
              <Card key={department.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{department.name}</CardTitle>
                      <CardDescription>{department.code}</CardDescription>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditingDepartment(department)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteDepartment(department.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {department.description && (
                      <p className="text-sm text-gray-600">{department.description}</p>
                    )}
                    
                    {/* 통계 정보 */}
                    {stats && (
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                          <div className="text-2xl font-bold text-blue-600">{stats.equipmentCount}</div>
                          <div className="text-xs text-gray-500">총 기구</div>
                        </div>
                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                          <div className="text-2xl font-bold text-green-600">{stats.availableCount}</div>
                          <div className="text-xs text-gray-500">사용가능</div>
                        </div>
                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                          <div className="text-2xl font-bold text-orange-600">{stats.inUseCount}</div>
                          <div className="text-xs text-gray-500">사용중</div>
                        </div>
                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                          <div className="text-2xl font-bold text-yellow-600">{stats.maintenanceCount}</div>
                          <div className="text-xs text-gray-500">정비중</div>
                        </div>
                      </div>
                    )}

                    {/* 사용률 */}
                    {stats && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>사용률</span>
                          <span className="font-medium">{stats.utilizationRate.toFixed(1)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${Math.min(stats.utilizationRate, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    )}

                    {/* 카테고리 정보 */}
                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-gray-600">
                        <Activity className="h-4 w-4 mr-2" />
                        카테고리 ({departmentCategories.length}개)
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {departmentCategories.slice(0, 3).map((category) => (
                          <Badge key={category.id} variant="secondary" size="sm">
                            {category.name}
                          </Badge>
                        ))}
                        {departmentCategories.length > 3 && (
                          <Badge variant="secondary" size="sm">
                            +{departmentCategories.length - 3}
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* 최근 기구 */}
                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-gray-600">
                        <TrendingUp className="h-4 w-4 mr-2" />
                        최근 등록 기구
                      </div>
                      <div className="space-y-1">
                        {departmentEquipment.slice(0, 3).map((eq) => (
                          <div key={eq.id} className="text-xs text-gray-500 truncate">
                            {eq.name}
                          </div>
                        ))}
                        {departmentEquipment.length > 3 && (
                          <div className="text-xs text-gray-400">
                            +{departmentEquipment.length - 3}개 더...
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* 진료과 추가 모달 */}
        {showAddForm && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <h3 className="text-lg font-medium text-gray-900 mb-4">새 진료과 추가</h3>
                <div className="space-y-4">
                  <Input
                    label="진료과명"
                    value={newDepartment.name}
                    onChange={(e) => setNewDepartment({...newDepartment, name: e.target.value})}
                    placeholder="예: 외과, 정형외과"
                  />
                  <Input
                    label="코드"
                    value={newDepartment.code}
                    onChange={(e) => setNewDepartment({...newDepartment, code: e.target.value})}
                    placeholder="예: SURG, ORTH"
                  />
                  <Input
                    label="설명"
                    value={newDepartment.description}
                    onChange={(e) => setNewDepartment({...newDepartment, description: e.target.value})}
                    placeholder="진료과에 대한 간단한 설명"
                  />
                </div>
                <div className="flex justify-end space-x-3 mt-6">
                  <Button
                    variant="outline"
                    onClick={() => setShowAddForm(false)}
                  >
                    취소
                  </Button>
                  <Button onClick={handleAddDepartment}>
                    추가
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 진료과 수정 모달 */}
        {editingDepartment && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <h3 className="text-lg font-medium text-gray-900 mb-4">진료과 수정</h3>
                <div className="space-y-4">
                  <Input
                    label="진료과명"
                    value={editingDepartment.name}
                    onChange={(e) => setEditingDepartment({...editingDepartment, name: e.target.value})}
                  />
                  <Input
                    label="코드"
                    value={editingDepartment.code}
                    onChange={(e) => setEditingDepartment({...editingDepartment, code: e.target.value})}
                  />
                  <Input
                    label="설명"
                    value={editingDepartment.description || ''}
                    onChange={(e) => setEditingDepartment({...editingDepartment, description: e.target.value})}
                  />
                </div>
                <div className="flex justify-end space-x-3 mt-6">
                  <Button
                    variant="outline"
                    onClick={() => setEditingDepartment(null)}
                  >
                    취소
                  </Button>
                  <Button onClick={handleUpdateDepartment}>
                    수정
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
