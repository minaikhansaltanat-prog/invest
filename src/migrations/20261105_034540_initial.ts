import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."_locales" AS ENUM('kk', 'ru', 'en', 'zh');
  CREATE TYPE "public"."enum_admins_roles" AS ENUM('super-admin', 'chair', 'secretariat', 'expert', 'compliance', 'auditor', 'content-manager', 'translator', 'regional-rep', 'analyst');
  CREATE TYPE "public"."enum_admins_region" AS ENUM('astana', 'almaty-city', 'shymkent', 'abai', 'akmola', 'aktobe', 'almaty', 'atyrau', 'east-kazakhstan', 'zhambyl', 'zhetysu', 'west-kazakhstan', 'karaganda', 'kostanay', 'kyzylorda', 'mangystau', 'pavlodar', 'north-kazakhstan', 'turkistan', 'ulytau');
  CREATE TYPE "public"."enum_users_roles" AS ENUM('investor', 'owner', 'member');
  CREATE TYPE "public"."enum_users_status" AS ENUM('active', 'blocked');
  CREATE TYPE "public"."enum_users_locale" AS ENUM('kk', 'ru', 'en', 'zh');
  CREATE TYPE "public"."enum_media_license" AS ENUM('own', 'stock', 'partner', 'ai-placeholder');
  CREATE TYPE "public"."enum_pages_blocks_cards_items_icon" AS ENUM('globe', 'layers', 'shield-check', 'factory', 'chart', 'columns', 'compass', 'leaf', 'document', 'shield', 'calendar', 'phone', 'mail', 'pin', 'user', 'eye', 'sparkle', 'lock', 'video', 'image', 'wechat', 'check', 'alert', 'info');
  CREATE TYPE "public"."enum_pages_blocks_cards_columns" AS ENUM('2', '3', '4');
  CREATE TYPE "public"."enum_pages_blocks_notice_tone" AS ENUM('info', 'caution', 'legal');
  CREATE TYPE "public"."enum_pages_section" AS ENUM('about', 'services', 'investors', 'projects', 'membership', 'results', 'partners', 'media', 'contacts', 'legal');
  CREATE TYPE "public"."enum_pages_translation_status_kk" AS ENUM('none', 'draft', 'review', 'approved');
  CREATE TYPE "public"."enum_pages_translation_status_ru" AS ENUM('none', 'draft', 'review', 'approved');
  CREATE TYPE "public"."enum_pages_translation_status_en" AS ENUM('none', 'draft', 'review', 'approved');
  CREATE TYPE "public"."enum_pages_translation_status_zh" AS ENUM('none', 'draft', 'review', 'approved');
  CREATE TYPE "public"."enum_pages_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__pages_v_blocks_cards_items_icon" AS ENUM('globe', 'layers', 'shield-check', 'factory', 'chart', 'columns', 'compass', 'leaf', 'document', 'shield', 'calendar', 'phone', 'mail', 'pin', 'user', 'eye', 'sparkle', 'lock', 'video', 'image', 'wechat', 'check', 'alert', 'info');
  CREATE TYPE "public"."enum__pages_v_blocks_cards_columns" AS ENUM('2', '3', '4');
  CREATE TYPE "public"."enum__pages_v_blocks_notice_tone" AS ENUM('info', 'caution', 'legal');
  CREATE TYPE "public"."enum__pages_v_version_section" AS ENUM('about', 'services', 'investors', 'projects', 'membership', 'results', 'partners', 'media', 'contacts', 'legal');
  CREATE TYPE "public"."enum__pages_v_version_translation_status_kk" AS ENUM('none', 'draft', 'review', 'approved');
  CREATE TYPE "public"."enum__pages_v_version_translation_status_ru" AS ENUM('none', 'draft', 'review', 'approved');
  CREATE TYPE "public"."enum__pages_v_version_translation_status_en" AS ENUM('none', 'draft', 'review', 'approved');
  CREATE TYPE "public"."enum__pages_v_version_translation_status_zh" AS ENUM('none', 'draft', 'review', 'approved');
  CREATE TYPE "public"."enum__pages_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__pages_v_published_locale" AS ENUM('kk', 'ru', 'en', 'zh');
  CREATE TYPE "public"."enum_people_group" AS ENUM('leadership', 'secretariat', 'experts', 'representatives');
  CREATE TYPE "public"."enum_people_translation_status_kk" AS ENUM('none', 'draft', 'review', 'approved');
  CREATE TYPE "public"."enum_people_translation_status_ru" AS ENUM('none', 'draft', 'review', 'approved');
  CREATE TYPE "public"."enum_people_translation_status_en" AS ENUM('none', 'draft', 'review', 'approved');
  CREATE TYPE "public"."enum_people_translation_status_zh" AS ENUM('none', 'draft', 'review', 'approved');
  CREATE TYPE "public"."enum_people_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__people_v_version_group" AS ENUM('leadership', 'secretariat', 'experts', 'representatives');
  CREATE TYPE "public"."enum__people_v_version_translation_status_kk" AS ENUM('none', 'draft', 'review', 'approved');
  CREATE TYPE "public"."enum__people_v_version_translation_status_ru" AS ENUM('none', 'draft', 'review', 'approved');
  CREATE TYPE "public"."enum__people_v_version_translation_status_en" AS ENUM('none', 'draft', 'review', 'approved');
  CREATE TYPE "public"."enum__people_v_version_translation_status_zh" AS ENUM('none', 'draft', 'review', 'approved');
  CREATE TYPE "public"."enum__people_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__people_v_published_locale" AS ENUM('kk', 'ru', 'en', 'zh');
  CREATE TYPE "public"."enum_services_blocks_cards_items_icon" AS ENUM('globe', 'layers', 'shield-check', 'factory', 'chart', 'columns', 'compass', 'leaf', 'document', 'shield', 'calendar', 'phone', 'mail', 'pin', 'user', 'eye', 'sparkle', 'lock', 'video', 'image', 'wechat', 'check', 'alert', 'info');
  CREATE TYPE "public"."enum_services_blocks_cards_columns" AS ENUM('2', '3', '4');
  CREATE TYPE "public"."enum_services_blocks_notice_tone" AS ENUM('info', 'caution', 'legal');
  CREATE TYPE "public"."enum_services_icon" AS ENUM('globe', 'layers', 'shield-check', 'factory', 'chart', 'columns', 'compass', 'leaf');
  CREATE TYPE "public"."enum_services_translation_status_kk" AS ENUM('none', 'draft', 'review', 'approved');
  CREATE TYPE "public"."enum_services_translation_status_ru" AS ENUM('none', 'draft', 'review', 'approved');
  CREATE TYPE "public"."enum_services_translation_status_en" AS ENUM('none', 'draft', 'review', 'approved');
  CREATE TYPE "public"."enum_services_translation_status_zh" AS ENUM('none', 'draft', 'review', 'approved');
  CREATE TYPE "public"."enum_services_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__services_v_blocks_cards_items_icon" AS ENUM('globe', 'layers', 'shield-check', 'factory', 'chart', 'columns', 'compass', 'leaf', 'document', 'shield', 'calendar', 'phone', 'mail', 'pin', 'user', 'eye', 'sparkle', 'lock', 'video', 'image', 'wechat', 'check', 'alert', 'info');
  CREATE TYPE "public"."enum__services_v_blocks_cards_columns" AS ENUM('2', '3', '4');
  CREATE TYPE "public"."enum__services_v_blocks_notice_tone" AS ENUM('info', 'caution', 'legal');
  CREATE TYPE "public"."enum__services_v_version_icon" AS ENUM('globe', 'layers', 'shield-check', 'factory', 'chart', 'columns', 'compass', 'leaf');
  CREATE TYPE "public"."enum__services_v_version_translation_status_kk" AS ENUM('none', 'draft', 'review', 'approved');
  CREATE TYPE "public"."enum__services_v_version_translation_status_ru" AS ENUM('none', 'draft', 'review', 'approved');
  CREATE TYPE "public"."enum__services_v_version_translation_status_en" AS ENUM('none', 'draft', 'review', 'approved');
  CREATE TYPE "public"."enum__services_v_version_translation_status_zh" AS ENUM('none', 'draft', 'review', 'approved');
  CREATE TYPE "public"."enum__services_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__services_v_published_locale" AS ENUM('kk', 'ru', 'en', 'zh');
  CREATE TYPE "public"."enum_projects_internal_risks_type" AS ENUM('legal', 'financial', 'technical', 'market', 'ecology');
  CREATE TYPE "public"."enum_projects_internal_risks_level" AS ENUM('low', 'medium', 'high');
  CREATE TYPE "public"."enum_projects_internal_risks_status" AS ENUM('open', 'mitigated', 'closed');
  CREATE TYPE "public"."enum_projects_sector" AS ENUM('industry', 'mining', 'energy', 'logistics', 'agro', 'infrastructure', 'technology', 'real-estate', 'other');
  CREATE TYPE "public"."enum_projects_region" AS ENUM('astana', 'almaty-city', 'shymkent', 'abai', 'akmola', 'aktobe', 'almaty', 'atyrau', 'east-kazakhstan', 'zhambyl', 'zhetysu', 'west-kazakhstan', 'karaganda', 'kostanay', 'kyzylorda', 'mangystau', 'pavlodar', 'north-kazakhstan', 'turkistan', 'ulytau');
  CREATE TYPE "public"."enum_projects_model" AS ENUM('joint-venture', 'epc', 'epc-f', 'bot', 'ppp', 'equity', 'other');
  CREATE TYPE "public"."enum_projects_level" AS ENUM('1', '2', '3', '4');
  CREATE TYPE "public"."enum_projects_stage" AS ENUM('1', '2', '3', '4', '5', '6', '7', '8');
  CREATE TYPE "public"."enum_projects_icon_key" AS ENUM('solar', 'port', 'factory', 'wind', 'agro', 'rail');
  CREATE TYPE "public"."enum_projects_internal_risk_level" AS ENUM('low', 'medium', 'high');
  CREATE TYPE "public"."enum_projects_internal_committee_decision" AS ENUM('pending', 'approved', 'rejected');
  CREATE TYPE "public"."enum_projects_internal_amounts_association_contribution" AS ENUM('direct', 'indirect');
  CREATE TYPE "public"."enum_projects_translation_status_kk" AS ENUM('none', 'draft', 'review', 'approved');
  CREATE TYPE "public"."enum_projects_translation_status_ru" AS ENUM('none', 'draft', 'review', 'approved');
  CREATE TYPE "public"."enum_projects_translation_status_en" AS ENUM('none', 'draft', 'review', 'approved');
  CREATE TYPE "public"."enum_projects_translation_status_zh" AS ENUM('none', 'draft', 'review', 'approved');
  CREATE TYPE "public"."enum_news_category" AS ENUM('strategy', 'methodology', 'projects', 'china', 'events', 'analytics');
  CREATE TYPE "public"."enum_news_translation_status_kk" AS ENUM('none', 'draft', 'review', 'approved');
  CREATE TYPE "public"."enum_news_translation_status_ru" AS ENUM('none', 'draft', 'review', 'approved');
  CREATE TYPE "public"."enum_news_translation_status_en" AS ENUM('none', 'draft', 'review', 'approved');
  CREATE TYPE "public"."enum_news_translation_status_zh" AS ENUM('none', 'draft', 'review', 'approved');
  CREATE TYPE "public"."enum_news_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__news_v_version_category" AS ENUM('strategy', 'methodology', 'projects', 'china', 'events', 'analytics');
  CREATE TYPE "public"."enum__news_v_version_translation_status_kk" AS ENUM('none', 'draft', 'review', 'approved');
  CREATE TYPE "public"."enum__news_v_version_translation_status_ru" AS ENUM('none', 'draft', 'review', 'approved');
  CREATE TYPE "public"."enum__news_v_version_translation_status_en" AS ENUM('none', 'draft', 'review', 'approved');
  CREATE TYPE "public"."enum__news_v_version_translation_status_zh" AS ENUM('none', 'draft', 'review', 'approved');
  CREATE TYPE "public"."enum__news_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__news_v_published_locale" AS ENUM('kk', 'ru', 'en', 'zh');
  CREATE TYPE "public"."enum_events_format" AS ENUM('offline', 'online', 'hybrid');
  CREATE TYPE "public"."enum_events_translation_status_kk" AS ENUM('none', 'draft', 'review', 'approved');
  CREATE TYPE "public"."enum_events_translation_status_ru" AS ENUM('none', 'draft', 'review', 'approved');
  CREATE TYPE "public"."enum_events_translation_status_en" AS ENUM('none', 'draft', 'review', 'approved');
  CREATE TYPE "public"."enum_events_translation_status_zh" AS ENUM('none', 'draft', 'review', 'approved');
  CREATE TYPE "public"."enum_events_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__events_v_version_format" AS ENUM('offline', 'online', 'hybrid');
  CREATE TYPE "public"."enum__events_v_version_translation_status_kk" AS ENUM('none', 'draft', 'review', 'approved');
  CREATE TYPE "public"."enum__events_v_version_translation_status_ru" AS ENUM('none', 'draft', 'review', 'approved');
  CREATE TYPE "public"."enum__events_v_version_translation_status_en" AS ENUM('none', 'draft', 'review', 'approved');
  CREATE TYPE "public"."enum__events_v_version_translation_status_zh" AS ENUM('none', 'draft', 'review', 'approved');
  CREATE TYPE "public"."enum__events_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__events_v_published_locale" AS ENUM('kk', 'ru', 'en', 'zh');
  CREATE TYPE "public"."enum_videos_translation_status_kk" AS ENUM('none', 'draft', 'review', 'approved');
  CREATE TYPE "public"."enum_videos_translation_status_ru" AS ENUM('none', 'draft', 'review', 'approved');
  CREATE TYPE "public"."enum_videos_translation_status_en" AS ENUM('none', 'draft', 'review', 'approved');
  CREATE TYPE "public"."enum_videos_translation_status_zh" AS ENUM('none', 'draft', 'review', 'approved');
  CREATE TYPE "public"."enum_videos_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__videos_v_version_translation_status_kk" AS ENUM('none', 'draft', 'review', 'approved');
  CREATE TYPE "public"."enum__videos_v_version_translation_status_ru" AS ENUM('none', 'draft', 'review', 'approved');
  CREATE TYPE "public"."enum__videos_v_version_translation_status_en" AS ENUM('none', 'draft', 'review', 'approved');
  CREATE TYPE "public"."enum__videos_v_version_translation_status_zh" AS ENUM('none', 'draft', 'review', 'approved');
  CREATE TYPE "public"."enum__videos_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__videos_v_published_locale" AS ENUM('kk', 'ru', 'en', 'zh');
  CREATE TYPE "public"."enum_albums_translation_status_kk" AS ENUM('none', 'draft', 'review', 'approved');
  CREATE TYPE "public"."enum_albums_translation_status_ru" AS ENUM('none', 'draft', 'review', 'approved');
  CREATE TYPE "public"."enum_albums_translation_status_en" AS ENUM('none', 'draft', 'review', 'approved');
  CREATE TYPE "public"."enum_albums_translation_status_zh" AS ENUM('none', 'draft', 'review', 'approved');
  CREATE TYPE "public"."enum_albums_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__albums_v_version_translation_status_kk" AS ENUM('none', 'draft', 'review', 'approved');
  CREATE TYPE "public"."enum__albums_v_version_translation_status_ru" AS ENUM('none', 'draft', 'review', 'approved');
  CREATE TYPE "public"."enum__albums_v_version_translation_status_en" AS ENUM('none', 'draft', 'review', 'approved');
  CREATE TYPE "public"."enum__albums_v_version_translation_status_zh" AS ENUM('none', 'draft', 'review', 'approved');
  CREATE TYPE "public"."enum__albums_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__albums_v_published_locale" AS ENUM('kk', 'ru', 'en', 'zh');
  CREATE TYPE "public"."enum_partners_kind" AS ENUM('international', 'state', 'finance', 'industry', 'academic', 'media');
  CREATE TYPE "public"."enum_partners_translation_status_kk" AS ENUM('none', 'draft', 'review', 'approved');
  CREATE TYPE "public"."enum_partners_translation_status_ru" AS ENUM('none', 'draft', 'review', 'approved');
  CREATE TYPE "public"."enum_partners_translation_status_en" AS ENUM('none', 'draft', 'review', 'approved');
  CREATE TYPE "public"."enum_partners_translation_status_zh" AS ENUM('none', 'draft', 'review', 'approved');
  CREATE TYPE "public"."enum_partners_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__partners_v_version_kind" AS ENUM('international', 'state', 'finance', 'industry', 'academic', 'media');
  CREATE TYPE "public"."enum__partners_v_version_translation_status_kk" AS ENUM('none', 'draft', 'review', 'approved');
  CREATE TYPE "public"."enum__partners_v_version_translation_status_ru" AS ENUM('none', 'draft', 'review', 'approved');
  CREATE TYPE "public"."enum__partners_v_version_translation_status_en" AS ENUM('none', 'draft', 'review', 'approved');
  CREATE TYPE "public"."enum__partners_v_version_translation_status_zh" AS ENUM('none', 'draft', 'review', 'approved');
  CREATE TYPE "public"."enum__partners_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__partners_v_published_locale" AS ENUM('kk', 'ru', 'en', 'zh');
  CREATE TYPE "public"."enum_documents_category" AS ENUM('charter', 'policy', 'methodology', 'report', 'privacy', 'other');
  CREATE TYPE "public"."enum_documents_translation_status_kk" AS ENUM('none', 'draft', 'review', 'approved');
  CREATE TYPE "public"."enum_documents_translation_status_ru" AS ENUM('none', 'draft', 'review', 'approved');
  CREATE TYPE "public"."enum_documents_translation_status_en" AS ENUM('none', 'draft', 'review', 'approved');
  CREATE TYPE "public"."enum_documents_translation_status_zh" AS ENUM('none', 'draft', 'review', 'approved');
  CREATE TYPE "public"."enum_documents_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__documents_v_version_category" AS ENUM('charter', 'policy', 'methodology', 'report', 'privacy', 'other');
  CREATE TYPE "public"."enum__documents_v_version_translation_status_kk" AS ENUM('none', 'draft', 'review', 'approved');
  CREATE TYPE "public"."enum__documents_v_version_translation_status_ru" AS ENUM('none', 'draft', 'review', 'approved');
  CREATE TYPE "public"."enum__documents_v_version_translation_status_en" AS ENUM('none', 'draft', 'review', 'approved');
  CREATE TYPE "public"."enum__documents_v_version_translation_status_zh" AS ENUM('none', 'draft', 'review', 'approved');
  CREATE TYPE "public"."enum__documents_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__documents_v_published_locale" AS ENUM('kk', 'ru', 'en', 'zh');
  CREATE TYPE "public"."enum_submissions_kind" AS ENUM('contact', 'investor', 'project', 'membership');
  CREATE TYPE "public"."enum_submissions_status" AS ENUM('new', 'in-review', 'accepted', 'rejected', 'spam');
  CREATE TYPE "public"."enum_organizations_sector" AS ENUM('industry', 'mining', 'energy', 'logistics', 'agro', 'infrastructure', 'technology', 'real-estate', 'other');
  CREATE TYPE "public"."enum_investors_sectors" AS ENUM('industry', 'mining', 'energy', 'logistics', 'agro', 'infrastructure', 'technology', 'real-estate', 'other');
  CREATE TYPE "public"."enum_investors_regions" AS ENUM('astana', 'almaty-city', 'shymkent', 'abai', 'akmola', 'aktobe', 'almaty', 'atyrau', 'east-kazakhstan', 'zhambyl', 'zhetysu', 'west-kazakhstan', 'karaganda', 'kostanay', 'kyzylorda', 'mangystau', 'pavlodar', 'north-kazakhstan', 'turkistan', 'ulytau');
  CREATE TYPE "public"."enum_investors_models" AS ENUM('joint-venture', 'epc', 'epc-f', 'bot', 'ppp', 'equity', 'other');
  CREATE TYPE "public"."enum_investors_kind" AS ENUM('corporate', 'fund', 'institution');
  CREATE TYPE "public"."enum_investors_direction" AS ENUM('china', 'gulf', 'global', 'other');
  CREATE TYPE "public"."enum_investors_risk_appetite" AS ENUM('low', 'medium', 'high');
  CREATE TYPE "public"."enum_investors_status" AS ENUM('unassessed', 'stopped', 'priority', 'conditional', 'watch', 'deferred');
  CREATE TYPE "public"."enum_investors_grade" AS ENUM('A', 'B', 'C', 'D');
  CREATE TYPE "public"."enum_scorecards_entries_dimension" AS ENUM('financialPotential', 'intentAndAuthority', 'sectorExperience', 'reputation', 'localContribution', 'complianceRisk', 'planReadiness');
  CREATE TYPE "public"."enum_scorecards_assessments_role" AS ENUM('expert', 'committee-member');
  CREATE TYPE "public"."enum_matches_status" AS ENUM('proposed', 'interested', 'negotiating', 'declined');
  CREATE TYPE "public"."enum_ndas_method" AS ENUM('otp-accept', 'ecp');
  CREATE TYPE "public"."enum_dataroom_files_category" AS ENUM('financial', 'legal', 'technical', 'market', 'ecology', 'other');
  CREATE TYPE "public"."enum_dataroom_log_action" AS ENUM('open', 'view', 'download', 'denied');
  CREATE TYPE "public"."enum_agreements_type" AS ENUM('memorandum', 'contract');
  CREATE TYPE "public"."enum_members_category" AS ENUM('foreign-investors', 'institutions', 'industrial', 'professional', 'strategic');
  CREATE TYPE "public"."enum_members_status" AS ENUM('application', 'vetting', 'active', 'suspended', 'ended');
  CREATE TYPE "public"."enum_issues_type" AS ENUM('land', 'infrastructure', 'permit', 'tax', 'labor', 'migration');
  CREATE TYPE "public"."enum_issues_status" AS ENUM('new', 'forwarded', 'resolved', 'closed');
  CREATE TYPE "public"."enum_audit_log_action" AS ENUM('create', 'update', 'delete', 'login', 'export');
  CREATE TYPE "public"."enum_home_translation_status_kk" AS ENUM('none', 'draft', 'review', 'approved');
  CREATE TYPE "public"."enum_home_translation_status_ru" AS ENUM('none', 'draft', 'review', 'approved');
  CREATE TYPE "public"."enum_home_translation_status_en" AS ENUM('none', 'draft', 'review', 'approved');
  CREATE TYPE "public"."enum_home_translation_status_zh" AS ENUM('none', 'draft', 'review', 'approved');
  CREATE TYPE "public"."enum__home_v_version_translation_status_kk" AS ENUM('none', 'draft', 'review', 'approved');
  CREATE TYPE "public"."enum__home_v_version_translation_status_ru" AS ENUM('none', 'draft', 'review', 'approved');
  CREATE TYPE "public"."enum__home_v_version_translation_status_en" AS ENUM('none', 'draft', 'review', 'approved');
  CREATE TYPE "public"."enum__home_v_version_translation_status_zh" AS ENUM('none', 'draft', 'review', 'approved');
  CREATE TYPE "public"."enum_settings_policy_translation_policy" AS ENUM('allow-draft', 'approved-only');
  CREATE TYPE "public"."enum_scoring_config_dimensions_key" AS ENUM('financialPotential', 'intentAndAuthority', 'sectorExperience', 'reputation', 'localContribution', 'complianceRisk', 'planReadiness');
  CREATE TYPE "public"."enum_scoring_config_grades_key" AS ENUM('A', 'B', 'C', 'D');
  CREATE TYPE "public"."enum__scoring_config_v_version_dimensions_key" AS ENUM('financialPotential', 'intentAndAuthority', 'sectorExperience', 'reputation', 'localContribution', 'complianceRisk', 'planReadiness');
  CREATE TYPE "public"."enum__scoring_config_v_version_grades_key" AS ENUM('A', 'B', 'C', 'D');
  CREATE TABLE "admins_roles" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_admins_roles",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "admins_login_history" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"at" timestamp(3) with time zone,
  	"ip" varchar,
  	"agent" varchar
  );
  
  CREATE TABLE "admins_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "admins" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"region" "enum_admins_region",
  	"totp_enabled" boolean DEFAULT false,
  	"totp_secret" varchar,
  	"totp_pending" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"reset_password_requested_at" timestamp(3) with time zone,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "users_roles" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_users_roles",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "users_login_history" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"at" timestamp(3) with time zone,
  	"ip" varchar,
  	"agent" varchar
  );
  
  CREATE TABLE "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"status" "enum_users_status" DEFAULT 'active',
  	"locale" "enum_users_locale" DEFAULT 'kk',
  	"organization" varchar,
  	"country" varchar,
  	"phone" varchar,
  	"consents_privacy_at" timestamp(3) with time zone,
  	"consents_privacy_version" varchar,
  	"totp_enabled" boolean DEFAULT false,
  	"totp_secret" varchar,
  	"totp_pending" varchar,
  	"deletion_requested_at" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"reset_password_requested_at" timestamp(3) with time zone,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"credit" varchar,
  	"license" "enum_media_license" DEFAULT 'own',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric,
  	"sizes_thumbnail_url" varchar,
  	"sizes_thumbnail_width" numeric,
  	"sizes_thumbnail_height" numeric,
  	"sizes_thumbnail_mime_type" varchar,
  	"sizes_thumbnail_filesize" numeric,
  	"sizes_thumbnail_filename" varchar
  );
  
  CREATE TABLE "media_locales" (
  	"alt" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "pages_blocks_paragraphs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_paragraphs_locales" (
  	"heading" varchar,
  	"lead" varchar,
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_cards_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" "enum_pages_blocks_cards_items_icon",
  	"href" varchar
  );
  
  CREATE TABLE "pages_blocks_cards_items_locales" (
  	"title" varchar,
  	"text" varchar,
  	"badge" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"columns" "enum_pages_blocks_cards_columns" DEFAULT '3',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_cards_locales" (
  	"heading" varchar,
  	"lead" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_steps_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "pages_blocks_steps_items_locales" (
  	"title" varchar,
  	"text" varchar,
  	"meta" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_steps_locales" (
  	"heading" varchar,
  	"lead" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_facts_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "pages_blocks_facts_items_locales" (
  	"label" varchar,
  	"value" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_facts" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_facts_locales" (
  	"heading" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_faq_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "pages_blocks_faq_items_locales" (
  	"q" varchar,
  	"a" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_faq" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_faq_locales" (
  	"heading" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_table_columns" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "pages_blocks_table_columns_locales" (
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_table_rows_cells" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "pages_blocks_table_rows_cells_locales" (
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_table_rows" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "pages_blocks_table" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_table_locales" (
  	"heading" varchar,
  	"caption" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_notice" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"tone" "enum_pages_blocks_notice_tone" DEFAULT 'info',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_notice_locales" (
  	"title" varchar,
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_links_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"href" varchar
  );
  
  CREATE TABLE "pages_blocks_links_items_locales" (
  	"label" varchar,
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_links_locales" (
  	"heading" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"path" varchar,
  	"section" "enum_pages_section",
  	"cta_href" varchar,
  	"translation_status_kk" "enum_pages_translation_status_kk" DEFAULT 'approved',
  	"translation_status_ru" "enum_pages_translation_status_ru" DEFAULT 'draft',
  	"translation_status_en" "enum_pages_translation_status_en" DEFAULT 'draft',
  	"translation_status_zh" "enum_pages_translation_status_zh" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_pages_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "pages_locales" (
  	"title" varchar,
  	"description" varchar,
  	"cta_title" varchar,
  	"cta_text" varchar,
  	"cta_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_paragraphs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_paragraphs_locales" (
  	"heading" varchar,
  	"lead" varchar,
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_cards_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"icon" "enum__pages_v_blocks_cards_items_icon",
  	"href" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_cards_items_locales" (
  	"title" varchar,
  	"text" varchar,
  	"badge" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"columns" "enum__pages_v_blocks_cards_columns" DEFAULT '3',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_cards_locales" (
  	"heading" varchar,
  	"lead" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_steps_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_steps_items_locales" (
  	"title" varchar,
  	"text" varchar,
  	"meta" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_steps_locales" (
  	"heading" varchar,
  	"lead" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_facts_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_facts_items_locales" (
  	"label" varchar,
  	"value" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_facts" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_facts_locales" (
  	"heading" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_faq_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_faq_items_locales" (
  	"q" varchar,
  	"a" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_faq" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_faq_locales" (
  	"heading" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_table_columns" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_table_columns_locales" (
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_table_rows_cells" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_table_rows_cells_locales" (
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_table_rows" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_table" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_table_locales" (
  	"heading" varchar,
  	"caption" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_notice" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"tone" "enum__pages_v_blocks_notice_tone" DEFAULT 'info',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_notice_locales" (
  	"title" varchar,
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_links_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"href" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_links_items_locales" (
  	"label" varchar,
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_links_locales" (
  	"heading" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_path" varchar,
  	"version_section" "enum__pages_v_version_section",
  	"version_cta_href" varchar,
  	"version_translation_status_kk" "enum__pages_v_version_translation_status_kk" DEFAULT 'approved',
  	"version_translation_status_ru" "enum__pages_v_version_translation_status_ru" DEFAULT 'draft',
  	"version_translation_status_en" "enum__pages_v_version_translation_status_en" DEFAULT 'draft',
  	"version_translation_status_zh" "enum__pages_v_version_translation_status_zh" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__pages_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__pages_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "_pages_v_locales" (
  	"version_title" varchar,
  	"version_description" varchar,
  	"version_cta_title" varchar,
  	"version_cta_text" varchar,
  	"version_cta_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "people" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar,
  	"group" "enum_people_group" DEFAULT 'leadership',
  	"photo_id" integer,
  	"photo_consent" boolean DEFAULT false,
  	"photo_consent_note" varchar,
  	"photo_consent_file_id" integer,
  	"monogram" varchar,
  	"languages" varchar,
  	"order" numeric DEFAULT 100,
  	"translation_status_kk" "enum_people_translation_status_kk" DEFAULT 'approved',
  	"translation_status_ru" "enum_people_translation_status_ru" DEFAULT 'draft',
  	"translation_status_en" "enum_people_translation_status_en" DEFAULT 'draft',
  	"translation_status_zh" "enum_people_translation_status_zh" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_people_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "people_locales" (
  	"name" varchar,
  	"position" varchar,
  	"photo_alt" varchar,
  	"bio" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_people_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_slug" varchar,
  	"version_group" "enum__people_v_version_group" DEFAULT 'leadership',
  	"version_photo_id" integer,
  	"version_photo_consent" boolean DEFAULT false,
  	"version_photo_consent_note" varchar,
  	"version_photo_consent_file_id" integer,
  	"version_monogram" varchar,
  	"version_languages" varchar,
  	"version_order" numeric DEFAULT 100,
  	"version_translation_status_kk" "enum__people_v_version_translation_status_kk" DEFAULT 'approved',
  	"version_translation_status_ru" "enum__people_v_version_translation_status_ru" DEFAULT 'draft',
  	"version_translation_status_en" "enum__people_v_version_translation_status_en" DEFAULT 'draft',
  	"version_translation_status_zh" "enum__people_v_version_translation_status_zh" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__people_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__people_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "_people_v_locales" (
  	"version_name" varchar,
  	"version_position" varchar,
  	"version_photo_alt" varchar,
  	"version_bio" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "services_blocks_paragraphs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "services_blocks_paragraphs_locales" (
  	"heading" varchar,
  	"lead" varchar,
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "services_blocks_cards_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" "enum_services_blocks_cards_items_icon",
  	"href" varchar
  );
  
  CREATE TABLE "services_blocks_cards_items_locales" (
  	"title" varchar,
  	"text" varchar,
  	"badge" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "services_blocks_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"columns" "enum_services_blocks_cards_columns" DEFAULT '3',
  	"block_name" varchar
  );
  
  CREATE TABLE "services_blocks_cards_locales" (
  	"heading" varchar,
  	"lead" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "services_blocks_steps_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "services_blocks_steps_items_locales" (
  	"title" varchar,
  	"text" varchar,
  	"meta" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "services_blocks_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "services_blocks_steps_locales" (
  	"heading" varchar,
  	"lead" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "services_blocks_facts_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "services_blocks_facts_items_locales" (
  	"label" varchar,
  	"value" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "services_blocks_facts" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "services_blocks_facts_locales" (
  	"heading" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "services_blocks_faq_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "services_blocks_faq_items_locales" (
  	"q" varchar,
  	"a" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "services_blocks_faq" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "services_blocks_faq_locales" (
  	"heading" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "services_blocks_table_columns" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "services_blocks_table_columns_locales" (
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "services_blocks_table_rows_cells" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "services_blocks_table_rows_cells_locales" (
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "services_blocks_table_rows" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "services_blocks_table" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "services_blocks_table_locales" (
  	"heading" varchar,
  	"caption" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "services_blocks_notice" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"tone" "enum_services_blocks_notice_tone" DEFAULT 'info',
  	"block_name" varchar
  );
  
  CREATE TABLE "services_blocks_notice_locales" (
  	"title" varchar,
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "services_blocks_links_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"href" varchar
  );
  
  CREATE TABLE "services_blocks_links_items_locales" (
  	"label" varchar,
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "services_blocks_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "services_blocks_links_locales" (
  	"heading" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "services" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar,
  	"number" numeric,
  	"icon" "enum_services_icon",
  	"highlight" boolean,
  	"cta_href" varchar,
  	"translation_status_kk" "enum_services_translation_status_kk" DEFAULT 'approved',
  	"translation_status_ru" "enum_services_translation_status_ru" DEFAULT 'draft',
  	"translation_status_en" "enum_services_translation_status_en" DEFAULT 'draft',
  	"translation_status_zh" "enum_services_translation_status_zh" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_services_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "services_locales" (
  	"title" varchar,
  	"summary" varchar,
  	"cta_title" varchar,
  	"cta_text" varchar,
  	"cta_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_services_v_blocks_paragraphs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_services_v_blocks_paragraphs_locales" (
  	"heading" varchar,
  	"lead" varchar,
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_services_v_blocks_cards_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"icon" "enum__services_v_blocks_cards_items_icon",
  	"href" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_services_v_blocks_cards_items_locales" (
  	"title" varchar,
  	"text" varchar,
  	"badge" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_services_v_blocks_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"columns" "enum__services_v_blocks_cards_columns" DEFAULT '3',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_services_v_blocks_cards_locales" (
  	"heading" varchar,
  	"lead" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_services_v_blocks_steps_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_services_v_blocks_steps_items_locales" (
  	"title" varchar,
  	"text" varchar,
  	"meta" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_services_v_blocks_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_services_v_blocks_steps_locales" (
  	"heading" varchar,
  	"lead" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_services_v_blocks_facts_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_services_v_blocks_facts_items_locales" (
  	"label" varchar,
  	"value" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_services_v_blocks_facts" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_services_v_blocks_facts_locales" (
  	"heading" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_services_v_blocks_faq_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_services_v_blocks_faq_items_locales" (
  	"q" varchar,
  	"a" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_services_v_blocks_faq" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_services_v_blocks_faq_locales" (
  	"heading" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_services_v_blocks_table_columns" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_services_v_blocks_table_columns_locales" (
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_services_v_blocks_table_rows_cells" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_services_v_blocks_table_rows_cells_locales" (
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_services_v_blocks_table_rows" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_services_v_blocks_table" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_services_v_blocks_table_locales" (
  	"heading" varchar,
  	"caption" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_services_v_blocks_notice" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"tone" "enum__services_v_blocks_notice_tone" DEFAULT 'info',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_services_v_blocks_notice_locales" (
  	"title" varchar,
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_services_v_blocks_links_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"href" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_services_v_blocks_links_items_locales" (
  	"label" varchar,
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_services_v_blocks_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_services_v_blocks_links_locales" (
  	"heading" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_services_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_slug" varchar,
  	"version_number" numeric,
  	"version_icon" "enum__services_v_version_icon",
  	"version_highlight" boolean,
  	"version_cta_href" varchar,
  	"version_translation_status_kk" "enum__services_v_version_translation_status_kk" DEFAULT 'approved',
  	"version_translation_status_ru" "enum__services_v_version_translation_status_ru" DEFAULT 'draft',
  	"version_translation_status_en" "enum__services_v_version_translation_status_en" DEFAULT 'draft',
  	"version_translation_status_zh" "enum__services_v_version_translation_status_zh" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__services_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__services_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "_services_v_locales" (
  	"version_title" varchar,
  	"version_summary" varchar,
  	"version_cta_title" varchar,
  	"version_cta_text" varchar,
  	"version_cta_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "projects_internal_stage_history" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"stage" varchar,
  	"at" timestamp(3) with time zone,
  	"by" varchar
  );
  
  CREATE TABLE "projects_internal_risks" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"type" "enum_projects_internal_risks_type",
  	"description" varchar,
  	"level" "enum_projects_internal_risks_level",
  	"mitigation" varchar,
  	"status" "enum_projects_internal_risks_status"
  );
  
  CREATE TABLE "projects_internal_pipeline_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"next_action" varchar,
  	"due_date" timestamp(3) with time zone,
  	"completed_at" timestamp(3) with time zone,
  	"responsible_id" integer
  );
  
  CREATE TABLE "projects" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar NOT NULL,
  	"sector" "enum_projects_sector" NOT NULL,
  	"region" "enum_projects_region" NOT NULL,
  	"amount_musd" numeric,
  	"model" "enum_projects_model" NOT NULL,
  	"level" "enum_projects_level" DEFAULT '1' NOT NULL,
  	"stage" "enum_projects_stage" DEFAULT '1',
  	"icon_key" "enum_projects_icon_key",
  	"image_id" integer,
  	"publish_to_catalog" boolean DEFAULT false,
  	"is_sample" boolean DEFAULT false,
  	"internal_owner_organization_id" integer,
  	"internal_owner_name" varchar,
  	"internal_responsible_manager_id" integer,
  	"internal_risk_level" "enum_projects_internal_risk_level",
  	"internal_purpose" varchar,
  	"internal_need" varchar,
  	"internal_documents_verified" boolean,
  	"internal_land_status_verified" boolean,
  	"internal_initial_risks_verified" boolean,
  	"internal_committee_decision" "enum_projects_internal_committee_decision" DEFAULT 'pending',
  	"internal_passport_ready" boolean,
  	"internal_feasibility_study_ready" boolean,
  	"internal_secretariat_checklist_approved" boolean,
  	"internal_interested_investor_count" numeric DEFAULT 0,
  	"internal_intent_protocol_signed" boolean,
  	"internal_term_sheet_signed" boolean,
  	"internal_contract_signed" boolean,
  	"internal_production_started" boolean,
  	"internal_amounts_declared" numeric,
  	"internal_amounts_loi" numeric,
  	"internal_amounts_contract" numeric,
  	"internal_amounts_received" numeric,
  	"internal_amounts_association_contribution" "enum_projects_internal_amounts_association_contribution",
  	"translation_status_kk" "enum_projects_translation_status_kk" DEFAULT 'approved',
  	"translation_status_ru" "enum_projects_translation_status_ru" DEFAULT 'draft',
  	"translation_status_en" "enum_projects_translation_status_en" DEFAULT 'draft',
  	"translation_status_zh" "enum_projects_translation_status_zh" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "projects_locales" (
  	"title" varchar NOT NULL,
  	"summary" varchar,
  	"sub_sector" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "projects_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"media_id" integer
  );
  
  CREATE TABLE "news" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar,
  	"category" "enum_news_category" DEFAULT 'strategy',
  	"published_at" timestamp(3) with time zone,
  	"image_id" integer,
  	"featured" boolean,
  	"is_sample" boolean DEFAULT false,
  	"translation_status_kk" "enum_news_translation_status_kk" DEFAULT 'approved',
  	"translation_status_ru" "enum_news_translation_status_ru" DEFAULT 'draft',
  	"translation_status_en" "enum_news_translation_status_en" DEFAULT 'draft',
  	"translation_status_zh" "enum_news_translation_status_zh" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_news_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "news_locales" (
  	"title" varchar,
  	"excerpt" varchar,
  	"body" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_news_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_slug" varchar,
  	"version_category" "enum__news_v_version_category" DEFAULT 'strategy',
  	"version_published_at" timestamp(3) with time zone,
  	"version_image_id" integer,
  	"version_featured" boolean,
  	"version_is_sample" boolean DEFAULT false,
  	"version_translation_status_kk" "enum__news_v_version_translation_status_kk" DEFAULT 'approved',
  	"version_translation_status_ru" "enum__news_v_version_translation_status_ru" DEFAULT 'draft',
  	"version_translation_status_en" "enum__news_v_version_translation_status_en" DEFAULT 'draft',
  	"version_translation_status_zh" "enum__news_v_version_translation_status_zh" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__news_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__news_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "_news_v_locales" (
  	"version_title" varchar,
  	"version_excerpt" varchar,
  	"version_body" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "events" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar,
  	"starts_at" timestamp(3) with time zone,
  	"ends_at" timestamp(3) with time zone,
  	"format" "enum_events_format" DEFAULT 'offline',
  	"registration_url" varchar,
  	"image_id" integer,
  	"is_sample" boolean DEFAULT false,
  	"translation_status_kk" "enum_events_translation_status_kk" DEFAULT 'approved',
  	"translation_status_ru" "enum_events_translation_status_ru" DEFAULT 'draft',
  	"translation_status_en" "enum_events_translation_status_en" DEFAULT 'draft',
  	"translation_status_zh" "enum_events_translation_status_zh" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_events_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "events_locales" (
  	"title" varchar,
  	"summary" varchar,
  	"location" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_events_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_slug" varchar,
  	"version_starts_at" timestamp(3) with time zone,
  	"version_ends_at" timestamp(3) with time zone,
  	"version_format" "enum__events_v_version_format" DEFAULT 'offline',
  	"version_registration_url" varchar,
  	"version_image_id" integer,
  	"version_is_sample" boolean DEFAULT false,
  	"version_translation_status_kk" "enum__events_v_version_translation_status_kk" DEFAULT 'approved',
  	"version_translation_status_ru" "enum__events_v_version_translation_status_ru" DEFAULT 'draft',
  	"version_translation_status_en" "enum__events_v_version_translation_status_en" DEFAULT 'draft',
  	"version_translation_status_zh" "enum__events_v_version_translation_status_zh" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__events_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__events_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "_events_v_locales" (
  	"version_title" varchar,
  	"version_summary" varchar,
  	"version_location" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "videos" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar,
  	"poster_id" integer,
  	"published_at" timestamp(3) with time zone,
  	"translation_status_kk" "enum_videos_translation_status_kk" DEFAULT 'approved',
  	"translation_status_ru" "enum_videos_translation_status_ru" DEFAULT 'draft',
  	"translation_status_en" "enum_videos_translation_status_en" DEFAULT 'draft',
  	"translation_status_zh" "enum_videos_translation_status_zh" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_videos_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "videos_locales" (
  	"title" varchar,
  	"summary" varchar,
  	"file_id" integer,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_videos_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_slug" varchar,
  	"version_poster_id" integer,
  	"version_published_at" timestamp(3) with time zone,
  	"version_translation_status_kk" "enum__videos_v_version_translation_status_kk" DEFAULT 'approved',
  	"version_translation_status_ru" "enum__videos_v_version_translation_status_ru" DEFAULT 'draft',
  	"version_translation_status_en" "enum__videos_v_version_translation_status_en" DEFAULT 'draft',
  	"version_translation_status_zh" "enum__videos_v_version_translation_status_zh" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__videos_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__videos_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "_videos_v_locales" (
  	"version_title" varchar,
  	"version_summary" varchar,
  	"version_file_id" integer,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "albums_photos" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer
  );
  
  CREATE TABLE "albums_photos_locales" (
  	"caption" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "albums" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar,
  	"cover_id" integer,
  	"published_at" timestamp(3) with time zone,
  	"translation_status_kk" "enum_albums_translation_status_kk" DEFAULT 'approved',
  	"translation_status_ru" "enum_albums_translation_status_ru" DEFAULT 'draft',
  	"translation_status_en" "enum_albums_translation_status_en" DEFAULT 'draft',
  	"translation_status_zh" "enum_albums_translation_status_zh" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_albums_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "albums_locales" (
  	"title" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_albums_v_version_photos" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_albums_v_version_photos_locales" (
  	"caption" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_albums_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_slug" varchar,
  	"version_cover_id" integer,
  	"version_published_at" timestamp(3) with time zone,
  	"version_translation_status_kk" "enum__albums_v_version_translation_status_kk" DEFAULT 'approved',
  	"version_translation_status_ru" "enum__albums_v_version_translation_status_ru" DEFAULT 'draft',
  	"version_translation_status_en" "enum__albums_v_version_translation_status_en" DEFAULT 'draft',
  	"version_translation_status_zh" "enum__albums_v_version_translation_status_zh" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__albums_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__albums_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "_albums_v_locales" (
  	"version_title" varchar,
  	"version_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "partners" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar,
  	"kind" "enum_partners_kind" DEFAULT 'international',
  	"country" varchar,
  	"url" varchar,
  	"logo_id" integer,
  	"show_logo" boolean DEFAULT false,
  	"permission_note" varchar,
  	"order" numeric DEFAULT 100,
  	"is_sample" boolean DEFAULT false,
  	"translation_status_kk" "enum_partners_translation_status_kk" DEFAULT 'approved',
  	"translation_status_ru" "enum_partners_translation_status_ru" DEFAULT 'draft',
  	"translation_status_en" "enum_partners_translation_status_en" DEFAULT 'draft',
  	"translation_status_zh" "enum_partners_translation_status_zh" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_partners_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "partners_locales" (
  	"name" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_partners_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_slug" varchar,
  	"version_kind" "enum__partners_v_version_kind" DEFAULT 'international',
  	"version_country" varchar,
  	"version_url" varchar,
  	"version_logo_id" integer,
  	"version_show_logo" boolean DEFAULT false,
  	"version_permission_note" varchar,
  	"version_order" numeric DEFAULT 100,
  	"version_is_sample" boolean DEFAULT false,
  	"version_translation_status_kk" "enum__partners_v_version_translation_status_kk" DEFAULT 'approved',
  	"version_translation_status_ru" "enum__partners_v_version_translation_status_ru" DEFAULT 'draft',
  	"version_translation_status_en" "enum__partners_v_version_translation_status_en" DEFAULT 'draft',
  	"version_translation_status_zh" "enum__partners_v_version_translation_status_zh" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__partners_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__partners_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "_partners_v_locales" (
  	"version_name" varchar,
  	"version_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar,
  	"category" "enum_documents_category" DEFAULT 'other',
  	"version" varchar,
  	"is_draft_method" boolean DEFAULT false,
  	"published_at" timestamp(3) with time zone,
  	"translation_status_kk" "enum_documents_translation_status_kk" DEFAULT 'approved',
  	"translation_status_ru" "enum_documents_translation_status_ru" DEFAULT 'draft',
  	"translation_status_en" "enum_documents_translation_status_en" DEFAULT 'draft',
  	"translation_status_zh" "enum_documents_translation_status_zh" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_documents_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "documents_locales" (
  	"title" varchar,
  	"summary" varchar,
  	"file_id" integer,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_documents_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_slug" varchar,
  	"version_category" "enum__documents_v_version_category" DEFAULT 'other',
  	"version_version" varchar,
  	"version_is_draft_method" boolean DEFAULT false,
  	"version_published_at" timestamp(3) with time zone,
  	"version_translation_status_kk" "enum__documents_v_version_translation_status_kk" DEFAULT 'approved',
  	"version_translation_status_ru" "enum__documents_v_version_translation_status_ru" DEFAULT 'draft',
  	"version_translation_status_en" "enum__documents_v_version_translation_status_en" DEFAULT 'draft',
  	"version_translation_status_zh" "enum__documents_v_version_translation_status_zh" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__documents_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__documents_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "_documents_v_locales" (
  	"version_title" varchar,
  	"version_summary" varchar,
  	"version_file_id" integer,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "submissions" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"reference" varchar NOT NULL,
  	"kind" "enum_submissions_kind" NOT NULL,
  	"status" "enum_submissions_status" DEFAULT 'new' NOT NULL,
  	"contact_name" varchar,
  	"email" varchar,
  	"locale" varchar,
  	"data" jsonb NOT NULL,
  	"consent_at" timestamp(3) with time zone NOT NULL,
  	"consent_version" varchar NOT NULL,
  	"consent_ip_hash" varchar,
  	"user_id" integer,
  	"notes" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "organizations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"country" varchar,
  	"registration_number" varchar,
  	"sector" "enum_organizations_sector",
  	"beneficiary" varchar,
  	"website" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "organizations_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "investors_sectors" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_investors_sectors",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "investors_regions" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_investors_regions",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "investors_models" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_investors_models",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "investors" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"display_name" varchar NOT NULL,
  	"organization_id" integer,
  	"user_id" integer,
  	"kind" "enum_investors_kind",
  	"direction" "enum_investors_direction",
  	"min_amount_musd" numeric,
  	"max_amount_musd" numeric,
  	"risk_appetite" "enum_investors_risk_appetite",
  	"status" "enum_investors_status" DEFAULT 'unassessed',
  	"grade" "enum_investors_grade",
  	"total_score" numeric,
  	"last_assessed_at" timestamp(3) with time zone,
  	"veto_active" boolean DEFAULT false,
  	"veto_reason" varchar,
  	"veto_set_by_id" integer,
  	"veto_set_at" timestamp(3) with time zone,
  	"sanctions_checked_at" timestamp(3) with time zone,
  	"responsible_manager_id" integer,
  	"notes" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "scorecards_entries" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"dimension" "enum_scorecards_entries_dimension" NOT NULL,
  	"points" numeric NOT NULL,
  	"evidence_text" varchar
  );
  
  CREATE TABLE "scorecards_assessments" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"evaluator_id" integer NOT NULL,
  	"role" "enum_scorecards_assessments_role" NOT NULL,
  	"comment" varchar
  );
  
  CREATE TABLE "scorecards" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"investor_id" integer NOT NULL,
  	"total" numeric,
  	"grade" varchar,
  	"complete" boolean DEFAULT false,
  	"finalized" boolean DEFAULT false,
  	"finalized_at" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "scorecards_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"media_id" integer
  );
  
  CREATE TABLE "coi_declarations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"person_id" integer NOT NULL,
  	"investor_id" integer,
  	"project_id" integer,
  	"organization_id" integer,
  	"description" varchar,
  	"declared_at" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "matches" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"project_id" integer NOT NULL,
  	"investor_id" integer NOT NULL,
  	"status" "enum_matches_status" DEFAULT 'proposed' NOT NULL,
  	"response" varchar,
  	"proposed_by_id" integer,
  	"proposed_at" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "ndas" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"project_id" integer NOT NULL,
  	"investor_id" integer NOT NULL,
  	"user_id" integer,
  	"template_version" varchar,
  	"method" "enum_ndas_method" DEFAULT 'otp-accept',
  	"signed_at" timestamp(3) with time zone NOT NULL,
  	"expires_at" timestamp(3) with time zone NOT NULL,
  	"ip" varchar,
  	"user_agent" varchar,
  	"revoked_at" timestamp(3) with time zone,
  	"revoke_reason" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "dataroom_files" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"project_id" integer NOT NULL,
  	"title" varchar NOT NULL,
  	"category" "enum_dataroom_files_category" DEFAULT 'other',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric
  );
  
  CREATE TABLE "dataroom_log" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"at" timestamp(3) with time zone NOT NULL,
  	"action" "enum_dataroom_log_action" NOT NULL,
  	"user_id" integer NOT NULL,
  	"project_id" integer NOT NULL,
  	"file_id" integer,
  	"ip" varchar,
  	"reason" varchar,
  	"message" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "agreements" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"type" "enum_agreements_type" DEFAULT 'memorandum' NOT NULL,
  	"partner_id" integer,
  	"parties" varchar,
  	"signed_at" timestamp(3) with time zone,
  	"valid_until" timestamp(3) with time zone,
  	"obligations" varchar,
  	"file_id" integer,
  	"publish_permission" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "members_fees" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"year" numeric,
  	"amount" numeric,
  	"paid_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "members" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"organization_id" integer NOT NULL,
  	"category" "enum_members_category" DEFAULT 'foreign-investors' NOT NULL,
  	"status" "enum_members_status" DEFAULT 'application' NOT NULL,
  	"member_since" timestamp(3) with time zone,
  	"valid_until" timestamp(3) with time zone,
  	"registry_consent" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "issues" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"organization_id" integer,
  	"type" "enum_issues_type" DEFAULT 'permit' NOT NULL,
  	"description" varchar NOT NULL,
  	"authority" varchar,
  	"status" "enum_issues_status" DEFAULT 'new' NOT NULL,
  	"response" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "audit_log" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"at" timestamp(3) with time zone NOT NULL,
  	"action" "enum_audit_log_action" NOT NULL,
  	"collection" varchar,
  	"doc_id" varchar,
  	"actor_collection" varchar,
  	"actor_id" varchar,
  	"actor_email" varchar,
  	"ip" varchar,
  	"changes" jsonb,
  	"note" varchar
  );
  
  CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"admins_id" integer,
  	"users_id" integer,
  	"media_id" integer,
  	"pages_id" integer,
  	"people_id" integer,
  	"services_id" integer,
  	"projects_id" integer,
  	"news_id" integer,
  	"events_id" integer,
  	"videos_id" integer,
  	"albums_id" integer,
  	"partners_id" integer,
  	"documents_id" integer,
  	"submissions_id" integer,
  	"organizations_id" integer,
  	"investors_id" integer,
  	"scorecards_id" integer,
  	"coi_declarations_id" integer,
  	"matches_id" integer,
  	"ndas_id" integer,
  	"dataroom_files_id" integer,
  	"dataroom_log_id" integer,
  	"agreements_id" integer,
  	"members_id" integer,
  	"issues_id" integer,
  	"audit_log_id" integer
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"admins_id" integer,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "home_hero_facts" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "home_hero_facts_locales" (
  	"title" varchar,
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "home_audience_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"href" varchar
  );
  
  CREATE TABLE "home_audience_cards_locales" (
  	"title" varchar,
  	"text" varchar,
  	"cta_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "home_results_cells" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "home_results_cells_locales" (
  	"label" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "home_lifecycle_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"done" boolean
  );
  
  CREATE TABLE "home_lifecycle_steps_locales" (
  	"title" varchar,
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "home_lifecycle_levels" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "home_lifecycle_levels_locales" (
  	"title" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "home_projects_chips" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "home_projects_chips_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "home_corridors_china_bullets" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "home_corridors_china_bullets_locales" (
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "home_membership_categories" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "home_membership_categories_locales" (
  	"title" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "home" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"translation_status_kk" "enum_home_translation_status_kk" DEFAULT 'approved',
  	"translation_status_ru" "enum_home_translation_status_ru" DEFAULT 'draft',
  	"translation_status_en" "enum_home_translation_status_en" DEFAULT 'draft',
  	"translation_status_zh" "enum_home_translation_status_zh" DEFAULT 'draft',
  	"hero_primary_cta_href" varchar,
  	"hero_secondary_cta_href" varchar,
  	"projects_show_example_badge" boolean DEFAULT true,
  	"corridors_china_zh_title" varchar,
  	"corridors_china_primary_cta_label" varchar,
  	"corridors_gulf_tag" varchar,
  	"corridors_global_tag" varchar,
  	"leadership_person_id" integer,
  	"media_show_example_badge" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "home_locales" (
  	"hero_eyebrow" varchar,
  	"hero_title" varchar,
  	"hero_subtitle" varchar,
  	"hero_primary_cta_label" varchar,
  	"hero_secondary_cta_label" varchar,
  	"results_eyebrow" varchar,
  	"results_title" varchar,
  	"results_lead" varchar,
  	"services_eyebrow" varchar,
  	"services_title" varchar,
  	"services_link_label" varchar,
  	"lifecycle_eyebrow" varchar,
  	"lifecycle_title" varchar,
  	"lifecycle_lead" varchar,
  	"lifecycle_levels_label" varchar,
  	"projects_eyebrow" varchar,
  	"projects_title" varchar,
  	"projects_link_label" varchar,
  	"corridors_eyebrow" varchar,
  	"corridors_title" varchar,
  	"corridors_china_eyebrow" varchar,
  	"corridors_china_title" varchar,
  	"corridors_china_text" varchar,
  	"corridors_china_secondary_cta_label" varchar,
  	"corridors_gulf_title" varchar,
  	"corridors_gulf_text" varchar,
  	"corridors_gulf_link_label" varchar,
  	"corridors_global_title" varchar,
  	"corridors_global_text" varchar,
  	"corridors_global_link_label" varchar,
  	"scoring_eyebrow" varchar,
  	"scoring_title" varchar,
  	"scoring_lead" varchar,
  	"scoring_veto_title" varchar,
  	"scoring_veto_text" varchar,
  	"leadership_quote" varchar,
  	"leadership_quote_source" varchar,
  	"leadership_person_link_label" varchar,
  	"media_eyebrow" varchar,
  	"media_title" varchar,
  	"media_link_label" varchar,
  	"media_video_label" varchar,
  	"media_photo_label" varchar,
  	"membership_eyebrow" varchar,
  	"membership_title" varchar,
  	"membership_text" varchar,
  	"membership_primary_cta_label" varchar,
  	"membership_secondary_cta_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_home_v_version_hero_facts" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_home_v_version_hero_facts_locales" (
  	"title" varchar,
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_home_v_version_audience_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"href" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_home_v_version_audience_cards_locales" (
  	"title" varchar,
  	"text" varchar,
  	"cta_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_home_v_version_results_cells" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_home_v_version_results_cells_locales" (
  	"label" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_home_v_version_lifecycle_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"done" boolean,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_home_v_version_lifecycle_steps_locales" (
  	"title" varchar,
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_home_v_version_lifecycle_levels" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_home_v_version_lifecycle_levels_locales" (
  	"title" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_home_v_version_projects_chips" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_home_v_version_projects_chips_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_home_v_version_corridors_china_bullets" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_home_v_version_corridors_china_bullets_locales" (
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_home_v_version_membership_categories" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_home_v_version_membership_categories_locales" (
  	"title" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_home_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_translation_status_kk" "enum__home_v_version_translation_status_kk" DEFAULT 'approved',
  	"version_translation_status_ru" "enum__home_v_version_translation_status_ru" DEFAULT 'draft',
  	"version_translation_status_en" "enum__home_v_version_translation_status_en" DEFAULT 'draft',
  	"version_translation_status_zh" "enum__home_v_version_translation_status_zh" DEFAULT 'draft',
  	"version_hero_primary_cta_href" varchar,
  	"version_hero_secondary_cta_href" varchar,
  	"version_projects_show_example_badge" boolean DEFAULT true,
  	"version_corridors_china_zh_title" varchar,
  	"version_corridors_china_primary_cta_label" varchar,
  	"version_corridors_gulf_tag" varchar,
  	"version_corridors_global_tag" varchar,
  	"version_leadership_person_id" integer,
  	"version_media_show_example_badge" boolean DEFAULT true,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "_home_v_locales" (
  	"version_hero_eyebrow" varchar,
  	"version_hero_title" varchar,
  	"version_hero_subtitle" varchar,
  	"version_hero_primary_cta_label" varchar,
  	"version_hero_secondary_cta_label" varchar,
  	"version_results_eyebrow" varchar,
  	"version_results_title" varchar,
  	"version_results_lead" varchar,
  	"version_services_eyebrow" varchar,
  	"version_services_title" varchar,
  	"version_services_link_label" varchar,
  	"version_lifecycle_eyebrow" varchar,
  	"version_lifecycle_title" varchar,
  	"version_lifecycle_lead" varchar,
  	"version_lifecycle_levels_label" varchar,
  	"version_projects_eyebrow" varchar,
  	"version_projects_title" varchar,
  	"version_projects_link_label" varchar,
  	"version_corridors_eyebrow" varchar,
  	"version_corridors_title" varchar,
  	"version_corridors_china_eyebrow" varchar,
  	"version_corridors_china_title" varchar,
  	"version_corridors_china_text" varchar,
  	"version_corridors_china_secondary_cta_label" varchar,
  	"version_corridors_gulf_title" varchar,
  	"version_corridors_gulf_text" varchar,
  	"version_corridors_gulf_link_label" varchar,
  	"version_corridors_global_title" varchar,
  	"version_corridors_global_text" varchar,
  	"version_corridors_global_link_label" varchar,
  	"version_scoring_eyebrow" varchar,
  	"version_scoring_title" varchar,
  	"version_scoring_lead" varchar,
  	"version_scoring_veto_title" varchar,
  	"version_scoring_veto_text" varchar,
  	"version_leadership_quote" varchar,
  	"version_leadership_quote_source" varchar,
  	"version_leadership_person_link_label" varchar,
  	"version_media_eyebrow" varchar,
  	"version_media_title" varchar,
  	"version_media_link_label" varchar,
  	"version_media_video_label" varchar,
  	"version_media_photo_label" varchar,
  	"version_membership_eyebrow" varchar,
  	"version_membership_title" varchar,
  	"version_membership_text" varchar,
  	"version_membership_primary_cta_label" varchar,
  	"version_membership_secondary_cta_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"bin" varchar NOT NULL,
  	"registered_on" varchar,
  	"phone" varchar NOT NULL,
  	"wechat_id" varchar,
  	"wechat_qr_id" integer,
  	"email" varchar,
  	"policy_translation_policy" "enum_settings_policy_translation_policy" DEFAULT 'allow-draft' NOT NULL,
  	"policy_show_example_badges" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "settings_locales" (
  	"legal_name" varchar NOT NULL,
  	"brand_name" varchar NOT NULL,
  	"brand_subtitle" varchar,
  	"tagline" varchar,
  	"cities_line" varchar,
  	"legal_address" varchar,
  	"office_address" varchar,
  	"working_hours" varchar,
  	"disclaimer" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "kpi_targets" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"is_target" boolean DEFAULT true,
  	"database_count" numeric NOT NULL,
  	"screened_count" numeric NOT NULL,
  	"reviewed_count" numeric NOT NULL,
  	"confirmed_count" numeric NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "kpi_targets_locales" (
  	"period_note" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "scoring_config_dimensions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"key" "enum_scoring_config_dimensions_key" NOT NULL,
  	"weight" numeric NOT NULL
  );
  
  CREATE TABLE "scoring_config_dimensions_locales" (
  	"label" varchar NOT NULL,
  	"short_label" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "scoring_config_grades" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"key" "enum_scoring_config_grades_key" NOT NULL,
  	"min" numeric NOT NULL,
  	"max" numeric NOT NULL
  );
  
  CREATE TABLE "scoring_config_grades_locales" (
  	"range_label" varchar,
  	"title" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "scoring_config" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"methodology_approved" boolean DEFAULT false,
  	"methodology_version" varchar DEFAULT '0.1',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "_scoring_config_v_version_dimensions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" "enum__scoring_config_v_version_dimensions_key" NOT NULL,
  	"weight" numeric NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_scoring_config_v_version_dimensions_locales" (
  	"label" varchar NOT NULL,
  	"short_label" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_scoring_config_v_version_grades" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" "enum__scoring_config_v_version_grades_key" NOT NULL,
  	"min" numeric NOT NULL,
  	"max" numeric NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_scoring_config_v_version_grades_locales" (
  	"range_label" varchar,
  	"title" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_scoring_config_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_methodology_approved" boolean DEFAULT false,
  	"version_methodology_version" varchar DEFAULT '0.1',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "admins_roles" ADD CONSTRAINT "admins_roles_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."admins"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "admins_login_history" ADD CONSTRAINT "admins_login_history_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."admins"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "admins_sessions" ADD CONSTRAINT "admins_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."admins"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "users_roles" ADD CONSTRAINT "users_roles_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "users_login_history" ADD CONSTRAINT "users_login_history_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "media_locales" ADD CONSTRAINT "media_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_paragraphs" ADD CONSTRAINT "pages_blocks_paragraphs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_paragraphs_locales" ADD CONSTRAINT "pages_blocks_paragraphs_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_paragraphs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_cards_items" ADD CONSTRAINT "pages_blocks_cards_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_cards"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_cards_items_locales" ADD CONSTRAINT "pages_blocks_cards_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_cards_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_cards" ADD CONSTRAINT "pages_blocks_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_cards_locales" ADD CONSTRAINT "pages_blocks_cards_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_cards"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_steps_items" ADD CONSTRAINT "pages_blocks_steps_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_steps"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_steps_items_locales" ADD CONSTRAINT "pages_blocks_steps_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_steps_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_steps" ADD CONSTRAINT "pages_blocks_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_steps_locales" ADD CONSTRAINT "pages_blocks_steps_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_steps"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_facts_items" ADD CONSTRAINT "pages_blocks_facts_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_facts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_facts_items_locales" ADD CONSTRAINT "pages_blocks_facts_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_facts_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_facts" ADD CONSTRAINT "pages_blocks_facts_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_facts_locales" ADD CONSTRAINT "pages_blocks_facts_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_facts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_faq_items" ADD CONSTRAINT "pages_blocks_faq_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_faq"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_faq_items_locales" ADD CONSTRAINT "pages_blocks_faq_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_faq_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_faq" ADD CONSTRAINT "pages_blocks_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_faq_locales" ADD CONSTRAINT "pages_blocks_faq_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_faq"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_table_columns" ADD CONSTRAINT "pages_blocks_table_columns_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_table"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_table_columns_locales" ADD CONSTRAINT "pages_blocks_table_columns_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_table_columns"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_table_rows_cells" ADD CONSTRAINT "pages_blocks_table_rows_cells_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_table_rows"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_table_rows_cells_locales" ADD CONSTRAINT "pages_blocks_table_rows_cells_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_table_rows_cells"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_table_rows" ADD CONSTRAINT "pages_blocks_table_rows_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_table"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_table" ADD CONSTRAINT "pages_blocks_table_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_table_locales" ADD CONSTRAINT "pages_blocks_table_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_table"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_notice" ADD CONSTRAINT "pages_blocks_notice_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_notice_locales" ADD CONSTRAINT "pages_blocks_notice_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_notice"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_links_items" ADD CONSTRAINT "pages_blocks_links_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_links"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_links_items_locales" ADD CONSTRAINT "pages_blocks_links_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_links_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_links" ADD CONSTRAINT "pages_blocks_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_links_locales" ADD CONSTRAINT "pages_blocks_links_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_links"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_locales" ADD CONSTRAINT "pages_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_paragraphs" ADD CONSTRAINT "_pages_v_blocks_paragraphs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_paragraphs_locales" ADD CONSTRAINT "_pages_v_blocks_paragraphs_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_paragraphs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_cards_items" ADD CONSTRAINT "_pages_v_blocks_cards_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_cards"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_cards_items_locales" ADD CONSTRAINT "_pages_v_blocks_cards_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_cards_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_cards" ADD CONSTRAINT "_pages_v_blocks_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_cards_locales" ADD CONSTRAINT "_pages_v_blocks_cards_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_cards"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_steps_items" ADD CONSTRAINT "_pages_v_blocks_steps_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_steps"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_steps_items_locales" ADD CONSTRAINT "_pages_v_blocks_steps_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_steps_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_steps" ADD CONSTRAINT "_pages_v_blocks_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_steps_locales" ADD CONSTRAINT "_pages_v_blocks_steps_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_steps"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_facts_items" ADD CONSTRAINT "_pages_v_blocks_facts_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_facts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_facts_items_locales" ADD CONSTRAINT "_pages_v_blocks_facts_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_facts_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_facts" ADD CONSTRAINT "_pages_v_blocks_facts_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_facts_locales" ADD CONSTRAINT "_pages_v_blocks_facts_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_facts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_faq_items" ADD CONSTRAINT "_pages_v_blocks_faq_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_faq"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_faq_items_locales" ADD CONSTRAINT "_pages_v_blocks_faq_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_faq_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_faq" ADD CONSTRAINT "_pages_v_blocks_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_faq_locales" ADD CONSTRAINT "_pages_v_blocks_faq_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_faq"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_table_columns" ADD CONSTRAINT "_pages_v_blocks_table_columns_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_table"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_table_columns_locales" ADD CONSTRAINT "_pages_v_blocks_table_columns_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_table_columns"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_table_rows_cells" ADD CONSTRAINT "_pages_v_blocks_table_rows_cells_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_table_rows"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_table_rows_cells_locales" ADD CONSTRAINT "_pages_v_blocks_table_rows_cells_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_table_rows_cells"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_table_rows" ADD CONSTRAINT "_pages_v_blocks_table_rows_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_table"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_table" ADD CONSTRAINT "_pages_v_blocks_table_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_table_locales" ADD CONSTRAINT "_pages_v_blocks_table_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_table"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_notice" ADD CONSTRAINT "_pages_v_blocks_notice_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_notice_locales" ADD CONSTRAINT "_pages_v_blocks_notice_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_notice"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_links_items" ADD CONSTRAINT "_pages_v_blocks_links_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_links"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_links_items_locales" ADD CONSTRAINT "_pages_v_blocks_links_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_links_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_links" ADD CONSTRAINT "_pages_v_blocks_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_links_locales" ADD CONSTRAINT "_pages_v_blocks_links_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_links"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_parent_id_pages_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_locales" ADD CONSTRAINT "_pages_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "people" ADD CONSTRAINT "people_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "people" ADD CONSTRAINT "people_photo_consent_file_id_media_id_fk" FOREIGN KEY ("photo_consent_file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "people_locales" ADD CONSTRAINT "people_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."people"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_people_v" ADD CONSTRAINT "_people_v_parent_id_people_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."people"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_people_v" ADD CONSTRAINT "_people_v_version_photo_id_media_id_fk" FOREIGN KEY ("version_photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_people_v" ADD CONSTRAINT "_people_v_version_photo_consent_file_id_media_id_fk" FOREIGN KEY ("version_photo_consent_file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_people_v_locales" ADD CONSTRAINT "_people_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_people_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_blocks_paragraphs" ADD CONSTRAINT "services_blocks_paragraphs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_blocks_paragraphs_locales" ADD CONSTRAINT "services_blocks_paragraphs_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services_blocks_paragraphs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_blocks_cards_items" ADD CONSTRAINT "services_blocks_cards_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services_blocks_cards"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_blocks_cards_items_locales" ADD CONSTRAINT "services_blocks_cards_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services_blocks_cards_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_blocks_cards" ADD CONSTRAINT "services_blocks_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_blocks_cards_locales" ADD CONSTRAINT "services_blocks_cards_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services_blocks_cards"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_blocks_steps_items" ADD CONSTRAINT "services_blocks_steps_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services_blocks_steps"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_blocks_steps_items_locales" ADD CONSTRAINT "services_blocks_steps_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services_blocks_steps_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_blocks_steps" ADD CONSTRAINT "services_blocks_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_blocks_steps_locales" ADD CONSTRAINT "services_blocks_steps_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services_blocks_steps"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_blocks_facts_items" ADD CONSTRAINT "services_blocks_facts_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services_blocks_facts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_blocks_facts_items_locales" ADD CONSTRAINT "services_blocks_facts_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services_blocks_facts_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_blocks_facts" ADD CONSTRAINT "services_blocks_facts_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_blocks_facts_locales" ADD CONSTRAINT "services_blocks_facts_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services_blocks_facts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_blocks_faq_items" ADD CONSTRAINT "services_blocks_faq_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services_blocks_faq"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_blocks_faq_items_locales" ADD CONSTRAINT "services_blocks_faq_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services_blocks_faq_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_blocks_faq" ADD CONSTRAINT "services_blocks_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_blocks_faq_locales" ADD CONSTRAINT "services_blocks_faq_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services_blocks_faq"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_blocks_table_columns" ADD CONSTRAINT "services_blocks_table_columns_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services_blocks_table"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_blocks_table_columns_locales" ADD CONSTRAINT "services_blocks_table_columns_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services_blocks_table_columns"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_blocks_table_rows_cells" ADD CONSTRAINT "services_blocks_table_rows_cells_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services_blocks_table_rows"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_blocks_table_rows_cells_locales" ADD CONSTRAINT "services_blocks_table_rows_cells_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services_blocks_table_rows_cells"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_blocks_table_rows" ADD CONSTRAINT "services_blocks_table_rows_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services_blocks_table"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_blocks_table" ADD CONSTRAINT "services_blocks_table_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_blocks_table_locales" ADD CONSTRAINT "services_blocks_table_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services_blocks_table"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_blocks_notice" ADD CONSTRAINT "services_blocks_notice_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_blocks_notice_locales" ADD CONSTRAINT "services_blocks_notice_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services_blocks_notice"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_blocks_links_items" ADD CONSTRAINT "services_blocks_links_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services_blocks_links"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_blocks_links_items_locales" ADD CONSTRAINT "services_blocks_links_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services_blocks_links_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_blocks_links" ADD CONSTRAINT "services_blocks_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_blocks_links_locales" ADD CONSTRAINT "services_blocks_links_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services_blocks_links"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_locales" ADD CONSTRAINT "services_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_services_v_blocks_paragraphs" ADD CONSTRAINT "_services_v_blocks_paragraphs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_services_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_services_v_blocks_paragraphs_locales" ADD CONSTRAINT "_services_v_blocks_paragraphs_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_services_v_blocks_paragraphs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_services_v_blocks_cards_items" ADD CONSTRAINT "_services_v_blocks_cards_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_services_v_blocks_cards"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_services_v_blocks_cards_items_locales" ADD CONSTRAINT "_services_v_blocks_cards_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_services_v_blocks_cards_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_services_v_blocks_cards" ADD CONSTRAINT "_services_v_blocks_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_services_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_services_v_blocks_cards_locales" ADD CONSTRAINT "_services_v_blocks_cards_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_services_v_blocks_cards"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_services_v_blocks_steps_items" ADD CONSTRAINT "_services_v_blocks_steps_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_services_v_blocks_steps"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_services_v_blocks_steps_items_locales" ADD CONSTRAINT "_services_v_blocks_steps_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_services_v_blocks_steps_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_services_v_blocks_steps" ADD CONSTRAINT "_services_v_blocks_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_services_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_services_v_blocks_steps_locales" ADD CONSTRAINT "_services_v_blocks_steps_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_services_v_blocks_steps"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_services_v_blocks_facts_items" ADD CONSTRAINT "_services_v_blocks_facts_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_services_v_blocks_facts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_services_v_blocks_facts_items_locales" ADD CONSTRAINT "_services_v_blocks_facts_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_services_v_blocks_facts_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_services_v_blocks_facts" ADD CONSTRAINT "_services_v_blocks_facts_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_services_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_services_v_blocks_facts_locales" ADD CONSTRAINT "_services_v_blocks_facts_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_services_v_blocks_facts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_services_v_blocks_faq_items" ADD CONSTRAINT "_services_v_blocks_faq_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_services_v_blocks_faq"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_services_v_blocks_faq_items_locales" ADD CONSTRAINT "_services_v_blocks_faq_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_services_v_blocks_faq_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_services_v_blocks_faq" ADD CONSTRAINT "_services_v_blocks_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_services_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_services_v_blocks_faq_locales" ADD CONSTRAINT "_services_v_blocks_faq_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_services_v_blocks_faq"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_services_v_blocks_table_columns" ADD CONSTRAINT "_services_v_blocks_table_columns_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_services_v_blocks_table"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_services_v_blocks_table_columns_locales" ADD CONSTRAINT "_services_v_blocks_table_columns_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_services_v_blocks_table_columns"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_services_v_blocks_table_rows_cells" ADD CONSTRAINT "_services_v_blocks_table_rows_cells_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_services_v_blocks_table_rows"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_services_v_blocks_table_rows_cells_locales" ADD CONSTRAINT "_services_v_blocks_table_rows_cells_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_services_v_blocks_table_rows_cells"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_services_v_blocks_table_rows" ADD CONSTRAINT "_services_v_blocks_table_rows_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_services_v_blocks_table"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_services_v_blocks_table" ADD CONSTRAINT "_services_v_blocks_table_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_services_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_services_v_blocks_table_locales" ADD CONSTRAINT "_services_v_blocks_table_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_services_v_blocks_table"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_services_v_blocks_notice" ADD CONSTRAINT "_services_v_blocks_notice_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_services_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_services_v_blocks_notice_locales" ADD CONSTRAINT "_services_v_blocks_notice_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_services_v_blocks_notice"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_services_v_blocks_links_items" ADD CONSTRAINT "_services_v_blocks_links_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_services_v_blocks_links"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_services_v_blocks_links_items_locales" ADD CONSTRAINT "_services_v_blocks_links_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_services_v_blocks_links_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_services_v_blocks_links" ADD CONSTRAINT "_services_v_blocks_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_services_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_services_v_blocks_links_locales" ADD CONSTRAINT "_services_v_blocks_links_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_services_v_blocks_links"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_services_v" ADD CONSTRAINT "_services_v_parent_id_services_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."services"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_services_v_locales" ADD CONSTRAINT "_services_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_services_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_internal_stage_history" ADD CONSTRAINT "projects_internal_stage_history_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_internal_risks" ADD CONSTRAINT "projects_internal_risks_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_internal_pipeline_steps" ADD CONSTRAINT "projects_internal_pipeline_steps_responsible_id_admins_id_fk" FOREIGN KEY ("responsible_id") REFERENCES "public"."admins"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "projects_internal_pipeline_steps" ADD CONSTRAINT "projects_internal_pipeline_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects" ADD CONSTRAINT "projects_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "projects" ADD CONSTRAINT "projects_internal_owner_organization_id_organizations_id_fk" FOREIGN KEY ("internal_owner_organization_id") REFERENCES "public"."organizations"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "projects" ADD CONSTRAINT "projects_internal_responsible_manager_id_admins_id_fk" FOREIGN KEY ("internal_responsible_manager_id") REFERENCES "public"."admins"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "projects_locales" ADD CONSTRAINT "projects_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_rels" ADD CONSTRAINT "projects_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_rels" ADD CONSTRAINT "projects_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "news" ADD CONSTRAINT "news_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "news_locales" ADD CONSTRAINT "news_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."news"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_news_v" ADD CONSTRAINT "_news_v_parent_id_news_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."news"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_news_v" ADD CONSTRAINT "_news_v_version_image_id_media_id_fk" FOREIGN KEY ("version_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_news_v_locales" ADD CONSTRAINT "_news_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_news_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "events" ADD CONSTRAINT "events_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "events_locales" ADD CONSTRAINT "events_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_events_v" ADD CONSTRAINT "_events_v_parent_id_events_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."events"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_events_v" ADD CONSTRAINT "_events_v_version_image_id_media_id_fk" FOREIGN KEY ("version_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_events_v_locales" ADD CONSTRAINT "_events_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_events_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "videos" ADD CONSTRAINT "videos_poster_id_media_id_fk" FOREIGN KEY ("poster_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "videos_locales" ADD CONSTRAINT "videos_locales_file_id_media_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "videos_locales" ADD CONSTRAINT "videos_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."videos"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_videos_v" ADD CONSTRAINT "_videos_v_parent_id_videos_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."videos"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_videos_v" ADD CONSTRAINT "_videos_v_version_poster_id_media_id_fk" FOREIGN KEY ("version_poster_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_videos_v_locales" ADD CONSTRAINT "_videos_v_locales_version_file_id_media_id_fk" FOREIGN KEY ("version_file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_videos_v_locales" ADD CONSTRAINT "_videos_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_videos_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "albums_photos" ADD CONSTRAINT "albums_photos_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "albums_photos" ADD CONSTRAINT "albums_photos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."albums"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "albums_photos_locales" ADD CONSTRAINT "albums_photos_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."albums_photos"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "albums" ADD CONSTRAINT "albums_cover_id_media_id_fk" FOREIGN KEY ("cover_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "albums_locales" ADD CONSTRAINT "albums_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."albums"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_albums_v_version_photos" ADD CONSTRAINT "_albums_v_version_photos_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_albums_v_version_photos" ADD CONSTRAINT "_albums_v_version_photos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_albums_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_albums_v_version_photos_locales" ADD CONSTRAINT "_albums_v_version_photos_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_albums_v_version_photos"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_albums_v" ADD CONSTRAINT "_albums_v_parent_id_albums_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."albums"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_albums_v" ADD CONSTRAINT "_albums_v_version_cover_id_media_id_fk" FOREIGN KEY ("version_cover_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_albums_v_locales" ADD CONSTRAINT "_albums_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_albums_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "partners" ADD CONSTRAINT "partners_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "partners_locales" ADD CONSTRAINT "partners_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."partners"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_partners_v" ADD CONSTRAINT "_partners_v_parent_id_partners_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."partners"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_partners_v" ADD CONSTRAINT "_partners_v_version_logo_id_media_id_fk" FOREIGN KEY ("version_logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_partners_v_locales" ADD CONSTRAINT "_partners_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_partners_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "documents_locales" ADD CONSTRAINT "documents_locales_file_id_media_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "documents_locales" ADD CONSTRAINT "documents_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_documents_v" ADD CONSTRAINT "_documents_v_parent_id_documents_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."documents"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_documents_v_locales" ADD CONSTRAINT "_documents_v_locales_version_file_id_media_id_fk" FOREIGN KEY ("version_file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_documents_v_locales" ADD CONSTRAINT "_documents_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_documents_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "submissions" ADD CONSTRAINT "submissions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "organizations_rels" ADD CONSTRAINT "organizations_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "organizations_rels" ADD CONSTRAINT "organizations_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "investors_sectors" ADD CONSTRAINT "investors_sectors_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."investors"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "investors_regions" ADD CONSTRAINT "investors_regions_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."investors"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "investors_models" ADD CONSTRAINT "investors_models_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."investors"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "investors" ADD CONSTRAINT "investors_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "investors" ADD CONSTRAINT "investors_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "investors" ADD CONSTRAINT "investors_veto_set_by_id_admins_id_fk" FOREIGN KEY ("veto_set_by_id") REFERENCES "public"."admins"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "investors" ADD CONSTRAINT "investors_responsible_manager_id_admins_id_fk" FOREIGN KEY ("responsible_manager_id") REFERENCES "public"."admins"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "scorecards_entries" ADD CONSTRAINT "scorecards_entries_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."scorecards"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "scorecards_assessments" ADD CONSTRAINT "scorecards_assessments_evaluator_id_admins_id_fk" FOREIGN KEY ("evaluator_id") REFERENCES "public"."admins"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "scorecards_assessments" ADD CONSTRAINT "scorecards_assessments_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."scorecards"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "scorecards" ADD CONSTRAINT "scorecards_investor_id_investors_id_fk" FOREIGN KEY ("investor_id") REFERENCES "public"."investors"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "scorecards_rels" ADD CONSTRAINT "scorecards_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."scorecards"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "scorecards_rels" ADD CONSTRAINT "scorecards_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "coi_declarations" ADD CONSTRAINT "coi_declarations_person_id_admins_id_fk" FOREIGN KEY ("person_id") REFERENCES "public"."admins"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "coi_declarations" ADD CONSTRAINT "coi_declarations_investor_id_investors_id_fk" FOREIGN KEY ("investor_id") REFERENCES "public"."investors"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "coi_declarations" ADD CONSTRAINT "coi_declarations_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "coi_declarations" ADD CONSTRAINT "coi_declarations_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "matches" ADD CONSTRAINT "matches_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "matches" ADD CONSTRAINT "matches_investor_id_investors_id_fk" FOREIGN KEY ("investor_id") REFERENCES "public"."investors"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "matches" ADD CONSTRAINT "matches_proposed_by_id_admins_id_fk" FOREIGN KEY ("proposed_by_id") REFERENCES "public"."admins"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "ndas" ADD CONSTRAINT "ndas_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "ndas" ADD CONSTRAINT "ndas_investor_id_investors_id_fk" FOREIGN KEY ("investor_id") REFERENCES "public"."investors"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "ndas" ADD CONSTRAINT "ndas_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "dataroom_files" ADD CONSTRAINT "dataroom_files_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "dataroom_log" ADD CONSTRAINT "dataroom_log_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "dataroom_log" ADD CONSTRAINT "dataroom_log_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "dataroom_log" ADD CONSTRAINT "dataroom_log_file_id_dataroom_files_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."dataroom_files"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "agreements" ADD CONSTRAINT "agreements_partner_id_partners_id_fk" FOREIGN KEY ("partner_id") REFERENCES "public"."partners"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "agreements" ADD CONSTRAINT "agreements_file_id_media_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "members_fees" ADD CONSTRAINT "members_fees_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."members"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "members" ADD CONSTRAINT "members_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "issues" ADD CONSTRAINT "issues_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_admins_fk" FOREIGN KEY ("admins_id") REFERENCES "public"."admins"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_people_fk" FOREIGN KEY ("people_id") REFERENCES "public"."people"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_services_fk" FOREIGN KEY ("services_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_projects_fk" FOREIGN KEY ("projects_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_news_fk" FOREIGN KEY ("news_id") REFERENCES "public"."news"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_events_fk" FOREIGN KEY ("events_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_videos_fk" FOREIGN KEY ("videos_id") REFERENCES "public"."videos"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_albums_fk" FOREIGN KEY ("albums_id") REFERENCES "public"."albums"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_partners_fk" FOREIGN KEY ("partners_id") REFERENCES "public"."partners"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_documents_fk" FOREIGN KEY ("documents_id") REFERENCES "public"."documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_submissions_fk" FOREIGN KEY ("submissions_id") REFERENCES "public"."submissions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_organizations_fk" FOREIGN KEY ("organizations_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_investors_fk" FOREIGN KEY ("investors_id") REFERENCES "public"."investors"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_scorecards_fk" FOREIGN KEY ("scorecards_id") REFERENCES "public"."scorecards"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_coi_declarations_fk" FOREIGN KEY ("coi_declarations_id") REFERENCES "public"."coi_declarations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_matches_fk" FOREIGN KEY ("matches_id") REFERENCES "public"."matches"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_ndas_fk" FOREIGN KEY ("ndas_id") REFERENCES "public"."ndas"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_dataroom_files_fk" FOREIGN KEY ("dataroom_files_id") REFERENCES "public"."dataroom_files"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_dataroom_log_fk" FOREIGN KEY ("dataroom_log_id") REFERENCES "public"."dataroom_log"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_agreements_fk" FOREIGN KEY ("agreements_id") REFERENCES "public"."agreements"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_members_fk" FOREIGN KEY ("members_id") REFERENCES "public"."members"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_issues_fk" FOREIGN KEY ("issues_id") REFERENCES "public"."issues"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_audit_log_fk" FOREIGN KEY ("audit_log_id") REFERENCES "public"."audit_log"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_admins_fk" FOREIGN KEY ("admins_id") REFERENCES "public"."admins"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_hero_facts" ADD CONSTRAINT "home_hero_facts_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_hero_facts_locales" ADD CONSTRAINT "home_hero_facts_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_hero_facts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_audience_cards" ADD CONSTRAINT "home_audience_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_audience_cards_locales" ADD CONSTRAINT "home_audience_cards_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_audience_cards"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_results_cells" ADD CONSTRAINT "home_results_cells_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_results_cells_locales" ADD CONSTRAINT "home_results_cells_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_results_cells"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_lifecycle_steps" ADD CONSTRAINT "home_lifecycle_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_lifecycle_steps_locales" ADD CONSTRAINT "home_lifecycle_steps_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_lifecycle_steps"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_lifecycle_levels" ADD CONSTRAINT "home_lifecycle_levels_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_lifecycle_levels_locales" ADD CONSTRAINT "home_lifecycle_levels_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_lifecycle_levels"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_projects_chips" ADD CONSTRAINT "home_projects_chips_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_projects_chips_locales" ADD CONSTRAINT "home_projects_chips_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_projects_chips"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_corridors_china_bullets" ADD CONSTRAINT "home_corridors_china_bullets_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_corridors_china_bullets_locales" ADD CONSTRAINT "home_corridors_china_bullets_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_corridors_china_bullets"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_membership_categories" ADD CONSTRAINT "home_membership_categories_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_membership_categories_locales" ADD CONSTRAINT "home_membership_categories_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_membership_categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home" ADD CONSTRAINT "home_leadership_person_id_people_id_fk" FOREIGN KEY ("leadership_person_id") REFERENCES "public"."people"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home_locales" ADD CONSTRAINT "home_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_v_version_hero_facts" ADD CONSTRAINT "_home_v_version_hero_facts_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_v_version_hero_facts_locales" ADD CONSTRAINT "_home_v_version_hero_facts_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_v_version_hero_facts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_v_version_audience_cards" ADD CONSTRAINT "_home_v_version_audience_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_v_version_audience_cards_locales" ADD CONSTRAINT "_home_v_version_audience_cards_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_v_version_audience_cards"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_v_version_results_cells" ADD CONSTRAINT "_home_v_version_results_cells_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_v_version_results_cells_locales" ADD CONSTRAINT "_home_v_version_results_cells_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_v_version_results_cells"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_v_version_lifecycle_steps" ADD CONSTRAINT "_home_v_version_lifecycle_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_v_version_lifecycle_steps_locales" ADD CONSTRAINT "_home_v_version_lifecycle_steps_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_v_version_lifecycle_steps"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_v_version_lifecycle_levels" ADD CONSTRAINT "_home_v_version_lifecycle_levels_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_v_version_lifecycle_levels_locales" ADD CONSTRAINT "_home_v_version_lifecycle_levels_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_v_version_lifecycle_levels"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_v_version_projects_chips" ADD CONSTRAINT "_home_v_version_projects_chips_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_v_version_projects_chips_locales" ADD CONSTRAINT "_home_v_version_projects_chips_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_v_version_projects_chips"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_v_version_corridors_china_bullets" ADD CONSTRAINT "_home_v_version_corridors_china_bullets_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_v_version_corridors_china_bullets_locales" ADD CONSTRAINT "_home_v_version_corridors_china_bullets_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_v_version_corridors_china_bullets"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_v_version_membership_categories" ADD CONSTRAINT "_home_v_version_membership_categories_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_v_version_membership_categories_locales" ADD CONSTRAINT "_home_v_version_membership_categories_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_v_version_membership_categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_v" ADD CONSTRAINT "_home_v_version_leadership_person_id_people_id_fk" FOREIGN KEY ("version_leadership_person_id") REFERENCES "public"."people"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_home_v_locales" ADD CONSTRAINT "_home_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "settings" ADD CONSTRAINT "settings_wechat_qr_id_media_id_fk" FOREIGN KEY ("wechat_qr_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "settings_locales" ADD CONSTRAINT "settings_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "kpi_targets_locales" ADD CONSTRAINT "kpi_targets_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."kpi_targets"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "scoring_config_dimensions" ADD CONSTRAINT "scoring_config_dimensions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."scoring_config"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "scoring_config_dimensions_locales" ADD CONSTRAINT "scoring_config_dimensions_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."scoring_config_dimensions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "scoring_config_grades" ADD CONSTRAINT "scoring_config_grades_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."scoring_config"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "scoring_config_grades_locales" ADD CONSTRAINT "scoring_config_grades_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."scoring_config_grades"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_scoring_config_v_version_dimensions" ADD CONSTRAINT "_scoring_config_v_version_dimensions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_scoring_config_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_scoring_config_v_version_dimensions_locales" ADD CONSTRAINT "_scoring_config_v_version_dimensions_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_scoring_config_v_version_dimensions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_scoring_config_v_version_grades" ADD CONSTRAINT "_scoring_config_v_version_grades_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_scoring_config_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_scoring_config_v_version_grades_locales" ADD CONSTRAINT "_scoring_config_v_version_grades_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_scoring_config_v_version_grades"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "admins_roles_order_idx" ON "admins_roles" USING btree ("order");
  CREATE INDEX "admins_roles_parent_idx" ON "admins_roles" USING btree ("parent_id");
  CREATE INDEX "admins_login_history_order_idx" ON "admins_login_history" USING btree ("_order");
  CREATE INDEX "admins_login_history_parent_id_idx" ON "admins_login_history" USING btree ("_parent_id");
  CREATE INDEX "admins_sessions_order_idx" ON "admins_sessions" USING btree ("_order");
  CREATE INDEX "admins_sessions_parent_id_idx" ON "admins_sessions" USING btree ("_parent_id");
  CREATE INDEX "admins_updated_at_idx" ON "admins" USING btree ("updated_at");
  CREATE INDEX "admins_created_at_idx" ON "admins" USING btree ("created_at");
  CREATE UNIQUE INDEX "admins_email_idx" ON "admins" USING btree ("email");
  CREATE INDEX "users_roles_order_idx" ON "users_roles" USING btree ("order");
  CREATE INDEX "users_roles_parent_idx" ON "users_roles" USING btree ("parent_id");
  CREATE INDEX "users_login_history_order_idx" ON "users_login_history" USING btree ("_order");
  CREATE INDEX "users_login_history_parent_id_idx" ON "users_login_history" USING btree ("_parent_id");
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE INDEX "media_sizes_thumbnail_sizes_thumbnail_filename_idx" ON "media" USING btree ("sizes_thumbnail_filename");
  CREATE UNIQUE INDEX "media_locales_locale_parent_id_unique" ON "media_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "media_locales_parent_id_idx" ON "media_locales" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_paragraphs_order_idx" ON "pages_blocks_paragraphs" USING btree ("_order");
  CREATE INDEX "pages_blocks_paragraphs_parent_id_idx" ON "pages_blocks_paragraphs" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_paragraphs_path_idx" ON "pages_blocks_paragraphs" USING btree ("_path");
  CREATE UNIQUE INDEX "pages_blocks_paragraphs_locales_locale_parent_id_unique" ON "pages_blocks_paragraphs_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_paragraphs_locales_parent_id_idx" ON "pages_blocks_paragraphs_locales" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_cards_items_order_idx" ON "pages_blocks_cards_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_cards_items_parent_id_idx" ON "pages_blocks_cards_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "pages_blocks_cards_items_locales_locale_parent_id_unique" ON "pages_blocks_cards_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_cards_items_locales_parent_id_idx" ON "pages_blocks_cards_items_locales" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_cards_order_idx" ON "pages_blocks_cards" USING btree ("_order");
  CREATE INDEX "pages_blocks_cards_parent_id_idx" ON "pages_blocks_cards" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_cards_path_idx" ON "pages_blocks_cards" USING btree ("_path");
  CREATE UNIQUE INDEX "pages_blocks_cards_locales_locale_parent_id_unique" ON "pages_blocks_cards_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_cards_locales_parent_id_idx" ON "pages_blocks_cards_locales" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_steps_items_order_idx" ON "pages_blocks_steps_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_steps_items_parent_id_idx" ON "pages_blocks_steps_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "pages_blocks_steps_items_locales_locale_parent_id_unique" ON "pages_blocks_steps_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_steps_items_locales_parent_id_idx" ON "pages_blocks_steps_items_locales" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_steps_order_idx" ON "pages_blocks_steps" USING btree ("_order");
  CREATE INDEX "pages_blocks_steps_parent_id_idx" ON "pages_blocks_steps" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_steps_path_idx" ON "pages_blocks_steps" USING btree ("_path");
  CREATE UNIQUE INDEX "pages_blocks_steps_locales_locale_parent_id_unique" ON "pages_blocks_steps_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_steps_locales_parent_id_idx" ON "pages_blocks_steps_locales" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_facts_items_order_idx" ON "pages_blocks_facts_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_facts_items_parent_id_idx" ON "pages_blocks_facts_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "pages_blocks_facts_items_locales_locale_parent_id_unique" ON "pages_blocks_facts_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_facts_items_locales_parent_id_idx" ON "pages_blocks_facts_items_locales" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_facts_order_idx" ON "pages_blocks_facts" USING btree ("_order");
  CREATE INDEX "pages_blocks_facts_parent_id_idx" ON "pages_blocks_facts" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_facts_path_idx" ON "pages_blocks_facts" USING btree ("_path");
  CREATE UNIQUE INDEX "pages_blocks_facts_locales_locale_parent_id_unique" ON "pages_blocks_facts_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_facts_locales_parent_id_idx" ON "pages_blocks_facts_locales" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_faq_items_order_idx" ON "pages_blocks_faq_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_faq_items_parent_id_idx" ON "pages_blocks_faq_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "pages_blocks_faq_items_locales_locale_parent_id_unique" ON "pages_blocks_faq_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_faq_items_locales_parent_id_idx" ON "pages_blocks_faq_items_locales" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_faq_order_idx" ON "pages_blocks_faq" USING btree ("_order");
  CREATE INDEX "pages_blocks_faq_parent_id_idx" ON "pages_blocks_faq" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_faq_path_idx" ON "pages_blocks_faq" USING btree ("_path");
  CREATE UNIQUE INDEX "pages_blocks_faq_locales_locale_parent_id_unique" ON "pages_blocks_faq_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_faq_locales_parent_id_idx" ON "pages_blocks_faq_locales" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_table_columns_order_idx" ON "pages_blocks_table_columns" USING btree ("_order");
  CREATE INDEX "pages_blocks_table_columns_parent_id_idx" ON "pages_blocks_table_columns" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "pages_blocks_table_columns_locales_locale_parent_id_unique" ON "pages_blocks_table_columns_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_table_columns_locales_parent_id_idx" ON "pages_blocks_table_columns_locales" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_table_rows_cells_order_idx" ON "pages_blocks_table_rows_cells" USING btree ("_order");
  CREATE INDEX "pages_blocks_table_rows_cells_parent_id_idx" ON "pages_blocks_table_rows_cells" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "pages_blocks_table_rows_cells_locales_locale_parent_id_uniqu" ON "pages_blocks_table_rows_cells_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_table_rows_cells_locales_parent_id_idx" ON "pages_blocks_table_rows_cells_locales" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_table_rows_order_idx" ON "pages_blocks_table_rows" USING btree ("_order");
  CREATE INDEX "pages_blocks_table_rows_parent_id_idx" ON "pages_blocks_table_rows" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_table_order_idx" ON "pages_blocks_table" USING btree ("_order");
  CREATE INDEX "pages_blocks_table_parent_id_idx" ON "pages_blocks_table" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_table_path_idx" ON "pages_blocks_table" USING btree ("_path");
  CREATE UNIQUE INDEX "pages_blocks_table_locales_locale_parent_id_unique" ON "pages_blocks_table_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_table_locales_parent_id_idx" ON "pages_blocks_table_locales" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_notice_order_idx" ON "pages_blocks_notice" USING btree ("_order");
  CREATE INDEX "pages_blocks_notice_parent_id_idx" ON "pages_blocks_notice" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_notice_path_idx" ON "pages_blocks_notice" USING btree ("_path");
  CREATE UNIQUE INDEX "pages_blocks_notice_locales_locale_parent_id_unique" ON "pages_blocks_notice_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_notice_locales_parent_id_idx" ON "pages_blocks_notice_locales" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_links_items_order_idx" ON "pages_blocks_links_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_links_items_parent_id_idx" ON "pages_blocks_links_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "pages_blocks_links_items_locales_locale_parent_id_unique" ON "pages_blocks_links_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_links_items_locales_parent_id_idx" ON "pages_blocks_links_items_locales" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_links_order_idx" ON "pages_blocks_links" USING btree ("_order");
  CREATE INDEX "pages_blocks_links_parent_id_idx" ON "pages_blocks_links" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_links_path_idx" ON "pages_blocks_links" USING btree ("_path");
  CREATE UNIQUE INDEX "pages_blocks_links_locales_locale_parent_id_unique" ON "pages_blocks_links_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_links_locales_parent_id_idx" ON "pages_blocks_links_locales" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "pages_path_idx" ON "pages" USING btree ("path");
  CREATE INDEX "pages_updated_at_idx" ON "pages" USING btree ("updated_at");
  CREATE INDEX "pages_created_at_idx" ON "pages" USING btree ("created_at");
  CREATE INDEX "pages__status_idx" ON "pages" USING btree ("_status");
  CREATE UNIQUE INDEX "pages_locales_locale_parent_id_unique" ON "pages_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_locales_parent_id_idx" ON "pages_locales" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_paragraphs_order_idx" ON "_pages_v_blocks_paragraphs" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_paragraphs_parent_id_idx" ON "_pages_v_blocks_paragraphs" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_paragraphs_path_idx" ON "_pages_v_blocks_paragraphs" USING btree ("_path");
  CREATE UNIQUE INDEX "_pages_v_blocks_paragraphs_locales_locale_parent_id_unique" ON "_pages_v_blocks_paragraphs_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_paragraphs_locales_parent_id_idx" ON "_pages_v_blocks_paragraphs_locales" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_cards_items_order_idx" ON "_pages_v_blocks_cards_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_cards_items_parent_id_idx" ON "_pages_v_blocks_cards_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_pages_v_blocks_cards_items_locales_locale_parent_id_unique" ON "_pages_v_blocks_cards_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_cards_items_locales_parent_id_idx" ON "_pages_v_blocks_cards_items_locales" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_cards_order_idx" ON "_pages_v_blocks_cards" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_cards_parent_id_idx" ON "_pages_v_blocks_cards" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_cards_path_idx" ON "_pages_v_blocks_cards" USING btree ("_path");
  CREATE UNIQUE INDEX "_pages_v_blocks_cards_locales_locale_parent_id_unique" ON "_pages_v_blocks_cards_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_cards_locales_parent_id_idx" ON "_pages_v_blocks_cards_locales" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_steps_items_order_idx" ON "_pages_v_blocks_steps_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_steps_items_parent_id_idx" ON "_pages_v_blocks_steps_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_pages_v_blocks_steps_items_locales_locale_parent_id_unique" ON "_pages_v_blocks_steps_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_steps_items_locales_parent_id_idx" ON "_pages_v_blocks_steps_items_locales" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_steps_order_idx" ON "_pages_v_blocks_steps" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_steps_parent_id_idx" ON "_pages_v_blocks_steps" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_steps_path_idx" ON "_pages_v_blocks_steps" USING btree ("_path");
  CREATE UNIQUE INDEX "_pages_v_blocks_steps_locales_locale_parent_id_unique" ON "_pages_v_blocks_steps_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_steps_locales_parent_id_idx" ON "_pages_v_blocks_steps_locales" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_facts_items_order_idx" ON "_pages_v_blocks_facts_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_facts_items_parent_id_idx" ON "_pages_v_blocks_facts_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_pages_v_blocks_facts_items_locales_locale_parent_id_unique" ON "_pages_v_blocks_facts_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_facts_items_locales_parent_id_idx" ON "_pages_v_blocks_facts_items_locales" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_facts_order_idx" ON "_pages_v_blocks_facts" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_facts_parent_id_idx" ON "_pages_v_blocks_facts" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_facts_path_idx" ON "_pages_v_blocks_facts" USING btree ("_path");
  CREATE UNIQUE INDEX "_pages_v_blocks_facts_locales_locale_parent_id_unique" ON "_pages_v_blocks_facts_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_facts_locales_parent_id_idx" ON "_pages_v_blocks_facts_locales" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_faq_items_order_idx" ON "_pages_v_blocks_faq_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_faq_items_parent_id_idx" ON "_pages_v_blocks_faq_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_pages_v_blocks_faq_items_locales_locale_parent_id_unique" ON "_pages_v_blocks_faq_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_faq_items_locales_parent_id_idx" ON "_pages_v_blocks_faq_items_locales" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_faq_order_idx" ON "_pages_v_blocks_faq" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_faq_parent_id_idx" ON "_pages_v_blocks_faq" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_faq_path_idx" ON "_pages_v_blocks_faq" USING btree ("_path");
  CREATE UNIQUE INDEX "_pages_v_blocks_faq_locales_locale_parent_id_unique" ON "_pages_v_blocks_faq_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_faq_locales_parent_id_idx" ON "_pages_v_blocks_faq_locales" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_table_columns_order_idx" ON "_pages_v_blocks_table_columns" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_table_columns_parent_id_idx" ON "_pages_v_blocks_table_columns" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_pages_v_blocks_table_columns_locales_locale_parent_id_uniqu" ON "_pages_v_blocks_table_columns_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_table_columns_locales_parent_id_idx" ON "_pages_v_blocks_table_columns_locales" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_table_rows_cells_order_idx" ON "_pages_v_blocks_table_rows_cells" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_table_rows_cells_parent_id_idx" ON "_pages_v_blocks_table_rows_cells" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_pages_v_blocks_table_rows_cells_locales_locale_parent_id_un" ON "_pages_v_blocks_table_rows_cells_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_table_rows_cells_locales_parent_id_idx" ON "_pages_v_blocks_table_rows_cells_locales" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_table_rows_order_idx" ON "_pages_v_blocks_table_rows" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_table_rows_parent_id_idx" ON "_pages_v_blocks_table_rows" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_table_order_idx" ON "_pages_v_blocks_table" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_table_parent_id_idx" ON "_pages_v_blocks_table" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_table_path_idx" ON "_pages_v_blocks_table" USING btree ("_path");
  CREATE UNIQUE INDEX "_pages_v_blocks_table_locales_locale_parent_id_unique" ON "_pages_v_blocks_table_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_table_locales_parent_id_idx" ON "_pages_v_blocks_table_locales" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_notice_order_idx" ON "_pages_v_blocks_notice" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_notice_parent_id_idx" ON "_pages_v_blocks_notice" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_notice_path_idx" ON "_pages_v_blocks_notice" USING btree ("_path");
  CREATE UNIQUE INDEX "_pages_v_blocks_notice_locales_locale_parent_id_unique" ON "_pages_v_blocks_notice_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_notice_locales_parent_id_idx" ON "_pages_v_blocks_notice_locales" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_links_items_order_idx" ON "_pages_v_blocks_links_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_links_items_parent_id_idx" ON "_pages_v_blocks_links_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_pages_v_blocks_links_items_locales_locale_parent_id_unique" ON "_pages_v_blocks_links_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_links_items_locales_parent_id_idx" ON "_pages_v_blocks_links_items_locales" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_links_order_idx" ON "_pages_v_blocks_links" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_links_parent_id_idx" ON "_pages_v_blocks_links" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_links_path_idx" ON "_pages_v_blocks_links" USING btree ("_path");
  CREATE UNIQUE INDEX "_pages_v_blocks_links_locales_locale_parent_id_unique" ON "_pages_v_blocks_links_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_links_locales_parent_id_idx" ON "_pages_v_blocks_links_locales" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_parent_idx" ON "_pages_v" USING btree ("parent_id");
  CREATE INDEX "_pages_v_version_version_path_idx" ON "_pages_v" USING btree ("version_path");
  CREATE INDEX "_pages_v_version_version_updated_at_idx" ON "_pages_v" USING btree ("version_updated_at");
  CREATE INDEX "_pages_v_version_version_created_at_idx" ON "_pages_v" USING btree ("version_created_at");
  CREATE INDEX "_pages_v_version_version__status_idx" ON "_pages_v" USING btree ("version__status");
  CREATE INDEX "_pages_v_created_at_idx" ON "_pages_v" USING btree ("created_at");
  CREATE INDEX "_pages_v_updated_at_idx" ON "_pages_v" USING btree ("updated_at");
  CREATE INDEX "_pages_v_snapshot_idx" ON "_pages_v" USING btree ("snapshot");
  CREATE INDEX "_pages_v_published_locale_idx" ON "_pages_v" USING btree ("published_locale");
  CREATE INDEX "_pages_v_latest_idx" ON "_pages_v" USING btree ("latest");
  CREATE UNIQUE INDEX "_pages_v_locales_locale_parent_id_unique" ON "_pages_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_locales_parent_id_idx" ON "_pages_v_locales" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "people_slug_idx" ON "people" USING btree ("slug");
  CREATE INDEX "people_photo_idx" ON "people" USING btree ("photo_id");
  CREATE INDEX "people_photo_consent_file_idx" ON "people" USING btree ("photo_consent_file_id");
  CREATE INDEX "people_updated_at_idx" ON "people" USING btree ("updated_at");
  CREATE INDEX "people_created_at_idx" ON "people" USING btree ("created_at");
  CREATE INDEX "people__status_idx" ON "people" USING btree ("_status");
  CREATE UNIQUE INDEX "people_locales_locale_parent_id_unique" ON "people_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "people_locales_parent_id_idx" ON "people_locales" USING btree ("_parent_id");
  CREATE INDEX "_people_v_parent_idx" ON "_people_v" USING btree ("parent_id");
  CREATE INDEX "_people_v_version_version_slug_idx" ON "_people_v" USING btree ("version_slug");
  CREATE INDEX "_people_v_version_version_photo_idx" ON "_people_v" USING btree ("version_photo_id");
  CREATE INDEX "_people_v_version_version_photo_consent_file_idx" ON "_people_v" USING btree ("version_photo_consent_file_id");
  CREATE INDEX "_people_v_version_version_updated_at_idx" ON "_people_v" USING btree ("version_updated_at");
  CREATE INDEX "_people_v_version_version_created_at_idx" ON "_people_v" USING btree ("version_created_at");
  CREATE INDEX "_people_v_version_version__status_idx" ON "_people_v" USING btree ("version__status");
  CREATE INDEX "_people_v_created_at_idx" ON "_people_v" USING btree ("created_at");
  CREATE INDEX "_people_v_updated_at_idx" ON "_people_v" USING btree ("updated_at");
  CREATE INDEX "_people_v_snapshot_idx" ON "_people_v" USING btree ("snapshot");
  CREATE INDEX "_people_v_published_locale_idx" ON "_people_v" USING btree ("published_locale");
  CREATE INDEX "_people_v_latest_idx" ON "_people_v" USING btree ("latest");
  CREATE UNIQUE INDEX "_people_v_locales_locale_parent_id_unique" ON "_people_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_people_v_locales_parent_id_idx" ON "_people_v_locales" USING btree ("_parent_id");
  CREATE INDEX "services_blocks_paragraphs_order_idx" ON "services_blocks_paragraphs" USING btree ("_order");
  CREATE INDEX "services_blocks_paragraphs_parent_id_idx" ON "services_blocks_paragraphs" USING btree ("_parent_id");
  CREATE INDEX "services_blocks_paragraphs_path_idx" ON "services_blocks_paragraphs" USING btree ("_path");
  CREATE UNIQUE INDEX "services_blocks_paragraphs_locales_locale_parent_id_unique" ON "services_blocks_paragraphs_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "services_blocks_paragraphs_locales_parent_id_idx" ON "services_blocks_paragraphs_locales" USING btree ("_parent_id");
  CREATE INDEX "services_blocks_cards_items_order_idx" ON "services_blocks_cards_items" USING btree ("_order");
  CREATE INDEX "services_blocks_cards_items_parent_id_idx" ON "services_blocks_cards_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "services_blocks_cards_items_locales_locale_parent_id_unique" ON "services_blocks_cards_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "services_blocks_cards_items_locales_parent_id_idx" ON "services_blocks_cards_items_locales" USING btree ("_parent_id");
  CREATE INDEX "services_blocks_cards_order_idx" ON "services_blocks_cards" USING btree ("_order");
  CREATE INDEX "services_blocks_cards_parent_id_idx" ON "services_blocks_cards" USING btree ("_parent_id");
  CREATE INDEX "services_blocks_cards_path_idx" ON "services_blocks_cards" USING btree ("_path");
  CREATE UNIQUE INDEX "services_blocks_cards_locales_locale_parent_id_unique" ON "services_blocks_cards_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "services_blocks_cards_locales_parent_id_idx" ON "services_blocks_cards_locales" USING btree ("_parent_id");
  CREATE INDEX "services_blocks_steps_items_order_idx" ON "services_blocks_steps_items" USING btree ("_order");
  CREATE INDEX "services_blocks_steps_items_parent_id_idx" ON "services_blocks_steps_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "services_blocks_steps_items_locales_locale_parent_id_unique" ON "services_blocks_steps_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "services_blocks_steps_items_locales_parent_id_idx" ON "services_blocks_steps_items_locales" USING btree ("_parent_id");
  CREATE INDEX "services_blocks_steps_order_idx" ON "services_blocks_steps" USING btree ("_order");
  CREATE INDEX "services_blocks_steps_parent_id_idx" ON "services_blocks_steps" USING btree ("_parent_id");
  CREATE INDEX "services_blocks_steps_path_idx" ON "services_blocks_steps" USING btree ("_path");
  CREATE UNIQUE INDEX "services_blocks_steps_locales_locale_parent_id_unique" ON "services_blocks_steps_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "services_blocks_steps_locales_parent_id_idx" ON "services_blocks_steps_locales" USING btree ("_parent_id");
  CREATE INDEX "services_blocks_facts_items_order_idx" ON "services_blocks_facts_items" USING btree ("_order");
  CREATE INDEX "services_blocks_facts_items_parent_id_idx" ON "services_blocks_facts_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "services_blocks_facts_items_locales_locale_parent_id_unique" ON "services_blocks_facts_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "services_blocks_facts_items_locales_parent_id_idx" ON "services_blocks_facts_items_locales" USING btree ("_parent_id");
  CREATE INDEX "services_blocks_facts_order_idx" ON "services_blocks_facts" USING btree ("_order");
  CREATE INDEX "services_blocks_facts_parent_id_idx" ON "services_blocks_facts" USING btree ("_parent_id");
  CREATE INDEX "services_blocks_facts_path_idx" ON "services_blocks_facts" USING btree ("_path");
  CREATE UNIQUE INDEX "services_blocks_facts_locales_locale_parent_id_unique" ON "services_blocks_facts_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "services_blocks_facts_locales_parent_id_idx" ON "services_blocks_facts_locales" USING btree ("_parent_id");
  CREATE INDEX "services_blocks_faq_items_order_idx" ON "services_blocks_faq_items" USING btree ("_order");
  CREATE INDEX "services_blocks_faq_items_parent_id_idx" ON "services_blocks_faq_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "services_blocks_faq_items_locales_locale_parent_id_unique" ON "services_blocks_faq_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "services_blocks_faq_items_locales_parent_id_idx" ON "services_blocks_faq_items_locales" USING btree ("_parent_id");
  CREATE INDEX "services_blocks_faq_order_idx" ON "services_blocks_faq" USING btree ("_order");
  CREATE INDEX "services_blocks_faq_parent_id_idx" ON "services_blocks_faq" USING btree ("_parent_id");
  CREATE INDEX "services_blocks_faq_path_idx" ON "services_blocks_faq" USING btree ("_path");
  CREATE UNIQUE INDEX "services_blocks_faq_locales_locale_parent_id_unique" ON "services_blocks_faq_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "services_blocks_faq_locales_parent_id_idx" ON "services_blocks_faq_locales" USING btree ("_parent_id");
  CREATE INDEX "services_blocks_table_columns_order_idx" ON "services_blocks_table_columns" USING btree ("_order");
  CREATE INDEX "services_blocks_table_columns_parent_id_idx" ON "services_blocks_table_columns" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "services_blocks_table_columns_locales_locale_parent_id_uniqu" ON "services_blocks_table_columns_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "services_blocks_table_columns_locales_parent_id_idx" ON "services_blocks_table_columns_locales" USING btree ("_parent_id");
  CREATE INDEX "services_blocks_table_rows_cells_order_idx" ON "services_blocks_table_rows_cells" USING btree ("_order");
  CREATE INDEX "services_blocks_table_rows_cells_parent_id_idx" ON "services_blocks_table_rows_cells" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "services_blocks_table_rows_cells_locales_locale_parent_id_un" ON "services_blocks_table_rows_cells_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "services_blocks_table_rows_cells_locales_parent_id_idx" ON "services_blocks_table_rows_cells_locales" USING btree ("_parent_id");
  CREATE INDEX "services_blocks_table_rows_order_idx" ON "services_blocks_table_rows" USING btree ("_order");
  CREATE INDEX "services_blocks_table_rows_parent_id_idx" ON "services_blocks_table_rows" USING btree ("_parent_id");
  CREATE INDEX "services_blocks_table_order_idx" ON "services_blocks_table" USING btree ("_order");
  CREATE INDEX "services_blocks_table_parent_id_idx" ON "services_blocks_table" USING btree ("_parent_id");
  CREATE INDEX "services_blocks_table_path_idx" ON "services_blocks_table" USING btree ("_path");
  CREATE UNIQUE INDEX "services_blocks_table_locales_locale_parent_id_unique" ON "services_blocks_table_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "services_blocks_table_locales_parent_id_idx" ON "services_blocks_table_locales" USING btree ("_parent_id");
  CREATE INDEX "services_blocks_notice_order_idx" ON "services_blocks_notice" USING btree ("_order");
  CREATE INDEX "services_blocks_notice_parent_id_idx" ON "services_blocks_notice" USING btree ("_parent_id");
  CREATE INDEX "services_blocks_notice_path_idx" ON "services_blocks_notice" USING btree ("_path");
  CREATE UNIQUE INDEX "services_blocks_notice_locales_locale_parent_id_unique" ON "services_blocks_notice_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "services_blocks_notice_locales_parent_id_idx" ON "services_blocks_notice_locales" USING btree ("_parent_id");
  CREATE INDEX "services_blocks_links_items_order_idx" ON "services_blocks_links_items" USING btree ("_order");
  CREATE INDEX "services_blocks_links_items_parent_id_idx" ON "services_blocks_links_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "services_blocks_links_items_locales_locale_parent_id_unique" ON "services_blocks_links_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "services_blocks_links_items_locales_parent_id_idx" ON "services_blocks_links_items_locales" USING btree ("_parent_id");
  CREATE INDEX "services_blocks_links_order_idx" ON "services_blocks_links" USING btree ("_order");
  CREATE INDEX "services_blocks_links_parent_id_idx" ON "services_blocks_links" USING btree ("_parent_id");
  CREATE INDEX "services_blocks_links_path_idx" ON "services_blocks_links" USING btree ("_path");
  CREATE UNIQUE INDEX "services_blocks_links_locales_locale_parent_id_unique" ON "services_blocks_links_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "services_blocks_links_locales_parent_id_idx" ON "services_blocks_links_locales" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "services_slug_idx" ON "services" USING btree ("slug");
  CREATE INDEX "services_updated_at_idx" ON "services" USING btree ("updated_at");
  CREATE INDEX "services_created_at_idx" ON "services" USING btree ("created_at");
  CREATE INDEX "services__status_idx" ON "services" USING btree ("_status");
  CREATE UNIQUE INDEX "services_locales_locale_parent_id_unique" ON "services_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "services_locales_parent_id_idx" ON "services_locales" USING btree ("_parent_id");
  CREATE INDEX "_services_v_blocks_paragraphs_order_idx" ON "_services_v_blocks_paragraphs" USING btree ("_order");
  CREATE INDEX "_services_v_blocks_paragraphs_parent_id_idx" ON "_services_v_blocks_paragraphs" USING btree ("_parent_id");
  CREATE INDEX "_services_v_blocks_paragraphs_path_idx" ON "_services_v_blocks_paragraphs" USING btree ("_path");
  CREATE UNIQUE INDEX "_services_v_blocks_paragraphs_locales_locale_parent_id_uniqu" ON "_services_v_blocks_paragraphs_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_services_v_blocks_paragraphs_locales_parent_id_idx" ON "_services_v_blocks_paragraphs_locales" USING btree ("_parent_id");
  CREATE INDEX "_services_v_blocks_cards_items_order_idx" ON "_services_v_blocks_cards_items" USING btree ("_order");
  CREATE INDEX "_services_v_blocks_cards_items_parent_id_idx" ON "_services_v_blocks_cards_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_services_v_blocks_cards_items_locales_locale_parent_id_uniq" ON "_services_v_blocks_cards_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_services_v_blocks_cards_items_locales_parent_id_idx" ON "_services_v_blocks_cards_items_locales" USING btree ("_parent_id");
  CREATE INDEX "_services_v_blocks_cards_order_idx" ON "_services_v_blocks_cards" USING btree ("_order");
  CREATE INDEX "_services_v_blocks_cards_parent_id_idx" ON "_services_v_blocks_cards" USING btree ("_parent_id");
  CREATE INDEX "_services_v_blocks_cards_path_idx" ON "_services_v_blocks_cards" USING btree ("_path");
  CREATE UNIQUE INDEX "_services_v_blocks_cards_locales_locale_parent_id_unique" ON "_services_v_blocks_cards_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_services_v_blocks_cards_locales_parent_id_idx" ON "_services_v_blocks_cards_locales" USING btree ("_parent_id");
  CREATE INDEX "_services_v_blocks_steps_items_order_idx" ON "_services_v_blocks_steps_items" USING btree ("_order");
  CREATE INDEX "_services_v_blocks_steps_items_parent_id_idx" ON "_services_v_blocks_steps_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_services_v_blocks_steps_items_locales_locale_parent_id_uniq" ON "_services_v_blocks_steps_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_services_v_blocks_steps_items_locales_parent_id_idx" ON "_services_v_blocks_steps_items_locales" USING btree ("_parent_id");
  CREATE INDEX "_services_v_blocks_steps_order_idx" ON "_services_v_blocks_steps" USING btree ("_order");
  CREATE INDEX "_services_v_blocks_steps_parent_id_idx" ON "_services_v_blocks_steps" USING btree ("_parent_id");
  CREATE INDEX "_services_v_blocks_steps_path_idx" ON "_services_v_blocks_steps" USING btree ("_path");
  CREATE UNIQUE INDEX "_services_v_blocks_steps_locales_locale_parent_id_unique" ON "_services_v_blocks_steps_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_services_v_blocks_steps_locales_parent_id_idx" ON "_services_v_blocks_steps_locales" USING btree ("_parent_id");
  CREATE INDEX "_services_v_blocks_facts_items_order_idx" ON "_services_v_blocks_facts_items" USING btree ("_order");
  CREATE INDEX "_services_v_blocks_facts_items_parent_id_idx" ON "_services_v_blocks_facts_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_services_v_blocks_facts_items_locales_locale_parent_id_uniq" ON "_services_v_blocks_facts_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_services_v_blocks_facts_items_locales_parent_id_idx" ON "_services_v_blocks_facts_items_locales" USING btree ("_parent_id");
  CREATE INDEX "_services_v_blocks_facts_order_idx" ON "_services_v_blocks_facts" USING btree ("_order");
  CREATE INDEX "_services_v_blocks_facts_parent_id_idx" ON "_services_v_blocks_facts" USING btree ("_parent_id");
  CREATE INDEX "_services_v_blocks_facts_path_idx" ON "_services_v_blocks_facts" USING btree ("_path");
  CREATE UNIQUE INDEX "_services_v_blocks_facts_locales_locale_parent_id_unique" ON "_services_v_blocks_facts_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_services_v_blocks_facts_locales_parent_id_idx" ON "_services_v_blocks_facts_locales" USING btree ("_parent_id");
  CREATE INDEX "_services_v_blocks_faq_items_order_idx" ON "_services_v_blocks_faq_items" USING btree ("_order");
  CREATE INDEX "_services_v_blocks_faq_items_parent_id_idx" ON "_services_v_blocks_faq_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_services_v_blocks_faq_items_locales_locale_parent_id_unique" ON "_services_v_blocks_faq_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_services_v_blocks_faq_items_locales_parent_id_idx" ON "_services_v_blocks_faq_items_locales" USING btree ("_parent_id");
  CREATE INDEX "_services_v_blocks_faq_order_idx" ON "_services_v_blocks_faq" USING btree ("_order");
  CREATE INDEX "_services_v_blocks_faq_parent_id_idx" ON "_services_v_blocks_faq" USING btree ("_parent_id");
  CREATE INDEX "_services_v_blocks_faq_path_idx" ON "_services_v_blocks_faq" USING btree ("_path");
  CREATE UNIQUE INDEX "_services_v_blocks_faq_locales_locale_parent_id_unique" ON "_services_v_blocks_faq_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_services_v_blocks_faq_locales_parent_id_idx" ON "_services_v_blocks_faq_locales" USING btree ("_parent_id");
  CREATE INDEX "_services_v_blocks_table_columns_order_idx" ON "_services_v_blocks_table_columns" USING btree ("_order");
  CREATE INDEX "_services_v_blocks_table_columns_parent_id_idx" ON "_services_v_blocks_table_columns" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_services_v_blocks_table_columns_locales_locale_parent_id_un" ON "_services_v_blocks_table_columns_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_services_v_blocks_table_columns_locales_parent_id_idx" ON "_services_v_blocks_table_columns_locales" USING btree ("_parent_id");
  CREATE INDEX "_services_v_blocks_table_rows_cells_order_idx" ON "_services_v_blocks_table_rows_cells" USING btree ("_order");
  CREATE INDEX "_services_v_blocks_table_rows_cells_parent_id_idx" ON "_services_v_blocks_table_rows_cells" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_services_v_blocks_table_rows_cells_locales_locale_parent_id" ON "_services_v_blocks_table_rows_cells_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_services_v_blocks_table_rows_cells_locales_parent_id_idx" ON "_services_v_blocks_table_rows_cells_locales" USING btree ("_parent_id");
  CREATE INDEX "_services_v_blocks_table_rows_order_idx" ON "_services_v_blocks_table_rows" USING btree ("_order");
  CREATE INDEX "_services_v_blocks_table_rows_parent_id_idx" ON "_services_v_blocks_table_rows" USING btree ("_parent_id");
  CREATE INDEX "_services_v_blocks_table_order_idx" ON "_services_v_blocks_table" USING btree ("_order");
  CREATE INDEX "_services_v_blocks_table_parent_id_idx" ON "_services_v_blocks_table" USING btree ("_parent_id");
  CREATE INDEX "_services_v_blocks_table_path_idx" ON "_services_v_blocks_table" USING btree ("_path");
  CREATE UNIQUE INDEX "_services_v_blocks_table_locales_locale_parent_id_unique" ON "_services_v_blocks_table_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_services_v_blocks_table_locales_parent_id_idx" ON "_services_v_blocks_table_locales" USING btree ("_parent_id");
  CREATE INDEX "_services_v_blocks_notice_order_idx" ON "_services_v_blocks_notice" USING btree ("_order");
  CREATE INDEX "_services_v_blocks_notice_parent_id_idx" ON "_services_v_blocks_notice" USING btree ("_parent_id");
  CREATE INDEX "_services_v_blocks_notice_path_idx" ON "_services_v_blocks_notice" USING btree ("_path");
  CREATE UNIQUE INDEX "_services_v_blocks_notice_locales_locale_parent_id_unique" ON "_services_v_blocks_notice_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_services_v_blocks_notice_locales_parent_id_idx" ON "_services_v_blocks_notice_locales" USING btree ("_parent_id");
  CREATE INDEX "_services_v_blocks_links_items_order_idx" ON "_services_v_blocks_links_items" USING btree ("_order");
  CREATE INDEX "_services_v_blocks_links_items_parent_id_idx" ON "_services_v_blocks_links_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_services_v_blocks_links_items_locales_locale_parent_id_uniq" ON "_services_v_blocks_links_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_services_v_blocks_links_items_locales_parent_id_idx" ON "_services_v_blocks_links_items_locales" USING btree ("_parent_id");
  CREATE INDEX "_services_v_blocks_links_order_idx" ON "_services_v_blocks_links" USING btree ("_order");
  CREATE INDEX "_services_v_blocks_links_parent_id_idx" ON "_services_v_blocks_links" USING btree ("_parent_id");
  CREATE INDEX "_services_v_blocks_links_path_idx" ON "_services_v_blocks_links" USING btree ("_path");
  CREATE UNIQUE INDEX "_services_v_blocks_links_locales_locale_parent_id_unique" ON "_services_v_blocks_links_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_services_v_blocks_links_locales_parent_id_idx" ON "_services_v_blocks_links_locales" USING btree ("_parent_id");
  CREATE INDEX "_services_v_parent_idx" ON "_services_v" USING btree ("parent_id");
  CREATE INDEX "_services_v_version_version_slug_idx" ON "_services_v" USING btree ("version_slug");
  CREATE INDEX "_services_v_version_version_updated_at_idx" ON "_services_v" USING btree ("version_updated_at");
  CREATE INDEX "_services_v_version_version_created_at_idx" ON "_services_v" USING btree ("version_created_at");
  CREATE INDEX "_services_v_version_version__status_idx" ON "_services_v" USING btree ("version__status");
  CREATE INDEX "_services_v_created_at_idx" ON "_services_v" USING btree ("created_at");
  CREATE INDEX "_services_v_updated_at_idx" ON "_services_v" USING btree ("updated_at");
  CREATE INDEX "_services_v_snapshot_idx" ON "_services_v" USING btree ("snapshot");
  CREATE INDEX "_services_v_published_locale_idx" ON "_services_v" USING btree ("published_locale");
  CREATE INDEX "_services_v_latest_idx" ON "_services_v" USING btree ("latest");
  CREATE UNIQUE INDEX "_services_v_locales_locale_parent_id_unique" ON "_services_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_services_v_locales_parent_id_idx" ON "_services_v_locales" USING btree ("_parent_id");
  CREATE INDEX "projects_internal_stage_history_order_idx" ON "projects_internal_stage_history" USING btree ("_order");
  CREATE INDEX "projects_internal_stage_history_parent_id_idx" ON "projects_internal_stage_history" USING btree ("_parent_id");
  CREATE INDEX "projects_internal_risks_order_idx" ON "projects_internal_risks" USING btree ("_order");
  CREATE INDEX "projects_internal_risks_parent_id_idx" ON "projects_internal_risks" USING btree ("_parent_id");
  CREATE INDEX "projects_internal_pipeline_steps_order_idx" ON "projects_internal_pipeline_steps" USING btree ("_order");
  CREATE INDEX "projects_internal_pipeline_steps_parent_id_idx" ON "projects_internal_pipeline_steps" USING btree ("_parent_id");
  CREATE INDEX "projects_internal_pipeline_steps_responsible_idx" ON "projects_internal_pipeline_steps" USING btree ("responsible_id");
  CREATE UNIQUE INDEX "projects_slug_idx" ON "projects" USING btree ("slug");
  CREATE INDEX "projects_image_idx" ON "projects" USING btree ("image_id");
  CREATE INDEX "projects_internal_internal_owner_organization_idx" ON "projects" USING btree ("internal_owner_organization_id");
  CREATE INDEX "projects_internal_internal_responsible_manager_idx" ON "projects" USING btree ("internal_responsible_manager_id");
  CREATE INDEX "projects_updated_at_idx" ON "projects" USING btree ("updated_at");
  CREATE INDEX "projects_created_at_idx" ON "projects" USING btree ("created_at");
  CREATE UNIQUE INDEX "projects_locales_locale_parent_id_unique" ON "projects_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "projects_locales_parent_id_idx" ON "projects_locales" USING btree ("_parent_id");
  CREATE INDEX "projects_rels_order_idx" ON "projects_rels" USING btree ("order");
  CREATE INDEX "projects_rels_parent_idx" ON "projects_rels" USING btree ("parent_id");
  CREATE INDEX "projects_rels_path_idx" ON "projects_rels" USING btree ("path");
  CREATE INDEX "projects_rels_media_id_idx" ON "projects_rels" USING btree ("media_id");
  CREATE UNIQUE INDEX "news_slug_idx" ON "news" USING btree ("slug");
  CREATE INDEX "news_image_idx" ON "news" USING btree ("image_id");
  CREATE INDEX "news_updated_at_idx" ON "news" USING btree ("updated_at");
  CREATE INDEX "news_created_at_idx" ON "news" USING btree ("created_at");
  CREATE INDEX "news__status_idx" ON "news" USING btree ("_status");
  CREATE UNIQUE INDEX "news_locales_locale_parent_id_unique" ON "news_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "news_locales_parent_id_idx" ON "news_locales" USING btree ("_parent_id");
  CREATE INDEX "_news_v_parent_idx" ON "_news_v" USING btree ("parent_id");
  CREATE INDEX "_news_v_version_version_slug_idx" ON "_news_v" USING btree ("version_slug");
  CREATE INDEX "_news_v_version_version_image_idx" ON "_news_v" USING btree ("version_image_id");
  CREATE INDEX "_news_v_version_version_updated_at_idx" ON "_news_v" USING btree ("version_updated_at");
  CREATE INDEX "_news_v_version_version_created_at_idx" ON "_news_v" USING btree ("version_created_at");
  CREATE INDEX "_news_v_version_version__status_idx" ON "_news_v" USING btree ("version__status");
  CREATE INDEX "_news_v_created_at_idx" ON "_news_v" USING btree ("created_at");
  CREATE INDEX "_news_v_updated_at_idx" ON "_news_v" USING btree ("updated_at");
  CREATE INDEX "_news_v_snapshot_idx" ON "_news_v" USING btree ("snapshot");
  CREATE INDEX "_news_v_published_locale_idx" ON "_news_v" USING btree ("published_locale");
  CREATE INDEX "_news_v_latest_idx" ON "_news_v" USING btree ("latest");
  CREATE UNIQUE INDEX "_news_v_locales_locale_parent_id_unique" ON "_news_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_news_v_locales_parent_id_idx" ON "_news_v_locales" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "events_slug_idx" ON "events" USING btree ("slug");
  CREATE INDEX "events_image_idx" ON "events" USING btree ("image_id");
  CREATE INDEX "events_updated_at_idx" ON "events" USING btree ("updated_at");
  CREATE INDEX "events_created_at_idx" ON "events" USING btree ("created_at");
  CREATE INDEX "events__status_idx" ON "events" USING btree ("_status");
  CREATE UNIQUE INDEX "events_locales_locale_parent_id_unique" ON "events_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "events_locales_parent_id_idx" ON "events_locales" USING btree ("_parent_id");
  CREATE INDEX "_events_v_parent_idx" ON "_events_v" USING btree ("parent_id");
  CREATE INDEX "_events_v_version_version_slug_idx" ON "_events_v" USING btree ("version_slug");
  CREATE INDEX "_events_v_version_version_image_idx" ON "_events_v" USING btree ("version_image_id");
  CREATE INDEX "_events_v_version_version_updated_at_idx" ON "_events_v" USING btree ("version_updated_at");
  CREATE INDEX "_events_v_version_version_created_at_idx" ON "_events_v" USING btree ("version_created_at");
  CREATE INDEX "_events_v_version_version__status_idx" ON "_events_v" USING btree ("version__status");
  CREATE INDEX "_events_v_created_at_idx" ON "_events_v" USING btree ("created_at");
  CREATE INDEX "_events_v_updated_at_idx" ON "_events_v" USING btree ("updated_at");
  CREATE INDEX "_events_v_snapshot_idx" ON "_events_v" USING btree ("snapshot");
  CREATE INDEX "_events_v_published_locale_idx" ON "_events_v" USING btree ("published_locale");
  CREATE INDEX "_events_v_latest_idx" ON "_events_v" USING btree ("latest");
  CREATE UNIQUE INDEX "_events_v_locales_locale_parent_id_unique" ON "_events_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_events_v_locales_parent_id_idx" ON "_events_v_locales" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "videos_slug_idx" ON "videos" USING btree ("slug");
  CREATE INDEX "videos_poster_idx" ON "videos" USING btree ("poster_id");
  CREATE INDEX "videos_updated_at_idx" ON "videos" USING btree ("updated_at");
  CREATE INDEX "videos_created_at_idx" ON "videos" USING btree ("created_at");
  CREATE INDEX "videos__status_idx" ON "videos" USING btree ("_status");
  CREATE INDEX "videos_file_idx" ON "videos_locales" USING btree ("file_id","_locale");
  CREATE UNIQUE INDEX "videos_locales_locale_parent_id_unique" ON "videos_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "videos_locales_parent_id_idx" ON "videos_locales" USING btree ("_parent_id");
  CREATE INDEX "_videos_v_parent_idx" ON "_videos_v" USING btree ("parent_id");
  CREATE INDEX "_videos_v_version_version_slug_idx" ON "_videos_v" USING btree ("version_slug");
  CREATE INDEX "_videos_v_version_version_poster_idx" ON "_videos_v" USING btree ("version_poster_id");
  CREATE INDEX "_videos_v_version_version_updated_at_idx" ON "_videos_v" USING btree ("version_updated_at");
  CREATE INDEX "_videos_v_version_version_created_at_idx" ON "_videos_v" USING btree ("version_created_at");
  CREATE INDEX "_videos_v_version_version__status_idx" ON "_videos_v" USING btree ("version__status");
  CREATE INDEX "_videos_v_created_at_idx" ON "_videos_v" USING btree ("created_at");
  CREATE INDEX "_videos_v_updated_at_idx" ON "_videos_v" USING btree ("updated_at");
  CREATE INDEX "_videos_v_snapshot_idx" ON "_videos_v" USING btree ("snapshot");
  CREATE INDEX "_videos_v_published_locale_idx" ON "_videos_v" USING btree ("published_locale");
  CREATE INDEX "_videos_v_latest_idx" ON "_videos_v" USING btree ("latest");
  CREATE INDEX "_videos_v_version_version_file_idx" ON "_videos_v_locales" USING btree ("version_file_id","_locale");
  CREATE UNIQUE INDEX "_videos_v_locales_locale_parent_id_unique" ON "_videos_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_videos_v_locales_parent_id_idx" ON "_videos_v_locales" USING btree ("_parent_id");
  CREATE INDEX "albums_photos_order_idx" ON "albums_photos" USING btree ("_order");
  CREATE INDEX "albums_photos_parent_id_idx" ON "albums_photos" USING btree ("_parent_id");
  CREATE INDEX "albums_photos_image_idx" ON "albums_photos" USING btree ("image_id");
  CREATE UNIQUE INDEX "albums_photos_locales_locale_parent_id_unique" ON "albums_photos_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "albums_photos_locales_parent_id_idx" ON "albums_photos_locales" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "albums_slug_idx" ON "albums" USING btree ("slug");
  CREATE INDEX "albums_cover_idx" ON "albums" USING btree ("cover_id");
  CREATE INDEX "albums_updated_at_idx" ON "albums" USING btree ("updated_at");
  CREATE INDEX "albums_created_at_idx" ON "albums" USING btree ("created_at");
  CREATE INDEX "albums__status_idx" ON "albums" USING btree ("_status");
  CREATE UNIQUE INDEX "albums_locales_locale_parent_id_unique" ON "albums_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "albums_locales_parent_id_idx" ON "albums_locales" USING btree ("_parent_id");
  CREATE INDEX "_albums_v_version_photos_order_idx" ON "_albums_v_version_photos" USING btree ("_order");
  CREATE INDEX "_albums_v_version_photos_parent_id_idx" ON "_albums_v_version_photos" USING btree ("_parent_id");
  CREATE INDEX "_albums_v_version_photos_image_idx" ON "_albums_v_version_photos" USING btree ("image_id");
  CREATE UNIQUE INDEX "_albums_v_version_photos_locales_locale_parent_id_unique" ON "_albums_v_version_photos_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_albums_v_version_photos_locales_parent_id_idx" ON "_albums_v_version_photos_locales" USING btree ("_parent_id");
  CREATE INDEX "_albums_v_parent_idx" ON "_albums_v" USING btree ("parent_id");
  CREATE INDEX "_albums_v_version_version_slug_idx" ON "_albums_v" USING btree ("version_slug");
  CREATE INDEX "_albums_v_version_version_cover_idx" ON "_albums_v" USING btree ("version_cover_id");
  CREATE INDEX "_albums_v_version_version_updated_at_idx" ON "_albums_v" USING btree ("version_updated_at");
  CREATE INDEX "_albums_v_version_version_created_at_idx" ON "_albums_v" USING btree ("version_created_at");
  CREATE INDEX "_albums_v_version_version__status_idx" ON "_albums_v" USING btree ("version__status");
  CREATE INDEX "_albums_v_created_at_idx" ON "_albums_v" USING btree ("created_at");
  CREATE INDEX "_albums_v_updated_at_idx" ON "_albums_v" USING btree ("updated_at");
  CREATE INDEX "_albums_v_snapshot_idx" ON "_albums_v" USING btree ("snapshot");
  CREATE INDEX "_albums_v_published_locale_idx" ON "_albums_v" USING btree ("published_locale");
  CREATE INDEX "_albums_v_latest_idx" ON "_albums_v" USING btree ("latest");
  CREATE UNIQUE INDEX "_albums_v_locales_locale_parent_id_unique" ON "_albums_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_albums_v_locales_parent_id_idx" ON "_albums_v_locales" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "partners_slug_idx" ON "partners" USING btree ("slug");
  CREATE INDEX "partners_logo_idx" ON "partners" USING btree ("logo_id");
  CREATE INDEX "partners_updated_at_idx" ON "partners" USING btree ("updated_at");
  CREATE INDEX "partners_created_at_idx" ON "partners" USING btree ("created_at");
  CREATE INDEX "partners__status_idx" ON "partners" USING btree ("_status");
  CREATE UNIQUE INDEX "partners_locales_locale_parent_id_unique" ON "partners_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "partners_locales_parent_id_idx" ON "partners_locales" USING btree ("_parent_id");
  CREATE INDEX "_partners_v_parent_idx" ON "_partners_v" USING btree ("parent_id");
  CREATE INDEX "_partners_v_version_version_slug_idx" ON "_partners_v" USING btree ("version_slug");
  CREATE INDEX "_partners_v_version_version_logo_idx" ON "_partners_v" USING btree ("version_logo_id");
  CREATE INDEX "_partners_v_version_version_updated_at_idx" ON "_partners_v" USING btree ("version_updated_at");
  CREATE INDEX "_partners_v_version_version_created_at_idx" ON "_partners_v" USING btree ("version_created_at");
  CREATE INDEX "_partners_v_version_version__status_idx" ON "_partners_v" USING btree ("version__status");
  CREATE INDEX "_partners_v_created_at_idx" ON "_partners_v" USING btree ("created_at");
  CREATE INDEX "_partners_v_updated_at_idx" ON "_partners_v" USING btree ("updated_at");
  CREATE INDEX "_partners_v_snapshot_idx" ON "_partners_v" USING btree ("snapshot");
  CREATE INDEX "_partners_v_published_locale_idx" ON "_partners_v" USING btree ("published_locale");
  CREATE INDEX "_partners_v_latest_idx" ON "_partners_v" USING btree ("latest");
  CREATE UNIQUE INDEX "_partners_v_locales_locale_parent_id_unique" ON "_partners_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_partners_v_locales_parent_id_idx" ON "_partners_v_locales" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "documents_slug_idx" ON "documents" USING btree ("slug");
  CREATE INDEX "documents_updated_at_idx" ON "documents" USING btree ("updated_at");
  CREATE INDEX "documents_created_at_idx" ON "documents" USING btree ("created_at");
  CREATE INDEX "documents__status_idx" ON "documents" USING btree ("_status");
  CREATE INDEX "documents_file_idx" ON "documents_locales" USING btree ("file_id","_locale");
  CREATE UNIQUE INDEX "documents_locales_locale_parent_id_unique" ON "documents_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "documents_locales_parent_id_idx" ON "documents_locales" USING btree ("_parent_id");
  CREATE INDEX "_documents_v_parent_idx" ON "_documents_v" USING btree ("parent_id");
  CREATE INDEX "_documents_v_version_version_slug_idx" ON "_documents_v" USING btree ("version_slug");
  CREATE INDEX "_documents_v_version_version_updated_at_idx" ON "_documents_v" USING btree ("version_updated_at");
  CREATE INDEX "_documents_v_version_version_created_at_idx" ON "_documents_v" USING btree ("version_created_at");
  CREATE INDEX "_documents_v_version_version__status_idx" ON "_documents_v" USING btree ("version__status");
  CREATE INDEX "_documents_v_created_at_idx" ON "_documents_v" USING btree ("created_at");
  CREATE INDEX "_documents_v_updated_at_idx" ON "_documents_v" USING btree ("updated_at");
  CREATE INDEX "_documents_v_snapshot_idx" ON "_documents_v" USING btree ("snapshot");
  CREATE INDEX "_documents_v_published_locale_idx" ON "_documents_v" USING btree ("published_locale");
  CREATE INDEX "_documents_v_latest_idx" ON "_documents_v" USING btree ("latest");
  CREATE INDEX "_documents_v_version_version_file_idx" ON "_documents_v_locales" USING btree ("version_file_id","_locale");
  CREATE UNIQUE INDEX "_documents_v_locales_locale_parent_id_unique" ON "_documents_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_documents_v_locales_parent_id_idx" ON "_documents_v_locales" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "submissions_reference_idx" ON "submissions" USING btree ("reference");
  CREATE INDEX "submissions_contact_name_idx" ON "submissions" USING btree ("contact_name");
  CREATE INDEX "submissions_email_idx" ON "submissions" USING btree ("email");
  CREATE INDEX "submissions_user_idx" ON "submissions" USING btree ("user_id");
  CREATE INDEX "submissions_updated_at_idx" ON "submissions" USING btree ("updated_at");
  CREATE INDEX "submissions_created_at_idx" ON "submissions" USING btree ("created_at");
  CREATE INDEX "organizations_name_idx" ON "organizations" USING btree ("name");
  CREATE INDEX "organizations_registration_number_idx" ON "organizations" USING btree ("registration_number");
  CREATE INDEX "organizations_updated_at_idx" ON "organizations" USING btree ("updated_at");
  CREATE INDEX "organizations_created_at_idx" ON "organizations" USING btree ("created_at");
  CREATE INDEX "organizations_rels_order_idx" ON "organizations_rels" USING btree ("order");
  CREATE INDEX "organizations_rels_parent_idx" ON "organizations_rels" USING btree ("parent_id");
  CREATE INDEX "organizations_rels_path_idx" ON "organizations_rels" USING btree ("path");
  CREATE INDEX "organizations_rels_users_id_idx" ON "organizations_rels" USING btree ("users_id");
  CREATE INDEX "investors_sectors_order_idx" ON "investors_sectors" USING btree ("order");
  CREATE INDEX "investors_sectors_parent_idx" ON "investors_sectors" USING btree ("parent_id");
  CREATE INDEX "investors_regions_order_idx" ON "investors_regions" USING btree ("order");
  CREATE INDEX "investors_regions_parent_idx" ON "investors_regions" USING btree ("parent_id");
  CREATE INDEX "investors_models_order_idx" ON "investors_models" USING btree ("order");
  CREATE INDEX "investors_models_parent_idx" ON "investors_models" USING btree ("parent_id");
  CREATE INDEX "investors_display_name_idx" ON "investors" USING btree ("display_name");
  CREATE INDEX "investors_organization_idx" ON "investors" USING btree ("organization_id");
  CREATE INDEX "investors_user_idx" ON "investors" USING btree ("user_id");
  CREATE INDEX "investors_veto_veto_set_by_idx" ON "investors" USING btree ("veto_set_by_id");
  CREATE INDEX "investors_responsible_manager_idx" ON "investors" USING btree ("responsible_manager_id");
  CREATE INDEX "investors_updated_at_idx" ON "investors" USING btree ("updated_at");
  CREATE INDEX "investors_created_at_idx" ON "investors" USING btree ("created_at");
  CREATE INDEX "scorecards_entries_order_idx" ON "scorecards_entries" USING btree ("_order");
  CREATE INDEX "scorecards_entries_parent_id_idx" ON "scorecards_entries" USING btree ("_parent_id");
  CREATE INDEX "scorecards_assessments_order_idx" ON "scorecards_assessments" USING btree ("_order");
  CREATE INDEX "scorecards_assessments_parent_id_idx" ON "scorecards_assessments" USING btree ("_parent_id");
  CREATE INDEX "scorecards_assessments_evaluator_idx" ON "scorecards_assessments" USING btree ("evaluator_id");
  CREATE INDEX "scorecards_investor_idx" ON "scorecards" USING btree ("investor_id");
  CREATE INDEX "scorecards_updated_at_idx" ON "scorecards" USING btree ("updated_at");
  CREATE INDEX "scorecards_created_at_idx" ON "scorecards" USING btree ("created_at");
  CREATE INDEX "scorecards_rels_order_idx" ON "scorecards_rels" USING btree ("order");
  CREATE INDEX "scorecards_rels_parent_idx" ON "scorecards_rels" USING btree ("parent_id");
  CREATE INDEX "scorecards_rels_path_idx" ON "scorecards_rels" USING btree ("path");
  CREATE INDEX "scorecards_rels_media_id_idx" ON "scorecards_rels" USING btree ("media_id");
  CREATE INDEX "coi_declarations_person_idx" ON "coi_declarations" USING btree ("person_id");
  CREATE INDEX "coi_declarations_investor_idx" ON "coi_declarations" USING btree ("investor_id");
  CREATE INDEX "coi_declarations_project_idx" ON "coi_declarations" USING btree ("project_id");
  CREATE INDEX "coi_declarations_organization_idx" ON "coi_declarations" USING btree ("organization_id");
  CREATE INDEX "coi_declarations_updated_at_idx" ON "coi_declarations" USING btree ("updated_at");
  CREATE INDEX "coi_declarations_created_at_idx" ON "coi_declarations" USING btree ("created_at");
  CREATE INDEX "matches_project_idx" ON "matches" USING btree ("project_id");
  CREATE INDEX "matches_investor_idx" ON "matches" USING btree ("investor_id");
  CREATE INDEX "matches_proposed_by_idx" ON "matches" USING btree ("proposed_by_id");
  CREATE INDEX "matches_updated_at_idx" ON "matches" USING btree ("updated_at");
  CREATE INDEX "matches_created_at_idx" ON "matches" USING btree ("created_at");
  CREATE INDEX "ndas_project_idx" ON "ndas" USING btree ("project_id");
  CREATE INDEX "ndas_investor_idx" ON "ndas" USING btree ("investor_id");
  CREATE INDEX "ndas_user_idx" ON "ndas" USING btree ("user_id");
  CREATE INDEX "ndas_updated_at_idx" ON "ndas" USING btree ("updated_at");
  CREATE INDEX "ndas_created_at_idx" ON "ndas" USING btree ("created_at");
  CREATE INDEX "dataroom_files_project_idx" ON "dataroom_files" USING btree ("project_id");
  CREATE INDEX "dataroom_files_updated_at_idx" ON "dataroom_files" USING btree ("updated_at");
  CREATE INDEX "dataroom_files_created_at_idx" ON "dataroom_files" USING btree ("created_at");
  CREATE UNIQUE INDEX "dataroom_files_filename_idx" ON "dataroom_files" USING btree ("filename");
  CREATE INDEX "dataroom_log_at_idx" ON "dataroom_log" USING btree ("at");
  CREATE INDEX "dataroom_log_user_idx" ON "dataroom_log" USING btree ("user_id");
  CREATE INDEX "dataroom_log_project_idx" ON "dataroom_log" USING btree ("project_id");
  CREATE INDEX "dataroom_log_file_idx" ON "dataroom_log" USING btree ("file_id");
  CREATE INDEX "dataroom_log_updated_at_idx" ON "dataroom_log" USING btree ("updated_at");
  CREATE INDEX "dataroom_log_created_at_idx" ON "dataroom_log" USING btree ("created_at");
  CREATE INDEX "agreements_partner_idx" ON "agreements" USING btree ("partner_id");
  CREATE INDEX "agreements_file_idx" ON "agreements" USING btree ("file_id");
  CREATE INDEX "agreements_updated_at_idx" ON "agreements" USING btree ("updated_at");
  CREATE INDEX "agreements_created_at_idx" ON "agreements" USING btree ("created_at");
  CREATE INDEX "members_fees_order_idx" ON "members_fees" USING btree ("_order");
  CREATE INDEX "members_fees_parent_id_idx" ON "members_fees" USING btree ("_parent_id");
  CREATE INDEX "members_organization_idx" ON "members" USING btree ("organization_id");
  CREATE INDEX "members_updated_at_idx" ON "members" USING btree ("updated_at");
  CREATE INDEX "members_created_at_idx" ON "members" USING btree ("created_at");
  CREATE INDEX "issues_organization_idx" ON "issues" USING btree ("organization_id");
  CREATE INDEX "issues_updated_at_idx" ON "issues" USING btree ("updated_at");
  CREATE INDEX "issues_created_at_idx" ON "issues" USING btree ("created_at");
  CREATE INDEX "audit_log_at_idx" ON "audit_log" USING btree ("at");
  CREATE INDEX "audit_log_action_idx" ON "audit_log" USING btree ("action");
  CREATE INDEX "audit_log_collection_idx" ON "audit_log" USING btree ("collection");
  CREATE INDEX "audit_log_doc_id_idx" ON "audit_log" USING btree ("doc_id");
  CREATE INDEX "audit_log_actor_id_idx" ON "audit_log" USING btree ("actor_id");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_admins_id_idx" ON "payload_locked_documents_rels" USING btree ("admins_id");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_pages_id_idx" ON "payload_locked_documents_rels" USING btree ("pages_id");
  CREATE INDEX "payload_locked_documents_rels_people_id_idx" ON "payload_locked_documents_rels" USING btree ("people_id");
  CREATE INDEX "payload_locked_documents_rels_services_id_idx" ON "payload_locked_documents_rels" USING btree ("services_id");
  CREATE INDEX "payload_locked_documents_rels_projects_id_idx" ON "payload_locked_documents_rels" USING btree ("projects_id");
  CREATE INDEX "payload_locked_documents_rels_news_id_idx" ON "payload_locked_documents_rels" USING btree ("news_id");
  CREATE INDEX "payload_locked_documents_rels_events_id_idx" ON "payload_locked_documents_rels" USING btree ("events_id");
  CREATE INDEX "payload_locked_documents_rels_videos_id_idx" ON "payload_locked_documents_rels" USING btree ("videos_id");
  CREATE INDEX "payload_locked_documents_rels_albums_id_idx" ON "payload_locked_documents_rels" USING btree ("albums_id");
  CREATE INDEX "payload_locked_documents_rels_partners_id_idx" ON "payload_locked_documents_rels" USING btree ("partners_id");
  CREATE INDEX "payload_locked_documents_rels_documents_id_idx" ON "payload_locked_documents_rels" USING btree ("documents_id");
  CREATE INDEX "payload_locked_documents_rels_submissions_id_idx" ON "payload_locked_documents_rels" USING btree ("submissions_id");
  CREATE INDEX "payload_locked_documents_rels_organizations_id_idx" ON "payload_locked_documents_rels" USING btree ("organizations_id");
  CREATE INDEX "payload_locked_documents_rels_investors_id_idx" ON "payload_locked_documents_rels" USING btree ("investors_id");
  CREATE INDEX "payload_locked_documents_rels_scorecards_id_idx" ON "payload_locked_documents_rels" USING btree ("scorecards_id");
  CREATE INDEX "payload_locked_documents_rels_coi_declarations_id_idx" ON "payload_locked_documents_rels" USING btree ("coi_declarations_id");
  CREATE INDEX "payload_locked_documents_rels_matches_id_idx" ON "payload_locked_documents_rels" USING btree ("matches_id");
  CREATE INDEX "payload_locked_documents_rels_ndas_id_idx" ON "payload_locked_documents_rels" USING btree ("ndas_id");
  CREATE INDEX "payload_locked_documents_rels_dataroom_files_id_idx" ON "payload_locked_documents_rels" USING btree ("dataroom_files_id");
  CREATE INDEX "payload_locked_documents_rels_dataroom_log_id_idx" ON "payload_locked_documents_rels" USING btree ("dataroom_log_id");
  CREATE INDEX "payload_locked_documents_rels_agreements_id_idx" ON "payload_locked_documents_rels" USING btree ("agreements_id");
  CREATE INDEX "payload_locked_documents_rels_members_id_idx" ON "payload_locked_documents_rels" USING btree ("members_id");
  CREATE INDEX "payload_locked_documents_rels_issues_id_idx" ON "payload_locked_documents_rels" USING btree ("issues_id");
  CREATE INDEX "payload_locked_documents_rels_audit_log_id_idx" ON "payload_locked_documents_rels" USING btree ("audit_log_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_admins_id_idx" ON "payload_preferences_rels" USING btree ("admins_id");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");
  CREATE INDEX "home_hero_facts_order_idx" ON "home_hero_facts" USING btree ("_order");
  CREATE INDEX "home_hero_facts_parent_id_idx" ON "home_hero_facts" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "home_hero_facts_locales_locale_parent_id_unique" ON "home_hero_facts_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "home_hero_facts_locales_parent_id_idx" ON "home_hero_facts_locales" USING btree ("_parent_id");
  CREATE INDEX "home_audience_cards_order_idx" ON "home_audience_cards" USING btree ("_order");
  CREATE INDEX "home_audience_cards_parent_id_idx" ON "home_audience_cards" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "home_audience_cards_locales_locale_parent_id_unique" ON "home_audience_cards_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "home_audience_cards_locales_parent_id_idx" ON "home_audience_cards_locales" USING btree ("_parent_id");
  CREATE INDEX "home_results_cells_order_idx" ON "home_results_cells" USING btree ("_order");
  CREATE INDEX "home_results_cells_parent_id_idx" ON "home_results_cells" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "home_results_cells_locales_locale_parent_id_unique" ON "home_results_cells_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "home_results_cells_locales_parent_id_idx" ON "home_results_cells_locales" USING btree ("_parent_id");
  CREATE INDEX "home_lifecycle_steps_order_idx" ON "home_lifecycle_steps" USING btree ("_order");
  CREATE INDEX "home_lifecycle_steps_parent_id_idx" ON "home_lifecycle_steps" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "home_lifecycle_steps_locales_locale_parent_id_unique" ON "home_lifecycle_steps_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "home_lifecycle_steps_locales_parent_id_idx" ON "home_lifecycle_steps_locales" USING btree ("_parent_id");
  CREATE INDEX "home_lifecycle_levels_order_idx" ON "home_lifecycle_levels" USING btree ("_order");
  CREATE INDEX "home_lifecycle_levels_parent_id_idx" ON "home_lifecycle_levels" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "home_lifecycle_levels_locales_locale_parent_id_unique" ON "home_lifecycle_levels_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "home_lifecycle_levels_locales_parent_id_idx" ON "home_lifecycle_levels_locales" USING btree ("_parent_id");
  CREATE INDEX "home_projects_chips_order_idx" ON "home_projects_chips" USING btree ("_order");
  CREATE INDEX "home_projects_chips_parent_id_idx" ON "home_projects_chips" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "home_projects_chips_locales_locale_parent_id_unique" ON "home_projects_chips_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "home_projects_chips_locales_parent_id_idx" ON "home_projects_chips_locales" USING btree ("_parent_id");
  CREATE INDEX "home_corridors_china_bullets_order_idx" ON "home_corridors_china_bullets" USING btree ("_order");
  CREATE INDEX "home_corridors_china_bullets_parent_id_idx" ON "home_corridors_china_bullets" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "home_corridors_china_bullets_locales_locale_parent_id_unique" ON "home_corridors_china_bullets_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "home_corridors_china_bullets_locales_parent_id_idx" ON "home_corridors_china_bullets_locales" USING btree ("_parent_id");
  CREATE INDEX "home_membership_categories_order_idx" ON "home_membership_categories" USING btree ("_order");
  CREATE INDEX "home_membership_categories_parent_id_idx" ON "home_membership_categories" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "home_membership_categories_locales_locale_parent_id_unique" ON "home_membership_categories_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "home_membership_categories_locales_parent_id_idx" ON "home_membership_categories_locales" USING btree ("_parent_id");
  CREATE INDEX "home_leadership_leadership_person_idx" ON "home" USING btree ("leadership_person_id");
  CREATE UNIQUE INDEX "home_locales_locale_parent_id_unique" ON "home_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "home_locales_parent_id_idx" ON "home_locales" USING btree ("_parent_id");
  CREATE INDEX "_home_v_version_hero_facts_order_idx" ON "_home_v_version_hero_facts" USING btree ("_order");
  CREATE INDEX "_home_v_version_hero_facts_parent_id_idx" ON "_home_v_version_hero_facts" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_home_v_version_hero_facts_locales_locale_parent_id_unique" ON "_home_v_version_hero_facts_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_home_v_version_hero_facts_locales_parent_id_idx" ON "_home_v_version_hero_facts_locales" USING btree ("_parent_id");
  CREATE INDEX "_home_v_version_audience_cards_order_idx" ON "_home_v_version_audience_cards" USING btree ("_order");
  CREATE INDEX "_home_v_version_audience_cards_parent_id_idx" ON "_home_v_version_audience_cards" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_home_v_version_audience_cards_locales_locale_parent_id_uniq" ON "_home_v_version_audience_cards_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_home_v_version_audience_cards_locales_parent_id_idx" ON "_home_v_version_audience_cards_locales" USING btree ("_parent_id");
  CREATE INDEX "_home_v_version_results_cells_order_idx" ON "_home_v_version_results_cells" USING btree ("_order");
  CREATE INDEX "_home_v_version_results_cells_parent_id_idx" ON "_home_v_version_results_cells" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_home_v_version_results_cells_locales_locale_parent_id_uniqu" ON "_home_v_version_results_cells_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_home_v_version_results_cells_locales_parent_id_idx" ON "_home_v_version_results_cells_locales" USING btree ("_parent_id");
  CREATE INDEX "_home_v_version_lifecycle_steps_order_idx" ON "_home_v_version_lifecycle_steps" USING btree ("_order");
  CREATE INDEX "_home_v_version_lifecycle_steps_parent_id_idx" ON "_home_v_version_lifecycle_steps" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_home_v_version_lifecycle_steps_locales_locale_parent_id_uni" ON "_home_v_version_lifecycle_steps_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_home_v_version_lifecycle_steps_locales_parent_id_idx" ON "_home_v_version_lifecycle_steps_locales" USING btree ("_parent_id");
  CREATE INDEX "_home_v_version_lifecycle_levels_order_idx" ON "_home_v_version_lifecycle_levels" USING btree ("_order");
  CREATE INDEX "_home_v_version_lifecycle_levels_parent_id_idx" ON "_home_v_version_lifecycle_levels" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_home_v_version_lifecycle_levels_locales_locale_parent_id_un" ON "_home_v_version_lifecycle_levels_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_home_v_version_lifecycle_levels_locales_parent_id_idx" ON "_home_v_version_lifecycle_levels_locales" USING btree ("_parent_id");
  CREATE INDEX "_home_v_version_projects_chips_order_idx" ON "_home_v_version_projects_chips" USING btree ("_order");
  CREATE INDEX "_home_v_version_projects_chips_parent_id_idx" ON "_home_v_version_projects_chips" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_home_v_version_projects_chips_locales_locale_parent_id_uniq" ON "_home_v_version_projects_chips_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_home_v_version_projects_chips_locales_parent_id_idx" ON "_home_v_version_projects_chips_locales" USING btree ("_parent_id");
  CREATE INDEX "_home_v_version_corridors_china_bullets_order_idx" ON "_home_v_version_corridors_china_bullets" USING btree ("_order");
  CREATE INDEX "_home_v_version_corridors_china_bullets_parent_id_idx" ON "_home_v_version_corridors_china_bullets" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_home_v_version_corridors_china_bullets_locales_locale_paren" ON "_home_v_version_corridors_china_bullets_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_home_v_version_corridors_china_bullets_locales_parent_i_idx" ON "_home_v_version_corridors_china_bullets_locales" USING btree ("_parent_id");
  CREATE INDEX "_home_v_version_membership_categories_order_idx" ON "_home_v_version_membership_categories" USING btree ("_order");
  CREATE INDEX "_home_v_version_membership_categories_parent_id_idx" ON "_home_v_version_membership_categories" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_home_v_version_membership_categories_locales_locale_parent_" ON "_home_v_version_membership_categories_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_home_v_version_membership_categories_locales_parent_id_idx" ON "_home_v_version_membership_categories_locales" USING btree ("_parent_id");
  CREATE INDEX "_home_v_version_leadership_version_leadership_person_idx" ON "_home_v" USING btree ("version_leadership_person_id");
  CREATE INDEX "_home_v_created_at_idx" ON "_home_v" USING btree ("created_at");
  CREATE INDEX "_home_v_updated_at_idx" ON "_home_v" USING btree ("updated_at");
  CREATE UNIQUE INDEX "_home_v_locales_locale_parent_id_unique" ON "_home_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_home_v_locales_parent_id_idx" ON "_home_v_locales" USING btree ("_parent_id");
  CREATE INDEX "settings_wechat_qr_idx" ON "settings" USING btree ("wechat_qr_id");
  CREATE UNIQUE INDEX "settings_locales_locale_parent_id_unique" ON "settings_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "settings_locales_parent_id_idx" ON "settings_locales" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "kpi_targets_locales_locale_parent_id_unique" ON "kpi_targets_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "kpi_targets_locales_parent_id_idx" ON "kpi_targets_locales" USING btree ("_parent_id");
  CREATE INDEX "scoring_config_dimensions_order_idx" ON "scoring_config_dimensions" USING btree ("_order");
  CREATE INDEX "scoring_config_dimensions_parent_id_idx" ON "scoring_config_dimensions" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "scoring_config_dimensions_locales_locale_parent_id_unique" ON "scoring_config_dimensions_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "scoring_config_dimensions_locales_parent_id_idx" ON "scoring_config_dimensions_locales" USING btree ("_parent_id");
  CREATE INDEX "scoring_config_grades_order_idx" ON "scoring_config_grades" USING btree ("_order");
  CREATE INDEX "scoring_config_grades_parent_id_idx" ON "scoring_config_grades" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "scoring_config_grades_locales_locale_parent_id_unique" ON "scoring_config_grades_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "scoring_config_grades_locales_parent_id_idx" ON "scoring_config_grades_locales" USING btree ("_parent_id");
  CREATE INDEX "_scoring_config_v_version_dimensions_order_idx" ON "_scoring_config_v_version_dimensions" USING btree ("_order");
  CREATE INDEX "_scoring_config_v_version_dimensions_parent_id_idx" ON "_scoring_config_v_version_dimensions" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_scoring_config_v_version_dimensions_locales_locale_parent_i" ON "_scoring_config_v_version_dimensions_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_scoring_config_v_version_dimensions_locales_parent_id_idx" ON "_scoring_config_v_version_dimensions_locales" USING btree ("_parent_id");
  CREATE INDEX "_scoring_config_v_version_grades_order_idx" ON "_scoring_config_v_version_grades" USING btree ("_order");
  CREATE INDEX "_scoring_config_v_version_grades_parent_id_idx" ON "_scoring_config_v_version_grades" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_scoring_config_v_version_grades_locales_locale_parent_id_un" ON "_scoring_config_v_version_grades_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_scoring_config_v_version_grades_locales_parent_id_idx" ON "_scoring_config_v_version_grades_locales" USING btree ("_parent_id");
  CREATE INDEX "_scoring_config_v_created_at_idx" ON "_scoring_config_v" USING btree ("created_at");
  CREATE INDEX "_scoring_config_v_updated_at_idx" ON "_scoring_config_v" USING btree ("updated_at");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "admins_roles" CASCADE;
  DROP TABLE "admins_login_history" CASCADE;
  DROP TABLE "admins_sessions" CASCADE;
  DROP TABLE "admins" CASCADE;
  DROP TABLE "users_roles" CASCADE;
  DROP TABLE "users_login_history" CASCADE;
  DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "media_locales" CASCADE;
  DROP TABLE "pages_blocks_paragraphs" CASCADE;
  DROP TABLE "pages_blocks_paragraphs_locales" CASCADE;
  DROP TABLE "pages_blocks_cards_items" CASCADE;
  DROP TABLE "pages_blocks_cards_items_locales" CASCADE;
  DROP TABLE "pages_blocks_cards" CASCADE;
  DROP TABLE "pages_blocks_cards_locales" CASCADE;
  DROP TABLE "pages_blocks_steps_items" CASCADE;
  DROP TABLE "pages_blocks_steps_items_locales" CASCADE;
  DROP TABLE "pages_blocks_steps" CASCADE;
  DROP TABLE "pages_blocks_steps_locales" CASCADE;
  DROP TABLE "pages_blocks_facts_items" CASCADE;
  DROP TABLE "pages_blocks_facts_items_locales" CASCADE;
  DROP TABLE "pages_blocks_facts" CASCADE;
  DROP TABLE "pages_blocks_facts_locales" CASCADE;
  DROP TABLE "pages_blocks_faq_items" CASCADE;
  DROP TABLE "pages_blocks_faq_items_locales" CASCADE;
  DROP TABLE "pages_blocks_faq" CASCADE;
  DROP TABLE "pages_blocks_faq_locales" CASCADE;
  DROP TABLE "pages_blocks_table_columns" CASCADE;
  DROP TABLE "pages_blocks_table_columns_locales" CASCADE;
  DROP TABLE "pages_blocks_table_rows_cells" CASCADE;
  DROP TABLE "pages_blocks_table_rows_cells_locales" CASCADE;
  DROP TABLE "pages_blocks_table_rows" CASCADE;
  DROP TABLE "pages_blocks_table" CASCADE;
  DROP TABLE "pages_blocks_table_locales" CASCADE;
  DROP TABLE "pages_blocks_notice" CASCADE;
  DROP TABLE "pages_blocks_notice_locales" CASCADE;
  DROP TABLE "pages_blocks_links_items" CASCADE;
  DROP TABLE "pages_blocks_links_items_locales" CASCADE;
  DROP TABLE "pages_blocks_links" CASCADE;
  DROP TABLE "pages_blocks_links_locales" CASCADE;
  DROP TABLE "pages" CASCADE;
  DROP TABLE "pages_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_paragraphs" CASCADE;
  DROP TABLE "_pages_v_blocks_paragraphs_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_cards_items" CASCADE;
  DROP TABLE "_pages_v_blocks_cards_items_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_cards" CASCADE;
  DROP TABLE "_pages_v_blocks_cards_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_steps_items" CASCADE;
  DROP TABLE "_pages_v_blocks_steps_items_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_steps" CASCADE;
  DROP TABLE "_pages_v_blocks_steps_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_facts_items" CASCADE;
  DROP TABLE "_pages_v_blocks_facts_items_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_facts" CASCADE;
  DROP TABLE "_pages_v_blocks_facts_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_faq_items" CASCADE;
  DROP TABLE "_pages_v_blocks_faq_items_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_faq" CASCADE;
  DROP TABLE "_pages_v_blocks_faq_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_table_columns" CASCADE;
  DROP TABLE "_pages_v_blocks_table_columns_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_table_rows_cells" CASCADE;
  DROP TABLE "_pages_v_blocks_table_rows_cells_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_table_rows" CASCADE;
  DROP TABLE "_pages_v_blocks_table" CASCADE;
  DROP TABLE "_pages_v_blocks_table_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_notice" CASCADE;
  DROP TABLE "_pages_v_blocks_notice_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_links_items" CASCADE;
  DROP TABLE "_pages_v_blocks_links_items_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_links" CASCADE;
  DROP TABLE "_pages_v_blocks_links_locales" CASCADE;
  DROP TABLE "_pages_v" CASCADE;
  DROP TABLE "_pages_v_locales" CASCADE;
  DROP TABLE "people" CASCADE;
  DROP TABLE "people_locales" CASCADE;
  DROP TABLE "_people_v" CASCADE;
  DROP TABLE "_people_v_locales" CASCADE;
  DROP TABLE "services_blocks_paragraphs" CASCADE;
  DROP TABLE "services_blocks_paragraphs_locales" CASCADE;
  DROP TABLE "services_blocks_cards_items" CASCADE;
  DROP TABLE "services_blocks_cards_items_locales" CASCADE;
  DROP TABLE "services_blocks_cards" CASCADE;
  DROP TABLE "services_blocks_cards_locales" CASCADE;
  DROP TABLE "services_blocks_steps_items" CASCADE;
  DROP TABLE "services_blocks_steps_items_locales" CASCADE;
  DROP TABLE "services_blocks_steps" CASCADE;
  DROP TABLE "services_blocks_steps_locales" CASCADE;
  DROP TABLE "services_blocks_facts_items" CASCADE;
  DROP TABLE "services_blocks_facts_items_locales" CASCADE;
  DROP TABLE "services_blocks_facts" CASCADE;
  DROP TABLE "services_blocks_facts_locales" CASCADE;
  DROP TABLE "services_blocks_faq_items" CASCADE;
  DROP TABLE "services_blocks_faq_items_locales" CASCADE;
  DROP TABLE "services_blocks_faq" CASCADE;
  DROP TABLE "services_blocks_faq_locales" CASCADE;
  DROP TABLE "services_blocks_table_columns" CASCADE;
  DROP TABLE "services_blocks_table_columns_locales" CASCADE;
  DROP TABLE "services_blocks_table_rows_cells" CASCADE;
  DROP TABLE "services_blocks_table_rows_cells_locales" CASCADE;
  DROP TABLE "services_blocks_table_rows" CASCADE;
  DROP TABLE "services_blocks_table" CASCADE;
  DROP TABLE "services_blocks_table_locales" CASCADE;
  DROP TABLE "services_blocks_notice" CASCADE;
  DROP TABLE "services_blocks_notice_locales" CASCADE;
  DROP TABLE "services_blocks_links_items" CASCADE;
  DROP TABLE "services_blocks_links_items_locales" CASCADE;
  DROP TABLE "services_blocks_links" CASCADE;
  DROP TABLE "services_blocks_links_locales" CASCADE;
  DROP TABLE "services" CASCADE;
  DROP TABLE "services_locales" CASCADE;
  DROP TABLE "_services_v_blocks_paragraphs" CASCADE;
  DROP TABLE "_services_v_blocks_paragraphs_locales" CASCADE;
  DROP TABLE "_services_v_blocks_cards_items" CASCADE;
  DROP TABLE "_services_v_blocks_cards_items_locales" CASCADE;
  DROP TABLE "_services_v_blocks_cards" CASCADE;
  DROP TABLE "_services_v_blocks_cards_locales" CASCADE;
  DROP TABLE "_services_v_blocks_steps_items" CASCADE;
  DROP TABLE "_services_v_blocks_steps_items_locales" CASCADE;
  DROP TABLE "_services_v_blocks_steps" CASCADE;
  DROP TABLE "_services_v_blocks_steps_locales" CASCADE;
  DROP TABLE "_services_v_blocks_facts_items" CASCADE;
  DROP TABLE "_services_v_blocks_facts_items_locales" CASCADE;
  DROP TABLE "_services_v_blocks_facts" CASCADE;
  DROP TABLE "_services_v_blocks_facts_locales" CASCADE;
  DROP TABLE "_services_v_blocks_faq_items" CASCADE;
  DROP TABLE "_services_v_blocks_faq_items_locales" CASCADE;
  DROP TABLE "_services_v_blocks_faq" CASCADE;
  DROP TABLE "_services_v_blocks_faq_locales" CASCADE;
  DROP TABLE "_services_v_blocks_table_columns" CASCADE;
  DROP TABLE "_services_v_blocks_table_columns_locales" CASCADE;
  DROP TABLE "_services_v_blocks_table_rows_cells" CASCADE;
  DROP TABLE "_services_v_blocks_table_rows_cells_locales" CASCADE;
  DROP TABLE "_services_v_blocks_table_rows" CASCADE;
  DROP TABLE "_services_v_blocks_table" CASCADE;
  DROP TABLE "_services_v_blocks_table_locales" CASCADE;
  DROP TABLE "_services_v_blocks_notice" CASCADE;
  DROP TABLE "_services_v_blocks_notice_locales" CASCADE;
  DROP TABLE "_services_v_blocks_links_items" CASCADE;
  DROP TABLE "_services_v_blocks_links_items_locales" CASCADE;
  DROP TABLE "_services_v_blocks_links" CASCADE;
  DROP TABLE "_services_v_blocks_links_locales" CASCADE;
  DROP TABLE "_services_v" CASCADE;
  DROP TABLE "_services_v_locales" CASCADE;
  DROP TABLE "projects_internal_stage_history" CASCADE;
  DROP TABLE "projects_internal_risks" CASCADE;
  DROP TABLE "projects_internal_pipeline_steps" CASCADE;
  DROP TABLE "projects" CASCADE;
  DROP TABLE "projects_locales" CASCADE;
  DROP TABLE "projects_rels" CASCADE;
  DROP TABLE "news" CASCADE;
  DROP TABLE "news_locales" CASCADE;
  DROP TABLE "_news_v" CASCADE;
  DROP TABLE "_news_v_locales" CASCADE;
  DROP TABLE "events" CASCADE;
  DROP TABLE "events_locales" CASCADE;
  DROP TABLE "_events_v" CASCADE;
  DROP TABLE "_events_v_locales" CASCADE;
  DROP TABLE "videos" CASCADE;
  DROP TABLE "videos_locales" CASCADE;
  DROP TABLE "_videos_v" CASCADE;
  DROP TABLE "_videos_v_locales" CASCADE;
  DROP TABLE "albums_photos" CASCADE;
  DROP TABLE "albums_photos_locales" CASCADE;
  DROP TABLE "albums" CASCADE;
  DROP TABLE "albums_locales" CASCADE;
  DROP TABLE "_albums_v_version_photos" CASCADE;
  DROP TABLE "_albums_v_version_photos_locales" CASCADE;
  DROP TABLE "_albums_v" CASCADE;
  DROP TABLE "_albums_v_locales" CASCADE;
  DROP TABLE "partners" CASCADE;
  DROP TABLE "partners_locales" CASCADE;
  DROP TABLE "_partners_v" CASCADE;
  DROP TABLE "_partners_v_locales" CASCADE;
  DROP TABLE "documents" CASCADE;
  DROP TABLE "documents_locales" CASCADE;
  DROP TABLE "_documents_v" CASCADE;
  DROP TABLE "_documents_v_locales" CASCADE;
  DROP TABLE "submissions" CASCADE;
  DROP TABLE "organizations" CASCADE;
  DROP TABLE "organizations_rels" CASCADE;
  DROP TABLE "investors_sectors" CASCADE;
  DROP TABLE "investors_regions" CASCADE;
  DROP TABLE "investors_models" CASCADE;
  DROP TABLE "investors" CASCADE;
  DROP TABLE "scorecards_entries" CASCADE;
  DROP TABLE "scorecards_assessments" CASCADE;
  DROP TABLE "scorecards" CASCADE;
  DROP TABLE "scorecards_rels" CASCADE;
  DROP TABLE "coi_declarations" CASCADE;
  DROP TABLE "matches" CASCADE;
  DROP TABLE "ndas" CASCADE;
  DROP TABLE "dataroom_files" CASCADE;
  DROP TABLE "dataroom_log" CASCADE;
  DROP TABLE "agreements" CASCADE;
  DROP TABLE "members_fees" CASCADE;
  DROP TABLE "members" CASCADE;
  DROP TABLE "issues" CASCADE;
  DROP TABLE "audit_log" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TABLE "home_hero_facts" CASCADE;
  DROP TABLE "home_hero_facts_locales" CASCADE;
  DROP TABLE "home_audience_cards" CASCADE;
  DROP TABLE "home_audience_cards_locales" CASCADE;
  DROP TABLE "home_results_cells" CASCADE;
  DROP TABLE "home_results_cells_locales" CASCADE;
  DROP TABLE "home_lifecycle_steps" CASCADE;
  DROP TABLE "home_lifecycle_steps_locales" CASCADE;
  DROP TABLE "home_lifecycle_levels" CASCADE;
  DROP TABLE "home_lifecycle_levels_locales" CASCADE;
  DROP TABLE "home_projects_chips" CASCADE;
  DROP TABLE "home_projects_chips_locales" CASCADE;
  DROP TABLE "home_corridors_china_bullets" CASCADE;
  DROP TABLE "home_corridors_china_bullets_locales" CASCADE;
  DROP TABLE "home_membership_categories" CASCADE;
  DROP TABLE "home_membership_categories_locales" CASCADE;
  DROP TABLE "home" CASCADE;
  DROP TABLE "home_locales" CASCADE;
  DROP TABLE "_home_v_version_hero_facts" CASCADE;
  DROP TABLE "_home_v_version_hero_facts_locales" CASCADE;
  DROP TABLE "_home_v_version_audience_cards" CASCADE;
  DROP TABLE "_home_v_version_audience_cards_locales" CASCADE;
  DROP TABLE "_home_v_version_results_cells" CASCADE;
  DROP TABLE "_home_v_version_results_cells_locales" CASCADE;
  DROP TABLE "_home_v_version_lifecycle_steps" CASCADE;
  DROP TABLE "_home_v_version_lifecycle_steps_locales" CASCADE;
  DROP TABLE "_home_v_version_lifecycle_levels" CASCADE;
  DROP TABLE "_home_v_version_lifecycle_levels_locales" CASCADE;
  DROP TABLE "_home_v_version_projects_chips" CASCADE;
  DROP TABLE "_home_v_version_projects_chips_locales" CASCADE;
  DROP TABLE "_home_v_version_corridors_china_bullets" CASCADE;
  DROP TABLE "_home_v_version_corridors_china_bullets_locales" CASCADE;
  DROP TABLE "_home_v_version_membership_categories" CASCADE;
  DROP TABLE "_home_v_version_membership_categories_locales" CASCADE;
  DROP TABLE "_home_v" CASCADE;
  DROP TABLE "_home_v_locales" CASCADE;
  DROP TABLE "settings" CASCADE;
  DROP TABLE "settings_locales" CASCADE;
  DROP TABLE "kpi_targets" CASCADE;
  DROP TABLE "kpi_targets_locales" CASCADE;
  DROP TABLE "scoring_config_dimensions" CASCADE;
  DROP TABLE "scoring_config_dimensions_locales" CASCADE;
  DROP TABLE "scoring_config_grades" CASCADE;
  DROP TABLE "scoring_config_grades_locales" CASCADE;
  DROP TABLE "scoring_config" CASCADE;
  DROP TABLE "_scoring_config_v_version_dimensions" CASCADE;
  DROP TABLE "_scoring_config_v_version_dimensions_locales" CASCADE;
  DROP TABLE "_scoring_config_v_version_grades" CASCADE;
  DROP TABLE "_scoring_config_v_version_grades_locales" CASCADE;
  DROP TABLE "_scoring_config_v" CASCADE;
  DROP TYPE "public"."_locales";
  DROP TYPE "public"."enum_admins_roles";
  DROP TYPE "public"."enum_admins_region";
  DROP TYPE "public"."enum_users_roles";
  DROP TYPE "public"."enum_users_status";
  DROP TYPE "public"."enum_users_locale";
  DROP TYPE "public"."enum_media_license";
  DROP TYPE "public"."enum_pages_blocks_cards_items_icon";
  DROP TYPE "public"."enum_pages_blocks_cards_columns";
  DROP TYPE "public"."enum_pages_blocks_notice_tone";
  DROP TYPE "public"."enum_pages_section";
  DROP TYPE "public"."enum_pages_translation_status_kk";
  DROP TYPE "public"."enum_pages_translation_status_ru";
  DROP TYPE "public"."enum_pages_translation_status_en";
  DROP TYPE "public"."enum_pages_translation_status_zh";
  DROP TYPE "public"."enum_pages_status";
  DROP TYPE "public"."enum__pages_v_blocks_cards_items_icon";
  DROP TYPE "public"."enum__pages_v_blocks_cards_columns";
  DROP TYPE "public"."enum__pages_v_blocks_notice_tone";
  DROP TYPE "public"."enum__pages_v_version_section";
  DROP TYPE "public"."enum__pages_v_version_translation_status_kk";
  DROP TYPE "public"."enum__pages_v_version_translation_status_ru";
  DROP TYPE "public"."enum__pages_v_version_translation_status_en";
  DROP TYPE "public"."enum__pages_v_version_translation_status_zh";
  DROP TYPE "public"."enum__pages_v_version_status";
  DROP TYPE "public"."enum__pages_v_published_locale";
  DROP TYPE "public"."enum_people_group";
  DROP TYPE "public"."enum_people_translation_status_kk";
  DROP TYPE "public"."enum_people_translation_status_ru";
  DROP TYPE "public"."enum_people_translation_status_en";
  DROP TYPE "public"."enum_people_translation_status_zh";
  DROP TYPE "public"."enum_people_status";
  DROP TYPE "public"."enum__people_v_version_group";
  DROP TYPE "public"."enum__people_v_version_translation_status_kk";
  DROP TYPE "public"."enum__people_v_version_translation_status_ru";
  DROP TYPE "public"."enum__people_v_version_translation_status_en";
  DROP TYPE "public"."enum__people_v_version_translation_status_zh";
  DROP TYPE "public"."enum__people_v_version_status";
  DROP TYPE "public"."enum__people_v_published_locale";
  DROP TYPE "public"."enum_services_blocks_cards_items_icon";
  DROP TYPE "public"."enum_services_blocks_cards_columns";
  DROP TYPE "public"."enum_services_blocks_notice_tone";
  DROP TYPE "public"."enum_services_icon";
  DROP TYPE "public"."enum_services_translation_status_kk";
  DROP TYPE "public"."enum_services_translation_status_ru";
  DROP TYPE "public"."enum_services_translation_status_en";
  DROP TYPE "public"."enum_services_translation_status_zh";
  DROP TYPE "public"."enum_services_status";
  DROP TYPE "public"."enum__services_v_blocks_cards_items_icon";
  DROP TYPE "public"."enum__services_v_blocks_cards_columns";
  DROP TYPE "public"."enum__services_v_blocks_notice_tone";
  DROP TYPE "public"."enum__services_v_version_icon";
  DROP TYPE "public"."enum__services_v_version_translation_status_kk";
  DROP TYPE "public"."enum__services_v_version_translation_status_ru";
  DROP TYPE "public"."enum__services_v_version_translation_status_en";
  DROP TYPE "public"."enum__services_v_version_translation_status_zh";
  DROP TYPE "public"."enum__services_v_version_status";
  DROP TYPE "public"."enum__services_v_published_locale";
  DROP TYPE "public"."enum_projects_internal_risks_type";
  DROP TYPE "public"."enum_projects_internal_risks_level";
  DROP TYPE "public"."enum_projects_internal_risks_status";
  DROP TYPE "public"."enum_projects_sector";
  DROP TYPE "public"."enum_projects_region";
  DROP TYPE "public"."enum_projects_model";
  DROP TYPE "public"."enum_projects_level";
  DROP TYPE "public"."enum_projects_stage";
  DROP TYPE "public"."enum_projects_icon_key";
  DROP TYPE "public"."enum_projects_internal_risk_level";
  DROP TYPE "public"."enum_projects_internal_committee_decision";
  DROP TYPE "public"."enum_projects_internal_amounts_association_contribution";
  DROP TYPE "public"."enum_projects_translation_status_kk";
  DROP TYPE "public"."enum_projects_translation_status_ru";
  DROP TYPE "public"."enum_projects_translation_status_en";
  DROP TYPE "public"."enum_projects_translation_status_zh";
  DROP TYPE "public"."enum_news_category";
  DROP TYPE "public"."enum_news_translation_status_kk";
  DROP TYPE "public"."enum_news_translation_status_ru";
  DROP TYPE "public"."enum_news_translation_status_en";
  DROP TYPE "public"."enum_news_translation_status_zh";
  DROP TYPE "public"."enum_news_status";
  DROP TYPE "public"."enum__news_v_version_category";
  DROP TYPE "public"."enum__news_v_version_translation_status_kk";
  DROP TYPE "public"."enum__news_v_version_translation_status_ru";
  DROP TYPE "public"."enum__news_v_version_translation_status_en";
  DROP TYPE "public"."enum__news_v_version_translation_status_zh";
  DROP TYPE "public"."enum__news_v_version_status";
  DROP TYPE "public"."enum__news_v_published_locale";
  DROP TYPE "public"."enum_events_format";
  DROP TYPE "public"."enum_events_translation_status_kk";
  DROP TYPE "public"."enum_events_translation_status_ru";
  DROP TYPE "public"."enum_events_translation_status_en";
  DROP TYPE "public"."enum_events_translation_status_zh";
  DROP TYPE "public"."enum_events_status";
  DROP TYPE "public"."enum__events_v_version_format";
  DROP TYPE "public"."enum__events_v_version_translation_status_kk";
  DROP TYPE "public"."enum__events_v_version_translation_status_ru";
  DROP TYPE "public"."enum__events_v_version_translation_status_en";
  DROP TYPE "public"."enum__events_v_version_translation_status_zh";
  DROP TYPE "public"."enum__events_v_version_status";
  DROP TYPE "public"."enum__events_v_published_locale";
  DROP TYPE "public"."enum_videos_translation_status_kk";
  DROP TYPE "public"."enum_videos_translation_status_ru";
  DROP TYPE "public"."enum_videos_translation_status_en";
  DROP TYPE "public"."enum_videos_translation_status_zh";
  DROP TYPE "public"."enum_videos_status";
  DROP TYPE "public"."enum__videos_v_version_translation_status_kk";
  DROP TYPE "public"."enum__videos_v_version_translation_status_ru";
  DROP TYPE "public"."enum__videos_v_version_translation_status_en";
  DROP TYPE "public"."enum__videos_v_version_translation_status_zh";
  DROP TYPE "public"."enum__videos_v_version_status";
  DROP TYPE "public"."enum__videos_v_published_locale";
  DROP TYPE "public"."enum_albums_translation_status_kk";
  DROP TYPE "public"."enum_albums_translation_status_ru";
  DROP TYPE "public"."enum_albums_translation_status_en";
  DROP TYPE "public"."enum_albums_translation_status_zh";
  DROP TYPE "public"."enum_albums_status";
  DROP TYPE "public"."enum__albums_v_version_translation_status_kk";
  DROP TYPE "public"."enum__albums_v_version_translation_status_ru";
  DROP TYPE "public"."enum__albums_v_version_translation_status_en";
  DROP TYPE "public"."enum__albums_v_version_translation_status_zh";
  DROP TYPE "public"."enum__albums_v_version_status";
  DROP TYPE "public"."enum__albums_v_published_locale";
  DROP TYPE "public"."enum_partners_kind";
  DROP TYPE "public"."enum_partners_translation_status_kk";
  DROP TYPE "public"."enum_partners_translation_status_ru";
  DROP TYPE "public"."enum_partners_translation_status_en";
  DROP TYPE "public"."enum_partners_translation_status_zh";
  DROP TYPE "public"."enum_partners_status";
  DROP TYPE "public"."enum__partners_v_version_kind";
  DROP TYPE "public"."enum__partners_v_version_translation_status_kk";
  DROP TYPE "public"."enum__partners_v_version_translation_status_ru";
  DROP TYPE "public"."enum__partners_v_version_translation_status_en";
  DROP TYPE "public"."enum__partners_v_version_translation_status_zh";
  DROP TYPE "public"."enum__partners_v_version_status";
  DROP TYPE "public"."enum__partners_v_published_locale";
  DROP TYPE "public"."enum_documents_category";
  DROP TYPE "public"."enum_documents_translation_status_kk";
  DROP TYPE "public"."enum_documents_translation_status_ru";
  DROP TYPE "public"."enum_documents_translation_status_en";
  DROP TYPE "public"."enum_documents_translation_status_zh";
  DROP TYPE "public"."enum_documents_status";
  DROP TYPE "public"."enum__documents_v_version_category";
  DROP TYPE "public"."enum__documents_v_version_translation_status_kk";
  DROP TYPE "public"."enum__documents_v_version_translation_status_ru";
  DROP TYPE "public"."enum__documents_v_version_translation_status_en";
  DROP TYPE "public"."enum__documents_v_version_translation_status_zh";
  DROP TYPE "public"."enum__documents_v_version_status";
  DROP TYPE "public"."enum__documents_v_published_locale";
  DROP TYPE "public"."enum_submissions_kind";
  DROP TYPE "public"."enum_submissions_status";
  DROP TYPE "public"."enum_organizations_sector";
  DROP TYPE "public"."enum_investors_sectors";
  DROP TYPE "public"."enum_investors_regions";
  DROP TYPE "public"."enum_investors_models";
  DROP TYPE "public"."enum_investors_kind";
  DROP TYPE "public"."enum_investors_direction";
  DROP TYPE "public"."enum_investors_risk_appetite";
  DROP TYPE "public"."enum_investors_status";
  DROP TYPE "public"."enum_investors_grade";
  DROP TYPE "public"."enum_scorecards_entries_dimension";
  DROP TYPE "public"."enum_scorecards_assessments_role";
  DROP TYPE "public"."enum_matches_status";
  DROP TYPE "public"."enum_ndas_method";
  DROP TYPE "public"."enum_dataroom_files_category";
  DROP TYPE "public"."enum_dataroom_log_action";
  DROP TYPE "public"."enum_agreements_type";
  DROP TYPE "public"."enum_members_category";
  DROP TYPE "public"."enum_members_status";
  DROP TYPE "public"."enum_issues_type";
  DROP TYPE "public"."enum_issues_status";
  DROP TYPE "public"."enum_audit_log_action";
  DROP TYPE "public"."enum_home_translation_status_kk";
  DROP TYPE "public"."enum_home_translation_status_ru";
  DROP TYPE "public"."enum_home_translation_status_en";
  DROP TYPE "public"."enum_home_translation_status_zh";
  DROP TYPE "public"."enum__home_v_version_translation_status_kk";
  DROP TYPE "public"."enum__home_v_version_translation_status_ru";
  DROP TYPE "public"."enum__home_v_version_translation_status_en";
  DROP TYPE "public"."enum__home_v_version_translation_status_zh";
  DROP TYPE "public"."enum_settings_policy_translation_policy";
  DROP TYPE "public"."enum_scoring_config_dimensions_key";
  DROP TYPE "public"."enum_scoring_config_grades_key";
  DROP TYPE "public"."enum__scoring_config_v_version_dimensions_key";
  DROP TYPE "public"."enum__scoring_config_v_version_grades_key";`)
}
