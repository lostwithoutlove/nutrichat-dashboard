import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T;
export type InputMaybe<T> = T;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  AccountNumber: { input: any; output: any; }
  CountryCode: { input: any; output: any; }
  Currency: { input: any; output: any; }
  /** [GraphQL Scalars - DateTime](https://the-guild.dev/graphql/scalars/docs/scalars/date-time) */
  Date: { input: any; output: any; }
  /** Custom scalar for RFC3339 timestamps (maps to timestamptz). */
  DateTime: { input: any; output: any; }
  Duration: { input: any; output: any; }
  EmailAddress: { input: any; output: any; }
  /** Arbitrary JSON payload (maps to jsonb). */
  JSON: { input: any; output: any; }
  NonNegativeInt: { input: any; output: any; }
  PhoneNumber: { input: any; output: any; }
  Time: { input: any; output: any; }
  TimeZone: { input: any; output: any; }
  URL: { input: any; output: any; }
  /** Custom scalar for Postgres uuid. */
  UUID: { input: any; output: any; }
  Upload: { input: any; output: any; }
};

export type AddMealItemInput = {
  caloriesKcal?: InputMaybe<Scalars['Float']['input']>;
  carbsG?: InputMaybe<Scalars['Float']['input']>;
  fatG?: InputMaybe<Scalars['Float']['input']>;
  fiberG?: InputMaybe<Scalars['Float']['input']>;
  foodName: Scalars['String']['input'];
  mealId: Scalars['UUID']['input'];
  micros?: InputMaybe<Scalars['JSON']['input']>;
  proteinG?: InputMaybe<Scalars['Float']['input']>;
  quantity?: InputMaybe<Scalars['Float']['input']>;
  sodiumMg?: InputMaybe<Scalars['Float']['input']>;
  sugarG?: InputMaybe<Scalars['Float']['input']>;
  unit?: InputMaybe<Scalars['String']['input']>;
};

export type Allergy = {
  __typename?: 'Allergy';
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['UUID']['output'];
  notedAt: Scalars['DateTime']['output'];
  notes?: Maybe<Scalars['String']['output']>;
  reaction?: Maybe<Scalars['String']['output']>;
  severity: SeverityLevel;
  substance: Scalars['String']['output'];
  userId: Scalars['UUID']['output'];
};

export enum BiologicalSex {
  Female = 'female',
  Intersex = 'intersex',
  Male = 'male',
  Unspecified = 'unspecified'
}

/** Chat mutation input */
export type ChatInput = {
  /**
   * Base64-encoded audio data for voice input. When provided, audio is transcribed
   * to text and processed through the same pipeline as text messages.
   */
  audioBase64?: InputMaybe<Scalars['String']['input']>;
  /** The conversation ID to add messages to. If null, a new conversation will be created. */
  conversationId?: InputMaybe<Scalars['UUID']['input']>;
  /**
   * Base64-encoded image data (JPEG/PNG). When provided, the image is analyzed
   * using vision AI. If food is detected, it is auto-logged as a meal.
   * Non-food images receive a conversational response without logging.
   */
  imageBase64?: InputMaybe<Scalars['String']['input']>;
  /** Whether to include user context (profile, recent logs) in the prompt */
  includeContext?: InputMaybe<Scalars['Boolean']['input']>;
  /** User's text message. Required unless audioBase64 is provided. */
  message?: InputMaybe<Scalars['String']['input']>;
};

/** Response from the chat mutation */
export type ChatResponse = {
  __typename?: 'ChatResponse';
  /** AI assistant's response */
  assistantMessage: Message;
  /** Whether the response was served from cache */
  cached: Scalars['Boolean']['output'];
  /** The conversation ID (existing or newly created) */
  conversationId: Scalars['UUID']['output'];
  /** Whether any data was logged based on the intent */
  dataLogged: Scalars['Boolean']['output'];
  /** Detected intent from the user's message */
  detectedIntent?: Maybe<Scalars['String']['output']>;
  /** Confidence score of the intent detection (0-1) */
  intentConfidence?: Maybe<Scalars['Float']['output']>;
  /** Details about the logged data, if any */
  loggedData?: Maybe<LoggedDataInfo>;
  /** Analyzed meal data with macros/micros (only for meal logging intents) */
  mealAnalysis?: Maybe<MealAnalysis>;
  /** Token usage for this request (null if cached) */
  tokenUsage?: Maybe<TokenUsage>;
  /** The transcribed text from audio input (null if text input was used) */
  transcribedText?: Maybe<Scalars['String']['output']>;
  /** User's message that was sent */
  userMessage: Message;
};

export type Conversation = {
  __typename?: 'Conversation';
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['UUID']['output'];
  messages: Array<Message>;
  title?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['DateTime']['output'];
  userId: Scalars['UUID']['output'];
};


export type ConversationMessagesArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};

export type ConversationPage = {
  __typename?: 'ConversationPage';
  nodes: Array<Conversation>;
  total: Scalars['Int']['output'];
};

export type CreateConversationInput = {
  title?: InputMaybe<Scalars['String']['input']>;
};

export type CreateProfileInput = {
  country?: InputMaybe<Scalars['String']['input']>;
  dob?: InputMaybe<Scalars['String']['input']>;
  fullName?: InputMaybe<Scalars['String']['input']>;
  heightCm?: InputMaybe<Scalars['Float']['input']>;
  sex: BiologicalSex;
  targetWeightKg?: InputMaybe<Scalars['Float']['input']>;
  timezone?: InputMaybe<Scalars['String']['input']>;
  weightKg?: InputMaybe<Scalars['Float']['input']>;
};

/** Create a new health report (e.g. lab result, imaging, clinical note). */
export type CreateReportInput = {
  data?: InputMaybe<Scalars['JSON']['input']>;
  filePath?: InputMaybe<Scalars['String']['input']>;
  note?: InputMaybe<Scalars['String']['input']>;
  reportType?: ReportType;
  reportedAt?: InputMaybe<Scalars['DateTime']['input']>;
  title: Scalars['String']['input'];
};

export type DailyAggregate = {
  __typename?: 'DailyAggregate';
  calPct?: Maybe<Scalars['Float']['output']>;
  carbsG: Scalars['Float']['output'];
  carbsPct?: Maybe<Scalars['Float']['output']>;
  day: Scalars['String']['output'];
  exerciseCal: Scalars['Float']['output'];
  exerciseMin: Scalars['Int']['output'];
  fatG: Scalars['Float']['output'];
  fatPct?: Maybe<Scalars['Float']['output']>;
  goalCalKcal?: Maybe<Scalars['Float']['output']>;
  goalCarbsG?: Maybe<Scalars['Float']['output']>;
  goalFatG?: Maybe<Scalars['Float']['output']>;
  goalProteinG?: Maybe<Scalars['Float']['output']>;
  moodAvg?: Maybe<Scalars['Float']['output']>;
  proteinG: Scalars['Float']['output'];
  proteinPct?: Maybe<Scalars['Float']['output']>;
  symptomsCount: Scalars['Int']['output'];
  totalCalKcal: Scalars['Float']['output'];
  userId: Scalars['UUID']['output'];
  weightKg?: Maybe<Scalars['Float']['output']>;
};

export type DailyAggregatePage = {
  __typename?: 'DailyAggregatePage';
  nodes: Array<DailyAggregate>;
  total: Scalars['Int']['output'];
};

export type Diagnosis = {
  __typename?: 'Diagnosis';
  code?: Maybe<Scalars['String']['output']>;
  condition: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  diagnosedAt: Scalars['DateTime']['output'];
  id: Scalars['UUID']['output'];
  notes?: Maybe<Scalars['String']['output']>;
  providerName?: Maybe<Scalars['String']['output']>;
  status: DiagnosisStatus;
  userId: Scalars['UUID']['output'];
};

export enum DiagnosisStatus {
  Active = 'active',
  Recurrence = 'recurrence',
  Resolved = 'resolved',
  Suspected = 'suspected'
}

export type EditMealInput = {
  consumedAt?: InputMaybe<Scalars['DateTime']['input']>;
  id: Scalars['UUID']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
  newItemsDescription?: InputMaybe<Scalars['String']['input']>;
  notes?: InputMaybe<Scalars['String']['input']>;
};

export type EditProfileInput = {
  country?: InputMaybe<Scalars['String']['input']>;
  dob?: InputMaybe<Scalars['String']['input']>;
  fullName?: InputMaybe<Scalars['String']['input']>;
  heightCm?: InputMaybe<Scalars['Float']['input']>;
  sex?: InputMaybe<BiologicalSex>;
  targetWeightKg?: InputMaybe<Scalars['Float']['input']>;
  timezone?: InputMaybe<Scalars['String']['input']>;
  weightKg?: InputMaybe<Scalars['Float']['input']>;
};

