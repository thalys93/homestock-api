import { Roles } from "./Roles";

export const ADMIN_ROLES = [Roles.Admin]
export const ADMIN_DEVELOPER_ROLES = [Roles.Admin, Roles.Developer]
export const USER_TESTER_ROLES = [Roles.User, Roles.Tester]
export const TESTER_ROLES = [Roles.Tester, Roles.Developer]
export const INFRA_ROLES = [Roles.Admin, Roles.Developer, Roles.Tester]