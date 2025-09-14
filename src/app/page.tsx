'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

interface Equipment {
  id: string;
  name: string;
  category: string;
  serialNumber: string;
  status: 'available' | 'in-use' | 'maintenance' | 'out-of-service';
  location: string;
  lastMaintenance: string;
  nextMaintenance: string;
}

const mockData: Equipment[] = [
  {
    id: '1',
    name: '수술용 현미경',
    category: '현미경',
    serialNumber: 'SM-001',
    status: 'available',
    location: '수술실 1',
    lastMaintenance: '2024-01-15',
    nextMaintenance: '2024-04-15'
  },
  {
    id: '2',
    name: '심장박동기',
    category: '생명유지장치',
    serialNumber: 'PM-002',
    status: 'in-use',
    location: '수술실 2',
    lastMaintenance: '2024-01-10',
    nextMaintenance: '2024-04-10'
  },
  {
    id: '3',
    name: '인공호흡기',
    category: '생명유지장치',
    serialNumber: 'VM-003',
    status: 'maintenance',
    location: '정비실',
    lastMaintenance: '2024-01-20',
    nextMaintenance: '2024-04-20'
  }
];

export default function Home() {
  const { isAuthenticated, user, logout, loading } = useAuth();
  const router = useRouter();
  const [equipment, setEquipment] = useState<Equipment[]>(mockData);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newEquipment, setNewEquipment] = useState<Partial<Equipment>>({
    name: '',
    category: '',
    serialNumber: '',
    status: 'available',
    location: '',
    lastMaintenance: '',
    nextMaintenance: ''
  });

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">로딩 중...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'in-use': return 'bg-blue-100 text-blue-800';
      case 'maintenance': return 'bg-yellow-100 text-yellow-800';
      case 'out-of-service': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'available': return '사용가능';
      case 'in-use': return '사용중';
      case 'maintenance': return '정비중';
      case 'out-of-service': return '고장';
      default: return status;
    }
  };

  const handleAddEquipment = () => {
    if (newEquipment.name && newEquipment.category && newEquipment.serialNumber) {
      const newItem: Equipment = {
        id: Date.now().toString(),
        name: newEquipment.name!,
        category: newEquipment.category!,
        serialNumber: newEquipment.serialNumber!,
        status: newEquipment.status as Equipment['status'] || 'available',
        location: newEquipment.location || '',
        lastMaintenance: newEquipment.lastMaintenance || '',
        nextMaintenance: newEquipment.nextMaintenance || ''
      };
      setEquipment([...equipment, newItem]);
      setNewEquipment({
        name: '',
        category: '',
        serialNumber: '',
        status: 'available',
        location: '',
        lastMaintenance: '',
        nextMaintenance: ''
      });
      setShowAddForm(false);
    }
  };

  const handleDeleteEquipment = (id: string) => {
    setEquipment(equipment.filter(item => item.id !== id));
  };

  const stats = {
    total: equipment.length,
    available: equipment.filter(e => e.status === 'available').length,
    inUse: equipment.filter(e => e.status === 'in-use').length,
    maintenance: equipment.filter(e => e.status === 'maintenance').length,
    outOfService: equipment.filter(e => e.status === 'out-of-service').length
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">수술실 기구 관리 시스템</h1>
              <p className="text-gray-600 mt-1">수술실 기구의 효율적인 관리와 모니터링</p>
              {user && (
                <p className="text-sm text-gray-500 mt-1">
                  안녕하세요, {user.username}님 ({user.role})
                </p>
              )}
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowAddForm(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                기구 추가
              </button>
              <button
                onClick={logout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                로그아웃
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
            <div className="text-gray-600">전체 기구</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-2xl font-bold text-green-600">{stats.available}</div>
            <div className="text-gray-600">사용가능</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-2xl font-bold text-blue-600">{stats.inUse}</div>
            <div className="text-gray-600">사용중</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-2xl font-bold text-yellow-600">{stats.maintenance}</div>
            <div className="text-gray-600">정비중</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-2xl font-bold text-red-600">{stats.outOfService}</div>
            <div className="text-gray-600">고장</div>
          </div>
        </div>

        {/* Equipment Table */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">기구 목록</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    기구명
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    카테고리
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    시리얼 번호
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    상태
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    위치
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    마지막 정비
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    다음 정비
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    작업
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {equipment.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {item.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.serialNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(item.status)}`}>
                        {getStatusText(item.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.location}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.lastMaintenance}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.nextMaintenance}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleDeleteEquipment(item.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        삭제
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add Equipment Modal */}
        {showAddForm && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <h3 className="text-lg font-medium text-gray-900 mb-4">새 기구 추가</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">장비명</label>
                    <input
                      type="text"
                      value={newEquipment.name}
                      onChange={(e) => setNewEquipment({...newEquipment, name: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                      placeholder="기구명을 입력하세요"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">카테고리</label>
                    <input
                      type="text"
                      value={newEquipment.category}
                      onChange={(e) => setNewEquipment({...newEquipment, category: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                      placeholder="카테고리를 입력하세요"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">시리얼 번호</label>
                    <input
                      type="text"
                      value={newEquipment.serialNumber}
                      onChange={(e) => setNewEquipment({...newEquipment, serialNumber: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                      placeholder="시리얼 번호를 입력하세요"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">상태</label>
                    <select
                      value={newEquipment.status}
                      onChange={(e) => setNewEquipment({...newEquipment, status: e.target.value as Equipment['status']})}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                    >
                      <option value="available">사용가능</option>
                      <option value="in-use">사용중</option>
                      <option value="maintenance">정비중</option>
                      <option value="out-of-service">고장</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">위치</label>
                    <input
                      type="text"
                      value={newEquipment.location}
                      onChange={(e) => setNewEquipment({...newEquipment, location: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                      placeholder="위치를 입력하세요"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">마지막 정비일</label>
                    <input
                      type="date"
                      value={newEquipment.lastMaintenance}
                      onChange={(e) => setNewEquipment({...newEquipment, lastMaintenance: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">다음 정비일</label>
                    <input
                      type="date"
                      value={newEquipment.nextMaintenance}
                      onChange={(e) => setNewEquipment({...newEquipment, nextMaintenance: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    onClick={() => setShowAddForm(false)}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                  >
                    취소
                  </button>
                  <button
                    onClick={handleAddEquipment}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    추가
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}