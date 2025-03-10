import { useMutation } from '@tanstack/react-query';
import { create } from 'zustand';
import userService, { LoginRequest } from '@/api/services/userService';
import { getItem, removeItem, setItem } from '@/utils/storage';

import { Role, UserInfo } from '#/entity';
import { LOGIN_TYPE, PermissionType, StorageEnum } from '#/enum';
import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
import { filter } from 'lodash';
import axios from 'axios';
import { SUPPER_AD } from './permission.json';

type UserStore = {
  userInfo: Partial<UserInfo>;
  userToken: string;
  // 使用 actions 命名空间来存放所有的 action
  actions: {
    setUserInfo: (userInfo: UserInfo) => void;
    setUserToken: (token: string) => void;
    clearUserInfoAndToken: () => void;
  };
};

const useUserStore = create<UserStore>((set) => ({
  userInfo: getItem<UserInfo>(StorageEnum.User) || {},
  userToken: getItem<string>(StorageEnum.Token) || '',
  actions: {
    setUserInfo: (userInfo) => {
      set({ userInfo });
      setItem(StorageEnum.User, userInfo);
    },
    setUserToken: (userToken) => {
      set({ userToken });
      setItem(StorageEnum.Token, userToken);
    },
    clearUserInfoAndToken() {
      set({ userInfo: {}, userToken: '' });
      removeItem(StorageEnum.User);
      removeItem(StorageEnum.Token);
    },
  },
}));

export const useUserInfo = () => useUserStore((state) => state.userInfo);
export const useUserToken = () => useUserStore((state) => state.userToken);
export const useUserPermission = () => useUserStore((state) => state.userInfo.menuFunc);
export const useUserActions = () => useUserStore((state) => state.actions);
export const usePermission = (route: string) =>
  useUserStore((state) => {
    try {
      const menuFunc: any = state.userInfo.menu;
      const result = menuFunc[route]?.reduce((obj: any, key: any) => {
        obj[key] = true;
        return obj;
      }, {});

      return result;
    } catch (e: any) {
      return {};
    }
  });

export const useSignIn = () => {
  // const { message } = App.useApp();
    const userInfo = useUserInfo();
  const { setUserToken, setUserInfo } = useUserActions();
  const navigate = useNavigate();

  const loginMutation = useMutation({
    mutationFn: userService.signin,
  });
  const autoLogin = async (data: LoginRequest) => {
    return await userService.autoLogin(data);
  };
  return async (_data: LoginRequest, type: string) => {
    try {
      // debugger
      const res =
        type == LOGIN_TYPE.LOGIN
         ? await loginMutation.mutateAsync(_data)
          : await autoLogin(_data);
          
      const token = res.token;
      //get role group
      if (res.user.refRole == 'SUPER_ADMIN') {
        res.user.role = JSON.stringify(SUPPER_AD);
      } else {
        const getGroupRole: any = await axios.get(
          import.meta.env.VITE_APP_BASE_API + `internal/role`,
          { headers: { Authorization: `Bearer ${token}` } },
        );
        if (getGroupRole.data.data.length > 0) {
          const _role = getGroupRole.data.data.find((item: Role) => {
            if (item.code == res.user.refRole) {
              return item;
            }
          });
          res.user.role = _role.permission;
        } else {
          res.user.role = '';
        }
      }
      if (res.user) {
        const u = res.user;
        let role = [];
        if (res.user.role === '') {
          role = [];
        } else {
          role = JSON.parse(res.user.role as string);
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
        // debugger
        u.vendorId = userInfo.vendorId
        setUserInfo(u);
      }
      setUserToken(token);
      navigate('/', { replace: true });
    } catch (err) {
      throw err;
      // message.warning({
      //   content: err.message,
      //   duration: 3,
      // });
    }
  };
};

export default useUserStore;
