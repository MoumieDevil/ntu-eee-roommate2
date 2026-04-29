import {
  pgTable,
  serial,
  varchar,
  text,
  timestamp,
  integer,
  boolean,
  index,
  pgEnum,
  uniqueIndex,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
// Enums
export const genderEnum = pgEnum('gender', ['male', 'female', 'other']);
export const cleanlinessEnum = pgEnum('cleanliness', ['extremely_clean', 'regularly_tidy', 'acceptable']);
export const teamStatusEnum = pgEnum('team_status', ['recruiting', 'full', 'disbanded']);
export const matchStatusEnum = pgEnum('match_status', ['pending', 'matched', 'rejected']);
// Users table - 用户基本信息表
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  studentId: varchar('student_id', { length: 20 }).notNull().unique(), // 学号
  passwordHash: text('password_hash').notNull(),
  name: varchar('name', { length: 100 }),
  isActive: boolean('is_active').notNull().default(true), // 账户激活状态
  isEmailVerified: boolean('is_email_verified').notNull().default(false), // 邮箱验证状态
  emailVerificationToken: varchar('email_verification_token', { length: 255 }), // 邮箱验证令牌
  emailVerificationExpires: timestamp('email_verification_expires'), // 令牌过期时间
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  deletedAt: timestamp('deleted_at'),
}, (table) => ({
  studentIdIdx: index('student_id_idx').on(table.studentId),
}));
// User profiles table - 用户详细资料表
export const userProfiles = pgTable('user_profiles', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' })
    .unique(),
  wechatId: varchar('wechat_id', { length: 100 }), // 微信号
  gender: genderEnum('gender'),
  age: integer('age'),
  // 基本信息
  program: varchar('program', { length: 100 }), // 入学项目
  hasRentalExperience: boolean('has_rental_experience'), // 是否有过合租经历
  hometown: varchar('hometown', { length: 100 }), // 籍贯/地区
  // 作息习惯
  sleepTime: varchar('sleep_time', { length: 20 }), // 睡觉时间
  wakeTime: varchar('wake_time', { length: 20 }), // 起床时间
  hasNap: varchar('has_nap', { length: 20 }), // 是否午睡
  smokeDrink: varchar('smoke_drink', { length: 20 }), // 是否吸烟/喝酒
  // 生活习惯
  cookFrequency: varchar('cook_frequency', { length: 30 }), // 是否做饭
  mindCook: varchar('mind_cook', { length: 30 }), // 是否介意室友做饭
  cleanliness: cleanlinessEnum('cleanliness'), // 清洁习惯
  guestFrequency: varchar('guest_frequency', { length: 30 }), // 是否会带朋友回家留宿
  callFrequency: varchar('call_frequency', { length: 30 }), // 是否会长时间语音/视频通话
  shareBathroom: varchar('share_bathroom', { length: 30 }), // 是否介意室友共用卫生间
  allergies: text('allergies'), // 有无过敏/特殊健康情况
  // 租房需求
  startDate: varchar('start_date', { length: 20 }), // 计划起租时间
  leaseTerm: varchar('lease_term', { length: 20 }), // 计划租期
  budget: integer('budget'), // 每月房租预算(SGD)
  commuteTime: integer('commute_time'), // 可接受的通勤时间(分钟)
  preferArea: varchar('prefer_area', { length: 30 }), // 偏好租房区域
  preferRoomType: varchar('prefer_room_type', { length: 30 }), // 偏好房型
  shareUtility: boolean('share_utility'), // 是否接受水电网额外分摊
  // 对室友的要求
  roommateGender: varchar('roommate_gender', { length: 10 }), // 对室友性别要求
  roommateSleep: varchar('roommate_sleep', { length: 20 }), // 对室友作息要求
  roommateSmoke: varchar('roommate_smoke', { length: 20 }), // 对室友是否吸烟喝酒要求
  otherRequirements: text('other_requirements'), // 其他特殊要求
  // 其他
  isProfileComplete: boolean('is_profile_complete').notNull().default(false), // 资料完整度
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
}, (table) => ({
  userIdIdx: index('profile_user_id_idx').on(table.userId),
}));
// Teams table - 队伍表
export const teams = pgTable('teams', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull(), // 队伍名称
  description: text('description'), // 队伍描述
  leaderId: integer('leader_id')
    .notNull()
    .references(() => users.id), // 队长ID
  gender: genderEnum('gender'), // 队伍性别（基于队长性别）
  maxMembers: integer('max_members').notNull().default(4), // 最大成员数
  currentMembers: integer('current_members').notNull().default(1), // 当前成员数
  status: teamStatusEnum('status').notNull().default('recruiting'), // 队伍状态
  requirements: text('requirements'), // 招募要求
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  deletedAt: timestamp('deleted_at'),
}, (table) => ({
  leaderIdIdx: index('team_leader_id_idx').on(table.leaderId),
  statusIdx: index('team_status_idx').on(table.status),
  genderIdx: index('team_gender_idx').on(table.gender), // 添加性别索引以优化查询
}));
// Team members table - 队伍成员表
export const teamMembers = pgTable('team_members', {
  id: serial('id').primaryKey(),
  teamId: integer('team_id')
    .notNull()
    .references(() => teams.id, { onDelete: 'cascade' }),
  userId: integer('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  isLeader: boolean('is_leader').notNull().default(false), // 是否为队长
  joinedAt: timestamp('joined_at').notNull().defaultNow(),
}, (table) => ({
  teamIdIdx: index('team_member_team_id_idx').on(table.teamId),
  userIdIdx: index('team_member_user_id_idx').on(table.userId),
  // 确保一个用户只能在一个队伍中（唯一约束）
  uniqueUserTeam: uniqueIndex('unique_user_team_idx').on(table.userId),
}));
// Request type enum for team join requests
export const requestTypeEnum = pgEnum('request_type_enum', ['application', 'invitation']);
// Team join requests table - 入队申请/邀请表
export const teamJoinRequests = pgTable('team_join_requests', {
  id: serial('id').primaryKey(),
  teamId: integer('team_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  userId: integer('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  requestType: requestTypeEnum('request_type').notNull().default('application'), // 申请类型：申请或邀请
  invitedBy: integer('invited_by')
    .references(() => users.id), // 邀请人（仅邀请类型）
  message: text('message'), // 申请/邀请留言
  status: matchStatusEnum('status').notNull().default('pending'), // 状态
  reviewedBy: integer('reviewed_by')
    .references(() => users.id), // 审核人
  reviewedAt: timestamp('reviewed_at'), // 审核时间
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
}, (table) => ({
  teamIdIdx: index('join_request_team_id_idx').on(table.teamId),
  userIdIdx: index('join_request_user_id_idx').on(table.userId),
  statusIdx: index('join_request_status_idx').on(table.status),
  requestTypeIdx: index('join_request_type_idx').on(table.requestType),
  invitedByIdx: index('join_request_invited_by_idx').on(table.invitedBy),
});
// Activity logs table - 活动日志表（用于系统活动追踪，不包含用户互动）
export const activityLogs = pgTable('activity_logs', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  action: text('action').notNull(),
  timestamp: timestamp('timestamp').notNull().defaultNow(),
  ipAddress: varchar('ip_address', { length: 45 }),
  metadata: text('metadata'), // JSON field for additional data
}, (table) => ({
  userIdIdx: index('activity_log_user_id_idx').on(table.userId),
  actionIdx: index('activity_log_action_idx').on(table.action),
}));
// Relations
export const usersRelations = relations(users, ({ one, many }) => ({
  profile: one(userProfiles),
  activityLogs: many(activityLogs),
  teamMemberships: many(teamMembers),
  teamsAsLeader: many(teams),
  joinRequests: many(teamJoinRequests),
  invitationsSent: many(teamJoinRequests, { relationName: 'invitationsSent' }),
}));
export const userProfilesRelations = relations(userProfiles, ({ one }) => ({
  user: one(users, {
    fields: [userProfiles.userId],
    references: [users.id],
  }),
}));
export const teamsRelations = relations(teams, ({ one, many }) => ({
  leader: one(users, {
    fields: [teams.leaderId],
    references: [users.id],
  }),
  members: many(teamMembers),
  joinRequests: many(teamJoinRequests),
}));
export const teamMembersRelations = relations(teamMembers, ({ one }) => ({
  team: one(teams, {
    fields: [teamMembers.teamId],
    references: [teams.id],
  }),
  user: one(users, {
    fields: [teamMembers.userId],
    references: [users.id],
  }),
}));
export const teamJoinRequestsRelations = relations(teamJoinRequests, ({ one }) => ({
  team: one(teams, {
    fields: [teamJoinRequests.teamId],
    references: [users.id],
  }),
  user: one(users, {
    fields: [teamJoinRequests.userId],
    references: [users.id],
  }),
  inviter: one(users, {
    fields: [teamJoinRequests.invitedBy],
    references: [users.id],
    relationName: 'invitationsSent',
  }),
  reviewer: one(users, {
    fields: [teamJoinRequests.reviewedBy],
    references: [users.id],
    relationName: 'reviewer',
  }),
}));
export const activityLogsRelations = relations(activityLogs, ({ one }) => ({
  user: one(users, {
    fields: [activityLogs.userId],
    references: [users.id],
  }),
}));
// Type exports
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type UserProfile = typeof userProfiles.$inferSelect;
export type NewUserProfile = typeof userProfiles.$inferInsert;
export type Team = typeof teams.$inferSelect;
export type NewTeam = typeof teams.$inferSelect;
export type TeamMember = typeof teamMembers.$inferSelect;
export type NewTeamMember = typeof teamMembers.$inferInsert;
export type TeamJoinRequest = typeof teamJoinRequests.$inferSelect;
export type NewTeamJoinRequest = typeof teamJoinRequests.$inferInsert;
export type ActivityLog = typeof activityLogs.$inferSelect;
export type NewActivityLog = typeof activityLogs.$inferInsert;
// Activity types enum (扩展原有的活动类型)
export enum ActivityType {
  // 用户相关
  SIGN_UP = 'SIGN_UP',
  SIGN_IN = 'SIGN_IN',
  SIGN_OUT = 'SIGN_OUT',
  EMAIL_VERIFIED = 'EMAIL_VERIFIED',
  UPDATE_PASSWORD = 'UPDATE_PASSWORD',
  DELETE_ACCOUNT = 'DELETE_ACCOUNT',
  UPDATE_ACCOUNT = 'UPDATE_ACCOUNT',
  UPDATE_PROFILE = 'UPDATE_PROFILE',
  // 队伍相关
  CREATE_TEAM = 'CREATE_TEAM',
  JOIN_TEAM = 'JOIN_TEAM',
  LEAVE_TEAM = 'LEAVE_TEAM',
  REQUEST_JOIN_TEAM = 'REQUEST_JOIN_TEAM',
  APPROVE_JOIN_REQUEST = 'APPROVE_JOIN_REQUEST',
  REJECT_JOIN_REQUEST = 'REJECT_JOIN_REQUEST',
  BECOME_TEAM_LEADER = 'BECOME_TEAM_LEADER',
  DISBAND_TEAM = 'DISBAND_TEAM',
  REMOVE_TEAM_MEMBER = 'REMOVE_TEAM_MEMBER',
}
