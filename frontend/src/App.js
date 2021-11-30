import React, { useState, useEffect, useRef } from 'react';
import './App.scss';
import Table from "./components/Table/Table";

const columns = [
  {
    key: '1',
    width: '15%',
    label: 'PAIR',
  },
  {
    key: '2',
    width: '15%',
    label: 'SPREAD',
  },
  {
    key: '3',
    width: '15%',
    label: 'SIZE',
  },
  {
    key: '4',
    width: '10%',
    label: '',
  },
  {
    key: '5',
    width: '15%',
    label: 'BID',
  },
  {
    key: '6',
    width: '15%',
    label: 'ASK',
  },
  {
    key: '7',
    width: '15%',
    label: 'SIZE',
  },
]

const App = () => {

  const [forexOrders, setForexOrders] = useState({})
  const [indicesOrders, setIndicesOrders] = useState({})
  const [cryptoOrders, setCryptoOrders] = useState({})
  const [stockOrders, setStockOrders] = useState({})
  const [commoditiesOrders, setCommoditiesOrders] = useState({})
  const [activeTab, setActiveTab] = useState("exclusive-tab1");
  const [activePair, setActivePair] = useState("EURUSD");

  const ws = useRef(null);

  useEffect(() => {
    ws.current = new WebSocket("wss://lq.exclusivecapital.com");
    ws.current.onopen = () => console.log("ws opened");
    ws.current.onclose = () => console.log("ws closed");

    return () => {
      ws.current.close();
    };
  }, []);

  useEffect(() => {
    if (!ws.current) return;

    ws.current.onmessage = (event) => {
      const response = JSON.parse(event.data);
      const { Symbol, Quotes, Group } = response;

      switch (Group) {
        case 'FOREX':
          setForexOrders({ ...forexOrders, [Symbol]: Quotes });
          break;
        case 'COMMODITIES':
          setCommoditiesOrders({ ...commoditiesOrders, [Symbol]: Quotes });
          break;
        case 'INDICES':
          setIndicesOrders({ ...indicesOrders, [Symbol]: Quotes });
          break;
        case 'STOCKS':
          setStockOrders({ ...stockOrders, [Symbol]: Quotes });
          break;
        case 'CRYPTOS':
          setCryptoOrders({ ...cryptoOrders, [Symbol]: Quotes });
          break;
        default:
          return;
      }
    };
  }, [forexOrders, commoditiesOrders, indicesOrders, cryptoOrders, stockOrders]);

  return (
    <div className="exclusive-tabs">
      {/* Tab nav */}
      <ul className="nav">
        <li className={activeTab === "exclusive-tab1" ? "active" : ""} onClick={() => setActiveTab("exclusive-tab1")}>{activeTab === "exclusive-tab1" ? <i className="ex-arrow ex-down" /> : <i className="ex-arrow ex-right" />} Forex</li>
        <li className={activeTab === "exclusive-tab2" ? "active" : ""} onClick={() => setActiveTab("exclusive-tab2")}>{activeTab === "exclusive-tab2" ? <i className="ex-arrow ex-down" /> : <i className="ex-arrow ex-right" />} Commodities</li>
        <li className={activeTab === "exclusive-tab3" ? "active" : ""} onClick={() => setActiveTab("exclusive-tab3")}>{activeTab === "exclusive-tab3" ? <i className="ex-arrow ex-down" /> : <i className="ex-arrow ex-right" />} Indices</li>
        <li className={activeTab === "exclusive-tab4" ? "active" : ""} onClick={() => setActiveTab("exclusive-tab4")}>{activeTab === "exclusive-tab4" ? <i className="ex-arrow ex-down" /> : <i className="ex-arrow ex-right" />} Stock</li>
        <li className={activeTab === "exclusive-tab5" ? "active" : ""} onClick={() => setActiveTab("exclusive-tab5")}>{activeTab === "exclusive-tab5" ? <i className="ex-arrow ex-down" /> : <i className="ex-arrow ex-right" />} Crypto</li>
      </ul>
      <div className="exclusive-outlet">
        {activeTab === "exclusive-tab1" ? <Table columns={columns} rows={forexOrders} expandedRow={activePair} onExpandRow={setActivePair} /> : null}
        {activeTab === "exclusive-tab2" ? <Table columns={columns} rows={commoditiesOrders} expandedRow={activePair} onExpandRow={setActivePair} /> : null}
        {activeTab === "exclusive-tab3" ? <Table columns={columns} rows={indicesOrders} expandedRow={activePair} onExpandRow={setActivePair} /> : null}
        {activeTab === "exclusive-tab4" ? <Table columns={columns} rows={stockOrders} expandedRow={activePair} onExpandRow={setActivePair} /> : null}
        {activeTab === "exclusive-tab5" ? <Table columns={columns} rows={cryptoOrders} expandedRow={activePair} onExpandRow={setActivePair} /> : null}
      </div>
    </div>

  )
}

export default App;
