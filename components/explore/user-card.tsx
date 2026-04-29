'use client';
import { useState } from 'react';
import Link from 'next/link';
import { inviteUserToTeam } from '@/app/explore/actions';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { SharedElement, SharedAvatar } from '@/components/shared-element';
import { 
  Clock,
  Home,
  MapPin,
  DollarSign,
  Sparkles,
  Moon,
  User,
  ChevronDown,
  ChevronUp,
  Eye,
  UserPlus
} from 'lucide-react';
interface UserCardProps {
  user: any;
  profile: any;
  currentUserId: number;
  currentUserTeam?: any;
  alreadyInvited?: boolean;
}
const cleanlinessLabels: { [key: string]: string } = {
  'extremely_clean': '极爱干净',
  'regularly_tidy': '定期收拾',
  'acceptable': '过得去就行'
};
export function UserCard({ user, profile, currentUserId, currentUserTeam, alreadyInvited = false }: UserCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isInviting, setIsInviting] = useState(false);
  const [invited, setInvited] = useState(alreadyInvited);
  
  // 检查当前用户是否为队长
  const isTeamLeader = currentUserTeam?.membership?.isLeader === true;
  const hasTeam = !!currentUserTeam;
  
  // 确定按钮状态
  const canInvite = hasTeam && isTeamLeader && !invited;
  const buttonText = !hasTeam
    ? "需要先创建或加入队伍"
    : !isTeamLeader
    ? "只有队长可以邀请"
    : invited
    ? "已发送邀请"
    : isInviting
    ? "邀请中..."
    : "邀请加入队伍";
  const buttonDisabled = !canInvite || isInviting;
  // 处理邀请加入队伍
  const handleInvite = async () => {
    if (isInviting || !canInvite) return;
    
    setIsInviting(true);
    try {
      const result = await inviteUserToTeam({
        targetUserId: user.id
      });
      
      if (result.error) {
        alert(result.error);
      } else {
        setInvited(true);
        alert('✉️ 邀请已发送，等待对方回应...');
      }
    } catch (error) {
      console.error('邀请失败:', error);
      alert('邀请失败，请重试');
    } finally {
      setIsInviting(false);
    }
  };
  return (
    <Card className="group hover:shadow-lg transition-all duration-200 ease-out hover:-translate-y-1 overflow-hidden">
      <CardContent className="p-0">
        {/* 用户头部信息 - 可点击查看详情 */}
        <Link href={`/users/${user.id}`} className="block">
          <div className="p-4 sm:p-6 pb-3 sm:pb-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
            <div className="flex items-start space-x-3 sm:space-x-4">
              <SharedAvatar layoutId={`avatar-${user.id}`} className="relative flex-shrink-0">
                <Avatar className="w-12 h-12 sm:w-16 sm:h-16 ring-2 ring-blue-100 dark:ring-blue-900">
                  <AvatarImage src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || user.email)}&background=3b82f6&color=fff`} />
                  <AvatarFallback className="bg-gradient-to-br from-blue-400 to-purple-500 text-white">
                    {user.name ? user.name.substring(0, 2) : user.email.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                {/* 在线状态指示器 */}
                <div className="absolute -bottom-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
              </SharedAvatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                <SharedElement layoutId={`user-name-${user.id}`}>
                  <h3 className="font-semibold text-base sm:text-lg text-gray-900 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {user.name || '用户' + user.id}
                  </h3>
                </SharedElement>
                </div>
                
                {/* 基本信息优化：突出重要信息 */}
                <div className="mt-2 flex flex-wrap items-center gap-2 text-xs sm:text-sm">
                  {/* 年龄信息 */}
                  {profile?.age && (
                    <div className="flex items-center text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 px-2 py-1 rounded">
                      <User className="w-3 h-3 mr-1" style={{ fill: 'none', stroke: 'currentColor' }} />
                      <span>{profile.age}岁</span>
                    </div>
                  )}
                  
                  {/* 籍贯信息 */}
                  {profile?.hometown && (
                    <div className="flex items-center text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 px-2 py-1 rounded">
                      <MapPin className="w-3 h-3 mr-1" style={{ fill: 'none', stroke: 'currentColor' }} />
                      <span>{profile.hometown}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* 查看详情提示 */}
            <div className="mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="flex items-center text-xs text-blue-600 dark:text-blue-400">
                <Eye className="w-3 h-3 mr-1" style={{ fill: 'none', stroke: 'currentColor' }} />
                点击查看详细资料
              </div>
            </div>
          </div>
        </Link>
        {/* 用户信息和标签 */}
        <div className="px-4 sm:px-6 pb-3 sm:pb-4 space-y-4">
          {/* 特征标签 */}
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {/* 预算标签 */}
            {profile?.budget && (
              <Badge variant="outline" className="text-xs">
                <DollarSign className="w-3 h-3 mr-1" style={{ fill: 'none', stroke: 'currentColor' }} />
                <span>${profile.budget}/月</span>
              </Badge>
            )}
            
            {/* 区域标签 */}
            {profile?.preferArea && (
              <Badge variant="outline" className="text-xs">
                <MapPin className="w-3 h-3 mr-1" style={{ fill: 'none', stroke: 'currentColor' }} />
                <span>{profile.preferArea}</span>
              </Badge>
            )}
            
            {/* 作息标签 */}
            {profile?.sleepTime && (
              <Badge variant="outline" className="text-xs">
                <Moon className="w-3 h-3 mr-1" style={{ fill: 'none', stroke: 'currentColor' }} />
                <span className="hidden sm:inline">{profile.sleepTime}睡</span>
                <span className="sm:hidden">作息</span>
              </Badge>
            )}
            
            {/* 清洁习惯标签 */}
            {profile?.cleanliness && (
              <Badge variant="outline" className="text-xs">
                <Sparkles className="w-3 h-3 mr-1" style={{ fill: 'none', stroke: 'currentColor' }} />
                <span className="hidden sm:inline">{cleanlinessLabels[profile.cleanliness]}</span>
                <span className="sm:hidden">整洁</span>
              </Badge>
            )}
          </div>
          {/* 作息和生活信息 */}
          <div className="space-y-2">
            {/* 作息时间 */}
            {(profile?.sleepTime || profile?.wakeTime) && (
              <div className="flex items-center text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                <Clock className="w-3 h-3 sm:w-4 sm:h-4 mr-2 flex-shrink-0" style={{ fill: 'none', stroke: 'currentColor' }} />
                <span className="truncate">
                  作息: {profile.sleepTime || '??:??'} 睡, {profile.wakeTime || '??:??'} 起
                </span>
              </div>
            )}
          </div>
          {/* 个人简介 */}
          {profile?.bio && (
            <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
              <p className={`${isExpanded ? '' : 'line-clamp-2'}`}>
                {profile.bio}
              </p>
              {profile.bio.length > 80 && (
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="text-blue-500 hover:text-blue-600 text-xs mt-1 flex items-center"
                >
                  {isExpanded ? (
                    <>收起 <ChevronUp className="w-3 h-3 ml-1" style={{ fill: 'none', stroke: 'currentColor' }} />< />
                  ) : (
                    <>展开 <ChevronDown className="w-3 h-3 ml-1" style={{ fill: 'none', stroke: 'currentColor' }} />< />
                  )}
                </button>
              )}
            </div>
          )}
          {/* 其他要求 */}
          {profile?.otherRequirements && (
            <div className="text-xs sm:text-sm mt-2">
              <span className="text-blue-500 dark:text-blue-400">📋 特殊要求: </span>
              <span className="text-gray-600 dark:text-gray-300 line-clamp-1">
                {profile.otherRequirements}
              </span>
            </div>
          )}
        </div>
        {/* 操作按钮 */}
        <div className="px-4 sm:px-6 pb-4 sm:pb-6">
          <Button
            size="sm"
            className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-xs sm:text-sm"
            onClick={handleInvite}
            disabled={buttonDisabled}
          >
            <UserPlus className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-1" style={{ fill: 'none', stroke: 'currentColor' }} />
            <span className="hidden sm:inline">{isInviting ? '邀请中...' : buttonText}</span>
          </Button>
        </div>
        {/* 悬浮时的额外信息 */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/0 to-black/0 group-hover:from-black/5 group-hover:to-transparent transition-all duration-300 pointer-events-none" />
      </CardContent>
    </Card>
  );
}
