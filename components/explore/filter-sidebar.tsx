'use client';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { 
  Filter,
  X,
  RotateCcw,
  Search,
  Clock,
  Home,
  MapPin,
  DollarSign
} from 'lucide-react';
interface FilterState {
  search: string;
  minAge: number;
  maxAge: number;
  sleepTime: string;
  minBudget: number;
  maxBudget: number;
  preferArea: string[];
  cleanliness: string[];
}
const initialFilters: FilterState = {
  search: '',
  minAge: 18,
  maxAge: 35,
  sleepTime: '',
  minBudget: 0,
  maxBudget: 5000,
  preferArea: [],
  cleanliness: []
};
export function FilterSidebar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [filters, setFilters] = useState<FilterState>(initialFilters);
  const [isExpanded, setIsExpanded] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  // 从URL参数初始化筛选条件
  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    setFilters({
      search: params.get('search') || '',
      minAge: parseInt(params.get('minAge') || '18'),
      maxAge: parseInt(params.get('maxAge') || '35'),
      sleepTime: params.get('sleepTime') || '',
      minBudget: parseInt(params.get('minBudget') || '0'),
      maxBudget: parseInt(params.get('maxBudget') || '5000'),
      preferArea: params.get('preferArea')?.split(',').filter(Boolean) || [],
      cleanliness: params.get('cleanliness')?.split(',').filter(Boolean) || []
    });
  }, [searchParams]);
  const handleFilterChange = (key: keyof FilterState, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };
  const handleArrayFilterChange = (key: keyof FilterState, value: string, checked: boolean) => {
    setFilters(prev => {
      const currentArray = prev[key] as string[];
      return {
        ...prev,
        [key]: checked 
          ? [...currentArray, value]
          : currentArray.filter(item => item !== value)
      };
    });
  };
  const applyFilters = async () => {
    setIsLoading(true);
    const params = new URLSearchParams();
    
    if (filters.search.trim()) {
      params.set('search', filters.search.trim());
    }
    if (filters.minAge !== 18) {
      params.set('minAge', filters.minAge.toString());
    }
    if (filters.maxAge !== 35) {
      params.set('maxAge', filters.maxAge.toString());
    }
    if (filters.sleepTime) {
      params.set('sleepTime', filters.sleepTime);
    }
    if (filters.minBudget !== 0) {
      params.set('minBudget', filters.minBudget.toString());
    }
    if (filters.maxBudget !== 5000) {
      params.set('maxBudget', filters.maxBudget.toString());
    }
    if (filters.preferArea.length > 0) {
      params.set('preferArea', filters.preferArea.join(','));
    }
    if (filters.cleanliness.length > 0) {
      params.set('cleanliness', filters.cleanliness.join(','));
    }
    const queryString = params.toString();
    router.push(queryString ? `/explore?${queryString}` : '/explore');
    setTimeout(() => setIsLoading(false), 500);
  };
  const resetFilters = async () => {
    setIsLoading(true);
    setFilters(initialFilters);
    router.push('/explore');
    setTimeout(() => setIsLoading(false), 500);
  };
  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.search.trim()) count++;
    if (filters.minAge !== 18 || filters.maxAge !== 35) count++;
    if (filters.sleepTime) count++;
    if (filters.minBudget !== 0 || filters.maxBudget !== 5000) count++;
    count += filters.preferArea.length;
    count += filters.cleanliness.length;
    return count;
  };
  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <Filter className="w-4 h-4 mr-2" style={{ fill: 'none', stroke: 'currentColor' }} />
            筛选条件
          </div>
          {getActiveFiltersCount() > 0 && (
            <Badge variant="secondary">
              {getActiveFiltersCount()}
            </Badge>
          )}
        </CardTitle>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex-1"
          >
            {isExpanded ? '收起' : '展开'}全部
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={resetFilters}
            disabled={getActiveFiltersCount() === 0 || isLoading}
          >
            <RotateCcw className="w-3 h-3 mr-1" style={{ fill: 'none', stroke: 'currentColor' }} />
            重置
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* 关键词搜索 */}
        <div>
          <Label className="flex items-center mb-2">
            <Search className="w-3 h-3 mr-1" style={{ fill: 'none', stroke: 'currentColor' }} />
            关键词搜索
          </Label>
          <Input
            placeholder="搜索籍贯、简介、要求..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
          />
        </div>
        {/* 基本信息 */}
        <div className="space-y-4">
          <h4 className="font-medium flex items-center">
            <MapPin className="w-4 h-4 mr-2" style={{ fill: 'none', stroke: 'currentColor' }} />
            基本信息
          </h4>
          
          <div className="space-y-3">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              💡 匹配广场只显示与您相同性别的用户和队伍
            </div>
          </div>
        </div>
        {isExpanded && (
          <>
            {/* 作息习惯 */}
            <div className="space-y-4">
              <h4 className="font-medium flex items-center">
                <Clock className="w-4 h-4 mr-2" style={{ fill: 'none', stroke: 'currentColor' }} />
                作息习惯
              </h4>
              
              <div>
                <Label>睡觉时间</Label>
                <Select value={filters.sleepTime} onValueChange={(value) => handleFilterChange('sleepTime', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="不限" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="22:00前">22:00 之前</SelectItem>
                    <SelectItem value="22:00-00:00">22:00 - 00:00</SelectItem>
                    <SelectItem value="00:00-02:00">00:00 - 02:00</SelectItem>
                    <SelectItem value="02:00后">02:00 之后</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            {/* 租房需求 */}
            <div className="space-y-4">
              <h4 className="font-medium flex items-center">
                <DollarSign className="w-4 h-4 mr-2" style={{ fill: 'none', stroke: 'currentColor' }} />
                租房需求
              </h4>
              
              <div className="space-y-3">
                <div>
                  <Label>预算范围 (SGD/月)</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      type="number"
                      placeholder="最低"
                      value={filters.minBudget}
                      onChange={(e) => handleFilterChange('minBudget', parseInt(e.target.value))}
                    />
                    <Input
                      type="number"
                      placeholder="最高"
                      value={filters.maxBudget}
                      onChange={(e) => handleFilterChange('maxBudget', parseInt(e.target.value))}
                    />
                  </div>
                </div>
                <div>
                  <Label>偏好区域</Label>
                  <div className="space-y-2 mt-2">
                    {[
                      { value: 'NTU校内', label: 'NTU校内' },
                      { value: 'Pioneer', label: 'Pioneer' },
                      { value: 'Boon Lay', label: 'Boon Lay' },
                      { value: 'Jurong East', label: 'Jurong East' },
                      { value: 'Clementi', label: 'Clementi' }
                    ].map((item) => (
                      <div key={item.value} className="flex items-center space-x-2">
                        <Checkbox
                          id={`area-${item.value}`}
                          checked={filters.preferArea.includes(item.value)}
                          onCheckedChange={(checked) => 
                            handleArrayFilterChange('preferArea', item.value, checked as boolean)
                          }
                        />
                        <Label htmlFor={`area-${item.value}`} className="text-sm">
                          {item.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            {/* 生活习惯 */}
            <div className="space-y-4">
              <h4 className="font-medium flex items-center">
                <Home className="w-4 h-4 mr-2" style={{ fill: 'none', stroke: 'currentColor' }} />
                生活习惯
              </h4>
              
              <div>
                <Label>清洁习惯</Label>
                <div className="space-y-2 mt-2">
                  {[
                    { value: 'extremely_clean', label: '极爱干净' },
                    { value: 'regularly_tidy', label: '定期收拾' },
                    { value: 'acceptable', label: '过得去就行' }
                  ].map((item) => (
                    <div key={item.value} className="flex items-center space-x-2">
                      <Checkbox
                        id={`cleanliness-${item.value}`}
                        checked={filters.cleanliness.includes(item.value)}
                        onCheckedChange={(checked) => 
                          handleArrayFilterChange('cleanliness', item.value, checked as boolean)
                        }
                      />
                      <Label htmlFor={`cleanliness-${item.value}`} className="text-sm">
                        {item.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
        {/* 应用筛选 */}
        <Button 
          className="w-full" 
          size="sm"
          onClick={applyFilters}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
              应用中...
            </>
          ) : (
            <>应用筛选 ({getActiveFiltersCount()})< />
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
