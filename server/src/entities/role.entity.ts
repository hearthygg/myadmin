import { Entity, Column, PrimaryGeneratedColumn, Index, OneToMany, ManyToMany, JoinTable } from "typeorm";
import { User } from "@entities/user.entity";
import { Permission } from "@entities/permission.entity";
/**
 * 角色实体
 */
@Entity("Roles")
export class Role {
  @PrimaryGeneratedColumn({name: "RoleID"})
  roleId!: number;

  @Index("UQ_Roles_Name", { unique: true })
  @Column({name: "Name"})
  roleName!: string;

  @Index("UQ_Roles_Remark", { unique: true })
  @Column({name: "Remark"})
  remark!: string;

  @Column({name: "Description"})
  description!: string;

  @Column({ name: "CreatedAt",default: () => "CURRENT_TIMESTAMP" })
  createTime!: Date;

  @Column({ name: "UpdatedAt",default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP" })
  updateTime!: Date;
  
  // 角色的用户集合
  // @OneToMany(type => UserRole, userRole => userRole.role)
  // userRoles!: UserRole[];
  // 角色的用户集合
  @ManyToMany(() => User, user => user.roles)
  users!: User[];

  // 角色权限关联
  // @OneToMany(type => RolePermission, rolePermission => rolePermission.role)
  // rolePermissions!: RolePermission[];
  @ManyToMany(() => Permission, permission => permission.roles)
  @JoinTable({
    name: 'rolepermission',
    joinColumn: { name: 'RoleID', referencedColumnName: 'roleId' },
    inverseJoinColumn: { name: 'PermissionID', referencedColumnName: 'permissionId' }
  })
  permissions!: Permission[];
}
