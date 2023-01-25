export interface ISignUpInfo {
  email: string;
  username: string;
  password: string;
  phone: number | string;
  city: string;
  street: string;
  zipcode: number | string;
  provider: string;
  snsId: number | string;
}

export class SignUpInfo {
  public static Request(p: ISignUpInfo) {
    return {
      email: p?.email ?? '이메일 정보 없음',
      username: p?.username ?? '이름 정보 없음',
      password: p?.password ?? '비밀번호 정보 없음',
      phone: p?.phone ? (typeof p?.phone === 'number' ? p?.phone : Number(p?.phone)) : 0,
      city: p?.city ?? '도시 정보 없음',
      street: p?.street ?? '거리 정보 없음',
      zipcode: p?.zipcode ? (typeof p?.zipcode === 'number' ? p?.zipcode : Number(p?.zipcode)) : 0,
      provider: p?.provider ?? '소셜 정보 없음',
      snsId: p?.snsId ? (typeof p?.snsId === 'number' ? p?.snsId : Number(p?.snsId)) : 0,
    };
  }
}
