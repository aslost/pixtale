// 这个模块定义存储配置相关枚举值。

const StorageStatusEnum = {
  NORMAL: 0,
  DISABLE: 1
} as const;

const StorageTypeEnum = {
  LOCAL: 1,
  S3: 2
} as const;

type StorageType = (typeof StorageTypeEnum)[keyof typeof StorageTypeEnum];

const StorageTypeOptions = [
  { label: "本地", value: StorageTypeEnum.LOCAL },
  { label: "S3", value: StorageTypeEnum.S3 }
];

export { StorageStatusEnum, StorageTypeEnum, StorageTypeOptions };
export type { StorageType };
