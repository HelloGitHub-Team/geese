import Image from 'next/image';
import Link from 'next/link';
import * as React from 'react';
import { useEffect, useState } from 'react';
import useSWR from 'swr';
import useSWRImmutable from 'swr/immutable';

import { fetcher } from '@/pages/api/base';
import { UserStatus } from '@/pages/api/login';
import { makeUrl } from '@/utils/api';

import Loading from '../loading/Loading';

type UserProps = {
  updateLoginStatus: (value: boolean) => void;
  isLogin: boolean;
};

type UserStatusProps = {
  user?: UserStatus;
};

const TOKENKEY = 'Authorization';

export default function User({ isLogin, updateLoginStatus }: UserProps) {
  const [hasToken, setHasToken] = useState<boolean>(false);

  const getToken = () => localStorage.getItem(TOKENKEY);

  useEffect(() => {
    // localStorage.setItem(
    //   'Authorization',
    //   'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI4bmIzdmRrY2hhIiwicGVybWlzc2lvbiI6InZpc2l0b3IiLCJuaWNrbmFtZSI6Inh1IiwiZXhwIjoxNjU3Njk3NzkxfQ.Zc7lVqCvlQ_g5jHCqAssMAwPNu6MX6lhLTZUtRlmK0Q'
    // );
    setHasToken(!!getToken());
  }, [isLogin]);

  const { data: auth } = useSWRImmutable<Record<string, any>>(
    makeUrl(`/user/oauth/wechat/url/`, { url_type: 'geese' }),
    (key) => {
      const options: RequestInit = {
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      };
      return fetcher(key, options);
    },
    {
      shouldRetryOnError: false,
    }
  );

  const { data: userStatus } = useSWR<UserStatus>(
    hasToken ? makeUrl('/user/me/') : null,
    (key) => {
      const headers = { [TOKENKEY]: `Bearer ${getToken()}` };
      return fetcher(key, { headers });
    },
    {
      onSuccess: function () {
        updateLoginStatus(true);
      },
      onError: function () {
        updateLoginStatus(false);
      },
    }
  );

  const defaultAvatar =
    'data:image/webp;base64,UklGRhYNAABXRUJQVlA4IAoNAADwbQCdASr0AfQBPp1Op00mJSSjIjSYYLATiWlu/Gf5bYTv6BZhxdZMXv9n3Yf2f/a7cDdHtJ/lf400pdg/ACyd6yAAHgRzF1VSgB5UPe21CumUFu9vGK8AhjKXDjOI9AWbfYdl01iEDaYYc1EwXrpPyoGPaMB4w63jWIKYuU+/M+/M+/JMf4B3Q2W7QtNr5Zsn8yRC8WFTQ3gObB9JdjJdidCEsrA7T2cz785wYphXqEWjxpT78z78z75ymsXDpHXWSrsZLsZwU6qhNnDSXTFeFKPOYlpy1+qeIkz78z780Sbc3MbUt+M+/M+/M9Walr/cHk9vGK8KUcW36yxi8t44Uo85jFhglrjCFTl2Ml2Ml2JWa7y3NXYyXYyW9+2+VtzeMV4Uo85aSfSXJQbxivClBy/fj3yXYyXYyXWjGHTcKUecxiyx/qO4jFeFKPOYmuhtDLd4xXhSBNS16I3Up9+Z9+ZWMCjMSvqXYPpLsTUXSjetmqMl2Ml2Mlu6T+Zvc8YrwpR6j90uO2icxkuxkuswOFPjkCGecxkuxiooa8DEnq/8vbxivCWMXqSqF2Ml2Ml2MsDHgovrT95kIwmffmfbDhNY49YtuZzPvzPvzPv/vOoODklLHoxXhR8eQ64qAHHXXhSjzmMl2MUrlno29L5YVSZ9+TCfqHwCI3SwZ9YFHnMZLsTPlOXPqidk29vn9V3jFeFIJLbfMJkEeCCLNeZl7eMV0uIMJicYhOhp5+Z9+Z9+ZY20D9yPhSZ3Li8KUeSQB/2rmPM9kbO8KUecxkt29Nr+I9LKQjeMV0cAksoZDKGJ9+Z9+Z9+Z+RlaHA9mjAAGUGXt3ZJw/EefGart4xXhSjzmMl+SIE01r327SUcYH+xTQxYNwpR5zGS7GS7GTrPDialJnkUgHU1YDMavOYyXYyXYyXYyW9xkiZb+acJTWf1oDoK8KUecxkuxkuxkt2r3H8wz+0SBs8TEZbxivClHnMZLsZLsbABcWJg7rkE2r/L5sH0l2Ml2Ml2Ml2MkdVzDN0rebNAKqYrwpR5zGS7GS7GS3uzfsq86jCYaeMV4Uo85jJdjJdjJb3zt5NgF4lA+0dxxGK8KUecxkuxkuxkt30Me33o3mTvsrGS7GS7GS7GS7GS7EzBG0tGqGYSV/rUrohYXMZLsZLsZLsZLsZLeBwZQWsNw9wA/v7mth/gxzcTyH4/WKt2CRdzJpByrN81O2UskiB3/kcAB6JNHOABcrDtoi/BjOT7ATsCx8LvYzJ13KxzEasLzClptxSH6c3ZPkA/TAo+O7Nb8q4oU36ZNpgzkd5ogNH3wI4sVb9SKNush9uWWg1Qe1mnIX6lFyBjWE0+BCPKbZ3uGAniZPNFispMYPIWndPj8OYm49/JGTZ4ngVeVmxUujiCk5yQoZB5lFVYlvDulz3XWruMWfYp2iZBc7WVw78AU6hE3fdI0d25qR3rkt4JYRlgQu1DYWxBBsU7Kl7oCGizcyGCMxtMXEszBuYz7lRJPmiah3iVPTgOITeYzDKN7nkz7OVXIKxLV3CF9qleuBuDET9gDm+6tdiOlwKhgqBJSwYHHoL65n51X8LFfw7KWX7XJhDAMTw871pdw8wWwt6tUAfXnv/uNEEOCwWZ+1MNbp4PgxlJS3VGr/iZyWdkmaaw4fDUw6BHh6QREc16GNNpVruM7yFtfzw3d1gWdHEoGtazAlwzD38zw1hH9dl4gXSx05UWox7fvTKtRwztLm9/9iQPNJioQv9+XxFMAXgIlZYlZHMWmGQ8o1pD3m0gTl+CMYFkRLux74/Yhpi0/An3Mba4KusQhXI1ZiOwPbe2r0aIz+7cthGN29mI5Dg5LeIMVqFKYHjfD2BrM8C4I58M1SgYAnZ7RhJ4F4+I1F8fFHCLeXA4WjRXvNcPy9mCZFRF/1ZQLYJom+jFHHzoJGrwvAWmUeLXEvQeCu9mahSrK1uJ7xWC/lqjycdqhLCuDEWLu/u6Rtyqf+s9xfDCpIO9hHAKW9rxd+H4L5zFzeAaSE8FtvTu4W0f5ASWjY6vhGZBge91lR1fq+mb6/TODP7CLsJZv4szurULMqB/OldWPeFwhiYQoYJY0BoLViGNxK00TY4givsHL8jQVXZkzwayyDt+uQNnqiMpU9HtZi4mt5sEEEKVoLy7QU4ppNGNEiJg4/LkQ0UwT/C1RtSLl2JBEcUPVRAtQGUQKPZFugS2V+4EEa+TPLvL/EZIbSQIAs6Ey75iIm9Ii5EXyDZHM3qft+RRt194mYVpXjyELYDHRTzH+ma2tGEPwRTm5nEsdO46AHv9vCNWDOJSq7NREeqwEBaXV485Nb7g6FABRPovhR34CG4EBY9hI+SqoL3kTAA/KuPniJnnQYMGY2Pj3GRSb0lntNV/72TY8XmDqrV64cPc1egxYS8mGoyq+QIelscHGIGi0Ips09x7u2jgXBx635tkFrU3W4TfZevIrqgwDN26jGCEkFWfSXKasfNPOEYjSF50YC7PGmBhe8NpP59gIDGr2ZjQOL33TE8DFn0DF3fdHzrLCjRSYpfjgkJajBDy+Hi/NZaJOpDEXS3Q3jTXi/W6qLpgFpHDlT0S/ZuFMyLJa4pQjZdqFd/o9aPq3vGJAao13q56wWSlWL2r66q3nqguYa0X9owJjFUA9E3zcAaXx8vAXWRnbVrKqUtCc3mKY8yk3BwStxCOfF35EpDVd3Ew/ctl+rIqq9ZwxWJ5urxpu2EhoCYC3bwMKC8EgR4YJuRAW/OC5rkvVPU9X0/KxHUbxEDSVNGBuEK0sf82nHPVaA3RI1Z3dJ3Pz7+4rxih8a+8XP4Qaw15uCfbcLCf/YzVO+s9lWhi6Lo4Khdlp7qyE/3sLji0pguXthfiwV/X9/6dRW6cb+HeuN0lJO1o68JotkF1lT/4heT3FIiPm1dpWh11VwT91dHyruKTkYdnr9zSmp9ALSt+YO7gOzdC1AyNCV2yOL+AXi/ygdOjRxBDW7cDH9ugd5rOfWQMyf73TiTz3IYmf8E23PsC4q6vfpmX+DJultvuAHVf1usQs6FeK9FKKcnTsm+L1Fi5MmRPYHq/542p0xXRze/pGWfQNzE0L8x8v7RM1IpIFbwutrEzIqCWdzgXmo8s/4qBXBVEvsj4kZGE5ALiOP022CZSP42nDnH4p0fiyK+IQq4elby0P/iOdefIyPiavZEziQnxipNHC5rpiunCvcpxbINyUiq6f9jXpCJ3r4trbY3UaVtBcSRBrCpukmQ7lZn7timw7SaWurY1xZtwIhF8ziNh9RwFMe6cRkFJhYHQSa3A6wj1hekvyOXRKecIh0GTEx16hiuzvCGc10Xr1tA+yaZC4scFcNuKxZlxo/sJ3z2tt3tO+crYYTTrSe/maGvx1mpXTEpj4aAdXAt7Gu6sOO5QEoAPvINW2q/h7+gWmQjO2tNooHR8u1b910uH5eKEAEP/srVR1IS/4xXddJlsg+xuLeVtMMLzTcaG/Bzcyakcg6IJGwqm+5zNPGdUJAaLoaeWD2eaqYUprIaxU2wZjHlYkTjwxwx8qMgXr1niJdBvn2eVOyW8iqrE9pxMBQCLbnn967lJkRshrNq4V895QixwkYEm695uZLL8oEmavsrzLNokBsH6LUivPJ4ACd5UX2mDmC2IJmoIA6odhRxo6rGQ7A3xcDV5nRDQrrNtyofZfR8GtUTLPyG33XH6tcqiB95V9xvZTG9Oie4X5BgnGn9eX1O48kSnOtja7k2yCwgeHTeQbbdCoxOpIepFgl7pKM6ij7wxLB0QthwTzjPQAKt9+6jZ7z+hMq3f9sdyKiziS4Fp6be+TP9Iurc2s6UDykwHfnU+gE6kfB/BIHYg6z+wooDyvl6LAnXknriuUqwh1vjCITsWRWkZgDcH156TjTXmwUW70/zUpi/aTt+nm9X3OG5mxqzueG+8sPSs0CAHMs8mmbzZt9QMx5YEAKz6qavhTP/l9TE11BtOm1K5vC0xn9H4nj90KzLArwVTGQa4YY1pq4VcGq3I4HSbWGhdTbAgFGAneuiOAJxqo3dKAwFsN+Yb7miA2RcruHR5/h7brjvP3oEhqKTbmPF21YvmDdcz9aeSATrXw0RpWOLYl7UZlKCw8KvQwaT05K+1a2aqhhF+s5YgtG1sBXJQTMoKUV8BCFCHjUudqwAXrtqbH8D/6+msbeesvPqmPmNc7KP2ScH/2aJuswa72wJBfMeYtwWafkC4yhB7eY8vRwQGx2aaxn5LEwPJVQVHQb6enSfc1g94l602GkQHKywgs03q/kMu/cqAaZJHCuOstT0R4EGKoNJyj2E0CnZhJswFc3t5e9+uvcIM5mlDrho4F6Wx5GFlQgEGCaw8gXpAQB89mkma2gFjQexHGSvTwLjU+gUW0c/p9auH4BA1GyUAXMz3XnsaY0/Y8eH3oADhK03L3rdVx0Cz+clhXlcbMKs76kAAAA==';

  const UserStatus = ({ user }: UserStatusProps) => (
    <React.Fragment>
      <div className='relative'>
        {/* /users/314838220949536768 */}
        <Link href={user?.uid ? '/users/' + user.uid : '_blank'}>
          <span className='bg-img absolute top-0 left-0 h-10 w-10 shrink-0 grow-0 rounded-lg object-cover'>
            {/* https://thirdwx.qlogo.cn/mmopen/vi_32/PiajxSqBRaELhgSn8KrBspf8KDJQGPwHOKqkZfppGiaQQk3WdxFetbGAYibBzhZ7bLV81JM2qBKVNStLeIo3ryMEA/132 */}
            <Image
              width={40}
              height={40}
              alt='Picture of the author'
              src={user?.avatar || defaultAvatar}
            ></Image>
          </span>
        </Link>
        <div className='shrink grow pl-12'>
          <div className='flex min-w-0 items-center'>
            <a
              className='mr-2 block h-5 shrink grow truncate text-sm hover:underline'
              href='/users/314838220949536768'
            >
              {user?.nickname}
            </a>
          </div>
          <div className='text-sm font-bold text-yellow-500'>Lv1</div>
        </div>
      </div>

      <div className='flex items-end pt-2 text-sm'>
        <Link href='/create/repo/'>
          <a className='flex h-8 items-center rounded-lg bg-blue-500 pl-4 pr-4 text-sm text-white active:bg-blue-600'>
            分享项目
          </a>
        </Link>
        <div className='shrink grow'></div>
        <div className='pr-2 pb-0.5 text-slate-400'>积分</div>
        <div className='text-4xl font-bold text-yellow-500'>15</div>
      </div>
    </React.Fragment>
  );

  const NotLogin = () => (
    <div className='box-border py-6 text-center align-middle text-base'>
      <Link href={auth?.url || '/'}>
        <button
          type='button'
          className='button box-border rounded-md border-2 border-slate-400 px-3 py-2 text-gray-500'
        >
          立即登录
        </button>
      </Link>
    </div>
  );

  return (
    <div className='rounded-lg bg-white pl-3 pr-3 pt-3 pb-2.5'>
      {userStatus ? (
        <div>{isLogin ? <UserStatus user={userStatus} /> : <NotLogin />}</div>
      ) : (
        <Loading></Loading>
      )}
    </div>
  );
}