export type Exercise = {
  __typename?: 'Exercise';
  caloriesBurned?: Maybe<Scalars['Float']['output']>;
  createdAt: Scalars['DateTime']['output'];
  day: Scalars['String']['output'];
  durationMin: Scalars['Int']['output'];
  id: Scalars['UUID']['output'];
  intensity: IntensityLevel;
  notes?: Maybe<Scalars['String']['output']>;
  occurredAt: Scalars['DateTime']['output'];
  type: Scalars['String']['output'];
  userId: Scalars['UUID']['output'];
};

export enum IntensityLevel {
  High = 'high',
  Low = 'low',
  Moderate = 'moderate'
}

export type LogExerciseInput = {
  caloriesBurned?: InputMaybe<Scalars['Float']['input']>;
  durationMin: Scalars['Int']['input'];
  intensity?: InputMaybe<IntensityLevel>;
  notes?: InputMaybe<Scalars['String']['input']>;
  occurredAt?: InputMaybe<Scalars['DateTime']['input']>;
  type: Scalars['String']['input'];
};

export type LogMoodInput = {
  note?: InputMaybe<Scalars['String']['input']>;
  recordedAt?: InputMaybe<Scalars['DateTime']['input']>;
  score: Scalars['Int']['input'];
};

export type LogSymptomInput = {
  endedAt?: InputMaybe<Scalars['DateTime']['input']>;
  name: Scalars['String']['input'];
  notes?: InputMaybe<Scalars['String']['input']>;
  severity?: InputMaybe<SeverityLevel>;
  startedAt?: InputMaybe<Scalars['DateTime']['input']>;
  tags?: InputMaybe<Array<Scalars['String']['input']>>;
};

export type LogVitalInput = {
  kind: Scalars['String']['input'];
  note?: InputMaybe<Scalars['String']['input']>;
  recordedAt?: InputMaybe<Scalars['DateTime']['input']>;
  unit?: InputMaybe<Scalars['String']['input']>;
  value: Scalars['Float']['input'];
};

/** Information about data that was logged */
export type LoggedDataInfo = {
  __typename?: 'LoggedDataInfo';
  /** Human-readable description of what was logged */
  description: Scalars['String']['output'];
  /** The ID of the logged record */
  recordId: Scalars['UUID']['output'];
  /** The table where data was logged */
  tableName: Scalars['String']['output'];
};

export type Meal = {
  __typename?: 'Meal';
  consumedAt: Scalars['DateTime']['output'];
  createdAt: Scalars['DateTime']['output'];
  day: Scalars['String']['output'];
  id: Scalars['UUID']['output'];
  items: Array<MealItem>;
  name?: Maybe<Scalars['String']['output']>;
  notes?: Maybe<Scalars['String']['output']>;
  source?: Maybe<Scalars['String']['output']>;
  totals: MealTotals;
  userId: Scalars['UUID']['output'];
};


export type MealItemsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};

/** Meal analysis with detailed nutrition information */
export type MealAnalysis = {
  __typename?: 'MealAnalysis';
  consumedAt?: Maybe<Scalars['DateTime']['output']>;
  items: Array<MealItemAnalysis>;
  mealName: Scalars['String']['output'];
  notes?: Maybe<Scalars['String']['output']>;
  totalCalories: Scalars['Int']['output'];
  totalCarbs: Scalars['Float']['output'];
  totalFat: Scalars['Float']['output'];
  totalFiber?: Maybe<Scalars['Float']['output']>;
  totalProtein: Scalars['Float']['output'];
  totalSodium?: Maybe<Scalars['Float']['output']>;
  totalSugar?: Maybe<Scalars['Float']['output']>;
};

export type MealItem = {
  __typename?: 'MealItem';
  caloriesKcal?: Maybe<Scalars['Float']['output']>;
  carbsG?: Maybe<Scalars['Float']['output']>;
  fatG?: Maybe<Scalars['Float']['output']>;
  fiberG?: Maybe<Scalars['Float']['output']>;
  foodName: Scalars['String']['output'];
  id: Scalars['UUID']['output'];
  mealId: Scalars['UUID']['output'];
  micros?: Maybe<Scalars['JSON']['output']>;
  proteinG?: Maybe<Scalars['Float']['output']>;
  quantity: Scalars['Float']['output'];
  sodiumMg?: Maybe<Scalars['Float']['output']>;
  sugarG?: Maybe<Scalars['Float']['output']>;
  unit?: Maybe<Scalars['String']['output']>;
};

/** Individual meal item with nutrition details */
export type MealItemAnalysis = {
  __typename?: 'MealItemAnalysis';
  calories: Scalars['Int']['output'];
  carbs: Scalars['Float']['output'];
  cholesterol?: Maybe<Scalars['Float']['output']>;
  fat: Scalars['Float']['output'];
  fiber?: Maybe<Scalars['Float']['output']>;
  name: Scalars['String']['output'];
  protein: Scalars['Float']['output'];
  quantity: Scalars['Float']['output'];
  sodium?: Maybe<Scalars['Float']['output']>;
  sugar?: Maybe<Scalars['Float']['output']>;
  unit: Scalars['String']['output'];
};

export type MealPage = {
  __typename?: 'MealPage';
  nodes: Array<Meal>;
  total: Scalars['Int']['output'];
};

export type MealTotals = {
  __typename?: 'MealTotals';
  caloriesKcal: Scalars['Float']['output'];
  carbsG: Scalars['Float']['output'];
  fatG: Scalars['Float']['output'];
  proteinG: Scalars['Float']['output'];
};

export type Medication = {
  __typename?: 'Medication';
  createdAt: Scalars['DateTime']['output'];
  dose?: Maybe<Scalars['Float']['output']>;
  doseUnit?: Maybe<Scalars['String']['output']>;
  endedAt?: Maybe<Scalars['DateTime']['output']>;
  frequency?: Maybe<Scalars['String']['output']>;
  id: Scalars['UUID']['output'];
  medType: MedicationType;
  name: Scalars['String']['output'];
  notes?: Maybe<Scalars['String']['output']>;
  prn: Scalars['Boolean']['output'];
  route?: Maybe<Scalars['String']['output']>;
  startedAt?: Maybe<Scalars['DateTime']['output']>;
  userId: Scalars['UUID']['output'];
};

export enum MedicationType {
  Medication = 'medication',
  Supplement = 'supplement'
}

export type MentalHealthEntry = {
  __typename?: 'MentalHealthEntry';
  category: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  day: Scalars['String']['output'];
  id: Scalars['UUID']['output'];
  note?: Maybe<Scalars['String']['output']>;
  recordedAt: Scalars['DateTime']['output'];
  unit?: Maybe<Scalars['String']['output']>;
  userId: Scalars['UUID']['output'];
  value: Scalars['Float']['output'];
};

export type Message = {
  __typename?: 'Message';
  content: Scalars['JSON']['output'];
  conversationId: Scalars['UUID']['output'];
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['UUID']['output'];
  role: MessageRole;
  tokenCount?: Maybe<Scalars['Int']['output']>;
  userId?: Maybe<Scalars['UUID']['output']>;
};

export type MessagePage = {
  __typename?: 'MessagePage';
  nodes: Array<Message>;
  total: Scalars['Int']['output'];
};

export enum MessageRole {
  Assistant = 'assistant',
  System = 'system',
  Tool = 'tool',
  User = 'user'
}

export type MessageSearchHit = {
  __typename?: 'MessageSearchHit';
  content: Scalars['JSON']['output'];
  messageId: Scalars['UUID']['output'];
  role: MessageRole;
  similarity: Scalars['Float']['output'];
};

export type Mood = {
  __typename?: 'Mood';
  createdAt: Scalars['DateTime']['output'];
  day: Scalars['String']['output'];
  id: Scalars['UUID']['output'];
  note?: Maybe<Scalars['String']['output']>;
  recordedAt: Scalars['DateTime']['output'];
  score: Scalars['Int']['output'];
  userId: Scalars['UUID']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  /** Smart chat endpoint that handles intent detection, data logging, and AI responses. */
  chat: ChatResponse;
  /** Profile management */
  createProfile: Profile;
  /** Delete a meal. */
  deleteMeal: Scalars['Boolean']['output'];
  deleteMealItem: Scalars['Boolean']['output'];
  deleteProfile: Scalars['Boolean']['output'];
  /** Edit an existing meal's metadata. */
  editMeal: Meal;
  editProfile: Profile;
  uploadReport: Report;
};


export type MutationChatArgs = {
  input: ChatInput;
};


export type MutationCreateProfileArgs = {
  input: CreateProfileInput;
};


export type MutationDeleteMealArgs = {
  id: Scalars['UUID']['input'];
};


export type MutationDeleteMealItemArgs = {
  id: Scalars['UUID']['input'];
};


