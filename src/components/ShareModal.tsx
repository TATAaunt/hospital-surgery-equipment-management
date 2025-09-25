'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { 
  Share2, 
  X, 
  Copy, 
  Mail, 
  MessageSquare
} from 'lucide-react';
import { Equipment, Department } from '@/types';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  equipment?: Equipment;
  department?: Department;
  type: 'equipment' | 'department' | 'dashboard';
}

export default function ShareModal({ isOpen, onClose, equipment, department, type }: ShareModalProps) {
  const [shareMethod, setShareMethod] = useState<'link' | 'email' | 'message'>('link');
  const [emailRecipients, setEmailRecipients] = useState('');
  const [message, setMessage] = useState('');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const generateShareLink = () => {
    const baseUrl = window.location.origin;
    switch (type) {
      case 'equipment':
        return `${baseUrl}/equipment?id=${equipment?.id}`;
      case 'department':
        return `${baseUrl}/departments?id=${department?.id}`;
      case 'dashboard':
        return `${baseUrl}/`;
      default:
        return baseUrl;
    }
  };

  const getShareTitle = () => {
    switch (type) {
      case 'equipment':
        return `${equipment?.name} 기구 정보 공유`;
      case 'department':
        return `${department?.name} 진료과 정보 공유`;
      case 'dashboard':
        return '수술실 기구 관리 시스템 대시보드 공유';
      default:
        return '정보 공유';
    }
  };

  const getShareDescription = () => {
    switch (type) {
      case 'equipment':
        return `${equipment?.name} 기구의 상세 정보를 팀원들과 공유합니다.`;
      case 'department':
        return `${department?.name} 진료과의 기구 현황을 팀원들과 공유합니다.`;
      case 'dashboard':
        return '전체 기구 현황과 통계를 팀원들과 공유합니다.';
      default:
        return '정보를 팀원들과 공유합니다.';
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(generateShareLink());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('링크 복사 실패:', error);
    }
  };

  const handleEmailShare = () => {
    const subject = encodeURIComponent(getShareTitle());
    const body = encodeURIComponent(
      `${getShareDescription()}\n\n링크: ${generateShareLink()}\n\n${message}`
    );
    const mailtoLink = `mailto:${emailRecipients}?subject=${subject}&body=${body}`;
    window.open(mailtoLink);
  };

  const handleMessageShare = () => {
    const shareText = `${getShareTitle()}\n\n${getShareDescription()}\n\n링크: ${generateShareLink()}\n\n${message}`;
    
    if (navigator.share) {
      navigator.share({
        title: getShareTitle(),
        text: shareText,
        url: generateShareLink(),
      });
    } else {
      // Web Share API를 지원하지 않는 경우 클립보드에 복사
      navigator.clipboard.writeText(shareText);
      alert('메시지가 클립보드에 복사되었습니다.');
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center space-x-2">
              <Share2 className="h-6 w-6" />
              <h3 className="text-lg font-medium text-gray-900">공유하기</h3>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-4">
            {/* 공유 방법 선택 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                공유 방법
              </label>
              <div className="grid grid-cols-3 gap-2">
                <Button
                  variant={shareMethod === 'link' ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => setShareMethod('link')}
                  className="flex flex-col items-center py-3"
                >
                  <Copy className="h-4 w-4 mb-1" />
                  링크
                </Button>
                <Button
                  variant={shareMethod === 'email' ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => setShareMethod('email')}
                  className="flex flex-col items-center py-3"
                >
                  <Mail className="h-4 w-4 mb-1" />
                  이메일
                </Button>
                <Button
                  variant={shareMethod === 'message' ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => setShareMethod('message')}
                  className="flex flex-col items-center py-3"
                >
                  <MessageSquare className="h-4 w-4 mb-1" />
                  메시지
                </Button>
              </div>
            </div>

            {/* 공유 내용 미리보기 */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">{getShareTitle()}</CardTitle>
                <CardDescription className="text-xs">
                  {getShareDescription()}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="text-xs text-gray-500 break-all">
                  {generateShareLink()}
                </div>
              </CardContent>
            </Card>

            {/* 공유 방법별 입력 폼 */}
            {shareMethod === 'link' && (
              <div className="space-y-3">
                <div className="flex space-x-2">
                  <Input
                    value={generateShareLink()}
                    readOnly
                    className="flex-1"
                  />
                  <Button
                    variant="outline"
                    onClick={handleCopyLink}
                    className={copied ? 'bg-green-100 text-green-800' : ''}
                  >
                    {copied ? '복사됨!' : '복사'}
                  </Button>
                </div>
                <p className="text-xs text-gray-500">
                  링크를 복사하여 팀원들과 공유하세요.
                </p>
              </div>
            )}

            {shareMethod === 'email' && (
              <div className="space-y-3">
                <Input
                  label="받는 사람"
                  placeholder="이메일 주소를 입력하세요 (여러 명일 경우 쉼표로 구분)"
                  value={emailRecipients}
                  onChange={(e) => setEmailRecipients(e.target.value)}
                />
                <Input
                  label="추가 메시지"
                  placeholder="공유와 함께 전달할 메시지를 입력하세요"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
                <Button
                  onClick={handleEmailShare}
                  className="w-full"
                  disabled={!emailRecipients}
                >
                  <Mail className="h-4 w-4 mr-2" />
                  이메일로 공유
                </Button>
              </div>
            )}

            {shareMethod === 'message' && (
              <div className="space-y-3">
                <Input
                  label="추가 메시지"
                  placeholder="공유와 함께 전달할 메시지를 입력하세요"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
                <Button
                  onClick={handleMessageShare}
                  className="w-full"
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  메시지로 공유
                </Button>
                <p className="text-xs text-gray-500">
                  모바일에서는 기본 메시지 앱이 열리고, 데스크톱에서는 클립보드에 복사됩니다.
                </p>
              </div>
            )}

            {/* 공유 옵션 */}
            <div className="border-t pt-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">공유 옵션</h4>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="includeStats"
                    defaultChecked
                    className="rounded border-gray-300"
                  />
                  <label htmlFor="includeStats" className="text-sm text-gray-600">
                    통계 정보 포함
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="includeHistory"
                    className="rounded border-gray-300"
                  />
                  <label htmlFor="includeHistory" className="text-sm text-gray-600">
                    사용 기록 포함
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="allowEdit"
                    className="rounded border-gray-300"
                  />
                  <label htmlFor="allowEdit" className="text-sm text-gray-600">
                    편집 권한 부여
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <Button
              variant="outline"
              onClick={onClose}
            >
              닫기
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
