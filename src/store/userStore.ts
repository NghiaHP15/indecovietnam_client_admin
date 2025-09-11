import { create } from 'zustand';
import { LoginRequest } from '@/api/services/userService';
import { getItem, removeItem, setItem } from '@/utils/storage';

import { UserInfo } from '#/entity';
import { PermissionType, StorageEnum } from '#/enum';
import { useNavigate } from 'react-router-dom';
import { filter } from 'lodash';
// import { SUPPER_AD } from './permission.json';
import { loginEmpoloyee } from '@/api/services/authAccount.service';

type UserStore = {
  userInfo: Partial<UserInfo>;
  userToken: string;
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
  const { setUserToken, setUserInfo } = useUserActions();
  const navigate = useNavigate();
  return async (_data: LoginRequest) => {
    try {
      const res = await loginEmpoloyee(_data);
          
      // const res = {
      //   token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxMjM0NTY3ODkwIiwidXNlcm5hbWUiOiJmYWtldXNlciIsImlhdCI6MTY5MTY4MDAwMCwiZXhwIjoxNzIzMjE2MDAwfQ.s5fPOaD5lO9FZfT7x8YksHzHDtFCfDtkj9GflP-9i4Y",
      //   user: {
      //     id: "1249fbe4-178d-4249-98d2-532ff8b2407",
      //     userName: "nghia",
      //     fullName: "Bui Minh Nghia",
      //     address: "Hai Phong",
      //     refRole: "SUPER_ADMIN",
      //     role: "",
      //     vendorId: "1249fbe4-178d-4249-98d2-532ff8b2407"
      //   }
      // }

      const token = res.token;
      if (res.user) {
        const u = res.user;
        let role = JSON.parse(res.user.role as string);
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
        console.log(role);
        
        // @ts-ignore
        u.menu = menu;
        u.role = role ? role : '';
        // @ts-ignore
        u.permissions = role ? role : '';
        // @ts-ignore
        u.menuFunc = menuFunc;
        // debugger
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