export type MutationEditMealArgs = {
  input: EditMealInput;
};


export type MutationEditProfileArgs = {
  input: EditProfileInput;
};


export type MutationUploadReportArgs = {
  input: UploadReportInput;
};

export type NutritionAverages = {
  __typename?: 'NutritionAverages';
  calories: Scalars['Float']['output'];
  caloriesTarget?: Maybe<Scalars['Float']['output']>;
  carbs: Scalars['Float']['output'];
  fat: Scalars['Float']['output'];
  fiber?: Maybe<Scalars['Float']['output']>;
  protein: Scalars['Float']['output'];
};

export type NutritionGoal = {
  __typename?: 'NutritionGoal';
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['UUID']['output'];
  minDaysLogging?: Maybe<Scalars['Int']['output']>;
  notes?: Maybe<Scalars['String']['output']>;
  targetCalKcal?: Maybe<Scalars['Float']['output']>;
  targetCarbsG?: Maybe<Scalars['Float']['output']>;
  targetFatG?: Maybe<Scalars['Float']['output']>;
  targetProteinG?: Maybe<Scalars['Float']['output']>;
  userId: Scalars['UUID']['output'];
  validFrom: Scalars['String']['output'];
  validTo?: Maybe<Scalars['String']['output']>;
};

export type NutritionTrendPoint = {
  __typename?: 'NutritionTrendPoint';
  calories: Scalars['Float']['output'];
  carbs: Scalars['Float']['output'];
  date: Scalars['String']['output'];
  fat: Scalars['Float']['output'];
  fiber?: Maybe<Scalars['Float']['output']>;
  protein: Scalars['Float']['output'];
};

export type NutritionTrends = {
  __typename?: 'NutritionTrends';
  averages: NutritionAverages;
  timePeriod: TimePeriod;
  trends: Array<NutritionTrendPoint>;
};

export type PostAssistantMessageInput = {
  content: Scalars['JSON']['input'];
  conversationId: Scalars['UUID']['input'];
};

export type PostUserMessageInput = {
  conversationId: Scalars['UUID']['input'];
  text: Scalars['String']['input'];
};

export type Profile = {
  __typename?: 'Profile';
  country?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  dob?: Maybe<Scalars['String']['output']>;
  fullName?: Maybe<Scalars['String']['output']>;
  heightCm?: Maybe<Scalars['Float']['output']>;
  sex: BiologicalSex;
  targetWeightKg?: Maybe<Scalars['Float']['output']>;
  timezone: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
  userId: Scalars['UUID']['output'];
  weightKg?: Maybe<Scalars['Float']['output']>;
};

export type Query = {
  __typename?: 'Query';
  conversation?: Maybe<Conversation>;
  conversations: ConversationPage;
  dailyAggregate?: Maybe<DailyAggregate>;
  dailyAggregates: DailyAggregatePage;
  /** Current user's profile (RLS enforces ownership). */
  me?: Maybe<Profile>;
  meal?: Maybe<Meal>;
  meals: MealPage;
  messages: MessagePage;
  nutritionGoals: Array<NutritionGoal>;
  /** Get nutrition trends and averages for a specific time period. */
  nutritionTrends: NutritionTrends;
  profile?: Maybe<Profile>;
  report?: Maybe<Report>;
  /** Get a temporary signed URL to download/view a report's PDF. */
  reportDownloadUrl?: Maybe<Scalars['String']['output']>;
  reports: ReportPage;
  /** Semantic search: pass a query embedding (same dimension as stored vectors). */
  searchMessagesByEmbedding: Array<MessageSearchHit>;
  searchReportsByEmbedding: Array<ReportSearchHit>;
  /**
   * Get symptoms with optional name filter and date range.
   * Used for menstrual tracking, symptom history, etc.
   */
  symptoms: Array<Symptom>;
  /** Get vitals by kind (e.g. "weight") with optional date range. */
  vitals: Array<Vital>;
};


export type QueryConversationArgs = {
  id: Scalars['UUID']['input'];
};


export type QueryConversationsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryDailyAggregateArgs = {
  day: Scalars['String']['input'];
};


export type QueryDailyAggregatesArgs = {
  endDay: Scalars['String']['input'];
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  startDay: Scalars['String']['input'];
};


export type QueryMealArgs = {
  id: Scalars['UUID']['input'];
};


