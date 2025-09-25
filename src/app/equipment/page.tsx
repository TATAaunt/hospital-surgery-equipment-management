'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useEquipment } from '@/contexts/EquipmentContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Play,
  Square
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Equipment, EquipmentStatus } from '@/types';

export default function EquipmentPage() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const { 
    equipment, 
    departments, 
    categories, 
    addEquipment, 
    updateEquipment, 
    deleteEquipment,
    startUsage,
    endUsage,
    usage
  } = useEquipment();
  const router = useRouter();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState<EquipmentStatus | 'all'>('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingEquipment, setEditingEquipment] = useState<Equipment | null>(null);
  const [newEquipment, setNewEquipment] = useState<Partial<Equipment>>({
    name: '',
    serialNumber: '',
    model: '',
    manufacturer: '',
    categoryId: '',
    departmentId: '',
    status: 'available',
    location: '',
    purchaseDate: '',
    warrantyExpiry: '',
    lastMaintenanceDate: '',
    nextMaintenanceDate: '',
    notes: '',
    createdBy: 'current-user',
    updatedBy: 'current-user',
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

  const getStatusColor = (status: EquipmentStatus) => {
    switch (status) {
      case 'available': return 'success';
      case 'in_use': return 'info';
      case 'maintenance': return 'warning';
      case 'repair': return 'error';
      case 'retired': return 'secondary';
      case 'lost': return 'error';
      case 'damaged': return 'error';
      default: return 'default';
    }
  };

  const getStatusText = (status: EquipmentStatus) => {
    switch (status) {
      case 'available': return '사용 가능';
      case 'in_use': return '사용 중';
      case 'maintenance': return '정비 중';
      case 'repair': return '수리 중';
      case 'retired': return '폐기';
      case 'lost': return '분실';
      case 'damaged': return '손상';
      default: return status;
    }
  };

  const getDepartmentName = (departmentId: string) => {
    const department = departments.find(d => d.id === departmentId);
    return department ? department.name : '알 수 없음';
  };


  const filteredEquipment = equipment.filter(eq => {
    const matchesSearch = eq.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         eq.serialNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         eq.manufacturer?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = selectedDepartment === 'all' || eq.departmentId === selectedDepartment;
    const matchesStatus = selectedStatus === 'all' || eq.status === selectedStatus;
    
    return matchesSearch && matchesDepartment && matchesStatus;
  });

  const handleAddEquipment = async () => {
    if (newEquipment.name && newEquipment.departmentId) {
      const success = await addEquipment(newEquipment as Omit<Equipment, 'id' | 'createdAt' | 'updatedAt'>);
      if (success) {
        setNewEquipment({
          name: '',
          serialNumber: '',
          model: '',
          manufacturer: '',
          categoryId: '',
          departmentId: '',
          status: 'available',
          location: '',
          purchaseDate: '',
          warrantyExpiry: '',
          lastMaintenanceDate: '',
          nextMaintenanceDate: '',
          notes: '',
          createdBy: 'current-user',
          updatedBy: 'current-user',
        });
        setShowAddForm(false);
      }
    }
  };

  const handleUpdateEquipment = async () => {
    if (editingEquipment) {
      const success = await updateEquipment(editingEquipment.id, editingEquipment);
      if (success) {
        setEditingEquipment(null);
      }
    }
  };

  const handleDeleteEquipment = async (id: string) => {
    if (confirm('정말로 이 기구를 삭제하시겠습니까?')) {
      await deleteEquipment(id);
    }
  };

  const handleStartUsage = async (equipmentId: string) => {
    const purpose = prompt('사용 목적을 입력하세요:');
    if (purpose) {
      await startUsage(equipmentId, purpose);
    }
  };

  const handleEndUsage = async (equipmentId: string) => {
    const activeUsage = usage.find(u => u.equipmentId === equipmentId && u.status === 'active');
    if (activeUsage) {
      await endUsage(activeUsage.id);
    }
  };

  const isEquipmentInUse = (equipmentId: string) => {
    return usage.some(u => u.equipmentId === equipmentId && u.status === 'active');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">기구 관리</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button onClick={() => setShowAddForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                기구 추가
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 필터 및 검색 */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>검색 및 필터</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Input
                placeholder="기구명, 시리얼번호, 제조사 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="md:col-span-2"
              />
              <Select
                label="진료과"
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                options={[
                  { value: 'all', label: '전체' },
                  ...departments.map(dept => ({ value: dept.id, label: dept.name }))
                ]}
              />
              <Select
                label="상태"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value as EquipmentStatus | 'all')}
                options={[
                  { value: 'all', label: '전체' },
                  { value: 'available', label: '사용 가능' },
                  { value: 'in_use', label: '사용 중' },
                  { value: 'maintenance', label: '정비 중' },
                  { value: 'repair', label: '수리 중' },
                  { value: 'retired', label: '폐기' },
                  { value: 'lost', label: '분실' },
                  { value: 'damaged', label: '손상' },
                ]}
              />
            </div>
          </CardContent>
        </Card>

        {/* 기구 목록 */}
        <Card>
          <CardHeader>
            <CardTitle>기구 목록 ({filteredEquipment.length}개)</CardTitle>
            <CardDescription>
              등록된 모든 기구의 상세 정보를 확인하고 관리할 수 있습니다.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      기구명
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      시리얼번호
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      진료과
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      상태
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      위치
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      작업
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredEquipment.map((eq) => (
                    <tr key={eq.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{eq.name}</div>
                          <div className="text-sm text-gray-500">{eq.manufacturer} {eq.model}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {eq.serialNumber || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {getDepartmentName(eq.departmentId)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge variant={getStatusColor(eq.status)} size="sm">
                          {getStatusText(eq.status)}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {eq.location || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setEditingEquipment(eq)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          {eq.status === 'available' && !isEquipmentInUse(eq.id) && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleStartUsage(eq.id)}
                            >
                              <Play className="h-4 w-4" />
                            </Button>
                          )}
                          {isEquipmentInUse(eq.id) && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEndUsage(eq.id)}
                            >
                              <Square className="h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteEquipment(eq.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* 기구 추가 모달 */}
        {showAddForm && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <h3 className="text-lg font-medium text-gray-900 mb-4">새 기구 추가</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="기구명"
                    value={newEquipment.name}
                    onChange={(e) => setNewEquipment({...newEquipment, name: e.target.value})}
                    placeholder="기구명을 입력하세요"
                  />
                  <Input
                    label="시리얼번호"
                    value={newEquipment.serialNumber}
                    onChange={(e) => setNewEquipment({...newEquipment, serialNumber: e.target.value})}
                    placeholder="시리얼번호를 입력하세요"
                  />
                  <Input
                    label="모델"
                    value={newEquipment.model}
                    onChange={(e) => setNewEquipment({...newEquipment, model: e.target.value})}
                    placeholder="모델명을 입력하세요"
                  />
                  <Input
                    label="제조사"
                    value={newEquipment.manufacturer}
                    onChange={(e) => setNewEquipment({...newEquipment, manufacturer: e.target.value})}
                    placeholder="제조사를 입력하세요"
                  />
                  <Select
                    label="진료과"
                    value={newEquipment.departmentId}
                    onChange={(e) => setNewEquipment({...newEquipment, departmentId: e.target.value})}
                    options={departments.map(dept => ({ value: dept.id, label: dept.name }))}
                  />
                  <Select
                    label="상태"
                    value={newEquipment.status}
                    onChange={(e) => setNewEquipment({...newEquipment, status: e.target.value as EquipmentStatus})}
                    options={[
                      { value: 'available', label: '사용 가능' },
                      { value: 'maintenance', label: '정비 중' },
                      { value: 'repair', label: '수리 중' },
                      { value: 'retired', label: '폐기' },
                      { value: 'lost', label: '분실' },
                      { value: 'damaged', label: '손상' },
                    ]}
                  />
                  <Input
                    label="위치"
                    value={newEquipment.location}
                    onChange={(e) => setNewEquipment({...newEquipment, location: e.target.value})}
                    placeholder="위치를 입력하세요"
                  />
                  <Input
                    label="구매일"
                    type="date"
                    value={newEquipment.purchaseDate}
                    onChange={(e) => setNewEquipment({...newEquipment, purchaseDate: e.target.value})}
                  />
                  <Input
                    label="보증만료일"
                    type="date"
                    value={newEquipment.warrantyExpiry}
                    onChange={(e) => setNewEquipment({...newEquipment, warrantyExpiry: e.target.value})}
                  />
                  <Input
                    label="마지막 정비일"
                    type="date"
                    value={newEquipment.lastMaintenanceDate}
                    onChange={(e) => setNewEquipment({...newEquipment, lastMaintenanceDate: e.target.value})}
                  />
                  <Input
                    label="다음 정비일"
                    type="date"
                    value={newEquipment.nextMaintenanceDate}
                    onChange={(e) => setNewEquipment({...newEquipment, nextMaintenanceDate: e.target.value})}
                  />
                  <div className="md:col-span-2">
                    <Input
                      label="비고"
                      value={newEquipment.notes}
                      onChange={(e) => setNewEquipment({...newEquipment, notes: e.target.value})}
                      placeholder="추가 정보나 비고를 입력하세요"
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-3 mt-6">
                  <Button
                    variant="outline"
                    onClick={() => setShowAddForm(false)}
                  >
                    취소
                  </Button>
                  <Button onClick={handleAddEquipment}>
                    추가
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 기구 수정 모달 */}
        {editingEquipment && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <h3 className="text-lg font-medium text-gray-900 mb-4">기구 수정</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="기구명"
                    value={editingEquipment.name}
                    onChange={(e) => setEditingEquipment({...editingEquipment, name: e.target.value})}
                  />
                  <Input
                    label="시리얼번호"
                    value={editingEquipment.serialNumber || ''}
                    onChange={(e) => setEditingEquipment({...editingEquipment, serialNumber: e.target.value})}
                  />
                  <Input
                    label="모델"
                    value={editingEquipment.model || ''}
                    onChange={(e) => setEditingEquipment({...editingEquipment, model: e.target.value})}
                  />
                  <Input
                    label="제조사"
                    value={editingEquipment.manufacturer || ''}
                    onChange={(e) => setEditingEquipment({...editingEquipment, manufacturer: e.target.value})}
                  />
                  <Select
                    label="진료과"
                    value={editingEquipment.departmentId}
                    onChange={(e) => setEditingEquipment({...editingEquipment, departmentId: e.target.value})}
                    options={departments.map(dept => ({ value: dept.id, label: dept.name }))}
                  />
                  <Select
                    label="상태"
                    value={editingEquipment.status}
                    onChange={(e) => setEditingEquipment({...editingEquipment, status: e.target.value as EquipmentStatus})}
                    options={[
                      { value: 'available', label: '사용 가능' },
                      { value: 'in_use', label: '사용 중' },
                      { value: 'maintenance', label: '정비 중' },
                      { value: 'repair', label: '수리 중' },
                      { value: 'retired', label: '폐기' },
                      { value: 'lost', label: '분실' },
                      { value: 'damaged', label: '손상' },
                    ]}
                  />
                  <Input
                    label="위치"
                    value={editingEquipment.location || ''}
                    onChange={(e) => setEditingEquipment({...editingEquipment, location: e.target.value})}
                  />
                  <Input
                    label="구매일"
                    type="date"
                    value={editingEquipment.purchaseDate || ''}
                    onChange={(e) => setEditingEquipment({...editingEquipment, purchaseDate: e.target.value})}
                  />
                  <Input
                    label="보증만료일"
                    type="date"
                    value={editingEquipment.warrantyExpiry || ''}
                    onChange={(e) => setEditingEquipment({...editingEquipment, warrantyExpiry: e.target.value})}
                  />
                  <Input
                    label="마지막 정비일"
                    type="date"
                    value={editingEquipment.lastMaintenanceDate || ''}
                    onChange={(e) => setEditingEquipment({...editingEquipment, lastMaintenanceDate: e.target.value})}
                  />
                  <Input
                    label="다음 정비일"
                    type="date"
                    value={editingEquipment.nextMaintenanceDate || ''}
                    onChange={(e) => setEditingEquipment({...editingEquipment, nextMaintenanceDate: e.target.value})}
                  />
                  <div className="md:col-span-2">
                    <Input
                      label="비고"
                      value={editingEquipment.notes || ''}
                      onChange={(e) => setEditingEquipment({...editingEquipment, notes: e.target.value})}
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-3 mt-6">
                  <Button
                    variant="outline"
                    onClick={() => setEditingEquipment(null)}
                  >
                    취소
                  </Button>
                  <Button onClick={handleUpdateEquipment}>
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
