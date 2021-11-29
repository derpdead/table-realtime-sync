import React, { useState, useEffect, useRef, Fragment } from 'react';
import { v4 as uuidv4 } from 'uuid';
import './App.css';

const App = () => {

  const [forexOrders, setForexOrders] = useState({})
  const [indicesOrders, setIndicesOrders] = useState({})
  const [cryptoOrders, setCryptoOrders] = useState({})
  const [stockOrders, setStockOrders] = useState({})
  const [commoditiesOrders, setCommoditiesOrders] = useState({})
  const [activeTab, setActiveTab] = useState("exclusive-tab1");
  const [activePair, setActivePair] = useState("EURUSD");

  const [isPaused, setPause] = useState(false);
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
      // setInterval(() => {
      //   if (isPaused) return;
      //   const response = JSON.parse(event.data);
      //   const { Symbol, Quotes, Group } = response;

      //   switch (Group) {
      //     case 'FOREX':
      //       setForexOrders({ ...forexOrders, [Symbol]: Quotes });
      //       break;
      //     case 'COMMODITIES':
      //       setCommoditiesOrders({ ...commoditiesOrders, [Symbol]: Quotes });
      //       break;
      //     case 'INDICES':
      //       setIndicesOrders({ ...indicesOrders, [Symbol]: Quotes });
      //       break;
      //     case 'STOCKS':
      //       setStockOrders({ ...stockOrders, [Symbol]: Quotes });
      //       break;
      //     case 'CRYPTOS':
      //       setCryptoOrders({ ...cryptoOrders, [Symbol]: Quotes });
      //       break;
      //     default:
      //       return;
      //   }
      // }, 2000);

      if (isPaused) return;
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
  }, [forexOrders, commoditiesOrders, indicesOrders, cryptoOrders, stockOrders, isPaused]);

  const Quotes = (props) => {

    const addDepthClass = (index, pk) => {
      if (index === 0) {
        return "depth-show";
      } else if (activePair === pk) {
        return "depth-show active";
      } else {
        return "depth-hide";
      }
    }

    const handleDepth = (pk) => {
      setPause(true);
      setActivePair(pk);
      console.log(activePair);

      const elements = [...document.getElementsByClassName(pk)];

      elements.forEach((element) => {
        if (element.classList.contains("active")) {
          //element.classList.remove("active")
        } else {
          element.classList.add("active")
        }

        element.classList.toggle("depth-hide");
      })
    };

    const handlePause = () => {
      setPause(true);

      setInterval(() => {
        setPause(false);
      }, 5000);
    }

    return (
      <Fragment>
        {
          props.quotes.slice(0, 6).map((quote, index) => (
            <tr
              key={props.pairKey + index}
              className={`${props.pairKey} ${addDepthClass(index, props.pairKey)}`}
              onClick={() => handleDepth(props.pairKey)}
              onMouseEnter={() => handlePause()}
            //onMouseLeave={() => setPause(false)}
            >
              <td className="pair"><strong>{props.pairKey}</strong></td>
              <td>{quote.Spread}</td>
              <td>{quote.BidSize}</td>
              <td>
                {(() => {
                  if (quote.BidDirection === "-1") {
                    return (
                      <i className="ex-arrow ex-down"></i>
                    )
                  } else if (quote.BidDirection === "1") {
                    return (
                      <i className="ex-arrow ex-up"></i>
                    )
                  } else {
                    return (
                      <i className="ex-arrow ex-right"></i>
                    )
                  }
                })()}
              </td>
              <td>{quote.BidPx}</td>
              <td>{quote.AskPx}</td>
              <td>{quote.AskSize}</td>
            </tr>
          ))
        }
      </Fragment>
    )
  }

  const QuotesTable = (props) => {
    return (
      <table cellSpacing="0" cellPadding="0">
        <tbody>
          {
            Object.keys(props.GroupOrders).map((pairKey) => {
              const quotes = props.GroupOrders[pairKey];
              return (
                <Quotes key={pairKey + uuidv4()} className={pairKey} pairKey={pairKey} quotes={quotes} />
              )
            })
          }
        </tbody>
        <tfoot>
          <tr>
            <th width="15%">PAIR</th>
            <th width="15%">SPREAD</th>
            <th width="15%">SIZE</th>
            <th width="10%"></th>
            <th width="15%">BID</th>
            <th width="15%">ASK</th>
            <th width="15%">SIZE</th>
          </tr>
        </tfoot>
      </table>
    )
  }

  return (
    <div className="exclusive-tabs" onClick={() => setPause(!isPaused)}>
      {/* Tab nav */}
      <ul className="nav">
        <li className={activeTab === "exclusive-tab1" ? "active" : ""} onClick={() => setActiveTab("exclusive-tab1")}>{activeTab === "exclusive-tab1" ? <i className="ex-arrow ex-down"></i> : <i className="ex-arrow ex-right"></i>} Forex</li>
        <li className={activeTab === "exclusive-tab2" ? "active" : ""} onClick={() => setActiveTab("exclusive-tab2")}>{activeTab === "exclusive-tab2" ? <i className="ex-arrow ex-down"></i> : <i className="ex-arrow ex-right"></i>} Commodities</li>
        <li className={activeTab === "exclusive-tab3" ? "active" : ""} onClick={() => setActiveTab("exclusive-tab3")}>{activeTab === "exclusive-tab3" ? <i className="ex-arrow ex-down"></i> : <i className="ex-arrow ex-right"></i>} Indices</li>
        <li className={activeTab === "exclusive-tab4" ? "active" : ""} onClick={() => setActiveTab("exclusive-tab4")}>{activeTab === "exclusive-tab4" ? <i className="ex-arrow ex-down"></i> : <i className="ex-arrow ex-right"></i>} Stock</li>
        <li className={activeTab === "exclusive-tab5" ? "active" : ""} onClick={() => setActiveTab("exclusive-tab5")}>{activeTab === "exclusive-tab5" ? <i className="ex-arrow ex-down"></i> : <i className="ex-arrow ex-right"></i>} Crypto</li>
      </ul>
      <div className="exclusive-outlet">
        {activeTab === "exclusive-tab1" ? <QuotesTable GroupOrders={forexOrders} /> : ""}
        {activeTab === "exclusive-tab2" ? <QuotesTable GroupOrders={commoditiesOrders} /> : ""}
        {activeTab === "exclusive-tab3" ? <QuotesTable GroupOrders={indicesOrders} /> : ""}
        {activeTab === "exclusive-tab4" ? <QuotesTable GroupOrders={stockOrders} /> : ""}
        {activeTab === "exclusive-tab5" ? <QuotesTable GroupOrders={cryptoOrders} /> : ""}
      </div>

      <button onClick={() => setPause(!isPaused)}>
        {isPaused ? "Resume" : "Pause"}
      </button>
    </div>

  )
}

export default App;