export type QueryMealsArgs = {
  day?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryMessagesArgs = {
  conversationId: Scalars['UUID']['input'];
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryNutritionGoalsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryNutritionTrendsArgs = {
  timePeriod: TimePeriod;
};


export type QueryProfileArgs = {
  userId: Scalars['UUID']['input'];
};


export type QueryReportArgs = {
  id: Scalars['UUID']['input'];
};


export type QueryReportDownloadUrlArgs = {
  reportId: Scalars['UUID']['input'];
};


export type QueryReportsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type QuerySearchMessagesByEmbeddingArgs = {
  conversationId: Scalars['UUID']['input'];
  limit?: InputMaybe<Scalars['Int']['input']>;
  queryEmbedding: Array<Scalars['Float']['input']>;
};


export type QuerySearchReportsByEmbeddingArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  queryEmbedding: Array<Scalars['Float']['input']>;
};


export type QuerySymptomsArgs = {
  endDay?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  startDay?: InputMaybe<Scalars['String']['input']>;
};


export type QueryVitalsArgs = {
  endDay?: InputMaybe<Scalars['String']['input']>;
  kind: Scalars['String']['input'];
  limit?: InputMaybe<Scalars['Int']['input']>;
  startDay?: InputMaybe<Scalars['String']['input']>;
};

export type Report = {
  __typename?: 'Report';
  createdAt: Scalars['DateTime']['output'];
  data?: Maybe<Scalars['JSON']['output']>;
  filePath?: Maybe<Scalars['String']['output']>;
  id: Scalars['UUID']['output'];
  note?: Maybe<Scalars['String']['output']>;
  reportType: ReportType;
  reportedAt: Scalars['DateTime']['output'];
  title: Scalars['String']['output'];
  userId: Scalars['UUID']['output'];
};

export type ReportPage = {
  __typename?: 'ReportPage';
  nodes: Array<Report>;
  total: Scalars['Int']['output'];
};

export type ReportSearchHit = {
  __typename?: 'ReportSearchHit';
  data?: Maybe<Scalars['JSON']['output']>;
  filePath?: Maybe<Scalars['String']['output']>;
  reportId: Scalars['UUID']['output'];
  reportType: ReportType;
  similarity: Scalars['Float']['output'];
  title: Scalars['String']['output'];
};

export enum ReportType {
  ClinicalNote = 'clinical_note',
  Imaging = 'imaging',
  Lab = 'lab',
  Other = 'other'
}

export type SetNutritionGoalInput = {
  id?: InputMaybe<Scalars['UUID']['input']>;
  minDaysLogging?: InputMaybe<Scalars['Int']['input']>;
  notes?: InputMaybe<Scalars['String']['input']>;
  targetCalKcal?: InputMaybe<Scalars['Float']['input']>;
  targetCarbsG?: InputMaybe<Scalars['Float']['input']>;
  targetFatG?: InputMaybe<Scalars['Float']['input']>;
  targetProteinG?: InputMaybe<Scalars['Float']['input']>;
  validFrom: Scalars['String']['input'];
  validTo?: InputMaybe<Scalars['String']['input']>;
};

export enum SeverityLevel {
  Critical = 'critical',
  Mild = 'mild',
  Moderate = 'moderate',
  None = 'none',
  Severe = 'severe'
}

export type Subscription = {
  __typename?: 'Subscription';
  /** Daily aggregate recomputed notifications (emit after recompute triggers run). */
  dailyAggregateUpdated: DailyAggregate;
  /** Stream new messages in a conversation (hook to Supabase realtime or NOTIFY/LISTEN). */
  messageAdded: Message;
};


export type SubscriptionDailyAggregateUpdatedArgs = {
  day: Scalars['String']['input'];
};


export type SubscriptionMessageAddedArgs = {
  conversationId: Scalars['UUID']['input'];
};

export type Symptom = {
  __typename?: 'Symptom';
  createdAt: Scalars['DateTime']['output'];
  day: Scalars['String']['output'];
  endedAt?: Maybe<Scalars['DateTime']['output']>;
  id: Scalars['UUID']['output'];
  name: Scalars['String']['output'];
  notes?: Maybe<Scalars['String']['output']>;
  severity: SeverityLevel;
  startedAt: Scalars['DateTime']['output'];
  tags?: Maybe<Array<Scalars['String']['output']>>;
  userId: Scalars['UUID']['output'];
};

export enum TimePeriod {
  AllTime = 'ALL_TIME',
  OneMonth = 'ONE_MONTH',
  OneWeek = 'ONE_WEEK',
  OneYear = 'ONE_YEAR',
  ThreeMonths = 'THREE_MONTHS'
}

/** Token usage information */
export type TokenUsage = {
  __typename?: 'TokenUsage';
  completionTokens: Scalars['Int']['output'];
  promptTokens: Scalars['Int']['output'];
  totalTokens: Scalars['Int']['output'];
};

export type UpdateMealItemInput = {
  caloriesKcal?: InputMaybe<Scalars['Float']['input']>;
  carbsG?: InputMaybe<Scalars['Float']['input']>;
  fatG?: InputMaybe<Scalars['Float']['input']>;
  fiberG?: InputMaybe<Scalars['Float']['input']>;
  foodName?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['UUID']['input'];
  micros?: InputMaybe<Scalars['JSON']['input']>;
  proteinG?: InputMaybe<Scalars['Float']['input']>;
  quantity?: InputMaybe<Scalars['Float']['input']>;
  sodiumMg?: InputMaybe<Scalars['Float']['input']>;
  sugarG?: InputMaybe<Scalars['Float']['input']>;
  unit?: InputMaybe<Scalars['String']['input']>;
};

/** Upload a PDF report (blood work, prescription, etc.) to storage. */
export type UploadReportInput = {
  fileBase64: Scalars['String']['input'];
  fileName: Scalars['String']['input'];
  note?: InputMaybe<Scalars['String']['input']>;
  reportType?: ReportType;
  title: Scalars['String']['input'];
};

export type UpsertMealInput = {
  consumedAt?: InputMaybe<Scalars['DateTime']['input']>;
  id?: InputMaybe<Scalars['UUID']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  notes?: InputMaybe<Scalars['String']['input']>;
  source?: InputMaybe<Scalars['String']['input']>;
};

export type Vital = {
  __typename?: 'Vital';
  createdAt: Scalars['DateTime']['output'];
  day: Scalars['String']['output'];
  id: Scalars['UUID']['output'];
  kind: Scalars['String']['output'];
  note?: Maybe<Scalars['String']['output']>;
  recordedAt: Scalars['DateTime']['output'];
  unit?: Maybe<Scalars['String']['output']>;
  userId: Scalars['UUID']['output'];
  value: Scalars['Float']['output'];
};

export type ChatMutationVariables = Exact<{
  input: ChatInput;
}>;


export type ChatMutation = { __typename?: 'Mutation', chat: { __typename?: 'ChatResponse', conversationId: any, detectedIntent?: string, intentConfidence?: number, dataLogged: boolean, transcribedText?: string, cached: boolean, userMessage: { __typename?: 'Message', id: any, conversationId: any, userId?: any, role: MessageRole, content: any, tokenCount?: number, createdAt: any }, assistantMessage: { __typename?: 'Message', id: any, conversationId: any, role: MessageRole, content: any, tokenCount?: number, createdAt: any }, loggedData?: { __typename?: 'LoggedDataInfo', tableName: string, recordId: any, description: string }, tokenUsage?: { __typename?: 'TokenUsage', promptTokens: number, completionTokens: number, totalTokens: number } } };

export type GetMessagesQueryVariables = Exact<{
  conversationId: Scalars['UUID']['input'];
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
}>;


export type GetMessagesQuery = { __typename?: 'Query', messages: { __typename?: 'MessagePage', total: number, nodes: Array<{ __typename?: 'Message', id: any, conversationId: any, userId?: any, role: MessageRole, content: any, tokenCount?: number, createdAt: any }> } };

export type GetConversationsQueryVariables = Exact<{
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
}>;


export type GetConversationsQuery = { __typename?: 'Query', conversations: { __typename?: 'ConversationPage', total: number, nodes: Array<{ __typename?: 'Conversation', id: any, title?: string, createdAt: any, updatedAt: any, userId: any }> } };

export type GetConversationQueryVariables = Exact<{
  id: Scalars['UUID']['input'];
  messagesLimit?: InputMaybe<Scalars['Int']['input']>;
  messagesOffset?: InputMaybe<Scalars['Int']['input']>;
}>;


export type GetConversationQuery = { __typename?: 'Query', conversation?: { __typename?: 'Conversation', id: any, title?: string, createdAt: any, updatedAt: any, userId: any, messages: Array<{ __typename?: 'Message', id: any, conversationId: any, userId?: any, role: MessageRole, content: any, tokenCount?: number, createdAt: any }> } };

export type GetDailyAggregatesQueryVariables = Exact<{
  startDay: Scalars['String']['input'];
  endDay: Scalars['String']['input'];
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
}>;


export type GetDailyAggregatesQuery = { __typename?: 'Query', dailyAggregates: { __typename?: 'DailyAggregatePage', total: number, nodes: Array<{ __typename?: 'DailyAggregate', day: string, totalCalKcal: number, goalCalKcal?: number }> } };

export type GetMealsQueryVariables = Exact<{
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  day?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetMealsQuery = { __typename?: 'Query', meals: { __typename?: 'MealPage', total: number, nodes: Array<{ __typename?: 'Meal', id: any, userId: any, name?: string, consumedAt: any, day: string, createdAt: any, notes?: string, source?: string, totals: { __typename?: 'MealTotals', caloriesKcal: number, proteinG: number, carbsG: number, fatG: number }, items: Array<{ __typename?: 'MealItem', id: any, mealId: any, foodName: string, quantity: number, unit?: string, caloriesKcal?: number, proteinG?: number, carbsG?: number, fatG?: number, fiberG?: number, sugarG?: number, sodiumMg?: number, micros?: any }> }> } };

export type DeleteMealMutationVariables = Exact<{
  id: Scalars['UUID']['input'];
}>;


export type DeleteMealMutation = { __typename?: 'Mutation', deleteMeal: boolean };

export type EditMealMutationVariables = Exact<{
  input: EditMealInput;
}>;


export type EditMealMutation = { __typename?: 'Mutation', editMeal: { __typename?: 'Meal', id: any, name?: string, consumedAt: any, notes?: string, day: string, items: Array<{ __typename?: 'MealItem', id: any, foodName: string, quantity: number, unit?: string, caloriesKcal?: number, proteinG?: number, carbsG?: number, fatG?: number, fiberG?: number }>, totals: { __typename?: 'MealTotals', caloriesKcal: number, proteinG: number, carbsG: number, fatG: number } } };

export type DeleteMealItemMutationVariables = Exact<{
  id: Scalars['UUID']['input'];
}>;


export type DeleteMealItemMutation = { __typename?: 'Mutation', deleteMealItem: boolean };

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = { __typename?: 'Query', me?: { __typename?: 'Profile', userId: any, fullName?: string, dob?: string, sex: BiologicalSex, heightCm?: number, weightKg?: number, targetWeightKg?: number, country?: string, timezone: string, createdAt: any, updatedAt: any } };

export type CreateProfileMutationVariables = Exact<{
  input: CreateProfileInput;
}>;


export type CreateProfileMutation = { __typename?: 'Mutation', createProfile: { __typename?: 'Profile', userId: any, fullName?: string, dob?: string, sex: BiologicalSex, heightCm?: number, weightKg?: number, targetWeightKg?: number, country?: string, timezone: string, createdAt: any, updatedAt: any } };

export type EditProfileMutationVariables = Exact<{
  input: EditProfileInput;
}>;


export type EditProfileMutation = { __typename?: 'Mutation', editProfile: { __typename?: 'Profile', userId: any, fullName?: string, dob?: string, sex: BiologicalSex, heightCm?: number, weightKg?: number, targetWeightKg?: number, country?: string, timezone: string, createdAt: any, updatedAt: any } };

export type DeleteProfileMutationVariables = Exact<{ [key: string]: never; }>;


export type DeleteProfileMutation = { __typename?: 'Mutation', deleteProfile: boolean };

export type UploadReportMutationVariables = Exact<{
  input: UploadReportInput;
}>;


export type UploadReportMutation = { __typename?: 'Mutation', uploadReport: { __typename?: 'Report', id: any, userId: any, reportedAt: any, reportType: ReportType, title: string, filePath?: string, note?: string, createdAt: any } };

export type GetReportsQueryVariables = Exact<{
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
}>;


export type GetReportsQuery = { __typename?: 'Query', reports: { __typename?: 'ReportPage', total: number, nodes: Array<{ __typename?: 'Report', id: any, userId: any, reportedAt: any, reportType: ReportType, title: string, filePath?: string, note?: string, createdAt: any }> } };

export type GetReportDownloadUrlQueryVariables = Exact<{
  reportId: Scalars['UUID']['input'];
}>;


export type GetReportDownloadUrlQuery = { __typename?: 'Query', reportDownloadUrl?: string };

export type GetWeightHistoryQueryVariables = Exact<{
  kind: Scalars['String']['input'];
  startDay?: InputMaybe<Scalars['String']['input']>;
  endDay?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
}>;


export type GetWeightHistoryQuery = { __typename?: 'Query', vitals: Array<{ __typename?: 'Vital', id: any, value: number, unit?: string, recordedAt: any, day: string }> };

export type GetMenstrualHistoryQueryVariables = Exact<{
  name?: InputMaybe<Scalars['String']['input']>;
  startDay?: InputMaybe<Scalars['String']['input']>;
  endDay?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
}>;


export type GetMenstrualHistoryQuery = { __typename?: 'Query', symptoms: Array<{ __typename?: 'Symptom', id: any, name: string, severity: SeverityLevel, startedAt: any, notes?: string, day: string }> };

export type GetWeeklyNutritionTrendsQueryVariables = Exact<{
  timePeriod: TimePeriod;
}>;


export type GetWeeklyNutritionTrendsQuery = { __typename?: 'Query', nutritionTrends: { __typename?: 'NutritionTrends', timePeriod: TimePeriod, trends: Array<{ __typename?: 'NutritionTrendPoint', date: string, calories: number, protein: number, carbs: number, fat: number, fiber?: number }>, averages: { __typename?: 'NutritionAverages', calories: number, caloriesTarget?: number, protein: number, carbs: number, fat: number, fiber?: number } } };


export const ChatDocument = gql`
    mutation Chat($input: ChatInput!) {
  chat(input: $input) {
    conversationId
    userMessage {
      id
      conversationId
      userId
      role
      content
      tokenCount
      createdAt
    }
    assistantMessage {
      id
      conversationId
      role
      content
      tokenCount
      createdAt
    }
    detectedIntent
    intentConfidence
    dataLogged
    loggedData {
      tableName
      recordId
      description
    }
    transcribedText
    cached
    tokenUsage {
      promptTokens
      completionTokens
      totalTokens
    }
  }
}
    `;
export type ChatMutationFn = Apollo.MutationFunction<ChatMutation, ChatMutationVariables>;

/**
 * __useChatMutation__
 *
 * To run a mutation, you first call `useChatMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useChatMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [chatMutation, { data, loading, error }] = useChatMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useChatMutation(baseOptions?: Apollo.MutationHookOptions<ChatMutation, ChatMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ChatMutation, ChatMutationVariables>(ChatDocument, options);
      }
export type ChatMutationHookResult = ReturnType<typeof useChatMutation>;
export type ChatMutationResult = Apollo.MutationResult<ChatMutation>;
export type ChatMutationOptions = Apollo.BaseMutationOptions<ChatMutation, ChatMutationVariables>;
export const GetMessagesDocument = gql`
    query GetMessages($conversationId: UUID!, $limit: Int, $offset: Int) {
  messages(conversationId: $conversationId, limit: $limit, offset: $offset) {
    nodes {
      id
      conversationId
      userId
      role
      content
      tokenCount
      createdAt
    }
    total
  }
}
    `;

/**
 * __useGetMessagesQuery__
 *
 * To run a query within a React component, call `useGetMessagesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetMessagesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetMessagesQuery({
 *   variables: {
 *      conversationId: // value for 'conversationId'
 *      limit: // value for 'limit'
 *      offset: // value for 'offset'
 *   },
 * });
 */
export function useGetMessagesQuery(baseOptions: Apollo.QueryHookOptions<GetMessagesQuery, GetMessagesQueryVariables> & ({ variables: GetMessagesQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetMessagesQuery, GetMessagesQueryVariables>(GetMessagesDocument, options);
      }
export function useGetMessagesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetMessagesQuery, GetMessagesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetMessagesQuery, GetMessagesQueryVariables>(GetMessagesDocument, options);
        }
// @ts-ignore
export function useGetMessagesSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetMessagesQuery, GetMessagesQueryVariables>): Apollo.UseSuspenseQueryResult<GetMessagesQuery, GetMessagesQueryVariables>;
export function useGetMessagesSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetMessagesQuery, GetMessagesQueryVariables>): Apollo.UseSuspenseQueryResult<GetMessagesQuery | undefined, GetMessagesQueryVariables>;
export function useGetMessagesSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetMessagesQuery, GetMessagesQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetMessagesQuery, GetMessagesQueryVariables>(GetMessagesDocument, options);
        }
