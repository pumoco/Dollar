/** 
 * Sajjad Pourmotahar
 * pumo.io
 *  **/


import React, { Component } from 'react';
import {Badge, Table, Container, Row, Col, NavLink} from "reactstrap";
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

class App extends Component {

  constructor(props) {
    super(props);
    this.removeItem = this.removeItem.bind(this);
    this.state = {
      avgDollar : 0,
        counter: 0,
        dataFromServer: '0',
        time: new Date(),
        list: [
          {id: "0", dataFromServer: "0", time: '0'}]
    };
}
    // instance of websocket connection as a class property
    ws = new WebSocket('ws://localhost:8080')
  componentDidMount() {
    
      this.ws.onopen = () => {
      // on connecting, do nothing but log it to the console
      this.ws.send("");
      console.log('connected')
      }

      this.ws.onmessage = evt => {
      // listen to data sent from the websocket server
      //console.log(evt.data)
      let message = JSON.parse(JSON.stringify(evt.data))

      console.log(message)
      //this.setState.dataFromServer = message;
      if (message.includes("#"))
      {
      this.setState({dataFromServer: message});
      //console.log(message)
      }
      //console.log(message)
      }

      this.ws.onclose = () => {
      console.log('disconnected')
      alert("Socket Closed by Server");
      // automatically try to reconnect on connection loss

      }

  }


  plus = () => {
    this.setState(prevState => {
        return {
            counter: ++prevState.counter
        }
    });
  };

  tick = () => {

        this.setState({
            time:new Date()
        });

};

  componentDidUpdate(prevProps, prevState) {

    let lastPrice = 0;
    let prevPrice = 0;


    // Typical usage
    if (prevState.dataFromServer !== this.state.dataFromServer) {
     // this.priceUpdater();
      //this.idUpdater();
      lastPrice = parseInt(this.state.dataFromServer, 10);
      prevPrice = parseInt(prevState.dataFromServer, 10);
      this.plus();
      this.tick();
      const newList =[{id: this.state.counter, dataFromServer: this.state.dataFromServer, time: this.state.time}]


      this.setState(prevState => ({
        //let {list} = prevState.list.push(newList);
        list: [...newList, ...prevState.list],
      }))
      
      if(prevState.time.getMinutes() === this.state.time.getMinutes())
      if(prevPrice !== 0)  
      {
        lastPrice =  (lastPrice+prevPrice)/2;
        this.setState(prevState => ({
          //let {list} = prevState.list.push(newList);
          avgDollar: lastPrice
        }))
      }


      //console.log(this.state.counter);
      //console.log(this.state.dataFromServer);
      //console.log(this.state.time);
      //console.log(this.state.list);


    console.log('Dollar Price Updated');
    }

  }

renderTableData() {

  return this.state.list.map((element, index) => {

    if(index === 30){
      this.removeItem(index);
    }


    return (
      <Row key={index}>
      <Col><Badge color="secondary">{index+1}</Badge></Col>
      <Col >{element.dataFromServer}</Col>
      <Col>{element.time.toLocaleString()}</Col>
      </Row>
    )
  }
 )
  
};

removeItem(index) {
  this.setState((prevState) => ({
    list: [...prevState.list.slice(0,index), ...prevState.list.slice(index+1)]
  }))
}

  render(){
    // this.state.list
    //const {list} = this.state;
    const list = this.state.list;
    return(
      list.length !== 0 ?
       (
        <Container> 
        <Row className="App-header">
        <Col>1 Minute Average Price is : <Badge color="success">{this.state.avgDollar}</Badge>  </Col>
        <Col><NavLink href="https://www.pumo.io">Written by PuMo</NavLink></Col>
        </Row>
        <Row>
        <Col>#</Col>
        <Col>Price$</Col>
        <Col>Time</Col>
        </Row> 
        {this.renderTableData()}
            </Container>
       )
       :
                              (
                                  <Table>No Item</Table>
                              )

  )
  }
}

export default App;
