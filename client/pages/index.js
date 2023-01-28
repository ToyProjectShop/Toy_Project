import { Button } from 'antd';
import Link from 'next/link';
import React from 'react';
import AppLayout from '../components/AppLayout';

const Home = () => {
  return (
    <AppLayout>
      <div style={{ padding: 20 }}>환영합니다</div>
      <div>
        <div style={{ padding: 10 }}>
          <Link href="/edit">
            <a>
              <Button>개인정보 수정</Button>
            </a>
          </Link>
        </div>
        <div style={{ padding: 10 }}>
          <Link href="/signup">
            <a>
              <Button>상품 구경</Button>
            </a>
          </Link>
        </div>
      </div>
    </AppLayout>
  );
};

export default Home;
