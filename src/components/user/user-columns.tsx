"use client"

import { Column, ColumnDef } from "@tanstack/react-table"
import { IconCircleCheckFilled, IconCircleXFilled } from "@tabler/icons-react"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { UserStatusEnum, UserTypeEnum } from "@/server/enums/user-enum"
import { type UserVo } from "@/server/entity/vo/user"

const userTypeMap: Record<number, string> = {
  [UserTypeEnum.ADMIN]: "管理员",
  [UserTypeEnum.NORMAL]: "普通用户",
}

const userStatusMap: Record<number, string> = {
  [UserStatusEnum.DEFAULT]: "正常",
  [UserStatusEnum.NORMAL]: "正常",
  [UserStatusEnum.DISABLE]: "禁用",
}

interface SortableHeaderProps {
  label: string
  column: Column<UserVo, unknown>
}

interface UserColumnsOptions {
  onEdit: (user: UserVo) => void
  onToggleStatus: (userId: string) => void
  onDelete: (user: UserVo) => void
}

// 渲染带固定排序图标的表头按钮。
function SortableHeader({ label, column }: SortableHeaderProps) {
  return (
    <Button
      type="button"
      variant="ghost"
      className="-ml-2 h-8 px-2"
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    >
      {label}
      <ArrowUpDown />
    </Button>
  )
}

// 格式化存储容量为易读文本。
function formatCapacity(size: number) {
  if (!size) {
    return "0 B"
  }

  const units = ["B", "KB", "MB", "GB", "TB"]
  const index = Math.min(Math.floor(Math.log(size) / Math.log(1024)), units.length - 1)
  const value = size / 1024 ** index

  return `${value.toFixed(value >= 10 || index === 0 ? 0 : 1)} ${units[index]}`
}

// 渲染用户状态徽标。
function UserStatusBadge({ status }: { status: number }) {
  const disabled = status === UserStatusEnum.DISABLE
  const Icon = disabled ? IconCircleXFilled : IconCircleCheckFilled
  const text = userStatusMap[status] ?? status

  return (
    <Badge variant="outline" className="px-1.5 text-muted-foreground">
      <Icon className={disabled ? "fill-red-500" : "fill-green-500 dark:fill-green-400"} />
      {text}
    </Badge>
  )
}

// 创建用户列表列配置。
export function getUserColumns({ onEdit, onToggleStatus, onDelete }: UserColumnsOptions): ColumnDef<UserVo>[] {
  return [
    {
      id: "index",
      header: "序号",
      enableHiding: false,
      cell: ({ row }) => row.index + 1,
    },
    {
      accessorKey: "username",
      header: "用户名",
      meta: {
        className: "w-1/3",
      },
    },
    {
      accessorKey: "type",
      header: "类型",
      cell: ({ row }) => userTypeMap[row.original.type] ?? row.original.type
    },
    {
      accessorKey: "usedCapacity",
      meta: {
        label: "已用储存",
      },
      header: ({ column }) => <SortableHeader label="已用储存" column={column} />,
      cell: ({ row }) => formatCapacity(row.original.usedCapacity),
    },
    {
      accessorKey: "photoTotal",
      meta: {
        label: "照片数量",
      },
      header: ({ column }) => <SortableHeader label="照片数量" column={column} />,
    },
    {
      accessorKey: "status",
      header: "状态",
      cell: ({ row }) => <UserStatusBadge status={row.original.status} />,
    },
    {
      id: "actions",
      header: "操作",
      enableHiding: false,
      meta: {
        className: "text-right",
      },
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon-sm" aria-label="打开操作菜单">
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => onEdit(row.original)}>编辑</DropdownMenuItem>
            <DropdownMenuItem onClick={() => onToggleStatus(row.original.userId)}>
              {row.original.status === UserStatusEnum.DISABLE ? "启用" : "禁用"}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDelete(row.original)}>删除</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ]
}
