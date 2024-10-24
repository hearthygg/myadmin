import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, JoinColumn, ManyToMany } from 'typeorm';
import { Role } from '@entities/role.entity';

/**
 * 权限实体
 */
@Entity('Permissions')
export class Permission {
  // 标记一个字段为数据库自动生成的主键。通常用于整数类型的自动递增主键
  @PrimaryGeneratedColumn({name: 'PermissionID' })
  permissionId!: number;

  @Column({name: 'Name' })
  permissionName!: string;

  /**路由路径 */
  @Column({name: 'Path' })
  path!: string;

  /**组件路径 */
  @Column({name: 'Component',type: 'varchar', nullable: true, })
  component!: string | null;

  /**是否缓存 */
  @Column({name: 'KeepAlive',default: false })
  keepAlive!: boolean;

  /**是否显示 */
  @Column({name: 'Hidden',default: false })
  hidden!: boolean;

  @Column({ default: 1,name: 'Type' })
  permissionType!: number;

  @Column({ type: 'int', nullable: true,name: 'Sort' })
  sort!: number | null;

  @Column({ type: 'varchar', nullable: true,name: 'Icon' })
  icon!: string | null;

  // 重定向地址
  @Column({ type: 'varchar', nullable: true,name: 'Redirect' })
  redirect!: string | null;

  @Column({ type: 'int',nullable: true,name: 'ParentPermissionID' })
  parentPermissionId!: number | null;

  @Column({ type: 'varchar',nullable: true,name: 'Description' })
  description!: string | null;

  @Column({ name: "CreatedAt",default: () => "CURRENT_TIMESTAMP" })
  createTime!: Date;

  @Column({ name: "UpdatedAt",default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP" })
  updateTime!: Date;

  // 关联父权限
  @ManyToOne(type => Permission, parent => parent.children, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'ParentPermissionID' })
  parent!: Permission | null;

  // 子权限集合
  @OneToMany(type => Permission, child => child.parent)
  children!: Permission[];

  // 角色权限关联
  // @OneToMany(type => RolePermission, rolePermission => rolePermission.perssion)
  // rolePermissions!: RolePermission[];

  @ManyToMany(() => Role, role => role.permissions)
  roles!: Role[];
}
