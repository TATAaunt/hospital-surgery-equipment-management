'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

interface Equipment {
  id: string;
  name: string;
  manufacturer: string;
  serialNumber: string;
  status: 'available' | 'repair' | 'disposal' | 'replacement';
  location: string;
  sterilizationMethod: 'STEAM-P1' | 'STEAM-P5' | 'STERRAD' | 'EO';
  sterilizationDate: string;
  expiryDate: string;
}

const mockData: Equipment[] = [
  {
    id: '1',
    name: '치과용 현미경',
    manufacturer: '올림푸스',
    serialNumber: 'SM-001',
    status: 'available',
    location: 'Rm1',
    sterilizationMethod: 'STEAM-P1',
    sterilizationDate: '2024-01-15',
    expiryDate: '2024-01-22'
  },
  {
    id: '2',
    name: '이비인후과 내시경',
    manufacturer: '칼슈토츠',
    serialNumber: 'EN-002',
    status: 'repair',
    location: 'Rm5',
    sterilizationMethod: 'STEAM-P5',
    sterilizationDate: '2024-01-10',
    expiryDate: '2024-01-17'
  },
  {
    id: '3',
    name: '비뇨기과 수술기구',
    manufacturer: '메드트로닉',
    serialNumber: 'UR-003',
    status: 'disposal',
    location: '의공기술실',
    sterilizationMethod: 'STERRAD',
    sterilizationDate: '2024-01-20',
    expiryDate: '2024-01-27'
  },
  {
    id: '4',
    name: '일반외과 수술세트',
    manufacturer: '존슨앤존슨',
    serialNumber: 'GS-004',
    status: 'available',
    location: 'Rm12',
    sterilizationMethod: 'EO',
    sterilizationDate: '2024-01-12',
    expiryDate: '2024-01-19'
  },
  {
    id: '5',
    name: '흉부외과 심장박동기',
    manufacturer: '보스턴사이언티픽',
    serialNumber: 'GT-005',
    status: 'replacement',
    location: 'Rm18',
    sterilizationMethod: 'STEAM-P1',
    sterilizationDate: '2024-01-08',
    expiryDate: '2024-01-15'
  }
];