export type GetMessagesQueryHookResult = ReturnType<typeof useGetMessagesQuery>;
export type GetMessagesLazyQueryHookResult = ReturnType<typeof useGetMessagesLazyQuery>;
export type GetMessagesSuspenseQueryHookResult = ReturnType<typeof useGetMessagesSuspenseQuery>;
export type GetMessagesQueryResult = Apollo.QueryResult<GetMessagesQuery, GetMessagesQueryVariables>;
export const GetConversationsDocument = gql`
    query GetConversations($limit: Int, $offset: Int) {
  conversations(limit: $limit, offset: $offset) {
    nodes {
      id
      title
      createdAt
      updatedAt
      userId
    }
    total
  }
}
    `;

/**
 * __useGetConversationsQuery__
 *
 * To run a query within a React component, call `useGetConversationsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetConversationsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetConversationsQuery({
 *   variables: {
 *      limit: // value for 'limit'
 *      offset: // value for 'offset'
 *   },
 * });
 */
export function useGetConversationsQuery(baseOptions?: Apollo.QueryHookOptions<GetConversationsQuery, GetConversationsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetConversationsQuery, GetConversationsQueryVariables>(GetConversationsDocument, options);
      }
export function useGetConversationsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetConversationsQuery, GetConversationsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetConversationsQuery, GetConversationsQueryVariables>(GetConversationsDocument, options);
        }
// @ts-ignore
export function useGetConversationsSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetConversationsQuery, GetConversationsQueryVariables>): Apollo.UseSuspenseQueryResult<GetConversationsQuery, GetConversationsQueryVariables>;
export function useGetConversationsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetConversationsQuery, GetConversationsQueryVariables>): Apollo.UseSuspenseQueryResult<GetConversationsQuery | undefined, GetConversationsQueryVariables>;
export function useGetConversationsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetConversationsQuery, GetConversationsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetConversationsQuery, GetConversationsQueryVariables>(GetConversationsDocument, options);
        }
export type GetConversationsQueryHookResult = ReturnType<typeof useGetConversationsQuery>;
export type GetConversationsLazyQueryHookResult = ReturnType<typeof useGetConversationsLazyQuery>;
export type GetConversationsSuspenseQueryHookResult = ReturnType<typeof useGetConversationsSuspenseQuery>;
export type GetConversationsQueryResult = Apollo.QueryResult<GetConversationsQuery, GetConversationsQueryVariables>;
export const GetConversationDocument = gql`
    query GetConversation($id: UUID!, $messagesLimit: Int, $messagesOffset: Int) {
  conversation(id: $id) {
    id
    title
    createdAt
    updatedAt
    userId
    messages(limit: $messagesLimit, offset: $messagesOffset) {
      id
      conversationId
      userId
      role
      content
      tokenCount
      createdAt
    }
  }
}
    `;

/**
 * __useGetConversationQuery__
 *
 * To run a query within a React component, call `useGetConversationQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetConversationQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetConversationQuery({
 *   variables: {
 *      id: // value for 'id'
 *      messagesLimit: // value for 'messagesLimit'
 *      messagesOffset: // value for 'messagesOffset'
 *   },
 * });
 */
export function useGetConversationQuery(baseOptions: Apollo.QueryHookOptions<GetConversationQuery, GetConversationQueryVariables> & ({ variables: GetConversationQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetConversationQuery, GetConversationQueryVariables>(GetConversationDocument, options);
      }
export function useGetConversationLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetConversationQuery, GetConversationQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetConversationQuery, GetConversationQueryVariables>(GetConversationDocument, options);
        }
// @ts-ignore
export function useGetConversationSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetConversationQuery, GetConversationQueryVariables>): Apollo.UseSuspenseQueryResult<GetConversationQuery, GetConversationQueryVariables>;
export function useGetConversationSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetConversationQuery, GetConversationQueryVariables>): Apollo.UseSuspenseQueryResult<GetConversationQuery | undefined, GetConversationQueryVariables>;
export function useGetConversationSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetConversationQuery, GetConversationQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetConversationQuery, GetConversationQueryVariables>(GetConversationDocument, options);
        }
export type GetConversationQueryHookResult = ReturnType<typeof useGetConversationQuery>;
export type GetConversationLazyQueryHookResult = ReturnType<typeof useGetConversationLazyQuery>;
export type GetConversationSuspenseQueryHookResult = ReturnType<typeof useGetConversationSuspenseQuery>;
export type GetConversationQueryResult = Apollo.QueryResult<GetConversationQuery, GetConversationQueryVariables>;
export const GetDailyAggregatesDocument = gql`
    query GetDailyAggregates($startDay: String!, $endDay: String!, $limit: Int, $offset: Int) {
  dailyAggregates(
    startDay: $startDay
    endDay: $endDay
    limit: $limit
    offset: $offset
  ) {
    nodes {
      day
      totalCalKcal
      goalCalKcal
    }
    total
  }
}
    `;

