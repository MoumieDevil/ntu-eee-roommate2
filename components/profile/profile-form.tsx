'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { 
  User, 
  Clock,
  Home,
  Building,
  Heart,
  Loader2,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { updateProfile } from '@/app/profile/actions';
interface ProfileFormProps {
  user: any;
  hasProfile: boolean;
  initialProfile: any;
}
export function ProfileForm({ user, hasProfile, initialProfile }: ProfileFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [formData, setFormData] = useState({
    // 基本信息
    wechatId: initialProfile?.wechatId || '',
    gender: initialProfile?.gender || '',
    age: initialProfile?.age || '',
    program: initialProfile?.program || '',
    hasRentalExperience: initialProfile?.hasRentalExperience || false,
    hometown: initialProfile?.hometown || '',
    
    // 作息习惯
    sleepTime: initialProfile?.sleepTime || '',
    wakeTime: initialProfile?.wakeTime || '',
    hasNap: initialProfile?.hasNap || '',
    smokeDrink: initialProfile?.smokeDrink || '',
    
    // 生活习惯
    cookFrequency: initialProfile?.cookFrequency || '',
    mindCook: initialProfile?.mindCook || '',
    cleanliness: initialProfile?.cleanliness || '',
    guestFrequency: initialProfile?.guestFrequency || '',
    callFrequency: initialProfile?.callFrequency || '',
    shareBathroom: initialProfile?.shareBathroom || '',
    allergies: initialProfile?.allergies || '',
    
    // 租房需求
    startDate: initialProfile?.startDate || '',
    leaseTerm: initialProfile?.leaseTerm || '',
    budget: initialProfile?.budget || '',
    commuteTime: initialProfile?.commuteTime || '',
    preferArea: initialProfile?.preferArea || '',
    preferRoomType: initialProfile?.preferRoomType || '',
    shareUtility: initialProfile?.shareUtility || false,
    
    // 对室友的要求
    roommateGender: initialProfile?.roommateGender || '',
    roommateSleep: initialProfile?.roommateSleep || '',
    roommateSmoke: initialProfile?.roommateSmoke || '',
    otherRequirements: initialProfile?.otherRequirements || '',
    
    // 个人简介
    bio: initialProfile?.bio || ''
  });
  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);
    // 转换数据类型
    const submitData = {
      ...formData,
      age: formData.age ? parseInt(formData.age) : undefined,
      budget: formData.budget ? parseInt(formData.budget) : undefined,
      commuteTime: formData.commuteTime ? parseInt(formData.commuteTime) : undefined,
      // 移除空字符串，让验证器处理为 undefined
      wechatId: formData.wechatId || undefined,
      gender: formData.gender || undefined,
      program: formData.program || undefined,
      hometown: formData.hometown || undefined,
      sleepTime: formData.sleepTime || undefined,
      wakeTime: formData.wakeTime || undefined,
      hasNap: formData.hasNap || undefined,
      smokeDrink: formData.smokeDrink || undefined,
      cookFrequency: formData.cookFrequency || undefined,
      mindCook: formData.mindCook || undefined,
      cleanliness: formData.cleanliness || undefined,
      guestFrequency: formData.guestFrequency || undefined,
      callFrequency: formData.callFrequency || undefined,
      shareBathroom: formData.shareBathroom || undefined,
      allergies: formData.allergies || undefined,
      startDate: formData.startDate || undefined,
      leaseTerm: formData.leaseTerm || undefined,
      roommateGender: formData.roommateGender || undefined,
      roommateSleep: formData.roommateSleep || undefined,
      roommateSmoke: formData.roommateSmoke || undefined,
      otherRequirements: formData.otherRequirements || undefined,
      bio: formData.bio || undefined
    };
    try {
      const result = await updateProfile(submitData);
      
      if (result?.error) {
        setMessage({ type: 'error', text: result.error });
      } else {
        setMessage({ 
          type: 'success', 
          text: result?.message || '个人资料已成功更新！' 
        });
      }
    } catch (error) {
      console.error('提交表单时出错:', error);
      setMessage({ type: 'error', text: '更新失败，请重试' });
    } finally {
      setIsSubmitting(false);
    }
  };
  // 计算完成进度
  const requiredFields = [
    formData.wechatId, formData.gender, formData.age,
    formData.sleepTime, formData.wakeTime, formData.cleanliness,
    formData.budget, formData.preferArea
  ];
  const completedFields = requiredFields.filter(field => field !== '' && field !== undefined && field !== null).length;
  const completionPercentage = Math.round((completedFields / requiredFields.length) * 100);
  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* 状态消息 */}
      {message && (
        <Alert className={message.type === 'success' ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}>
          {message.type === 'success' ? (
            <CheckCircle className="h-4 w-4 text-green-600" />
          ) : (
            <AlertCircle className="h-4 w-4 text-red-600" />
          )}
          <AlertDescription className={message.type === 'success' ? 'text-green-800' : 'text-red-800'}>
            {message.text}
          </AlertDescription>
        </Alert>
      )}
      {/* 完成进度显示 */}
      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">资料完成进度</span>
          <span className="text-sm text-gray-500">{completionPercentage}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
            style={{ width: `${completionPercentage}%` }}
          ></div>
        </div>
      </div>
      {/* 基本信息 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <User className="w-5 h-5 mr-2" />
            基本信息
          </CardTitle>
          <CardDescription>
            请填写您的基本个人信息
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <Label htmlFor="wechatId">微信号</Label>
              <Input
                id="wechatId"
                type="text"
                placeholder="请输入您的微信号"
                value={formData.wechatId}
                onChange={(e) => handleInputChange('wechatId', e.target.value)}
                maxLength={100}
              />
            </div>
            <div>
              <Label htmlFor="age">年龄</Label>
              <Input
                id="age"
                type="number"
                placeholder="请输入年龄"
                value={formData.age}
                onChange={(e) => handleInputChange('age', e.target.value)}
                min="16"
                max="35"
              />
            </div>
            <div>
              <Label htmlFor="gender">性别</Label>
              <Select value={formData.gender} onValueChange={(value) => handleInputChange('gender', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="请选择性别" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">男</SelectItem>
                  <SelectItem value="female">女</SelectItem>
                  <SelectItem value="other">其他</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="program">入学项目</Label>
              <Input
                id="program"
                type="text"
                placeholder="如：EEE Master of Science"
                value={formData.program}
                onChange={(e) => handleInputChange('program', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="hometown">籍贯/地区</Label>
              <Input
                id="hometown"
                type="text"
                placeholder="请输入您的籍贯"
                value={formData.hometown}
                onChange={(e) => handleInputChange('hometown', e.target.value)}
              />
            </div>
            <div className="flex items-center space-x-2 pt-6">
              <Checkbox 
                id="hasRentalExperience" 
                checked={formData.hasRentalExperience}
                onCheckedChange={(checked) => handleInputChange('hasRentalExperience', checked)}
              />
              <Label htmlFor="hasRentalExperience">是否有过合租经历</Label>
            </div>
          </div>
        </CardContent>
      </Card>
      {/* 作息习惯 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Clock className="w-5 h-5 mr-2" />
            作息习惯
          </CardTitle>
          <CardDescription>
            您的日常作息时间和生活习惯
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <div>
              <Label htmlFor="sleepTime">睡觉时间</Label>
              <Select value={formData.sleepTime} onValueChange={(value) => handleInputChange('sleepTime', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="请选择" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="22:00前">22:00 之前</SelectItem>
                  <SelectItem value="22:00-00:00">22:00 - 00:00</SelectItem>
                  <SelectItem value="00:00-02:00">00:00 - 02:00</SelectItem>
                  <SelectItem value="02:00后">02:00 之后</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="wakeTime">起床时间</Label>
              <Select value={formData.wakeTime} onValueChange={(value) => handleInputChange('wakeTime', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="请选择" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="6:00前">6:00 之前</SelectItem>
                  <SelectItem value="6:00-8:00">6:00 - 8:00</SelectItem>
                  <SelectItem value="8:00-10:00">8:00 - 10:00</SelectItem>
                  <SelectItem value="10:00后">10:00 之后</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="hasNap">是否午睡</Label>
              <Select value={formData.hasNap} onValueChange={(value) => handleInputChange('hasNap', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="请选择" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="每天午睡">每天午睡</SelectItem>
                  <SelectItem value="偶尔午睡">偶尔午睡</SelectItem>
                  <SelectItem value="不午睡">不午睡</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="smokeDrink">吸烟/喝酒</Label>
              <Select value={formData.smokeDrink} onValueChange={(value) => handleInputChange('smokeDrink', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="请选择" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="都不会">都不会</SelectItem>
                  <SelectItem value="仅喝酒">仅喝酒</SelectItem>
                  <SelectItem value="仅吸烟">仅吸烟</SelectItem>
                  <SelectItem value="都有">都有</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
      {/* 生活习惯 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Home className="w-5 h-5 mr-2" />
            生活习惯
          </CardTitle>
          <CardDescription>
            您的日常居家生活习惯
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            <div>
              <Label htmlFor="cookFrequency">做饭频率</Label>
              <Select value={formData.cookFrequency} onValueChange={(value) => handleInputChange('cookFrequency', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="请选择" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="经常做(几乎每天)">经常做(几乎每天)</SelectItem>
                  <SelectItem value="偶尔做(每周1-2次)">偶尔做(每周1-2次)</SelectItem>
                  <SelectItem value="基本不做">基本不做</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="mindCook">是否介意室友做饭</Label>
              <Select value={formData.mindCook} onValueChange={(value) => handleInputChange('mindCook', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="请选择" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="不介意(只要收拾干净)">不介意(只要收拾干净)</SelectItem>
                  <SelectItem value="介意">介意</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="cleanliness">清洁习惯</Label>
              <Select value={formData.cleanliness} onValueChange={(value) => handleInputChange('cleanliness', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="请选择" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="extremely_clean">极爱干净，主动打扫</SelectItem>
                  <SelectItem value="regularly_tidy">定期收拾，轮流打扫</SelectItem>
                  <SelectItem value="acceptable">过得去就行</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="guestFrequency">带朋友回家留宿</Label>
              <Select value={formData.guestFrequency} onValueChange={(value) => handleInputChange('guestFrequency', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="请选择" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="不会">不会</SelectItem>
                  <SelectItem value="偶尔(每月1-2次)">偶尔(每月1-2次)</SelectItem>
                  <SelectItem value="经常(每周1-2次)">经常(每周1-2次)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="callFrequency">长时间语音/视频通话</Label>
              <Select value={formData.callFrequency} onValueChange={(value) => handleInputChange('callFrequency', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="请选择" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="经常(每天1h+)">经常(每天1h+)</SelectItem>
                  <SelectItem value="偶尔(每周几次)">偶尔(每周几次)</SelectItem>
                  <SelectItem value="很少/基本不会">很少/基本不会</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="shareBathroom">共用卫生间</Label>
              <Select value={formData.shareBathroom} onValueChange={(value) => handleInputChange('shareBathroom', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="请选择" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="可接受(保持卫生即可)">可接受(保持卫生即可)</SelectItem>
                  <SelectItem value="介意">介意</SelectItem>
                  <SelectItem value="需要独立卫浴">需要独立卫浴</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label htmlFor="allergies">有无过敏/特殊健康情况</Label>
            <Textarea
              id="allergies"
              placeholder="如有过敏或特殊健康情况请说明，无则留空"
              value={formData.allergies}
              onChange={(e) => handleInputChange('allergies', e.target.value)}
              maxLength={200}
              rows={2}
            />
          </div>
        </CardContent>
      </Card>
      {/* 租房需求 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Building className="w-5 h-5 mr-2" />
            租房需求
          </CardTitle>
          <CardDescription>
            您的租房计划和预算需求
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <div>
              <Label htmlFor="startDate">计划起租时间</Label>
              <Input
                id="startDate"
                type="text"
                placeholder="如：2026年8月"
                value={formData.startDate}
                onChange={(e) => handleInputChange('startDate', e.target.value)}
              />
            </div>
            
            <div>
              <Label htmlFor="leaseTerm">计划租期</Label>
              <Select value={formData.leaseTerm} onValueChange={(value) => handleInputChange('leaseTerm', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="请选择" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1年">1年</SelectItem>
                  <SelectItem value="1年以上">1年以上</SelectItem>
                  <SelectItem value="其他">其他</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="budget">每月房租预算(SGD)</Label>
              <Input
                id="budget"
                type="number"
                placeholder="如：1500"
                value={formData.budget}
                onChange={(e) => handleInputChange('budget', e.target.value)}
              />
            </div>
            
            <div>
              <Label htmlFor="commuteTime">可接受通勤时间(分钟)</Label>
              <Input
                id="commuteTime"
                type="number"
                placeholder="如：30"
                value={formData.commuteTime}
                onChange={(e) => handleInputChange('commuteTime', e.target.value)}
              />
            </div>
            
            <div>
              <Label htmlFor="preferArea">偏好租房区域</Label>
              <Select value={formData.preferArea} onValueChange={(value) => handleInputChange('preferArea', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="请选择" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="NTU校内">NTU校内</SelectItem>
                  <SelectItem value="Pioneer">Pioneer</SelectItem>
                  <SelectItem value="Boon Lay">Boon Lay</SelectItem>
                  <SelectItem value="Jurong East">Jurong East</SelectItem>
                  <SelectItem value="Clementi">Clementi</SelectItem>
                  <SelectItem value="其他">其他</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="preferRoomType">偏好房型</Label>
              <Select value={formData.preferRoomType} onValueChange={(value) => handleInputChange('preferRoomType', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="请选择" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="主卧(独立卫浴)">主卧(独立卫浴)</SelectItem>
                  <SelectItem value="普通间">普通间</SelectItem>
                  <SelectItem value="无特殊偏好">无特殊偏好</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center space-x-2 pt-6">
              <Checkbox 
                id="shareUtility" 
                checked={formData.shareUtility}
                onCheckedChange={(checked) => handleInputChange('shareUtility', checked)}
              />
              <Label htmlFor="shareUtility">接受水电网额外分摊</Label>
            </div>
          </div>
        </CardContent>
      </Card>
      {/* 室友期待 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Heart className="w-5 h-5 mr-2" />
            对室友的期待
          </CardTitle>
          <CardDescription>
            描述您对合租室友的要求
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            <div>
              <Label htmlFor="roommateGender">对室友性别要求</Label>
              <Select value={formData.roommateGender} onValueChange={(value) => handleInputChange('roommateGender', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="请选择" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="男">男</SelectItem>
                  <SelectItem value="女">女</SelectItem>
                  <SelectItem value="无要求">无要求</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="roommateSleep">对室友作息要求</Label>
              <Select value={formData.roommateSleep} onValueChange={(value) => handleInputChange('roommateSleep', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="请选择" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="规律作息">规律作息</SelectItem>
                  <SelectItem value="无特殊要求">无特殊要求</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="roommateSmoke">对室友吸烟喝酒要求</Label>
              <Select value={formData.roommateSmoke} onValueChange={(value) => handleInputChange('roommateSmoke', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="请选择" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="不吸烟不喝酒">不吸烟不喝酒</SelectItem>
                  <SelectItem value="无要求">无要求</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div>
            <Label htmlFor="otherRequirements">其他特殊要求</Label>
            <Textarea
              id="otherRequirements"
              placeholder="其他您对室友或租房的特殊要求..."
              value={formData.otherRequirements}
              onChange={(e) => handleInputChange('otherRequirements', e.target.value)}
              maxLength={500}
              rows={3}
            />
          </div>
        </CardContent>
      </Card>
      {/* 个人简介 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Heart className="w-5 h-5 mr-2" />
            个人简介
          </CardTitle>
          <CardDescription>
            简短介绍一下自己
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div>
            <Label htmlFor="bio">个人简介</Label>
            <Textarea
              id="bio"
              placeholder="用简短的话介绍一下自己..."
              value={formData.bio}
              onChange={(e) => handleInputChange('bio', e.target.value)}
              maxLength={100}
              rows={3}
            />
            <div className="text-right text-sm text-gray-500 mt-1">
              {formData.bio.length}/100
            </div>
          </div>
        </CardContent>
      </Card>
      {/* 提交按钮 */}
      <div className="flex justify-stretch sm:justify-end">
        <Button 
          type="submit" 
          disabled={isSubmitting}
          className="w-full sm:w-auto px-6 sm:px-8"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              保存中...
            < />
          ) : (
            <>
              <CheckCircle className="w-4 h-4 mr-2" />
              保存资料
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
