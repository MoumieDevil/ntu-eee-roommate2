'use server';
import { z } from 'zod';
import { eq } from 'drizzle-orm';
import { db } from '@/lib/db/drizzle';
import { userProfiles } from '@/lib/db/schema';
import { getCurrentUser } from '@/lib/db/queries';
import { revalidatePath } from 'next/cache';
// 个人资料更新schema
const profileSchema = z.object({
  // 基本信息
  wechatId: z.string().max(100, '微信号不能超过100个字符').optional(),
  gender: z.enum(['male', 'female', 'other']).optional(),
  age: z.number().int().min(16, '年龄不能小于16').max(35, '年龄不能大于35').optional(),
  program: z.string().max(100, '入学项目不能超过100个字符').optional(),
  hasRentalExperience: z.boolean().optional(),
  hometown: z.string().max(100, '籍贯不能超过100个字符').optional(),
  
  // 作息习惯
  sleepTime: z.string().max(20, '睡觉时间格式不正确').optional(),
  wakeTime: z.string().max(20, '起床时间格式不正确').optional(),
  hasNap: z.string().max(20).optional(),
  smokeDrink: z.string().max(20).optional(),
  
  // 生活习惯
  cookFrequency: z.string().max(30).optional(),
  mindCook: z.string().max(30).optional(),
  cleanliness: z.enum(['extremely_clean', 'regularly_tidy', 'acceptable']).optional(),
  guestFrequency: z.string().max(30).optional(),
  callFrequency: z.string().max(30).optional(),
  shareBathroom: z.string().max(30).optional(),
  allergies: z.string().max(200).optional(),
  
  // 租房需求
  startDate: z.string().max(20).optional(),
  leaseTerm: z.string().max(20).optional(),
  budget: z.number().int().min(0).max(5000).optional(),
  commuteTime: z.number().int().min(0).max(120).optional(),
  preferArea: z.string().max(30).optional(),
  preferRoomType: z.string().max(30).optional(),
  shareUtility: z.boolean().optional(),
  
  // 对室友的要求
  roommateGender: z.string().max(10).optional(),
  roommateSleep: z.string().max(20).optional(),
  roommateSmoke: z.string().max(20).optional(),
  otherRequirements: z.string().max(500, '其他要求不能超过500个字符').optional(),
  
  // 个人简介
  bio: z.string().max(100, '个人简介不能超过100个字符').optional(),
});
export async function updateProfile(rawData: any) {
  try {
    // 获取当前用户
    const { user } = await getCurrentUser();
    if (!user || !user.users) {
      return { error: '用户未登录' };
    }
    // 验证数据
    const result = profileSchema.safeParse(rawData);
    if (!result.success) {
      return { error: result.error.errors[0].message };
    }
    
    const data = result.data;
    const currentUser = user.users;
    
    // 检查用户是否已有profile记录
    const existingProfile = await db
      .select()
      .from(userProfiles)
      .where(eq(userProfiles.userId, currentUser.id))
      .limit(1);
    // 计算资料完整度 - 基于租房匹配的核心必填字段
    const requiredFields = [
      data.wechatId, data.gender, data.age,
      data.sleepTime, data.wakeTime, data.cleanliness,
      data.budget, data.preferArea
    ];
    
    const completedFields = requiredFields.filter(field => field !== undefined && field !== '').length;
    const isProfileComplete = completedFields >= requiredFields.length; // 全部完成才算完整
    const profileData = {
      ...data,
      isProfileComplete,
      updatedAt: new Date()
    };
    let result_data;
    
    if (existingProfile.length > 0) {
      // 更新现有profile
      result_data = await db
        .update(userProfiles)
        .set(profileData)
        .where(eq(userProfiles.userId, currentUser.id))
        .returning();
    } else {
      // 创建新profile，使用ON CONFLICT处理可能的并发问题
      try {
        result_data = await db
          .insert(userProfiles)
          .values({
            userId: currentUser.id,
            ...profileData
          })
          .returning();
      } catch (insertError: any) {
        // 如果插入失败（可能是并发导致的重复），尝试更新
        if (insertError.code === '23505') {
          result_data = await db
            .update(userProfiles)
            .set(profileData)
            .where(eq(userProfiles.userId, currentUser.id))
            .returning();
        } else {
          throw insertError;
        }
      }
    }
    // 重新验证页面缓存
    revalidatePath('/profile');
    return {
      success: true,
      message: '个人资料已成功更新！',
      profile: result_data[0],
      completionPercentage: Math.round((completedFields / requiredFields.length) * 100)
    };
  } catch (error) {
    console.error('更新个人资料时出错:', error);
    return {
      error: '更新失败，请重试'
    };
  }
}
// 获取当前用户的详细资料
export async function getUserProfile() {
  const { user } = await getCurrentUser();
  
  if (!user) {
    return { error: '用户未登录' };
  }
  return {
    success: true,
    user: user
  };
}
