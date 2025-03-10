import { useCallback, useEffect } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import PageError from '@/pages/sys/error/PageError';
import { useUserActions, useUserInfo, useUserToken } from '@/store/userStore';
import { useRouter } from '../hooks';
// import userService from '@/api/services/userService.ts';
import { PermissionType } from '#/enum';
// import { useLoginStateContext } from '@/pages/sys/login/providers/LoginStateProvider';
import { filter } from 'lodash';
import { useLoginStateContext } from '@/pages/sys/login/providers/LoginStateProvider';
import { Role } from '#/entity';
import {SUPPER_AD} from '@/store/permission.json'
import axios from 'axios';


type Props = {
  children: React.ReactNode;
};
export default function AuthGuard({ children }: Props) {
  const router = useRouter();
  const token = useUserToken();
  const userInfo = useUserInfo();
  const { setUserInfo } = useUserActions();
  const { clearUserInfoAndToken } = useUserActions();
  const { backToLogin } = useLoginStateContext();
  const check = useCallback(() => {
    if (!token) {
      router.replace('/login');
    }
  }, [router, token]);
  useEffect(() => {
    getMenu();
  }, []);
  const getMenu = async () => {
    try {
      if (token && userInfo) {
        const _data: any = await axios.get(
          import.meta.env.VITE_APP_BASE_API + `internal/role`,
          { headers: { Authorization: `Bearer ${token}` } },
        );
        const data = _data?.data?.data
        if(userInfo.refRole == "SUPER_ADMIN"){
          userInfo.role = JSON.stringify(SUPPER_AD);
        }else{
          if (data.length > 0) {
            const _role = data.find((item: Role) => {
              if (item.code == userInfo.refRole) {
                return item;
              }
            });
            userInfo.role = _role.permission;
          } else {
            userInfo.role = '';
          }
        }

        if (userInfo) {
          const u = userInfo;
          let role = [];
          if (userInfo.role === '') {
            role = [];
          } else {
            role = JSON.parse(userInfo.role as string);
          }

          const menu: any = {};
          role.forEach((item: any) => {
            item?.children?.forEach((x: any) => {
              menu[x.name] = x.permission;
            });
            if (!item?.children?.length && item.type == PermissionType.CATALOGUE) {
              menu[item.name] = item.permission;
            }
          });
          let menuFunc: any = [];

          role.forEach((item: any) => {
            if (!item?.children?.length && item.type == PermissionType.CATALOGUE) {
              if (item.permission?.includes('view')) {
                menuFunc.push(item);
              }
            }
            if (item.children?.length) {
              const { children } = item;
              menuFunc.push({
                ...item,
                children: children.filter((x: any) => x.permission?.includes('view')),
              });
            }
          });
          menuFunc.forEach((x: any) => {
            x?.children?.forEach((item: any) => {
              const { children = [] } = item;
              item.children = children.filter((x: any) => x.permission?.includes('view'));
            });
          });
          menuFunc.map((x: any) => {
            if (x?.children) {
              x.children = filter(
                x?.children ?? [],
                (y: any) => y.children?.length || (y.permission ?? [])?.includes('view'),
              );
            }
          });
          menuFunc = filter(
            menuFunc,
            (y: any) => y.children?.length || (y.permission ?? [])?.includes('view'),
          );
          // @ts-ignore
          u.menu = menu;
          u.role = role ? role : '';
          // @ts-ignore
          u.permissions = role ? role : '';
          // @ts-ignore
          u.menuFunc = menuFunc;
          u.vendorId = userInfo.vendorId
          setUserInfo(u);
        }
      }
    } catch (err) {
      clearUserInfoAndToken()
      backToLogin()
      console.error(err)
    }


  };
  useEffect(() => {
    check();
  }, [check]);


  return <ErrorBoundary FallbackComponent={PageError}>{children}</ErrorBoundary>;
}
