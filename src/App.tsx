import { useState } from 'react';
import { Tab } from '@/data';
import { Layout } from '@/components/Layout';
import { BuyTab } from '@/tabs/BuyTab';
import { SellTab } from '@/tabs/SellTab';
import { MsgTab } from '@/tabs/MsgTab';
import { PriceTab } from '@/tabs/PriceTab';
import { OracleTab } from '@/tabs/OracleTab';
import { CrowdTab } from '@/tabs/CrowdTab';

export default function App() {
  const [tab, setTab] = useState<Tab>('buy');
  const [search, setSearch] = useState('');
  const [scanTarget, setScanTarget] = useState('');

  const handleScan = (name: string) => {
    setScanTarget(name);
    setSearch(name);
  };

  return (
    <Layout tab={tab} setTab={setTab} search={search} setSearch={setSearch} onScan={handleScan}>
      {tab === 'buy' && <BuyTab search={scanTarget || search} />}
      {tab === 'sell' && <SellTab />}
      {tab === 'msg' && <MsgTab />}
      {tab === 'price' && <PriceTab search={scanTarget || search} onScan={() => {}} />}
      {tab === 'oracle' && <OracleTab />}
      {tab === 'crowd' && <CrowdTab />}
    </Layout>
  );
}