/**
 * __useGetDailyAggregatesQuery__
 *
 * To run a query within a React component, call `useGetDailyAggregatesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetDailyAggregatesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetDailyAggregatesQuery({
 *   variables: {
 *      startDay: // value for 'startDay'
 *      endDay: // value for 'endDay'
 *      limit: // value for 'limit'
 *      offset: // value for 'offset'
 *   },
 * });
 */
export function useGetDailyAggregatesQuery(baseOptions: Apollo.QueryHookOptions<GetDailyAggregatesQuery, GetDailyAggregatesQueryVariables> & ({ variables: GetDailyAggregatesQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetDailyAggregatesQuery, GetDailyAggregatesQueryVariables>(GetDailyAggregatesDocument, options);
      }
export function useGetDailyAggregatesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetDailyAggregatesQuery, GetDailyAggregatesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetDailyAggregatesQuery, GetDailyAggregatesQueryVariables>(GetDailyAggregatesDocument, options);
        }
// @ts-ignore
export function useGetDailyAggregatesSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetDailyAggregatesQuery, GetDailyAggregatesQueryVariables>): Apollo.UseSuspenseQueryResult<GetDailyAggregatesQuery, GetDailyAggregatesQueryVariables>;
export function useGetDailyAggregatesSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetDailyAggregatesQuery, GetDailyAggregatesQueryVariables>): Apollo.UseSuspenseQueryResult<GetDailyAggregatesQuery | undefined, GetDailyAggregatesQueryVariables>;
export function useGetDailyAggregatesSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetDailyAggregatesQuery, GetDailyAggregatesQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetDailyAggregatesQuery, GetDailyAggregatesQueryVariables>(GetDailyAggregatesDocument, options);
        }
export type GetDailyAggregatesQueryHookResult = ReturnType<typeof useGetDailyAggregatesQuery>;
export type GetDailyAggregatesLazyQueryHookResult = ReturnType<typeof useGetDailyAggregatesLazyQuery>;
export type GetDailyAggregatesSuspenseQueryHookResult = ReturnType<typeof useGetDailyAggregatesSuspenseQuery>;
export type GetDailyAggregatesQueryResult = Apollo.QueryResult<GetDailyAggregatesQuery, GetDailyAggregatesQueryVariables>;
export const GetMealsDocument = gql`
    query GetMeals($limit: Int, $offset: Int, $day: String) {
  meals(limit: $limit, offset: $offset, day: $day) {
    nodes {
      id
      userId
      name
      consumedAt
      day
      createdAt
      notes
      source
      totals {
        caloriesKcal
        proteinG
        carbsG
        fatG
      }
      items {
        id
        mealId
        foodName
        quantity
        unit
        caloriesKcal
        proteinG
        carbsG
        fatG
        fiberG
        sugarG
        sodiumMg
        micros
      }
    }
    total
  }
}
    `;

/**
 * __useGetMealsQuery__
 *
 * To run a query within a React component, call `useGetMealsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetMealsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetMealsQuery({
 *   variables: {
 *      limit: // value for 'limit'
 *      offset: // value for 'offset'
 *      day: // value for 'day'
 *   },
 * });
 */
export function useGetMealsQuery(baseOptions?: Apollo.QueryHookOptions<GetMealsQuery, GetMealsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetMealsQuery, GetMealsQueryVariables>(GetMealsDocument, options);
      }
export function useGetMealsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetMealsQuery, GetMealsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetMealsQuery, GetMealsQueryVariables>(GetMealsDocument, options);
        }
// @ts-ignore
export function useGetMealsSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetMealsQuery, GetMealsQueryVariables>): Apollo.UseSuspenseQueryResult<GetMealsQuery, GetMealsQueryVariables>;
export function useGetMealsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetMealsQuery, GetMealsQueryVariables>): Apollo.UseSuspenseQueryResult<GetMealsQuery | undefined, GetMealsQueryVariables>;
export function useGetMealsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetMealsQuery, GetMealsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetMealsQuery, GetMealsQueryVariables>(GetMealsDocument, options);
        }
export type GetMealsQueryHookResult = ReturnType<typeof useGetMealsQuery>;
export type GetMealsLazyQueryHookResult = ReturnType<typeof useGetMealsLazyQuery>;
export type GetMealsSuspenseQueryHookResult = ReturnType<typeof useGetMealsSuspenseQuery>;
export type GetMealsQueryResult = Apollo.QueryResult<GetMealsQuery, GetMealsQueryVariables>;
export const DeleteMealDocument = gql`
    mutation DeleteMeal($id: UUID!) {
  deleteMeal(id: $id)
}
    `;
export type DeleteMealMutationFn = Apollo.MutationFunction<DeleteMealMutation, DeleteMealMutationVariables>;

/**
 * __useDeleteMealMutation__
 *
 * To run a mutation, you first call `useDeleteMealMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteMealMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteMealMutation, { data, loading, error }] = useDeleteMealMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteMealMutation(baseOptions?: Apollo.MutationHookOptions<DeleteMealMutation, DeleteMealMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteMealMutation, DeleteMealMutationVariables>(DeleteMealDocument, options);
      }
export type DeleteMealMutationHookResult = ReturnType<typeof useDeleteMealMutation>;
export type DeleteMealMutationResult = Apollo.MutationResult<DeleteMealMutation>;
export type DeleteMealMutationOptions = Apollo.BaseMutationOptions<DeleteMealMutation, DeleteMealMutationVariables>;
export const EditMealDocument = gql`
    mutation EditMeal($input: EditMealInput!) {
  editMeal(input: $input) {
    id
    name
    consumedAt
    notes
    day
    items {
      id
      foodName
      quantity
      unit
      caloriesKcal
      proteinG
      carbsG
      fatG
      fiberG
    }
    totals {
      caloriesKcal
      proteinG
      carbsG
      fatG
    }
  }
}
    `;
export type EditMealMutationFn = Apollo.MutationFunction<EditMealMutation, EditMealMutationVariables>;

/**
 * __useEditMealMutation__
 *
 * To run a mutation, you first call `useEditMealMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useEditMealMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [editMealMutation, { data, loading, error }] = useEditMealMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useEditMealMutation(baseOptions?: Apollo.MutationHookOptions<EditMealMutation, EditMealMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<EditMealMutation, EditMealMutationVariables>(EditMealDocument, options);
      }
export type EditMealMutationHookResult = ReturnType<typeof useEditMealMutation>;
export type EditMealMutationResult = Apollo.MutationResult<EditMealMutation>;
export type EditMealMutationOptions = Apollo.BaseMutationOptions<EditMealMutation, EditMealMutationVariables>;
export const DeleteMealItemDocument = gql`
    mutation DeleteMealItem($id: UUID!) {
  deleteMealItem(id: $id)
}
    `;
export type DeleteMealItemMutationFn = Apollo.MutationFunction<DeleteMealItemMutation, DeleteMealItemMutationVariables>;

/**
 * __useDeleteMealItemMutation__
 *
 * To run a mutation, you first call `useDeleteMealItemMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteMealItemMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteMealItemMutation, { data, loading, error }] = useDeleteMealItemMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteMealItemMutation(baseOptions?: Apollo.MutationHookOptions<DeleteMealItemMutation, DeleteMealItemMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteMealItemMutation, DeleteMealItemMutationVariables>(DeleteMealItemDocument, options);
      }
export type DeleteMealItemMutationHookResult = ReturnType<typeof useDeleteMealItemMutation>;
export type DeleteMealItemMutationResult = Apollo.MutationResult<DeleteMealItemMutation>;
export type DeleteMealItemMutationOptions = Apollo.BaseMutationOptions<DeleteMealItemMutation, DeleteMealItemMutationVariables>;
export const MeDocument = gql`
    query Me {
  me {
    userId
    fullName
    dob
    sex
    heightCm
    weightKg
    targetWeightKg
    country
    timezone
    createdAt
    updatedAt
  }
}
    `;

/**
 * __useMeQuery__
 *
 * To run a query within a React component, call `useMeQuery` and pass it any options that fit your needs.
 * When your component renders, `useMeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMeQuery({
 *   variables: {
 *   },
 * });
 */
export function useMeQuery(baseOptions?: Apollo.QueryHookOptions<MeQuery, MeQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<MeQuery, MeQueryVariables>(MeDocument, options);
      }
export function useMeLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MeQuery, MeQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<MeQuery, MeQueryVariables>(MeDocument, options);
        }