export default function Home() {
  const { isAuthenticated, user, logout, loading } = useAuth();
  const router = useRouter();
  const [equipment, setEquipment] = useState<Equipment[]>(mockData);
  const [selectedDepartment, setSelectedDepartment] = useState<string>('ALL');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newEquipment, setNewEquipment] = useState<Partial<Equipment>>({
    name: '',
    manufacturer: '',
    serialNumber: '',
    status: 'available',
    location: '',
    sterilizationMethod: 'STEAM-P1',
    sterilizationDate: '',
    expiryDate: ''
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
      case 'repair': return 'bg-yellow-100 text-yellow-800';
      case 'disposal': return 'bg-red-100 text-red-800';
      case 'replacement': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'available': return '사용가능';
      case 'repair': return '파손-수리중';
      case 'disposal': return '폐기-구매중';
      case 'replacement': return '노후-교체중';
      default: return status;
    }
  };

  const handleAddEquipment = () => {
    if (newEquipment.name && newEquipment.manufacturer && newEquipment.serialNumber) {
      const newItem: Equipment = {
        id: Date.now().toString(),
        name: newEquipment.name!,
        manufacturer: newEquipment.manufacturer!,
        serialNumber: newEquipment.serialNumber!,
        status: newEquipment.status as Equipment['status'] || 'available',
        location: newEquipment.location || 'Rm1',
        sterilizationMethod: newEquipment.sterilizationMethod as Equipment['sterilizationMethod'] || 'STEAM-P1',
        sterilizationDate: newEquipment.sterilizationDate || '',
        expiryDate: newEquipment.expiryDate || ''
      };
      setEquipment([...equipment, newItem]);
      setNewEquipment({
        name: '',
        manufacturer: '',
        serialNumber: '',
        status: 'available',
        location: 'Rm1',
        sterilizationMethod: 'STEAM-P1',
        sterilizationDate: '',
        expiryDate: ''
      });
      setShowAddForm(false);
    }
  };

  const handleDeleteEquipment = (id: string) => {
    setEquipment(equipment.filter(item => item.id !== id));
  };

  const getDepartmentName = (dept: string) => {
    switch (dept) {
      case 'DEN': return '치과';
      case 'ENT': return '이비인후과';
      case 'URO': return '비뇨기과';
      case 'GS': return '일반외과';
      case 'GTS': return '흉부외과';
      default: return dept;
    }
  };

  const filteredEquipment = selectedDepartment === 'ALL' 
    ? equipment 
    : equipment.filter(e => e.location.includes(selectedDepartment));

  const stats = {
    total: filteredEquipment.length,
    available: filteredEquipment.filter(e => e.status === 'available').length,
    repair: filteredEquipment.filter(e => e.status === 'repair').length,
    disposal: filteredEquipment.filter(e => e.status === 'disposal').length,
    replacement: filteredEquipment.filter(e => e.status === 'replacement').length
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
        {/* Department Selection */}
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">진료과별 기구 현황</h2>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setSelectedDepartment('ALL')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedDepartment === 'ALL'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              전체 기구
            </button>
            <button
              onClick={() => setSelectedDepartment('DEN')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedDepartment === 'DEN'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              DEN (치과)
            </button>
            <button
              onClick={() => setSelectedDepartment('ENT')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedDepartment === 'ENT'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              ENT (이비인후과)
            </button>
            <button
              onClick={() => setSelectedDepartment('URO')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedDepartment === 'URO'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              URO (비뇨기과)
            </button>
            <button
              onClick={() => setSelectedDepartment('GS')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedDepartment === 'GS'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              GS (일반외과)
            </button>
            <button
              onClick={() => setSelectedDepartment('GTS')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedDepartment === 'GTS'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              GTS (흉부외과)
            </button>
          </div>
        </div>

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
            <div className="text-2xl font-bold text-yellow-600">{stats.repair}</div>
            <div className="text-gray-600">파손-수리중</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-2xl font-bold text-red-600">{stats.disposal}</div>
            <div className="text-gray-600">폐기-구매중</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-2xl font-bold text-orange-600">{stats.replacement}</div>
            <div className="text-gray-600">노후-교체중</div>
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
                    제조사명
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    S/N
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    상태
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    위치
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    멸균방법
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    멸균일
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    만료일
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    작업
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredEquipment.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {item.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.manufacturer}
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
                      {item.sterilizationMethod}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.sterilizationDate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.expiryDate}
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
                    <label className="block text-sm font-medium text-gray-700">제조사명</label>
                    <input
                      type="text"
                      value={newEquipment.manufacturer}
                      onChange={(e) => setNewEquipment({...newEquipment, manufacturer: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                      placeholder="제조사명을 입력하세요"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">S/N</label>
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
                      <option value="repair">파손-수리중</option>
                      <option value="disposal">폐기-구매중</option>
                      <option value="replacement">노후-교체중</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">위치</label>
                    <select
                      value={newEquipment.location}
                      onChange={(e) => setNewEquipment({...newEquipment, location: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                    >
                      <option value="Rm1">Rm1</option>
                      <option value="Rm2">Rm2</option>
                      <option value="Rm3">Rm3</option>
                      <option value="Rm4">Rm4</option>
                      <option value="Rm5">Rm5</option>
                      <option value="Rm6">Rm6</option>
                      <option value="Rm7">Rm7</option>
                      <option value="Rm8">Rm8</option>
                      <option value="Rm9">Rm9</option>
                      <option value="Rm10">Rm10</option>
                      <option value="Rm11">Rm11</option>
                      <option value="Rm12">Rm12</option>
                      <option value="Rm13">Rm13</option>
                      <option value="Rm14">Rm14</option>
                      <option value="Rm15">Rm15</option>
                      <option value="Rm16">Rm16</option>
                      <option value="Rm17">Rm17</option>
                      <option value="Rm18">Rm18</option>
                      <option value="Rm19">Rm19</option>
                      <option value="Rm20">Rm20</option>
                      <option value="Rm21">Rm21</option>
                      <option value="Rm22">Rm22</option>
                      <option value="Rm23">Rm23</option>
                      <option value="의공기술실">의공기술실</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">멸균방법</label>
                    <select
                      value={newEquipment.sterilizationMethod}
                      onChange={(e) => setNewEquipment({...newEquipment, sterilizationMethod: e.target.value as Equipment['sterilizationMethod']})}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                    >
                      <option value="STEAM-P1">STEAM-P1</option>
                      <option value="STEAM-P5">STEAM-P5</option>
                      <option value="STERRAD">STERRAD</option>
                      <option value="EO">EO</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">멸균일</label>
                    <input
                      type="date"
                      value={newEquipment.sterilizationDate}
                      onChange={(e) => setNewEquipment({...newEquipment, sterilizationDate: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">만료일</label>
                    <input
                      type="date"
                      value={newEquipment.expiryDate}
                      onChange={(e) => setNewEquipment({...newEquipment, expiryDate: e.target.value})}
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