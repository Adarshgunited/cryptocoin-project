import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { server } from '../index';
import { Button, Container, HStack, Radio, RadioGroup } from '@chakra-ui/react';
import Loader from './Loader';
import ErrorComponent from './ErrorComponent';
import CoinCard from './CoinCard';

const Coins = () => {


    const [coins, setCoins] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [page, setPage] = useState(1);
    const [currency, setCurrency] = useState("inr")

    const currenySymbol =
        currency === "inr" ? "₹" : currency === "eur" ? "€" : "$";
    
    const changePage = (page) => {
        setPage(page);
        setLoading(true);
    };

    // we have 132pages , So we make 132 btns
    const btns = new Array(132).fill(1);

    //useEffect hook to get data from api server
    useEffect(() => {
        const fetchCoins = async () => {
            try {
                const { data } = await axios.get(`${server}/coins/markets?vs_currency=${currency}&page=${page}`);
            setCoins(data);
            setLoading(false);
            } catch (error) {
                setError(true);
                setLoading(false);
            }
        };
        fetchCoins();
    },[currency,page] );

    if (error) return <ErrorComponent message={"Error While Fetching Exchanges"} />

  return (
      <Container maxW={'container.xl'}>
          {loading ? 
              <Loader /> :
              <>
                  {/* onchange , chakra ui will handle the event and we dont have to write event value */}
                  <RadioGroup value={currency} onChange={setCurrency} p={"8"}>
                      <HStack spacing={"4"}>
                      <Radio value={"inr"}>INR</Radio>
                      <Radio value={"usd"}>USD</Radio>
                      <Radio value={"eur"}>EUR</Radio>
                      </HStack> 
                  </RadioGroup>
                  <HStack wrap={'wrap'} justifyContent={"space-evenly"}>
                      {
                          coins.map((i) => (
                              <CoinCard
                                  id={i.id}
                                key={i.id}
                                  name={i.name}
                                  price={i.current_price}
                                  symbol={i.symbol}
                              img={i.image}
                                  currencySymbol={currenySymbol}
                              />  
                      ))}
                  </HStack>

                  <HStack 
                      w={"full"}
                      overflowX={"auto"}
                      p={"8"}
                  >
                      {
                          btns.map((item, index) => (
                              <Button
                                  key={index}
                      bgColor={"blackAlpha.900"}
                      color={"white"}
                      onClick={()=> changePage(index+1)}
                      >
                          {index+1}
                      </Button>
                          ))
                      }
                  </HStack>
              </>
          }
    </Container>
  )
}

export default Coins;