// @ts-ignore
export function useMeSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<MeQuery, MeQueryVariables>): Apollo.UseSuspenseQueryResult<MeQuery, MeQueryVariables>;
export function useMeSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<MeQuery, MeQueryVariables>): Apollo.UseSuspenseQueryResult<MeQuery | undefined, MeQueryVariables>;
export function useMeSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<MeQuery, MeQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<MeQuery, MeQueryVariables>(MeDocument, options);
        }
export type MeQueryHookResult = ReturnType<typeof useMeQuery>;
export type MeLazyQueryHookResult = ReturnType<typeof useMeLazyQuery>;
export type MeSuspenseQueryHookResult = ReturnType<typeof useMeSuspenseQuery>;
export type MeQueryResult = Apollo.QueryResult<MeQuery, MeQueryVariables>;
export const CreateProfileDocument = gql`
    mutation CreateProfile($input: CreateProfileInput!) {
  createProfile(input: $input) {
    userId
    fullName
    dob
    sex
    heightCm
    weightKg
    targetWeightKg
    country
    timezone
    createdAt
    updatedAt
  }
}
    `;
export type CreateProfileMutationFn = Apollo.MutationFunction<CreateProfileMutation, CreateProfileMutationVariables>;

/**
 * __useCreateProfileMutation__
 *
 * To run a mutation, you first call `useCreateProfileMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateProfileMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createProfileMutation, { data, loading, error }] = useCreateProfileMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateProfileMutation(baseOptions?: Apollo.MutationHookOptions<CreateProfileMutation, CreateProfileMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateProfileMutation, CreateProfileMutationVariables>(CreateProfileDocument, options);
      }
export type CreateProfileMutationHookResult = ReturnType<typeof useCreateProfileMutation>;
export type CreateProfileMutationResult = Apollo.MutationResult<CreateProfileMutation>;
export type CreateProfileMutationOptions = Apollo.BaseMutationOptions<CreateProfileMutation, CreateProfileMutationVariables>;
export const EditProfileDocument = gql`
    mutation EditProfile($input: EditProfileInput!) {
  editProfile(input: $input) {
    userId
    fullName
    dob
    sex
    heightCm
    weightKg
    targetWeightKg
    country
    timezone
    createdAt
    updatedAt
  }
}
    `;
export type EditProfileMutationFn = Apollo.MutationFunction<EditProfileMutation, EditProfileMutationVariables>;

/**
 * __useEditProfileMutation__
 *
 * To run a mutation, you first call `useEditProfileMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useEditProfileMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [editProfileMutation, { data, loading, error }] = useEditProfileMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useEditProfileMutation(baseOptions?: Apollo.MutationHookOptions<EditProfileMutation, EditProfileMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<EditProfileMutation, EditProfileMutationVariables>(EditProfileDocument, options);
      }
export type EditProfileMutationHookResult = ReturnType<typeof useEditProfileMutation>;
export type EditProfileMutationResult = Apollo.MutationResult<EditProfileMutation>;
export type EditProfileMutationOptions = Apollo.BaseMutationOptions<EditProfileMutation, EditProfileMutationVariables>;
export const DeleteProfileDocument = gql`
    mutation DeleteProfile {
  deleteProfile
}
    `;
export type DeleteProfileMutationFn = Apollo.MutationFunction<DeleteProfileMutation, DeleteProfileMutationVariables>;

/**
 * __useDeleteProfileMutation__
 *
 * To run a mutation, you first call `useDeleteProfileMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteProfileMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteProfileMutation, { data, loading, error }] = useDeleteProfileMutation({
 *   variables: {
 *   },
 * });
 */
export function useDeleteProfileMutation(baseOptions?: Apollo.MutationHookOptions<DeleteProfileMutation, DeleteProfileMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteProfileMutation, DeleteProfileMutationVariables>(DeleteProfileDocument, options);
      }
export type DeleteProfileMutationHookResult = ReturnType<typeof useDeleteProfileMutation>;
export type DeleteProfileMutationResult = Apollo.MutationResult<DeleteProfileMutation>;
export type DeleteProfileMutationOptions = Apollo.BaseMutationOptions<DeleteProfileMutation, DeleteProfileMutationVariables>;
export const UploadReportDocument = gql`
    mutation UploadReport($input: UploadReportInput!) {
  uploadReport(input: $input) {
    id
    userId
    reportedAt
    reportType
    title
    filePath
    note
    createdAt
  }
}
    `;
export type UploadReportMutationFn = Apollo.MutationFunction<UploadReportMutation, UploadReportMutationVariables>;

/**
 * __useUploadReportMutation__
 *
 * To run a mutation, you first call `useUploadReportMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUploadReportMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [uploadReportMutation, { data, loading, error }] = useUploadReportMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUploadReportMutation(baseOptions?: Apollo.MutationHookOptions<UploadReportMutation, UploadReportMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UploadReportMutation, UploadReportMutationVariables>(UploadReportDocument, options);
      }
export type UploadReportMutationHookResult = ReturnType<typeof useUploadReportMutation>;
export type UploadReportMutationResult = Apollo.MutationResult<UploadReportMutation>;
export type UploadReportMutationOptions = Apollo.BaseMutationOptions<UploadReportMutation, UploadReportMutationVariables>;
export const GetReportsDocument = gql`
    query GetReports($limit: Int, $offset: Int) {
  reports(limit: $limit, offset: $offset) {
    nodes {
      id
      userId
      reportedAt
      reportType
      title
      filePath
      note
      createdAt
    }
    total
  }
}
    `;

/**
 * __useGetReportsQuery__
 *
 * To run a query within a React component, call `useGetReportsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetReportsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetReportsQuery({
 *   variables: {
 *      limit: // value for 'limit'
 *      offset: // value for 'offset'
 *   },
 * });
 */
export function useGetReportsQuery(baseOptions?: Apollo.QueryHookOptions<GetReportsQuery, GetReportsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetReportsQuery, GetReportsQueryVariables>(GetReportsDocument, options);
      }
export function useGetReportsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetReportsQuery, GetReportsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetReportsQuery, GetReportsQueryVariables>(GetReportsDocument, options);
        }
// @ts-ignore
export function useGetReportsSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetReportsQuery, GetReportsQueryVariables>): Apollo.UseSuspenseQueryResult<GetReportsQuery, GetReportsQueryVariables>;
export function useGetReportsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetReportsQuery, GetReportsQueryVariables>): Apollo.UseSuspenseQueryResult<GetReportsQuery | undefined, GetReportsQueryVariables>;
export function useGetReportsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetReportsQuery, GetReportsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetReportsQuery, GetReportsQueryVariables>(GetReportsDocument, options);
        }
export type GetReportsQueryHookResult = ReturnType<typeof useGetReportsQuery>;
export type GetReportsLazyQueryHookResult = ReturnType<typeof useGetReportsLazyQuery>;
export type GetReportsSuspenseQueryHookResult = ReturnType<typeof useGetReportsSuspenseQuery>;
export type GetReportsQueryResult = Apollo.QueryResult<GetReportsQuery, GetReportsQueryVariables>;
export const GetReportDownloadUrlDocument = gql`
    query GetReportDownloadUrl($reportId: UUID!) {
  reportDownloadUrl(reportId: $reportId)
}
    `;

/**
 * __useGetReportDownloadUrlQuery__
 *
 * To run a query within a React component, call `useGetReportDownloadUrlQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetReportDownloadUrlQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetReportDownloadUrlQuery({
 *   variables: {
 *      reportId: // value for 'reportId'
 *   },
 * });
 */
export function useGetReportDownloadUrlQuery(baseOptions: Apollo.QueryHookOptions<GetReportDownloadUrlQuery, GetReportDownloadUrlQueryVariables> & ({ variables: GetReportDownloadUrlQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetReportDownloadUrlQuery, GetReportDownloadUrlQueryVariables>(GetReportDownloadUrlDocument, options);
      }
export function useGetReportDownloadUrlLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetReportDownloadUrlQuery, GetReportDownloadUrlQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetReportDownloadUrlQuery, GetReportDownloadUrlQueryVariables>(GetReportDownloadUrlDocument, options);
        }
// @ts-ignore
export function useGetReportDownloadUrlSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetReportDownloadUrlQuery, GetReportDownloadUrlQueryVariables>): Apollo.UseSuspenseQueryResult<GetReportDownloadUrlQuery, GetReportDownloadUrlQueryVariables>;
export function useGetReportDownloadUrlSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetReportDownloadUrlQuery, GetReportDownloadUrlQueryVariables>): Apollo.UseSuspenseQueryResult<GetReportDownloadUrlQuery | undefined, GetReportDownloadUrlQueryVariables>;
export function useGetReportDownloadUrlSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetReportDownloadUrlQuery, GetReportDownloadUrlQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetReportDownloadUrlQuery, GetReportDownloadUrlQueryVariables>(GetReportDownloadUrlDocument, options);
        }
