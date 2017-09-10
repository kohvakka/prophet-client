import React from 'react';
import ReactDOM from 'react-dom';
import { Table, Button } from 'react-bootstrap';
import Collapsible from 'react-collapsible';

import EventTable from '../util/tables/EventTable.js'
import LogInHandler from '../LogInHandler.js';
import Loading from '../util/Loading.js';

import config from '../../../config.json'

class Events extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.state = { name: undefined, loggedOut: false, ready: false, open: false }
    this.renderInfo = this.renderInfo.bind(this)
    this.getEvents = this.getEvents.bind(this)
 }

  renderInfo(info) {
    if(info !== undefined && info.usr !== undefined) {
      this.setState({
        name: info.usr.name,
        role: info.usr.role,
        loggedOut: true
      })
    }
    this.getEvents();
  }

getEvents() {
  var joinable = true
  if(this.state.role == "admin") joinable = false
  fetch(config.api + '/getEvents?onlyJoinable=' + joinable, {
  credentials: 'same-origin'
  })
  .then((result) => result.json())
  .then((result) => {
      this.data = result;
      this.setState({
        ready: true
      })
  });
}

  componentDidMount() {
    this.renderInfo();
    
  }

  componentWillReceiveProps(nextProps){
    this.renderInfo(nextProps.loggedIn);
  }

  render() {
    if(this.state.ready == false) return <Loading />
    return(
      <div>
        <LogInHandler renderInfo={this.renderInfo} name={this.state.name} />
        <div className="row">
        {this.state.role == "admin" &&
          <div className="col-md-2">
            <Button href="/#/newEvent" bsStyle="success">New</Button>
            <br/>
          </div>
        }
        </div>
        <div className="row">
         <div className="col-md-12">
          <Table condensed hover>
            <thead>
              <tr>
                <th>Name</th>
                <th>Time</th>
                <th>Place</th>
                <th>Expires</th>
                <th>Slots</th>
              </tr>
            </thead>
            <tbody>
            {this.data.map(function(data, index){
              return(
                <EventTable index={index} data={data} />
              );
            }.bind(this))}
           </tbody>
          </Table>
        </div>
        </div>
      </div>
    )
  }
}

export default Events;
