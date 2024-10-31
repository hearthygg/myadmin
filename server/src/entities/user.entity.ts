import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Index,
  OneToMany,
  ManyToMany,
  JoinTable,
} from "typeorm";
import { Role } from "./role.entity";
/**
 * 用户实体
 */
@Entity("Users")
export class User {
  // 标记一个字段为数据库自动生成的主键。通常用于整数类型的自动递增主键
  @PrimaryGeneratedColumn({ name: "UserID" })
  userId!: number;

  @Index("UQ_Users_Username", { unique: true })
  @Column({ name: "Username" })
  username!: string;

  @Column({ name: "Nickname" })
  nickname!: string;

  @Column({ name: "PasswordHash" })
  password!: string;

  @Index("UQ_Users_Email", { unique: true })
  @Column({ name: "Email" })
  email!: string;

  @Column({ type: "varchar", nullable: true, name: "Avatar" })
  avatar!: string | null;

  @Column({ type: "varchar", nullable: true, name: "TelPhone" })
  telPhone!: string | null;

  @Column({ name: "Sex", default: 3 })
  sex!: number;

  @Column({ name: "CreatedAt", default: () => "CURRENT_TIMESTAMP" })
  createTime!: Date;

  @Column({
    name: "UpdatedAt",
    default: () => "CURRENT_TIMESTAMP",
    onUpdate: "CURRENT_TIMESTAMP",
  })
  updateTime!: Date;

  // 用户的角色集合
  // @OneToMany((type) => UserRole, (userRole) => userRole.user)
  // userRoles!: UserRole[];
  @ManyToMany(() => Role, (role) => role.users)
  @JoinTable({
    name: "userrole",
    joinColumn: { name: "UserID", referencedColumnName: "userId" },
    inverseJoinColumn: { name: "RoleID", referencedColumnName: "roleId" },
  })
  roles!: Role[];
}