export type GetReportDownloadUrlQueryHookResult = ReturnType<typeof useGetReportDownloadUrlQuery>;
export type GetReportDownloadUrlLazyQueryHookResult = ReturnType<typeof useGetReportDownloadUrlLazyQuery>;
export type GetReportDownloadUrlSuspenseQueryHookResult = ReturnType<typeof useGetReportDownloadUrlSuspenseQuery>;
export type GetReportDownloadUrlQueryResult = Apollo.QueryResult<GetReportDownloadUrlQuery, GetReportDownloadUrlQueryVariables>;
export const GetWeightHistoryDocument = gql`
    query GetWeightHistory($kind: String!, $startDay: String, $endDay: String, $limit: Int) {
  vitals(kind: $kind, startDay: $startDay, endDay: $endDay, limit: $limit) {
    id
    value
    unit
    recordedAt
    day
  }
}
    `;

/**
 * __useGetWeightHistoryQuery__
 *
 * To run a query within a React component, call `useGetWeightHistoryQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetWeightHistoryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetWeightHistoryQuery({
 *   variables: {
 *      kind: // value for 'kind'
 *      startDay: // value for 'startDay'
 *      endDay: // value for 'endDay'
 *      limit: // value for 'limit'
 *   },
 * });
 */
export function useGetWeightHistoryQuery(baseOptions: Apollo.QueryHookOptions<GetWeightHistoryQuery, GetWeightHistoryQueryVariables> & ({ variables: GetWeightHistoryQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetWeightHistoryQuery, GetWeightHistoryQueryVariables>(GetWeightHistoryDocument, options);
      }
export function useGetWeightHistoryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetWeightHistoryQuery, GetWeightHistoryQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetWeightHistoryQuery, GetWeightHistoryQueryVariables>(GetWeightHistoryDocument, options);
        }
// @ts-ignore
export function useGetWeightHistorySuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetWeightHistoryQuery, GetWeightHistoryQueryVariables>): Apollo.UseSuspenseQueryResult<GetWeightHistoryQuery, GetWeightHistoryQueryVariables>;
export function useGetWeightHistorySuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetWeightHistoryQuery, GetWeightHistoryQueryVariables>): Apollo.UseSuspenseQueryResult<GetWeightHistoryQuery | undefined, GetWeightHistoryQueryVariables>;
export function useGetWeightHistorySuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetWeightHistoryQuery, GetWeightHistoryQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetWeightHistoryQuery, GetWeightHistoryQueryVariables>(GetWeightHistoryDocument, options);
        }
export type GetWeightHistoryQueryHookResult = ReturnType<typeof useGetWeightHistoryQuery>;
export type GetWeightHistoryLazyQueryHookResult = ReturnType<typeof useGetWeightHistoryLazyQuery>;
export type GetWeightHistorySuspenseQueryHookResult = ReturnType<typeof useGetWeightHistorySuspenseQuery>;
export type GetWeightHistoryQueryResult = Apollo.QueryResult<GetWeightHistoryQuery, GetWeightHistoryQueryVariables>;
export const GetMenstrualHistoryDocument = gql`
    query GetMenstrualHistory($name: String, $startDay: String, $endDay: String, $limit: Int) {
  symptoms(name: $name, startDay: $startDay, endDay: $endDay, limit: $limit) {
    id
    name
    severity
    startedAt
    notes
    day
  }
}
    `;

/**
 * __useGetMenstrualHistoryQuery__
 *
 * To run a query within a React component, call `useGetMenstrualHistoryQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetMenstrualHistoryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetMenstrualHistoryQuery({
 *   variables: {
 *      name: // value for 'name'
 *      startDay: // value for 'startDay'
 *      endDay: // value for 'endDay'
 *      limit: // value for 'limit'
 *   },
 * });
 */
export function useGetMenstrualHistoryQuery(baseOptions?: Apollo.QueryHookOptions<GetMenstrualHistoryQuery, GetMenstrualHistoryQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetMenstrualHistoryQuery, GetMenstrualHistoryQueryVariables>(GetMenstrualHistoryDocument, options);
      }
export function useGetMenstrualHistoryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetMenstrualHistoryQuery, GetMenstrualHistoryQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetMenstrualHistoryQuery, GetMenstrualHistoryQueryVariables>(GetMenstrualHistoryDocument, options);
        }
// @ts-ignore
export function useGetMenstrualHistorySuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetMenstrualHistoryQuery, GetMenstrualHistoryQueryVariables>): Apollo.UseSuspenseQueryResult<GetMenstrualHistoryQuery, GetMenstrualHistoryQueryVariables>;
export function useGetMenstrualHistorySuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetMenstrualHistoryQuery, GetMenstrualHistoryQueryVariables>): Apollo.UseSuspenseQueryResult<GetMenstrualHistoryQuery | undefined, GetMenstrualHistoryQueryVariables>;
export function useGetMenstrualHistorySuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetMenstrualHistoryQuery, GetMenstrualHistoryQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetMenstrualHistoryQuery, GetMenstrualHistoryQueryVariables>(GetMenstrualHistoryDocument, options);
        }
export type GetMenstrualHistoryQueryHookResult = ReturnType<typeof useGetMenstrualHistoryQuery>;
export type GetMenstrualHistoryLazyQueryHookResult = ReturnType<typeof useGetMenstrualHistoryLazyQuery>;
export type GetMenstrualHistorySuspenseQueryHookResult = ReturnType<typeof useGetMenstrualHistorySuspenseQuery>;
export type GetMenstrualHistoryQueryResult = Apollo.QueryResult<GetMenstrualHistoryQuery, GetMenstrualHistoryQueryVariables>;
export const GetWeeklyNutritionTrendsDocument = gql`
    query GetWeeklyNutritionTrends($timePeriod: TimePeriod!) {
  nutritionTrends(timePeriod: $timePeriod) {
    timePeriod
    trends {
      date
      calories
      protein
      carbs
      fat
      fiber
    }
    averages {
      calories
      caloriesTarget
      protein
      carbs
      fat
      fiber
    }
  }
}
    `;

/**
 * __useGetWeeklyNutritionTrendsQuery__
 *
 * To run a query within a React component, call `useGetWeeklyNutritionTrendsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetWeeklyNutritionTrendsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetWeeklyNutritionTrendsQuery({
 *   variables: {
 *      timePeriod: // value for 'timePeriod'
 *   },
 * });
 */
export function useGetWeeklyNutritionTrendsQuery(baseOptions: Apollo.QueryHookOptions<GetWeeklyNutritionTrendsQuery, GetWeeklyNutritionTrendsQueryVariables> & ({ variables: GetWeeklyNutritionTrendsQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetWeeklyNutritionTrendsQuery, GetWeeklyNutritionTrendsQueryVariables>(GetWeeklyNutritionTrendsDocument, options);
      }
export function useGetWeeklyNutritionTrendsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetWeeklyNutritionTrendsQuery, GetWeeklyNutritionTrendsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetWeeklyNutritionTrendsQuery, GetWeeklyNutritionTrendsQueryVariables>(GetWeeklyNutritionTrendsDocument, options);
        }
// @ts-ignore
export function useGetWeeklyNutritionTrendsSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetWeeklyNutritionTrendsQuery, GetWeeklyNutritionTrendsQueryVariables>): Apollo.UseSuspenseQueryResult<GetWeeklyNutritionTrendsQuery, GetWeeklyNutritionTrendsQueryVariables>;
export function useGetWeeklyNutritionTrendsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetWeeklyNutritionTrendsQuery, GetWeeklyNutritionTrendsQueryVariables>): Apollo.UseSuspenseQueryResult<GetWeeklyNutritionTrendsQuery | undefined, GetWeeklyNutritionTrendsQueryVariables>;
export function useGetWeeklyNutritionTrendsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetWeeklyNutritionTrendsQuery, GetWeeklyNutritionTrendsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetWeeklyNutritionTrendsQuery, GetWeeklyNutritionTrendsQueryVariables>(GetWeeklyNutritionTrendsDocument, options);
        }
export type GetWeeklyNutritionTrendsQueryHookResult = ReturnType<typeof useGetWeeklyNutritionTrendsQuery>;
export type GetWeeklyNutritionTrendsLazyQueryHookResult = ReturnType<typeof useGetWeeklyNutritionTrendsLazyQuery>;
export type GetWeeklyNutritionTrendsSuspenseQueryHookResult = ReturnType<typeof useGetWeeklyNutritionTrendsSuspenseQuery>;
export type GetWeeklyNutritionTrendsQueryResult = Apollo.QueryResult<GetWeeklyNutritionTrendsQuery, GetWeeklyNutritionTrendsQueryVariables>;